---
id: remplir-des-boites
title: Remplir des boîtes
chapter: n1-affichage
order: 3
tags: [entrées-sorties, arithmétique]
samples: 2
---

## Énoncé
On range `N` objets dans des boîtes qui contiennent chacune exactement `K` objets. Les objets qui ne suffisent pas à remplir une boîte entière restent à part.

Écris un programme qui lit `N` et `K`, puis affiche le nombre de boîtes pleines, et le nombre d'objets qui restent à part.

## Entrée
Une seule ligne contenant deux entiers `N` et `K` séparés par une espace : le nombre d'objets, puis le nombre d'objets dans une boîte pleine.

## Sortie
Deux lignes :
- sur la première, le nombre de boîtes pleines ;
- sur la deuxième, le nombre d'objets qui restent à part.

## Contraintes
- 0 ≤ N ≤ 10 000
- 1 ≤ K ≤ 100

## Indices
1. Le nombre de boîtes pleines, c'est le nombre de fois que `K` « rentre » dans `N`. C'est une division… mais sans virgule.
2. En Python, `//` donne le quotient entier d'une division et `%` donne son reste : `20 // 6` vaut `3` et `20 % 6` vaut `2`. En C++, `/` entre deux entiers donne déjà le quotient entier, et `%` le reste.
3. Il y a `N // K` boîtes pleines et il reste `N % K` objets.

## Solution
C'est une division avec reste, comme à l'école : avec 20 objets, on peut remplir 3 boîtes de 6 (3 × 6 = 18), et il reste 2 objets. Le nombre de boîtes pleines est le **quotient** de `N` par `K`, et les objets restants sont le **reste**.

Le piège classique en Python : écrire `N / K`. L'opérateur `/` fait une division « à virgule » et `20 / 6` affiche `3.3333333333333335`, ce qui n'est pas un nombre de boîtes. Il faut utiliser `//` pour le quotient entier.

En C++, quand on divise deux `int`, `/` donne directement le quotient entier : `20 / 6` vaut `3`.

Quand `N` est plus petit que `K`, il n'y a aucune boîte pleine : le quotient vaut `0` et tous les objets restent à part.
