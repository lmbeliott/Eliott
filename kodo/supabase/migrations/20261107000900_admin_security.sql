-- Sécurité de production et administration.
--
-- 1. Droits des clients resserrés : les tables créées après coup avaient reçu tous les droits
--    par défaut (y compris TRUNCATE) ; la RLS bloquait déjà les écritures, on retire en plus
--    les droits inutiles et on change les droits par défaut des futures tables.
-- 2. Suspension de compte (bannissement) : connexion bloquée, sessions fermées, écritures
--    refusées, retrait des classements.
-- 3. Fonctions d'administration (SECURITY DEFINER) : réservées au rôle « admin » ET à une
--    session validée par double authentification (aal2). Chaque action est journalisée.
-- 4. Annonce affichée sur tout le site, modifiable par l'administration.

-- ------------------------------------------------------------------ 1. Droits

revoke all on public.chapter_bonuses, public.community_problems, public.community_references,
  public.community_reports, public.community_solves, public.community_votes from anon, authenticated;
grant select on public.chapter_bonuses to anon, authenticated;
grant select on public.community_problems to anon, authenticated;
grant insert (id, author_id, title, statement, input_spec, output_spec, constraints, difficulty, time_limit_ms, samples, tests, status)
  on public.community_problems to authenticated;
grant update (title, statement, input_spec, output_spec, constraints, difficulty, time_limit_ms, samples, tests, status)
  on public.community_problems to authenticated;
grant delete on public.community_problems to authenticated;
grant select, insert (problem_id, language, code, generator), update (language, code, generator)
  on public.community_references to authenticated;
grant select on public.community_votes to anon, authenticated;
grant insert (problem_id, user_id), delete on public.community_votes to authenticated;
grant select on public.community_solves to anon, authenticated;
grant insert (problem_id, user_id, language) on public.community_solves to authenticated;
grant select on public.community_reports to anon, authenticated;
grant insert (problem_id, user_id, reason, details) on public.community_reports to authenticated;

alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;

-- ------------------------------------------------------------------ 2. Suspension

alter table public.profiles add column if not exists banned_until timestamptz;

create table if not exists private.bans (
  user_id uuid primary key references auth.users (id) on delete cascade,
  until timestamptz not null,
  reason text not null check (char_length(reason) between 1 and 500),
  banned_by uuid references auth.users (id) on delete set null,
  banned_at timestamptz not null default now()
);
revoke all on private.bans from public, anon, authenticated;

create or replace function private.is_banned(uid uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles p where p.id = uid and p.banned_until > now())
$$;
revoke all on function private.is_banned(uuid) from public, anon;
grant execute on function private.is_banned(uuid) to authenticated;

-- Écritures directes refusées à un compte suspendu (politiques restrictives, combinées en ET).
drop policy if exists "Compte suspendu : pas de proposition" on public.community_problems;
create policy "Compte suspendu : pas de proposition" on public.community_problems
  as restrictive for insert to authenticated with check (not private.is_banned((select auth.uid())));
drop policy if exists "Compte suspendu : pas de modification" on public.community_problems;
create policy "Compte suspendu : pas de modification" on public.community_problems
  as restrictive for update to authenticated using (not private.is_banned((select auth.uid())));
drop policy if exists "Compte suspendu : pas de référence" on public.community_references;
create policy "Compte suspendu : pas de référence" on public.community_references
  as restrictive for insert to authenticated with check (not private.is_banned((select auth.uid())));
drop policy if exists "Compte suspendu : pas de vote" on public.community_votes;
create policy "Compte suspendu : pas de vote" on public.community_votes
  as restrictive for insert to authenticated with check (not private.is_banned((select auth.uid())));
drop policy if exists "Compte suspendu : pas de signalement" on public.community_reports;
create policy "Compte suspendu : pas de signalement" on public.community_reports
  as restrictive for insert to authenticated with check (not private.is_banned((select auth.uid())));
