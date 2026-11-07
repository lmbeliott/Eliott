---
id: completer-un-reseau
title: Compléter un réseau
chapter: p4-union-find
order: 2
tags: [graphes, union-find, glouton, tri]
samples: 2
---

## Énoncé
Un réseau a `N` sommets. `K` liaisons existent déjà. On peut en construire d'autres parmi `M` liaisons possibles, chacune avec un coût. Afficher le coût total minimal des liaisons à construire pour que tous les sommets soient reliés entre eux (directement ou en passant par d'autres sommets), ou `-1` si c'est impossible.

## Entrée
- La première ligne contient `N`, `K` et `M`.
- Chacune des `K` lignes suivantes contient deux entiers `A` et `B` : une liaison existante entre `A` et `B`.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `C` : on peut construire une liaison entre `A` et `B` pour le coût `C`.

## Sortie
Un seul entier : le coût minimal, ou `-1`.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ K ≤ 5 000
- 0 ≤ M ≤ 6 000
- 1 ≤ A, B ≤ N
- 1 ≤ C ≤ 10⁶

## Indices
1. Sans liaisons existantes, c'est un arbre couvrant de poids minimal : l'algorithme de Kruskal.
2. Une liaison existante, c'est une liaison de coût 0.
3. Il suffit donc de fusionner d'abord les extrémités des liaisons existantes dans l'Union-Find, puis de lancer Kruskal sur les liaisons possibles triées par coût.

## Solution
Les liaisons existantes sont des liaisons de coût 0 : on cherche un arbre couvrant de poids minimal du graphe qui contient toutes les liaisons, et l'on peut choisir d'utiliser toutes les liaisons gratuites. On commence donc par **fusionner** leurs extrémités dans l'Union-Find. Puis on applique **Kruskal** : on parcourt les liaisons possibles par coût croissant, et l'on construit chacune qui relie deux composantes différentes. À la fin, s'il reste plus d'une composante, la réponse est `-1`.

**Pourquoi c'est juste.** C'est Kruskal sur le graphe où les liaisons existantes ont un coût 0 : trier place ces liaisons en premier, et les fusionner d'abord revient à les traiter en premier. Les liaisons existantes qui ferment un cycle sont simplement ignorées, comme dans Kruskal. La propriété de coupure du cours garantit que chaque liaison construite appartient à un arbre de poids minimal.

**Complexité.** O(M log M) pour le tri, puis des opérations Union-Find en temps quasi constant.

**Pièges.** Le total peut dépasser 2³¹ (des milliers de liaisons à 10⁶) : `long long` en C++. Le nombre de composantes se compte en partant de `N` et en retirant 1 à chaque fusion réussie, liaisons existantes comprises. Si `N = 1`, la réponse est `0`.
