---
id: relier-des-nombres-ayant-un-facteur-commun
title: Relier des nombres ayant un facteur commun
chapter: p4-synthese
order: 8
tags: [union-find, arithmétique, graphes, mathématiques]
samples: 2
---

## Énoncé
On a `N` objets ; l'objet `i` porte l'entier `A_i`. On peut construire une liaison entre deux objets `i` et `j` seulement si `A_i` et `A_j` ont un facteur premier commun, et elle coûte alors `A_i + A_j`.

Afficher le coût total minimal d'un ensemble de liaisons qui relie tous les objets entre eux (directement ou par d'autres objets), ou `-1` si c'est impossible.

Par exemple, avec `6 10 15 35 4`, on relie `4 – 6` (10), `4 – 10` (14), `6 – 15` (21) et `10 – 35` (45) : le coût total est 90.

## Entrée
- La première ligne contient `N`.
- La deuxième ligne contient `A₁ … A_N`.

## Sortie
Un seul entier : le coût minimal, ou `-1`.

## Contraintes
- 1 ≤ N ≤ 25 000
- 2 ≤ A_i ≤ 100 000

## Indices
1. C'est un arbre couvrant de poids minimal, mais le graphe peut avoir 300 millions d'arêtes (si tous les nombres sont pairs).
2. Fixons un nombre premier `p` et les objets dont le nombre est multiple de `p`. Ils sont tous reliables entre eux. Parmi ces liaisons, lesquelles peuvent servir dans un arbre minimal ?
3. Si `m` est l'objet de plus petit nombre parmi les multiples de `p`, la liaison `x – y` coûte au moins autant que `m – x` et que `m – y` : par la propriété de cycle, on peut l'oublier. Il reste au plus 6 liaisons par objet, puis Kruskal.

## Solution
**Grouper par facteur premier.** Deux objets sont reliables s'ils ont un facteur premier commun `p`. Pour chaque premier `p`, les objets multiples de `p` forment une **clique** (tous reliables deux à deux). On factorise chaque `A_i` avec un crible du plus petit facteur premier ; un nombre au plus 100 000 a au plus 6 facteurs premiers distincts.

**Une étoile suffit dans chaque clique.** Soit `m` l'objet de plus petit nombre parmi les multiples de `p`. Pour deux autres multiples `x` et `y`, le cycle `x – m – y – x` contient `m – x` (coût `A_m + A_x ≤ A_y + A_x`) et `m – y` (coût `A_m + A_y ≤ A_x + A_y`) : la liaison `x – y` est la plus chère de ce cycle (à égalité éventuellement). Par la **propriété de cycle**, on peut la retirer sans augmenter le poids minimal ; comme les liaisons `m – x` sont gardées, on peut retirer toutes les liaisons `x – y` à la fois. Il reste, pour chaque `p`, une **étoile** centrée en `m` : au plus 6 liaisons par objet au total. Une liaison possible pour plusieurs premiers apparaît plusieurs fois : ce n'est pas gênant.

**Kruskal.** On trie ces liaisons par coût et l'on applique Kruskal avec un Union-Find. Si l'on n'a pas gardé `N − 1` liaisons, le graphe n'est pas connexe : `-1`.

**Complexité.** Crible en O(V log log V) avec `V = 100 000`, puis O(6N log N) pour le tri et Kruskal. Tester toutes les paires coûterait `N² / 2 ≈ 3 × 10⁸` calculs de PGCD.

**Pièges.** Le coût total dépasse 2³¹ (25 000 liaisons à près de 200 000) : `long long` en C++. Des nombres égaux sont reliables entre eux (ils partagent tous leurs facteurs). Pour `N = 1`, la réponse est `0`.
