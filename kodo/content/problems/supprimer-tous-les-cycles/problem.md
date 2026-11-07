---
id: supprimer-tous-les-cycles
title: Supprimer tous les cycles
chapter: p4-graphes
order: 4
tags: [graphes, parcours-en-profondeur, mathématiques]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes. Un **cycle** est un chemin d'au moins une arête qui revient à son point de départ sans emprunter deux fois la même arête. Une boucle (une arête d'un sommet vers lui-même) forme donc à elle seule un cycle, et deux arêtes qui relient les deux mêmes sommets forment un cycle.

Calculer le plus petit nombre d'arêtes à supprimer pour que le graphe ne contienne plus aucun cycle.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets (numérotés de `1` à `N`) et le nombre d'arêtes.
- Chacune des `M` lignes suivantes contient deux entiers `A` et `B` : une arête relie les sommets `A` et `B`.

## Sortie
Un seul entier : le nombre minimal d'arêtes à supprimer.

## Contraintes
- 1 ≤ N ≤ 100 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N

## Indices
1. Un graphe connexe de `s` sommets sans cycle (un arbre) a exactement `s − 1` arêtes.
2. Un graphe sans cycle formé de `c` composantes connexes a donc exactement `N − c` arêtes. Que deviennent les composantes quand on supprime des arêtes ?
3. La réponse ne dépend que de `N`, de `M` et du nombre de composantes connexes du graphe de départ.

## Solution
Soit `c` le nombre de composantes connexes du graphe. La réponse est `M − (N − c) = M − N + c`.

**On ne peut pas faire mieux.** Supprimer des arêtes ne fusionne jamais deux composantes : le graphe obtenu a `c' ≥ c` composantes. S'il n'a plus de cycle, chacune de ses composantes est un arbre, et une composante de `s` sommets a `s − 1` arêtes ; en tout, il reste `N − c' ≤ N − c` arêtes. On a donc supprimé au moins `M − (N − c)` arêtes.

**On peut atteindre cette valeur.** Un parcours lancé depuis chaque sommet non visité construit, dans chaque composante, l'arbre formé des arêtes par lesquelles chaque sommet a été découvert. Ces arbres ont `N − c` arêtes, n'ont pas de cycle et gardent les mêmes composantes. On supprime toutes les autres arêtes, soit `M − N + c`.

Le programme compte donc les composantes avec la boucle du cours (parcours en profondeur avec une pile), puis affiche `M − N + c`. Les boucles et les arêtes multiples sont comptées automatiquement : elles ne servent jamais à découvrir un nouveau sommet.

**Complexité.** O(N + M).
