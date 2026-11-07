---
id: multiples-de-3-ou-de-5-pas-des-deux
title: Multiples de 3 ou de 5, pas des deux
chapter: p1-booleens
order: 3
tags: [conditions, boucles]
samples: 2
---

## Énoncé
Compter les entiers de `1` à `N` qui sont multiples de 3 ou multiples de 5, mais pas des deux à la fois. Par exemple, 9 et 10 sont comptés, mais pas 15 (multiple de 3 et de 5) ni 7 (multiple d'aucun des deux).

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
Un seul entier : le nombre d'entiers comptés.

## Contraintes
- 1 ≤ N ≤ 100 000

## Indices
1. On parcourt les entiers `k` de 1 à `N` avec une boucle, et on compte ceux qui conviennent.
2. On peut ranger deux booléens : `par3 = k % 3 == 0` et `par5 = k % 5 == 0`.
3. « L'un ou l'autre, mais pas les deux » : `(par3 or par5) and not (par3 and par5)`. Une écriture plus courte existe : deux booléens sont « l'un vrai, l'autre faux » exactement quand ils sont différents.

## Solution
Pour chaque entier `k` de 1 à `N`, on calcule `par3` et `par5`. L'entier est compté quand exactement un des deux est vrai. On peut l'écrire `(par3 or par5) and not (par3 and par5)` : au moins un des deux, et pas les deux. Plus simplement, deux booléens dont exactement un est vrai sont deux booléens différents : la condition `par3 != par5` dit exactement la même chose.

Le piège est d'écrire seulement `par3 or par5` : le « ou » de la programmation est inclusif, et il compterait aussi 15, 30, 45…

La boucle fait au plus 100 000 tours, ce qui est rapide.
