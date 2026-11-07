-- Indices payants : ouvrir un indice réduit les points de la réussite. Toujours annulé.
-- Lancer : python3 scripts/sql.py supabase/tests/hints.sql
do $$
declare
  alice uuid := '00000000-0000-0000-0000-0000000a1ce5';
  r jsonb; n int; report text := '';
begin
  insert into public.problems (id, chapter, level, track, difficulty, points, title) values
    ('t-h1', 'p1-thint', 'p1', 'course', 'facile', 100, 'Avec indices'),
    ('t-h2', 'p1-thint', 'p1', 'course', 'facile', 100, 'Sans indice'),
    ('t-h3', 'p1-thint', 'p1', 'course', 'facile', 100, 'Trois indices');
  insert into auth.users (id, email, raw_user_meta_data, aud, role) values
    (alice, 'alice-h@test.invalid', '{"username":"alice_h"}', 'authenticated', 'authenticated');
  perform set_config('request.jwt.claims', json_build_object('sub', alice, 'role', 'authenticated')::text, true);
  set local role authenticated;

  begin
    r := public.unlock_hint('t-h1', 2);
    report := report || 'ÉCHEC indice 2 ouvert avant le 1' || E'\n';
  exception when others then report := report || 'ok indices dans l''ordre' || E'\n'; end;
  r := public.unlock_hint('t-h1', 1);
  report := report || (case when (r->>'penalty')::int = 15 then 'ok' else 'ÉCHEC' end) || ' 1 indice : −15 %' || E'\n';
  r := public.unlock_hint('t-h1', 2);
  report := report || (case when (r->>'penalty')::int = 35 then 'ok' else 'ÉCHEC' end) || ' 2 indices : −35 %' || E'\n';
  r := public.unlock_hint('t-h1', 1);
  report := report || (case when (r->>'hints')::int = 2 then 'ok' else 'ÉCHEC' end) || ' rouvrir l''indice 1 ne baisse pas le compte' || E'\n';
  begin
    delete from public.hint_unlocks where user_id = alice;
    get diagnostics n = row_count;
    report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' suppression par le client sans effet (' || n || ')' || E'\n';
  exception when others then report := report || 'ok suppression refusée' || E'\n'; end;
  begin
    update public.hint_unlocks set hints = 1 where user_id = alice;
    get diagnostics n = row_count;
    report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' modification par le client sans effet' || E'\n';
  exception when others then report := report || 'ok modification refusée' || E'\n'; end;
  begin
    insert into public.hint_unlocks (user_id, problem_id, hints) values (alice, 't-h2', 1);
    report := report || 'ÉCHEC insertion directe' || E'\n';
  exception when others then report := report || 'ok insertion directe refusée' || E'\n'; end;

  r := public.submit_result('t-h1', 'python', 'x', 'accepted', 3, 3, 1);
  report := report || (case when (r->>'xp_gain')::int = 78 then 'ok' else 'ÉCHEC' end) || ' réussite du 1er coup avec 2 indices : 120 × 65 % = 78 : ' || (r->>'xp_gain') || E'\n';
  r := public.unlock_hint('t-h1', 3);
  report := report || (case when (r->>'solved')::boolean and (r->>'penalty')::int = 0 then 'ok' else 'ÉCHEC' end) || ' indice gratuit après réussite' || E'\n';
  select hints into n from public.hint_unlocks where user_id = alice and problem_id = 't-h1';
  report := report || (case when n = 2 then 'ok' else 'ÉCHEC' end) || ' rien enregistré après réussite' || E'\n';

  r := public.unlock_hint('t-h3', 1); r := public.unlock_hint('t-h3', 2); r := public.unlock_hint('t-h3', 3);
  r := public.submit_result('t-h3', 'python', 'x', 'wrong_answer', 1, 3, 1);
  r := public.submit_result('t-h3', 'python', 'x', 'accepted', 3, 3, 1);
  report := report || (case when (r->>'xp_gain')::int = 40 then 'ok' else 'ÉCHEC' end) || ' 3 indices, 2e essai : 100 × 40 % = 40 : ' || (r->>'xp_gain') || E'\n';
  r := public.submit_result('t-h2', 'python', 'x', 'accepted', 3, 3, 1);
  report := report || (case when (r->>'xp_gain')::int = 120 then 'ok' else 'ÉCHEC' end) || ' sans indice : 120' || E'\n';
  report := report || (case when (r->>'chapter_bonus')::int = 150 then 'ok' else 'ÉCHEC' end) || ' bonus de chapitre inchangé : ' || (r->>'chapter_bonus') || E'\n';
  reset role;
  raise exception E'RAPPORT\n%', report;
end;
$$;
