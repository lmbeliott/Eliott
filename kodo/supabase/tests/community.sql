-- Problèmes de la communauté : droits, limites, signalements, modération. Toujours annulé.
-- Lancer : python3 scripts/sql.py supabase/tests/community.sql
do $$
declare
  alice uuid := '00000000-0000-0000-0000-00000000a11c';
  bob   uuid := '00000000-0000-0000-0000-000000000b0b';
  c1 uuid := '00000000-0000-0000-0000-0000000000c1';
  c2 uuid := '00000000-0000-0000-0000-0000000000c2';
  h text := repeat('a', 64);
  tests jsonb := jsonb_build_array(jsonb_build_object('input','1','hash',repeat('a',64)), jsonb_build_object('input','2','hash',repeat('b',64)), jsonb_build_object('input','3','hash',repeat('c',64)));
  samples jsonb := jsonb_build_array(jsonb_build_object('input','1 2','output','3'));
  n int; t text; report text := ''; u uuid; reporters uuid[];
begin
  insert into auth.users (id, email, raw_user_meta_data, aud, role) values
    (alice, 'alice@test.invalid', '{"username":"alice_c"}', 'authenticated', 'authenticated'),
    (bob,   'bob@test.invalid',   '{"username":"bob_c"}', 'authenticated', 'authenticated');
  for i in 1..3 loop
    insert into auth.users (id, email, aud, role) values (gen_random_uuid(), 'r'||i||'@test.invalid', 'authenticated', 'authenticated');
  end loop;

  select array_agg(id) into reporters from auth.users where email like 'r_@test.invalid';
  perform set_config('request.jwt.claims', json_build_object('sub', alice, 'role', 'authenticated')::text, true);
  set local role authenticated;

  insert into public.community_problems (id, author_id, title, statement, input_spec, output_spec, difficulty, samples, tests)
  values (c1, alice, 'Somme', 'Calculer la somme de deux entiers donnés.', 'Deux entiers.', 'Leur somme.', 'facile', samples, tests);
  report := report || 'ok Alice propose un problème' || E'\n';
  insert into public.community_references (problem_id, language, code) values (c1, 'python', 'print(sum(map(int,input().split())))');
  report := report || 'ok Alice enregistre sa référence' || E'\n';

  begin
    insert into public.community_problems (id, author_id, title, statement, input_spec, output_spec, difficulty, samples, tests)
    values (c2, bob, 'Usurpé', 'Un problème proposé au nom de Bob par Alice.', 'x', 'y', 'facile', samples, tests);
    report := report || 'ÉCHEC Alice propose au nom de Bob' || E'\n';
  exception when others then report := report || 'ok proposer au nom d''un autre : refusé' || E'\n'; end;

  begin
    insert into public.community_problems (id, author_id, title, statement, input_spec, output_spec, difficulty, samples, tests)
    values (c2, alice, 'Tests faux', 'Des tests sans empreinte valide ne passent pas.', 'x', 'y', 'facile', samples,
            jsonb_build_array(jsonb_build_object('input','1'), jsonb_build_object('input','2','hash',h), jsonb_build_object('input','3','hash',h)));
    report := report || 'ÉCHEC test sans empreinte accepté' || E'\n';
  exception when others then report := report || 'ok test sans empreinte : refusé' || E'\n'; end;

  begin
    update public.community_problems set status = 'hidden' where id = c1;
    report := report || 'ÉCHEC l''auteur masque son problème' || E'\n';
  exception when others then report := report || 'ok l''auteur ne peut pas se masquer' || E'\n'; end;

  begin
    insert into public.community_votes (problem_id, user_id) values (c1, alice);
    report := report || 'ÉCHEC vote pour soi' || E'\n';
  exception when others then report := report || 'ok voter pour son problème : refusé' || E'\n'; end;

  -- Bob
  perform set_config('request.jwt.claims', json_build_object('sub', bob, 'role', 'authenticated')::text, true);
  select count(*) into n from public.community_references;
  report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' Bob ne lit pas la référence' || E'\n';
  update public.community_problems set title = 'Piraté' where id = c1;
  get diagnostics n = row_count;
  report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' Bob ne modifie pas le problème d''Alice' || E'\n';
  insert into public.community_votes (problem_id, user_id) values (c1, bob);
  insert into public.community_solves (problem_id, user_id, language) values (c1, bob, 'cpp');
  insert into public.community_solves (problem_id, user_id, language) values (c1, bob, 'cpp') on conflict do nothing;
  select solves, votes::text into n, t from public.community_list() where id = c1;
  report := report || (case when n = 1 and t = '1' then 'ok' else 'ÉCHEC' end) || ' liste : 1 réussite, 1 vote' || E'\n';
  select xp::text into t from public.profiles where id = bob;
  report := report || (case when t = '0' then 'ok' else 'ÉCHEC' end) || ' réussite communautaire : 0 point' || E'\n';
  insert into public.community_reports (problem_id, user_id, reason) values (c1, bob, 'incorrect');

  -- deux autres signalements : le problème est masqué
  foreach u in array reporters[1:2] loop
    perform set_config('request.jwt.claims', json_build_object('sub', u, 'role', 'authenticated')::text, true);
    insert into public.community_reports (problem_id, user_id, reason) values (c1, u, 'incorrect');
  end loop;
  select count(*) into n from public.community_problems where id = c1;
  report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' masqué après 3 signalements (invisible des autres)' || E'\n';

  perform set_config('request.jwt.claims', json_build_object('sub', alice, 'role', 'authenticated')::text, true);
  select status into t from public.community_problems where id = c1;
  report := report || (case when t = 'hidden' then 'ok' else 'ÉCHEC' end) || ' Alice voit son problème masqué' || E'\n';
  begin
    update public.community_problems set status = 'published' where id = c1;
    report := report || 'ÉCHEC Alice démasque' || E'\n';
  exception when others then report := report || 'ok Alice ne peut pas démasquer' || E'\n'; end;
  begin
    perform public.moderate_community_problem(c1, false);
    report := report || 'ÉCHEC modération sans droit' || E'\n';
  exception when others then report := report || 'ok modération réservée' || E'\n'; end;

  reset role;
  insert into private.moderators (user_id) values (bob);
  perform set_config('request.jwt.claims', json_build_object('sub', bob, 'role', 'authenticated')::text, true);
  set local role authenticated;
  report := report || (case when public.is_moderator() then 'ok' else 'ÉCHEC' end) || ' Bob est modérateur' || E'\n';
  perform public.moderate_community_problem(c1, false);
  select status into t from public.community_problems where id = c1;
  select count(*) into n from public.community_reports where problem_id = c1;
  report := report || (case when t = 'published' and n = 0 then 'ok' else 'ÉCHEC' end) || ' rétabli, signalements effacés' || E'\n';

  -- limite de 5 par jour
  perform set_config('request.jwt.claims', json_build_object('sub', alice, 'role', 'authenticated')::text, true);
  begin
    for i in 1..5 loop
      insert into public.community_problems (id, author_id, title, statement, input_spec, output_spec, difficulty, samples, tests)
      values (gen_random_uuid(), alice, 'Série ' || i, 'Un énoncé suffisamment long pour passer.', 'x', 'y', 'facile', samples, tests);
    end loop;
    report := report || 'ÉCHEC 6 problèmes en un jour' || E'\n';
  exception when others then report := report || 'ok limite de 5 par 24 h : ' || sqlerrm || E'\n'; end;

  reset role;
  set local role anon;
  select count(*) into n from public.community_list();
  report := report || (case when n = 1 then 'ok' else 'ÉCHEC' end) || ' visiteur : liste lisible (' || n || ')' || E'\n';
  reset role;
  raise exception E'RAPPORT\n%', report;
end;
$$;