drop policy if exists "Compte suspendu : pas de réussite" on public.community_solves;
create policy "Compte suspendu : pas de réussite" on public.community_solves
  as restrictive for insert to authenticated with check (not private.is_banned((select auth.uid())));
drop policy if exists "Compte suspendu : profil figé" on public.profiles;
create policy "Compte suspendu : profil figé" on public.profiles
  as restrictive for update to authenticated using (not private.is_banned((select auth.uid())));
drop policy if exists "Compte suspendu : groupe figé" on public.groups;
create policy "Compte suspendu : groupe figé" on public.groups
  as restrictive for update to authenticated using (not private.is_banned((select auth.uid())));

-- Vérification de suspension dans les fonctions d'écriture.

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
  if private.is_banned(uid) then
    raise exception 'Compte suspendu.' using errcode = '42501', hint = 'banned';
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

create or replace function public.create_group(p_name text, p_kind text)
 RETURNS groups
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
  if private.is_banned(uid) then
    raise exception 'Compte suspendu.' using errcode = '42501', hint = 'banned';
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
$function$;

create or replace function public.join_group(p_code text)
 RETURNS groups
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  uid uuid := (select auth.uid());
  g public.groups%rowtype;
  memberships int;
begin
  if uid is null then
    raise exception 'Connecte-toi pour rejoindre un groupe.' using errcode = '42501';
  end if;
  if private.is_banned(uid) then
    raise exception 'Compte suspendu.' using errcode = '42501', hint = 'banned';
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
$function$;

-- Classement : comptes suspendus retirés.
create or replace function public.leaderboard(p_period text DEFAULT 'all'::text, p_group uuid DEFAULT NULL::uuid, p_limit integer DEFAULT 50)
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
    where (p.banned_until is null or p.banned_until <= now())
      and (p_group is null
       or exists (select 1 from public.group_members m where m.group_id = p_group and m.user_id = p.id))
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


-- ------------------------------------------------------------------ 3. Administration

create table if not exists private.admin_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  admin_id uuid references auth.users (id) on delete set null,
  action text not null,
  target_user uuid,
  target text,
  details jsonb
);
create index if not exists admin_log_at_idx on private.admin_log (at desc);
revoke all on private.admin_log from public, anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.staff = 'admin')
$$;
revoke all on function private.is_admin() from public, anon, authenticated;

-- Contrôle commun : rôle admin + session en double authentification. Renvoie l'id de l'admin.
create or replace function private.require_admin()
returns uuid
language plpgsql stable security definer set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null or not private.is_admin() then
    raise exception 'Réservé à l''administration.' using errcode = '42501';
  end if;
  if coalesce((select auth.jwt()) ->> 'aal', '') <> 'aal2' then
    raise exception 'Double authentification requise.' using errcode = '42501', hint = 'mfa_required';
  end if;
  return uid;
end;
$$;
revoke all on function private.require_admin() from public, anon, authenticated;

create or replace function private.admin_record(p_admin uuid, p_action text, p_user uuid, p_target text, p_details jsonb)
returns void
language sql security definer set search_path = ''
as $$
  insert into private.admin_log (admin_id, action, target_user, target, details)
  values (p_admin, p_action, p_user, p_target, p_details)
$$;
revoke all on function private.admin_record(uuid, text, uuid, text, jsonb) from public, anon, authenticated;

-- Cible modifiable : existe, n'est pas un administrateur, n'est pas soi-même.
create or replace function private.admin_target(p_admin uuid, p_id uuid)
returns public.profiles
language plpgsql stable security definer set search_path = ''
as $$
declare
  t public.profiles%rowtype;
begin
  select * into t from public.profiles where id = p_id;
  if not found then
    raise exception 'Compte introuvable.' using errcode = 'P0002';
  end if;
  if t.id = p_admin or t.staff = 'admin' then
    raise exception 'Action impossible sur un compte administrateur.' using errcode = '42501';
  end if;
  return t;
end;
$$;
revoke all on function private.admin_target(uuid, uuid) from public, anon, authenticated;

