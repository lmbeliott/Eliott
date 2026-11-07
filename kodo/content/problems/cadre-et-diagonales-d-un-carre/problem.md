---
id: cadre-et-diagonales-d-un-carre
title: Cadre et diagonales d'un carré
chapter: p1-boucles-imbriquees
order: 2
tags: [boucles, conditions]
samples: 2
---

## Énoncé
Dessiner un carré de `N` lignes et `N` colonnes de caractères. Un caractère vaut `#` s'il est sur le bord du carré ou sur l'une de ses deux diagonales, et `.` sinon.

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
`N` lignes de `N` caractères chacune, `#` ou `.`, sans espaces.

## Contraintes
- 1 ≤ N ≤ 50

## Indices
1. Numéroter les lignes `i` et les colonnes `j` de 0 à `N - 1`, et parcourir toutes les cases avec deux boucles imbriquées.
2. Écrire les coordonnées des cases `#` pour `N = 5` et chercher ce qu'elles ont en commun. Le bord est formé des cases où `i` ou `j` vaut `0` ou `N - 1`.
3. Une diagonale est formée des cases où `i == j`, l'autre des cases où `i + j == N - 1`. Il suffit d'une seule condition avec des `or`.

## Solution
Deux boucles imbriquées parcourent les cases `(i, j)`, avec `i` et `j` de 0 à `N - 1`. Une case est `#` si l'une de ces conditions est vraie :
- elle est sur le bord : `i == 0`, `i == N - 1`, `j == 0` ou `j == N - 1` ;
- elle est sur la diagonale qui descend vers la droite : `i == j` ;
- elle est sur l'autre diagonale : `i + j == N - 1`.

On les réunit avec `or` dans un seul `if`. On affiche chaque caractère sans retour à la ligne, et on passe à la ligne à la fin de chaque ligne.

Pour trouver la condition de l'autre diagonale, on regarde ses cases pour `N = 5` : `(0, 4)`, `(1, 3)`, `(2, 2)`, `(3, 1)`, `(4, 0)`. La somme `i + j` vaut toujours 4, c'est-à-dire `N - 1`.
