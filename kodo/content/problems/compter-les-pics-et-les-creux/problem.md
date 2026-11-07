---
id: compter-les-pics-et-les-creux
title: Compter les pics et les creux
chapter: p1-booleens
order: 6
tags: [conditions, boucles]
samples: 2
---

## Énoncé
On relève l'altitude en `N` points d'un sentier, dans l'ordre. Un relevé est un **pic** s'il est strictement plus haut que ses deux voisins, et un **creux** s'il est strictement plus bas que ses deux voisins. Le premier et le dernier relevé n'ont qu'un voisin : ils ne sont jamais ni pic ni creux. Afficher le nombre de pics et le nombre de creux.

## Entrée
- La première ligne contient l'entier `N`.
- Les `N` lignes suivantes contiennent chacune un entier : une altitude.

## Sortie
Une seule ligne contenant deux entiers séparés par une espace : le nombre de pics, puis le nombre de creux.

## Contraintes
- 3 ≤ N ≤ 1 000
- 0 ≤ chaque altitude ≤ 10 000

## Indices
1. Pour savoir si une valeur est un pic, il faut connaître la valeur d'avant **et** celle d'après. On ne peut donc décider qu'après avoir lu la valeur suivante.
2. On garde deux variables : `avant` et `milieu`. Quand on lit une nouvelle valeur `apres`, on examine `milieu`.
3. Après l'examen, les variables avancent d'un cran : `avant` prend la valeur de `milieu`, puis `milieu` celle de `apres`.

## Solution
On fait glisser une fenêtre de trois valeurs consécutives le long de la suite. On lit les deux premières valeurs dans `avant` et `milieu`, puis on fait `N − 2` tours. À chaque tour, on lit `apres` et on examine `milieu` :
- si `milieu > avant and milieu > apres`, c'est un pic ;
- si `milieu < avant and milieu < apres`, c'est un creux.

Puis on décale : `avant = milieu`, et `milieu = apres`. L'ordre de ces deux affectations compte : dans l'autre ordre, l'ancienne valeur de `milieu` serait perdue.

Les pièges : avec des comparaisons larges (`>=`), un plateau comme `2 5 5 3` donnerait deux pics, alors qu'il n'y en a aucun ; et il ne faut pas examiner le premier ni le dernier relevé.
