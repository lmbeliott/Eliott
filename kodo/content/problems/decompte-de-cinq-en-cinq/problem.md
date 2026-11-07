---
id: decompte-de-cinq-en-cinq
title: Décompte de cinq en cinq
chapter: p1-repetitions
order: 2
tags: [boucles]
samples: 1
no_input: true
---

## Énoncé
Afficher un compte à rebours qui part de `150` et descend de 5 en 5 jusqu'à `0` inclus, puis le mot `ZERO`.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
Les nombres `150`, `145`, `140`, …, `5`, `0`, un par ligne, puis une dernière ligne contenant `ZERO`.

## Indices
1. Pour compter à rebours, le pas de la boucle est négatif.
2. La boucle s'arrête juste **avant** la borne : pour que `0` soit affiché, la borne doit être plus petite que 0.
3. Le mot `ZERO` n'est affiché qu'une fois : il se place après la boucle.

## Solution
La boucle `range(150, -1, -5)` produit 150, 145, …, 5, 0 : la valeur suivante serait −5, qui n'est pas strictement supérieure à la borne −1. En C++, on écrit `for (int i = 150; i >= 0; i -= 5)`. Après la boucle, une instruction affiche `ZERO`.

Le piège principal est d'écrire `range(150, 0, -5)`, qui s'arrête à 5 et oublie le 0. L'autre est d'indenter l'affichage de `ZERO`, qui se retrouve alors répété à chaque tour.
