---
id: frise-de-vagues-numerotees
title: Frise de vagues numérotées
chapter: p1-repetitions
order: 8
synthesis: true
tags: [boucles]
samples: 1
no_input: true
---

## Énoncé
Une frise verticale est dessinée avec des lignes de `#`. Les longueurs des lignes successives suivent le motif 1, 2, 3, 2, 1, 2, 3, 2, 1, … : elles montent de 1 à 3, redescendent à 1, remontent, et ainsi de suite. La frise commence et se termine par une ligne d'un seul `#`, et contient exactement 12 **crêtes**, c'est-à-dire 12 lignes de trois `#`.

Chaque crête est suivie, sur la même ligne, d'une espace puis de son numéro : `1` pour la première crête en partant du haut, `2` pour la deuxième, et ainsi de suite jusqu'à `12`.

Afficher la frise.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
La frise, une ligne de `#` par ligne affichée. Les lignes de crête ont la forme `### k`. La frise commence par la ligne `#`, puis `##`, puis `### 1`, puis `##`, puis `#`, puis `##`, puis `### 2`, etc.

## Indices
1. Repérer le motif qui se répète exactement : une crête et ce qui l'entoure. Attention, les lignes d'un seul `#` sont partagées entre deux vagues voisines.
2. Le bloc `#`, `##`, `### k`, `##` se répète 12 fois. Que manque-t-il à la fin ?
3. La variable de boucle peut servir directement de numéro de crête.

## Solution
On découpe la frise en blocs de 4 lignes : `#`, `##`, `### k`, `##`. En mettant 12 blocs à la suite, on obtient toutes les lignes de la frise sauf la toute dernière : la ligne `#` finale, qui doit être affichée une fois, après la boucle. La frise compte donc 4 × 12 + 1 = 49 lignes.

Le numéro de crête est la variable de boucle elle-même, à condition de la faire aller de 1 à 12 : `for k in range(1, 13)`, et la ligne de crête s'affiche avec `print("###", k)`.

Les pièges classiques sont ceux des **piquets et des intervalles** : pour 12 vagues, il y a 13 lignes d'un seul `#` (une de plus que de crêtes). Un bloc qui contiendrait les deux lignes `#` (`#`, `##`, `###`, `##`, `#`) produirait deux `#` consécutifs entre deux vagues ; un bloc sans ligne finale oublie le dernier `#`. Il faut aussi numéroter de 1 à 12, et non de 0 à 11 comme avec `range(12)`.
