---
id: crue-du-torrent
title: La crue du torrent
chapter: n4-graphes
order: 4
tags: [graphes, parcours-en-largeur, grilles]
samples: 2
---

## Énoncé
Un orage violent fait déborder le torrent de Valcorde alors que Théo cueille des myrtilles dans le vallon. L'eau envahit le vallon case par case, et Théo doit se mettre à l'abri dans un refuge avant d'être rattrapé. Les refuges sont bâtis sur des rochers : l'eau n'y entre jamais.

Le vallon est une grille. À la minute `0`, l'eau couvre exactement les cases sources et Théo est sur sa case de départ. Ensuite, chaque minute :
- l'eau s'étend de chaque case inondée à ses cases voisines (haut, bas, gauche, droite), sauf les rochers et les refuges ;
- Théo se déplace obligatoirement vers une case voisine, qui n'est pas un rocher.

Théo peut entrer dans un refuge à n'importe quelle minute. Il ne peut entrer dans une autre case à la minute `t` que si l'eau l'atteint **strictement après** la minute `t` (ou ne l'atteint jamais).

Écris un programme qui calcule la première minute à laquelle Théo peut entrer dans un refuge, ou affiche `-1` s'il ne peut en atteindre aucun.

## Entrée
- La première ligne contient deux entiers `R` et `C` : le nombre de lignes et de colonnes.
- Les `R` lignes suivantes contiennent chacune `C` caractères : `.` pour une case libre, `#` pour un rocher, `E` pour une source d'eau, `R` pour un refuge et `T` pour la case de départ de Théo.

La carte contient exactement un `T` et au moins un `R`. Elle peut ne contenir aucun `E`.

## Sortie
Un seul entier : la première minute à laquelle Théo entre dans un refuge, ou `-1` si c'est impossible.

## Contraintes
- 1 ≤ R, C ≤ 300

## Indices
1. Le trajet de l'eau ne dépend pas de Théo. Commence par calculer, pour chaque case, la minute où l'eau l'atteint.
2. Ce calcul est un parcours en largeur qui part de toutes les sources à la fois. Les rochers et les refuges l'arrêtent.
3. Fais ensuite un parcours en largeur depuis Théo : depuis une case atteinte à la minute `t`, une voisine peut être atteinte à la minute `t + 1` seulement si c'est un refuge, ou si l'eau y arrive strictement après `t + 1`.

## Solution
Le déplacement de l'eau ne dépend pas de Théo : on le calcule d'abord. Un **parcours en largeur à sources multiples**, qui part de toutes les cases `E` à la minute `0` et ne traverse ni rochers ni refuges, donne pour chaque case la minute `eau[x]` où elle est inondée (l'infini si elle ne l'est jamais).

On fait ensuite un **second parcours en largeur**, depuis la case de Théo. Quand on retire de la file une case atteinte à la minute `t`, chaque voisine `v` qui n'est pas un rocher et pas encore atteinte peut l'être à la minute `t + 1` :
- si `v` est un refuge, la réponse est `t + 1` : le parcours en largeur traite les cases par minutes croissantes, donc c'est la première minute possible ;
- sinon, `v` est atteinte seulement si `t + 1 < eau[v]`.

Pourquoi garder pour chaque case la **première** minute d'arrivée suffit : arriver plus tôt dans une case n'est jamais un désavantage, puisque la contrainte « arriver avant l'eau » est d'autant plus facile à respecter qu'on arrive tôt. Pour la même raison, Théo n'aurait jamais intérêt à attendre sur place.

Les deux parcours coûtent **O(R × C)**. Simuler minute par minute l'eau et l'ensemble des positions possibles de Théo coûterait O(R × C) **par minute**, et la réponse peut dépasser 40 000 minutes dans un long couloir : beaucoup trop lent.

Pièges :
- L'inégalité est **stricte** : si Théo et l'eau arrivent dans une case à la même minute, Théo ne peut pas y entrer.
- Les refuges arrêtent l'eau : ils ne doivent pas propager l'inondation.
- Une case jamais inondée doit avoir une valeur plus grande que toutes les minutes possibles (un grand nombre), pas `-1`.
