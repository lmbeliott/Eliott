---
id: plus-grand-pgcd-de-parts-croissantes
title: Plus grand PGCD de parts croissantes
chapter: p4-synthese
order: 1
tags: [arithmétique, mathématiques, glouton]
samples: 2
---

## Énoncé
On veut écrire l'entier `N` comme une somme de `K` entiers strictement positifs **tous différents**, `a₁ < a₂ < … < a_K`, de façon que leur PGCD soit le plus grand possible. Afficher ce plus grand PGCD, ou `-1` si une telle écriture n'existe pas.

Par exemple, `24 = 4 + 8 + 12` a un PGCD égal à 4, et aucune écriture de 24 en trois parts différentes ne fait mieux.

## Entrée
Une ligne : deux entiers `N` et `K`.

## Sortie
Un seul entier : le plus grand PGCD possible, ou `-1`.

## Contraintes
- 1 ≤ N ≤ 10¹²
- 1 ≤ K ≤ 10⁹

## Indices
1. Si toutes les parts sont multiples de `g`, alors `g` divise `N`. La réponse est donc un diviseur de `N`.
2. Les parts `a_i = g × b_i` avec des `b_i` différents et positifs : la somme des `b_i` vaut au moins `1 + 2 + … + K`. Réciproquement, si `N / g` atteint cette valeur, peut-on toujours construire les parts ?
3. Parcourir les diviseurs de `N` par paires `(d, N / d)` avec `d ≤ √N`, et garder le plus grand `g` tel que `N / g ≥ K (K + 1) / 2`.

## Solution
Soit `S = K (K + 1) / 2 = 1 + 2 + … + K`.

**Condition nécessaire.** Si les parts ont pour PGCD `g`, on écrit `a_i = g × b_i` avec `b₁ < b₂ < … < b_K` entiers positifs. Alors `g` divise `N`, et `N / g = b₁ + … + b_K ≥ 1 + 2 + … + K = S`, puisque `b_i ≥ i`.

**Condition suffisante.** Si `g` divise `N` et `N / g ≥ S`, les parts `g, 2g, …, (K − 1) g` et `g × (N / g − (K − 1) K / 2)` conviennent : la dernière vaut au moins `K g` (car `N / g ≥ S`), donc elles sont strictement croissantes, elles somment à `N`, et leur PGCD est un multiple de `g`. Construction gloutonne : les `K − 1` premières parts les plus petites possible, le reste dans la dernière.

La réponse est donc le plus grand diviseur `g` de `N` tel que `N / g ≥ S`, ou `-1` s'il n'y en a pas (c'est-à-dire si `S > N`). On énumère les diviseurs en testant `d` de `1` à `√N` : chaque `d` qui divise `N` donne les deux diviseurs `d` et `N / d`.

**Complexité.** O(√N), soit un million de divisions pour `N = 10¹²`. Essayer tous les `g` de `1` à `N` serait un million de fois plus long.

**Pièges.** `S` dépasse 10¹⁷ pour `K = 10⁹`, et le produit `g × S` peut dépasser la capacité d'un `long long` : on compare plutôt `N / g` à `S`. Pour `K = 1`, la réponse est `N`. N'oublier aucun des deux diviseurs `d` et `N / d`.
