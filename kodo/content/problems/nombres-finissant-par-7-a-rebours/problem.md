---
id: nombres-finissant-par-7-a-rebours
title: Nombres finissant par 7, à rebours
chapter: p1-repetitions
order: 5
tags: [boucles]
samples: 1
no_input: true
---

## Énoncé
Afficher, du plus grand au plus petit, tous les entiers compris entre `1000` et `2000` dont le dernier chiffre est `7`.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
Les nombres demandés, un par ligne, dans l'ordre décroissant.

## Indices
1. Quel est le plus grand de ces nombres ? Le plus petit ?
2. Quel est l'écart entre deux nombres consécutifs qui se terminent par 7 ?
3. Le pas est négatif, et la borne est exclue : elle doit être un peu plus petite que le dernier nombre à afficher.

## Solution
Le plus grand nombre inférieur à 2000 qui se termine par 7 est 1997, le plus petit au-dessus de 1000 est 1007. Deux nombres consécutifs qui se terminent par 7 sont espacés de 10 (1997, 1987, 1977…). La boucle part donc de 1997 avec un pas de −10.

Pour que 1007 soit affiché et pas 997, la borne doit être comprise entre 997 et 1006 : par exemple `range(1997, 1000, -10)`. En C++ : `for (int i = 1997; i >= 1007; i -= 10)`. Il y a 100 nombres en tout : un par dizaine, et 100 dizaines entre 1000 et 2000.
