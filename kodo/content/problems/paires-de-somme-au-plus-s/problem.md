---
id: paires-de-somme-au-plus-s
title: Paires de somme au plus S
chapter: p3-complexite
order: 3
tags: [tri, deux-pointeurs]
samples: 2
---

## Énoncé
Une suite de N entiers a₁, a₂, …, a_N est fabriquée par une formule, pour que l'entrée reste courte : a₁ = X, puis a_{i+1} = (aᵢ × B + C) mod M pour i ≥ 1, où « mod M » désigne le reste de la division par M. Par exemple, avec X = 3, B = 7, C = 2 et M = 11, la suite commence par 3, 1, 9, 10, 6, car (3 × 7 + 2) mod 11 = 1, (1 × 7 + 2) mod 11 = 9, et ainsi de suite.

Compter les paires d'indices (i, j), avec i < j, telles que aᵢ + aⱼ ≤ S.

## Entrée
La première ligne contient N et S. La deuxième ligne contient X, B, C et M.

## Sortie
Le nombre de paires.

## Contraintes
- 2 ≤ N ≤ 200 000
- 1 ≤ M ≤ 10⁹ et 0 ≤ X, B, C < M
- 0 ≤ S ≤ 2 × 10⁹

## Indices
1. Tester toutes les paires demande N(N − 1)/2 ≈ 2 × 10¹⁰ additions pour N = 200 000 : beaucoup trop, même en C++.
2. Le nombre de paires ne dépend pas de l'ordre des valeurs : on peut trier la suite.
3. Dans la suite triée, avec un indice `g` qui part de la gauche et un indice `d` qui part de la droite : si `a[g] + a[d] ≤ S`, alors `a[g]` forme une paire valable avec chacun des éléments d'indices g + 1 à d.

## Solution
On fabrique la suite, puis on la trie : le nombre de paires d'indices dont la somme est au plus S ne change pas quand on permute les valeurs.

On place un indice `g` au début et un indice `d` à la fin, et on répète tant que `g < d` :

- si `a[g] + a[d] ≤ S`, alors pour tout k entre g + 1 et d, `a[g] + a[k] ≤ a[g] + a[d] ≤ S` : on compte ces `d − g` paires d'un coup, et on avance `g` ;
- sinon, pour tout k entre g et d − 1, `a[k] + a[d] ≥ a[g] + a[d] > S` : `a[d]` ne forme plus aucune paire valable avec les éléments restants, et on recule `d`.

**Invariant.** À chaque étape, toutes les paires valables qui ne sont pas entièrement dans la portion `[g, d]` ont été comptées exactement une fois. C'est vrai au départ, et les deux cas ci-dessus le conservent : dans le premier, on compte toutes les paires valables qui contiennent `g` dans la portion ; dans le second, on n'en oublie aucune contenant `d`. Quand `g = d`, la portion ne contient plus de paire : tout a été compté.

**Coût.** Le tri coûte O(N log N). Ensuite, chaque tour de boucle avance `g` ou recule `d` : au plus N tours, donc O(N). Le total est O(N log N), environ 4 millions d'opérations, contre 2 × 10¹⁰ pour la méthode directe. Le nombre de paires peut atteindre 2 × 10¹⁰ : `long long` en C++, de même que pour le calcul de aᵢ × B.
