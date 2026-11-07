---
id: trier-en-deplacant-a-la-fin
title: Trier en déplaçant à la fin
chapter: n2-trier-compter
order: 8
tags: [tri, dictionnaires]
samples: 2
---

## Énoncé
On te donne une liste de `N` entiers. Une **opération** consiste à prendre un élément de la liste, n'importe lequel, et à le déplacer tout à la fin. Par exemple, une opération sur le `3` de la liste `3 1 2 4` donne `1 2 4 3`.

Écris un programme qui affiche le nombre minimum d'opérations pour que la liste soit triée dans l'ordre croissant. Les valeurs peuvent se répéter : une liste comme `1 1 2 2 3` est triée.

## Entrée
- La première ligne contient l'entier `N`.
- La deuxième ligne contient `N` entiers séparés par des espaces.

## Sortie
Un seul entier : le nombre minimum d'opérations.

## Contraintes
- 1 ≤ N ≤ 20 000
- Chaque entier est compris entre 1 et 1 000 000.

## Indices
1. Regarde plutôt les éléments qui ne sont **jamais** déplacés : ils restent au début de la liste, dans leur ordre de départ, et tous les éléments déplacés arrivent derrière eux. On peut toujours choisir l'ordre des opérations pour que les éléments déplacés arrivent triés. Il faut donc garder le plus d'éléments possible.
2. Les éléments gardés doivent être déjà dans l'ordre croissant, et aucun ne peut être plus grand qu'un élément déplacé. Si une copie de la valeur `v` est déplacée, aucune valeur plus grande que `v` ne peut donc être gardée ; et toutes les valeurs plus petites que `v` doivent être gardées en entier.
3. Trie les valeurs différentes et parcours-les dans l'ordre croissant, en retenant la dernière position des éléments gardés jusqu'ici. Si toutes les copies de la valeur suivante sont après cette position, garde-les toutes. Sinon, garde seulement les copies placées après cette position, et arrête-toi.

## Solution
**Changer de point de vue.** Au lieu de chercher les éléments à déplacer, on cherche ceux qui restent sur place. Les éléments jamais déplacés se retrouvent au début de la liste finale, dans leur ordre de départ, et les éléments déplacés sont derrière eux, dans l'ordre où on les a déplacés. Comme on choisit cet ordre, on peut les déplacer du plus petit au plus grand : ils arrivent triés. La réponse est donc `N` moins le plus grand nombre d'éléments qu'on peut garder.

**Quels éléments garder ?** La liste finale est triée si et seulement si :
- les éléments gardés sont dans l'ordre croissant dans la liste de départ ;
- aucun élément gardé n'est plus grand qu'un élément déplacé.

La deuxième condition donne la forme des éléments gardés : toutes les copies des plus petites valeurs, puis éventuellement une partie des copies de la valeur suivante, et rien au-delà.

**L'algorithme.** On regroupe les positions de chaque valeur avec un dictionnaire, puis on parcourt les valeurs différentes dans l'ordre croissant, en retenant `fin`, la dernière position des éléments gardés jusqu'ici (au départ, `-1`). Pour la valeur `v` :
- si sa première position est après `fin`, toutes ses copies peuvent rester : on les garde, et `fin` devient la dernière position de `v` ;
- sinon, une copie de `v` est avant `fin` et doit partir. On garde quand même les copies de `v` placées après `fin` (une valeur égale peut rester devant une copie déplacée de `v`), puis on s'arrête : plus rien ne peut être gardé.

Dans le deuxième exemple, `1 3 2 1 2 2` : les deux `1` (positions 0 et 3) sont gardés, `fin = 3`. Le premier `2` est en position 2, avant `fin` : on garde les deux `2` des positions 4 et 5, et on s'arrête. On garde 4 éléments, il faut 6 - 4 = 2 opérations : déplacer le `2` de la position 2, puis le `3`.

**Les pièges.**
- La plus longue sous-suite croissante ne donne pas la réponse : dans `2 3 1`, `2 3` est déjà dans l'ordre, mais il faut 2 opérations, car le `1` ne peut pas revenir devant.
- Déplacer les éléments qui ne sont pas à leur place dans la liste triée ne marche pas non plus : dans `3 1 2 4`, seul le `4` est à sa place, et pourtant 2 opérations suffisent.
- Avec des valeurs répétées, il ne faut pas s'arrêter trop tôt : les copies de `v` placées après `fin` restent gardées.

Le tri des valeurs différentes prend l'essentiel du temps ; chaque position n'est ensuite regardée qu'une fois.
