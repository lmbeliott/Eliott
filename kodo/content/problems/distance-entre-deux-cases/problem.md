---
id: distance-entre-deux-cases
title: Distance entre deux cases
chapter: n2-grilles
order: 1
tags: [grilles, boucles]
samples: 2
---

## Énoncé
On te donne une grille rectangulaire. Une case est marquée `A`, une autre est marquée `B`, et toutes les autres cases valent `.`.

À chaque pas, on passe d'une case à une case voisine : en haut, en bas, à gauche ou à droite (jamais en diagonale). Il n'y a aucun obstacle dans la grille.

Écris un programme qui affiche le nombre minimum de pas pour aller de la case `A` à la case `B`.

## Entrée
- La première ligne contient deux entiers `H` et `W` : le nombre de lignes et le nombre de colonnes de la grille.
- Les `H` lignes suivantes contiennent chacune `W` caractères : la grille. Elle contient exactement un `A` et exactement un `B` ; toutes les autres cases valent `.`.

## Sortie
Un seul entier : le nombre minimum de pas pour aller de `A` à `B`.

## Contraintes
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50
- La grille a au moins deux cases.

## Indices
1. Commence par retrouver la ligne et la colonne de `A`, puis celles de `B`, en parcourant toutes les cases avec deux boucles imbriquées.
2. Sans obstacle, il faut faire autant de pas verticaux que l'écart entre les deux lignes, et autant de pas horizontaux que l'écart entre les deux colonnes.
3. L'écart entre deux nombres `a` et `b` est `abs(a - b)` : il est toujours positif, que `B` soit au-dessus ou au-dessous de `A`, à gauche ou à droite.

## Solution
On parcourt la grille avec deux boucles imbriquées : la ligne `i` de `0` à `H - 1` et la colonne `j` de `0` à `W - 1`. Quand `grille[i][j]` vaut `A`, on retient `(i, j)` comme position de `A` ; quand il vaut `B`, comme position de `B`.

Comme il n'y a pas d'obstacle, on peut d'abord faire tous les pas verticaux, puis tous les pas horizontaux. On ne peut pas faire mieux, car chaque pas ne change que la ligne **ou** la colonne, et seulement de 1. La réponse est donc `abs(ligneA - ligneB) + abs(colonneA - colonneB)`. On l'appelle la **distance de Manhattan**, du nom des rues en quadrillage de cette ville.

Le piège : écrire `ligneB - ligneA` sans valeur absolue. Le résultat est faux (et parfois négatif) dès que `B` est au-dessus ou à gauche de `A`.
