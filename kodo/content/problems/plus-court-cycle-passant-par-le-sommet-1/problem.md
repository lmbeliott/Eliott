---
id: plus-court-cycle-passant-par-le-sommet-1
title: Plus court cycle passant par le sommet 1
chapter: n4-chemins
order: 7
tags: [graphes, dijkstra]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes ; chaque arête a une longueur.

Un **cycle passant par le sommet 1** part du sommet `1` et y revient en empruntant des arêtes **toutes différentes**, sans passer deux fois par un même autre sommet. Il contient au moins deux arêtes. Sa longueur est la somme des longueurs de ses arêtes.

Écris un programme qui calcule la longueur minimale d'un cycle passant par le sommet `1`, ou qui affiche `-1` s'il n'en existe aucun.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets et le nombre d'arêtes.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `T` : une arête de longueur `T` relie les sommets `A` et `B`.

## Sortie
Un seul entier : la longueur minimale d'un cycle passant par le sommet `1`, ou `-1`.

## Contraintes
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 8 000
- 1 ≤ A, B ≤ N et A ≠ B ; deux sommets peuvent être reliés par plusieurs arêtes
- 1 ≤ T ≤ 1 000

## Indices
1. Retirer une arête `1 – V`, puis chercher le plus court chemin de `V` à `1` sans elle, donne le meilleur cycle qui commence par cette arête. Mais le sommet `1` peut avoir des milliers d'arêtes : un Dijkstra par arête est trop lent.
2. Lance un seul Dijkstra depuis `1`. Il construit un arbre de plus courts chemins. Chaque sommet `v` y appartient à une **branche** : la première arête du chemin de `1` à `v` dans l'arbre.
3. Si l'arête `A – B` (avec `A` et `B` différents de `1`) relie deux branches différentes, le chemin de `1` à `A`, l'arête, puis le chemin de `B` à `1` forment un vrai cycle. Si les branches sont les mêmes, ce n'est pas un cycle passant par `1`. Et une arête `1 – V` qui n'est pas celle de l'arbre ferme aussi un cycle.

## Solution
On lance **Dijkstra** depuis le sommet `1`. Pour chaque sommet `v` atteint, on retient sa distance `d[v]`, l'arête `arrivée[v]` par laquelle il a été atteint, et sa **branche** : la première arête du chemin de l'arbre. Quand on relâche une arête `u → v`, la branche de `v` est cette arête si `u = 1`, et sinon la branche de `u`.

On examine ensuite chaque arête `A – B` de longueur `T` :
- si `A` et `B` sont différents de `1` et que leurs branches diffèrent, les chemins de l'arbre de `1` à `A` et de `1` à `B` ne se touchent qu'en `1` : on obtient un cycle de longueur `d[A] + T + d[B]` ;
- si l'arête relie `1` à un sommet `V` et que ce n'est pas `arrivée[V]`, on obtient le cycle formé par l'arête et le chemin de l'arbre de `V` à `1`, de longueur `T + d[V]`.

La réponse est le plus petit de ces candidats. Pourquoi c'est le bon : prenons un cycle optimal `1, x₁, …, x_k, 1`. Sa première arête et sa dernière sont différentes. En le parcourant, la branche « change » forcément quelque part : soit entre deux sommets voisins `x_i` et `x_{i+1}` qui ont des branches différentes, soit au départ (la branche de `x₁` n'est pas la première arête du cycle), soit à l'arrivée. Dans chaque cas, l'arête à cet endroit donne un candidat, et ce candidat n'est pas plus long que le cycle, puisque `d[x]` est au plus la longueur de la portion du cycle entre `1` et `x`.

Complexité : **O(M log M)**.

Pourquoi les autres idées échouent :
- Un Dijkstra par arête qui part de `1` coûte O(deg(1) × M log M) : trop lent quand le sommet `1` a des milliers d'arêtes.
- Prendre la plus petite valeur `d[A] + T + d[B]` sur toutes les arêtes hors de l'arbre est faux : si `A` et `B` sont dans la même branche, les deux chemins partagent leur début, et ce n'est pas un cycle par `1`. Dans le premier exemple, le triangle `4 – 5 – 6` est très court mais ne passe pas par `1`.

Pièges :
- Les arêtes parallèles : deux arêtes entre `1` et `V` forment un cycle (deuxième exemple). C'est pour cela qu'on retient le **numéro** de l'arête par laquelle on atteint un sommet, et pas seulement son voisin.
- Un cycle ne peut pas revenir par l'arête qu'il vient d'emprunter : aller-retour sur une même arête ne compte pas.
- Les sommets non atteints depuis `1` sont ignorés.
