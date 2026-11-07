---
id: annees-bissextiles-de-1850-a-2050
title: Années bissextiles de 1850 à 2050
chapter: p1-repetitions
order: 7
tags: [boucles, mathématiques]
samples: 1
no_input: true
---

## Énoncé
Une année est **bissextile** si elle est divisible par 4, sauf les années divisibles par 100, qui ne sont bissextiles que si elles sont aussi divisibles par 400. Ainsi 2024 est bissextile, 1700 ne l'est pas, 1600 l'est.

Afficher, dans l'ordre croissant, toutes les années bissextiles de `1850` à `2050` inclus.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
Les années demandées, une par ligne, dans l'ordre croissant.

## Indices
1. Si la règle se limitait à « divisible par 4 », une seule boucle de pas 4 suffirait. Quelle est la première année divisible par 4 à partir de 1850 ?
2. Entre 1850 et 2050, quelles années sont divisibles par 100 ? Sont-elles bissextiles ?
3. Une année manque dans la suite de pas 4 : il faut couper la boucle en deux boucles à la suite.

## Solution
La première année divisible par 4 à partir de 1850 est 1852, la dernière avant 2050 est 2048. Entre les deux, les années divisibles par 100 sont 1900 et 2000. L'année 2000 est divisible par 400 : elle est bissextile, et la règle habituelle s'applique. L'année 1900 n'est pas divisible par 400 : elle n'est **pas** bissextile, bien qu'elle soit divisible par 4.

La suite cherchée est donc celle des années de 4 en 4 de 1852 à 2048, privée de 1900. On l'affiche avec deux boucles à la suite : la première de 1852 à 1896 (`range(1852, 1900, 4)`), la seconde de 1904 à 2048 (`range(1904, 2049, 4)`). Il y a 12 + 37 = 49 années.

Les deux pièges sont d'oublier l'exception de 1900, et à l'inverse d'exclure 2000 en appliquant l'exception sans regarder la divisibilité par 400.
