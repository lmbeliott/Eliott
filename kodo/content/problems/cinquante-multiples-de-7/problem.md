---
id: cinquante-multiples-de-7
title: Cinquante multiples de 7
chapter: p1-repetitions
order: 1
tags: [boucles]
samples: 1
no_input: true
---

## Énoncé
Afficher les 50 premiers multiples strictement positifs de 7, dans l'ordre croissant : `7`, `14`, `21`, et ainsi de suite.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
50 lignes : les multiples de 7, de `7` jusqu'au cinquantième, un par ligne.

## Indices
1. Deux multiples de 7 consécutifs sont espacés de 7 : c'est le pas de la boucle.
2. Le cinquantième multiple de 7 est 50 × 7 = 350. Quelle borne donner à `range` pour que 350 soit affiché ?

## Solution
Une boucle de pas 7 qui commence à 7 produit exactement les multiples de 7 : `range(7, 351, 7)` en Python, `for (int i = 7; i <= 350; i += 7)` en C++.

Le dernier multiple voulu est 350 ; comme la borne de `range` est exclue, il faut donner une borne strictement plus grande que 350 (et au plus 357, pour ne pas inclure le multiple suivant). Avec `range(7, 350, 7)`, on s'arrêterait à 343 et on n'aurait que 49 nombres. Une bonne habitude : vérifier le premier nombre, le dernier, et le nombre de tours.
