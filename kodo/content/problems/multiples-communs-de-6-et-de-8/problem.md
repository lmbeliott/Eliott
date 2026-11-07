---
id: multiples-communs-de-6-et-de-8
title: Multiples communs de 6 et de 8
chapter: p1-repetitions
order: 6
tags: [boucles, mathématiques]
samples: 1
no_input: true
---

## Énoncé
Afficher, dans l'ordre croissant, tous les entiers strictement positifs et inférieurs à `500` qui sont à la fois multiples de `6` et multiples de `8`.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
Les nombres demandés, un par ligne, dans l'ordre croissant.

## Indices
1. Écrire sur papier les premiers multiples de 8 : 8, 16, 24, 32, 40, 48… Lesquels sont aussi des multiples de 6 ?
2. Le premier nombre qui convient n'est pas 6 × 8 = 48.
3. Une fois le premier nombre trouvé, les suivants s'obtiennent avec un pas constant.

## Solution
Parmi les multiples de 8, le premier qui est aussi un multiple de 6 est 24 (8 et 16 ne sont pas des multiples de 6). Les nombres qui sont multiples à la fois de 6 et de 8 sont exactement les multiples de 24 : 24, 48, 72, … Le nombre 24 est le **plus petit multiple commun** de 6 et de 8.

La boucle part de 24 avec un pas de 24, et s'arrête avant 500 : `range(24, 500, 24)`. Le dernier nombre affiché est 480 = 20 × 24, le suivant, 504, dépasse 500.

Le piège est de prendre le pas 48 = 6 × 8 : on obtient bien des multiples communs, mais on oublie 24, 72, 120… Le produit de deux nombres n'est leur plus petit multiple commun que lorsqu'ils n'ont aucun diviseur commun autre que 1, ce qui n'est pas le cas de 6 et 8 (tous deux pairs).
