---
id: multiples-de-k-dans-un-intervalle
title: Multiples de K dans un intervalle
chapter: p2-nombres
order: 5
tags: [arithmétique, mathématiques]
samples: 2
---

## Énoncé
Compter les multiples de `K` compris entre `A` et `B`, bornes incluses. Un multiple de `K` est un entier de la forme `K × q`, avec `q` entier, éventuellement négatif ou nul : `0`, `-6` et `9` sont des multiples de 3.

## Entrée
Une seule ligne contenant `A`, `B` et `K`, séparés par des espaces.

## Sortie
Un seul entier : le nombre de multiples de `K` entre `A` et `B`.

## Contraintes
- −10¹⁸ ≤ A ≤ B ≤ 10¹⁸
- 1 ≤ K ≤ 10¹⁸

## Indices
1. Les intervalles sont bien trop grands pour essayer chaque entier. Commencer par compter les multiples de `K` entre 1 et `B`, quand `B` est positif : il y en a `B // K`.
2. Plus généralement, l'arrondi inférieur de `B / K` est le numéro `q` du plus grand multiple `K × q` qui ne dépasse pas `B`. Les multiples de `[A, B]` sont ceux qui ne dépassent pas `B`, moins ceux qui ne dépassent pas `A − 1`.
3. La réponse est donc l'arrondi inférieur de `B / K` moins celui de `(A − 1) / K`. En Python, `//` donne directement l'arrondi inférieur, même pour des négatifs. En C++, `/` tronque vers zéro : il faut corriger le quotient quand le reste est négatif.

## Solution
Pour un entier `x`, notons `f(x)` l'arrondi inférieur de `x / K`. Le multiple `K × q` ne dépasse pas `x` exactement quand `q ≤ x / K`, c'est-à-dire quand `q ≤ f(x)`. Les multiples de `K` qui sont dans `[A, B]` sont ceux dont le numéro `q` vérifie `f(A − 1) < q ≤ f(B)` : il y en a `f(B) − f(A − 1)`.

En Python, `f(x)` s'écrit `x // k`, qui arrondit vers le bas même quand `x` est négatif. En C++, `x / k` tronque vers zéro : pour `x = -7` et `K = 2`, il donne `-3` au lieu de `-4`. On calcule donc `q = x / k`, puis on retire 1 si `x % k` est négatif (ce qui arrive exactement quand `x` est négatif et n'est pas un multiple de `K`).

Les valeurs vont jusqu'à 10¹⁸ : il faut des `long long` en C++, et surtout pas de flottants. La réponse peut atteindre 2 × 10¹⁸ + 1 (pour `K = 1`), ce qui tient encore dans un `long long`.
