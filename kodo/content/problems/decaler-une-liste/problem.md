---
id: decaler-une-liste
title: Décaler une liste
chapter: n1-listes
order: 5
tags: [listes]
samples: 2
---

## Énoncé
On décale une liste de `N` nombres de `K` positions vers la gauche : chaque nombre avance de `K` places vers le début de la liste, et ceux qui sortent par le début reviennent à la fin, dans le même ordre, comme s'ils faisaient le tour.

Par exemple, la liste `1 2 3 4 5` décalée de 2 positions devient `3 4 5 1 2`. Décalée de 7 positions, elle devient aussi `3 4 5 1 2`.

Écris un programme qui affiche la liste décalée.

## Entrée
- La première ligne contient deux entiers `N` et `K` : le nombre d'éléments de la liste et le décalage.
- La deuxième ligne contient `N` entiers séparés par des espaces : la liste.

## Sortie
Une seule ligne : les `N` nombres de la liste décalée, séparés par des espaces.

## Contraintes
- 1 ≤ N ≤ 1 000
- 0 ≤ K ≤ 1 000 000 000
- Chaque nombre est compris entre -1 000 et 1 000.

## Indices
1. Décaler une liste de `N` positions la ramène exactement à son point de départ. Un décalage de `K` donne donc le même résultat qu'un décalage de `K % N`.
2. Dans la liste décalée, le premier nombre est celui qui était à la position `K % N` dans la liste de départ (en comptant les positions à partir de 0), puis viennent les suivants.
3. Le nombre à la position `i` de la liste décalée est celui qui était à la position `(i + K) % N`. Le reste de la division par `N` fait « faire le tour » aux positions qui dépassent la fin.

## Solution
D'abord, on remarque que `N` décalages ramènent chaque nombre à sa place. On peut donc remplacer `K` par `K % N`, qui est plus petit que `N`. C'est indispensable : décaler la liste un cran à la fois, un milliard de fois, serait beaucoup trop long.

Ensuite, la liste décalée commence par le nombre qui était à la position `K % N`. Plus généralement, le nombre à la position `i` de la liste décalée vient de la position `(i + K) % N` de la liste de départ : le `% N` fait revenir au début les positions qui dépassent la fin. Il suffit donc d'afficher, pour `i` allant de 0 à `N - 1`, la valeur rangée à la position `(i + K) % N`.

Exemple : `N = 4`, `K = 6` et la liste `10 20 30 40`. On a `6 % 4 = 2`, donc on affiche les positions 2, 3, 0, 1 : `30 40 10 20`.

Les pièges : oublier que `K` peut être plus grand que `N` (la position `i + K` sort alors de la liste), et le cas `K = 0`, où la liste ne change pas.
