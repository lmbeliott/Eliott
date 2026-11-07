-- Rangs recalibrés sur le parcours complet : Meijin (et donc le dragon 竜) passe à 120 000 points.
create or replace function private.profiles_avatar_guard()
returns trigger
language plpgsql security invoker set search_path = ''
as $$
begin
  if new.avatar is distinct from old.avatar and new.staff is distinct from 'admin' then
    if new.avatar in ('forge', 'kodo') then
      raise exception 'Avatar réservé.' using errcode = 'P0001';
    end if;
    if new.avatar = 'ryu' and new.xp < 120000 then
      raise exception 'Avatar réservé au rang Meijin (120 000 points).' using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;
