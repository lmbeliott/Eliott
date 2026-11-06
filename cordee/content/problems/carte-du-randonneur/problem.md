---
id: carte-du-randonneur
title: La carte du randonneur
chapter: n2-grilles
order: 1
tags: [grilles, boucles]
samples: 2
---

## Énoncé
Yanis s'est un peu éloigné du sentier. Heureusement, il a une carte quadrillée de l'alpage : sa position y est marquée par un `Y` et celle du refuge par un `R`. Toutes les autres cases sont de l'herbe, notée `.`.

À chaque pas, Yanis passe d'une case à une case voisine : en haut, en bas, à gauche ou à droite (jamais en diagonale). Il n'y a aucun obstacle sur l'alpage.

Écris un programme qui affiche le nombre minimum de pas dont Yanis a besoin pour rejoindre le refuge.

## Entrée
- La première ligne contient deux entiers `H` et `W` : le nombre de lignes et le nombre de colonnes de la carte.
- Les `H` lignes suivantes contiennent chacune `W` caractères : la carte. Elle contient exactement un `Y` et exactement un `R` ; toutes les autres cases valent `.`.

## Sortie
Un seul entier : le nombre minimum de pas pour aller de `Y` à `R`.

## Contraintes
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50
- La carte a au moins deux cases.

## Indices
1. Commence par retrouver la ligne et la colonne de `Y`, puis celles de `R`, en parcourant toutes les cases avec deux boucles imbriquées.
2. Sans obstacle, Yanis doit faire autant de pas verticaux que l'écart entre les deux lignes, et autant de pas horizontaux que l'écart entre les deux colonnes.
3. L'écart entre deux nombres `a` et `b` est `abs(a - b)` : il est toujours positif, que le refuge soit au-dessus ou au-dessous, à gauche ou à droite.

## Solution
On parcourt la carte avec deux boucles imbriquées : la ligne `i` de `0` à `H - 1` et la colonne `j` de `0` à `W - 1`. Quand `carte[i][j]` vaut `Y`, on retient `(i, j)` comme position de Yanis ; quand il vaut `R`, comme position du refuge.

Comme il n'y a pas d'obstacle, Yanis peut d'abord faire tous ses pas verticaux, puis tous ses pas horizontaux. Il ne peut pas faire mieux, car chaque pas ne change que la ligne **ou** la colonne, et seulement de 1. La réponse est donc `abs(ligneY - ligneR) + abs(colonneY - colonneR)`. On l'appelle la **distance de Manhattan**, du nom des rues en quadrillage de cette ville.

Le piège : écrire `ligneR - ligneY` sans valeur absolue. Le résultat est faux (et parfois négatif) dès que le refuge est au-dessus ou à gauche de Yanis.
