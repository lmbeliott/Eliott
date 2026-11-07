---
id: nature-d-un-triangle
title: Nature d'un triangle
chapter: p1-booleens
order: 2
tags: [conditions]
samples: 4
---

## Énoncé
On veut construire un triangle dont les côtés mesurent `A`, `B` et `C`. C'est possible seulement si chaque côté est strictement plus court que la somme des deux autres. Dire si le triangle est impossible, et sinon s'il est équilatéral (trois côtés égaux), isocèle (exactement deux côtés égaux) ou quelconque (trois côtés différents).

## Entrée
Une seule ligne contenant trois entiers `A`, `B` et `C`.

## Sortie
Un seul mot : `IMPOSSIBLE`, `EQUILATERAL`, `ISOCELE` ou `QUELCONQUE`.

## Contraintes
- 1 ≤ A, B, C ≤ 1 000 000

## Indices
1. Le triangle est possible quand `A < B + C` **et** `B < A + C` **et** `C < A + B`.
2. « Au moins deux côtés égaux » s'écrit `A == B or B == C or A == C`.
3. Dans quel ordre tester les cas pour que chaque triangle tombe dans la bonne catégorie ?

## Solution
On teste d'abord si le triangle est possible : il faut que les trois inégalités `A < B + C`, `B < A + C` et `C < A + B` soient toutes vraies, ce qui s'écrit avec deux `and`. Si l'une est fausse, on affiche `IMPOSSIBLE`.

Sinon, on classe le triangle, du cas le plus particulier au plus général :
- si `A == B and B == C`, il est équilatéral ;
- sinon, si `A == B or B == C or A == C`, il a exactement deux côtés égaux (le cas des trois a déjà été traité) : isocèle ;
- sinon, quelconque.

Les pièges : un triangle « plat », comme `2 3 5`, n'est pas un vrai triangle, car 5 n'est pas **strictement** plus petit que 2 + 3 ; et un triangle équilatéral a aussi deux côtés égaux, il faut donc le reconnaître avant de tester l'isocèle.
