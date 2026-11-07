---
id: position-d-un-point-et-d-un-rectangle
title: Position d'un point et d'un rectangle
chapter: p1-booleens
order: 1
tags: [conditions]
samples: 3
---

## Énoncé
Un rectangle a ses côtés parallèles aux axes : son coin en bas à gauche est le point `(X1, Y1)` et son coin en haut à droite le point `(X2, Y2)`. Dire si le point `(X, Y)` est strictement à l'intérieur du rectangle, sur son bord, ou à l'extérieur.

## Entrée
- La première ligne contient quatre entiers `X1`, `Y1`, `X2` et `Y2`.
- La deuxième ligne contient deux entiers `X` et `Y`.

## Sortie
`DEDANS` si le point est strictement à l'intérieur, `BORD` s'il est sur un des quatre côtés, `DEHORS` sinon.

## Contraintes
- −1 000 ≤ toutes les coordonnées ≤ 1 000
- X1 < X2 et Y1 < Y2

## Indices
1. Le point est dans le rectangle, bord compris, quand `X` est entre `X1` et `X2` **et** `Y` est entre `Y1` et `Y2` (bornes comprises).
2. Il est strictement à l'intérieur quand ces quatre comparaisons sont strictes.
3. Si le point est dans le rectangle bord compris, mais pas strictement à l'intérieur, il est sur le bord.

## Solution
On calcule deux booléens :
- `dedans_large` : `X1 <= X <= X2` et `Y1 <= Y <= Y2`, soit quatre comparaisons reliées par `and` ;
- `dedans_strict` : les mêmes comparaisons avec `<` au lieu de `<=`.

Si `dedans_strict` est vrai, on affiche `DEDANS` ; sinon, si `dedans_large` est vrai, le point est dans le rectangle sans être à l'intérieur : `BORD` ; sinon `DEHORS`. L'ordre des tests compte, car un point strictement à l'intérieur vérifie aussi `dedans_large`.

Le piège est de ne tester qu'une coordonnée pour le bord : le point `(X1, Y)` n'est sur le bord que si `Y` est entre `Y1` et `Y2`. Sinon, il est dehors, sur le prolongement du côté. En C++, on n'écrit pas `x1 <= x <= x2`, qui est toujours vrai : il faut `x1 <= x && x <= x2`.
