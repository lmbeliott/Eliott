---
id: plus-court-chemin-avec-couts-aux-sommets
title: Plus court chemin avec coûts aux sommets
chapter: n4-chemins
order: 1
tags: [graphes, dijkstra]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes ; chaque arête a une longueur. Chaque sommet `i` a aussi un coût `P[i]`, que l'on paie quand un chemin **traverse** ce sommet : le sommet de départ et le sommet d'arrivée ne coûtent rien.

Le **coût** d'un chemin est la somme des longueurs de ses arêtes et des coûts des sommets intermédiaires. Écris un programme qui calcule le coût minimal d'un chemin du sommet `1` au sommet `N`, ou qui affiche `-1` s'il n'existe aucun chemin.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets et le nombre d'arêtes.
- La deuxième ligne contient `N` entiers `P[1] … P[N]` : le coût de chaque sommet.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `T` : une arête de longueur `T` relie les sommets `A` et `B`.

## Sortie
Un seul entier : le coût minimal d'un chemin du sommet `1` au sommet `N`, ou `-1` s'il n'existe aucun chemin.

## Contraintes
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 8 000
- 0 ≤ P[i] ≤ 1 000
- 1 ≤ A, B ≤ N et A ≠ B ; deux sommets peuvent être reliés par plusieurs arêtes
- 1 ≤ T ≤ 1 000

## Indices
1. Sans les coûts aux sommets, c'est un plus court chemin dans un graphe à poids positifs : l'algorithme de Dijkstra.
2. Les coûts sont attachés aux sommets, pas aux arêtes. Peux-tu les reporter sur les arêtes ? Quand on emprunte une arête pour **entrer** dans un sommet, combien cela coûte-t-il en tout ?
3. Le coût pour aller de `u` à `v` est `T + P[v]`, sauf si `v` est le sommet d'arrivée (rien à payer). Lance Dijkstra depuis le sommet `1` avec ces coûts.

## Solution
On reporte le coût de chaque sommet sur les arêtes qui y **entrent** : emprunter l'arête de `u` vers `v` coûte `T + P[v]`, sauf quand `v = N` où elle ne coûte que `T`. Un chemin `1 → … → N` coûte alors exactement la somme des longueurs plus les coûts des sommets intermédiaires, puisqu'on entre une fois dans chacun d'eux. Le départ, lui, ne paie jamais son coût : on n'y « entre » pas.

Ces coûts sont positifs : l'**algorithme de Dijkstra** avec une file de priorité (un tas) donne le plus court chemin. On garde `dist[v]`, le meilleur coût connu pour atteindre `v`. On retire du tas le sommet de plus petite distance ; sa distance est alors définitive, et on essaie d'améliorer celle de chacun de ses voisins. Si un sommet sort du tas avec une distance plus grande que `dist`, c'est une entrée périmée : on l'ignore.

Complexité : **O((N + M) log M)**. Un Dijkstra sans tas (qui cherche le minimum en parcourant tous les sommets) coûte O(N²) : environ 25 millions d'étapes ici, ce qui passe encore, mais devient vite trop lent quand `N` grandit. L'algorithme de Bellman-Ford, en O(N × M), demande jusqu'à 40 millions de relaxations quand le plus court chemin a des milliers d'arêtes : trop lent en Python. Un parcours en largeur, lui, est faux : il minimise le nombre d'arêtes, pas le coût.

Pièges :
- Le sommet `N` ne coûte rien : sur le premier exemple, l'oublier ajoute `50`.
- Si `N = 1`, le chemin est vide : la réponse est `0`.
- Quand le sommet `N` n'est jamais atteint, affiche `-1`.
