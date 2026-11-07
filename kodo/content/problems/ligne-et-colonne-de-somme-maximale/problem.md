---
id: ligne-et-colonne-de-somme-maximale
title: Ligne et colonne de somme maximale
chapter: p2-grilles
order: 1
tags: [grilles, listes]
samples: 2
---

## Énoncé
Une grille de `N` lignes et `M` colonnes contient des entiers. Trouver la ligne dont la somme des valeurs est la plus grande, et la colonne dont la somme des valeurs est la plus grande.

Les lignes sont numérotées de 1 à `N` de haut en bas, les colonnes de 1 à `M` de gauche à droite. En cas d'égalité, choisir le plus petit numéro.

## Entrée
- La première ligne contient deux entiers `N` et `M`.
- Chacune des `N` lignes suivantes contient `M` entiers, séparés par des espaces.

## Sortie
- Sur la première ligne, le numéro de la ligne de plus grande somme.
- Sur la deuxième ligne, le numéro de la colonne de plus grande somme.

## Contraintes
- 1 ≤ N ≤ 100 et 1 ≤ M ≤ 100
- Les valeurs sont comprises entre -1 000 et 1 000.

## Indices
1. Lire la grille ligne par ligne dans une liste de listes.
2. Pour la somme de la colonne `j`, fixer `j` et faire varier `i` de 0 à `N - 1`.
3. Pour respecter la règle d'égalité, ne remplacer le meilleur que si la nouvelle somme est **strictement** plus grande. Attention : les sommes peuvent être négatives.

## Solution
On lit la grille, puis on calcule chaque somme de ligne avec une boucle sur `j`, et chaque somme de colonne avec une boucle externe sur `j` et une boucle interne sur `i`.

Pour garder la meilleure, on retient la première somme calculée (tant que le meilleur indice vaut encore -1), puis on ne la remplace que si une somme est strictement plus grande : en cas d'égalité, le plus petit numéro est conservé. Initialiser la meilleure somme à 0 serait faux, car toutes les sommes peuvent être négatives.

On n'oublie pas d'afficher les numéros à partir de 1 : l'indice `i` du programme correspond à la ligne `i + 1`. Enfin, la grille n'est pas forcément carrée : la boucle des colonnes va jusqu'à `M`, celle des lignes jusqu'à `N`.
