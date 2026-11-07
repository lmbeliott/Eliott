---
id: deuxieme-plus-grande-valeur
title: Deuxième plus grande valeur
chapter: p1-conditions
order: 7
tags: [conditions, boucles]
samples: 3
---

## Énoncé
Lire `N` entiers et afficher la deuxième plus grande valeur, c'est-à-dire celle qui arrive en deuxième position quand on range les valeurs de la plus grande à la plus petite. Si la plus grande valeur apparaît plusieurs fois, la réponse est donc cette même valeur.

## Entrée
- La première ligne contient l'entier `N`.
- Les `N` lignes suivantes contiennent chacune un entier.

## Sortie
Un seul entier : la deuxième plus grande valeur.

## Contraintes
- 2 ≤ N ≤ 1 000
- −1 000 000 000 ≤ chaque valeur ≤ 1 000 000 000

## Indices
1. On garde deux variables : `premier`, la plus grande valeur vue jusqu'ici, et `second`, la deuxième.
2. Pour démarrer, on lit les deux premières valeurs et on range la plus grande dans `premier`, l'autre dans `second`.
3. Une nouvelle valeur `x` peut détrôner `premier` (et alors l'ancien `premier` devient `second`), ou seulement `second`, ou rien du tout.

## Solution
On tient à jour les deux plus grandes valeurs vues jusqu'ici, avec `premier ≥ second`. Au départ, on lit deux valeurs et on les place dans le bon ordre. Puis, pour chaque nouvelle valeur `x` :
- si `x > premier`, l'ancien premier passe deuxième : `second = premier`, puis `premier = x` ;
- sinon, si `x > second`, `x` prend seulement la deuxième place : `second = x` ;
- sinon, rien ne change.

L'ordre des deux affectations du premier cas compte : si on écrit d'abord `premier = x`, l'ancienne valeur de `premier` est perdue.

Ce raisonnement gère aussi les valeurs répétées. Avec `9, 4, 9`, le troisième `9` n'est pas plus grand que `premier`, mais il est plus grand que `second` (4) : il prend la deuxième place, et la réponse est `9`, comme demandé. Il faut aussi faire attention à ne pas partir de `0` : toutes les valeurs peuvent être négatives.
