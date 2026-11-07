---
id: rendre-deux-mots-identiques
title: Rendre deux mots identiques
chapter: p4-plus-courts-chemins
order: 3
tags: [graphes, chaînes]
samples: 2
---

## Énoncé
On dispose de `M` règles de remplacement. La règle `X Y C` permet de remplacer **une** lettre `X` par la lettre `Y`, pour un coût `C` ; elle ne permet pas de remplacer `Y` par `X`. Les règles s'appliquent autant de fois qu'on le souhaite, à n'importe quelle position, dans l'un ou l'autre de deux mots `S` et `T` de même longueur.

Afficher le coût total minimal pour rendre les deux mots identiques, ou `-1` si c'est impossible.

## Entrée
- La première ligne contient `M`.
- Chacune des `M` lignes suivantes contient une règle : deux lettres `X` et `Y` et un entier `C`.
- Les deux lignes suivantes contiennent les mots `S` et `T`.

## Sortie
Un seul entier : le coût minimal, ou `-1`.

## Contraintes
- 0 ≤ M ≤ 1 000
- 1 ≤ C ≤ 10⁶
- `S` et `T` ont la même longueur, entre 1 et 50 000
- toutes les lettres sont des minuscules de `a` à `z`

## Indices
1. Les positions sont indépendantes. Pour une position, on peut transformer les deux lettres en une même troisième lettre : dans le premier exemple, `a` et `c` deviennent toutes deux `b`.
2. Il faut connaître le coût minimal pour transformer chaque lettre en chaque autre, en enchaînant des règles. Le graphe n'a que 26 sommets.
3. Avec Floyd-Warshall, on obtient `d[x][y]` pour toutes les paires. Le coût d'une position où se trouvent `a` et `b` est le minimum sur `z` de `d[a][z] + d[b][z]`.

## Solution
On voit les lettres comme les 26 sommets d'un graphe orienté : la règle `X Y C` est un arc de `X` vers `Y` de longueur `C`. Transformer `x` en `y` par une suite de règles coûte au minimum `d[x][y]`, la distance de `x` à `y` (et `d[x][x] = 0`). Avec 26 sommets, **Floyd-Warshall** calcule toutes ces distances en 26³ ≈ 17 600 étapes.

À une position où `S` porte `a` et `T` porte `b`, les deux lettres doivent finir égales à une même lettre `z` ; transformer `a` en `z` et `b` en `z` sont deux tâches indépendantes, de coûts minimaux `d[a][z]` et `d[b][z]`. Le coût de la position est donc `e[a][b] = min sur z de d[a][z] + d[b][z]` (avec `z = a` ou `z = b`, on retrouve le fait de transformer une seule des deux lettres). On précalcule `e` pour les 676 paires, puis on additionne sur les positions ; si une position a un coût infini, la réponse est `-1`.

**Complexité.** 26³ pour Floyd-Warshall et pour la table `e`, puis O(L) pour la somme. Recalculer des plus courts chemins à chaque position serait des dizaines de milliers de fois plus long.

**Pièges.** Il n'y a pas que `d[a][b]` et `d[b][a]` : se rejoindre sur une troisième lettre peut coûter moins cher, ou être la seule possibilité (premier exemple). Les règles sont orientées et peuvent être répétées avec des coûts différents : garder le plus petit. La réponse atteint 50 000 × 25 × 10⁶ : il faut des `long long`, et un « infini » qui ne déborde pas quand on additionne deux valeurs infinies.
