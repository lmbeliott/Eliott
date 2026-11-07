-- Test de bout en bout du schéma, toujours annulé (l'exception finale annule la transaction).
-- Lancer : python3 scripts/sql.py supabase/tests/rls_and_scoring.sql
-- Attendu : une erreur « RAPPORT » dont chaque ligne commence par ok.
do $$
declare
  alice uuid := '00000000-0000-0000-0000-00000000a11c';
  bob   uuid := '00000000-0000-0000-0000-000000000b0b';
  prof  uuid := '00000000-0000-0000-0000-0000000000ef';
  r jsonb; g public.groups%rowtype; n int; t text; report text := '';
  daily text;
  procedure_ok boolean;
begin
  insert into public.problems (id, chapter, level, difficulty, points, title) values
    ('t-un', 'n1-affichage', 'n1', 'facile', 50, 'Test 1'),
    ('t-deux', 'n2-chaines', 'n2', 'moyen', 100, 'Test 2')
  on conflict (id) do nothing;

  insert into auth.users (id, email, raw_user_meta_data, aud, role) values
    (alice, 'alice@test.invalid', '{"username":"Alice!","display_name":"Alice"}', 'authenticated', 'authenticated'),
    (bob,   'bob@test.invalid',   '{"username":"alice"}', 'authenticated', 'authenticated'),
    (prof,  'prof@test.invalid',  '{}', 'authenticated', 'authenticated');

  select username into t from public.profiles where id = alice;
  report := report || (case when t = 'alice' then 'ok' else 'ÉCHEC' end) || ' profil créé (alice) : ' || t || E'\n';
  select username into t from public.profiles where id = bob;
  report := report || (case when t ~ '^alice\d{4}$' then 'ok' else 'ÉCHEC' end) || ' pseudo en double renommé : ' || t || E'\n';
  select username into t from public.profiles where id = prof;
  report := report || (case when t like 'kodo%' then 'ok' else 'ÉCHEC' end) || ' pseudo par défaut : ' || t || E'\n';

  -- On agit désormais comme Alice (rôle authenticated).
  perform set_config('request.jwt.claims', json_build_object('sub', alice, 'role', 'authenticated')::text, true);
  set local role authenticated;

  r := public.submit_result('t-un', 'python', 'print(1)', 'wrong_answer', 1, 3, 12);
  report := report || (case when (r->>'xp_gain')::int = 0 then 'ok' else 'ÉCHEC' end) || ' mauvaise réponse : 0 m' || E'\n';
  r := public.submit_result('t-un', 'python', 'print(2)', 'accepted', 3, 3, 15);
  select problem_id into daily from public.daily_problems() where level = 'n1';
  report := report || (case when (r->>'xp_gain')::int = (case when daily = 't-un' then 75 else 50 end) and (r->>'first_try')::boolean = false then 'ok' else 'ÉCHEC' end)
    || ' réussite après échec : ' || r::text || E'\n';
  r := public.submit_result('t-un', 'python', 'print(2)', 'accepted', 3, 3, 15);
  report := report || (case when (r->>'xp_gain')::int = 0 and (r->>'new_solve')::boolean = false then 'ok' else 'ÉCHEC' end) || ' re-soumission : pas de gain' || E'\n';
  r := public.submit_result('t-deux', 'cpp', 'int main(){}', 'accepted', 4, 4, 3);
  report := report || (case when (r->>'first_try')::boolean and (r->>'xp_gain')::int >= 120 and (r->>'streak')::int = 1 then 'ok' else 'ÉCHEC' end)
    || ' premier essai +20 %, série = 1 : ' || r::text || E'\n';

  begin
    r := public.submit_result('t-un', 'python', 'x', 'accepted', 2, 3, 1);
    report := report || 'ÉCHEC verdict incohérent accepté' || E'\n';
  exception when others then report := report || 'ok verdict incohérent refusé' || E'\n'; end;

  begin
    update public.profiles set xp = 999999 where id = alice;
    report := report || 'ÉCHEC xp modifiable par le client' || E'\n';
  exception when insufficient_privilege then report := report || 'ok xp non modifiable' || E'\n'; end;

  update public.profiles set display_name = 'Alice B.' where id = alice;
  select display_name into t from public.profiles where id = alice;
  report := report || (case when t = 'Alice B.' then 'ok' else 'ÉCHEC' end) || ' nom affiché modifiable' || E'\n';
  update public.profiles set display_name = 'piraté' where id = bob;
  select display_name into t from public.profiles where id = bob;
  report := report || (case when t <> 'piraté' then 'ok' else 'ÉCHEC' end) || ' profil d''autrui non modifiable' || E'\n';

  begin
    insert into public.solves (user_id, problem_id, xp, first_try, language) values (alice, 't-deux', 5000, true, 'python');
    report := report || 'ÉCHEC insertion directe dans solves' || E'\n';
  exception when insufficient_privilege then report := report || 'ok solves non modifiable directement' || E'\n'; end;

  -- Le prof crée une cordée, Alice la rejoint.
  perform set_config('request.jwt.claims', json_build_object('sub', prof, 'role', 'authenticated')::text, true);
  g := public.create_group('2nde B', 'classe');
  report := report || (case when g.join_code ~ '^[A-Z2-9]{6}$' then 'ok' else 'ÉCHEC' end) || ' cordée créée, code ' || g.join_code || E'\n';
  select count(*) into n from public.submissions;
  report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' le prof ne voit pas encore les soumissions d''Alice (' || n || ')' || E'\n';

  perform set_config('request.jwt.claims', json_build_object('sub', alice, 'role', 'authenticated')::text, true);
  g := public.join_group(lower(g.join_code));
  select count(*) into n from public.group_members where group_id = g.id;
  report := report || (case when n = 2 then 'ok' else 'ÉCHEC' end) || ' Alice a rejoint (membres visibles : ' || n || ')' || E'\n';
  select count(*) into n from public.leaderboard('all', g.id, 50);
  report := report || (case when n = 2 then 'ok' else 'ÉCHEC' end) || ' classement de la cordée : ' || n || ' lignes' || E'\n';
  select count(*) into n from public.submissions;
  report := report || (case when n = 4 then 'ok' else 'ÉCHEC' end) || ' Alice voit ses 4 soumissions (la soumission incohérente est refusée)' || E'\n';

  perform set_config('request.jwt.claims', json_build_object('sub', prof, 'role', 'authenticated')::text, true);
  select count(*) into n from public.submissions;
  report := report || (case when n = 4 then 'ok' else 'ÉCHEC' end) || ' le prof voit les soumissions de son élève (' || n || ')' || E'\n';

  perform set_config('request.jwt.claims', json_build_object('sub', bob, 'role', 'authenticated')::text, true);
  select count(*) into n from public.submissions;
  report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' Bob ne voit pas les soumissions des autres' || E'\n';
  select count(*) into n from public.groups;
  report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' Bob ne voit pas la cordée' || E'\n';
  select count(*) into n from public.leaderboard('all', g.id, 50);
  report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' Bob : classement de la cordée vide' || E'\n';
  select count(*) into n from public.leaderboard('all', null, 50);
  report := report || (case when n >= 3 then 'ok' else 'ÉCHEC' end) || ' classement général : ' || n || E'\n';
  select count(*) into n from public.leaderboard('week', null, 50) where xp <= 0 or user_id = alice;
  -- La base réelle peut contenir d'autres comptes ayant marqué cette semaine : seules comptent
  -- la présence d'Alice et l'absence de lignes à 0 point.
  report := report || (case when n = 1 and exists (select 1 from public.leaderboard('week', null, 50) where user_id = alice) then 'ok' else 'ÉCHEC' end) || ' classement de la semaine : Alice présente, aucune ligne à 0 point' || E'\n';
  delete from public.group_members where group_id = g.id and user_id = alice;
  get diagnostics n = row_count;
  report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' Bob ne peut pas retirer Alice' || E'\n';

  reset role;
  raise exception E'RAPPORT\n%', report;
end;
$$;
