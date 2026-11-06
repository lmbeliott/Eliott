---
id: compte-a-rebours
title: Le compte à rebours
chapter: n1-boucles
order: 1
tags: [boucles]
samples: 2
---

## Énoncé
C'est le soir de la grande descente aux flambeaux de la station de Valcorde ! Au sommet de la piste, les skieurs attendent le signal de Nathan, le moniteur. Il compte à voix haute à partir de `N` jusqu'à 1, puis il crie « PARTEZ » et tout le monde s'élance.

Écris un programme qui lit `N` et affiche le compte à rebours de Nathan : les nombres de `N` jusqu'à `1`, un par ligne, puis le mot `PARTEZ`.

## Entrée
Une seule ligne contenant un entier `N`.

## Sortie
`N + 1` lignes : les entiers `N`, `N - 1`, …, `2`, `1`, un par ligne, puis une dernière ligne contenant le mot `PARTEZ` en majuscules.

## Contraintes
- 1 ≤ N ≤ 100

## Indices
1. Afficher un nombre, `N` fois de suite : c'est le travail d'une boucle. Il faut juste qu'elle compte à l'envers.
2. En Python, `range(n, 0, -1)` donne `n`, `n - 1`, …, `1` : on part de `n`, on recule de 1 à chaque tour, et on s'arrête **avant** 0. En C++ : `for (int i = n; i >= 1; i--)`.
3. Le mot `PARTEZ` n'est affiché qu'une seule fois, après la boucle : il ne doit pas être dans le bloc répété.

## Solution
Une boucle fait varier `i` de `N` jusqu'à `1` en reculant d'un pas à chaque tour, et affiche `i`. Après la boucle, on affiche `PARTEZ`.

En Python, `range(n, 0, -1)` s'arrête juste avant `0`, donc le dernier nombre affiché est bien `1`. On peut aussi utiliser une boucle `while` : on part de `i = n`, et tant que `i >= 1`, on affiche `i` puis on enlève 1 à `i`.

Les pièges classiques :
- écrire `range(n, 1, -1)`, qui s'arrête avant `1` et oublie donc le dernier nombre ;
- mettre `print("PARTEZ")` dans la boucle (avec la même indentation que l'affichage du nombre) : le mot serait alors affiché à chaque tour.
