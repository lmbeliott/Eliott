---
id: tickets-de-telepherique
title: Les tickets de téléphérique
chapter: n4-chemins
order: 3
tags: [graphes, dijkstra]
samples: 2
---

## Énoncé
Lucas veut aller de la gare `1` (le village) à la gare `N` (le glacier) du domaine de Valcorde. Les gares sont reliées par des liaisons qui se parcourent dans les deux sens : certaines sont des **sentiers**, gratuits, et d'autres des **téléphériques**, bien plus rapides. Chaque trajet en téléphérique coûte un ticket, et Lucas n'a que `K` tickets en poche.

Écris un programme qui calcule la durée minimale du trajet de Lucas, en utilisant au plus `K` trajets en téléphérique, ou qui affiche `-1` si la gare `N` est inaccessible.

## Entrée
- La première ligne contient trois entiers `N`, `M` et `K` : le nombre de gares, le nombre de liaisons et le nombre de tickets.
- Chacune des `M` lignes suivantes contient quatre entiers `A`, `B`, `T` et `C` : une liaison relie les gares `A` et `B` en `T` minutes ; `C` vaut `0` pour un sentier et `1` pour un téléphérique.

## Sortie
Un seul entier : la durée minimale du trajet de la gare `1` à la gare `N` avec au plus `K` trajets en téléphérique, ou `-1` si c'est impossible.

## Contraintes
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 8 000
- 0 ≤ K ≤ 10
- 1 ≤ A, B ≤ N et A ≠ B
- 1 ≤ T ≤ 1 000

## Indices
1. La gare où se trouve Lucas ne suffit pas à décrire sa situation : deux arrivées à la même gare, l'une avec plus de tickets restants que l'autre, ne sont pas comparables.
2. Décris la situation par un **état** : (gare, nombre de tickets déjà utilisés). Depuis l'état `(u, k)`, un sentier mène à `(v, k)` et un téléphérique à `(v, k + 1)`, si `k + 1 ≤ K`.
3. Lance Dijkstra sur ce graphe d'états, qui a `N × (K + 1)` sommets, depuis `(1, 0)`. La réponse est la plus petite distance parmi les états `(N, k)`.

## Solution
Garder une seule distance par gare ne suffit pas : arriver à une gare en 30 minutes après avoir dépensé tous ses tickets n'est pas forcément mieux que d'y arriver en 40 minutes avec des tickets en réserve. On enrichit donc l'état : on construit un **graphe d'états** dont les sommets sont les couples `(gare, tickets utilisés)`, avec `0 ≤ tickets utilisés ≤ K`.

- Un sentier `A — B` de durée `T` relie `(A, k)` à `(B, k)` et `(B, k)` à `(A, k)`, pour tout `k`.
- Un téléphérique `A — B` de durée `T` relie `(A, k)` à `(B, k + 1)` et `(B, k)` à `(A, k + 1)`, pour tout `k < K`.

Tous les poids sont positifs : on applique l'**algorithme de Dijkstra** depuis l'état `(1, 0)`. Le premier état `(N, k)` retiré du tas, quel que soit `k`, donne la réponse. Si le tas se vide avant, la gare `N` est inaccessible : on affiche `-1`.

Le graphe d'états a `N × (K + 1)` sommets (55 000 au plus) et environ `2 × M × (K + 1)` arcs (176 000 au plus), qu'il est inutile de construire : on les calcule à la volée depuis la liste d'adjacence des gares. Complexité : **O(M × K × log(M × K))**.

Pourquoi les idées plus simples échouent :
- Un Dijkstra sur les gares seules, qui compte les tickets en chemin, garde pour chaque gare le trajet le plus rapide, même s'il a épuisé les tickets ; il peut alors manquer la bonne solution.
- Le glouton « faire le plus court chemin à pied, puis remplacer les `K` portions où le téléphérique fait gagner le plus de temps » est faux : le meilleur trajet avec téléphérique peut passer par de tout autres gares.
- Essayer tous les choix de `K` téléphériques parmi des milliers est hors de question.

Pièges :
- Une liaison se parcourt dans les deux sens, en téléphérique comme à pied.
- Le nombre de tickets est un maximum : il n'est pas obligatoire de tous les utiliser. Avec `K = 0`, seuls les sentiers sont permis.
- Si `N = 1`, la réponse est `0`.