-- Vue d'ensemble
create or replace function public.admin_overview()
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  today date := (now() at time zone 'Europe/Paris')::date;
  r jsonb;
begin
  perform private.require_admin();
  select jsonb_build_object(
    'users', (select count(*) from public.profiles),
    'users_7d', (select count(*) from public.profiles where created_at > now() - interval '7 days'),
    'active_today', (select count(*) from public.activity where day = today),
    'active_7d', (select count(distinct user_id) from public.activity where day > today - 7),
    'submissions_24h', (select count(*) from public.submissions where created_at > now() - interval '24 hours'),
    'solves_24h', (select count(*) from public.solves where solved_at > now() - interval '24 hours'),
    'solves', (select count(*) from public.solves),
    'banned', (select count(*) from public.profiles where banned_until > now()),
    'moderators', (select count(*) from private.moderators),
    'groups', (select count(*) from public.groups),
    'community_published', (select count(*) from public.community_problems where status = 'published'),
    'community_hidden', (select count(*) from public.community_problems where status = 'hidden'),
    'reports', (select count(*) from public.community_reports r join public.community_problems c on c.id = r.problem_id where c.status <> 'withdrawn'),
    'days', (
      select coalesce(jsonb_agg(jsonb_build_object('day', d.day, 'signups', d.signups, 'active', d.active, 'submissions', d.subs) order by d.day), '[]'::jsonb)
      from (
        select g.day::date as day,
          (select count(*) from public.profiles p where (p.created_at at time zone 'Europe/Paris')::date = g.day::date) as signups,
          (select count(*) from public.activity a where a.day = g.day::date) as active,
          (select coalesce(sum(a.submissions), 0) from public.activity a where a.day = g.day::date) as subs
        from generate_series(today - 13, today, interval '1 day') g(day)
      ) d
    )
  ) into r;
  return r;
end;
$$;

-- Liste des comptes
create or replace function public.admin_users(p_search text default '', p_filter text default 'all', p_limit int default 50, p_offset int default 0)
returns table (
  id uuid, username text, display_name text, email text, created_at timestamptz, last_sign_in_at timestamptz,
  xp int, solved_count int, staff text, moderator boolean, banned_until timestamptz, total bigint
)
language plpgsql stable security definer set search_path = ''
as $$
declare
  q text := lower(btrim(coalesce(p_search, '')));
begin
  perform private.require_admin();
  return query
  select p.id, p.username, p.display_name, u.email::text, p.created_at, u.last_sign_in_at,
         p.xp, p.solved_count, p.staff,
         exists (select 1 from private.moderators m where m.user_id = p.id),
         p.banned_until,
         count(*) over ()
  from public.profiles p
  join auth.users u on u.id = p.id
  where (q = '' or p.username like '%' || q || '%' or lower(p.display_name) like '%' || q || '%' or lower(u.email) like '%' || q || '%')
    and (p_filter = 'all'
         or (p_filter = 'staff' and (p.staff is not null or exists (select 1 from private.moderators m where m.user_id = p.id)))
         or (p_filter = 'banned' and p.banned_until > now())
         or (p_filter = 'recent' and p.created_at > now() - interval '7 days'))
  order by case when p_filter = 'recent' then p.created_at end desc nulls last, p.xp desc, p.username
  limit least(greatest(p_limit, 1), 200) offset greatest(p_offset, 0);
end;
$$;

