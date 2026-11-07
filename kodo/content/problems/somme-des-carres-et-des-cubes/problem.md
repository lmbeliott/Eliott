---
id: somme-des-carres-et-des-cubes
title: Somme des carrés et des cubes
chapter: p1-variables
order: 2
tags: [boucles, arithmétique]
samples: 1
no_input: true
---

## Énoncé
Afficher la somme des carrés des entiers de 1 à 100, c'est-à-dire 1 × 1 + 2 × 2 + … + 100 × 100, puis, sur une deuxième ligne, la somme de leurs cubes, 1 × 1 × 1 + 2 × 2 × 2 + … + 100 × 100 × 100.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
Deux lignes : la somme des carrés, puis la somme des cubes.

## Indices
1. Deux accumulateurs, initialisés à 0 avant la boucle, et mis à jour à chaque tour.
2. Une seule boucle suffit : à chaque tour, on ajoute `i * i` au premier et `i * i * i` au second.
3. L'affichage se fait après la boucle, une seule fois.

## Solution
On crée deux variables `carres` et `cubes`, qui valent 0 avant la boucle. Pour `i` de 1 à 100, on ajoute `i * i` à `carres` et `i * i * i` à `cubes`. Après la boucle, on affiche les deux totaux : 338350 et 25502500.

La somme des cubes, 25 502 500, tient dans un `int` en C++ (la limite est environ 2,1 × 10⁹). Curiosité : elle est égale à 5050 × 5050, le carré de la somme 1 + 2 + … + 100. Ce n'est pas un hasard : pour tout n, la somme des cubes de 1 à n est le carré de la somme des entiers de 1 à n.

Les pièges : initialiser les accumulateurs dans la boucle (ils sont remis à 0 à chaque tour), afficher dans la boucle (100 lignes au lieu de 2), ou s'arrêter à 99 avec `range(1, 100)`.
