---
id: pauses-obligatoires
title: Les pauses obligatoires
chapter: n4-chemins
order: 1
tags: [graphes, dijkstra]
samples: 2
---

## Énoncé
Nathan, guide à Valcorde, doit conduire un groupe du refuge `1` (le village) au refuge `N`. Les refuges sont reliés par des sentiers, chacun parcouru en un temps connu, dans un sens comme dans l'autre. Le règlement du parc impose une pause dans **chaque refuge traversé** : en passant par le refuge `i`, le groupe s'y arrête `P[i]` minutes (pointage, eau, repos). Il n'y a pas de pause au refuge de départ ni au refuge d'arrivée.

Écris un programme qui calcule la durée minimale du trajet, pauses comprises, ou affiche `-1` si le refuge `N` est inaccessible depuis le refuge `1`.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de refuges et le nombre de sentiers.
- La deuxième ligne contient `N` entiers `P[1] … P[N]` : la durée de la pause dans chaque refuge.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `T` : un sentier relie les refuges `A` et `B` en `T` minutes.

## Sortie
Un seul entier : la durée minimale du trajet du refuge `1` au refuge `N`, en minutes, ou `-1` s'il n'existe aucun trajet.

## Contraintes
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 8 000
- 0 ≤ P[i] ≤ 1 000
- 1 ≤ A, B ≤ N et A ≠ B ; deux refuges peuvent être reliés par plusieurs sentiers
- 1 ≤ T ≤ 1 000

## Indices
1. Sans les pauses, c'est un plus court chemin dans un graphe à poids positifs : l'algorithme de Dijkstra.
2. Les pauses sont attachées aux refuges, pas aux sentiers. Peux-tu les reporter sur les sentiers ? Quand on emprunte un sentier pour **entrer** dans un refuge, combien de temps cela coûte-t-il en tout ?
3. Le coût pour aller de `u` à `v` est `T + P[v]`, sauf si `v` est le refuge d'arrivée (pas de pause). Lance Dijkstra depuis le refuge `1` avec ces coûts.

## Solution
On reporte chaque pause sur les sentiers qui **entrent** dans le refuge : emprunter le sentier de `u` vers `v` coûte `T + P[v]`, sauf quand `v = N` où il ne coûte que `T`. Un trajet `1 → … → N` coûte alors exactement la somme des temps de marche plus les pauses des refuges intermédiaires, puisqu'on entre une fois dans chacun d'eux. Le départ, lui, ne paie jamais sa pause : on n'y « entre » pas.

Ces coûts sont positifs : l'**algorithme de Dijkstra** avec une file de priorité (un tas) donne le plus court chemin. On garde `dist[v]`, la meilleure durée connue pour atteindre `v`. On retire du tas le refuge de plus petite distance ; sa distance est alors définitive, et on essaie d'améliorer celle de chacun de ses voisins. Si un refuge sort du tas avec une distance plus grande que `dist`, c'est une entrée périmée : on l'ignore.

Complexité : **O((N + M) log M)**. Un Dijkstra sans tas (qui cherche le minimum en parcourant tous les refuges) coûte O(N²), et l'algorithme de Bellman-Ford O(N × M), soit des dizaines de millions d'opérations : trop lent en Python. Un parcours en largeur, lui, est faux : il minimise le nombre de sentiers, pas la durée.

Pièges :
- Pas de pause au refuge `N` : sur le premier exemple, l'oublier ajoute 50 minutes.
- Si `N = 1`, le groupe est déjà arrivé : la réponse est `0`.
- Quand le refuge `N` n'est jamais atteint, affiche `-1`.
