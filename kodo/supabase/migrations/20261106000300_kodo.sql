-- Kodo : la difficulté remplace les « pistes », les points remplacent l'altitude,
-- et les messages parlent de groupes. Les fonctions sont recréées à l'identique,
-- à part ces libellés et le nom de colonne.

alter table public.problems rename column slope to difficulty;
alter table public.problems rename column xp to points;
alter table public.problems drop constraint if exists problems_slope_check;
update public.problems set difficulty = case difficulty
  when 'verte' then 'facile' when 'bleue' then 'moyen' when 'rouge' then 'difficile' when 'noire' then 'expert'
  else difficulty end;
alter table public.problems add constraint problems_difficulty_check check (difficulty in ('facile', 'moyen', 'difficile', 'expert'));

create or replace function public.submit_result(
  p_problem text,
  p_language text,
  p_code text,
  p_verdict text,
  p_passed int,
  p_total int,
  p_time_ms int
)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
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
    'first_try', first_try,
    'daily', is_daily and new_solve,
    'xp', prof.xp,
    'solved_count', prof.solved_count,
    'streak', case when prof.last_streak_day >= today - 1 then prof.current_streak else 0 end
  );
end;
$$;

create or replace function public.create_group(p_name text, p_kind text)
returns public.groups
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
  g public.groups%rowtype;
  owned int;
begin
  if uid is null then
    raise exception 'Connecte-toi pour créer un groupe.' using errcode = '42501';
  end if;
  select count(*) into owned from public.groups where owner_id = uid;
  if owned >= 30 then
    raise exception 'Tu as déjà créé 30 groupes.' using errcode = '54000';
  end if;
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.groups where join_code = code);
  end loop;
  insert into public.groups (name, kind, join_code, owner_id)
  values (btrim(p_name), p_kind, code, uid)
  returning * into g;
  insert into public.group_members (group_id, user_id, role) values (g.id, uid, 'encadrant');
  return g;
end;
$$;

create or replace function public.join_group(p_code text)
returns public.groups
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  g public.groups%rowtype;
  memberships int;
begin
  if uid is null then
    raise exception 'Connecte-toi pour rejoindre un groupe.' using errcode = '42501';
  end if;
  select * into g from public.groups where join_code = upper(btrim(p_code));
  if not found then
    raise exception 'Aucun groupe ne correspond au code %. Vérifie-le auprès de la personne qui te l''a donné.', upper(btrim(p_code)) using errcode = 'P0002';
  end if;
  select count(*) into memberships from public.group_members where user_id = uid;
  if memberships >= 30 and not exists (select 1 from public.group_members where group_id = g.id and user_id = uid) then
    raise exception 'Tu fais déjà partie de 30 groupes.' using errcode = '54000';
  end if;
  insert into public.group_members (group_id, user_id) values (g.id, uid)
  on conflict do nothing;
  return g;
end;
$$;

create or replace function public.delete_my_account()
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then
    raise exception 'Connecte-toi pour supprimer ton compte.' using errcode = '42501';
  end if;
  if exists (
    select 1 from public.groups g
    where g.owner_id = uid
      and exists (select 1 from public.group_members m where m.group_id = g.id and m.user_id <> uid)
  ) then
    raise exception 'Tu as créé un groupe qui a encore des membres. Supprime-le d''abord (page du groupe, onglet Membres).' using errcode = '55000';
  end if;
  delete from auth.users where id = uid;
end;
$$;
