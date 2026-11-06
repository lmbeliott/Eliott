---
id: au-plus-k-aretes-speciales
title: Au plus K arêtes spéciales
chapter: n4-chemins
order: 3
tags: [graphes, dijkstra]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes. Chaque arête a une longueur et un type : elle est **normale** ou **spéciale**.

Écris un programme qui calcule la longueur minimale d'un chemin du sommet `1` au sommet `N` qui emprunte au plus `K` fois une arête spéciale (chaque passage compte), ou qui affiche `-1` s'il n'existe aucun tel chemin.

## Entrée
- La première ligne contient trois entiers `N`, `M` et `K` : le nombre de sommets, le nombre d'arêtes et le nombre maximal de passages sur une arête spéciale.
- Chacune des `M` lignes suivantes contient quatre entiers `A`, `B`, `T` et `C` : une arête de longueur `T` relie les sommets `A` et `B` ; `C` vaut `0` pour une arête normale et `1` pour une arête spéciale.

## Sortie
Un seul entier : la longueur minimale d'un chemin du sommet `1` au sommet `N` avec au plus `K` passages sur une arête spéciale, ou `-1` si c'est impossible.

## Contraintes
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 8 000
- 0 ≤ K ≤ 10
- 1 ≤ A, B ≤ N et A ≠ B
- 1 ≤ T ≤ 1 000

## Indices
1. Le sommet où l'on se trouve ne suffit pas à décrire la situation : deux arrivées au même sommet, l'une ayant emprunté moins d'arêtes spéciales que l'autre, ne sont pas comparables.
2. Décris la situation par un **état** : (sommet, nombre de passages déjà faits sur une arête spéciale). Depuis l'état `(u, k)`, une arête normale mène à `(v, k)` et une arête spéciale à `(v, k + 1)`, si `k + 1 ≤ K`.
3. Lance Dijkstra sur ce graphe d'états, qui a `N × (K + 1)` sommets, depuis `(1, 0)`. La réponse est la plus petite distance parmi les états `(N, k)`.

## Solution
Garder une seule distance par sommet ne suffit pas : atteindre un sommet avec une longueur `30` après avoir épuisé tous ses passages spéciaux n'est pas forcément mieux que de l'atteindre avec une longueur `40` en ayant encore des passages en réserve. On enrichit donc l'état : on construit un **graphe d'états** dont les sommets sont les couples `(sommet, passages spéciaux utilisés)`, avec `0 ≤ passages spéciaux utilisés ≤ K`.

- Une arête normale `A — B` de longueur `T` relie `(A, k)` à `(B, k)` et `(B, k)` à `(A, k)`, pour tout `k`.
- Une arête spéciale `A — B` de longueur `T` relie `(A, k)` à `(B, k + 1)` et `(B, k)` à `(A, k + 1)`, pour tout `k < K`.

Tous les poids sont positifs : on applique l'**algorithme de Dijkstra** depuis l'état `(1, 0)`. Le premier état `(N, k)` retiré du tas, quel que soit `k`, donne la réponse. Si le tas se vide avant, aucun chemin ne convient : on affiche `-1`.

Le graphe d'états a `N × (K + 1)` sommets (55 000 au plus) et environ `2 × M × (K + 1)` arcs (176 000 au plus), qu'il est inutile de construire : on les calcule à la volée depuis les listes d'adjacence du graphe. Complexité : **O(M × K × log(M × K))**.

Pourquoi les idées plus simples échouent :
- Un Dijkstra sur les sommets seuls, qui compte les passages spéciaux en chemin, garde pour chaque sommet le chemin le plus court, même s'il a épuisé tous ses passages ; il peut alors manquer la bonne solution (sur le premier exemple, il trouve `53` au lieu de `30`).
- Le glouton « prendre le plus court chemin sans arête spéciale, puis le raccourcir avec les `K` arêtes spéciales les plus avantageuses » est faux : le meilleur chemin avec arêtes spéciales peut passer par de tout autres sommets.
- Essayer tous les choix de `K` arêtes spéciales parmi des milliers est hors de question.

Pièges :
- Une arête spéciale s'emprunte dans les deux sens, comme une arête normale.
- `K` est un maximum : il n'est pas obligatoire de faire `K` passages spéciaux. Avec `K = 0`, seules les arêtes normales sont permises.
- Si `N = 1`, la réponse est `0`.
