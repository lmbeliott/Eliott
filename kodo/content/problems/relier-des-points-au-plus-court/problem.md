---
id: relier-des-points-au-plus-court
title: Relier des points au plus court
chapter: p4-union-find
order: 8
synthesis: true
tags: [graphes, union-find, tri, mathématiques]
samples: 2
---

## Énoncé
On donne `N` points du plan, à coordonnées entières. Relier directement deux points `(x₁, y₁)` et `(x₂, y₂)` coûte `min(|x₁ − x₂|, |y₁ − y₂|)` : la plus petite des deux distances, horizontale ou verticale.

Afficher le coût total minimal d'un ensemble de liaisons qui permet d'aller de n'importe quel point à n'importe quel autre, en passant éventuellement par d'autres points.

## Entrée
- La première ligne contient `N`.
- Chacune des `N` lignes suivantes contient deux entiers `x` et `y` : les coordonnées d'un point. Plusieurs points peuvent être confondus.

## Sortie
Un seul entier : le coût minimal.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ x, y ≤ 10⁹

## Indices
1. C'est un arbre couvrant de poids minimal du graphe complet, mais ce graphe a 50 millions d'arêtes.
2. Une liaison de coût `min(dx, dy)` se comporte comme deux liaisons parallèles, l'une de coût `dx`, l'autre de coût `dy` : l'arbre minimal n'en garde au plus qu'une, la moins chère.
3. Parmi les liaisons de coût `dx`, seules celles entre deux points consécutifs dans l'ordre des `x` peuvent servir : si `xᵢ ≤ xⱼ ≤ x_k`, la liaison de `i` à `k` est la plus chère du triangle `i, j, k`.

## Solution
**Deux liaisons au lieu d'une.** On remplace chaque liaison `i – j` par deux liaisons parallèles, de coûts `|xᵢ − xⱼ|` (« horizontale ») et `|yᵢ − yⱼ|` (« verticale »). Un arbre couvrant minimal de ce nouveau graphe n'utilise jamais les deux liaisons parallèles, et quand il en utilise une, c'est la moins chère (sinon on l'échangerait) ; il a donc le même poids qu'un arbre minimal du graphe de départ.

**Peu de liaisons utiles.** Trions les points par `x`. Si `j` est entre `i` et `k` dans cet ordre, la liaison horizontale `i – k` coûte `(xⱼ − xᵢ) + (x_k − xⱼ)`, au moins autant que chacune des liaisons horizontales `i – j` et `j – k`. Elle est la plus lourde du cycle `i, j, k` : par la **propriété du cycle** (une arête plus lourde que toutes les autres arêtes d'un cycle, ou à égalité avec la plus lourde, peut être retirée sans changer le poids minimal), on peut l'enlever. En retirant d'abord les liaisons qui enjambent le plus de points (les deux liaisons du cycle sont alors encore là), il ne reste que les `N − 1` liaisons horizontales entre points consécutifs dans l'ordre des `x`. De même pour les `y`. Il reste `2(N − 1)` liaisons, sur lesquelles on applique **Kruskal**.

**Complexité.** Deux tris et Kruskal sur `2N` arêtes : O(N log N). Kruskal sur le graphe complet trierait 50 millions d'arêtes ; Prim sur le graphe complet ferait 10⁸ calculs de distance, beaucoup trop pour Python.

**Pièges.** Des points confondus ou alignés donnent des liaisons de coût `0`, sans problème. Pour `N = 1`, la réponse est `0`. Le total ne dépasse jamais 10⁹ (la chaîne des voisins dans l'ordre des `x` coûte au plus `max(x) − min(x)`), mais les écarts se calculent sans erreur en `long long`.
