---
id: robot-sur-une-grille-de-fleches
title: Robot sur une grille de flèches
chapter: p2-synthese
order: 10
synthesis: true
tags: [grilles, dictionnaires, simulation, mathématiques]
samples: 2
---

## Énoncé
Chaque case d'une grille de `R` lignes et `C` colonnes contient une flèche : `^` (haut), `v` (bas), `<` (gauche) ou `>` (droite). Un robot part de la case en haut à gauche. À chaque déplacement, il avance d'une case dans la direction de la flèche de la case où il se trouve. S'il sort de la grille par un bord, il réapparaît sur le bord opposé, dans la même ligne ou la même colonne.

Après `K` déplacements, afficher la position du robot et le nombre de cases différentes par lesquelles il est passé, case de départ comprise.

Par exemple, dans la grille `vv<>` / `>>^<` / `<<<^`, le robot passe par les cases (1, 1), (2, 1), (2, 2), (2, 3), (1, 3), (1, 2), puis revient en (2, 2) et tourne en rond sur 4 cases. Après 3 déplacements, il est en (2, 3) et a vu 4 cases.

## Entrée
La première ligne contient `R`, `C` et `K`. Les `R` lignes suivantes contiennent chacune `C` flèches.

## Sortie
Sur la première ligne, la ligne et la colonne du robot après `K` déplacements, numérotées à partir de 1. Sur la deuxième ligne, le nombre de cases différentes visitées.

## Contraintes
- 1 ≤ R, C ≤ 200
- 0 ≤ K ≤ 10¹⁸ (en C++, utiliser des `long long`)

## Indices
1. Simuler `K` déplacements est impossible quand `K` vaut 10¹⁸. Mais le robot n'a que `R × C` cases possibles : au bout d'au plus `R × C` déplacements, il repasse par une case déjà visitée, et à partir de là il refait exactement le même trajet.
2. Noter le chemin dans une liste (`chemin[t]` est la case après `t` déplacements) et, dans un dictionnaire, le premier instant où chaque case a été atteinte. Quand la case suivante est déjà dans le dictionnaire, on connaît le début du cycle et sa longueur.
3. Si le cycle commence à l'instant `d` et a pour longueur `L`, la position à l'instant `K ≥ d` est `chemin[d + (K - d) % L]`. Attention au cas où `K` est atteint avant de trouver le cycle.

## Solution
Le trajet du robot ne dépend que de sa case : deux passages par la même case sont suivis exactement des mêmes déplacements. Comme il n'y a que `R × C ≤ 40 000` cases, le robot finit par repasser par une case déjà vue, et son trajet devient alors périodique. Le chemin a la forme d'une « queue » suivie d'un **cycle**.

On découpe le programme en morceaux simples :
- une fonction `case_suivante(grille, i, j)` renvoie la case pointée par la flèche, avec `% R` et `% C` pour ressortir de l'autre côté (en C++, un reste négatif impose d'ajouter `R` ou `C` avant de reprendre le reste) ;
- une liste `chemin` où `chemin[t]` est la case occupée après `t` déplacements ;
- un dictionnaire `instant` qui associe à chaque case, repérée par le couple `(i, j)`, l'instant de son premier passage.

On prolonge le chemin tant qu'on n'a pas atteint l'instant `K` et que la case suivante est nouvelle. Deux cas se présentent alors.

1. On atteint l'instant `K` sans repasser par une case : la réponse est `chemin[K]`, et le robot a vu `K + 1` cases différentes.
2. La case suivante est déjà dans `instant` : le cycle commence à `d = instant[case]` et sa longueur est `L = len(chemin) - d`. Pour `K ≥ d`, la position à l'instant `K` est la même qu'à l'instant `d + (K - d) % L`, puisque le robot repasse au même endroit tous les `L` déplacements. Toutes les cases du chemin ont été visitées, et aucune autre ne le sera : la réponse est `len(chemin)`.

La simulation fait au plus 40 000 déplacements, quelle que soit la valeur de `K`. Le dictionnaire est essentiel : avec un test `in` sur la liste `chemin`, chaque déplacement parcourrait tout le chemin déjà fait, soit jusqu'à 800 millions de comparaisons sur une grille de 200 × 200. Une grille de booléens de même taille que la grille de flèches conviendrait aussi, puisque les cases sont de petits couples d'entiers.

Les pièges : confondre « nombre de déplacements » et « nombre de cases » (après `K` déplacements, le robot a occupé `K + 1` positions) ; oublier que le cycle ne commence pas forcément à la case de départ ; utiliser un `int` pour `K` en C++.
