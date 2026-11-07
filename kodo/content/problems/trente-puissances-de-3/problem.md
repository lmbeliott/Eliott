---
id: trente-puissances-de-3
title: Trente puissances de 3
chapter: p1-variables
order: 3
tags: [boucles, arithmétique]
samples: 1
no_input: true
---

## Énoncé
On note 3ᵏ le produit de k facteurs égaux à 3, avec la convention 3⁰ = 1 : 3¹ = 3, 3² = 9, 3³ = 27, etc. Afficher les puissances de 3 de 3⁰ à 3²⁹.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
30 lignes. La ligne numéro k + 1 (pour k de 0 à 29) contient l'exposant k, une espace, puis la valeur de 3ᵏ. La première ligne est donc `0 1` et la deuxième `1 3`.

## Indices
1. Chaque puissance est le triple de la précédente : une variable qui part de 1 et qu'on multiplie par 3 à chaque tour.
2. À chaque tour, afficher d'abord, puis multiplier : sinon la ligne `0 1` manque.
3. En C++, 3²⁹ dépasse largement la capacité d'un `int`.

## Solution
On garde une variable `p`, qui vaut 1 au départ (c'est 3⁰). Pour `k` allant de 0 à 29, on affiche `k` et `p`, puis on remplace `p` par `p * 3`. Au tour numéro k, `p` vaut donc bien 3ᵏ au moment de l'affichage : c'est vrai au premier tour (k = 0, p = 1), et chaque tour multiplie `p` par 3 en même temps que `k` augmente de 1.

En C++, un `int` ne dépasse pas 2 147 483 647, alors que 3²⁰ = 3 486 784 401 et 3²⁹ = 68 630 377 364 883. Avec un `int`, les valeurs deviennent fausses, voire négatives, à partir de k = 20, sans aucun message d'erreur. Il faut déclarer `long long p = 1;`. En Python, les entiers n'ont pas de limite.
