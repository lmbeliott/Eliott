-- Problèmes proposés par la communauté.
--
-- Principes :
--   * un problème est publié dès qu'il est proposé, mais seulement après que la solution
--     de référence de l'auteur a produit les sorties de tous les tests (dans son navigateur) ;
--   * les sorties attendues des tests cachés sont stockées sous forme d'empreinte SHA-256,
--     comme pour les problèmes officiels ; la solution de référence reste privée ;
--   * ces problèmes ne rapportent pas de points : réussir le sien ne fausse aucun classement ;
--   * trois signalements masquent un problème jusqu'à ce qu'un modérateur le rétablisse.

-- ------------------------------------------------------------------ Modérateurs

create table private.moderators (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);
revoke all on private.moderators from public, anon, authenticated;

create or replace function private.is_moderator()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from private.moderators m where m.user_id = (select auth.uid()))
$$;
revoke all on function private.is_moderator() from public, anon;
grant execute on function private.is_moderator() to authenticated;

create or replace function public.is_moderator()
returns boolean
language sql stable security invoker set search_path = ''
as $$
  select private.is_moderator()
$$;
revoke all on function public.is_moderator() from public, anon;
grant execute on function public.is_moderator() to authenticated;

-- ------------------------------------------------------------------ Validation des tests

-- Exemples : [{ "input": "…", "output": "…" }], tests cachés : [{ "input": "…", "hash": "<64 hex>" }]
create or replace function private.valid_samples(j jsonb)
returns boolean
language sql immutable set search_path = ''
as $$
  select jsonb_typeof(j) = 'array'
     and jsonb_array_length(j) between 1 and 5
     and not exists (
       select 1 from jsonb_array_elements(j) e
       where jsonb_typeof(e) <> 'object'
          or jsonb_typeof(e -> 'input') is distinct from 'string'
          or jsonb_typeof(e -> 'output') is distinct from 'string'
          or octet_length(e ->> 'input') > 4000
          or octet_length(e ->> 'output') > 4000
     )
$$;

create or replace function private.valid_tests(j jsonb)
returns boolean
language sql immutable set search_path = ''
as $$
  select jsonb_typeof(j) = 'array'
     and jsonb_array_length(j) between 3 and 50
     and not exists (
       select 1 from jsonb_array_elements(j) e
       where jsonb_typeof(e) <> 'object'
          or jsonb_typeof(e -> 'input') is distinct from 'string'
          or coalesce(e ->> 'hash', '') !~ '^[0-9a-f]{64}$'
     )
$$;

-- ------------------------------------------------------------------ Problèmes

create table public.community_problems (
  -- L'identifiant est choisi par le navigateur de l'auteur : il entre dans l'empreinte des tests.
  id uuid primary key,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 3 and 80),
  statement text not null check (char_length(statement) between 20 and 20000),
  input_spec text not null check (char_length(btrim(input_spec)) between 1 and 4000),
  output_spec text not null check (char_length(btrim(output_spec)) between 1 and 4000),
  constraints text check (char_length(constraints) <= 3000),
  difficulty text not null check (difficulty in ('facile', 'moyen', 'difficile', 'expert')),
  time_limit_ms integer not null default 1000 check (time_limit_ms in (1000, 2000, 3000)),
  samples jsonb not null check (private.valid_samples(samples)),
  tests jsonb not null check (private.valid_tests(tests)),
  status text not null default 'published' check (status in ('published', 'withdrawn', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_problems_size check (octet_length(samples::text) + octet_length(tests::text) <= 2200000)
);
create index community_problems_author_idx on public.community_problems (author_id);
create index community_problems_status_created_idx on public.community_problems (status, created_at desc);
alter table public.community_problems enable row level security;

create policy "Problèmes publiés visibles de tous" on public.community_problems
  for select to anon
  using (status = 'published');
create policy "Problèmes visibles : publiés, les siens, ou modérateur" on public.community_problems
  for select to authenticated
  using (status = 'published' or author_id = (select auth.uid()) or (select private.is_moderator()));
create policy "Chacun propose ses problèmes" on public.community_problems
  for insert to authenticated
  with check (author_id = (select auth.uid()) and status = 'published');
create policy "L'auteur modifie ses problèmes" on public.community_problems
  for update to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));
