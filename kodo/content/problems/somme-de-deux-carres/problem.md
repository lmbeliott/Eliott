---
id: somme-de-deux-carres
title: Somme de deux carrés
chapter: p1-boucles-imbriquees
order: 5
tags: [boucles, mathématiques]
samples: 2
---

## Énoncé
Trouver toutes les façons d'écrire l'entier `N` comme somme de deux carrés : `N = a × a + b × b`, avec `a` et `b` entiers et `0 ≤ a ≤ b`.

Par exemple, `50 = 1 × 1 + 7 × 7 = 5 × 5 + 5 × 5` : il y a deux façons.

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
- Sur la première ligne, le nombre `C` de façons.
- Sur les `C` lignes suivantes, les couples `a b`, un par ligne, séparés par une espace, dans l'ordre croissant de `a`.

Si `N` ne peut pas s'écrire comme somme de deux carrés, afficher seulement `0`.

## Contraintes
- 1 ≤ N ≤ 1 000 000

## Indices
1. Puisque `a ≤ b`, on a `a × a ≤ N / 2` et `b × b ≤ N`. En particulier, `a` et `b` restent inférieurs ou égaux à 1 000.
2. Deux boucles imbriquées : `a` de 0 à 1 000 et `b` de `a` à 1 000. Pour chaque couple, tester si `a × a + b × b == N`.
3. Il faut connaître le nombre de couples avant de les afficher : faire deux fois les mêmes boucles, la première pour compter, la seconde pour afficher.

## Solution
On fait une recherche exhaustive sur les couples `(a, b)` avec `a ≤ b`. Comme `b × b ≤ N ≤ 10⁶`, il suffit d'essayer `b ≤ 1 000`, et la boucle sur `b` commence à `a` pour respecter `a ≤ b`. Cela fait environ 500 000 couples : c'est rapide.

Le nombre de façons doit être affiché **avant** les couples. Sans liste pour les mémoriser, on parcourt deux fois les mêmes couples : un premier passage compte les solutions, on affiche ce nombre, puis un second passage affiche chaque couple trouvé. Comme `a` augmente dans la boucle externe, les couples sortent dans l'ordre croissant de `a`.

On peut aussi limiter les boucles avec des `while` : `a` avance tant que `2 × a × a ≤ N`, et `b` avance tant que `a × a + b × b ≤ N`. C'est ce que font les solutions : moins de tours, même résultat.

Le piège : oublier `a = 0`. Par exemple, `25 = 0 × 0 + 5 × 5 = 3 × 3 + 4 × 4` : il y a deux façons, et pas une seule.
