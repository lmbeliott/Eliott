---
id: plus-grand-carre-presque-vide
title: Plus grand carré presque vide
chapter: n3-complexite
order: 5
tags: [sommes-préfixes, grilles]
samples: 2
---

## Énoncé
On te donne une grille de N lignes et M colonnes. Chaque case est libre (`.`) ou marquée (`#`).

Écris un programme qui trouve le plus grand entier K tel qu'il existe, dans la grille, un carré de K × K cases qui contient **au plus T** cases marquées. Le carré doit être entièrement dans la grille, avec ses côtés parallèles aux bords.

## Entrée
- La première ligne contient trois entiers N, M et T.
- Les N lignes suivantes contiennent chacune M caractères collés, `.` ou `#`.

## Sortie
Un seul entier : le plus grand côté K possible. Affiche `0` si toutes les cases sont marquées et que T vaut `0`.

## Contraintes
- 1 ≤ N, M ≤ 400
- 0 ≤ T ≤ N × M

## Indices
1. Compter les cases marquées d'un carré case par case coûte K² opérations. Avec les sommes préfixes en deux dimensions, `pref[i][j]` = nombre de cases marquées dans les i premières lignes et les j premières colonnes, ce compte se fait en O(1).
2. Si un carré de côté K contient au plus T cases marquées, les carrés plus petits qu'il contient aussi. Inutile donc d'essayer toutes les tailles en chaque case : il suffit de savoir si on peut **faire mieux** que le meilleur côté déjà trouvé.
3. Parcours les cases comme coins bas-droits. En chaque case, tant que le carré de côté `meilleur + 1` qui finit là tient dans la grille et contient au plus T cases marquées, augmente `meilleur`. Le total des augmentations ne dépasse pas min(N, M).

## Solution
**Compter vite les cases d'un carré.** On calcule `pref[i][j]`, le nombre de cases marquées dans le rectangle formé par les i premières lignes et les j premières colonnes (avec `pref[0][j] = pref[i][0] = 0`). Le carré de côté k dont le coin bas-droit est la case (i, j) contient alors
`pref[i][j] − pref[i − k][j] − pref[i][j − k] + pref[i − k][j − k]`
cases marquées : on enlève la bande du haut et la bande de gauche, puis on rajoute le coin en haut à gauche, enlevé deux fois. Le tableau se remplit ligne par ligne : `pref[i][j] = pref[i − 1][j] + (cases marquées parmi les j premières de la ligne i)`.

**Ne jamais revenir en arrière.** Si un carré de côté k convient, le carré de côté k − 1 qui a le même coin bas-droit est à l'intérieur, donc il convient aussi. On parcourt les cases (i, j) comme coins bas-droits, en gardant `meilleur`, le plus grand côté trouvé. En chaque case, on teste seulement le carré de côté `meilleur + 1` : s'il convient (et tient dans la grille), on augmente `meilleur` et on recommence ; sinon on passe à la case suivante.

Pourquoi c'est juste : prenons un carré optimal de côté K et son coin bas-droit c. Quand on arrive en c, si `meilleur < K`, le carré de côté `meilleur + 1` qui finit en c est inclus dans le carré optimal, donc il convient : `meilleur` monte jusqu'à K. Et `meilleur` ne dépasse jamais K, puisqu'on ne l'augmente que quand on a trouvé un carré qui convient.

**Complexité.** Le tableau `pref` se calcule en O(N × M). Ensuite, chaque case fait un test qui échoue, plus des tests réussis qui augmentent `meilleur` ; il y en a au plus min(N, M) en tout. Total : O(N × M), soit environ 160 000 opérations.

**Pourquoi la solution naïve est trop lente.** Pour chaque taille K et chaque position, compter les cases du carré une par une coûte de l'ordre de N × M × K² par taille : des milliards d'opérations pour N = M = 400. Même avec les sommes préfixes, essayer toutes les tailles en chaque case fait N × M × min(N, M) ≈ 6 × 10⁷ tests : ça passe en C++, mais c'est beaucoup trop lent en Python. Une dichotomie sur K (un carré de côté K qui convient prouve que K − 1 convient aussi) donne O(N × M × log(min(N, M))), une autre bonne solution.

**Pièges.**
- Les indices du tableau `pref` sont décalés de 1 par rapport à la grille : `pref[i][j]` couvre les lignes 0 à i − 1 de la grille.
- Le carré de côté k ne tient dans la grille que si k ≤ i et k ≤ j : vérifie-le avant de lire `pref[i − k]`.
- La réponse peut valoir `0` : quand T vaut `0` et que toutes les cases sont marquées.
