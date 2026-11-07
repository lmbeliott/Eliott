---
id: nombre-ayant-le-plus-de-diviseurs
title: Nombre ayant le plus de diviseurs
chapter: p1-boucles-imbriquees
order: 7
tags: [boucles, mathématiques]
samples: 2
---

## Énoncé
Parmi `N` entiers donnés, trouver celui qui a le plus de diviseurs. Par exemple, `12` a 6 diviseurs (`1, 2, 3, 4, 6, 12`) et `13` en a 2.

Si plusieurs entiers ont le même nombre maximal de diviseurs, choisir le plus petit d'entre eux.

## Entrée
- La première ligne contient l'entier `N`.
- Chacune des `N` lignes suivantes contient un entier.

## Sortie
Une seule ligne avec deux entiers séparés par une espace : l'entier choisi, puis son nombre de diviseurs.

## Contraintes
- 1 ≤ N ≤ 100
- Chaque entier est compris entre 1 et 1 000 000.

## Indices
1. Pour chaque entier `x` lu, compter ses diviseurs avec une boucle interne. Tester tous les `d` de 1 à `x` fait jusqu'à 100 millions de tours au total : trop lent.
2. Les diviseurs vont par paires : si `d` divise `x`, alors `x // d` aussi. Il suffit de parcourir les `d` tels que `d × d ≤ x`, et de compter 2 diviseurs à chaque fois que `d` divise `x`.
3. Attention aux carrés : si `d × d == x`, les deux diviseurs de la paire sont le même nombre, qu'il ne faut compter qu'une fois.

## Solution
Pour chaque entier `x`, on compte ses diviseurs **par paires**. Si `d` divise `x`, alors `e = x // d` divise aussi `x`, et l'un des deux est inférieur ou égal à l'autre. On parcourt donc seulement les `d` tels que `d × d ≤ x` : chaque fois que `d` divise `x`, on compte `d` et `x // d`, soit 2 diviseurs, sauf si `d × d == x`, où ils sont égaux et ne comptent qu'une fois. Pour `12`, on trouve les paires `(1, 12)`, `(2, 6)` et `(3, 4)` : 6 diviseurs. Pour `36`, la paire `(6, 6)` ne compte qu'une fois : 9 diviseurs.

La boucle interne fait au plus 1 000 tours par entier, donc au plus 100 000 tours en tout.

On garde ensuite le meilleur, comme pour un maximum : si le nombre de diviseurs de `x` est strictement plus grand que le meilleur connu, ou s'il est égal et que `x` est plus petit que l'entier retenu, on retient `x`.

Les pièges : le compteur de diviseurs doit être remis à 0 pour chaque nouvel entier, et le cas d'égalité doit comparer les entiers eux-mêmes (pas leur ordre d'arrivée). Le nombre `1` a un seul diviseur.
