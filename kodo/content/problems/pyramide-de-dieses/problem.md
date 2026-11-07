---
id: pyramide-de-dieses
title: Pyramide de dièses
chapter: p1-boucles-imbriquees
order: 3
tags: [boucles]
samples: 2
---

## Énoncé
Dessiner une pyramide de hauteur `N` avec des caractères `#`, dans un rectangle de `N` lignes et `2 × N - 1` colonnes. Le sommet est une seule case `#` au milieu de la première ligne ; chaque ligne compte deux `#` de plus que la précédente, et la dernière ligne est entièrement remplie. Les cases vides sont représentées par des `.`.

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
`N` lignes de `2 × N - 1` caractères chacune, `#` ou `.`, sans espaces.

## Contraintes
- 1 ≤ N ≤ 50

## Indices
1. Compter, pour la ligne numéro `i` (en partant de 1), le nombre de `.` à gauche, le nombre de `#`, puis le nombre de `.` à droite. Faire un tableau pour `N = 4`.
2. La ligne `i` contient `N - i` points, puis `2 × i - 1` dièses, puis `N - i` points.
3. Pour chaque ligne, trois boucles internes à la suite : une par groupe de caractères.

## Solution
On regarde la pyramide pour `N = 4` :

- ligne 1 : `...#...` (3 points, 1 dièse, 3 points) ;
- ligne 2 : `..###..` (2, 3, 2) ;
- ligne 3 : `.#####.` (1, 5, 1) ;
- ligne 4 : `#######` (0, 7, 0).

La ligne `i` contient donc `N - i` points, `2 × i - 1` dièses et `N - i` points. On vérifie le total : `(N - i) + (2 × i - 1) + (N - i) = 2 × N - 1`, la largeur attendue.

Le programme a une boucle externe sur les lignes et, dans son corps, trois boucles successives (et non imbriquées entre elles) qui affichent chacune un groupe de caractères. Une autre méthode consiste à parcourir les colonnes `j` de 1 à `2 × N - 1` et à afficher `#` quand `N - i < j` et `j ≤ N + i - 1`.
