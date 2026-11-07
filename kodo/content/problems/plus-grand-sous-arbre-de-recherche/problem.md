---
id: plus-grand-sous-arbre-de-recherche
title: Plus grand sous-arbre de recherche
chapter: p4-arbres-binaires
order: 8
synthesis: true
tags: [parcours-en-largeur]
samples: 2
---

## Énoncé
Un arbre binaire a `N` nœuds, numérotés de `1` à `N` ; chaque nœud porte une clé entière. Le **sous-arbre** d'un nœud `v` est formé de `v` et de tous ses descendants. Il est un **arbre binaire de recherche** si, pour chacun de ses nœuds `w`, les clés du sous-arbre gauche de `w` sont strictement plus petites que celle de `w`, et celles du sous-arbre droit strictement plus grandes.

Calculer le plus grand nombre de nœuds d'un sous-arbre qui est un arbre binaire de recherche.

## Entrée
- La première ligne contient `N`.
- La ligne `i + 1` (pour `i` de 1 à `N`) contient trois entiers `K`, `G` et `D` : la clé du nœud `i`, puis ses fils gauche et droit (`0` si le fils n'existe pas).

Les données décrivent toujours un arbre binaire ; sa racine est le seul nœud qui n'est le fils d'aucun autre.

## Sortie
Un seul entier : la taille du plus grand sous-arbre qui est un arbre binaire de recherche.

## Contraintes
- 1 ≤ N ≤ 5 000
- −10⁹ ≤ K ≤ 10⁹

## Indices
1. Tester chaque sous-arbre séparément coûte O(N) par sous-arbre, donc O(N²) sur un arbre en forme de chemin. On peut tout calculer en un seul passage, des feuilles vers la racine.
2. Le sous-arbre de `v` est un arbre binaire de recherche si et seulement si ses deux sous-arbres en sont, que la plus grande clé à gauche est plus petite que la clé de `v`, et que la plus petite clé à droite est plus grande. Que faut-il donc retenir pour chaque sous-arbre ?
3. Pour traiter les fils avant leur père sans récursion, parcourir l'ordre d'un parcours en largeur à l'envers.

## Solution
Pour chaque nœud `v`, on calcule quatre informations sur son sous-arbre : est-ce un arbre binaire de recherche (`abr[v]`), sa taille, sa plus petite clé et sa plus grande clé. L'arbre vide (indice 0) est un arbre de recherche de taille 0, de plus petite clé `+∞` et de plus grande clé `−∞`. Si `g` et `d` sont les fils de `v` :
- `taille[v] = taille[g] + taille[d] + 1` ;
- `mini[v] = min(mini[g], cle[v])` et `maxi[v] = max(maxi[d], cle[v])` ;
- `abr[v]` est vrai si et seulement si `abr[g]` et `abr[d]` sont vrais et `maxi[g] < cle[v] < mini[d]`.

La réponse est la plus grande `taille[v]` parmi les nœuds où `abr[v]` est vrai ; elle vaut au moins 1, car une feuille est toujours un arbre de recherche.

**Correction.** Par la définition, le sous-arbre de `v` est un arbre de recherche si et seulement si la condition est vraie en chaque nœud de ce sous-arbre. Pour les nœuds autres que `v`, c'est exactement « les sous-arbres de `g` et de `d` sont des arbres de recherche ». Pour `v` lui-même, toutes les clés de gauche doivent être plus petites que `cle[v]`, ce qui revient à comparer la plus grande d'entre elles, `maxi[g]`, et de même à droite avec `mini[d]`. Les formules de `mini` et `maxi` utilisent le fait que les deux sous-arbres sont des arbres de recherche (dans le cas contraire, ces valeurs ne servent plus). C'est un raisonnement par récurrence sur la taille du sous-arbre, comme pour les parcours suffixes : chaque nœud est traité après ses deux fils.

**Ordre de traitement.** L'arbre peut être un chemin de 5 000 nœuds : on évite la récursion. Un parcours en largeur depuis la racine range chaque père avant ses fils ; en parcourant cette liste à l'envers, chaque nœud est traité après ses fils.

**Complexité.** O(N), au lieu de O(N²) pour un test séparé de chaque sous-arbre.
