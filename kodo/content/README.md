# Écrire du contenu pour Kodo

Ce dossier contient tout le contenu pédagogique, en deux parties :

- **le parcours** (`course.json`) : 6 niveaux, 55 chapitres. Chaque chapitre a un **vrai cours** (`lessons/<id>.md`), des **exercices** de difficulté croissante et un **problème de synthèse** final. C'est la progression principale, sur le modèle de France-IOI et du programme d'informatique de prépa ;
- **les problèmes ouverts** (`open.json`) : des problèmes rangés par thème et par difficulté (Facile, Moyen, Difficile, Expert), sans cours, pour s'entraîner librement.

Les problèmes sont tous dans `problems/`. Le champ `chapter` de `problem.md` dit à quelle partie un problème appartient (un id de `course.json` ou de `open.json`). Le script `scripts/build-content.mjs` vérifie chaque problème en exécutant les solutions de référence, puis génère les fichiers publiés par le site.

```bash
npm run content:check                          # tout vérifier
node scripts/build-content.mjs --check --filter n2-   # un niveau, un chapitre ou un problème
```

Un problème n'est accepté que si `gen.py` produit les tests, si `solution.py` et `solution.cpp` donnent **exactement** les mêmes sorties sur tous les tests, et si `solution.py` reste rapide.

## Le parcours : règles propres