create policy "L'auteur supprime ses problèmes" on public.community_problems
  for delete to authenticated
  using (author_id = (select auth.uid()));

grant select on public.community_problems to anon, authenticated;
grant insert (id, author_id, title, statement, input_spec, output_spec, constraints, difficulty, time_limit_ms, samples, tests, status)
  on public.community_problems to authenticated;
grant update (title, statement, input_spec, output_spec, constraints, difficulty, time_limit_ms, samples, tests, status)
  on public.community_problems to authenticated;
grant delete on public.community_problems to authenticated;

-- Limite : 5 problèmes proposés par 24 heures ; l'auteur ne peut ni masquer ni démasquer.
-- Fonction exécutée avec les droits de l'appelant : les fonctions de modération (SECURITY DEFINER)
-- s'exécutent sous leur propriétaire et passent donc le contrôle, les requêtes des clients non.
create or replace function private.community_problems_guard()
returns trigger
language plpgsql security invoker set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if (select count(*) from public.community_problems
        where author_id = new.author_id and created_at > now() - interval '24 hours') >= 5 then
      raise exception 'Tu as déjà proposé 5 problèmes en 24 heures.' using errcode = 'P0001', hint = 'community_rate_limit';
    end if;
    new.created_at := now();
    new.updated_at := now();
    return new;
  end if;
  -- UPDATE
  if current_user in ('anon', 'authenticated') and not private.is_moderator() then
    if old.status = 'hidden' and new.status <> 'hidden' then
      raise exception 'Ce problème a été masqué par la modération.' using errcode = 'P0001', hint = 'community_hidden';
    end if;
    if new.status = 'hidden' and old.status <> 'hidden' then
      raise exception 'Seule la modération peut masquer un problème.' using errcode = 'P0001', hint = 'community_hidden';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
create trigger community_problems_guard
  before insert or update on public.community_problems
  for each row execute function private.community_problems_guard();

-- ------------------------------------------------------------------ Solution de référence (privée)

create table public.community_references (
  problem_id uuid primary key references public.community_problems (id) on delete cascade,
  language text not null check (language in ('python', 'cpp')),
  code text not null check (octet_length(code) <= 65536),
  generator text check (octet_length(generator) <= 65536)
);
alter table public.community_references enable row level security;

create or replace function private.is_community_author(pid uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.community_problems p where p.id = pid and p.author_id = (select auth.uid()))
$$;
revoke all on function private.is_community_author(uuid) from public, anon;
grant execute on function private.is_community_author(uuid) to authenticated;

create policy "L'auteur et la modération lisent la référence" on public.community_references
  for select to authenticated
  using ((select private.is_community_author(problem_id)) or (select private.is_moderator()));
create policy "L'auteur écrit sa référence" on public.community_references
  for insert to authenticated
  with check ((select private.is_community_author(problem_id)));
create policy "L'auteur modifie sa référence" on public.community_references
  for update to authenticated
  using ((select private.is_community_author(problem_id)))
  with check ((select private.is_community_author(problem_id)));
grant select, insert, update on public.community_references to authenticated;

-- ------------------------------------------------------------------ Votes « utile »

