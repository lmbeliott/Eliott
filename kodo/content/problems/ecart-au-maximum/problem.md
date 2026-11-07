---
id: ecart-au-maximum
title: Écart au maximum
chapter: p2-tableaux
order: 1
tags: [listes]
samples: 2
---

## Énoncé
Pour chacun des `N` entiers donnés, afficher ce qu'il lui manque pour atteindre le plus grand d'entre eux, c'est-à-dire la différence entre le maximum et cet entier.

## Entrée
La première ligne contient l'entier `N`. La deuxième ligne contient les `N` entiers, séparés par des espaces.

## Sortie
Une seule ligne avec `N` entiers séparés par des espaces : pour chaque entier, dans l'ordre de l'entrée, l'écart entre le maximum et lui.

## Contraintes
- 1 ≤ N ≤ 10 000
- Chaque entier est compris entre −10⁹ et 10⁹.

## Indices
1. Le maximum n'est connu qu'après avoir lu toutes les valeurs : il faut les garder dans un tableau.
2. Un premier parcours trouve le maximum, un second affiche les écarts.
3. Initialiser le maximum avec le premier élément, et non avec 0 : toutes les valeurs peuvent être négatives.

## Solution
On range les valeurs dans un tableau, puis on fait deux passages. Le premier calcule le maximum `m` : on part de `t[0]`, et chaque élément plus grand le remplace. Le second affiche `m - x` pour chaque élément `x`, dans l'ordre.

Le piège classique est d'initialiser le maximum à 0 : si toutes les valeurs sont négatives, le maximum trouvé serait 0, qui n'est pas dans le tableau. Les écarts vont jusqu'à 2 × 10⁹, ce qui dépasse un `int` en C++ : il faut des `long long`.
