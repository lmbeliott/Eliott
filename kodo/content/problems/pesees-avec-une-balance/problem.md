---
id: pesees-avec-une-balance
title: Pesées avec une balance
chapter: p3-recursivite
order: 4
tags: [récursivité, mathématiques]
samples: 2
---

## Énoncé
Une balance a deux plateaux. On pose un objet de masse inconnue sur le plateau de gauche, et on dispose de N poids. Chaque poids peut être posé sur le plateau de gauche (avec l'objet), sur celui de droite, ou rester de côté. La balance est en équilibre quand les deux plateaux portent la même masse.

Une masse entière m ≥ 1 est **mesurable** s'il existe une façon de placer les poids qui équilibre la balance avec un objet de masse m. Par exemple, avec les poids 1, 3 et 9, la masse 5 est mesurable : 5 + 1 + 3 = 9.

Compter les masses mesurables, et trouver la plus petite masse entière m ≥ 1 qui ne l'est pas.

## Entrée
La première ligne contient N. La deuxième ligne contient les masses des N poids.

## Sortie
Deux entiers sur une ligne : le nombre de masses mesurables, et la plus petite masse non mesurable.

## Contraintes
- 1 ≤ N ≤ 10
- 1 ≤ masse d'un poids ≤ 10⁶

## Indices
1. Chaque poids a trois places possibles : il y a 3^N façons de placer les poids, au plus 59 049. On peut toutes les essayer.
2. Une fonction récursive `explorer(i, d)` traite les poids à partir du numéro `i`, sachant que les poids déjà placés donnent une différence `d` entre le plateau de droite et celui de gauche. Elle s'appelle trois fois, une par place possible du poids `i`.
3. Ranger les différences positives obtenues dans un ensemble : deux placements différents peuvent donner la même masse.

## Solution
Si les poids de droite pèsent R et ceux de gauche L, la balance est en équilibre avec un objet de masse m quand `m + L = R`, c'est-à-dire `m = R − L`. Les masses mesurables sont donc les valeurs strictement positives de `R − L`.

On les énumère avec une fonction récursive `explorer(i, d)`, où `d` est la valeur de `R − L` pour les poids 0 à i − 1 déjà placés. Si `i = N`, tous les poids sont placés : on ajoute `d` à un ensemble s'il est positif. Sinon, on appelle `explorer(i + 1, d)` (poids de côté), `explorer(i + 1, d + p[i])` (à droite) et `explorer(i + 1, d − p[i])` (à gauche). L'appel `explorer(0, 0)` parcourt les 3^N placements : par récurrence sur N − i, l'appel `explorer(i, d)` atteint exactement une fois chacune des 3^(N−i) façons de placer les poids restants.

La réponse est la taille de l'ensemble, puis le plus petit entier `m ≥ 1` qui n'y figure pas, trouvé en essayant 1, 2, 3…

**Coût.** L'arbre des appels a 3^N feuilles et moins de 3^N / 2 nœuds internes : environ 90 000 appels pour N = 10. La profondeur ne dépasse pas N + 1.

Avec les poids 1, 3, 9, 27…, toutes les masses de 1 à (3^N − 1) / 2 sont mesurables, et chacune d'une seule façon : c'est l'écriture des nombres en **base 3 équilibrée**, avec les chiffres −1, 0 et 1.
