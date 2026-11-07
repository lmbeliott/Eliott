---
id: suite-de-syracuse
title: Suite de Syracuse
chapter: p1-tant-que
order: 6
tags: [boucles, simulation]
samples: 2
---

## Énoncé
On part d'un entier `N` et on répète la transformation suivante : si le nombre est pair, on le divise par 2 ; s'il est impair, on le remplace par `3 × n + 1`. On s'arrête dès que le nombre vaut `1`.

Par exemple, en partant de `6`, on obtient `6, 3, 10, 5, 16, 8, 4, 2, 1` : il faut 8 étapes, et la plus grande valeur rencontrée est 16.

Afficher le nombre d'étapes nécessaires pour arriver à `1`, puis la plus grande valeur rencontrée (en comptant `N`).

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
Une seule ligne avec deux entiers séparés par une espace : le nombre d'étapes, puis la plus grande valeur rencontrée.

## Contraintes
- 1 ≤ N ≤ 1 000 000
- Pour ces valeurs, on sait que la suite arrive toujours à `1`, en moins de 600 étapes.
- La plus grande valeur peut dépasser 10¹⁰ : en C++, utiliser des `long long`.

## Indices
1. Une boucle `while` qui continue tant que le nombre est différent de `1`. Dans le corps, un `if` choisit la transformation.
2. Garder la plus grande valeur vue dans une variable. Elle vaut `N` au départ, et on la met à jour après chaque transformation.
3. Avec `N = 1`, il n'y a aucune étape : la réponse est `0 1`.

## Solution
On simule la suite. Trois variables : le nombre courant `n`, le compteur `etapes` et le maximum `plus_grand`, qui vaut `N` au départ (la valeur de départ compte).

Tant que `n != 1` : si `n % 2 == 0`, on fait `n = n // 2`, sinon `n = 3 * n + 1` ; puis on ajoute 1 à `etapes` et, si `n` dépasse `plus_grand`, on met `plus_grand` à jour.

Ici, la condition `n != 1` est sûre : la suite ne saute pas par-dessus `1`, elle finit par tomber exactement dessus (personne n'a jamais trouvé de nombre de départ pour lequel ce n'est pas le cas, et c'est vérifié pour tous ceux de l'énoncé).

Le piège en C++ : les valeurs montent beaucoup plus haut que `N`. En partant de `704 511`, on dépasse 5 × 10¹⁰, bien au-delà de la limite d'un `int` : sans `long long`, le calcul devient faux et la boucle peut ne jamais s'arrêter.
