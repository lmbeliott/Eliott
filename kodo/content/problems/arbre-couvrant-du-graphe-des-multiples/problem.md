---
id: arbre-couvrant-du-graphe-des-multiples
title: Arbre couvrant du graphe des multiples
chapter: p4-synthese
order: 9
tags: [union-find, arithmétique, mathématiques]
samples: 2
---

## Énoncé
Les sommets d'un graphe sont les entiers de `1` à `N`. Pour tout entier `a` et tout entier `k ≥ 2` tels que `k × a ≤ N`, une arête de poids `k` relie `a` et `k × a`.

Afficher le poids d'un arbre couvrant de poids minimal de ce graphe.

Par exemple, pour `N = 6`, on peut garder `1 – 2`, `2 – 4` et `3 – 6` (poids 2), `1 – 3` (poids 3) et `1 – 5` (poids 5) : le poids total est 14.

## Entrée
Une ligne : l'entier `N`.

## Sortie
Un seul entier : le poids minimal d'un arbre couvrant.

## Contraintes
- 1 ≤ N ≤ 2 000 000

## Indices
1. Le graphe a environ `N ln N` arêtes, soit environ 27 millions pour `N = 2 × 10⁶` : Kruskal sur toutes les arêtes est trop lent. Calculer la réponse à la main ou avec Kruskal pour de petits `N` aide à deviner une formule.
2. Une arête de poids composé `k = u × v` (avec `u, v ≥ 2`) est la plus lourde d'un cycle : `a → u a → u v a`. Seuls comptent les poids premiers.
3. Chaque entier `r ≥ 2` peut être relié à `r / p`, où `p` est son plus petit facteur premier, par une arête de poids `p`. Cet arbre est minimal : la réponse est la somme des plus petits facteurs premiers de `2, 3, …, N`, qu'un crible calcule.

## Solution
**Un candidat.** Pour chaque `r` de `2` à `N`, notons `ppf(r)` son plus petit facteur premier, et relions `r` à `r / ppf(r)` par l'arête de poids `ppf(r)`. Chaque `r ≥ 2` est relié à un entier plus petit : en suivant ces arêtes on descend jusqu'à `1`. Ces `N − 1` arêtes forment donc un arbre couvrant, de poids `ppf(2) + ppf(3) + … + ppf(N)`.

**Il est minimal.** Pour un entier `t ≥ 2`, notons `c(t)` le nombre de composantes du graphe réduit aux arêtes de poids `< t`. Tout arbre couvrant doit relier ces `c(t)` composantes, donc contient au moins `c(t) − 1` arêtes de poids `≥ t`. Or le poids d'un arbre est la somme, sur `t = 1, 2, 3, …`, du nombre de ses arêtes de poids au moins `t` (une arête de poids `w` est comptée `w` fois). Il suffit donc de montrer que notre arbre a **exactement** `c(t) − 1` arêtes de poids `≥ t` pour chaque `t`.

Écrivons `r = s × u`, où `s` n'a que des facteurs premiers `< t` et `u` que des facteurs premiers `≥ t`. Une arête de poids `k < t` relie `a` et `k a`, qui ont la même partie `u` puisque `k` n'a que des facteurs `< t`. Réciproquement, `r` est relié à `u` en divisant par les facteurs premiers de `s` un par un (des arêtes de poids `< t`). Les composantes correspondent donc aux valeurs possibles de `u` : `c(t)` est le nombre d'entiers `u ≤ N` dont tous les facteurs premiers sont `≥ t` (y compris `u = 1`). Les arêtes de notre arbre de poids `≥ t` sont celles des `r ≥ 2` tels que `ppf(r) ≥ t`, c'est-à-dire des `r ≥ 2` dont tous les facteurs premiers sont `≥ t` : il y en a exactement `c(t) − 1`.

**Calcul.** Un crible calcule `ppf(r)` pour tout `r ≤ N`, comme dans le chapitre d'arithmétique : pour chaque `p` premier tel que `p² ≤ N`, on parcourt les multiples de `p` à partir de `p²` et l'on note `p` chez ceux qui n'ont pas encore de facteur. Les nombres restés sans facteur sont premiers : ils sont leur propre plus petit facteur. Il reste à tout additionner.

**Complexité.** O(N log log N). Le résultat dépasse 10¹¹ pour `N = 2 × 10⁶` : `long long` en C++.

**Pièges.** Pour `N = 1`, l'arbre est vide : `0`. Kruskal sur toutes les arêtes, même limité aux poids premiers, demande des millions d'opérations Union-Find (près de 6 millions d'arêtes de poids premier) : beaucoup trop en Python.
