---
id: distance-maximale-d-un-robot
title: Distance maximale d'un robot
chapter: p1-synthese
order: 3
tags: [simulation, conditions]
samples: 2
---

## Énoncé
Un robot part du point `(0, 0)` d'un quadrillage et exécute `N` ordres. Chaque ordre est une direction, `N` (nord : `y` augmente), `S` (sud : `y` diminue), `E` (est : `x` augmente) ou `O` (ouest : `x` diminue), suivie d'un nombre de pas `K`.

La **distance** du robot au point de départ est le nombre de pas minimal pour y revenir en suivant le quadrillage : `|x| + |y|`, où `|x|` est la valeur de `x` sans son signe.

Afficher la position finale du robot, puis la plus grande distance au point de départ atteinte pendant tout le trajet.

## Entrée
- La première ligne contient l'entier `N`.
- Chacune des `N` lignes suivantes contient une lettre (`N`, `S`, `E` ou `O`) et un entier `K`, séparés par une espace.

## Sortie
Une seule ligne avec trois entiers séparés par des espaces : `x` et `y` à la fin du trajet, puis la plus grande distance au point de départ atteinte.

## Contraintes
- 1 ≤ N ≤ 1 000
- 1 ≤ K ≤ 1 000 000

## Indices
1. Garder la position `(x, y)` dans deux variables et les mettre à jour après chaque ordre. Pour lire un ordre en Python : `d, k = input().split()`, puis `k = int(k)`.
2. Pour calculer `|x|` sans fonction, utiliser un `if` : si `x` est négatif, sa valeur sans signe est `-x`.
3. Pendant un ordre, le robot avance en ligne droite : sa distance au départ évolue toujours dans le même sens, ou diminue puis augmente. Elle est donc la plus grande au début ou à la fin de l'ordre, jamais au milieu : il suffit de la regarder après chaque ordre.

## Solution
On simule le trajet ordre par ordre : selon la lettre, on ajoute `K` à `y` (`N`), on l'enlève à `y` (`S`), on l'ajoute à `x` (`E`) ou on l'enlève à `x` (`O`). On compare les mots en entier : `d == "N"`.

Après chaque ordre, on calcule la distance `|x| + |y|` (avec deux `if` pour enlever les signes) et on met à jour le maximum, qui vaut 0 au départ.

Pourquoi suffit-il de regarder la fin de chaque ordre ? Pendant un ordre vers l'est, par exemple, `y` ne change pas et `x` augmente. La valeur `|x|` diminue tant que `x` est négatif, puis augmente : elle ne peut pas être plus grande au milieu du trajet qu'à ses deux extrémités. Le début d'un ordre étant la fin du précédent (ou le départ, à distance 0), toutes les extrémités sont examinées.

La lettre `N` sert à la fois de nombre d'ordres et de direction : ce n'est pas un problème, car le nombre d'ordres est sur la première ligne et les directions sur les suivantes.
