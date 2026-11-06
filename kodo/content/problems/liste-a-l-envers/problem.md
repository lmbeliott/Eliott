---
id: liste-a-l-envers
title: Liste à l'envers
chapter: n1-listes
order: 1
tags: [listes]
samples: 2
---

## Énoncé
Écris un programme qui lit une liste de `N` nombres et l'affiche dans l'ordre inverse : le dernier nombre en premier, puis l'avant-dernier, et ainsi de suite jusqu'au premier.

## Entrée
- La première ligne contient l'entier `N`, le nombre d'éléments de la liste.
- La deuxième ligne contient `N` entiers séparés par des espaces : les éléments de la liste, dans l'ordre.

## Sortie
Une seule ligne contenant les `N` nombres dans l'ordre inverse, séparés par des espaces.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque nombre est compris entre 0 et 4 800.

## Indices
1. On ne peut pas afficher le dernier nombre avant de l'avoir lu : il faut d'abord ranger tous les nombres dans une liste.
2. Les positions dans la liste vont de `0` à `N - 1`. Pour la parcourir à l'envers, fais varier la position de `N - 1` jusqu'à `0`. En Python : `range(n - 1, -1, -1)` ; en C++ : `for (int i = n - 1; i >= 0; i--)`.
3. Pour afficher tous les nombres sur une seule ligne : `print(x, end=" ")` en Python, `cout << x << " ";` en C++.

## Solution
On lit les `N` nombres et on les range dans une liste. Ensuite, on parcourt la liste en partant de la fin : la position `N - 1` (le dernier nombre), puis `N - 2`, et ainsi de suite jusqu'à la position `0` (le premier nombre).

Le piège classique : les positions commencent à `0`. La dernière case d'une liste de `N` éléments est donc la case `N - 1`, et pas la case `N` (qui n'existe pas). En Python, `range(n - 1, -1, -1)` s'arrête juste avant `-1`, donc la case `0` est bien affichée.

En Python, il existe aussi des raccourcis : `liste[::-1]` ou `reversed(liste)` donnent la liste à l'envers. C'est pratique, mais sache d'abord le faire toi-même avec une boucle.
