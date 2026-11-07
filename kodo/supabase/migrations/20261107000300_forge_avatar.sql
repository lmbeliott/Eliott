-- L'avatar réservé de l'administrateur devient « forge » (katana et marteau croisés).
alter table public.profiles drop constraint if exists profiles_avatar_check;
alter table public.profiles add constraint profiles_avatar_check check (avatar ~ '^[a-z]{2,16}$');

create or replace function private.profiles_avatar_guard()
returns trigger
language plpgsql security invoker set search_path = ''
as $$
begin
  if new.avatar in ('forge', 'kodo') and new.avatar is distinct from old.avatar and new.staff is distinct from 'admin' then
    raise exception 'Avatar réservé.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
