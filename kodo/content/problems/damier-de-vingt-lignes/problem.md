---
id: damier-de-vingt-lignes
title: Damier de vingt lignes
chapter: p1-repetitions
order: 3
tags: [boucles]
samples: 1
no_input: true
---

## Énoncé
Afficher un damier de 20 lignes et 20 colonnes, où `#` représente une case noire et `.` une case blanche. Deux cases voisines (à gauche, à droite, au-dessus ou en dessous) n'ont jamais la même couleur, et la case en haut à gauche est noire.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
20 lignes de 20 caractères chacune, composées uniquement de `#` et de `.`.

## Indices
1. Le damier ne contient que deux lignes différentes, qui alternent.
2. Les lignes 1 et 2 forment un motif ; ce motif est répété. Combien de fois ?
3. Le corps d'une boucle peut contenir deux instructions d'affichage.

## Solution
La première ligne est `#.#.#.#.#.#.#.#.#.#.` (20 caractères qui alternent, en commençant par `#`), et la deuxième est son inverse, `.#.#.#.#.#.#.#.#.#.#`. Ensuite, la troisième ligne est de nouveau la première, et ainsi de suite.

Le damier est donc le bloc de ces deux lignes, répété 10 fois. Le programme est une boucle de 10 tours, dont le corps affiche les deux lignes : 2 × 10 = 20 lignes. La variable de boucle ne sert pas dans le corps ; elle sert seulement à compter les tours.

Les pièges : répéter le bloc 20 fois (on obtient 40 lignes), ou se tromper dans la longueur des lignes. Pour vérifier une ligne, on compte les paires `#.` : il en faut 10.
