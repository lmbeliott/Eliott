---
id: retourner-des-portions
title: Retourner des portions
chapter: p2-tableaux
order: 3
tags: [listes, simulation]
samples: 2
---

## Énoncé
On applique `M` opérations à une suite de `N` entiers, dont les positions sont numérotées de 1 à `N`. L'opération `L R` retourne la portion qui va de la position `L` à la position `R` : ses éléments sont remis dans l'ordre inverse, le reste ne bouge pas. Afficher la suite après les `M` opérations, appliquées dans l'ordre.

Par exemple, l'opération `2 4` transforme `1 2 3 4 5` en `1 4 3 2 5`.

## Entrée
La première ligne contient `N` et `M`. La deuxième ligne contient les `N` entiers de la suite. Chacune des `M` lignes suivantes contient une opération : deux entiers `L` et `R`.

## Sortie
Une seule ligne avec les `N` entiers de la suite finale, séparés par des espaces.

## Contraintes
- 1 ≤ N ≤ 1 000
- 1 ≤ M ≤ 1 000
- 1 ≤ L ≤ R ≤ N
- Chaque entier de la suite est compris entre −10⁹ et 10⁹.

## Indices
1. Les positions de l'énoncé commencent à 1, les indices du tableau à 0 : la position `L` correspond à l'indice `L - 1`.
2. Pour retourner une portion, on échange ses deux extrémités, puis on rapproche les deux indices d'un cran, et on recommence.
3. Avec deux indices `i = L - 1` et `j = R - 1` : tant que `i < j`, échanger `t[i]` et `t[j]`, puis `i` augmente et `j` diminue.

## Solution
Chaque opération se fait sur place, avec des échanges. On place un indice `i` au début de la portion (`L − 1`) et un indice `j` à la fin (`R − 1`). Tant que `i < j`, on échange `t[i]` et `t[j]`, puis on avance `i` et on recule `j`. Quand les deux indices se croisent ou se rejoignent, la portion est retournée : l'élément du milieu, s'il existe, n'a pas à bouger.

Les pièges : oublier le décalage entre positions (à partir de 1) et indices (à partir de 0), et continuer les échanges au-delà du milieu, ce qui remettrait la portion dans son ordre de départ. Chaque opération fait au plus `N / 2` échanges, soit au plus 500 000 échanges en tout : c'est rapide.
