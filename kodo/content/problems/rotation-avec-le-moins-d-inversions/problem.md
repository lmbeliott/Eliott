---
id: rotation-avec-le-moins-d-inversions
title: Rotation avec le moins d'inversions
chapter: p4-diviser-regner
order: 5
tags: [tri, dichotomie, mathématiques]
samples: 2
time_limit_ms: 500
---

## Énoncé
Une **inversion** d'une suite a₁, …, a_N est une paire de positions i < j telle que aᵢ > a_j. Une **rotation** déplace le premier élément de la suite à la fin : `3 1 2` devient `1 2 3`, puis `2 3 1`. En appliquant 0, 1, …, N − 1 rotations, on obtient N suites, pas forcément différentes.

Afficher le plus petit nombre d'inversions parmi ces N suites.

La suite est fabriquée par une formule, pour que l'entrée reste courte : a₁ = X, puis a_{i+1} = (aᵢ × B + C) mod M.

## Entrée
Une seule ligne : les cinq entiers N, X, B, C et M.

## Sortie
Le plus petit nombre d'inversions d'une rotation de la suite.

## Contraintes
- 1 ≤ N ≤ 100 000
- 1 ≤ M ≤ 10⁹
- 0 ≤ X, B, C < M

## Indices
1. Compter les inversions de la suite de départ avec le tri fusion.
2. Quand le premier élément x passe à la fin, seules changent les paires qui contiennent x. Avant, x formait une inversion avec chaque élément strictement plus petit ; après, avec chaque élément strictement plus grand.
3. Ces deux nombres ne dépendent que de x et de l'ensemble des valeurs : une recherche dichotomique dans la suite triée les donne.

## Solution
**Le point de départ.** On compte les inversions I₀ de la suite de départ avec le tri fusion, en O(N log N), comme dans le cours.

**Effet d'une rotation.** Soit x le premier élément de la suite courante, et notons p(x) le nombre d'éléments de la suite strictement plus petits que x et g(x) le nombre d'éléments strictement plus grands. Les paires qui ne contiennent pas x gardent le même ordre, donc le même statut. Avant la rotation, x est en tête : il forme une inversion avec chaque élément plus petit que lui, soit p(x) inversions. Après, x est en dernière position : il forme une inversion avec chaque élément plus grand, soit g(x). Le nombre d'inversions devient donc I − p(x) + g(x).

**Calcul rapide.** p(x) et g(x) ne dépendent que de x et des valeurs de la suite, qui ne changent pas. Avec la suite triée s, p(x) = `bisect_left(s, x)` et g(x) = N − `bisect_right(s, x)` (`lower_bound` et `upper_bound` en C++). On applique la formule pour x = a₁, puis a₂, …, a_{N−1}, et on garde le minimum de toutes les valeurs obtenues, I₀ compris.

**Coût.** O(N log N) pour le tri fusion, puis N recherches dichotomiques. Recompter les inversions de chaque rotation, même avec le tri fusion, coûterait O(N² log N). En C++, le nombre d'inversions peut atteindre 5 × 10⁹ : `long long`.
