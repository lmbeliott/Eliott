-- Inscription : le pseudo choisi garde ses 20 caractères (comme la contrainte de la table et
-- le formulaire). Il n'est raccourci (à 16) que lorsqu'il faut y ajouter 4 chiffres.
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
    base := 'kodo' || substr(replace(new.id::text, '-', ''), 1, 6);
  end if;
  base := substr(base, 1, 20);
  candidate := base;
  while exists (select 1 from public.profiles where username = candidate) loop
    tries := tries + 1;
    candidate := substr(base, 1, 16) || (floor(random() * 9000) + 1000)::int::text;
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
