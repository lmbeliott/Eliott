# Kodo

Apprendre l'algorithmique en résolvant des problèmes, de la première ligne de code aux Olympiades d'informatique. Un site d'entraînement dans l'esprit de France IOI : interface plus claire, plus de problèmes, et de la motivation (points, ligues, séries, défi du jour, classements par classe).

En ligne : https://lmbeliott.github.io/Eliott/kodo/

## Ce qu'il y a dedans

| | |
| --- | --- |
| Parcours | 4 niveaux (Facile, Moyen, Difficile, Expert), 16 chapitres, un cours court par chapitre |
| Problèmes | 60 problèmes originaux, chacun avec 8 à 20 tests, des indices progressifs et une solution expliquée |
| Langages | Python (Pyodide) et C++17 (Clang compilé en WebAssembly), exécutés dans le navigateur |
| Juge | tests cachés vérifiés par empreinte SHA-256, limite de temps par test, erreurs courantes expliquées |
| Motivation | points (50 / 100 / 200 / 400, +20 % au premier essai, +50 % pour le défi du jour), ligues de Bronze à Maître, série de jours, distinctions |
| Classements | général, de la semaine, et par groupe |
| Groupes | une classe, un établissement ou des amis ; code à 6 caractères ; l'encadrant voit la progression et le code de chaque élève |
| Langues | français par défaut, anglais au choix (interface, énoncés, cours) |

Les invités peuvent tout essayer sans compte ; leurs réussites sont envoyées sur le compte à la première connexion.

## Lancer en local

```bash
cd kodo
npm install
npm run dev        # http://localhost:5173 (prépare aussi Pyodide, Clang et le contenu)
npm run build      # build de production dans kodo/dist
```

`npm run dev` construit le contenu en mode tolérant (les problèmes en erreur sont écartés) ; `npm run build` est strict.

## Contenu

Tout le contenu est dans `content/` ; le guide de rédaction est `content/README.md`.

```bash
npm run content:check                               # vérifie les 60 problèmes
node scripts/build-content.mjs --check --filter n3- # un niveau, un chapitre ou un problème
```

Pour chaque problème, le script exécute `gen.py` (les entrées de test), `solution.py` (les sorties attendues), compile `solution.cpp` avec g++ et exige des sorties identiques. Il génère `public/content/` (énoncés et tests, sorties cachées sous forme d'empreinte), `src/content/catalog.json` et `supabase/problems.sql`.

## Supabase

Projet `bskgiaejgvbjpixijruk`. Le schéma est dans `supabase/migrations/` :

- `profiles`, `submissions`, `solves`, `activity`, `groups`, `group_members`, `problems` ;
- RLS sur toutes les tables, droits accordés explicitement ;
- les points sont calculés côté serveur par `submit_result` à partir de la table `problems` (le client n'envoie jamais de points) ;
- `leaderboard`, `daily_problems`, `problem_stats`, `create_group`, `join_group`, `delete_my_account`.

```bash
python3 scripts/sql.py supabase/migrations/<fichier>.sql   # appliquer une migration
python3 scripts/sql.py supabase/problems.sql               # synchroniser la table des problèmes
python3 scripts/sql.py supabase/tests/rls_and_scoring.sql  # 24 vérifications de sécurité et de score (annulées à la fin)
```

`scripts/sql.py` passe par l'API de gestion Supabase ; en local, définir `SUPABASE_ACCESS_TOKEN` (jeton personnel `sbp_…`).

**Limite connue :** le code est jugé dans le navigateur. Un élève déterminé peut donc envoyer un faux « accepté » à `submit_result` (les sorties attendues des tests cachés ne sont jamais publiées en clair, ce qui limite la triche facile). Pour un classement à enjeu, il faudra rejuger côté serveur.

## Architecture

```
src/
  judge/        workers : python.worker (Pyodide), clang.worker (compilation), wasm.worker (exécution WASI) ;
                judge.ts orchestre tests, limites de temps et verdicts ; explain.ts traduit les erreurs
  lib/          supabase, auth, progression (invité ou connecté), i18n, contenu, ligues
  components/   interface : éditeur CodeMirror, grille du programme, classements, calendrier d'activité
  pages/        accueil, parcours, chapitre, problème, problèmes, défi, classements, profil, groupes…
scripts/        vendor.mjs (Pyodide + Clang compressés), build-content.mjs, sql.py
```

Pyodide (~6 Mo) et Clang (~27 Mo) sont servis compressés en `.gz` et décompressés par le navigateur ; ils ne sont téléchargés qu'au premier usage, puis mis en cache.

## Déploiement

`.github/workflows/pages.yml` construit SwimHub (racine) et Kodo (`/Eliott/kodo/`) et publie le tout sur la branche `gh-pages`. Le `404.html` de la racine renvoie les liens profonds de Kodo vers Kodo.
