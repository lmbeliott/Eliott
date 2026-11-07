---
id: sommets-d-un-relief
title: Sommets d'un relief
chapter: p2-grilles
order: 3
tags: [grilles]
samples: 2
---

## Énoncé
Une carte de relief est une grille de `N` lignes et `M` colonnes ; chaque case contient une altitude, un chiffre de `0` à `9`. Une case est un **sommet** si son altitude est **strictement** plus grande que celle de chacune de ses voisines. Les voisines d'une case sont les cases qui la touchent par un côté ou par un coin (jusqu'à 8). Une case du bord a moins de voisines ; une grille d'une seule case est un sommet.

Compter les sommets.

## Entrée
- La première ligne contient deux entiers `N` et `M`.
- Chacune des `N` lignes suivantes contient `M` chiffres, sans espaces.

## Sortie
Le nombre de sommets.

## Contraintes
- 1 ≤ N ≤ 100 et 1 ≤ M ≤ 100

## Indices
1. Lire chaque ligne comme une chaîne : `g[i][j]` est un caractère, et `int(g[i][j])` son altitude. Comparer directement les caractères `"0"` à `"9"` donne d'ailleurs le même résultat.
2. Parcourir les 8 déplacements `(a, b)` avec `a` et `b` entre -1 et 1, sauf `(0, 0)`.
3. Une voisine hors de la grille est ignorée : tester `0 <= i + a < N` et `0 <= j + b < M` avant de lire la case.

## Solution
Pour chaque case `(i, j)`, une fonction `est_sommet(g, i, j)` parcourt les 8 déplacements `(a, b)`, avec `a` et `b` valant -1, 0 ou 1, sauf `(0, 0)` qui désigne la case elle-même. Pour chaque voisine `(i + a, j + b)` **dans la grille**, si son altitude est supérieure ou égale à celle de la case, ce n'est pas un sommet : la fonction renvoie `False`. Si aucune voisine ne l'en empêche, elle renvoie `True`. On compte les cases pour lesquelles la fonction renvoie `True`.

La vérification des bornes est indispensable. En Python, oublier `0 <= i + a` ne provoque pas d'erreur sur la ligne 0 : l'indice -1 désigne la dernière ligne, qui serait comparée à tort. Oublier `i + a < N` provoque une `IndexError`.

Le mot « strictement » compte : deux cases voisines de même altitude ne sont des sommets ni l'une ni l'autre. Une grille entièrement plate de plus d'une case n'a donc aucun sommet, alors qu'une grille d'une seule case, sans voisine, en a un.

Il y a au plus 10 000 cases et 8 voisines par case : le programme est très rapide.