- **Points** : fixés par le niveau du chapitre (`points` dans `course.json`), doublés pour le problème de synthèse (`synthesis: true` dans le frontmatter, un seul par chapitre, en dernier). Ne pas écrire `difficulty`.
- **Notions** : un exercice du chapitre k n'utilise **que** les notions des chapitres 1 à k du parcours. Au niveau 1, pas de listes avant le niveau 2, pas de fonctions, etc. La solution de référence doit pouvoir être écrite par un élève qui vient de lire le cours.
- **Esprit olympiades dès le début** : même au niveau 1, chaque exercice est un petit problème d'algorithmique (compter, comparer, simuler, trouver un maximum, construire un motif), pas un exercice de syntaxe. Des tests qui couvrent les cas limites.
- **Progression** : 6 à 8 exercices par chapitre, du plus simple (application directe du cours) au plus subtil, puis le problème de synthèse, qui combine les notions du chapitre et des chapitres précédents.
- **Exercices sans entrée** (premiers chapitres, avant « Lecture de l'entrée ») : `no_input: true` et `samples: 1` dans le frontmatter ; `gen.py` affiche exactement `[""]`.

## Style des énoncés

Pas d'univers ni de personnages récurrents : un énoncé va droit au but. Une phrase de contexte concrète est permise quand elle aide à comprendre (« Un magasin enregistre ses ventes de la semaine. »), jamais plus de deux. Pas de prénoms, pas de mise en scène, pas de références à des marques, à des personnes réelles ni à d'autres sites d'exercices. Les énoncés sont **originaux** : un classique de l'algorithmique est bienvenu, avec une formulation et des données à nous.

Les sorties sont neutres : des nombres, ou des mots simples et universels (`OUI`/`NON`, `IMPOSSIBLE`). Pas de mots tirés d'une histoire.

Les titres décrivent la tâche, sobrement : « Somme de deux nombres », « Plus longue sous-suite croissante », « Composantes connexes ». L'`id` du dossier suit le titre (`somme-de-deux-nombres`).

## Ton

- Impersonnel et direct : « Afficher la somme… », « Le programme lit… ». Pas de « tu ».
- Phrases courtes, vocabulaire simple, surtout au niveau 1. Un collégien doit comprendre seul.
- Les nombres et contraintes en Unicode, sans LaTeX : `1 ≤ N ≤ 100 000`, `10⁹`, `×`.
- Les noms de variables d'entrée en majuscules (`N`, `K`, `A`), les valeurs littérales en `code`.

## Un problème = un dossier

`content/problems/<id>/` — l'`id` est un slug court en kebab-case ASCII, sans accents (`compteur-de-marmottes`). Il doit être unique : crée le dossier avec `mkdir` **sans** `-p` ; s'il existe déjà, choisis un autre nom.

| Fichier | Rôle |
| --- | --- |
| `problem.md` | métadonnées + énoncé + indices + explication de la solution |
| `gen.py` | affiche la liste JSON des entrées de test |
| `solution.py` | solution de référence en Python 3 (montrée à l'élève après réussite) |
| `solution.cpp` | solution de référence en C++17 (idem) |
| `starter.py`, `starter.cpp` | *facultatifs* : code de départ affiché dans l'éditeur |

### `problem.md`

```markdown
---
id: compteur-de-marmottes
title: Le compteur de marmottes
chapter: p1-variables        # un id de content/course.json (parcours) ou content/open.json (ouverts)
order: 2                     # position dans le chapitre (1, 2, 3…), difficulté croissante
tags: [entrées-sorties, arithmétique]
samples: 2                   # les N premiers tests de gen.py sont les exemples affichés (1 à 4)
time_limit_ms: 1000          # facultatif, défaut 1000 (limite C++ ; Python a 5×)
---

## Énoncé
La tâche, directement (une phrase de contexte concrète au plus), puis les précisions.

## Entrée
Format exact, ligne par ligne.

## Sortie
Ce qu'il faut afficher, exactement.

## Contraintes
- 1 ≤ N ≤ 1 000

## Indices
1. Un premier coup de pouce, qui oriente sans donner la réponse.
2. Un indice plus précis.
3. (facultatif) Presque la solution.

## Solution
L'idée, expliquée simplement. Aux niveaux 3 et 4 : la complexité, et pourquoi la solution naïve est trop lente. Les pièges classiques. Pas besoin de recopier le code : les fichiers solution.* sont affichés à côté.
```

Les sections reconnues sont exactement : `Énoncé`, `Entrée`, `Sortie`, `Contraintes` (facultative), `Indices`, `Solution`. Les exemples ne s'écrivent pas dans l'énoncé : le site les affiche à partir des premiers tests.

`difficulty` (facile, moyen, difficile, expert) est déduit du niveau du chapitre ; ne le mets que pour une exception justifiée.

Étiquettes à utiliser : `entrées-sorties`, `arithmétique`, `conditions`, `boucles`, `listes`, `chaînes`, `grilles`, `fonctions`, `tri`, `dictionnaires`, `simulation`, `mathématiques`, `sommes-préfixes`, `deux-pointeurs`, `dichotomie`, `récursivité`, `backtracking`, `glouton`, `graphes`, `parcours-en-largeur`, `parcours-en-profondeur`, `programmation-dynamique`, `dijkstra`, `union-find`, `fenwick`, `arbre-de-segments`, `bits`.

### `gen.py`

Affiche une liste JSON de chaînes, chacune étant l'entrée complète d'un test.

```python
import json, random
random.seed(2026)          # obligatoire : les tests doivent être identiques à chaque exécution

tests = ["3 4\n", "10 0\n"]   # d'abord les exemples, petits et parlants
tests.append("0 0\n")         # puis les cas limites
for _ in range(5):            # puis des cas aléatoires, dont les plus grands autorisés
    tests.append(f"{random.randint(0, 10**9)} {random.randint(0, 10**9)}\n")
print(json.dumps(tests))
```

- Entre `samples + 3` et 30 tests ; 8 à 15 est un bon nombre.
- Les exemples (les premiers) sont courts et lisibles (moins de 400 caractères).
- Couvre les cas limites (minimum, maximum, égalités, tout identique, réponse nulle…).
- Aux niveaux 3 et 4, au moins deux tests de taille maximale qui font échouer la solution naïve (trop lente).
- Total des entrées ≤ 400 ko par problème : choisis les contraintes en conséquence (par exemple N ≤ 50 000 plutôt que 10⁶).
- Entrées en **ASCII uniquement** (pas d'accents dans les mots à lire : le C++ les gère mal).
- Entiers uniquement en sortie si possible ; évite les nombres à virgule. Si c'est indispensable, impose un arrondi précis.

### Les solutions

- La comparaison ignore les espaces et retours à la ligne en trop (comparaison mot à mot), mais respecte la casse.
- `solution.py` : Python 3 simple et lisible, celui qu'on veut voir écrire par un élève du niveau. Lecture avec `input()` aux niveaux 1-2 ; `sys.stdin` autorisé pour les grosses entrées. Commentaires courts en français. Doit tourner en **moins de 1 s** (CPython) sur chaque test : Python dans le navigateur est 2 à 3 fois plus lent.
- `solution.cpp` : C++17 sans exceptions (`-fno-exceptions`), includes explicites (`<iostream>`, `<vector>`…), `ios::sync_with_stdio(false)` dès que l'entrée est grosse, `long long` dès que ça peut dépasser 2³¹.
- Les deux solutions doivent suivre le même algorithme (celui expliqué dans `## Solution`).

## Les cours (parcours)

`content/lessons/<id-du-chapitre>.md`, sans titre `#` (le site affiche le titre du chapitre). Un vrai cours, pas un résumé : **1 200 à 2 500 mots** de texte hors code, progressif et rigoureux, qu'un élève peut suivre seul du début à la fin.

Structure attendue :

1. Une introduction courte : ce que le chapitre permet de faire, sur un exemple concret.
2. Les notions **une par une**, chacune avec : une explication précise, un exemple minimal, ce que le programme affiche, et pourquoi. Le vocabulaire exact est défini à sa première apparition (en **gras**).
3. Les pièges et erreurs fréquentes, avec l'erreur affichée et sa correction.
4. **Un exemple complet** : un petit problème résolu pas à pas (lecture de l'énoncé, idée, programme, vérification sur un exemple à la main).
5. À partir du niveau 3 : la **correction** (pourquoi l'algorithme est juste, invariant) et la **complexité**, justifiées.
6. `## À retenir` : 4 à 6 points.

Style : phrases courtes, impersonnel (« on écrit », « il suffit de »), pas de « tu » ; aucune notion utilisée avant d'être expliquée. Chaque exemple de code s'écrit **deux fois, à la suite** : un bloc ```python puis un bloc ```cpp — le site n'affiche que celui du langage choisi par l'élève.

## Traduction anglaise

Le site est en français par défaut ; l'élève peut passer l'interface et le contenu en anglais. Une traduction manquante n'est pas bloquante : le site affiche alors la version française.

- Problème : `problem.en.md` à côté de `problem.md`, avec seulement `title` dans le frontmatter et les sections `## Statement`, `## Input`, `## Output`, `## Constraints` (si présente en français), `## Hints` (même nombre d'indices), `## Solution`.
- Code de départ : `starter.en.py` / `starter.en.cpp` si le starter contient des commentaires (sinon le starter français est repris).
- Cours : `lessons/<id>.en.md`, même structure (le `## À retenir` devient `## Key takeaways`).
- On traduit le texte, pas les tests : données et sorties restent identiques. Anglais simple et naturel, tutoiement → « you ».
