-- Suppression de son propre compte (RGPD). Les soumissions, réussites et appartenances
-- partent en cascade. Refusée tant que l'élève est créateur d'une cordée qui a d'autres
-- membres : sinon la classe entière disparaîtrait avec lui.
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
    raise exception 'Tu as créé une cordée qui a encore des membres. Supprime-la d''abord (page de la cordée, onglet Membres).' using errcode = '55000';
  end if;
  delete from auth.users where id = uid;
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
