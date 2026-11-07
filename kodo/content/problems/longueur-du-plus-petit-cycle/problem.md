---
id: longueur-du-plus-petit-cycle
title: Longueur du plus petit cycle
chapter: p4-graphes
order: 7
tags: [graphes, parcours-en-largeur, mathématiques]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes, sans boucle ni arête multiple. Un **cycle** de longueur `k ≥ 3` est une suite de `k` sommets distincts `v₁, v₂, …, v_k` telle que chaque sommet est relié au suivant et que `v_k` est relié à `v₁`.

Calculer la longueur du plus petit cycle du graphe (on l'appelle sa **maille**), ou afficher `-1` si le graphe n'a aucun cycle.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets (numérotés de `1` à `N`) et le nombre d'arêtes.
- Chacune des `M` lignes suivantes contient deux entiers distincts `A` et `B` : une arête relie les sommets `A` et `B`. Deux arêtes ne relient jamais les deux mêmes sommets.

## Sortie
Un seul entier : la longueur du plus petit cycle, ou `-1`.

## Contraintes
- 1 ≤ N ≤ 400
- 0 ≤ M ≤ 1 000
- 1 ≤ A, B ≤ N et A ≠ B

## Indices
1. Énumérer tous les cycles est hors de question : leur nombre peut être exponentiel. On peut en revanche se permettre un parcours en largeur depuis **chaque** sommet.
2. Pendant un parcours en largeur depuis `s`, une arête `u–v` qui ne fait pas partie de l'arbre du parcours ferme un cycle de longueur au plus `dist[u] + dist[v] + 1`.
3. Si `s` est sur un plus petit cycle, de longueur `g`, au moins une arête de ce cycle n'est pas dans l'arbre du parcours. Que vaut alors `dist[u] + dist[v] + 1` pour cette arête ?

## Solution
Pour chaque sommet `s`, on fait un parcours en largeur depuis `s` en retenant le `parent` de chaque sommet (celui qui l'a découvert). Quand on examine une arête `u–v` avec `v` déjà découvert et `v ≠ parent[u]`, l'arête n'est pas dans l'arbre du parcours, et on retient la valeur `dist[u] + dist[v] + 1`. La réponse est la plus petite valeur retenue, sur tous les `s`.

**Toute valeur retenue est au moins la maille `g`.** Les chemins de l'arbre de `s` à `u` et de `s` à `v` ont une partie commune, de `s` jusqu'à un dernier sommet commun `w`. Les deux morceaux `w → u` et `w → v`, plus l'arête `u–v` (qui n'est dans aucun des deux), forment un vrai cycle, de longueur au plus `dist[u] + dist[v] + 1`.

**La valeur `g` est atteinte.** Soit `C` un plus petit cycle, et `s` un de ses sommets. L'arbre du parcours depuis `s` n'a pas de cycle, donc une arête `u–v` de `C` n'est pas dans l'arbre. Sur `C`, privé de l'arête `u–v`, il reste un chemin de `u` à `v` qui passe par `s` : sa partie `s → u` et sa partie `s → v` ont des longueurs dont la somme vaut `g − 1`. Comme `dist` donne les plus courtes distances, `dist[u] + dist[v] + 1 ≤ g`. Cette arête est bien examinée : quand le premier de ses deux sommets est défilé, l'autre est déjà découvert (sinon l'arête serait dans l'arbre) et n'est pas son parent.

**Complexité.** `N` parcours en largeur : O(N × (N + M)), soit environ 10⁶ opérations ici.
