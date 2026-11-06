---
id: chemin-du-retour
title: Le chemin du retour
chapter: n1-listes
order: 1
tags: [listes]
samples: 2
---

## Énoncé
En montant au refuge des Aiguilles, Hugo a noté dans son carnet l'altitude de chaque balise qu'il a croisée, dans l'ordre. Pour le retour, il veut avoir la liste dans l'autre sens : la première balise qu'il verra en redescendant est la dernière qu'il a notée en montant.

Écris un programme qui lit les `N` altitudes notées par Hugo et les affiche dans l'ordre inverse.

## Entrée
- La première ligne contient l'entier `N`, le nombre de balises.
- La deuxième ligne contient `N` entiers séparés par des espaces : les altitudes des balises, dans l'ordre de la montée.

## Sortie
Une seule ligne contenant les `N` altitudes dans l'ordre inverse, séparées par des espaces.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque altitude est comprise entre 0 et 4 800.

## Indices
1. On ne peut pas afficher la dernière altitude avant de l'avoir lue : il faut d'abord ranger toutes les altitudes dans une liste.
2. Les positions dans la liste vont de `0` à `N - 1`. Pour la parcourir à l'envers, fais varier la position de `N - 1` jusqu'à `0`. En Python : `range(n - 1, -1, -1)` ; en C++ : `for (int i = n - 1; i >= 0; i--)`.
3. Pour afficher tous les nombres sur une seule ligne : `print(x, end=" ")` en Python, `cout << x << " ";` en C++.

## Solution
On lit les `N` altitudes et on les range dans une liste. Ensuite, on parcourt la liste en partant de la fin : la position `N - 1` (la dernière balise), puis `N - 2`, et ainsi de suite jusqu'à la position `0` (la première balise).

Le piège classique : les positions commencent à `0`. La dernière case d'une liste de `N` éléments est donc la case `N - 1`, et pas la case `N` (qui n'existe pas). En Python, `range(n - 1, -1, -1)` s'arrête juste avant `-1`, donc la case `0` est bien affichée.

En Python, il existe aussi des raccourcis : `liste[::-1]` ou `reversed(liste)` donnent la liste à l'envers. C'est pratique, mais sache d'abord le faire toi-même avec une boucle.
