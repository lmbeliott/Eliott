---
id: rangees-en-zigzag
title: Rangées en zigzag
chapter: n1-affichage
order: 8
tags: [entrées-sorties, arithmétique]
samples: 3
---

## Énoncé
Dans une salle, chaque rangée contient `M` places, numérotées de 1 à `M` de gauche à droite. Les rangées sont numérotées à partir de 1. Les personnes entrent une par une et s'assoient dans l'ordre d'arrivée, en zigzag :
- la rangée 1 se remplit de gauche à droite : places 1, 2, …, `M` ;
- la rangée 2 se remplit de droite à gauche : places `M`, `M - 1`, …, 1 ;
- la rangée 3 se remplit de nouveau de gauche à droite, la rangée 4 de droite à gauche, et ainsi de suite.

Écris un programme qui affiche le numéro de la rangée et le numéro de la place de la `K`-ième personne entrée.

Ce problème se résout sans `if` et sans boucle : uniquement avec des calculs.

## Entrée
Une seule ligne contenant deux entiers `M` et `K` séparés par une espace : le nombre de places par rangée, puis le numéro d'arrivée de la personne.

## Sortie
Une seule ligne contenant deux entiers séparés par une espace : le numéro de la rangée, puis le numéro de la place.

## Contraintes
- 1 ≤ M ≤ 1 000 000
- 1 ≤ K ≤ 1 000 000 000

## Indices
1. Commence comme dans « Rangée et place » : en comptant à partir de 0, la `K`-ième personne a le numéro `K - 1`, elle est dans la rangée `R = (K - 1) // M`, et c'est la `P`-ième à s'asseoir dans cette rangée, avec `P = (K - 1) % M`. `R` et `P` sont comptés à partir de 0.
2. Si `R` est pair, la rangée se remplit de gauche à droite et la place est `P + 1`. Si `R` est impair, elle se remplit de droite à gauche et la place est `M - P`. Vérifie avec `M = 4` et `K = 6`.
3. Pour choisir sans `if`, utilise `E = R % 2`, qui vaut 0 ou 1. Que vaut `(1 - E) × (P + 1) + E × (M - P)` quand `E = 0` ? Et quand `E = 1` ?

## Solution
On compte d'abord tout à partir de 0, comme pour des rangées qui se remplissent toutes dans le même sens : la `K`-ième personne a le numéro `K - 1`, elle est dans la rangée `R = (K - 1) // M`, et elle est la `P`-ième à s'asseoir dans cette rangée, avec `P = (K - 1) % M`. Le numéro de rangée affiché est `R + 1`.

Reste la place. Si `R` est pair (rangées 1, 3, 5… en comptant à partir de 1), on va de gauche à droite : la place est `P + 1`. Si `R` est impair, on va de droite à gauche : la première à s'asseoir prend la place `M`, la suivante la place `M - 1`, et la `P`-ième la place `M - P`.

Pour choisir entre ces deux valeurs sans `if`, on se sert de `E = R % 2`, qui vaut 0 quand `R` est pair et 1 quand il est impair :

`place = (1 - E) × (P + 1) + E × (M - P)`

Quand `E = 0`, le second produit est nul et il reste `P + 1`. Quand `E = 1`, c'est le premier qui est nul, et il reste `M - P`. Multiplier par un nombre qui vaut 0 ou 1 permet d'« allumer » ou d'« éteindre » un terme.

Exemple : `M = 4` et `K = 6`. On calcule `R = 5 // 4 = 1` et `P = 5 % 4 = 1`. La rangée est la numéro 2 ; `E = 1`, donc la place est `4 - 1 = 3`. En effet, dans la rangée 2, la personne 5 prend la place 4 et la personne 6 la place 3.

Le piège : oublier que les numéros commencent à 1. Avec `(K - 1)` au lieu de `K`, la dernière personne d'une rangée reste bien dans sa rangée. Avec `M = 1 000 000` et `K = 1 000 000 000`, tous les nombres calculés restent sous le milliard : ils tiennent dans un `int` en C++.
