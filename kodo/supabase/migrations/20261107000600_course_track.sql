-- Parcours et problèmes ouverts.
--   * problems.track : 'course' (parcours, niveaux p1 à p6) ou 'open' (problèmes ouverts, n1 à n4) ;
--   * le défi du jour est tiré parmi les problèmes ouverts ;
--   * bonus de chapitre : réussir le dernier exercice d'un chapitre du parcours rapporte la moitié
--     des points du chapitre, une seule fois (table chapter_bonuses), compté aussi dans la semaine.

alter table public.problems add column if not exists track text not null default 'open' check (track in ('course', 'open'));
alter table public.problems drop constraint if exists problems_level_check;
alter table public.problems add constraint problems_level_check
  check (level in ('n1', 'n2', 'n3', 'n4', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6'));
create index if not exists problems_chapter_idx on public.problems (chapter, track);

create table if not exists public.chapter_bonuses (
  user_id uuid not null references public.profiles (id) on delete cascade,
  chapter text not null,
  xp integer not null check (xp > 0),
  awarded_at timestamptz not null default now(),
  primary key (user_id, chapter)
);
create index if not exists chapter_bonuses_awarded_idx on public.chapter_bonuses (awarded_at);
alter table public.chapter_bonuses enable row level security;
drop policy if exists "Les bonus de chapitre sont publics" on public.chapter_bonuses;
create policy "Les bonus de chapitre sont publics" on public.chapter_bonuses
  for select to anon, authenticated using (true);
grant select on public.chapter_bonuses to anon, authenticated;

create or replace function public.daily_problems(p_day date default null)
returns table (level text, problem_id text)
language sql stable set search_path = ''
as $$
  with d as (select coalesce(p_day, (now() at time zone 'Europe/Paris')::date) as day)
  select distinct on (p.level) p.level, p.id
  from public.problems p, d
  where p.track = 'open'
  order by p.level, md5(p.id || ':' || d.day::text);
$$;

CREATE OR REPLACE FUNCTION public.submit_result(p_problem text, p_language text, p_code text, p_verdict text, p_passed integer, p_total integer, p_time_ms integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  uid uuid := (select auth.uid());
  today date := (now() at time zone 'Europe/Paris')::date;
  prob public.problems%rowtype;
  recent int;
  already boolean;
  earlier int;
  is_daily boolean := false;
  first_try boolean := false;
  gain int := 0;
  new_solve boolean := false;
  prof public.profiles%rowtype;
  bonus int := 0;
begin
  if uid is null then
    raise exception 'Connecte-toi pour enregistrer tes soumissions.' using errcode = '42501';
  end if;

  select * into prob from public.problems where id = p_problem;
  if not found then
    raise exception 'Problème inconnu : %', p_problem using errcode = '22023';
  end if;
  if p_verdict = 'accepted' and (p_total < 1 or p_passed <> p_total) then
    raise exception 'Verdict incohérent' using errcode = '22023';
  end if;

  select count(*) into recent from public.submissions
  where user_id = uid and created_at > now() - interval '1 minute';
  if recent >= 20 then
    raise exception 'Trop de soumissions en une minute. Attends un peu avant de recommencer.' using errcode = '54000';
  end if;

  select count(*) into earlier from public.submissions where user_id = uid and problem_id = p_problem;

  insert into public.submissions (user_id, problem_id, language, code, verdict, passed, total, time_ms)
  values (uid, p_problem, p_language, p_code, p_verdict, p_passed, p_total, p_time_ms);

  insert into public.activity as a (user_id, day, submissions) values (uid, today, 1)
  on conflict (user_id, day) do update set submissions = a.submissions + 1;

  if p_verdict = 'accepted' then
    select exists (select 1 from public.solves where user_id = uid and problem_id = p_problem) into already;
    select exists (select 1 from public.daily_problems(today) d where d.problem_id = p_problem) into is_daily;

    if not already then
      new_solve := true;
      first_try := earlier = 0;
      gain := prob.points
        + case when first_try then prob.points / 5 else 0 end
        + case when is_daily then prob.points / 2 else 0 end;
      insert into public.solves (user_id, problem_id, xp, first_try, daily, language)
      values (uid, p_problem, gain, first_try, is_daily, p_language);
      update public.profiles set xp = xp + gain, solved_count = solved_count + 1 where id = uid;
      update public.activity set solves = solves + 1 where user_id = uid and day = today;

      -- Parcours : le dernier exercice d'un chapitre rapporte en plus la moitié des points du chapitre.
      if prob.track = 'course'
         and not exists (select 1 from public.chapter_bonuses b where b.user_id = uid and b.chapter = prob.chapter)
         and not exists (
           select 1 from public.problems p
           where p.chapter = prob.chapter and p.track = 'course'
             and not exists (select 1 from public.solves s where s.user_id = uid and s.problem_id = p.id)
         ) then
        select coalesce(sum(p.points), 0) / 2 into bonus from public.problems p where p.chapter = prob.chapter and p.track = 'course';
        if bonus > 0 then
          insert into public.chapter_bonuses (user_id, chapter, xp) values (uid, prob.chapter, bonus);
          update public.profiles set xp = xp + bonus where id = uid;
        end if;
      end if;
    end if;

    -- La série avance d'un jour avec une nouvelle réussite ou le défi du jour.
    if new_solve or is_daily then
      update public.profiles set
        current_streak = case
          when last_streak_day = today then current_streak
          when last_streak_day = today - 1 then current_streak + 1
          else 1 end,
        last_streak_day = today
      where id = uid;
      update public.profiles set best_streak = greatest(best_streak, current_streak) where id = uid;
    end if;
  end if;

  select * into prof from public.profiles where id = uid;
  return jsonb_build_object(
    'new_solve', new_solve,
    'xp_gain', gain,
    'chapter_bonus', bonus,
    'first_try', first_try,
    'daily', is_daily and new_solve,
    'xp', prof.xp,
    'solved_count', prof.solved_count,
    'streak', case when prof.last_streak_day >= today - 1 then prof.current_streak else 0 end
  );
end;
$function$;

CREATE OR REPLACE FUNCTION public.leaderboard(p_period text DEFAULT 'all'::text, p_group uuid DEFAULT NULL::uuid, p_limit integer DEFAULT 50)
 RETURNS TABLE(rank bigint, user_id uuid, username text, display_name text, school text, avatar text, staff text, xp bigint, total_xp bigint, solved bigint, streak integer, is_me boolean)
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  with week_start as (
    select (date_trunc('week', now() at time zone 'Europe/Paris') at time zone 'Europe/Paris') as ts
  ),
  pool as (
    select p.* from public.profiles p
    where p_group is null
       or exists (select 1 from public.group_members m where m.group_id = p_group and m.user_id = p.id)
  ),
  scores as (
    select
      p.id, p.username, p.display_name, p.school, p.avatar, p.staff,
      case when p_period = 'week'
        then coalesce((select sum(s.xp) from public.solves s, week_start w where s.user_id = p.id and s.solved_at >= w.ts), 0)
           + coalesce((select sum(b.xp) from public.chapter_bonuses b, week_start w where b.user_id = p.id and b.awarded_at >= w.ts), 0)
        else p.xp end::bigint as xp,
      p.xp::bigint as total_xp,
      case when p_period = 'week'
        then (select count(*) from public.solves s, week_start w where s.user_id = p.id and s.solved_at >= w.ts)
        else p.solved_count end::bigint as solved,
      case when p.last_streak_day >= (now() at time zone 'Europe/Paris')::date - 1 then p.current_streak else 0 end as streak
    from pool p
  ),
  ranked as (
    select rank() over (order by s.xp desc) as rank, s.*
    from scores s
    where p_period <> 'week' or s.xp > 0 or p_group is not null
  )
  select r.rank, r.id, r.username, r.display_name, r.school, r.avatar, r.staff, r.xp, r.total_xp, r.solved, r.streak,
         r.id = (select auth.uid()) as is_me
  from ranked r
  where r.rank <= least(greatest(p_limit, 1), 200) or r.id = (select auth.uid())
  order by r.rank, r.username;
$function$;
