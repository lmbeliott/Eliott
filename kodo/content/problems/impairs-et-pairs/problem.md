---
id: impairs-et-pairs
title: Impairs et pairs
chapter: p1-lecture
order: 6
tags: [entrées-sorties, boucles, arithmétique]
samples: 2
---

## Énoncé
Lire `N` entiers positifs ou nuls, puis afficher combien d'entre eux sont impairs, et combien sont pairs.

## Entrée
- La première ligne contient l'entier `N`.
- La deuxième ligne contient `N` entiers séparés par des espaces.

## Sortie
Deux lignes : le nombre de valeurs impaires, puis le nombre de valeurs paires.

## Contraintes
- 1 ≤ N ≤ 1 000
- 0 ≤ chaque valeur ≤ 1 000 000 000

## Indices
1. Les conditions (`if`) arrivent au chapitre suivant : ici, tout se calcule avec des opérations arithmétiques.
2. Que vaut `x % 2` quand `x` est pair ? Et quand `x` est impair ?
3. Si on additionne `x % 2` pour toutes les valeurs, chaque valeur impaire ajoute `1` et chaque valeur paire ajoute `0`.
4. Une valeur qui n'est pas impaire est paire : le second nombre se déduit du premier et de `N`.

## Solution
Le reste de la division d'un entier positif par 2 vaut `0` s'il est pair et `1` s'il est impair. En additionnant `x % 2` pour toutes les valeurs lues, on ajoute exactement `1` par valeur impaire : la somme obtenue est le nombre de valeurs impaires. Le nombre de valeurs paires est alors `N` moins ce nombre.

Cette astuce, qui transforme un test en calcul, fonctionne ici parce que les valeurs sont positives ou nulles. Avec des nombres négatifs, le reste n'a pas le même signe en Python et en C++ : on verra au chapitre suivant comment écrire ce comptage avec une condition, ce qui marche dans tous les cas.

En Python, les valeurs sont sur une seule ligne : on la parcourt avec `for morceau in input().split():`.
