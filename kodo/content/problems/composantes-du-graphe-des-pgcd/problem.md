---
id: composantes-du-graphe-des-pgcd
title: Composantes du graphe des PGCD
chapter: p4-union-find
order: 3
tags: [graphes, union-find, mathématiques]
samples: 2
---

## Énoncé
Les sommets d'un graphe sont les entiers de `1` à `N`. Pour un seuil `T`, deux entiers différents `a` et `b` sont reliés par une arête quand `pgcd(a, b) ≥ T`.

Pour chacun des `Q` seuils donnés, afficher le nombre de composantes connexes du graphe.

Par exemple, pour `N = 10` et `T = 3`, les arêtes relient 3, 6 et 9 (PGCD 3), 4 et 8 (PGCD 4), 5 et 10 (PGCD 5) ; les composantes sont `{3, 6, 9}`, `{4, 8}`, `{5, 10}`, `{1}`, `{2}` et `{7}` : il y en a 6.

## Entrée
- La première ligne contient `N` et `Q`.
- La deuxième ligne contient les `Q` seuils `T₁ … T_Q`.

## Sortie
Une ligne de `Q` entiers : le nombre de composantes pour chaque seuil, dans l'ordre.

## Contraintes
- 1 ≤ N ≤ 100 000
- 1 ≤ Q ≤ 20 000
- 1 ≤ T_i ≤ N

## Indices
1. Le graphe peut avoir des milliards d'arêtes. Si `pgcd(a, b) = g ≥ T`, alors `a` et `b` sont tous deux multiples de `g` : il suffit de relier chaque `g ≥ T` à ses multiples.
2. Quand le seuil baisse, on ne fait qu'ajouter des arêtes. Calculer la réponse pour tous les seuils à la fois, de `N` jusqu'à `1`.
3. Au seuil `d`, on relie `d` à `2d`, `3d`, … avec l'Union-Find, puis on note le nombre de composantes. Le nombre total de liaisons est `N/1 + N/2 + … + N/N`, environ `N ln N`.

## Solution
**Moins d'arêtes, mêmes composantes.** Pour un seuil `T`, soit `H_T` le graphe qui relie chaque entier `d ≥ T` à ses multiples `2d, 3d, …` au plus `N`. Chaque arête de `H_T` est une arête du graphe de l'énoncé, car `pgcd(d, kd) = d ≥ T`. Réciproquement, si `pgcd(a, b) = g ≥ T`, alors `a` et `b` sont des multiples de `g`, donc reliés à `g` dans `H_T` (ou égaux à `g`) : le chemin `a – g – b` existe. Les deux graphes ont donc les mêmes composantes.

**Tous les seuils d'un coup.** Quand `T` diminue de 1, `H_T` gagne seulement les arêtes de `d = T`. On parcourt donc `d` de `N` à `1` avec un Union-Find : on relie `d` à chacun de ses multiples, et l'on note `reponse[d]`, le nombre de composantes à ce moment. Chaque question se lit ensuite dans ce tableau. C'est une **connexité qui évolue par ajouts** : l'ordre des seuils décroissants transforme le problème en une suite d'unions.

**Complexité.** Le nombre d'unions est `N/1 + N/2 + … + N/N ≈ N ln N`, soit environ 1,2 million pour `N = 100 000`, chacune en temps quasi constant. Recalculer les composantes pour chaque question coûterait `Q` fois plus.

**Pièges.** Pour `T = 1`, tout est relié (`pgcd(a, b) ≥ 1` toujours) : une seule composante. Le sommet `1` n'a de voisin qu'au seuil `1`. L'ordre des seuils dans l'entrée est quelconque, et un seuil peut être demandé plusieurs fois.
