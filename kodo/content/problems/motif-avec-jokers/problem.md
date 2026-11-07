---
id: motif-avec-jokers
title: Motif avec jokers
chapter: p3-chaines-avancees
order: 4
tags: [chaînes]
samples: 2
---

## Énoncé
Un texte `T` et un motif `P` sont formés de lettres minuscules, mais le motif peut aussi contenir des **jokers** `?`. Un joker remplace n'importe quelle lettre. Le motif apparaît à la position `i` du texte si chaque caractère de `P` est un joker ou est égal à la lettre du texte placée en face de lui, à partir de la position `i`.

Trouver toutes les positions où le motif apparaît. Les apparitions peuvent se chevaucher. Les positions sont numérotées à partir de 1.

## Entrée
- La première ligne contient le texte `T`.
- La deuxième ligne contient le motif `P`.

## Sortie
- Sur la première ligne, le nombre d'apparitions du motif.
- S'il y en a au moins une, sur la deuxième ligne, leurs positions dans l'ordre croissant, séparées par des espaces.

## Contraintes
- 1 ≤ longueur de `T` ≤ 50 000
- 1 ≤ longueur de `P` ≤ 10 (le motif peut être plus long que le texte)

## Indices
1. Les outils tout faits (`in`, `find`, `count`) ne connaissent pas les jokers : il faut comparer à la main.
2. Pour chaque position de départ `i` possible, on compare le motif au texte caractère par caractère, et on s'arrête au premier désaccord.
3. La dernière position de départ possible est `len(T) − len(P)` (en indice, à partir de 0). Si le motif est plus long que le texte, il n'y en a aucune.

## Solution
C'est la recherche naïve du cours, avec une règle d'égalité modifiée. Pour chaque indice de départ `i` de 0 à `n − m` (où `n` et `m` sont les longueurs du texte et du motif), on avance un indice `j` tant que `j < m` et que `P[j]` est un joker ou vaut `T[i + j]`. Si `j` atteint `m`, tous les caractères du motif ont été validés : le motif apparaît à l'indice `i`, c'est-à-dire à la position `i + 1`. Si `m > n`, la boucle ne fait aucun tour et la réponse est 0.

Pourquoi c'est juste : la boucle intérieure maintient la propriété « les `j` premiers caractères du motif correspondent au texte à partir de `i` ». Elle s'arrête soit au premier désaccord (pas d'apparition), soit quand `j = m` (apparition). Comme on essaie toutes les positions de départ, aucune apparition n'est oubliée, chevauchements compris.

Coût : au plus `m` comparaisons par position de départ, donc au plus `(n − m + 1) × m ≤ 500 000` comparaisons, ce qui est rapide. Le pire cas est un texte comme `aaaa…a` avec le motif `aaaaaaaaa?`, où chaque position demande `m` comparaisons. On range les positions dans une liste et on les affiche à la fin avec `join` (en C++, on construit la ligne avec `+=` ou on affiche au fur et à mesure).
