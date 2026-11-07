---
id: somme-de-fractions
title: Somme de fractions
chapter: p2-fonctions
order: 5
tags: [fonctions, arithmétique, mathématiques]
samples: 2
---

## Énoncé
Calculer la somme de `N` fractions positives et l'écrire sous forme **irréductible** : `P/Q` où `P` et `Q` n'ont aucun diviseur commun autre que 1.

Par exemple, 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6, qui s'écrit `1/1` sous forme irréductible.

## Entrée
- La première ligne contient l'entier `N`.
- Chacune des `N` lignes suivantes contient deux entiers `A` et `B`, séparés par une espace : la fraction `A/B`.

## Sortie
Une seule ligne : `P/Q`, la somme sous forme irréductible (avec `Q = 1` si la somme est entière).

## Contraintes
- 1 ≤ N ≤ 20
- 1 ≤ A ≤ 100
- 1 ≤ B ≤ 30
- Les fractions de l'entrée ne sont pas forcément irréductibles.

## Indices
1. `a/b + c/d = (a × d + c × b) / (b × d)`. Écrire une fonction `pgcd(a, b)` (algorithme d'Euclide) pour simplifier le résultat.
2. Écrire une fonction qui ajoute deux fractions et renvoie la somme **simplifiée** : deux valeurs à renvoyer, avec `return p, q` en Python et des paramètres par référence en C++.
3. En C++, si on ne simplifie qu'à la fin, le dénominateur peut atteindre 30²⁰ et dépasser `long long`. Simplifier après chaque addition garde des nombres petits.

## Solution
On garde la somme courante sous forme d'une fraction `p/q`, en partant de `0/1`. Pour chaque fraction `a/b` lue, une fonction `ajouter(p, q, a, b)` calcule le numérateur `p × b + a × q` et le dénominateur `q × b`, puis les divise tous les deux par leur PGCD. À la fin, on affiche `p/q`.

La fonction `pgcd` est l'algorithme d'Euclide du cours : tant que `b ≠ 0`, on remplace `(a, b)` par `(b, a % b)`.

Pourquoi simplifier à chaque étape ? Le dénominateur de la somme irréductible divise toujours le PPCM des `B`, qui vaut au plus 2 329 089 562 800 (le PPCM de 1, 2, …, 30). Si on simplifie après chaque addition, les nombres restent de cet ordre, et les produits restent bien en dessous de 9 × 10¹⁸, la limite de `long long`. Sans simplification, le dénominateur serait le produit des `B`, jusqu'à 30²⁰ ≈ 3,5 × 10²⁹ : en C++, le calcul déborderait et donnerait un résultat faux. Python, lui, n'a pas de limite, mais le principe reste le bon.

La fonction qui ajoute deux fractions doit renvoyer deux nombres : en Python, `return p // d, q // d` et `p, q = ajouter(p, q, a, b)` ; en C++, `p` et `q` sont passés par référence (`long long &p, long long &q`) et la fonction les modifie directement.
