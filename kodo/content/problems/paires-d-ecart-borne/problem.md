---
id: paires-d-ecart-borne
title: Paires d'écart borné
chapter: n4-structures
order: 5
tags: [fenwick, tri, dichotomie]
samples: 2
---

## Énoncé
On donne une suite de `N` entiers `a[1], a[2], …, a[N]` et deux entiers `L` et `R`. Écris un programme qui compte les couples de positions `(i, j)` tels que `i < j` et `L ≤ a[j] - a[i] ≤ R`.

L'écart `a[j] - a[i]` est signé : il est négatif quand la valeur la plus à droite est la plus petite.

## Entrée
- La première ligne contient trois entiers `N`, `L` et `R`.
- La deuxième ligne contient `N` entiers : `a[1]` à `a[N]`.

## Sortie
Un seul entier : le nombre de couples `(i, j)` qui conviennent.

## Contraintes
- 1 ≤ N ≤ 15 000
- 0 ≤ a[i] ≤ 10⁹
- -10⁹ ≤ L ≤ R ≤ 10⁹

## Indices
1. Parcours la suite de gauche à droite. Arrivé en `j`, il faut compter les valeurs déjà vues qui sont dans l'intervalle `[a[j] - R, a[j] - L]`.
2. Un arbre de Fenwick indexé par les **valeurs** compte les valeurs déjà vues dans un intervalle en O(log N)… mais les valeurs vont jusqu'à 10⁹. Il n'y a pourtant que `N` valeurs différentes au plus : remplace chaque valeur par son **rang** dans la liste triée des valeurs distinctes.
3. Les bornes `a[j] - R` et `a[j] - L` ne font pas forcément partie de la suite : trouve par dichotomie la première valeur distincte `≥ a[j] - R` et la dernière `≤ a[j] - L`.

## Solution
On parcourt la suite de gauche à droite en gardant l'ensemble des valeurs déjà vues. Arrivé en position `j`, les positions `i < j` qui conviennent sont celles dont la valeur est dans `[a[j] - R, a[j] - L]` : il faut compter les valeurs déjà vues dans un intervalle, puis ajouter `a[j]` à l'ensemble.

Un **arbre de Fenwick** fait ces deux opérations en O(log) si les valeurs sont de petits entiers. On **compresse** donc les valeurs : on trie les valeurs distinctes de la suite, et chaque valeur est remplacée par son rang `1, 2, …, m` dans cette liste. L'ordre est conservé, donc un intervalle de valeurs devient un intervalle de rangs :
- `début` = nombre de valeurs distinctes `< a[j] - R` (dichotomie : `bisect_left`, ou `lower_bound` en C++) ;
- `fin` = nombre de valeurs distinctes `≤ a[j] - L` (`bisect_right`, ou `upper_bound`) ;
- les valeurs cherchées sont celles des rangs `début + 1` à `fin`, et leur nombre est `somme(fin) - somme(début)`.

Puis on ajoute `1` à la case du rang de `a[j]`.

Complexité : **O(N log N)** pour le tri, les dichotomies et les opérations sur l'arbre.

Pourquoi la méthode naïve échoue : tester tous les couples fait environ 1,1 × 10⁸ comparaisons, bien trop pour Python. Un arbre de Fenwick indexé directement par les valeurs demanderait un tableau d'un milliard de cases.

Pièges :
- `a[j] - L` peut atteindre 2 × 10⁹ : calcule les bornes avec des `long long` en C++.
- L'ordre compte : un couple `(i, j)` est compté quand on arrive en `j`, en n'interrogeant que les valeurs **déjà** ajoutées. Ajouter `a[j]` avant de compter compterait le couple `(j, j)` quand `L ≤ 0 ≤ R`.
- Les valeurs égales partagent le même rang ; avec `L ≤ 0 ≤ R`, deux valeurs égales forment un couple valable.
- Si `début ≥ fin`, aucune valeur ne convient : ne fais pas la soustraction à l'envers.
