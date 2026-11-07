---
id: somme-avec-les-voisins
title: Somme avec les voisins
chapter: p2-tableaux
order: 2
tags: [listes]
samples: 2
---

## Énoncé
On remplace chaque élément d'une suite de `N` entiers par la somme de cet élément et de ses voisins immédiats, celui de gauche et celui de droite. Le premier et le dernier élément n'ont qu'un voisin. Tous les calculs se font à partir de la suite de départ.

Par exemple, la suite `1 2 3 4` devient `3 6 9 7`.

## Entrée
La première ligne contient l'entier `N`. La deuxième ligne contient les `N` entiers, séparés par des espaces.

## Sortie
Une seule ligne avec les `N` entiers de la nouvelle suite, séparés par des espaces.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque entier est compris entre −1 000 et 1 000.

## Indices
1. Il faut connaître les voisins de chaque élément : parcourir le tableau par indice.
2. Le voisin de gauche `t[i - 1]` n'existe que si `i > 0`, et celui de droite `t[i + 1]` seulement si `i < N - 1`.
3. Ranger les résultats dans un **nouveau** tableau. Si on modifiait `t` sur place, le calcul de l'élément suivant utiliserait une valeur déjà changée.

## Solution
On parcourt les indices `i` de 0 à `N − 1`. On part de `s = t[i]`, on ajoute `t[i - 1]` si `i > 0` et `t[i + 1]` si `i < N − 1`, puis on ajoute `s` à un nouveau tableau, qu'on affiche à la fin.

Deux pièges. D'abord les bords : sans les deux tests, `t[i + 1]` sort du tableau pour le dernier élément (`IndexError` en Python, valeur absurde en C++), et en Python `t[-1]` désigne le dernier élément, ce qui ajouterait en silence un faux voisin au premier. Ensuite la modification sur place : écrire le résultat dans `t[i]` fausserait le calcul de `t[i + 1]`, qui a besoin de l'ancienne valeur. Pour `N = 1`, l'élément n'a aucun voisin et reste inchangé.
