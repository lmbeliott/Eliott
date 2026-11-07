---
id: somme-ponderee-des-distances
title: Somme pondérée des distances
chapter: n4-arbres
order: 3
tags: [graphes, parcours-en-largeur, programmation-dynamique]
samples: 2
---

## Énoncé
On donne un arbre de `N` sommets, numérotés de `1` à `N`. Chaque sommet `u` porte un poids `c[u]`. La distance entre deux sommets est le nombre d'arêtes du chemin qui les relie.

Pour chaque sommet `v`, on note `F(v)` la somme, sur tous les sommets `u`, de `c[u] × distance(u, v)`. Écris un programme qui calcule `F(v)` pour chaque sommet `v`.

## Entrée
- La première ligne contient un entier `N`.
- La deuxième ligne contient `N` entiers `c[1] … c[N]`.
- La troisième ligne contient `N - 1` entiers : le parent de chacun des sommets `2, 3, …, N`, dans cet ordre, quand l'arbre est enraciné au sommet `1`. Elle est vide si `N = 1`.

## Sortie
`N` lignes : la ligne `v` contient `F(v)`.

## Contraintes
- 1 ≤ N ≤ 12 000
- 0 ≤ c[u] ≤ 1 000

## Indices
1. Un parcours depuis chaque sommet donne la réponse en O(N²) : trop lent. Commence par calculer `F(1)` seul, avec les profondeurs.
2. Si `v` est un enfant de `p`, que change le passage de `p` à `v` ? Chaque sommet du sous-arbre de `v` se rapproche de `1`, chaque autre sommet s'éloigne de `1`.
3. Avec `W[v]` la somme des poids du sous-arbre de `v` et `T` la somme de tous les poids : `F(v) = F(p) - W[v] + (T - W[v])`. Calcule les `F` de la racine vers les feuilles.

## Solution
C'est la technique du **changement de racine** (*rerooting*) : on calcule la réponse pour une racine, puis on la fait « glisser » le long de chaque arête en O(1).

1. Un parcours en largeur depuis le sommet `1` donne un ordre où chaque sommet vient après son parent, et la profondeur de chaque sommet. On en déduit `F(1) = Σ c[u] × profondeur[u]`.
2. En parcourant cet ordre à l'envers, on calcule `W[v]`, la somme des poids du sous-arbre de `v` : `W[v] = c[v] + Σ W[enfant]`. On note `T = W[1]`.
3. Soit `v` un enfant de `p`. En passant de `p` à `v`, les sommets du sous-arbre de `v` se rapprochent de `1` (ils pèsent `W[v]` en tout) et tous les autres s'éloignent de `1` (ils pèsent `T - W[v]`). Donc `F(v) = F(p) + T - 2 × W[v]`. On applique cette formule dans l'ordre du parcours, de la racine vers les feuilles, pour que `F(p)` soit connu avant `F(v)`.

Complexité : **O(N)**.

Pourquoi la méthode naïve échoue : un parcours en largeur depuis chaque sommet coûte O(N²), environ 1,4 × 10⁸ visites de sommets pour `N = 12 000` : bien trop pour Python.

Pièges :
- Les sommes dépassent 2³¹ (jusqu'à environ 7 × 10¹⁰ pour un long chemin) : utilise des `long long` en C++.
- Les numéros ne suivent pas la hiérarchie : il faut un vrai ordre de parcours, pas l'ordre des numéros.
- Une version récursive dépasse la limite de récursion de Python sur un arbre en forme de chemin.
- Le signe compte : `W[v]` se **retranche** une fois (le sous-arbre se rapproche) et `T - W[v]` s'**ajoute** (le reste s'éloigne). Vérifie la formule sur le premier exemple avant de coder.
