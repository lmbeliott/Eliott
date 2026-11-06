-- Le classement général est public : la fonction leaderboard() mentionne group_members
-- (pour le filtre par cordée), ce qui exige le droit SELECT même quand p_group est nul.
-- Aucune politique RLS ne vise anon sur cette table : un visiteur n'y lit aucune ligne.
grant select on public.group_members to anon;
