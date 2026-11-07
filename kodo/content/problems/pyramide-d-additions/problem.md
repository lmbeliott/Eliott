---
id: pyramide-d-additions
title: Pyramide d'additions
chapter: p1-affichage
order: 8
synthesis: true
tags: [entrées-sorties, arithmétique]
samples: 1
no_input: true
---

## Énoncé
Une pyramide de nombres a pour base la ligne `2 7 1 8 2 8`. Chaque nombre situé au-dessus de la base est la somme des deux nombres sur lesquels il repose : la ligne juste au-dessus de la base commence par 2 + 7 = 9, puis 7 + 1 = 8, et ainsi de suite, jusqu'au sommet qui ne contient qu'un nombre.

Afficher la pyramide entière, du sommet jusqu'à la base, puis une ligne vide, puis une dernière ligne contenant le mot `SOMMET` suivi du nombre au sommet.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
D'abord 6 lignes : la ligne numéro k (de 1 à 6) contient les k nombres de l'étage numéro k en partant du sommet, séparés par une espace. La sixième ligne est donc la base `2 7 1 8 2 8`. Ensuite une ligne vide, puis une ligne de la forme `SOMMET x`, où `x` est le nombre au sommet.

## Indices
1. Les étages se calculent du bas vers le haut, mais s'affichent du haut vers le bas : il faut tout calculer sur papier avant d'écrire le programme.
2. Chaque étage a un nombre de moins que celui du dessous. L'étage juste au-dessus de la base est `9 8 9 10 10`.
3. Pour vérifier, le sommet peut aussi se calculer directement : c'est 1 × 2 + 5 × 7 + 10 × 1 + 10 × 8 + 5 × 2 + 1 × 8, avec les coefficients d'une ligne du triangle de Pascal.

## Solution
On calcule les étages en partant de la base :

- base : `2 7 1 8 2 8` ;
- étage 5 : `9 8 9 10 10` ;
- étage 4 : `17 17 19 20` ;
- étage 3 : `34 36 39` ;
- étage 2 : `70 75` ;
- sommet : `145`.

Le programme affiche ensuite ces lignes **dans l'ordre inverse** de celui du calcul, du sommet vers la base, puis la ligne vide et `SOMMET 145`.

La vérification de l'indice 3 vient du triangle de Pascal : chaque nombre de la base est compté au sommet autant de fois qu'il existe de chemins qui montent de lui jusqu'au sommet, et ces nombres de chemins sont 1, 5, 10, 10, 5, 1. On trouve bien 2 + 35 + 10 + 80 + 10 + 8 = 145.
