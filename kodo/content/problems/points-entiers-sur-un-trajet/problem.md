---
id: points-entiers-sur-un-trajet
title: Points entiers sur un trajet
chapter: n3-arithmetique
order: 1
tags: [mathématiques, arithmétique]
samples: 2
---

## Énoncé
Un trajet relie N points du plan dans l'ordre : il part du point P_1, va en ligne droite jusqu'au point P_2, puis en ligne droite jusqu'à P_3, et ainsi de suite jusqu'à P_N. Les coordonnées des points sont des entiers.

Écris un programme qui compte combien de fois le trajet passe par un point **à coordonnées entières**, en comptant le point de départ. Si le trajet passe plusieurs fois par le même point, chaque passage compte. Le point d'arrivée d'un segment est aussi le point de départ du suivant : il ne compte qu'une fois à cet endroit.

## Entrée
- La première ligne contient un entier N.
- Les N lignes suivantes contiennent chacune deux entiers x et y : les coordonnées des points P_1, P_2, …, P_N.

## Sortie
Un seul entier : le nombre de passages du trajet par des points à coordonnées entières.

## Contraintes
- 2 ≤ N ≤ 5 000
- −10⁹ ≤ x, y ≤ 10⁹
- Deux points qui se suivent sont toujours différents.

## Indices
1. Traite les segments un par un. Sur le segment de P_i à P_(i+1), compte les points à coordonnées entières **sans** P_i (déjà compté), mais avec P_(i+1).
2. Avance sur un segment par petits pas égaux. Avec des écarts dx et dy (en valeur absolue), le plus petit pas qui retombe sur un point entier est (dx / g, dy / g), où g = PGCD(dx, dy).
3. Un segment d'écarts dx et dy contient donc g + 1 points entiers, extrémités comprises. Calcule le PGCD avec l'algorithme d'Euclide : essayer chaque abscisse une par une est beaucoup trop lent quand les coordonnées sont grandes.

## Solution
**L'idée : le PGCD des écarts.** Prenons un segment de P_i à P_(i+1), avec `dx = |x_(i+1) − x_i|` et `dy = |y_(i+1) − y_i|`, et notons `g = PGCD(dx, dy)`. En partant de P_i, on avance par pas de (dx / g, dy / g) dans la bonne direction : ce sont des entiers, donc chaque pas tombe sur un point entier, et il faut exactement g pas pour arriver à P_(i+1).

Il n'y a pas d'autre point entier sur le segment : un point entier du segment est à un écart (a, b) de P_i, avec a / dx = b / dy. Comme dx / g et dy / g n'ont plus de diviseur commun, (a, b) est forcément un multiple de (dx / g, dy / g). Le segment contient donc g + 1 points entiers, dont g sans compter P_i.

La réponse est `1 + PGCD(dx_1, dy_1) + PGCD(dx_2, dy_2) + …` : le point de départ, puis, pour chaque segment, ses points entiers sans son point de départ. Le cas d'un segment vertical ou horizontal marche aussi : `PGCD(0, dy) = dy`.

Sur le premier exemple, le segment de (0, 0) à (6, 4) a g = 2 (il passe par (3, 2)), et celui de (6, 4) à (6, −2) a g = 6 : la réponse est 1 + 2 + 6 = 9.

**Complexité.** L'algorithme d'Euclide fait au plus une cinquantaine d'étapes pour des nombres jusqu'à 2 × 10⁹. Total : O(N log M), où M est le plus grand écart.

**Pourquoi la solution naïve est trop lente.** Essayer chaque abscisse entre x_i et x_(i+1) et tester si l'ordonnée correspondante est entière coûte jusqu'à 2 × 10⁹ opérations pour un seul segment.

**Pièges.**
- Les écarts vont jusqu'à 2 × 10⁹ et la réponse jusqu'à environ 10¹³ : utilise des `long long` en C++.
- Prends les valeurs absolues des écarts avant de calculer le PGCD.
- Ne compte pas deux fois les points communs à deux segments qui se suivent.
