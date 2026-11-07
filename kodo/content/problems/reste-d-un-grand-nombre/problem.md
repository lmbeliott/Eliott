---
id: reste-d-un-grand-nombre
title: Reste d'un grand nombre
chapter: p2-chaines
order: 5
tags: [chaînes, arithmétique, mathématiques]
samples: 2
---

## Énoncé
Afficher le reste de la division d'un très grand entier positif ou nul `N` par un entier `M`. `N` peut avoir jusqu'à 100 000 chiffres : c'est trop pour un `long long` en C++, et trop aussi pour `int()` en Python, qui refuse les chaînes de plus de 4 300 chiffres (`ValueError`).

## Entrée
La première ligne contient `N`, écrit sans zéro inutile au début. La deuxième ligne contient `M`.

## Sortie
Un seul entier : le reste de la division de `N` par `M`, entre `0` et `M − 1`.

## Contraintes
- `N` a entre 1 et 100 000 chiffres.
- 1 ≤ M ≤ 10⁹

## Indices
1. Aucun type entier du C++ ne peut contenir `N`, et en Python, `int()` refuse les chaînes de plus de 4 300 chiffres. Il faut lire `N` comme une chaîne et traiter ses chiffres un par un.
2. En lisant `N` de gauche à droite, le nombre formé par les premiers chiffres passe de `x` à `10 × x + d` quand on ajoute le chiffre `d`.
3. Le reste de `10 × x + d` par `M` ne dépend que du reste de `x` par `M`. On peut donc ne garder que le reste à chaque étape : `r = (10 × r + d) % M`.

## Solution
Notons `x` le nombre formé par les premiers chiffres de `N`, et `r` son reste par `M`. Quand on lit le chiffre suivant `d`, le nombre devient `10 × x + d`. Comme `x = M × q + r` pour un certain entier `q`, on a `10 × x + d = M × (10 × q) + (10 × r + d)` : le reste de `10 × x + d` par `M` est donc le reste de `10 × r + d` par `M`.

On n'a jamais besoin de `x` lui-même : on part de `r = 0`, et pour chaque chiffre `d` de la chaîne, on calcule `r = (10 × r + d) % M`. Après le dernier chiffre, `r` est le reste de `N` par `M`. C'est la même méthode qu'une division posée, où l'on ne garde que le reste.

Comme `r < M ≤ 10⁹`, la valeur `10 × r + d` reste inférieure à 10¹⁰ : en C++, elle tient dans un `long long`, mais pas dans un `int`. Le programme fait un seul parcours de la chaîne : 100 000 étapes, instantané.
