-- Rôle d'équipe affiché publiquement (titre spécial, nom en couleur, avatar réservé).
-- Aucun droit d'écriture côté client : seul un administrateur de la base le modifie.
alter table public.profiles
  add column staff text check (staff in ('admin', 'moderateur'));

-- L'avatar « kodo » est réservé à l'administrateur.
create or replace function private.profiles_avatar_guard()
returns trigger
language plpgsql security invoker set search_path = ''
as $$
begin
  if new.avatar = 'kodo' and new.avatar is distinct from old.avatar and new.staff is distinct from 'admin' then
    raise exception 'Avatar réservé.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger profiles_avatar_guard
  before update of avatar on public.profiles
  for each row execute function private.profiles_avatar_guard();

drop function public.leaderboard(text, uuid, integer);
create function public.leaderboard(p_period text default 'all', p_group uuid default null, p_limit int default 50)
returns table (
  rank bigint,
  user_id uuid,
  username text,
  display_name text,
  school text,
  avatar text,
  staff text,
  xp bigint,
  total_xp bigint,
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
      p.id, p.username, p.display_name, p.school, p.avatar, p.staff,
      case when p_period = 'week'
        then coalesce((select sum(s.xp) from public.solves s, week_start w where s.user_id = p.id and s.solved_at >= w.ts), 0)
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
$$;
grant execute on function public.leaderboard(text, uuid, integer) to anon, authenticated;
