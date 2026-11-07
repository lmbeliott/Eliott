-- Indices payants : ouvrir un indice d'un problème non encore réussi réduit les points que
-- rapportera sa réussite (manque à gagner). Le nombre d'indices ouverts est stocké côté serveur,
-- pour qu'une déconnexion ou un autre appareil ne permette pas de récupérer les points.

create table if not exists public.hint_unlocks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  problem_id text not null references public.problems (id) on delete cascade,
  hints smallint not null check (hints between 1 and 10),
  updated_at timestamptz not null default now(),
  primary key (user_id, problem_id)
);
alter table public.hint_unlocks enable row level security;
drop policy if exists "hint_unlocks: lecture de ses propres indices" on public.hint_unlocks;
create policy "hint_unlocks: lecture de ses propres indices" on public.hint_unlocks
  for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.hint_unlocks from anon, authenticated;
grant select on public.hint_unlocks to authenticated;

-- Pourcentage retiré selon le nombre d'indices ouverts.
create or replace function private.hint_penalty(n int)
returns int
language sql immutable set search_path = ''
as $$ select case when n <= 0 then 0 when n = 1 then 15 when n = 2 then 35 else 60 end $$;

-- Ouvre l'indice p_index (1, 2, 3…) : les indices s'ouvrent dans l'ordre. Gratuit une fois le
-- problème réussi (rien n'est enregistré).
create or replace function public.unlock_hint(p_problem text, p_index int)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  cur int := 0;
begin
  if uid is null then
    raise exception 'Connexion requise.' using errcode = '42501';
  end if;
  if not exists (select 1 from public.problems where id = p_problem) then
    raise exception 'Problème inconnu : %', p_problem using errcode = '22023';
  end if;
  if p_index < 1 or p_index > 10 then
    raise exception 'Indice invalide' using errcode = '22023';
  end if;
  if exists (select 1 from public.solves where user_id = uid and problem_id = p_problem) then
    return jsonb_build_object('hints', p_index, 'penalty', 0, 'solved', true);
  end if;
  select coalesce(max(hints), 0) into cur from public.hint_unlocks where user_id = uid and problem_id = p_problem;
  if p_index > cur + 1 then
    raise exception 'Les indices s''ouvrent dans l''ordre.' using errcode = '22023';
  end if;
  if p_index > cur then
    insert into public.hint_unlocks as h (user_id, problem_id, hints) values (uid, p_problem, p_index)
    on conflict (user_id, problem_id) do update set hints = greatest(h.hints, excluded.hints), updated_at = now();
    cur := p_index;
  end if;
  return jsonb_build_object('hints', cur, 'penalty', private.hint_penalty(cur), 'solved', false);
end;
$$;
revoke all on function public.unlock_hint(text, int) from public, anon;
grant execute on function public.unlock_hint(text, int) to authenticated;

create or replace function public.submit_result(p_problem text, p_language text, p_code text, p_verdict text, p_passed integer, p_total integer, p_time_ms integer)
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
  hint_pct int := 0;
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
      -- Indices ouverts avant la réussite : 1 → −15 %, 2 → −35 %, 3 ou plus → −60 % sur ce problème.
      select coalesce(max(private.hint_penalty(h.hints)), 0) into hint_pct
      from public.hint_unlocks h where h.user_id = uid and h.problem_id = p_problem;
      gain := gain * (100 - hint_pct) / 100;
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
    'hint_penalty', hint_pct,
    'first_try', first_try,
    'daily', is_daily and new_solve,
    'xp', prof.xp,
    'solved_count', prof.solved_count,
    'streak', case when prof.last_streak_day >= today - 1 then prof.current_streak else 0 end
  );
end;
$function$;
