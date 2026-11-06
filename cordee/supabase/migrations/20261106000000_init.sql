-- Cordée : schéma initial.
--
-- Principes :
--   * l'altitude (XP) n'est jamais envoyée par le client : submit_result la calcule à partir
--     de la table problems ;
--   * RLS sur toutes les tables, droits accordés explicitement (rien n'est exposé par défaut) ;
--   * les fonctions SECURITY DEFINER internes vivent dans le schéma « private » (non exposé),
--     celles qui servent d'API vérifient auth.uid() et ne sont exécutables que par authenticated.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

-- ------------------------------------------------------------------ Problèmes

create table public.problems (
  id text primary key,
  chapter text not null,
  level text not null check (level in ('n1', 'n2', 'n3', 'n4')),
  slope text not null check (slope in ('verte', 'bleue', 'rouge', 'noire')),
  xp integer not null check (xp > 0),
  title text not null
);
alter table public.problems enable row level security;
create policy "Les problèmes sont publics" on public.problems
  for select to anon, authenticated using (true);

-- ------------------------------------------------------------------ Profils

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,20}$'),
  display_name text not null check (char_length(display_name) between 1 and 40),
  school text check (char_length(school) <= 80),
  preferred_language text not null default 'python' check (preferred_language in ('python', 'cpp')),
  xp integer not null default 0,
  solved_count integer not null default 0,
  current_streak integer not null default 0,
  best_streak integer not null default 0,
  last_streak_day date,
  created_at timestamptz not null default now()
);
create index profiles_xp_idx on public.profiles (xp desc, solved_count desc);
alter table public.profiles enable row level security;
create policy "Les profils sont publics" on public.profiles
  for select to anon, authenticated using (true);
create policy "Chacun modifie son profil" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- ------------------------------------------------------------------ Soumissions

create table public.submissions (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  problem_id text not null references public.problems (id) on delete cascade,
  language text not null check (language in ('python', 'cpp')),
  code text not null check (octet_length(code) <= 65536),
  verdict text not null check (verdict in ('accepted', 'wrong_answer', 'time_limit', 'runtime_error', 'compile_error')),
  passed smallint not null check (passed >= 0),
  total smallint not null check (total >= 0 and passed <= total),
  time_ms integer check (time_ms >= 0),
  created_at timestamptz not null default now()
);
create index submissions_user_problem_idx on public.submissions (user_id, problem_id, created_at desc);
create index submissions_user_created_idx on public.submissions (user_id, created_at desc);
create index submissions_problem_idx on public.submissions (problem_id);
alter table public.submissions enable row level security;

-- ------------------------------------------------------------------ Problèmes résolus

create table public.solves (
  user_id uuid not null references public.profiles (id) on delete cascade,
  problem_id text not null references public.problems (id) on delete cascade,
  solved_at timestamptz not null default now(),
  xp integer not null,
  first_try boolean not null,
  daily boolean not null default false,
  language text not null check (language in ('python', 'cpp')),
  primary key (user_id, problem_id)
);
create index solves_problem_idx on public.solves (problem_id);
create index solves_solved_at_idx on public.solves (solved_at);
alter table public.solves enable row level security;
create policy "Les réussites sont publiques" on public.solves
  for select to anon, authenticated using (true);

-- ------------------------------------------------------------------ Activité (calendrier)

create table public.activity (
  user_id uuid not null references public.profiles (id) on delete cascade,
  day date not null,
  submissions integer not null default 0,
  solves integer not null default 0,
  primary key (user_id, day)
);
alter table public.activity enable row level security;
create policy "L'activité est publique" on public.activity
  for select to anon, authenticated using (true);

-- ------------------------------------------------------------------ Cordées (groupes)

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 60),
  kind text not null check (kind in ('classe', 'etablissement', 'amis')),
  join_code text not null unique,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index groups_owner_idx on public.groups (owner_id);

create table public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'membre' check (role in ('encadrant', 'membre')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index group_members_user_idx on public.group_members (user_id);

alter table public.groups enable row level security;
alter table public.group_members enable row level security;

-- Fonctions d'aide pour les politiques (SECURITY DEFINER pour éviter la récursion RLS
-- sur group_members). Elles ne lisent que les appartenances de l'utilisateur courant.
create or replace function private.is_member(gid uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.group_members m
    where m.group_id = gid and m.user_id = (select auth.uid())
  );
$$;

create or replace function private.is_encadrant(gid uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.group_members m
    where m.group_id = gid and m.user_id = (select auth.uid()) and m.role = 'encadrant'
  );
$$;

-- Vrai si l'utilisateur courant encadre une cordée dont « student » est membre.
create or replace function private.supervises(student uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.group_members t
    join public.group_members s on s.group_id = t.group_id
    where t.user_id = (select auth.uid()) and t.role = 'encadrant' and s.user_id = student
  );
$$;

revoke all on function private.is_member(uuid), private.is_encadrant(uuid), private.supervises(uuid) from public;
grant execute on function private.is_member(uuid), private.is_encadrant(uuid), private.supervises(uuid) to authenticated;

create policy "Les membres voient leur cordée" on public.groups
  for select to authenticated using ((select private.is_member(id)));
create policy "Le créateur renomme sa cordée" on public.groups
  for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
create policy "Le créateur supprime sa cordée" on public.groups
  for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "Les membres voient les autres membres" on public.group_members
  for select to authenticated using ((select private.is_member(group_id)));
create policy "On quitte une cordée, l'encadrant retire un membre" on public.group_members
  for delete to authenticated
  using ((select auth.uid()) = user_id or (select private.is_encadrant(group_id)));