-- Fiche d'un compte
create or replace function public.admin_user(p_id uuid)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  r jsonb;
begin
  perform private.require_admin();
  select jsonb_build_object(
    'id', p.id, 'username', p.username, 'display_name', p.display_name, 'school', p.school, 'avatar', p.avatar,
    'staff', p.staff, 'xp', p.xp, 'solved_count', p.solved_count, 'best_streak', p.best_streak,
    'created_at', p.created_at, 'banned_until', p.banned_until,
    'email', u.email, 'email_confirmed_at', u.email_confirmed_at, 'last_sign_in_at', u.last_sign_in_at,
    'moderator', exists (select 1 from private.moderators m where m.user_id = p.id),
    'mfa', (select count(*) from auth.mfa_factors f where f.user_id = p.id and f.status = 'verified'),
    'ban', (select jsonb_build_object('until', b.until, 'reason', b.reason, 'at', b.banned_at) from private.bans b where b.user_id = p.id),
    'hints', (select coalesce(sum(h.hints), 0) from public.hint_unlocks h where h.user_id = p.id),
    'submissions_total', (select count(*) from public.submissions s where s.user_id = p.id),
    'submissions', (
      select coalesce(jsonb_agg(x order by x.created_at desc), '[]'::jsonb) from (
        select s.id, s.problem_id, s.language, s.verdict, s.passed, s.total, s.created_at
        from public.submissions s where s.user_id = p.id order by s.created_at desc limit 20
      ) x
    ),
    'groups', (
      select coalesce(jsonb_agg(jsonb_build_object('id', g.id, 'name', g.name, 'owner', g.owner_id = p.id)), '[]'::jsonb)
      from public.groups g where g.owner_id = p.id or exists (select 1 from public.group_members m where m.group_id = g.id and m.user_id = p.id)
    ),
    'community', (
      select coalesce(jsonb_agg(jsonb_build_object('id', c.id, 'title', c.title, 'status', c.status) order by c.created_at desc), '[]'::jsonb)
      from public.community_problems c where c.author_id = p.id
    )
  ) into r
  from public.profiles p join auth.users u on u.id = p.id
  where p.id = p_id;
  if r is null then
    raise exception 'Compte introuvable.' using errcode = 'P0002';
  end if;
  return r;
end;
$$;

-- Code d'une soumission (lecture seule, journalisée)
create or replace function public.admin_submission_code(p_id bigint)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.require_admin();
  s public.submissions%rowtype;
begin
  select * into s from public.submissions where id = p_id;
  if not found then
    raise exception 'Soumission introuvable.' using errcode = 'P0002';
  end if;
  perform private.admin_record(me, 'lecture_code', s.user_id, s.problem_id, jsonb_build_object('submission', p_id));
  return s.code;
end;
$$;

