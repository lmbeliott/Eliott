---
id: carres-de-points
title: Carrés de points
chapter: p2-dictionnaires
order: 8
synthesis: true
tags: [dictionnaires, mathématiques, boucles]
samples: 2
---

## Énoncé
`N` points distincts à coordonnées entières sont placés dans le plan. Compter les carrés dont les quatre sommets font partie de ces points. Les carrés peuvent être penchés : leurs côtés ne sont pas forcément horizontaux et verticaux.

Par exemple, les 9 points d'une grille 3 × 3 forment 6 carrés : quatre petits carrés de côté 1, le grand carré de côté 2, et un carré penché dont les sommets sont les milieux des bords.

## Entrée
La première ligne contient l'entier `N`. Les `N` lignes suivantes contiennent chacune les coordonnées `x` et `y` d'un point, séparées par une espace.

## Sortie
Un seul entier : le nombre de carrés.

## Contraintes
- 1 ≤ N ≤ 500
- -1 000 ≤ x, y ≤ 1 000
- Les points sont tous différents.

## Indices
1. Essayer tous les quadruplets de points demande environ N⁴ / 24, soit 2,6 milliards de cas : trop. Mais deux points `A` et `B` suffisent à décrire un côté, et un côté suffit à reconstruire le carré.
2. Si `B - A` est le vecteur `(dx, dy)`, le tourner d'un quart de tour dans le sens direct donne `(-dy, dx)`. Les deux autres sommets sont alors `B + (-dy, dx)` et `A + (-dy, dx)`.
3. Ranger les points dans un ensemble de couples `(x, y)` pour tester vite s'ils existent. Compter combien de fois chaque carré est trouvé quand on essaie tous les couples `(A, B)`.

## Solution
Un carré est entièrement déterminé par un de ses côtés et par le côté où il se trouve. Prenons deux points `A` et `B`, et notons `(dx, dy) = (xB - xA, yB - yA)`. Tourner ce vecteur d'un quart de tour dans le sens inverse des aiguilles d'une montre donne `(-dy, dx)` : même longueur, direction perpendiculaire. Les points `C = B + (-dy, dx)` et `D = A + (-dy, dx)` complètent alors `A`, `B` en un carré `ABCD`, parcouru dans le sens direct.

On range tous les points dans un **ensemble de couples** `(x, y)`. Pour chaque couple ordonné `(A, B)` de points différents, on calcule `C` et `D` et on teste s'ils sont dans l'ensemble. Une petite fonction `est_present(x, y)` rend ce test lisible.

Combien de fois chaque carré est-il compté ? Un carré a quatre côtés ; parcouru dans le sens direct, chacun donne exactement un couple ordonné `(A, B)` pour lequel le test réussit. Le couple `(B, A)`, lui, construit le carré situé de l'autre côté de `AB`. Chaque carré est donc compté exactement 4 fois, et la réponse est le total divisé par 4.

Il y a `N × (N - 1)`, soit environ 250 000 couples, chacun avec deux tests d'appartenance quasi instantanés grâce à l'ensemble. Avec une liste de points, chaque test parcourrait les 500 points : 250 millions d'opérations.

En C++, on utilise un `set<pair<int, int>>`. Les coordonnées calculées peuvent sortir de l'intervalle [-1 000, 1 000] : ce n'est pas un problème, le point n'est simplement pas dans l'ensemble.
