---
id: doubler-jusqu-a-depasser
title: Doubler jusqu'à dépasser
chapter: p1-tant-que
order: 3
tags: [boucles, simulation]
samples: 2
---

## Énoncé
Une colonie de bactéries compte `A` individus, et leur nombre double à chaque heure.

Afficher le nombre d'heures au bout duquel la colonie compte **strictement plus** de `B` individus.

## Entrée
Une seule ligne contenant deux entiers `A` et `B` séparés par une espace.

## Sortie
Un seul entier : le plus petit nombre d'heures après lequel la colonie compte strictement plus de `B` individus. Si c'est déjà le cas au départ, afficher `0`.

## Contraintes
- 1 ≤ A ≤ 10⁹
- 1 ≤ B ≤ 10¹⁸ (en C++, utiliser des `long long`)

## Indices
1. Simuler heure par heure : tant que la colonie n'a pas dépassé `B`, la doubler et compter une heure de plus.
2. « Strictement plus de `B` » : la boucle doit continuer tant que la colonie est inférieure **ou égale** à `B`.
3. Vérifier à la main avec `A = 5` et `B = 5` : la réponse est 1, pas 0.

## Solution
On simule : une variable `colonie` vaut `A` au départ, un compteur `heures` vaut 0. Tant que `colonie <= B`, on double `colonie` et on ajoute 1 à `heures`. À la sortie de la boucle, la condition est fausse : la colonie dépasse strictement `B`, pour la première fois.

La boucle fait au plus une soixantaine de tours, car 2⁶⁰ dépasse déjà 10¹⁸.

Les pièges : écrire `colonie < B` au lieu de `colonie <= B` (un tour de moins quand la colonie tombe pile sur `B`), et, en C++, utiliser un `int`. La colonie peut atteindre presque 2 × 10¹⁸ : seul un `long long` la contient.
