---
id: relier-k-sommets-au-moindre-cout
title: Relier K sommets au moindre coût
chapter: n4-defis
order: 7
tags: [programmation-dynamique, bits, dijkstra, graphes]
samples: 2
---

## Énoncé
On donne un graphe non orienté et connexe de `N` sommets et `M` arêtes. L'arête `j` relie deux sommets et coûte `C[j]`. Parmi les sommets, `K` sont **imposés**.

Tu dois choisir des arêtes de sorte que, en n'utilisant que les arêtes choisies, on puisse aller de n'importe quel sommet imposé à n'importe quel autre. Les chemins peuvent passer par des sommets qui ne sont pas imposés.

Écris un programme qui affiche le plus petit coût total des arêtes choisies.

## Entrée
- La première ligne contient les entiers `N`, `M` et `K`.
- La deuxième ligne contient les `K` numéros (distincts) des sommets imposés.
- Les `M` lignes suivantes contiennent chacune trois entiers `u`, `v` et `C` : une arête de coût `C` entre les sommets `u` et `v`.

Les sommets sont numérotés de `1` à `N`. Il n'y a ni arête d'un sommet vers lui-même, ni deux arêtes entre les mêmes sommets.

## Sortie
Un seul entier : le plus petit coût total.

## Contraintes
- 1 ≤ N ≤ 1 000
- 0 ≤ M ≤ 3 000
- 1 ≤ K ≤ 7 et K ≤ N
- 1 ≤ C ≤ 1 000 000
- Le graphe est connexe.

## Indices
1. Une solution optimale est un arbre. Prends un de ses sommets `v` : en partant de `v`, l'arbre se découpe en morceaux qui se rejoignent en `v`, et chacun relie `v` à une partie des sommets imposés. Avec `K ≤ 7`, une partie des sommets imposés se code par un masque de bits.
2. Note `f[S][v]` le coût minimal d'un ensemble d'arêtes qui relie `v` à tous les sommets imposés du masque `S`. Deux façons de l'obtenir : soit deux arbres pour des parties `A` et `S \ A` se rejoignent en `v` (`f[A][v] + f[S \ A][v]`), soit `v` est relié par un chemin à un sommet `u` où se fait cette jonction (`f[S][u] + distance`).
3. Traite les masques par ordre croissant. Pour chaque `S`, calcule d'abord toutes les jonctions en chaque `v`, puis lance un Dijkstra qui part de **tous** les sommets à la fois, avec `f[S][v]` comme distance de départ : il prolonge par les chemins. La réponse est `f[tous][v]` pour un sommet imposé `v`.

## Solution
**Pourquoi ce n'est pas un plus court chemin.** Un arbre couvrant minimal ne répond pas : il relie tous les sommets, imposés ou non. Relier les sommets imposés par des plus courts chemins, deux à deux ou un par un, ne répond pas non plus : la meilleure solution passe souvent par des sommets « carrefours » qu'aucun plus court chemin entre deux sommets imposés n'utilise. Dans le premier exemple, le sommet `4` est un tel carrefour.

**L'état.** Les sommets imposés sont numérotés de `0` à `K - 1`. Pour un masque `S` et un sommet `v`, `f[S][v]` est le coût minimal d'un ensemble d'arêtes qui relie `v` et tous les sommets imposés de `S`. Au départ, `f[{t}][t] = 0` pour chaque sommet imposé `t`.

**La récurrence.** Prenons un arbre optimal pour `(S, v)` avec `|S| ≥ 2`. Partons de `v` et suivons l'arbre tant qu'il forme un simple chemin sans sommet imposé. On s'arrête en un sommet `u` qui est soit imposé, soit un embranchement. Dans les deux cas, l'arbre se coupe en `u` en deux arbres qui relient `u` à deux parties non vides `A` et `S \ A`. D'où :
- **jonction** : `f[S][u] = min f[A][u] + f[S \ A][u]` sur les parties `A` non vides et différentes de `S` ;
- **prolongement** : `f[S][v] = min f[S][u] + dist(u, v)`.

Le prolongement, c'est exactement un **Dijkstra à plusieurs sources** : on met chaque sommet `u` dans le tas avec la distance de départ `f[S][u]` donnée par les jonctions, et on relâche les arêtes normalement.

**L'ordre.** Les parties `A` et `S \ A` sont des masques plus petits que `S` : on traite les masques par ordre croissant. Pour ne pas voir chaque coupe deux fois, on impose que `A` contienne le plus petit bit de `S`. On énumère les sous-masques par `A = (A - 1) & S`.

Complexité : **O(3ᴷ × N + 2ᴷ × M log N)**. Les jonctions coûtent au total environ 3⁷ / 2 ≈ 1 100 passes sur les `N` sommets, et il y a 127 Dijkstra.

Pourquoi les idées simples échouent :
- Essayer tous les ensembles de sommets de passage est exponentiel en `N`.
- L'arbre couvrant minimal des distances entre sommets imposés, ou l'ajout glouton du sommet imposé le plus proche de l'arbre déjà construit, donnent des coûts trop grands : dans le premier exemple, `16` au lieu de `15`. Les tests sont construits pour qu'ils échouent.
- Calculer toutes les distances avec Floyd-Warshall coûte N³ = 10⁹ opérations.

Pièges :
- Avec `K = 1`, la réponse est `0`.
- En C++, les coûts dépassent 2³¹ : utilise `long long`, et une valeur « infinie » dont le double ne déborde pas (par exemple 2⁶⁰).
