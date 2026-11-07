-- Administration et suspension. Toujours annulé.
-- Lancer : python3 scripts/sql.py supabase/tests/admin.sql
do $$
declare
  boss uuid := '00000000-0000-0000-0000-0000000ad001';
  bob uuid := '00000000-0000-0000-0000-0000000ad002';
  r jsonb; n int; x int; ok boolean; report text := '';
  aal1 text; aal2 text; bobc text;
begin
  insert into auth.users (id, email, raw_user_meta_data, aud, role) values
    (boss, 'boss@test.invalid', '{"username":"boss_t"}', 'authenticated', 'authenticated'),
    (bob, 'bob@test.invalid', '{"username":"bob_t"}', 'authenticated', 'authenticated');
  update public.profiles set staff = 'admin' where id = boss;
  insert into public.problems (id, chapter, level, track, difficulty, points, title) values ('t-adm', 'n1-test', 'n1', 'open', 'facile', 50, 'Test');
  aal1 := json_build_object('sub', boss, 'role', 'authenticated', 'aal', 'aal1')::text;
  aal2 := json_build_object('sub', boss, 'role', 'authenticated', 'aal', 'aal2')::text;
  bobc := json_build_object('sub', bob, 'role', 'authenticated', 'aal', 'aal1')::text;

  -- Élève : refusé
  perform set_config('request.jwt.claims', bobc, true);
  set local role authenticated;
  begin
    r := public.admin_overview();
    report := report || 'ÉCHEC un élève lit la vue admin' || E'\n';
  exception when others then report := report || 'ok élève refusé' || E'\n'; end;
  reset role;

  -- Admin sans double authentification : refusé
  perform set_config('request.jwt.claims', aal1, true);
  set local role authenticated;
  begin
    r := public.admin_overview();
    report := report || 'ÉCHEC admin sans 2FA accepté' || E'\n';
  exception when others then report := report || 'ok admin sans 2FA refusé (' || sqlerrm || ')' || E'\n'; end;
  reset role;

  -- Anonyme : pas d'exécution
  set local role anon;
  begin
    r := public.admin_overview();
    report := report || 'ÉCHEC anonyme accepté' || E'\n';
  exception when others then report := report || 'ok anonyme refusé' || E'\n'; end;
  reset role;

  -- Admin en aal2
  perform set_config('request.jwt.claims', aal2, true);
  set local role authenticated;
  r := public.admin_overview();
  report := report || (case when (r->>'users')::int >= 2 then 'ok' else 'ÉCHEC' end) || ' vue d''ensemble' || E'\n';
  select count(*) into n from public.admin_users('bob_t', 'all', 50, 0);
  report := report || (case when n = 1 then 'ok' else 'ÉCHEC' end) || ' recherche de compte' || E'\n';
  r := public.admin_user(bob);
  report := report || (case when r->>'email' = 'bob@test.invalid' then 'ok' else 'ÉCHEC' end) || ' fiche de compte' || E'\n';
  begin
    perform public.admin_ban(boss, 1, 'test');
    report := report || 'ÉCHEC auto-suspension' || E'\n';
  exception when others then report := report || 'ok pas d''auto-suspension' || E'\n'; end;
  perform public.admin_set_moderator(bob, true);
  report := report || (case when (public.admin_user(bob)->>'moderator')::boolean then 'ok' else 'ÉCHEC' end) || ' modérateur ajouté' || E'\n';
  perform public.admin_set_moderator(bob, false);
  perform public.admin_ban(bob, 7, 'spam');
  reset role;
  select banned_until > now() + interval '6 days' into ok from public.profiles where id = bob;
  report := report || (case when ok then 'ok' else 'ÉCHEC' end) || ' suspension enregistrée' || E'\n';
  select banned_until > now() into ok from auth.users where id = bob;
  report := report || (case when ok then 'ok' else 'ÉCHEC' end) || ' connexion bloquée (auth)' || E'\n';

  -- Bob suspendu
  perform set_config('request.jwt.claims', bobc, true);
  set local role authenticated;
  begin
    r := public.submit_result('t-adm', 'python', 'x', 'accepted', 1, 1, 1);
    report := report || 'ÉCHEC soumission d''un compte suspendu' || E'\n';
  exception when others then report := report || 'ok soumission refusée' || E'\n'; end;
  update public.profiles set display_name = 'Pirate' where id = bob;
  get diagnostics n = row_count;
  report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' profil figé' || E'\n';
  select count(*) into n from public.leaderboard('all', null, 200) l where l.user_id = bob;
  report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' retiré du classement' || E'\n';
  begin
    r := public.admin_overview();
    report := report || 'ÉCHEC bob admin' || E'\n';
  exception when others then report := report || 'ok bob toujours refusé' || E'\n'; end;
  reset role;

  perform set_config('request.jwt.claims', aal2, true);
  set local role authenticated;
  perform public.admin_unban(bob);
  perform public.admin_set_announcement('Maintenance ce soir', 'warn');
  perform public.admin_reset_progress(bob);
  select count(*) into n from public.admin_log(50);
  report := report || (case when n >= 6 then 'ok' else 'ÉCHEC' end) || ' journal : ' || n || ' actions' || E'\n';
  reset role;
  select banned_until is null into ok from public.profiles where id = bob;
  report := report || (case when ok then 'ok' else 'ÉCHEC' end) || ' suspension levée' || E'\n';

  set local role anon;
  select count(*) into n from public.site_settings where key = 'announcement';
  report := report || (case when n = 1 then 'ok' else 'ÉCHEC' end) || ' annonce lisible par tous' || E'\n';
  reset role;
  report := report || (case when not has_table_privilege('anon', 'public.community_votes', 'TRUNCATE')
                              and not has_table_privilege('authenticated', 'public.chapter_bonuses', 'INSERT')
                              and not has_table_privilege('anon', 'public.site_settings', 'INSERT')
                         then 'ok' else 'ÉCHEC' end) || ' droits clients resserrés' || E'\n';

  perform set_config('request.jwt.claims', aal2, true);
  set local role authenticated;
  perform public.admin_delete_user(bob);
  reset role;
  select count(*) into n from auth.users where id = bob;
  report := report || (case when n = 0 then 'ok' else 'ÉCHEC' end) || ' compte supprimé' || E'\n';
  raise exception E'RAPPORT\n%', report;
end;
$$;
