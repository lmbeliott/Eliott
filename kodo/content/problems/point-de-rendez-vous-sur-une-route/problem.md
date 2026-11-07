---
id: point-de-rendez-vous-sur-une-route
title: Point de rendez-vous sur une route
chapter: p3-tris-simples
order: 5
tags: [tri, mathématiques]
samples: 2
---

## Énoncé
`N` maisons sont placées le long d'une route droite, la maison `i` au kilomètre `Xᵢ`. Plusieurs maisons peuvent être au même kilomètre. On choisit un point de rendez-vous à un kilomètre entier `P`, et chaque habitant parcourt la distance `|Xᵢ − P|`.

Trouver le point `P` qui rend la **distance totale** parcourue la plus petite possible. S'il y en a plusieurs, choisir le plus petit.

## Entrée
La première ligne contient `N`. La deuxième ligne contient `X₁, …, X_N`, séparés par des espaces.

## Sortie
Deux entiers sur une ligne : le point `P` choisi, puis la distance totale correspondante.

## Contraintes
- 1 ≤ N ≤ 20 000
- 0 ≤ Xᵢ ≤ 10⁶

## Indices
1. Essayer chaque maison comme point de rendez-vous, et calculer la distance totale à chaque fois, coûte N² opérations : 400 millions.
2. Partir d'un point `P` et avancer d'un kilomètre vers la droite. La distance totale augmente de 1 pour chaque maison à gauche de `P` ou sur `P`, et diminue de 1 pour chaque maison à droite. Quand vaut-il la peine d'avancer ?
3. Trier les positions. La réponse est liée à la maison du milieu.

## Solution
On trie les positions : `Y₀ ≤ Y₁ ≤ … ≤ Y_{N−1}`. La réponse est `P = Y_m` avec `m = (N − 1) // 2`, la **médiane** (la plus petite des deux du milieu si `N` est pair). On calcule ensuite la somme des `|Yᵢ − P|`.

**Pourquoi.** Notons `D(P)` la distance totale, `G` le nombre de maisons au kilomètre `P` ou avant, et `R = N − G` le nombre de maisons après. En passant de `P` à `P + 1`, chacune des `G` maisons s'éloigne de 1 et chacune des `R` maisons se rapproche de 1 : `D(P + 1) − D(P) = G − R`.

- Si `P < Y_m`, au plus `m` maisons sont en `P` ou avant, donc `G ≤ (N − 1) / 2 < N / 2` et `G < R` : la distance **diminue strictement** en avançant.
- Si `P ≥ Y_m`, au moins `m + 1` maisons sont en `P` ou avant, donc `G ≥ N / 2` et `G ≥ R` : la distance **ne diminue plus**.

La distance décroît strictement jusqu'à `Y_m`, puis ne décroît plus : `Y_m` est le plus petit point optimal.

**Coût.** Le tri, puis un passage pour la somme. Les positions ne dépassent pas 10⁶ : un tri par comptage marche aussi. La distance totale peut atteindre 2 × 10¹⁰ : en C++, il faut un `long long`.