create table public.community_votes (
  problem_id uuid not null references public.community_problems (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (problem_id, user_id)
);
create index community_votes_user_idx on public.community_votes (user_id);
alter table public.community_votes enable row level security;
create policy "Les votes sont publics" on public.community_votes
  for select to anon, authenticated using (true);
create policy "Chacun vote pour les problèmes des autres" on public.community_votes
  for insert to authenticated
  with check (user_id = (select auth.uid()) and not (select private.is_community_author(problem_id)));
create policy "Chacun retire son vote" on public.community_votes
  for delete to authenticated
  using (user_id = (select auth.uid()));
grant select on public.community_votes to anon, authenticated;
grant insert (problem_id, user_id), delete on public.community_votes to authenticated;

-- ------------------------------------------------------------------ Réussites (sans points)

create table public.community_solves (
  problem_id uuid not null references public.community_problems (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  language text not null check (language in ('python', 'cpp')),
  solved_at timestamptz not null default now(),
  primary key (problem_id, user_id)
);
create index community_solves_user_idx on public.community_solves (user_id);
alter table public.community_solves enable row level security;
create policy "Les réussites communautaires sont publiques" on public.community_solves
  for select to anon, authenticated using (true);
create policy "Chacun enregistre ses réussites" on public.community_solves
  for insert to authenticated
  with check (user_id = (select auth.uid()));
grant select on public.community_solves to anon, authenticated;
grant insert (problem_id, user_id, language) on public.community_solves to authenticated;

-- ------------------------------------------------------------------ Signalements

create table public.community_reports (
  problem_id uuid not null references public.community_problems (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null check (reason in ('incorrect', 'copie', 'inapproprie', 'autre')),
  details text check (char_length(details) <= 500),
  created_at timestamptz not null default now(),
  primary key (problem_id, user_id)
);
create index community_reports_user_idx on public.community_reports (user_id);
alter table public.community_reports enable row level security;
create policy "Chacun voit ses signalements, la modération les voit tous" on public.community_reports
  for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_moderator()));
create policy "Chacun signale les problèmes des autres" on public.community_reports
  for insert to authenticated
  with check (user_id = (select auth.uid()) and not (select private.is_community_author(problem_id)));
grant select on public.community_reports to anon, authenticated;
grant insert (problem_id, user_id, reason, details) on public.community_reports to authenticated;

-- Trois signalements distincts masquent le problème.
create or replace function private.community_reports_hide()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if (select count(*) from public.community_reports where problem_id = new.problem_id) >= 3 then
    update public.community_problems set status = 'hidden' where id = new.problem_id and status = 'published';
  end if;
  return new;
end;
$$;
create trigger community_reports_hide
  after insert on public.community_reports
  for each row execute function private.community_reports_hide();

-- ------------------------------------------------------------------ Modération

create or replace function public.moderate_community_problem(p_id uuid, p_hide boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not private.is_moderator() then
    raise exception 'Réservé à la modération.' using errcode = '42501';
  end if;
  update public.community_problems
     set status = case when p_hide then 'hidden' else 'published' end
   where id = p_id;
  -- Rétabli : les signalements traités sont effacés pour repartir de zéro.
  if not p_hide then
    delete from public.community_reports where problem_id = p_id;
  end if;
end;
$$;
revoke all on function public.moderate_community_problem(uuid, boolean) from public, anon;
grant execute on function public.moderate_community_problem(uuid, boolean) to authenticated;

-- ------------------------------------------------------------------ Liste

create or replace function public.community_list()
returns table (
  id uuid,
  title text,
  difficulty text,
  status text,
  created_at timestamptz,
  author_id uuid,
  author_username text,
  author_name text,
  solves bigint,
  votes bigint,
  reports bigint
)
language sql stable security invoker set search_path = ''
as $$
  select p.id, p.title, p.difficulty, p.status, p.created_at, p.author_id,
         a.username, a.display_name,
         (select count(*) from public.community_solves s where s.problem_id = p.id),
         (select count(*) from public.community_votes v where v.problem_id = p.id),
         (select count(*) from public.community_reports r where r.problem_id = p.id)
    from public.community_problems p
    join public.profiles a on a.id = p.author_id
   order by p.created_at desc
   limit 500
$$;
grant execute on function public.community_list() to anon, authenticated;
