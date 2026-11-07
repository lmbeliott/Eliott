---
id: noeuds-visibles-depuis-la-gauche
title: Nœuds visibles depuis la gauche
chapter: p4-arbres-binaires
order: 2
tags: [parcours-en-largeur]
samples: 2
---

## Énoncé
Un arbre binaire a `N` nœuds, numérotés de `1` à `N`, et l'on donne les deux fils de chaque nœud. On dessine l'arbre de la façon habituelle : la racine en haut, au niveau 0, les fils d'un nœud du niveau `k` au niveau `k + 1`, le fils gauche à gauche du fils droit, et les nœuds de chaque niveau dans l'ordre de gauche à droite.

Pour chaque niveau, afficher le nœud le plus à gauche : ce sont les nœuds que voit un observateur placé à gauche de l'arbre.

## Entrée
- La première ligne contient `N`.
- La ligne `i + 1` (pour `i` de 1 à `N`) contient deux entiers `G` et `D` : les fils gauche et droit du nœud `i` (`0` si le fils n'existe pas).

Les données décrivent toujours un arbre binaire ; sa racine est le seul nœud qui n'est le fils d'aucun autre.

## Sortie
Une ligne : pour chaque niveau, du niveau 0 au plus profond, le numéro du nœud le plus à gauche de ce niveau.

## Contraintes
- 1 ≤ N ≤ 10 000

## Indices
1. Le nœud le plus à gauche d'un niveau n'est pas forcément un fils gauche : un niveau peut ne contenir que des fils droits.
2. Un parcours en largeur qui enfile toujours le fils gauche avant le fils droit visite les nœuds niveau par niveau, et chaque niveau de gauche à droite.
3. L'arbre peut avoir une hauteur de 9 999 (un chemin) : un parcours récursif risque de dépasser la profondeur autorisée, une file n'a pas ce problème.

## Solution
On trouve la racine (le seul nœud qui n'est le fils de personne), puis l'on fait un **parcours en largeur** depuis la racine, en enfilant le fils gauche puis le fils droit de chaque nœud, et en notant le niveau de chacun (celui de son père plus 1). Le premier nœud défilé de chaque niveau est le plus à gauche : on l'affiche.

**Pourquoi c'est juste.** Comme pour les distances dans un graphe, les nœuds sortent de la file par niveaux croissants. À l'intérieur d'un niveau, ils sortent de gauche à droite, par récurrence : si le niveau `k` sort de gauche à droite, ses enfants sont enfilés dans l'ordre « enfants du premier nœud (gauche puis droite), enfants du deuxième… », qui est exactement l'ordre de gauche à droite du niveau `k + 1` dans le dessin.

**Complexité.** Chaque nœud entre une fois dans la file : O(N).
