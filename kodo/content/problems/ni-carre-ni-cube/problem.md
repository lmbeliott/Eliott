---
id: ni-carre-ni-cube
title: Ni carré ni cube
chapter: p4-dichotomie
order: 6
tags: [dichotomie, mathématiques]
samples: 1
---

## Énoncé
On écrit dans l'ordre croissant les entiers strictement positifs qui ne sont **ni un carré** (1, 4, 9, 16, …) **ni un cube** (1, 8, 27, 64, …) : 2, 3, 5, 6, 7, 10, 11, 12, 13, 14, 15, 17…

Répondre à T questions : pour K donné, afficher le K-ième nombre de cette liste.

## Entrée
La première ligne contient T. Chacune des T lignes suivantes contient un entier K.

## Sortie
T lignes : pour chaque question, le K-ième nombre de la liste.

## Contraintes
- 1 ≤ T ≤ 100
- 1 ≤ K ≤ 10¹⁸

## Indices
1. Compter les nombres de la liste qui sont au plus x : il faut retirer à x le nombre de carrés et le nombre de cubes au plus x, sans retirer deux fois les nombres qui sont à la fois des carrés et des cubes.
2. Un nombre est à la fois un carré et un cube si et seulement si c'est une puissance sixième. Il y a ⌊√x⌋ carrés au plus x : ce sont des racines entières, à calculer sans nombres à virgule.
3. La réponse est le plus petit x dont le compte atteint K ; elle est comprise entre K et 2K.

## Solution
**Compter.** Parmi 1, …, x, il y a ⌊√x⌋ carrés (1², 2², …, ⌊√x⌋²) et ⌊∛x⌋ cubes. Un entier n ≥ 1 est à la fois un carré et un cube si et seulement si c'est une puissance sixième : dans sa décomposition en facteurs premiers, chaque exposant est pair et multiple de 3, donc multiple de 6. Il y en a ⌊x^(1/6)⌋. Le nombre d'éléments de la liste au plus x est donc f(x) = x − ⌊√x⌋ − ⌊∛x⌋ + ⌊x^(1/6)⌋.

**Racines entières exactes.** Ces racines se calculent par dichotomie, comme dans le cours, avec des puissances calculées sans débordement. On peut aussi remarquer que ⌊x^(1/6)⌋ = ⌊∛⌊√x⌋⌋. Les fonctions flottantes donnent des erreurs d'une unité pour les grands x, et les tests contiennent des carrés et des cubes proches de 10¹⁸.

**Chercher la réponse.** f est croissante au sens large, et augmente exactement sur les éléments de la liste : le K-ième élément est le plus petit x tel que f(x) ≥ K. Comme f(x) ≤ x, la réponse est au moins K ; et f(2K) ≥ K, car il y a au plus √(2K) + ∛(2K) carrés ou cubes jusqu'à 2K, ce qui ne dépasse pas K. Une dichotomie entre K − 1 (f(K − 1) < K) et 2K trouve la réponse en une soixantaine d'étapes, chacune avec deux ou trois racines entières.

**Coût.** Quelques milliers d'opérations par question. Énumérer les entiers un par un demanderait de l'ordre de K étapes, jusqu'à 10¹⁸.
