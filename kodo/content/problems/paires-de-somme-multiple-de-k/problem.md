---
id: paires-de-somme-multiple-de-k
title: Paires de somme multiple de K
chapter: p1-boucles-imbriquees
order: 4
tags: [boucles, arithmétique]
samples: 2
---

## Énoncé
Compter les paires d'entiers `(i, j)` telles que `1 ≤ i < j ≤ N` et que `i + j` soit un multiple de `K`.

Par exemple, pour `N = 6` et `K = 4`, les paires qui conviennent sont `(1, 3)`, `(2, 6)` et `(3, 5)` : la réponse est 3.

## Entrée
Une seule ligne contenant deux entiers `N` et `K` séparés par une espace.

## Sortie
Un seul entier : le nombre de paires.

## Contraintes
- 1 ≤ N ≤ 1 000
- 1 ≤ K ≤ 2 000

## Indices
1. Parcourir toutes les paires avec deux boucles imbriquées. Pour avoir `i < j`, la boucle sur `j` commence à `i + 1`.
2. `i + j` est un multiple de `K` quand `(i + j) % K == 0`.
3. Il y a au plus 1 000 × 999 / 2, soit environ 500 000 paires : les essayer toutes est assez rapide.

## Solution
On fait une **recherche exhaustive** : on essaie toutes les paires et on compte celles qui conviennent. La boucle externe fixe `i` de 1 à `N`, la boucle interne fait varier `j` de `i + 1` à `N`, ce qui donne chaque paire exactement une fois, avec `i < j`. Pour chaque paire, si `(i + j) % K == 0`, on augmente le compteur.

Les pièges : faire partir `j` de 1 (on compte alors `(3, 1)` en plus de `(1, 3)`, et des paires comme `(2, 2)`), ou faire partir `j` de `i` (on compte `(2, 2)`).

Le nombre de tours est `N × (N - 1) / 2`, environ 500 000 au maximum : c'est rapide, même en Python. On peut trouver une formule plus directe, mais elle n'est pas nécessaire ici.
