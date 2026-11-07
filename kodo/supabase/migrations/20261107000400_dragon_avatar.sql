-- Avatars réservés : « ryu » (dragon 竜) à partir de 24 000 points (rang Meijin, calculé par le
-- serveur), « forge » et « kodo » à l'administrateur seulement.
create or replace function private.profiles_avatar_guard()
returns trigger
language plpgsql security invoker set search_path = ''
as $$
begin
  if new.avatar is distinct from old.avatar and new.staff is distinct from 'admin' then
    if new.avatar in ('forge', 'kodo') then
      raise exception 'Avatar réservé.' using errcode = 'P0001';
    end if;
    if new.avatar = 'ryu' and new.xp < 24000 then
      raise exception 'Avatar réservé au rang Meijin (24 000 points).' using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;
