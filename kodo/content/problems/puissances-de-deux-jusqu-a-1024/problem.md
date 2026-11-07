---
id: puissances-de-deux-jusqu-a-1024
title: Puissances de deux jusqu'à 1024
chapter: p1-affichage
order: 3
tags: [entrées-sorties, mathématiques]
samples: 1
no_input: true
---

## Énoncé
Une suite commence par `1`, et chaque nombre suivant est le double du précédent. Afficher, sur une seule ligne, tous les nombres de cette suite du premier jusqu'à `1024` inclus, puis, sur une deuxième ligne, les mêmes nombres dans l'ordre inverse.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
Deux lignes. La première contient les nombres de la suite, de `1` à `1024`, dans l'ordre croissant, séparés par une espace. La seconde contient les mêmes nombres, de `1024` à `1`.

## Indices
1. Calculer d'abord les nombres sur papier : 1, 2, 4, 8… jusqu'à 1024. Combien y en a-t-il ?
2. En Python, `print(a, b, c)` affiche plusieurs valeurs sur une même ligne, séparées par une espace. En C++, il faut écrire les espaces soi-même : `cout << a << " " << b`.

## Solution
En doublant à partir de 1, on obtient 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 : 11 nombres. Ce sont les **puissances de deux**, que l'on retrouvera souvent en informatique.

Chaque ligne s'affiche avec une seule instruction qui contient les 11 nombres. Les pièges : oublier le `1` du début (la suite commence à 1, pas à 2), s'arrêter à 512, ou, en C++, oublier les espaces entre les nombres, ce qui les colle les uns aux autres.
