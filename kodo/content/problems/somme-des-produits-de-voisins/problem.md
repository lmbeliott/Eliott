---
id: somme-des-produits-de-voisins
title: Somme des produits de voisins
chapter: p1-lecture
order: 7
tags: [entrées-sorties, boucles, arithmétique]
samples: 2
---

## Énoncé
Une suite de `N` entiers est donnée, un par ligne. Multiplier chaque valeur par la suivante, puis afficher la somme de tous ces produits. Pour la suite `2, 3, -1, 4`, le résultat est 2 × 3 + 3 × (−1) + (−1) × 4 = 6 − 3 − 4 = −1.

## Entrée
- La première ligne contient l'entier `N`.
- Les `N` lignes suivantes contiennent chacune un entier de la suite, dans l'ordre.

## Sortie
Un seul entier : la somme des `N − 1` produits de deux valeurs voisines.

## Contraintes
- 2 ≤ N ≤ 1 000
- −1 000 ≤ chaque valeur ≤ 1 000

## Indices
1. Au moment où on lit une valeur, il faut encore connaître la valeur lue juste avant.
2. On lit la première valeur avant la boucle et on la range dans une variable `precedent`. La boucle lit alors les `N − 1` valeurs restantes.
3. À chaque tour : on lit `x`, on ajoute `precedent × x` à la somme, puis `x` devient le nouveau `precedent`.

## Solution
On ne garde pas toute la suite : il suffit de se souvenir de la dernière valeur lue. On lit la première valeur dans `precedent`, puis on fait `N − 1` tours. À chaque tour, on lit la valeur `x`, on ajoute `precedent × x` à la somme, et on remplace `precedent` par `x` pour le tour suivant.

L'ordre des deux dernières instructions compte : si on écrit `precedent = x` avant de faire le produit, on calcule `x × x` au lieu du produit de deux voisines.

Le piège est aussi le nombre de tours : la première valeur est déjà lue, donc la boucle n'en lit plus que `N − 1`. Avec `N` tours, Python s'arrête sur une erreur `EOFError` en cherchant une ligne qui n'existe pas.
