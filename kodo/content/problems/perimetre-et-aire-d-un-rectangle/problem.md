---
id: perimetre-et-aire-d-un-rectangle
title: Périmètre et aire d'un rectangle
chapter: p1-lecture
order: 1
tags: [entrées-sorties, arithmétique]
samples: 2
---

## Énoncé
Un terrain rectangulaire mesure `L` mètres de long et `W` mètres de large. Afficher la longueur de la clôture qui en fait le tour (le périmètre), puis sa surface (l'aire).

## Entrée
Une seule ligne contenant deux entiers `L` et `W` séparés par une espace.

## Sortie
Deux lignes : le périmètre, puis l'aire.

## Contraintes
- 1 ≤ L, W ≤ 10 000

## Indices
1. Les deux nombres sont sur la même ligne : il faut découper la ligne avec `split()` avant de convertir.
2. Le périmètre est la somme des quatre côtés : deux côtés de longueur `L` et deux de longueur `W`. L'aire est `L × W`.

## Solution
On lit les deux entiers d'un coup avec `map(int, input().split())` en Python, ou `cin >> l >> w` en C++. Le périmètre vaut `2 × (L + W)` et l'aire `L × W`.

Le piège est d'écrire `int(input())` : la ligne contient deux nombres séparés par une espace, et la conversion échoue. Il ne faut pas non plus oublier les parenthèses : `2 * L + W` ne compte la largeur qu'une fois.
