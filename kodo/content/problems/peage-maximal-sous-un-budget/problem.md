---
id: peage-maximal-sous-un-budget
title: Péage maximal sous un budget
chapter: p4-synthese
order: 4
tags: [graphes, dijkstra, dichotomie]
samples: 2
---

## Énoncé
Un réseau a `N` villes et `M` routes à double sens. Chaque route a une longueur et un péage. On veut aller de la ville `1` à la ville `N` en parcourant une longueur totale d'au plus `B`, et l'on souhaite que le **plus grand péage** payé sur une route du trajet soit le plus petit possible.

Afficher ce plus petit péage maximal, ou `-1` si aucun trajet ne respecte la limite de longueur. Si `N = 1`, le trajet est vide et la réponse est `0`.

## Entrée
- La première ligne contient `N`, `M` et `B`.
- Chacune des `M` lignes suivantes contient quatre entiers `A`, `C`, `L` et `T` : une route relie `A` et `C`, de longueur `L` et de péage `T`.

## Sortie
Un seul entier : le plus petit péage maximal possible, ou `-1`.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ M ≤ 6 000
- 1 ≤ A, C ≤ N
- 1 ≤ L, T ≤ 10⁶
- 1 ≤ B ≤ 10¹²

## Indices
1. Question plus simple : en n'utilisant que les routes de péage au plus `S`, peut-on aller de `1` à `N` avec une longueur au plus `B` ? C'est un plus court chemin.
2. Si c'est possible pour `S`, c'est possible pour tout seuil plus grand : on peut chercher le plus petit `S` par dichotomie.
3. La réponse est forcément l'un des péages : il suffit de chercher parmi les péages triés, soit une quinzaine d'exécutions de Dijkstra.

## Solution
**Test pour un seuil.** Pour un seuil `S`, on ne garde que les routes de péage au plus `S` et l'on calcule avec **Dijkstra** la plus courte longueur de `1` à `N`. Le seuil convient si elle vaut au plus `B` : un trajet qui n'utilise que ces routes a un péage maximal au plus `S`, et réciproquement tout trajet de péage maximal au plus `S` n'utilise que ces routes.

**Dichotomie sur la réponse.** Augmenter `S` ne fait qu'ajouter des routes, donc ne peut pas allonger le plus court chemin : la propriété « `S` convient » est monotone. La réponse est le plus petit seuil qui convient ; c'est le péage d'une route du trajet, donc l'un des `T`. On trie les péages distincts et l'on cherche par dichotomie le premier qui convient. Si même le plus grand ne convient pas, la réponse est `-1`.

**Complexité.** O(log M) exécutions de Dijkstra, chacune en O((N + M) log N). Essayer tous les péages un par un coûterait `M` exécutions de Dijkstra, soit 6 000 au lieu de 13.

**Pièges.** Minimiser d'abord la longueur ne marche pas : le plus court trajet peut emprunter une route au péage énorme alors qu'un trajet un peu plus long, encore dans le budget, évite tous les gros péages (premier exemple : le trajet le plus court a un péage 5, le trajet `1 – 3 – 4`, de longueur 11, un péage 2). Minimiser seulement le péage maximal ne marche pas non plus : le trajet obtenu peut dépasser le budget (la route directe `1 – 4`, de péage 1, mesure 20). Les longueurs se cumulent jusqu'à 10¹⁰ : `long long` en C++. Pour `N = 1`, la réponse est `0`.
