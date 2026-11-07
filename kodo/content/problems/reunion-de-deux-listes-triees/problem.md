---
id: reunion-de-deux-listes-triees
title: Réunion de deux listes triées
chapter: p3-tableaux-avances
order: 2
tags: [listes]
samples: 2
---

## Énoncé
Deux listes d'entiers sont données, chacune rangée dans l'ordre croissant au sens large (une valeur peut s'y répéter). Afficher, dans l'ordre strictement croissant, toutes les valeurs qui apparaissent dans au moins une des deux listes, chacune une seule fois.

## Entrée
- La première ligne contient `N`, la deuxième les `N` entiers de la première liste.
- La troisième ligne contient `M`, la quatrième les `M` entiers de la seconde liste.

## Sortie
- Sur la première ligne, le nombre de valeurs différentes.
- Sur la deuxième ligne, ces valeurs dans l'ordre strictement croissant, séparées par des espaces.

## Contraintes
- 1 ≤ N, M ≤ 12 000
- Les valeurs sont comprises entre 0 et 100 000.

## Indices
1. C'est une fusion : on avance dans les deux listes en même temps, avec un indice pour chacune.
2. À chaque étape, la plus petite valeur non encore utilisée de l'ensemble des deux listes est `A[i]` ou `B[j]` : on prend la plus petite des deux.
3. Les valeurs sortent dans l'ordre croissant : une valeur déjà écrite ne peut réapparaître qu'immédiatement après. Il suffit de la comparer à la dernière valeur écrite.

## Solution
On **fusionne** les deux listes avec deux indices `i` et `j`, qui désignent les premières valeurs non encore utilisées de `A` et de `B`. À chaque étape, on prend `A[i]` si la liste `B` est épuisée, ou si `A` ne l'est pas et que `A[i] ≤ B[j]` ; sinon, on prend `B[j]`. On avance l'indice de la valeur prise.

Pourquoi les valeurs sortent dans l'ordre croissant : à chaque étape, les valeurs restantes de `A` sont toutes au moins égales à `A[i]` (la liste est triée), et celles de `B` au moins égales à `B[j]`. La plus petite des deux est donc la plus petite de toutes les valeurs restantes. Par récurrence, la suite des valeurs prises est la réunion triée des deux listes, avec les répétitions.

Pour supprimer les répétitions, on n'ajoute une valeur au résultat que si elle diffère de la dernière valeur ajoutée. C'est suffisant : dans une suite croissante, toutes les copies d'une même valeur sont consécutives.

Coût : chaque étape avance l'un des deux indices, donc il y a exactement `N + M` étapes. Vérifier pour chaque valeur si elle est déjà dans le résultat en parcourant celui-ci ferait jusqu'à `(N + M)² / 2` comparaisons, soit près de 300 millions.
