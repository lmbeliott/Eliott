---
id: somme-des-chiffres-de-1-a-2026
title: Somme des chiffres de 1 à 2026
chapter: p1-variables
order: 6
tags: [boucles, arithmétique]
samples: 1
no_input: true
---

## Énoncé
On écrit à la suite tous les entiers de `1` à `2026`. Afficher la somme de tous les chiffres écrits. Par exemple, pour les entiers de 1 à 12, la somme serait 1 + 2 + … + 9 + (1 + 0) + (1 + 1) + (1 + 2) = 51.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
Un seul entier : la somme des chiffres de tous les entiers de 1 à 2026.

## Indices
1. Pour un nombre `n`, `n % 10` est son chiffre des unités, et `n // 10 % 10` son chiffre des dizaines.
2. Tous les nombres de 1 à 2026 ont au plus 4 chiffres. Pour un nombre de moins de 4 chiffres, les chiffres « manquants » calculés de cette façon valent 0, ce qui ne change pas la somme.
3. Un accumulateur reçoit, à chaque tour, la somme des 4 chiffres du nombre courant.

## Solution
Pour un entier `n` d'au plus 4 chiffres, ses chiffres sont :

- les unités : `n % 10` ;
- les dizaines : `n // 10 % 10` (on enlève le dernier chiffre, puis on prend le dernier chiffre du résultat) ;
- les centaines : `n // 100 % 10` ;
- les milliers : `n // 1000`.

Par exemple, pour n = 2026 : 2026 % 10 = 6, 2026 // 10 % 10 = 202 % 10 = 2, 2026 // 100 % 10 = 20 % 10 = 0 et 2026 // 1000 = 2. Pour un nombre plus court comme 47, les centaines et les milliers valent 0 : la formule marche pour tous les nombres de la boucle.

On parcourt `n` de 1 à 2026, et on ajoute ces quatre chiffres à un accumulateur initialisé à 0. Le résultat est 28189. En C++, l'opérateur `/` sur des `int` donne le quotient entier, comme `//` en Python.
