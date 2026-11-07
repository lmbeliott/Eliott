---
id: portions-de-somme-divisible-par-k
title: Portions de somme divisible par K
chapter: p3-balayages
order: 6
tags: [sommes-préfixes, dictionnaires, mathématiques]
samples: 2
---

## Énoncé
Une suite de `N` entiers `A₁, …, A_N`, positifs ou négatifs, et un entier `K ≥ 1` sont donnés. Compter les **portions** `Aₗ, …, Aᵣ` (avec `l ≤ r`) dont la somme est divisible par `K`. Une somme nulle est divisible par `K`.

Par exemple, avec `K = 3` et la suite `1 2 3`, les portions `1 2`, `3` et `1 2 3` conviennent : la réponse est 3.

## Entrée
La première ligne contient `N` et `K`. La deuxième ligne contient `A₁, …, A_N`, séparés par des espaces.

## Sortie
Un seul entier : le nombre de portions.

## Contraintes
- 1 ≤ N ≤ 25 000
- 1 ≤ K ≤ 10⁹
- -999 ≤ Aᵢ ≤ 999

## Indices
1. Il y a N × (N + 1) / 2 portions, plus de 300 millions : trop pour les examiner une à une.
2. Avec les sommes préfixes `P[0] = 0`, `P[i] = A₁ + … + Aᵢ`, la somme de la portion `[l, r]` vaut `P[r] − P[l − 1]`. Quand une différence est-elle divisible par `K` ?
3. `P[r] − P[l − 1]` est divisible par `K` exactement quand `P[r]` et `P[l − 1]` ont le même reste dans la division par `K`. Compter, pour chaque reste, combien de préfixes l'ont déjà.

## Solution
Avec les sommes préfixes `P[0] = 0` et `P[i] = P[i − 1] + Aᵢ`, la portion `[l, r]` a pour somme `P[r] − P[l − 1]`. Deux entiers ont une différence divisible par `K` si et seulement s'ils ont le même reste dans la division par `K`. Les portions cherchées correspondent donc exactement aux paires d'indices `j < i` (avec `j = l − 1` et `i = r`, entre 0 et `N`) tels que `P[j]` et `P[i]` ont le même reste.

On parcourt `i = 0, 1, …, N` en calculant `P[i]` au fur et à mesure et en tenant un dictionnaire `vus` : `vus[c]` est le nombre d'indices `j < i` dont le reste vaut `c`. Pour chaque `i`, on ajoute `vus[reste de P[i]]` à la réponse, puis on augmente ce compteur de 1. Il ne faut pas oublier `P[0] = 0`, qui compte pour les portions qui commencent en position 1.

**Les restes négatifs.** Les sommes peuvent être négatives. En Python, `x % K` est toujours entre 0 et `K − 1`. En C++, `x % K` est négatif quand `x` l'est : `-7 % 3` vaut `-1`, alors que le reste mathématique est 2. On écrit donc `((x % K) + K) % K`. Sans cette correction, `-1` et `2` seraient comptés comme deux restes différents.

**Coût.** Un passage, avec une opération de dictionnaire par indice : environ N opérations, au lieu de N² / 2. La réponse peut dépasser 3 × 10⁸ : `long long` en C++. Remarque : s'il y a plus d'indices que de restes possibles (`N + 1 > K`), deux préfixes ont forcément le même reste, donc la réponse est au moins 1 : c'est le **principe des tiroirs**.
