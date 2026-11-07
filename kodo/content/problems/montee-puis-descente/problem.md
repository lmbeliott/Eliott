---
id: montee-puis-descente
title: Montée puis descente
chapter: p1-repetitions
order: 4
tags: [boucles]
samples: 1
no_input: true
---

## Énoncé
Afficher les entiers de `1` à `25` dans l'ordre croissant, puis redescendre jusqu'à `1` dans l'ordre décroissant, sans afficher deux fois de suite le sommet `25`. Terminer par une ligne contenant le mot `FIN`.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
Un nombre par ligne : `1`, `2`, …, `24`, `25`, `24`, `23`, …, `2`, `1`, puis une dernière ligne contenant `FIN`. Le nombre `25` apparaît une seule fois, tous les autres deux fois.

## Indices
1. Deux boucles à la suite : une qui monte, une qui descend.
2. Par quel nombre la descente doit-elle commencer pour que `25` ne soit pas affiché deux fois ?

## Solution
La première boucle va de 1 à 25 inclus : `range(1, 26)`. La seconde boucle redescend de 24 à 1 inclus, avec un pas de −1 : `range(24, 0, -1)`. Elle commence à 24 car le sommet a déjà été affiché par la première boucle. Après les deux boucles, on affiche `FIN`.

On peut vérifier le total : 25 nombres à la montée, 24 à la descente, soit 49 nombres, plus la ligne `FIN`. Les erreurs classiques sont de commencer la descente à 25 (le sommet apparaît deux fois), ou d'écrire `range(24, 1, -1)`, qui s'arrête à 2.