create policy "Chacun voit ses soumissions, l'encadrant celles de ses élèves" on public.submissions
  for select to authenticated
  using ((select auth.uid()) = user_id or (select private.supervises(user_id)));

-- ------------------------------------------------------------------ Droits explicites

revoke all on public.problems, public.profiles, public.submissions, public.solves,
  public.activity, public.groups, public.group_members from anon, authenticated;

grant select on public.problems, public.profiles, public.solves, public.activity to anon, authenticated;
grant update (username, display_name, school, preferred_language) on public.profiles to authenticated;
grant select on public.submissions to authenticated;
grant select, delete on public.groups to authenticated;
grant update (name) on public.groups to authenticated;
grant select, delete on public.group_members to authenticated;

-- ------------------------------------------------------------------ Création du profil

create or replace function private.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  base text;
  candidate text;
  shown text;
  tries int := 0;
begin
  -- Les métadonnées servent seulement de valeurs initiales (jamais d'autorisation).
  base := lower(regexp_replace(coalesce(new.raw_user_meta_data ->> 'username', ''), '[^a-zA-Z0-9_]', '', 'g'));
  if char_length(base) < 3 then
    base := 'grimpeur' || substr(replace(new.id::text, '-', ''), 1, 6);
  end if;
  base := substr(base, 1, 16);
  candidate := base;
  while exists (select 1 from public.profiles where username = candidate) loop
    tries := tries + 1;
    candidate := base || (floor(random() * 9000) + 1000)::int::text;
    if tries > 20 then
      candidate := 'g' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    end if;
  end loop;
  shown := left(btrim(coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), candidate)), 40);
  insert into public.profiles (id, username, display_name)
  values (new.id, candidate, coalesce(nullif(shown, ''), candidate));
  return new;
end;
$$;
revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- ------------------------------------------------------------------ Défi du jour

-- Un problème par piste, choisi de façon déterministe à partir de la date (heure de Paris).
create or replace function public.daily_problems(p_day date default null)
returns table (level text, problem_id text)
language sql stable security invoker set search_path = ''
as $$
  with d as (select coalesce(p_day, (now() at time zone 'Europe/Paris')::date) as day)
  select distinct on (p.level) p.level, p.id
  from public.problems p, d
  order by p.level, md5(p.id || ':' || d.day::text);
$$;
grant execute on function public.daily_problems(date) to anon, authenticated;

-- ------------------------------------------------------------------ Soumettre un résultat

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
      gain := prob.xp
        + case when first_try then prob.xp / 5 else 0 end
        + case when is_daily then prob.xp / 2 else 0 end;
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
revoke all on function public.submit_result(text, text, text, text, int, int, int) from public, anon;
grant execute on function public.submit_result(text, text, text, text, int, int, int) to authenticated;

-- ------------------------------------------------------------------ Cordées : créer, rejoindre

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
    raise exception 'Connecte-toi pour créer une cordée.' using errcode = '42501';
  end if;
  select count(*) into owned from public.groups where owner_id = uid;
  if owned >= 30 then
    raise exception 'Tu as déjà créé 30 cordées.' using errcode = '54000';
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
revoke all on function public.create_group(text, text) from public, anon;
grant execute on function public.create_group(text, text) to authenticated;

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
    raise exception 'Connecte-toi pour rejoindre une cordée.' using errcode = '42501';
  end if;
  select * into g from public.groups where join_code = upper(btrim(p_code));
  if not found then
    raise exception 'Aucune cordée ne correspond au code %. Vérifie-le auprès de la personne qui te l''a donné.', upper(btrim(p_code)) using errcode = 'P0002';
  end if;
  select count(*) into memberships from public.group_members where user_id = uid;
  if memberships >= 30 and not exists (select 1 from public.group_members where group_id = g.id and user_id = uid) then
    raise exception 'Tu fais déjà partie de 30 cordées.' using errcode = '54000';
  end if;
  insert into public.group_members (group_id, user_id) values (g.id, uid)
  on conflict do nothing;
  return g;
end;
$$;
revoke all on function public.join_group(text) from public, anon;
grant execute on function public.join_group(text) to authenticated;

-- ------------------------------------------------------------------ Classements

-- Classement général (période 'all'), de la semaine ('week', depuis lundi, heure de Paris),
-- éventuellement limité à une cordée. SECURITY INVOKER : un non-membre d'une cordée
-- n'en voit pas les membres (RLS sur group_members), donc obtient un classement vide.
create or replace function public.leaderboard(p_period text default 'all', p_group uuid default null, p_limit int default 50)
returns table (
  rank bigint,
  user_id uuid,
  username text,
  display_name text,
  school text,
  xp bigint,
  solved bigint,
  streak int,
  is_me boolean
)
language sql stable security invoker set search_path = ''
as $$
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
      p.id, p.username, p.display_name, p.school,
      case when p_period = 'week'
        then coalesce((select sum(s.xp) from public.solves s, week_start w where s.user_id = p.id and s.solved_at >= w.ts), 0)
        else p.xp end::bigint as xp,
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
  select r.rank, r.id, r.username, r.display_name, r.school, r.xp, r.solved, r.streak,
         r.id = (select auth.uid()) as is_me
  from ranked r
  where r.rank <= least(greatest(p_limit, 1), 200) or r.id = (select auth.uid())
  order by r.rank, r.username;
$$;
grant execute on function public.leaderboard(text, uuid, int) to anon, authenticated;

-- Nombre d'élèves ayant réussi chaque problème (banque de problèmes).
create or replace function public.problem_stats()
returns table (problem_id text, solvers bigint)
language sql stable security invoker set search_path = ''
as $$
  select s.problem_id, count(*) from public.solves s group by s.problem_id;
$$;
grant execute on function public.problem_stats() to anon, authenticated;
