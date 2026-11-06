---
id: caisses-de-tommes
title: Les caisses de la fromagerie
chapter: n1-affichage
order: 3
tags: [entrées-sorties, arithmétique]
samples: 2
---

## Énoncé
À la fromagerie de Valcorde, Chloé emballe les tommes du jour pour les marchés de la vallée. Elle les range dans des caisses qui contiennent chacune exactement `K` tommes. Les tommes qui ne suffisent pas à remplir une caisse entière restent à la fromagerie jusqu'au lendemain.

Écris un programme qui lit le nombre `N` de tommes et la taille `K` d'une caisse, puis affiche le nombre de caisses pleines que Chloé peut préparer, et le nombre de tommes qui restent à la fromagerie.

## Entrée
Une seule ligne contenant deux entiers `N` et `K` séparés par une espace : le nombre de tommes, puis le nombre de tommes dans une caisse pleine.

## Sortie
Deux lignes :
- sur la première, le nombre de caisses pleines ;
- sur la deuxième, le nombre de tommes qui restent à la fromagerie.

## Contraintes
- 0 ≤ N ≤ 10 000
- 1 ≤ K ≤ 100

## Indices
1. Le nombre de caisses pleines, c'est le nombre de fois que `K` « rentre » dans `N`. C'est une division… mais sans virgule.
2. En Python, `//` donne le quotient entier d'une division et `%` donne son reste : `20 // 6` vaut `3` et `20 % 6` vaut `2`. En C++, `/` entre deux entiers donne déjà le quotient entier, et `%` le reste.
3. Il y a `N // K` caisses pleines et il reste `N % K` tommes.

## Solution
C'est une division avec reste, comme à l'école : dans 20 tommes, on peut faire 3 caisses de 6 (3 × 6 = 18), et il reste 2 tommes. Le nombre de caisses pleines est le **quotient** de `N` par `K`, et les tommes restantes sont le **reste**.

Le piège classique en Python : écrire `N / K`. L'opérateur `/` fait une division « à virgule » et `20 / 6` affiche `3.3333333333333335`, ce qui n'est pas un nombre de caisses. Il faut utiliser `//` pour le quotient entier.

En C++, quand on divise deux `int`, `/` donne directement le quotient entier : `20 / 6` vaut `3`.

Quand `N` est plus petit que `K`, il n'y a aucune caisse pleine : le quotient vaut `0` et toutes les tommes restent.
