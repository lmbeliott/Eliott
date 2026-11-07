---
id: iterer-une-fonction-affine
title: Itérer une fonction affine
chapter: p3-correction
order: 3
tags: [arithmétique, mathématiques]
samples: 2
---

## Énoncé
On note `f(x) = (A × x + B) mod M`, le reste de la division de `A × x + B` par `M`. Partant d'un entier `X`, on applique `K` fois la fonction `f` : on calcule `f(X)`, puis `f(f(X))`, et ainsi de suite. Afficher le résultat.

Par exemple, avec `M = 10`, `A = 3`, `B = 1`, `X = 2` et `K = 3`, on obtient successivement 7, 2, puis 7.

Chaque test contient `T` questions de ce type.

## Entrée
- La première ligne contient `T`.
- Les `T` lignes suivantes contiennent chacune cinq entiers : `M`, `A`, `B`, `X` et `K`.

## Sortie
Pour chaque question, une ligne avec le résultat de `K` applications de `f` à `X` (si `K = 0`, c'est `X`).

## Contraintes
- 1 ≤ T ≤ 1 000
- 2 ≤ M ≤ 10⁹
- 0 ≤ A, B, X < M
- 0 ≤ K ≤ 10¹⁸

## Indices
1. Appliquer `f` une fois par tour demanderait jusqu'à 10¹⁸ tours. Il faut une idée comme l'exponentiation rapide.
2. Appliquer deux fois une fonction affine donne encore une fonction affine : si `g(x) = a × x + b`, alors `g(g(x)) = (a × a) × x + (a × b + b)`, le tout modulo `M`.
3. Maintenir une valeur `x`, une fonction `g` (ses deux coefficients) et un entier `k` tels que le résultat cherché soit toujours `g` appliquée `k` fois à `x`.

## Solution
C'est l'exponentiation rapide du cours, appliquée à des fonctions au lieu de nombres. On maintient une valeur `x`, une fonction affine `g(x) = (a × x + b) mod M` donnée par ses coefficients `(a, b)`, et un entier `k`, avec l'**invariant** : le résultat cherché est `g` appliquée `k` fois à `x`. Au départ, `x = X`, `(a, b) = (A, B)` et `k = K` : l'invariant est vrai.

À chaque tour, tant que `k > 0` :
- si `k` est impair, on applique `g` une fois : `x` devient `g(x)` et `k` diminue de 1. L'invariant reste vrai, puisque `g` appliquée `k` fois à `x` est `g` appliquée `k − 1` fois à `g(x)` ;
- `k` est maintenant pair : appliquer `k` fois `g`, c'est appliquer `k / 2` fois `g ∘ g`. On remplace `(a, b)` par les coefficients de `g ∘ g`, soit `(a × a mod M, (a × b + b) mod M)`, et `k` par `k / 2`.

Quand `k = 0`, l'invariant dit que le résultat est `x` lui-même (zéro application) : on l'affiche.

**Terminaison et coût.** `k` est un entier positif ou nul qui diminue strictement à chaque tour (il est au moins divisé par deux) : la boucle s'arrête, après au plus 60 tours pour `K ≤ 10¹⁸ < 2⁶⁰`. Chaque question coûte donc une soixantaine de tours, contre 10¹⁸ pour la simulation. En C++, les produits comme `a × x` atteignent presque 10¹⁸ : il faut des `long long`, et réduire modulo `M` après chaque produit.
