---
id: damier-de-huit-lignes
title: Damier de huit lignes
chapter: p1-affichage
order: 2
tags: [entrées-sorties]
samples: 1
no_input: true
---

## Énoncé
Afficher un damier de 8 lignes et 8 colonnes, où `#` représente une case noire et `.` une case blanche. Deux cases voisines (à gauche, à droite, au-dessus ou en dessous) n'ont jamais la même couleur, et la case en haut à gauche est noire.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
8 lignes de 8 caractères chacune, composées uniquement de `#` et de `.`.

## Indices
1. Écrire d'abord la première ligne : elle commence par `#` et alterne.
2. La deuxième ligne commence sous un `#` : sa première case est donc blanche. Combien de lignes différentes le damier contient-il en tout ?

## Solution
La première ligne alterne en commençant par une case noire : `#.#.#.#.`. La case située juste en dessous de chaque `#` doit être blanche, et inversement : la deuxième ligne est donc `.#.#.#.#`. La troisième ligne est sous la deuxième, elle redevient `#.#.#.#.`, et ainsi de suite.

Le damier ne contient donc que deux lignes différentes, qui alternent : les lignes 1, 3, 5, 7 sont `#.#.#.#.` et les lignes 2, 4, 6, 8 sont `.#.#.#.#`. Le piège classique est d'écrire 8 fois la même ligne : les colonnes seraient alors d'une seule couleur.
