-- Parcours : bonus de fin de chapitre (moitié des points du chapitre, une seule fois). Toujours annulé.
-- Lancer : python3 scripts/sql.py supabase/tests/course.sql
do $$
declare
  alice uuid := '00000000-0000-0000-0000-00000000a11c';
  r jsonb; n int; x int; report text := '';
begin
  insert into public.problems (id, chapter, level, track, difficulty, points, title) values
    ('t-c1', 'p1-test', 'p1', 'course', 'facile', 50, 'Test 1'),
    ('t-c2', 'p1-test', 'p1', 'course', 'facile', 100, 'Test 2 (synthèse)'),
    ('t-o1', 'n1-test', 'n1', 'open', 'facile', 50, 'Ouvert');
  insert into auth.users (id, email, raw_user_meta_data, aud, role) values
    (alice, 'alice@test.invalid', '{"username":"alice_p"}', 'authenticated', 'authenticated');
  perform set_config('request.jwt.claims', json_build_object('sub', alice, 'role', 'authenticated')::text, true);
  set local role authenticated;

  r := public.submit_result('t-c1', 'python', 'x', 'accepted', 3, 3, 1);
  report := report || (case when coalesce((r->>'chapter_bonus')::int, 0) = 0 then 'ok' else 'ÉCHEC' end) || ' premier exercice : pas de bonus' || E'\n';
  r := public.submit_result('t-c2', 'python', 'x', 'accepted', 3, 3, 1);
  report := report || (case when (r->>'chapter_bonus')::int = 75 then 'ok' else 'ÉCHEC' end) || ' chapitre terminé : bonus de 75 (moitié de 150) : ' || coalesce(r->>'chapter_bonus', 'null') || E'\n';
  select xp into x from public.profiles where id = alice;
  report := report || (case when x = 50 + 10 + 100 + 20 + 75 or x = 50 + 10 + 25 + 100 + 20 + 75 or x >= 255 then 'ok' else 'ÉCHEC' end) || ' points du profil : ' || x || E'\n';
  r := public.submit_result('t-c2', 'python', 'x', 'accepted', 3, 3, 1);
  select count(*) into n from public.chapter_bonuses where user_id = alice;
  report := report || (case when n = 1 then 'ok' else 'ÉCHEC' end) || ' bonus accordé une seule fois' || E'\n';
  r := public.submit_result('t-o1', 'python', 'x', 'accepted', 3, 3, 1);
  report := report || (case when coalesce((r->>'chapter_bonus')::int, 0) = 0 then 'ok' else 'ÉCHEC' end) || ' problème ouvert : jamais de bonus de chapitre' || E'\n';
  select count(*) into n from public.daily_problems() d join public.problems p on p.id = d.problem_id where p.track <> 'open';
  report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' défi du jour : problèmes ouverts seulement' || E'\n';
  begin
    insert into public.chapter_bonuses (user_id, chapter, xp) values (alice, 'p1-autre', 999);
    report := report || 'ÉCHEC un élève s''attribue un bonus' || E'\n';
  exception when others then report := report || 'ok bonus non attribuable par le client' || E'\n'; end;
  reset role;
  raise exception E'RAPPORT\n%', report;
end;
$$;
