---
id: distances-depuis-le-sommet-1
title: Distances depuis le sommet 1
chapter: p4-plus-courts-chemins
order: 1
tags: [graphes, dijkstra]
samples: 2
---

## Énoncé
Un graphe non orienté a `N` sommets numérotés de `1` à `N` et `M` arêtes ; chaque arête a une longueur. Une arête peut relier un sommet à lui-même, et deux sommets peuvent être reliés par plusieurs arêtes.

Pour chaque sommet `v`, afficher la longueur d'un plus court chemin du sommet `1` au sommet `v`, ou `-1` si `v` n'est pas accessible depuis `1`.

## Entrée
- La première ligne contient `N` et `M`.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `L` : une arête de longueur `L` relie `A` et `B`.

## Sortie
Une ligne de `N` entiers : les distances des sommets `1`, `2`, …, `N` depuis le sommet `1`.

## Contraintes
- 1 ≤ N ≤ 6 000
- 0 ≤ M ≤ 8 000
- 1 ≤ A, B ≤ N
- 1 ≤ L ≤ 10⁹

## Indices
1. Les longueurs sont positives : c'est exactement le cadre de l'algorithme de Dijkstra.
2. Un tas (`heapq`, `priority_queue`) donne à chaque étape le sommet non traité le plus proche. Quand un sommet sort du tas avec une distance plus grande que celle qu'on connaît, on l'ignore.
3. Un plus court chemin peut avoir des milliers d'arêtes de longueur 10⁹ : quel type faut-il en C++ ?

## Solution
C'est l'algorithme de Dijkstra, appliqué tel quel. On garde `dist[v]`, la plus petite longueur connue d'un chemin de `1` à `v` (l'infini au départ, `0` pour le sommet `1`), et un tas de couples `(distance, sommet)`. À chaque étape, on retire le couple de plus petite distance `(d, u)`. Si `d > dist[u]`, c'est une **entrée périmée** : `u` a déjà été traité avec une meilleure distance, on passe. Sinon, `d` est la distance définitive de `u`, et on **relâche** chaque arête `u – v` de longueur `L` : si `d + L < dist[v]`, on améliore `dist[v]` et on ajoute `(dist[v], v)` au tas.

**Pourquoi c'est juste.** Toutes les longueurs étant positives, le sommet non traité de plus petite distance provisoire ne peut pas être atteint plus court en passant par un autre sommet non traité : tout tel détour coûte déjà au moins autant avant même d'arriver. C'est la preuve du cours.

**Complexité.** Chaque arête est relâchée deux fois (une fois par extrémité) et ajoute au plus un couple au tas : O((N + M) log M). Chercher le minimum en parcourant tous les sommets à chaque étape coûterait O(N²), soit 36 millions d'étapes : trop lent en Python.

**Pièges.** Les distances dépassent 2³¹ dès qu'un chemin a trois arêtes de longueur 10⁹ (deuxième exemple) : il faut des `long long` en C++, et une valeur « infinie » bien plus grande que toute distance possible (6 000 × 10⁹ = 6 × 10¹²). Les sommets jamais atteints affichent `-1`. Les boucles et les arêtes multiples ne demandent aucun traitement particulier.
