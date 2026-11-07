---
id: quarante-termes-de-fibonacci
title: Quarante termes de Fibonacci
chapter: p1-variables
order: 5
tags: [boucles, arithmétique]
samples: 1
no_input: true
---

## Énoncé
Une suite commence par `1` et `1`, et chaque terme suivant est la somme des deux termes qui le précèdent : 1, 1, 2, 3, 5, 8, 13… Afficher les 40 premiers termes de cette suite.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
40 lignes : les 40 premiers termes, dans l'ordre, un par ligne.

## Indices
1. Il suffit de retenir les deux derniers termes, dans deux variables `a` et `b`.
2. À chaque tour, on affiche `a`, puis on décale : le nouveau `a` est l'ancien `b`, et le nouveau `b` est l'ancien `a + b`.
3. Attention à l'ordre des affectations : après `a = b`, l'ancienne valeur de `a` est perdue. Une variable temporaire règle le problème.

## Solution
On garde deux variables : `a`, le terme à afficher, et `b`, le terme suivant. Au départ, `a = 1` et `b = 1`. À chaque tour, on affiche `a`, puis on avance d'un cran dans la suite : on calcule d'abord `c = a + b` (le terme qui suit `b`), puis `a = b` et `b = c`. Après 40 tours, on a affiché les 40 premiers termes ; le dernier est 102334155.

Le piège est d'écrire `a = b` puis `b = a + b` : au moment du second calcul, `a` contient déjà la nouvelle valeur, et on obtient `b + b` au lieu de `a + b`. La suite affichée devient alors 1, 1, 2, 4, 8, 16… La variable temporaire `c` mémorise le résultat avant que les anciennes valeurs ne soient écrasées.

Cette suite est la célèbre **suite de Fibonacci**. Ses termes grandissent vite : le 40ᵉ dépasse cent millions, et le 47ᵉ ne tient plus dans un `int` en C++.
