---
id: abris-les-plus-proches
title: Les abris les plus proches
chapter: n4-graphes
order: 2
tags: [graphes, parcours-en-largeur, grilles]
samples: 2
---

## Énoncé
Le service des pistes de Valcorde prépare une carte de sécurité du plateau des Aiguilles. La carte est une grille : chaque case est une prairie, un rocher infranchissable ou un abri d'urgence. Par mauvais temps, un randonneur doit pouvoir rejoindre vite l'abri le plus proche, en se déplaçant d'une case à une case voisine (haut, bas, gauche ou droite) sans traverser de rocher.

Pour chaque case de prairie, on appelle **distance à l'abri** le nombre minimal de déplacements nécessaires pour atteindre un abri, n'importe lequel. Écris un programme qui calcule la plus grande distance à l'abri parmi les prairies d'où l'on peut atteindre un abri, ainsi que le nombre de prairies d'où aucun abri n'est atteignable.

## Entrée
- La première ligne contient deux entiers `R` et `C` : le nombre de lignes et de colonnes de la carte.
- Les `R` lignes suivantes contiennent chacune `C` caractères : `.` pour une prairie, `#` pour un rocher, `A` pour un abri.

La carte contient au moins un abri.

## Sortie
Deux lignes :
- la plus grande distance à l'abri parmi les prairies d'où un abri est atteignable (`0` s'il n'y a aucune telle prairie) ;
- le nombre de prairies d'où aucun abri n'est atteignable.

## Contraintes
- 1 ≤ R, C ≤ 300

## Indices
1. Un parcours en largeur depuis **un** abri donne la distance de chaque case à cet abri. Mais lancer un parcours par abri coûte cher quand il y a des milliers d'abris.
2. Imagine que tous les abris lancent leur parcours en même temps, au même pas : la première vague qui atteint une case vient de l'abri le plus proche.
3. Mets **tous** les abris dans la file au départ, avec la distance `0`, puis fais un seul parcours en largeur normal. Les prairies jamais atteintes sont celles qui n'ont aucun abri accessible.

## Solution
On fait un **parcours en largeur à sources multiples** : au départ, la file contient tous les abris, chacun à distance `0`. Ensuite, c'est un parcours en largeur ordinaire : on retire une case de la file, et chaque voisine libre pas encore atteinte reçoit la distance de la case plus un et entre dans la file.

Pourquoi c'est correct : c'est exactement comme si l'on ajoutait une case fictive reliée à tous les abris, et qu'on faisait un parcours depuis elle. La file contient d'abord les cases à distance `0`, puis toutes celles à distance `1`, puis `2`… donc chaque case est atteinte pour la première fois par l'abri le plus proche.

Chaque case entre au plus une fois dans la file et a quatre voisines : la complexité est **O(R × C)**, environ 360 000 opérations au maximum.

La solution naïve lance un parcours en largeur depuis chaque abri et garde le minimum : avec `K` abris, cela coûte O(K × R × C). Avec quelques milliers d'abris sur une carte de 300 × 300, on dépasse 10⁸ opérations.

Pièges :
- Les cases d'où aucun abri n'est atteignable gardent leur marque « non visitée » : il ne faut pas les compter dans le maximum.
- Pour éviter de tester les bords à chaque pas, on peut entourer la carte d'une bordure de rochers.
- Marque une case comme atteinte dès que tu la mets dans la file, pas quand tu la retires.
