---
id: table-celsius-fahrenheit
title: Table Celsius-Fahrenheit
chapter: p1-variables
order: 1
tags: [boucles, arithmétique]
samples: 1
no_input: true
---

## Énoncé
Une température de C degrés Celsius vaut F = C × 9 / 5 + 32 degrés Fahrenheit. Afficher une table de conversion pour toutes les températures Celsius de `-40` à `100` inclus, de 5 en 5.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
Une ligne par température, dans l'ordre croissant : la température en degrés Celsius, une espace, puis la température correspondante en degrés Fahrenheit. La première ligne est `-40 -40` et la dernière `100 212`.

## Indices
1. Une boucle de pas 5 donne les températures Celsius ; la température Fahrenheit se calcule dans l'affichage, avec la variable de boucle.
2. Comme C est toujours un multiple de 5, C × 9 est un multiple de 5 : la division tombe juste. Il faut multiplier par 9 **avant** de diviser par 5.

## Solution
La boucle `for c in range(-40, 101, 5)` parcourt les températures Celsius, et chaque tour affiche `c` et `c * 9 // 5 + 32`. En C++, on écrit `c * 9 / 5 + 32` avec des `int`.

L'ordre des opérations compte : `c * 9 // 5` calcule d'abord c × 9, qui est un multiple de 45, puis le divise par 5, sans reste. Écrire `c // 5 * 9` donnerait ici le même résultat, mais `9 // 5 * c` donnerait `1 * c`, car 9 // 5 vaut 1. En Python, il ne faut pas utiliser `/`, qui affiche des nombres à virgule comme `-40.0`.

On remarque au passage que −40 °C = −40 °F : c'est la seule température qui s'écrit de la même façon dans les deux échelles.
