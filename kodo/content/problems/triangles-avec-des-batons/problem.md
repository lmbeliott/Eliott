---
id: triangles-avec-des-batons
title: Triangles avec des bâtons
chapter: p3-balayages
order: 7
tags: [deux-pointeurs, tri, mathématiques]
samples: 2
---

## Énoncé
On dispose de `N` bâtons de longueurs `L₁, …, L_N`. Compter les façons de choisir trois bâtons (trois positions différentes) avec lesquels on peut former un vrai triangle, c'est-à-dire un triangle non aplati.

Trois longueurs `a ≤ b ≤ c` forment un vrai triangle si et seulement si `a + b > c`.

## Entrée
La première ligne contient `N`. La deuxième ligne contient `L₁, …, L_N`, séparés par des espaces.

## Sortie
Un seul entier : le nombre de choix de trois bâtons qui forment un vrai triangle.

## Contraintes
- 1 ≤ N ≤ 2 000
- 1 ≤ Lᵢ ≤ 10⁶

## Indices
1. Essayer tous les triplets coûte N³ / 6, plus de 10⁹ essais : trop.
2. Trier les longueurs. Fixer le plus grand côté `c = L[k]`, puis compter les paires `i < j < k` telles que `L[i] + L[j] > c`.
3. Deux indices : `g = 0` et `d = k − 1`. Si `L[g] + L[d] > c`, alors chaque `i` entre `g` et `d − 1` convient avec `d`. Sinon, `g` ne convient avec aucun `j ≤ d`.

## Solution
On trie : `L[0] ≤ L[1] ≤ … ≤ L[N − 1]`. Un choix de trois bâtons s'écrit d'une seule façon `i < j < k` dans l'ordre trié, et il forme un vrai triangle si et seulement si `L[i] + L[j] > L[k]` : on compte ces triplets.

Pour chaque `k`, on compte les paires `i < j < k` avec deux indices `g = 0` et `d = k − 1`. Tant que `g < d` :

- si `L[g] + L[d] > L[k]`, alors pour tout `i` de `g` à `d − 1`, `L[i] + L[d] ≥ L[g] + L[d] > L[k]` : les `d − g` paires `(i, d)` conviennent. On les ajoute, et on recule `d`, dont toutes les paires restantes ont été comptées ;
- sinon, pour tout `j` de `g + 1` à `d`, `L[g] + L[j] ≤ L[g] + L[d] ≤ L[k]` : le bâton `g` ne forme de paire valide avec aucun `j` restant. On avance `g`.

Chaque étape écarte un indice dont les paires restantes ont été entièrement traitées : chaque paire valide est comptée exactement une fois.

**Coût.** Pour chaque `k`, `d − g` diminue de 1 à chaque étape : au plus `k` étapes. En tout, environ N² / 2 = 2 millions d'étapes, contre plus d'un milliard de triplets. Le résultat peut atteindre `N × (N − 1) × (N − 2) / 6`, environ 1,3 × 10⁹, proche de la limite d'un `int` : un `long long` est prudent en C++. Le piège : oublier le tri, ou écrire `≥` au lieu de `>` (un triangle aplati ne compte pas).
