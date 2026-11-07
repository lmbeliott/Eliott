---
id: nombre-de-valeurs-distinctes
title: Nombre de valeurs distinctes
chapter: p2-dictionnaires
order: 1
tags: [dictionnaires]
samples: 2
---

## Énoncé
Une suite de `N` entiers est donnée. Afficher le nombre de valeurs différentes qu'elle contient.

Par exemple, la suite `4 7 4 1 7 4` contient trois valeurs différentes : `1`, `4` et `7`.

## Entrée
La première ligne contient l'entier `N`. La deuxième ligne contient les `N` entiers, séparés par des espaces.

## Sortie
Un seul entier : le nombre de valeurs distinctes.

## Contraintes
- 1 ≤ N ≤ 40 000
- -10⁹ ≤ chaque entier ≤ 10⁹

## Indices
1. Un ensemble ne garde qu'un exemplaire de chaque valeur, même si on l'ajoute plusieurs fois.
2. Ajouter chaque entier à un ensemble vide, puis afficher la taille de l'ensemble avec `len`.
3. Avec une liste et un test `if v not in liste`, chaque test parcourt toute la liste : sur 40 000 valeurs distinctes, cela fait environ 800 millions de comparaisons, beaucoup trop.

## Solution
On ajoute les `N` entiers à un **ensemble** (`set` en Python, `unordered_set` ou `set` en C++). Un ensemble ne contient jamais deux fois la même valeur : un ajout d'une valeur déjà présente ne change rien. À la fin, sa taille est exactement le nombre de valeurs distinctes.

Le piège est de construire une liste sans doublons avec `if v not in liste: liste.append(v)`. Le résultat est juste, mais chaque test `in` sur une liste compare `v` à tous les éléments déjà rangés. Quand toutes les valeurs sont distinctes, cela fait 1 + 2 + … + 39 999 comparaisons, soit environ 800 millions : plusieurs secondes en Python. Le test d'appartenance à un ensemble, lui, se fait presque en une seule étape, quelle que soit sa taille.
