---
id: somme-des-goulets-sur-toutes-les-paires
title: Somme des goulets sur toutes les paires
chapter: p4-union-find
order: 6
tags: [graphes, union-find, tri, mathématiques]
samples: 2
---

## Énoncé
Un graphe non orienté et connexe a `N` sommets et `M` arêtes ; chaque arête a un poids. Le **goulet** d'un chemin est le plus grand poids de ses arêtes. Pour deux sommets `u` et `v`, on note `g(u, v)` le plus petit goulet d'un chemin de `u` à `v`.

Afficher la somme des `g(u, v)` sur toutes les paires de sommets `u < v`.

Par exemple, dans le premier exemple, pour aller de `1` à `4`, l'arête directe a un poids 7, le chemin `1 – 3 – 4` a un goulet 6, et le chemin `1 – 2 – 3 – 4` un goulet 5 : `g(1, 4) = 5`.

## Entrée
- La première ligne contient `N` et `M`.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `W` : une arête de poids `W` relie `A` et `B`.

## Sortie
Un seul entier : la somme des `g(u, v)` pour `1 ≤ u < v ≤ N`.

## Contraintes
- 2 ≤ N ≤ 8 000
- N − 1 ≤ M ≤ 8 000
- 1 ≤ A, B ≤ N
- 1 ≤ W ≤ 10⁶
- le graphe est connexe

## Indices
1. Il y a jusqu'à 32 millions de paires : il faut les compter par paquets, pas une par une.
2. Ajouter les arêtes par poids croissant, comme dans Kruskal. Quand `u` et `v` deviennent reliés pour la première fois, que vaut `g(u, v)` ?
3. Quand l'arête de poids `w` fusionne deux composantes de tailles `s` et `t`, elle relie pour la première fois `s × t` paires, et toutes ont un goulet égal à `w`.

## Solution
On ajoute les arêtes par poids croissant dans un Union-Find, comme dans l'algorithme de **Kruskal**. Quand une arête de poids `w` relie deux composantes `A` et `B` différentes, on ajoute `w × |A| × |B|` au total, puis on fusionne.

**Pourquoi c'est juste.** Prenons `a` dans `A` et `b` dans `B` au moment où l'arête `e` de poids `w` les fusionne. *Le goulet vaut au plus `w`* : `A` et `B` sont chacune reliées par des arêtes déjà ajoutées, de poids au plus `w`, donc le chemin de `a` à `b` qui passe par `e` n'utilise que des arêtes de poids au plus `w`. *Le goulet vaut au moins `w`* : toutes les arêtes de poids strictement plus petit que `w` ont déjà été ajoutées, et `a`, `b` ne sont pas encore reliés ; donc tout chemin de `a` à `b` contient une arête de poids au moins `w`. Enfin, chaque paire est comptée exactement une fois : à la fusion qui la relie pour la première fois, et le graphe étant connexe, toutes les paires finissent reliées.

Ces arêtes fusionnantes forment un arbre couvrant de poids minimal, et `g(u, v)` est le plus grand poids sur le chemin de `u` à `v` dans cet arbre : c'est la propriété des **chemins de goulet minimal** vue dans le cours.

**Complexité.** O(M log M) pour le tri, plus les opérations Union-Find. Calculer `g(u, ·)` depuis chaque sommet coûterait `N` parcours du graphe, soit plus de 10⁸ opérations.

**Pièges.** La somme atteint 32 millions de paires × 10⁶ : `long long` en C++, y compris pour le produit `w × |A| × |B|`, qui déborde en `int`. Les boucles et les arêtes parallèles ne gênent pas.
