---
id: distances-dans-le-graphe-complementaire
title: Distances dans le graphe complémentaire
chapter: p4-graphes
order: 6
tags: [graphes, parcours-en-largeur]
samples: 2
---

## Énoncé
On donne un graphe non orienté `G` de `N` sommets et `M` arêtes. Son **graphe complémentaire** a les mêmes sommets, et deux sommets distincts y sont reliés par une arête si et seulement s'ils ne sont **pas** reliés dans `G`.

Pour chaque sommet, calculer sa distance au sommet `1` dans le graphe complémentaire, c'est-à-dire le nombre minimal d'arêtes d'un chemin du complémentaire qui va du sommet `1` à ce sommet.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets (numérotés de `1` à `N`) et le nombre d'arêtes de `G`.
- Chacune des `M` lignes suivantes contient deux entiers distincts `A` et `B` : une arête de `G` relie les sommets `A` et `B`.

Une même arête peut apparaître plusieurs fois.

## Sortie
Une ligne de `N` entiers séparés par des espaces : pour `V` allant de `1` à `N`, la distance du sommet `1` au sommet `V` dans le graphe complémentaire, ou `-1` si aucun chemin du complémentaire ne les relie.

## Contraintes
- 1 ≤ N ≤ 100 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N et A ≠ B

## Indices
1. Le graphe complémentaire peut avoir près de 5 × 10⁹ arêtes : impossible de construire ses listes de voisins.
2. Faire un parcours en largeur sans construire le complémentaire. Garder la liste des sommets **pas encore découverts** : quand on défile `u`, ceux de cette liste qui ne sont pas voisins de `u` dans `G` sont découverts.
3. Un sommet de la liste qui n'est pas découvert à l'examen de `u` est un voisin de `u` dans `G`. Combien de fois cela peut-il arriver en tout ?

## Solution
On fait un parcours en largeur dans le complémentaire **sans le construire**. On garde la liste `restants` des sommets pas encore découverts. Quand on défile un sommet `u` :
- on marque ses voisins dans `G` ;
- on parcourt `restants` : un sommet non marqué est voisin de `u` dans le complémentaire, il reçoit la distance `dist[u] + 1` et entre dans la file ; un sommet marqué reste dans la liste ;
- on efface les marques.

C'est exactement le parcours en largeur du cours, où l'on examine, parmi les voisins de `u` dans le complémentaire, ceux qui ne sont pas encore découverts : les distances obtenues sont donc les bonnes.

**Complexité.** Le travail sur `u` est proportionnel à son degré dans `G` plus la longueur de `restants`. Chaque sommet examiné dans `restants` est soit découvert, ce qui arrive une fois par sommet (au plus `N` fois en tout), soit gardé, ce qui n'arrive que s'il est voisin de `u` dans `G` (au plus `2M` fois en tout, une fois par extrémité d'arête). Le total est O(N + M), alors que le complémentaire a jusqu'à N(N − 1)/2 arêtes : le construire coûterait de l'ordre de 5 × 10⁹ opérations.

C'est un argument d'**analyse amortie** : un seul passage sur `restants` peut être long, mais la somme de tous les passages est bornée.
