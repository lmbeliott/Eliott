---
id: au-dessus-de-la-moyenne
title: Au-dessus de la moyenne
chapter: n1-listes
order: 4
tags: [listes]
samples: 2
---

## Énoncé
Une usine note chaque jour le nombre de pièces fabriquées, pendant `N` jours. On veut savoir combien de jours la production a été strictement supérieure à la moyenne.

La moyenne est la somme des productions de tous les jours, divisée par le nombre de jours `N`. Elle n'est pas forcément un nombre entier.

Écris un programme qui lit les productions des `N` jours et affiche le nombre de jours où la production a été strictement supérieure à la moyenne.

## Entrée
- La première ligne contient l'entier `N`, le nombre de jours.
- La deuxième ligne contient `N` entiers séparés par des espaces : le nombre de pièces fabriquées chaque jour.

## Sortie
Un seul entier : le nombre de jours où la production a été strictement supérieure à la moyenne.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque jour, entre 0 et 500 pièces sont fabriquées.

## Indices
1. Pour savoir si un jour est au-dessus de la moyenne, il faut connaître la moyenne… donc avoir déjà lu **tous** les jours. Range les productions dans une liste.
2. Fais deux parcours de la liste : le premier calcule la somme `S` des productions, le second compte les jours au-dessus de la moyenne.
3. Un jour où l'on a fabriqué `x` pièces est au-dessus de la moyenne si `x > S / N`. Pour rester avec des nombres entiers, tu peux écrire la même condition sans division : `x * N > S`.

## Solution
On ne peut pas décider si un jour est au-dessus de la moyenne au moment où on le lit, car la moyenne dépend aussi des jours suivants. C'est exactement pour cela qu'on a besoin d'une liste : on garde toutes les productions en mémoire, puis on fait **deux parcours**.
- Premier parcours : on calcule la somme `S` de toutes les productions.
- Second parcours : on compte les jours dont la production `x` est strictement supérieure à la moyenne `S / N`.

Pour éviter les nombres à virgule, on multiplie les deux côtés de la comparaison par `N` (qui est positif) : `x > S / N` revient à `x * N > S`. Tout reste entier, il n'y a aucune question d'arrondi à se poser.

Le piège classique : vouloir tout faire en un seul parcours, en comparant chaque jour à la moyenne des jours lus jusque-là. Cette moyenne-là change en cours de route, et ce n'est pas la moyenne de tous les jours.

Un jour exactement égal à la moyenne ne compte pas : la comparaison est stricte. Si tous les jours ont la même production, la réponse est donc `0`.
