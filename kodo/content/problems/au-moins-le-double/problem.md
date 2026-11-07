---
id: au-moins-le-double
title: Au moins le double
chapter: p4-dichotomie
order: 1
tags: [dichotomie, tri]
samples: 2
---

## Énoncé
Une suite de N entiers a₁, a₂, …, a_N est fabriquée par une formule, pour que l'entrée reste courte : a₁ = X, puis a_{i+1} = (aᵢ × B + C) mod M pour i ≥ 1.

Compter les paires d'indices (i, j), avec i < j, telles que la plus grande des deux valeurs aᵢ et aⱼ est **au moins le double** de la plus petite.

Par exemple, avec N = 5, X = 2, B = 3, C = 5 et M = 7, les valeurs sont 2, 4, 3, 0, 5. Six paires conviennent : {2, 4}, {2, 0}, {2, 5}, {4, 0}, {3, 0} et {0, 5}, car toute valeur est au moins le double de 0. La paire {4, 5} ne convient pas, car 5 < 8.

## Entrée
Une seule ligne : les cinq entiers N, X, B, C et M.

## Sortie
Le nombre de paires.

## Contraintes
- 2 ≤ N ≤ 200 000
- 1 ≤ M ≤ 10⁹
- 0 ≤ X, B, C < M

## Indices
1. L'ordre des valeurs dans la suite ne compte pas : on peut la trier.
2. Dans la liste triée b₀ ≤ b₁ ≤ … , pour une position i fixée, les positions j > i qui conviennent sont celles où b_j ≥ 2 × b_i. Elles forment un bloc à la fin de la liste : une recherche dichotomique donne son début.
3. Attention à b_i = 0 : le premier indice où b_j ≥ 0 est 0, qui n'est pas après i.

## Solution
**Trier.** La condition « le plus grand est au moins le double du plus petit » ne dépend pas de l'ordre des deux valeurs, donc la réponse ne change pas si on trie la suite. Dans la liste triée b₀ ≤ b₁ ≤ … ≤ b_{N−1}, une paire de positions i < j convient si et seulement si b_j ≥ 2 × b_i.

**Une recherche par position.** Pour i fixé, soit p le premier indice tel que b_p ≥ 2 × b_i (c'est `bisect_left(b, 2 * b[i])` en Python, `lower_bound` en C++). Comme la liste est triée, les indices j qui vérifient b_j ≥ 2 × b_i sont exactement p, p + 1, …, N − 1. Il faut en plus j > i : les indices qui conviennent vont de max(p, i + 1) à N − 1, soit N − max(p, i + 1) paires. Le max n'est pas décoratif : quand b_i = 0, on a 2 × b_i = 0 et p = 0, qui est avant i.

**Coût.** Le tri coûte O(N log N), puis N recherches dichotomiques en O(log N) chacune : O(N log N) en tout, quelques millions d'opérations. Comparer toutes les paires demanderait N(N − 1)/2 ≈ 2 × 10¹⁰ comparaisons pour N = 200 000 : bien trop, même en C++. La réponse peut dépasser 2³¹ : il faut un `long long` en C++.
