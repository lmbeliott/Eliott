---
id: triplets-strictement-croissants
title: Triplets strictement croissants
chapter: n4-structures
order: 6
tags: [fenwick, tri]
samples: 2
---

## Énoncé
On donne une suite de `N` entiers `A[1], A[2], …, A[N]`.

Écris un programme qui compte les triplets d'indices `(i, j, k)` tels que `i < j < k` et `A[i] < A[j] < A[k]`.

## Entrée
- La première ligne contient un entier `N`.
- La deuxième ligne contient `N` entiers `A[1] … A[N]`.

## Sortie
Un seul entier : le nombre de triplets.

## Contraintes
- 1 ≤ N ≤ 20 000
- 1 ≤ A[i] ≤ 10⁶

## Indices
1. Trois boucles imbriquées, ou même deux, font beaucoup trop d'opérations pour `N = 20 000`.
2. Fixe l'élément du milieu `j`. Le nombre de triplets dont il est le milieu est (nombre de `i < j` avec `A[i] < A[j]`) × (nombre de `k > j` avec `A[k] > A[j]`).
3. Les deux nombres se calculent avec un arbre de Fenwick indexé par les valeurs, comme pour les inversions : un parcours de gauche à droite, puis un de droite à gauche.

## Solution
On fixe l'élément du **milieu** `j`. Le choix de `i` à sa gauche et celui de `k` à sa droite sont indépendants : si `G[j]` est le nombre de `i < j` avec `A[i] < A[j]`, et `D[j]` le nombre de `k > j` avec `A[k] > A[j]`, alors `j` est le milieu de `G[j] × D[j]` triplets. La réponse est la somme de ces produits.

On calcule `G` avec un **arbre de Fenwick** indexé par les valeurs. On parcourt la suite de gauche à droite : avant d'insérer `A[j]`, la somme des compteurs des valeurs `1 … A[j] - 1` donne `G[j]`. Puis on parcourt de droite à gauche avec un nouvel arbre : parmi les `N - 1 - j` éléments déjà vus (indices de 0 à N - 1), ceux qui sont **strictement** plus grands sont `N - 1 - j` moins ceux de valeur au plus `A[j]`.

On peut remplacer chaque valeur par son rang parmi les valeurs distinctes (compression) : l'arbre a alors au plus `N` cases, et il reste petit même si les valeurs étaient très grandes.

Complexité : **O(N log N)**.

Pourquoi les méthodes naïves échouent : énumérer les triplets coûte O(N³). Compter `G[j]` et `D[j]` par deux boucles coûte O(N²), soit 4 × 10⁸ comparaisons pour `N = 20 000` : bien trop lent en Python.

Pièges :
- Les inégalités sont **strictes** : avec des valeurs égales, `G[j]` compte les valeurs jusqu'à `A[j] - 1`, et `D[j]` exclut les valeurs égales à `A[j]` (deuxième exemple).
- La réponse peut dépasser 2³¹ (jusqu'à environ 1,3 × 10¹²) : utilise des `long long` en C++, y compris pour le produit.
