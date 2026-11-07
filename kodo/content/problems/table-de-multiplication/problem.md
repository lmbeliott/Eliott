---
id: table-de-multiplication
title: Table de multiplication
chapter: p1-boucles-imbriquees
order: 1
tags: [boucles]
samples: 2
---

## Énoncé
Afficher la table de multiplication à `N` lignes et `M` colonnes : la case de la ligne `i` et de la colonne `j` (en numérotant à partir de 1) contient `i × j`. Afficher ensuite, sur une dernière ligne, la somme de tous les nombres de la table.

## Entrée
Une seule ligne contenant deux entiers `N` et `M` séparés par une espace.

## Sortie
- `N` lignes : la ligne `i` contient les `M` nombres `i × 1`, `i × 2`, …, `i × M`, séparés par des espaces.
- Une dernière ligne avec un seul entier : la somme de tous les nombres affichés.

## Contraintes
- 1 ≤ N ≤ 30
- 1 ≤ M ≤ 30

## Indices
1. Une boucle sur les lignes `i` de 1 à `N`, et à l'intérieur une boucle sur les colonnes `j` de 1 à `M`.
2. En Python, `print(x, end=" ")` affiche `x` sans aller à la ligne ; un `print()` après la boucle interne termine la ligne.
3. La somme se calcule dans la boucle interne, mais elle est mise à 0 une seule fois, avant les deux boucles.

## Solution
Deux boucles imbriquées : la boucle externe parcourt les lignes `i` de 1 à `N`, la boucle interne les colonnes `j` de 1 à `M`. Dans la boucle interne, on affiche `i × j` suivi d'une espace et on l'ajoute à la somme. Après la boucle interne, on passe à la ligne.

La somme concerne toute la table : elle est initialisée avant la boucle externe, pas au début de chaque ligne. On l'affiche à la toute fin.
