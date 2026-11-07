---
id: paires-diviseur-multiple
title: Paires diviseur-multiple
chapter: p3-tableaux-avances
order: 7
tags: [listes, mathématiques]
samples: 2
---

## Énoncé
Un tableau de `N` entiers strictement positifs est donné. Compter les couples de positions `(i, j)`, avec `i ≠ j`, tels que la valeur en position `i` divise la valeur en position `j`. Les couples `(i, j)` et `(j, i)` sont différents : si deux positions portent la même valeur, elles donnent deux couples.

Par exemple, avec `2 3 6 2`, les couples qui conviennent sont `2 | 6` (deux fois, avec chacun des deux `2`), `3 | 6`, et `2 | 2` (deux fois, dans un sens et dans l'autre) : la réponse est 5.

## Entrée
- La première ligne contient `N`.
- La deuxième ligne contient les `N` entiers.

## Sortie
Le nombre de couples.

## Contraintes
- 1 ≤ N ≤ 20 000
- Les valeurs sont comprises entre 1 et 100 000.

## Indices
1. Tester tous les couples ferait 400 millions de divisions : trop lent. Les valeurs sont petites : un tableau de fréquences `f`, où `f[v]` est le nombre de positions qui portent la valeur `v`, résume toute l'entrée.
2. Pour une valeur `d` présente, ses multiples sont `d`, `2d`, `3d`, … jusqu'à la plus grande valeur `V`. Les parcourir coûte environ `V / d` étapes.
3. Combien coûtent ces parcours pour toutes les valeurs `d` de 1 à `V` ? La somme `V/1 + V/2 + V/3 + … + V/V` est bien plus petite qu'on ne le croit.

## Solution
On construit le tableau de fréquences `f` : `f[v]` est le nombre de positions de valeur `v`, pour `v` de 1 à `V`, la plus grande valeur. Pour une valeur `d` présente (`f[d] > 0`), on compte les positions dont la valeur est un multiple de `d` : `s = f[d] + f[2d] + f[3d] + …` jusqu'à `V`. Chacune des `f[d]` positions de valeur `d` divise ces `s` positions, ce qui donne `f[d] × s` couples. En additionnant sur tous les `d`, chaque couple `(i, j)` tel que `A[i]` divise `A[j]` est compté exactement une fois, avec `d = A[i]`. Mais on a aussi compté les `N` couples `(i, i)`, puisque chaque valeur se divise elle-même : on les retire à la fin.

**Coût.** Pour une valeur `d`, le parcours des multiples fait `V / d` étapes au plus. Au total, même si toutes les valeurs de 1 à `V` étaient présentes, cela ferait `V × (1 + 1/2 + 1/3 + … + 1/V)` étapes. Cette somme, la **série harmonique**, grandit très lentement : elle vaut environ 12 pour `V = 100 000`. On fait donc au plus 1,2 million d'étapes, contre 400 millions de divisions pour l'essai de tous les couples. La réponse peut atteindre environ 4 × 10⁸ (toutes les valeurs égales) : en C++, on utilise un `long long` par prudence.
