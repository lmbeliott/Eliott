---
id: case-marquee-la-plus-proche
title: Case marquée la plus proche
chapter: n4-graphes
order: 2
tags: [graphes, parcours-en-largeur, grilles]
samples: 2
---

## Énoncé
Une grille de `R` lignes et `C` colonnes contient des cases libres, des murs et des cases marquées. On se déplace d'une case à une case voisine (haut, bas, gauche ou droite), sans jamais entrer dans un mur.

Pour chaque case libre, on appelle **distance à la marque** le nombre minimal de déplacements nécessaires pour atteindre une case marquée, n'importe laquelle. Écris un programme qui calcule la plus grande distance à la marque parmi les cases libres d'où l'on peut atteindre une case marquée, ainsi que le nombre de cases libres d'où aucune case marquée n'est atteignable.

## Entrée
- La première ligne contient deux entiers `R` et `C` : le nombre de lignes et de colonnes de la grille.
- Les `R` lignes suivantes contiennent chacune `C` caractères : `.` pour une case libre, `#` pour un mur, `*` pour une case marquée.

La grille contient au moins une case marquée.

## Sortie
Deux lignes :
- la plus grande distance à la marque parmi les cases libres d'où une case marquée est atteignable (`0` s'il n'y a aucune telle case) ;
- le nombre de cases libres d'où aucune case marquée n'est atteignable.

## Contraintes
- 1 ≤ R, C ≤ 300

## Indices
1. Un parcours en largeur depuis **une** case marquée donne la distance de chaque case à celle-ci. Mais lancer un parcours par case marquée coûte cher quand il y en a des milliers.
2. Imagine que toutes les cases marquées lancent leur parcours en même temps, au même pas : la première vague qui atteint une case vient de la case marquée la plus proche.
3. Mets **toutes** les cases marquées dans la file au départ, avec la distance `0`, puis fais un seul parcours en largeur normal. Les cases libres jamais atteintes sont celles d'où aucune case marquée n'est accessible.

## Solution
On fait un **parcours en largeur à sources multiples** : au départ, la file contient toutes les cases marquées, chacune à distance `0`. Ensuite, c'est un parcours en largeur ordinaire : on retire une case de la file, et chaque voisine qui n'est pas un mur et pas encore atteinte reçoit la distance de la case plus un et entre dans la file.

Pourquoi c'est correct : c'est exactement comme si l'on ajoutait une case fictive reliée à toutes les cases marquées, et qu'on faisait un parcours depuis elle. La file contient d'abord les cases à distance `0`, puis toutes celles à distance `1`, puis `2`… donc chaque case est atteinte pour la première fois depuis la case marquée la plus proche.

Chaque case entre au plus une fois dans la file et a quatre voisines : la complexité est **O(R × C)**, environ 360 000 opérations au maximum.

La solution naïve lance un parcours en largeur depuis chaque case marquée et garde le minimum : avec `K` cases marquées, cela coûte O(K × R × C). Avec quelques milliers de cases marquées sur une grille de 300 × 300, on dépasse 10⁸ opérations.

Pièges :
- Les cases d'où aucune case marquée n'est atteignable gardent leur marque « non visitée » : il ne faut pas les compter dans le maximum.
- Pour éviter de tester les bords à chaque pas, on peut entourer la grille d'une bordure de murs.
- Marque une case comme atteinte dès que tu la mets dans la file, pas quand tu la retires.
