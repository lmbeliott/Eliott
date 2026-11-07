---
id: meilleur-carre-d-un-champ
title: Meilleur carré d'un champ
chapter: p3-balayages
order: 3
tags: [sommes-préfixes, grilles]
samples: 2
---

## Énoncé
Un champ est découpé en `N` lignes et `M` colonnes de parcelles ; chaque parcelle contient entre 0 et 9 arbres. On veut acheter un carré de `K × K` parcelles qui contient le plus d'arbres possible.

Afficher ce nombre d'arbres, puis la ligne et la colonne de la parcelle en haut à gauche d'un tel carré. S'il y a plusieurs carrés possibles, choisir celui dont la ligne est la plus petite, puis, à ligne égale, celui dont la colonne est la plus petite. Lignes et colonnes sont numérotées à partir de 1.

## Entrée
La première ligne contient `N`, `M` et `K`. Les `N` lignes suivantes contiennent chacune `M` chiffres, sans espace.

## Sortie
Trois entiers sur une ligne : le nombre d'arbres, la ligne et la colonne du coin en haut à gauche.

## Contraintes
- 1 ≤ N, M ≤ 300
- 1 ≤ K ≤ min(N, M)

## Indices
1. Il y a jusqu'à 90 000 positions pour le carré, et chacun peut contenir 22 500 parcelles : additionner case par case est bien trop lent.
2. En deux dimensions, `S[i][j]` = nombre d'arbres dans le rectangle des lignes 1 à `i` et des colonnes 1 à `j`, avec des zéros sur la ligne 0 et la colonne 0.
3. Se calcule par `S[i][j] = S[i−1][j] + S[i][j−1] − S[i−1][j−1] + champ[i][j]`, et un rectangle s'obtient avec quatre valeurs de `S`.

## Solution
On calcule les **sommes préfixes en deux dimensions** : `S[i][j]` est le nombre d'arbres dans le rectangle des lignes 1 à `i` et des colonnes 1 à `j`. Avec `S[0][j] = S[i][0] = 0`, on a `S[i][j] = S[i−1][j] + S[i][j−1] − S[i−1][j−1] + champ[i][j]` : les deux rectangles voisins se chevauchent sur le rectangle `S[i−1][j−1]`, compté deux fois, que l'on retire une fois.

Le carré dont le coin en bas à droite est `(i, j)` couvre les lignes `i − K + 1` à `i` et les colonnes `j − K + 1` à `j`. Par le même raisonnement d'inclusion-exclusion, il contient `S[i][j] − S[i−K][j] − S[i][j−K] + S[i−K][j−K]` arbres. On parcourt les coins `(i, j)` ligne par ligne, puis colonne par colonne, et l'on ne garde un carré que s'il est **strictement** meilleur que le précédent : le premier carré optimal rencontré est celui de plus petite ligne, puis de plus petite colonne. Le coin en haut à gauche est `(i − K + 1, j − K + 1)`.

**Coût.** Environ N × M opérations pour `S`, puis quatre lectures par carré : quelques centaines de milliers d'opérations au total pour N = M = 300. La méthode directe fait jusqu'à (N − K + 1)² × K² additions, soit environ 5 × 10⁸ pour N = M = 300 et K = 150. Les pièges : les indices décalés de 1, et le `+ S[i−K][j−K]` oublié.
