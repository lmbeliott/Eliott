---
id: paires-de-ou-donne
title: Paires de OU donné
chapter: n4-dynamique-avancee
order: 6
tags: [programmation-dynamique, bits]
samples: 2
---

## Énoncé
On donne `N` entiers `A[1]`, …, `A[N]`, tous compris entre `0` et `65 535` (ils s'écrivent sur `16` bits). Le **OU** de deux entiers est l'entier dont chaque bit vaut `1` si ce bit vaut `1` dans au moins un des deux (opérateur `|` en Python et en C++). Par exemple, `5 | 3 = 7`, car `101 | 011 = 111` en binaire.

On donne aussi `Q` requêtes. Écris un programme qui affiche, pour chaque requête `X`, le nombre de paires d'indices `i < j` telles que `A[i] | A[j] = X`.

## Entrée
- La première ligne contient l'entier `N`.
- La deuxième ligne contient les `N` entiers `A[1]`, …, `A[N]`.
- La troisième ligne contient l'entier `Q`.
- La quatrième ligne contient les `Q` entiers `X` des requêtes.

## Sortie
`Q` lignes : pour chaque requête, dans l'ordre, le nombre de paires `i < j` telles que `A[i] | A[j] = X`.

## Contraintes
- 1 ≤ N ≤ 15 000
- 1 ≤ Q ≤ 5 000
- 0 ≤ A[i] < 65 536
- 0 ≤ X < 65 536

## Indices
1. Il est plus simple de compter les paires dont le OU est **inclus** dans `X` (tous ses bits à `1` sont aussi à `1` dans `X`) : c'est le cas exactement quand `A[i]` et `A[j]` sont tous deux inclus dans `X`. Si `F[X]` valeurs sont incluses dans `X`, il y a `F[X] × (F[X] - 1) / 2` telles paires.
2. Pour calculer `F` pour les `65 536` masques à la fois, traite les bits un par un : après l'étape du bit `b`, `F[m]` compte les valeurs qui coïncident avec `m` sur les bits au-dessus de `b`, et sont incluses dans `m` sur les bits jusqu'à `b`. L'étape consiste à faire `F[m] += F[m sans le bit b]` pour chaque `m` qui a le bit `b`.
3. On connaît maintenant `G[X]`, le nombre de paires dont le OU est inclus dans `X`. Pour garder seulement celles dont le OU vaut exactement `X`, fais la même chose à l'envers : pour chaque bit `b`, `G[m] -= G[m sans le bit b]`.

## Solution
Disons qu'un masque `y` est **inclus** dans `m` si `y | m = m`. Le OU de deux valeurs est inclus dans `m` si et seulement si les deux valeurs le sont.

**Compter les valeurs incluses.** Soit `F[m]` le nombre de valeurs `A[i]` incluses dans `m`. Le calculer en parcourant tous les sous-masques de chaque `m` coûterait 3¹⁶ ≈ 4 × 10⁷ opérations. On procède plutôt **bit par bit**, comme une programmation dynamique. Au départ, `F[m]` est le nombre de valeurs égales à `m`. Après avoir traité les bits `0` à `b`, `F[m]` compte les valeurs égales à `m` sur les bits au-dessus de `b`, et incluses dans `m` sur les bits `0` à `b`. Pour passer au bit `b`, chaque `m` qui a ce bit reçoit `F[m sans le bit b]`, c'est-à-dire les valeurs qui ont un `0` à cet endroit. Après les `16` bits, `F[m]` est bien le nombre de valeurs incluses dans `m`. Coût : 16 × 2¹⁶ ≈ 10⁶ opérations.

**Des paires « incluses » aux paires « égales ».** `G[m] = F[m] × (F[m] - 1) / 2` compte les paires dont le OU est inclus dans `m`. Notons `H[y]` le nombre de paires dont le OU vaut exactement `y`. Alors `G[m]` est la somme des `H[y]` pour `y` inclus dans `m` : c'est la même transformation que pour `F`. Pour la défaire, on reprend les bits un par un en **soustrayant** : pour chaque `m` qui a le bit `b`, `G[m] -= G[m sans le bit b]`. Chaque étape annule exactement l'étape correspondante de l'aller (les étapes portent sur des bits différents, donc l'ordre n'a pas d'importance). À la fin, `G[m] = H[m]`, et on répond à chaque requête en O(1).

Complexité : **O(N + 16 × 2¹⁶ + Q)**.

Pourquoi les idées simples échouent : essayer toutes les paires coûte N² / 2 ≈ 1,1 × 10⁸ opérations, trop pour Python. Regrouper les valeurs égales n'aide pas : un des grands tests a plus de 13 000 valeurs distinctes. Pour chaque requête, parcourir tous ses sous-masques et toutes les paires de sous-masques coûte jusqu'à 3¹⁶ opérations par requête.

Pièges :
- Une paire utilise deux indices **différents** : c'est `F × (F - 1) / 2`, pas `F²`.
- Retirer de `G[X]` seulement les `G[X sans un bit]` ne suffit pas : une paire dont le OU a deux bits de moins que `X` serait retirée deux fois. Il faut bien les `16` passes, une par bit.
- Le parcours des masques se fait sur **tous** les masques de `0` à `65 535`, même si aucune valeur n'y est égale.
