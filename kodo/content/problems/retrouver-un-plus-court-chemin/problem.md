---
id: retrouver-un-plus-court-chemin
title: Retrouver un plus court chemin
chapter: p4-plus-courts-chemins
order: 2
tags: [graphes, dijkstra]
samples: 2
---

## Énoncé
Un graphe **orienté** a `N` sommets et `M` arcs ; chaque arc a une longueur et ne s'emprunte que dans son sens. Afficher un plus court chemin du sommet `1` au sommet `N` : sa longueur et la liste de ses sommets.

On garantit que, si le sommet `N` est accessible depuis le sommet `1`, le plus court chemin est **unique**.

## Entrée
- La première ligne contient `N` et `M`.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `L` : un arc de longueur `L` va de `A` vers `B`.

## Sortie
Si le sommet `N` n'est pas accessible, afficher `-1`. Sinon, afficher sur une première ligne la longueur `D` du plus court chemin et son nombre `K` de sommets, puis sur une deuxième ligne les `K` sommets du chemin, de `1` à `N`.

## Contraintes
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 7 000
- 1 ≤ A, B ≤ N
- 1 ≤ L ≤ 10⁶

## Indices
1. L'algorithme de Dijkstra donne la longueur. Pour le chemin, il faut retenir une information de plus à chaque amélioration de `dist[v]`.
2. Retenir `pred[v]`, le sommet `u` depuis lequel on a amélioré `dist[v]` pour la dernière fois. En partant de `N` et en suivant `pred`, on remonte jusqu'à `1`.
3. La remontée donne le chemin à l'envers : il reste à le retourner.

## Solution
On lance Dijkstra depuis le sommet `1`. Chaque fois qu'un arc `u → v` améliore `dist[v]`, on note `pred[v] = u`. On peut s'arrêter dès que `N` sort du tas avec sa distance définitive. Puis on part de `N` et on suit `pred` jusqu'à `1` ; on retourne la liste obtenue.

**Pourquoi c'est juste.** Quand un sommet `v` est traité, `pred[v] = u` a été fixé par la dernière amélioration, et `dist[v] = dist[u] + L` avec `u` déjà traité, donc `dist[u]` définitive. Par récurrence sur l'ordre de traitement, en suivant `pred` depuis `v`, on lit un chemin de longueur exactement `dist[v]` : un plus court chemin. La remontée s'arrête : les distances de `pred` décroissent strictement (les longueurs sont au moins 1), et seul le sommet `1` a la distance `0`.

**Complexité.** O((N + M) log M) pour Dijkstra, plus O(N) pour la remontée.

**Pièges.** Le graphe est orienté : n'ajouter l'arc qu'au sommet de départ (deuxième exemple : `3 → 2` ne permet pas d'aller de `2` à `3`). Si `N = 1`, le chemin est réduit au sommet `1` : on affiche `0 1` puis `1`. Mettre à jour `pred[v]` **uniquement** quand `dist[v]` diminue strictement, sinon le chemin remonté peut ne plus correspondre à la distance.
