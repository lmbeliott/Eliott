---
id: sommets-a-chaque-distance
title: Sommets à chaque distance
chapter: p4-graphes
order: 1
tags: [graphes, parcours-en-largeur]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes. La **distance** d'un sommet `V` au sommet `1` est le nombre minimal d'arêtes d'un chemin qui relie `1` à `V` ; le sommet `1` est à distance `0` de lui-même.

Pour chaque distance `k` possible, compter les sommets situés à distance exactement `k` du sommet `1`, puis compter les sommets qu'aucun chemin ne relie au sommet `1`.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets (numérotés de `1` à `N`) et le nombre d'arêtes.
- Chacune des `M` lignes suivantes contient deux entiers `A` et `B` : une arête relie les sommets `A` et `B`.

Une arête peut relier un sommet à lui-même, et deux sommets peuvent être reliés par plusieurs arêtes.

## Sortie
- Sur la première ligne, `D + 1` entiers séparés par des espaces, où `D` est la plus grande distance d'un sommet relié au sommet `1` : le nombre de sommets à distance `0`, puis à distance `1`, …, puis à distance `D`.
- Sur la deuxième ligne, le nombre de sommets qu'aucun chemin ne relie au sommet `1`.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N

## Indices
1. Un parcours en largeur depuis le sommet `1` calcule la distance de chaque sommet.
2. Initialiser toutes les distances à `-1` : un sommet resté à `-1` à la fin n'est pas relié au sommet `1`.
3. Aucun nombre de la première ligne n'est nul : s'il y a un sommet à distance `k`, l'avant-dernier sommet d'un plus court chemin vers lui est à distance `k − 1`.

## Solution
On fait un **parcours en largeur** depuis le sommet `1`, avec un tableau `dist` initialisé à `-1`. Quand on défile un sommet `u`, chaque voisin `v` encore à `-1` reçoit `dist[u] + 1` et entre dans la file. Le cours montre que `dist[v]` est alors exactement la longueur d'un plus court chemin de `1` à `v`.

On compte ensuite les sommets de chaque distance dans un tableau de taille `D + 1`, et les sommets restés à `-1`. Les boucles et les arêtes multiples ne gênent pas : un voisin déjà marqué est simplement ignoré.

**Complexité.** Chaque sommet entre au plus une fois dans la file, et chaque liste de voisins est parcourue une fois : O(N + M).

**Pièges.** Ajouter chaque arête dans les deux listes (le graphe n'est pas orienté), et marquer un sommet au moment où il entre dans la file, pas quand il en sort, sinon il peut y entrer plusieurs fois.
