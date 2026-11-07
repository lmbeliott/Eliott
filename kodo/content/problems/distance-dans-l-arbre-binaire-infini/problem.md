---
id: distance-dans-l-arbre-binaire-infini
title: Distance dans l'arbre binaire infini
chapter: p4-arbres-binaires
order: 3
tags: [mathématiques, bits]
samples: 2
---

## Énoncé
Dans un arbre binaire infini, les nœuds sont numérotés à partir de 1 : la racine porte le numéro `1`, et les fils du nœud `k` sont les nœuds `2k` (à gauche) et `2k + 1` (à droite). Ainsi, la racine a pour fils 2 et 3, le nœud 2 a pour fils 4 et 5, le nœud 3 a pour fils 6 et 7, etc.

Pour chacune des `Q` paires de nœuds `(A, B)`, calculer le **plus proche ancêtre commun** de `A` et `B` (le nœud le plus profond qui est un ancêtre des deux, un nœud étant considéré comme son propre ancêtre) et le nombre d'arêtes du chemin qui relie `A` à `B` dans l'arbre.

## Entrée
- La première ligne contient `Q`.
- Chacune des `Q` lignes suivantes contient deux entiers `A` et `B`.

## Sortie
`Q` lignes : pour chaque paire, dans l'ordre, le plus proche ancêtre commun puis la distance, séparés par une espace.

## Contraintes
- 1 ≤ Q ≤ 2 000
- 1 ≤ A, B ≤ 10¹⁸

## Indices
1. Le père du nœud `k` (pour `k ≥ 2`) est `k // 2`. Un ancêtre a toujours un numéro plus petit que ses descendants.
2. Le chemin de `A` à `B` monte de `A` jusqu'au plus proche ancêtre commun, puis redescend vers `B`. Tant que `A ≠ B`, lequel des deux faut-il faire monter ?
3. En binaire, les fils de `k` s'écrivent `k` suivi de `0` ou de `1` : les ancêtres d'un nœud sont les débuts de son écriture binaire.

## Solution
Tant que `A ≠ B`, on remplace le plus grand des deux par son père (`// 2`) et l'on compte une étape. Quand ils sont égaux, on a atteint le plus proche ancêtre commun, et le nombre d'étapes est la distance.

**Pourquoi c'est juste.** Un ancêtre a un numéro plus petit que ses descendants, puisque le numéro au moins double à chaque génération. Si `A > B`, le nœud `A` n'est donc pas un ancêtre de `B` : il est strictement en dessous du plus proche ancêtre commun `C`, et l'arête de `A` vers son père fait partie du chemin de `A` à `B` (qui monte de `A` jusqu'à `C`). Chaque étape parcourt ainsi une arête du chemin, sans jamais dépasser `C`, et l'on s'arrête exactement sur `C` : le nombre d'étapes est la longueur du chemin.

**Complexité.** La profondeur d'un nœud `k` est le nombre de chiffres de `k` en binaire moins 1, au plus 59 pour `k ≤ 10¹⁸` : chaque question demande au plus 118 étapes.

**En binaire.** Le fils gauche de `k` s'écrit en ajoutant un `0` à droite de l'écriture binaire de `k`, le fils droit en ajoutant un `1`. Les ancêtres de `k` sont donc les débuts de son écriture binaire, et le plus proche ancêtre commun de `A` et `B` est le plus long début commun de leurs écritures. Par exemple 12 = `1100` et 13 = `1101` ont pour ancêtre commun `110` = 6. C'est la numérotation utilisée pour ranger un arbre binaire complet dans un tableau.