create or replace function public.admin_set_moderator(p_id uuid, p_on boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.require_admin();
  t public.profiles%rowtype := private.admin_target(me, p_id);
begin
  if p_on then
    insert into private.moderators (user_id) values (p_id) on conflict do nothing;
    update public.profiles set staff = 'moderateur' where id = p_id;
  else
    delete from private.moderators where user_id = p_id;
    update public.profiles set staff = null where id = p_id and staff = 'moderateur';
  end if;
  perform private.admin_record(me, case when p_on then 'moderateur_ajout' else 'moderateur_retrait' end, p_id, t.username, null);
end;
$$;

-- Suspension : p_days null = définitive. Ferme aussi toutes les sessions du compte.
create or replace function public.admin_ban(p_id uuid, p_days int, p_reason text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.require_admin();
  t public.profiles%rowtype := private.admin_target(me, p_id);
  until_ts timestamptz;
begin
  if p_days is not null and (p_days < 1 or p_days > 3650) then
    raise exception 'Durée invalide.' using errcode = '22023';
  end if;
  if char_length(btrim(coalesce(p_reason, ''))) = 0 then
    raise exception 'Motif requis.' using errcode = '22023';
  end if;
  until_ts := case when p_days is null then now() + interval '100 years' else now() + make_interval(days => p_days) end;
  insert into private.bans (user_id, until, reason, banned_by) values (p_id, until_ts, btrim(p_reason), me)
  on conflict (user_id) do update set until = excluded.until, reason = excluded.reason, banned_by = excluded.banned_by, banned_at = now();
  update public.profiles set banned_until = until_ts where id = p_id;
  update auth.users set banned_until = until_ts where id = p_id;
  delete from auth.sessions where user_id = p_id;
  perform private.admin_record(me, 'suspension', p_id, t.username, jsonb_build_object('jours', p_days, 'motif', btrim(p_reason)));
end;
$$;

create or replace function public.admin_unban(p_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.require_admin();
  t public.profiles%rowtype := private.admin_target(me, p_id);
begin
  delete from private.bans where user_id = p_id;
  update public.profiles set banned_until = null where id = p_id;
  update auth.users set banned_until = null where id = p_id;
  perform private.admin_record(me, 'levee_suspension', p_id, t.username, null);
end;
$$;

-- Renommer un compte (pseudo inapproprié) et/ou effacer nom affiché et établissement.
create or replace function public.admin_edit_profile(p_id uuid, p_username text, p_clear boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.require_admin();
  t public.profiles%rowtype := private.admin_target(me, p_id);
  new_name text := lower(btrim(coalesce(p_username, '')));
begin
  if new_name <> '' and new_name <> t.username then
    if exists (select 1 from public.profiles where username = new_name) then
      raise exception 'Ce pseudo est déjà pris.' using errcode = '23505';
    end if;
    update public.profiles set username = new_name where id = p_id;
  end if;
  if p_clear then
    update public.profiles set display_name = coalesce(nullif(new_name, ''), t.username), school = null, avatar = null where id = p_id;
  end if;
  perform private.admin_record(me, 'profil_modifie', p_id, t.username, jsonb_build_object('nouveau_pseudo', nullif(new_name, ''), 'efface', p_clear));
end;
$$;

-- Remise à zéro de la progression (triche) : réussites, bonus, indices et points.
create or replace function public.admin_reset_progress(p_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.require_admin();
  t public.profiles%rowtype := private.admin_target(me, p_id);
begin
  delete from public.solves where user_id = p_id;
  delete from public.chapter_bonuses where user_id = p_id;
  delete from public.hint_unlocks where user_id = p_id;
  update public.profiles set xp = 0, solved_count = 0, current_streak = 0, best_streak = 0, last_streak_day = null where id = p_id;
  perform private.admin_record(me, 'progression_remise_a_zero', p_id, t.username, jsonb_build_object('xp', t.xp, 'reussites', t.solved_count));
end;
$$;

create or replace function public.admin_delete_user(p_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.require_admin();
  t public.profiles%rowtype := private.admin_target(me, p_id);
begin
  perform private.admin_record(me, 'compte_supprime', p_id, t.username, jsonb_build_object('xp', t.xp));
  delete from public.groups where owner_id = p_id;
  delete from auth.users where id = p_id;
end;
$$;

-- Communauté
create or replace function public.admin_community(p_status text default null)
returns table (id uuid, title text, author text, status text, created_at timestamptz, reports bigint, solves bigint, votes bigint)
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform private.require_admin();
  return query
  select c.id, c.title, p.username, c.status, c.created_at,
         (select count(*) from public.community_reports r where r.problem_id = c.id),
         (select count(*) from public.community_solves s where s.problem_id = c.id),
         (select count(*) from public.community_votes v where v.problem_id = c.id)
  from public.community_problems c join public.profiles p on p.id = c.author_id
  where p_status is null or c.status = p_status
  order by 6 desc, c.created_at desc
  limit 300;
end;
$$;

create or replace function public.admin_reports()
returns table (problem_id uuid, title text, status text, reporter text, reason text, details text, created_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform private.require_admin();
  return query
  select r.problem_id, c.title, c.status, p.username, r.reason, r.details, r.created_at
  from public.community_reports r
  join public.community_problems c on c.id = r.problem_id
  join public.profiles p on p.id = r.user_id
  order by r.created_at desc
  limit 300;
end;
$$;

create or replace function public.admin_set_community_status(p_id uuid, p_status text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.require_admin();
  title text;
begin
  if p_status not in ('published', 'hidden') then
    raise exception 'Statut invalide.' using errcode = '22023';
  end if;
  update public.community_problems set status = p_status where id = p_id returning community_problems.title into title;
  if title is null then
    raise exception 'Problème introuvable.' using errcode = 'P0002';
  end if;
  if p_status = 'published' then
    delete from public.community_reports where problem_id = p_id;
  end if;
  perform private.admin_record(me, 'communaute_' || p_status, null, title, jsonb_build_object('id', p_id));
end;
$$;

create or replace function public.admin_dismiss_reports(p_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.require_admin();
begin
  delete from public.community_reports where problem_id = p_id;
  perform private.admin_record(me, 'signalements_classes', null, (select title from public.community_problems where id = p_id), jsonb_build_object('id', p_id));
end;
$$;

create or replace function public.admin_delete_community(p_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.require_admin();
  title text;
begin
  delete from public.community_problems where id = p_id returning community_problems.title into title;
  if title is null then
    raise exception 'Problème introuvable.' using errcode = 'P0002';
  end if;
  perform private.admin_record(me, 'communaute_supprime', null, title, jsonb_build_object('id', p_id));
end;
$$;

-- Groupes
create or replace function public.admin_groups(p_search text default '')
returns table (id uuid, name text, kind text, owner text, members bigint, created_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
declare
  q text := lower(btrim(coalesce(p_search, '')));
begin
  perform private.require_admin();
  return query
  select g.id, g.name, g.kind, p.username, (select count(*) from public.group_members m where m.group_id = g.id), g.created_at
  from public.groups g join public.profiles p on p.id = g.owner_id
  where q = '' or lower(g.name) like '%' || q || '%' or p.username like '%' || q || '%'
  order by g.created_at desc
  limit 300;
end;
$$;

create or replace function public.admin_delete_group(p_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.require_admin();
  gname text;
begin
  delete from public.groups where id = p_id returning name into gname;
  if gname is null then
    raise exception 'Groupe introuvable.' using errcode = 'P0002';
  end if;
  perform private.admin_record(me, 'groupe_supprime', null, gname, jsonb_build_object('id', p_id));
end;
$$;

-- Journal
create or replace function public.admin_log(p_limit int default 100)
returns table (at timestamptz, admin text, action text, target_user text, target text, details jsonb)
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform private.require_admin();
  return query
  select l.at, a.username, l.action, t.username, l.target, l.details
  from private.admin_log l
  left join public.profiles a on a.id = l.admin_id
  left join public.profiles t on t.id = l.target_user
  order by l.at desc
  limit least(greatest(p_limit, 1), 500);
end;
$$;

-- ------------------------------------------------------------------ 4. Annonce

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
drop policy if exists "Réglages publics" on public.site_settings;
create policy "Réglages publics" on public.site_settings for select to anon, authenticated using (true);
revoke all on public.site_settings from anon, authenticated;
grant select on public.site_settings to anon, authenticated;

create or replace function public.admin_set_announcement(p_text text, p_tone text default 'info')
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  me uuid := private.require_admin();
  txt text := btrim(coalesce(p_text, ''));
begin
  if char_length(txt) > 300 then
    raise exception 'Annonce trop longue (300 caractères au plus).' using errcode = '22023';
  end if;
  if p_tone not in ('info', 'warn') then
    raise exception 'Ton invalide.' using errcode = '22023';
  end if;
  if txt = '' then
    delete from public.site_settings where key = 'announcement';
  else
    insert into public.site_settings (key, value) values ('announcement', jsonb_build_object('text', txt, 'tone', p_tone, 'id', extract(epoch from now())::bigint))
    on conflict (key) do update set value = excluded.value, updated_at = now();
  end if;
  perform private.admin_record(me, 'annonce', null, nullif(txt, ''), jsonb_build_object('ton', p_tone));
end;
$$;

-- Droits d'exécution : jamais anon ; authenticated passe par require_admin().
do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname like 'admin\_%'
  loop
    execute format('revoke all on function %s from public, anon', f.sig);
    execute format('grant execute on function %s to authenticated', f.sig);
  end loop;
end;
$$;
