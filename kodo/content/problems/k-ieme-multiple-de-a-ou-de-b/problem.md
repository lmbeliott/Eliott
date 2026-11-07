---
id: k-ieme-multiple-de-a-ou-de-b
title: K-ième multiple de A ou de B
chapter: p4-dichotomie
order: 3
tags: [dichotomie, mathématiques, arithmétique]
samples: 1
---

## Énoncé
On écrit dans l'ordre croissant tous les entiers strictement positifs qui sont multiples de A, ou de B, ou des deux, sans répétition. Pour A = 4 et B = 6, on obtient 4, 6, 8, 12, 16, 18, 20, 24…

Répondre à T questions : pour A, B et K donnés, afficher le K-ième nombre de cette liste.

## Entrée
La première ligne contient T. Chacune des T lignes suivantes contient trois entiers A, B et K.

## Sortie
T lignes : pour chaque question, le K-ième nombre de la liste.

## Contraintes
- 1 ≤ T ≤ 1 000
- 1 ≤ A, B ≤ 10⁹
- 1 ≤ K ≤ 10⁹

## Indices
1. Il est facile de **compter** les nombres de la liste qui sont au plus x : il y a ⌊x/A⌋ multiples de A, ⌊x/B⌋ multiples de B, et il ne faut pas compter deux fois les multiples communs.
2. Les multiples communs de A et de B sont exactement les multiples de leur PPCM, qui vaut A / PGCD(A, B) × B.
3. Le nombre cherché est le plus petit x tel que ce compte atteint K : une dichotomie sur x, entre 1 et K × min(A, B).

## Solution
**Compter au lieu d'énumérer.** Notons f(x) le nombre d'éléments de la liste qui sont au plus x. Parmi 1, …, x, il y a ⌊x/A⌋ multiples de A et ⌊x/B⌋ multiples de B ; les nombres comptés deux fois sont les multiples communs, c'est-à-dire les multiples de L = PPCM(A, B). Donc f(x) = ⌊x/A⌋ + ⌊x/B⌋ − ⌊x/L⌋. On calcule L = A / PGCD(A, B) × B, en divisant **avant** de multiplier ; L est au plus A × B ≤ 10¹⁸ et tient dans un `long long`.

**Chercher la réponse.** f est croissante (au sens large). Le K-ième nombre de la liste est le plus petit x tel que f(x) ≥ K : en dessous, il y a moins de K nombres au plus x ; et x lui-même est dans la liste, car f augmente exactement aux éléments de la liste. On fait une dichotomie avec l'invariant « f(lo) < K ≤ f(hi) », en partant de lo = 0 et hi = K × min(A, B) : les K premiers multiples du plus petit des deux sont déjà dans la liste, donc f(hi) ≥ K. Ce nombre vaut au plus 10¹⁸.

**Coût.** Une soixantaine d'étapes par question, chacune en O(1), plus un PGCD : instantané. Énumérer la liste en fusionnant les multiples de A et de B demanderait K étapes, jusqu'à 10⁹ par question.
