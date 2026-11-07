-- Avatars prédéfinis : chacun choisit une image parmi une liste fixe (aucun téléversement).
-- La liste vit dans le client (src/lib/avatars.ts) ; la base n'accepte qu'un identifiant court.
-- Sans choix (null), le client dérive un avatar stable de l'identifiant du compte.

alter table public.profiles
  add column avatar text check (avatar ~ '^[a-z]{2,16}$');
grant update (avatar) on public.profiles to authenticated;

-- Le classement renvoie aussi l'avatar et le total de points (pour le rang, même sur la semaine).
drop function public.leaderboard(text, uuid, integer);
create function public.leaderboard(p_period text default 'all', p_group uuid default null, p_limit int default 50)
returns table (
  rank bigint,
  user_id uuid,
  username text,
  display_name text,
  school text,
  avatar text,
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
      p.id, p.username, p.display_name, p.school, p.avatar,
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
  select r.rank, r.id, r.username, r.display_name, r.school, r.avatar, r.xp, r.total_xp, r.solved, r.streak,
         r.id = (select auth.uid()) as is_me
  from ranked r
  where r.rank <= least(greatest(p_limit, 1), 200) or r.id = (select auth.uid())
  order by r.rank, r.username;
$$;
grant execute on function public.leaderboard(text, uuid, integer) to anon, authenticated;
