---
id: trajets-de-longueur-k
title: Trajets de longueur K
chapter: p2-grilles
order: 6
tags: [grilles, mathématiques]
samples: 2
---

## Énoncé
`N` lieux sont numérotés de 1 à `N`. Une grille `A` de `N × N` chiffres décrit les routes à sens unique : `A[i][j]` vaut `1` s'il existe une route du lieu `i` vers le lieu `j`, et `0` sinon. Une route peut aller d'un lieu vers lui-même.

Un **trajet de longueur `K`** est une suite de `K` routes empruntées l'une après l'autre ; il peut repasser plusieurs fois par le même lieu ou la même route. Pour chaque couple de lieux `(i, j)`, compter les trajets de longueur exactement `K` qui partent de `i` et arrivent en `j`.

## Entrée
- La première ligne contient deux entiers `N` et `K`.
- Chacune des `N` lignes suivantes contient `N` entiers `0` ou `1`, séparés par des espaces : la grille `A`.

## Sortie
`N` lignes de `N` entiers séparés par des espaces : sur la ligne `i`, en colonne `j`, le nombre de trajets de longueur `K` du lieu `i` au lieu `j`.

## Contraintes
- 1 ≤ N ≤ 10
- 1 ≤ K ≤ 15

## Indices
1. Pour `K = 1`, la réponse est la grille `A` elle-même.
2. Un trajet de longueur `k + 1` de `i` à `j` est un trajet de longueur `k` de `i` vers un lieu `p`, suivi d'une route de `p` vers `j`. Si `C[i][p]` compte les trajets de longueur `k`, alors le nombre de trajets de longueur `k + 1` est la somme, sur tous les `p`, de `C[i][p] × A[p][j]`.
3. Écrire une fonction `produit(X, Y)` qui renvoie une **nouvelle** grille `Z` avec `Z[i][j] = X[i][0] × Y[0][j] + X[i][1] × Y[1][j] + …`. Les nombres peuvent atteindre 10¹⁴ : en C++, utiliser `long long`.

## Solution
Notons `C` la grille des nombres de trajets de longueur `k`. Au départ (`k = 1`), `C = A`. Pour allonger les trajets d'une route, on regarde le dernier lieu `p` avant l'arrivée : un trajet de longueur `k + 1` de `i` à `j` est un trajet de longueur `k` de `i` à `p` suivi de la route `p → j`, qui existe si `A[p][j] = 1`. Donc le nouveau nombre vaut `C[i][0] × A[0][j] + C[i][1] × A[1][j] + … + C[i][N-1] × A[N-1][j]`.

Ce calcul est le **produit de matrices** `C × A`, une opération centrale en mathématiques. On écrit une fonction `produit(X, Y)` qui crée une grille de zéros et la remplit avec trois boucles imbriquées (sur `i`, `j` et `p`). On l'applique `K - 1` fois : `C = produit(C, A)`. La réponse est la puissance `K`-ième de la matrice `A`.

La nouvelle grille doit être distincte de `C` : si on écrivait les résultats directement dans `C` pendant le calcul, les cases déjà mises à jour seraient réutilisées pour calculer les suivantes. La fonction crée donc sa propre grille (une nouvelle ligne par tour, pas `[[0] * N] * N`) et la renvoie.

Taille des nombres : quand toutes les routes existent, il y a `N` choix pour chaque lieu intermédiaire, soit `N^(K-1)` trajets de `i` à `j`, jusqu'à 10¹⁴. Il faut des `long long` en C++. Le calcul fait `K × N³`, soit au plus 15 000 opérations.
