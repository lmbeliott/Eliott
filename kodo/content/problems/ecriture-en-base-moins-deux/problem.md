---
id: ecriture-en-base-moins-deux
title: Écriture en base moins deux
chapter: p3-correction
order: 4
tags: [arithmétique, mathématiques]
samples: 2
---

## Énoncé
En base −2, on écrit un entier avec des chiffres 0 et 1, le chiffre de rang `i` (en partant de 0 à droite) valant `(−2)ⁱ`. Par exemple, `11011` vaut `16 − 8 + 0 − 2 + 1 = 7`, et `11` vaut `−2 + 1 = −1`. Tout entier, positif ou négatif, a une unique écriture en base −2 qui ne commence pas par 0 (sauf 0 lui-même, qui s'écrit `0`).

Pour chacun des `T` entiers donnés, afficher son écriture en base −2.

## Entrée
- La première ligne contient `T`.
- Les `T` lignes suivantes contiennent chacune un entier `N`.

## Sortie
Pour chaque entier, une ligne avec son écriture en base −2.

## Contraintes
- 1 ≤ T ≤ 1 000
- −10¹⁸ ≤ N ≤ 10¹⁸

## Indices
1. Comme en base 2, le chiffre de droite est fixé par la parité de `N` : c'est 0 si `N` est pair, 1 sinon.
2. Une fois le chiffre de droite `r` retiré, le reste de l'écriture représente `(N − r) / (−2)`. On recommence avec ce nombre, jusqu'à 0.
3. Pourquoi la boucle s'arrête-t-elle ? Regarder comment évolue `|n|`, et traiter à part les cas `n = 1` et `n = −1`.

## Solution
Si `N` s'écrit `c_k … c_1 c_0` en base −2, alors `N = c_0 + (−2) × M`, où `M` s'écrit `c_k … c_1`. Le chiffre `c_0` a donc la parité de `N`, et `M = (N − c_0) / (−2)`, division exacte puisque `N − c_0` est pair. On obtient les chiffres de droite à gauche : tant que `n ≠ 0`, on calcule `r` (0 si `n` est pair, 1 sinon), on range `r`, puis on remplace `n` par `(n − r) / (−2)`. On affiche enfin les chiffres dans l'ordre inverse.

**Invariant.** Après `k` tours, en notant `v` la valeur des `k` chiffres déjà rangés, on a `N = v + (−2)ᵏ × n`. C'est vrai au départ (`k = 0`, `v = 0`, `n = N`), et un tour le conserve, puisque `n = r + (−2) × n'`. Quand `n = 0`, on a `N = v` : les chiffres rangés sont bien l'écriture de `N`.

**Terminaison.** Si `|n| ≥ 2`, alors `|n'| = |n − r| / 2 ≤ (|n| + 1) / 2 < |n|` : la valeur absolue diminue strictement. Elle ne peut pas diminuer indéfiniment : on finit par atteindre `n ∈ {−1, 0, 1}`. Mais attention, `|n|` ne diminue pas toujours : `−1` donne `r = 1` et `n' = 1`, puis `1` donne `n' = 0`. La boucle s'arrête donc toujours, en au plus deux tours de plus. Comme `|n|` est au moins divisé par deux (environ) à chaque tour, il y a au plus 64 tours environ pour `|N| ≤ 10¹⁸`.

**Pièges.** En Python, `n % 2` vaut 0 ou 1 même si `n` est négatif, et `(n − r) // (−2)` est exact. En C++, `n % 2` vaut −1 pour un `n` impair négatif : on prend `r = 1` dès que `n % 2 != 0`. Le cas `N = 0` doit afficher `0`, alors que la boucle ne fait aucun tour.
