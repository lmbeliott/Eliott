---
id: deux-sommets-marques-les-plus-proches
title: Les deux sommets marqués les plus proches
chapter: p4-plus-courts-chemins
order: 6
tags: [graphes, dijkstra]
samples: 2
---

## Énoncé
Un graphe non orienté a `N` sommets et `M` arêtes ; chaque arête a une longueur. Parmi les sommets, `K` sont **marqués**. Afficher la plus petite distance entre deux sommets marqués différents, ou `-1` si aucune paire de sommets marqués n'est reliée par un chemin.

## Entrée
- La première ligne contient `N`, `M` et `K`.
- La deuxième ligne contient les `K` sommets marqués, tous différents.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `L` : une arête de longueur `L` relie `A` et `B`.

## Sortie
Un seul entier : la plus petite distance entre deux sommets marqués différents, ou `-1`.

## Contraintes
- 2 ≤ K ≤ N ≤ 5 000
- 0 ≤ M ≤ 6 000
- 1 ≤ A, B ≤ N
- 1 ≤ L ≤ 10⁹

## Indices
1. Un Dijkstra depuis chaque sommet marqué coûte `K` fois trop cher quand presque tous les sommets sont marqués.
2. Un seul Dijkstra peut partir de tous les sommets marqués à la fois. Il donne, pour chaque sommet `v`, la distance `d(v)` au sommet marqué le plus proche et ce sommet, son **origine**.
3. Sur un plus court chemin entre deux sommets marqués, l'origine change au moins une fois, sur une arête `u – v`. Examiner `d(u) + L + d(v)` pour chaque arête dont les deux extrémités ont des origines différentes.

## Solution
On lance **un seul** Dijkstra, en mettant dans le tas tous les sommets marqués avec la distance 0 : c'est comme ajouter une source fictive reliée à chacun par une arête de longueur 0. On obtient `d(v)`, la distance de `v` au sommet marqué le plus proche, et `origine(v)`, un sommet marqué à cette distance (celui dont on vient lors de la dernière amélioration). Ensuite, pour chaque arête `u – v` de longueur `L` telle que `origine(u) ≠ origine(v)`, on propose `d(u) + L + d(v)` ; la réponse est le minimum de ces propositions.

**Pourquoi c'est juste.** *Chaque proposition est une vraie distance, ou plus.* En allant de `origine(u)` à `u`, puis à `v`, puis à `origine(v)`, on obtient un chemin de longueur `d(u) + L + d(v)` entre deux sommets marqués différents : la proposition est au moins la réponse. *La réponse est proposée.* Soient `s` et `t` deux sommets marqués à distance minimale, et `P` un plus court chemin de `s` à `t`. Comme les longueurs sont positives, `origine(s) = s` et `origine(t) = t`. L'origine change donc au moins une fois le long de `P`, sur une arête `u – v`. Or `d(u)` est au plus la longueur de `P` de `s` à `u`, et `d(v)` au plus celle de `v` à `t` : la proposition de cette arête est au plus la longueur de `P`.

**Complexité.** Un Dijkstra et un passage sur les arêtes : O((N + M) log M). Un Dijkstra par sommet marqué coûterait `K` fois plus : jusqu'à 5 000 fois.

**Pièges.** Comparer seulement `d(u) + d(v)` entre sommets marqués voisins ne suffit pas : le meilleur chemin peut passer par des sommets non marqués, par exemple un détour de longueur 40 entre deux sommets marqués reliés directement par une arête de longueur 100. Une boucle `u – u` a deux extrémités de même origine : elle ne propose rien. La réponse dépasse 2³¹ : `long long` en C++.
