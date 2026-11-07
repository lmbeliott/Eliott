---
id: ecart-maximal-entre-k-nombres-premiers
title: Écart maximal entre K nombres premiers
chapter: p4-synthese
order: 3
tags: [arithmétique, dichotomie, glouton, mathématiques]
samples: 2
---

## Énoncé
On veut choisir `K` nombres premiers différents compris entre `A` et `B`, de façon que le plus petit écart entre deux nombres choisis soit le plus grand possible. Afficher ce plus grand écart minimal, ou `-1` s'il y a moins de `K` nombres premiers entre `A` et `B`.

Par exemple, entre 1 et 30, avec `K = 4`, on peut choisir 2, 11, 19 et 29 : les écarts sont 9, 8 et 10, le plus petit vaut 8, et on ne peut pas faire mieux.

## Entrée
Une ligne : trois entiers `A`, `B` et `K`.

## Sortie
Un seul entier : le plus grand écart minimal possible, ou `-1`.

## Contraintes
- 1 ≤ A ≤ B ≤ 1 000 000
- 2 ≤ K ≤ 100 000

## Indices
1. Le crible d'Ératosthène donne la liste des nombres premiers entre `A` et `B`.
2. Question plus simple : peut-on choisir `K` nombres premiers avec des écarts **tous au moins** `D` ? Si oui pour `D`, alors aussi pour tout `D` plus petit : on peut chercher le plus grand `D` par dichotomie.
3. Pour un `D` fixé, un glouton suffit : prendre le plus petit nombre premier, puis à chaque fois le plus petit qui est à distance au moins `D` du dernier pris.

## Solution
On calcule les nombres premiers entre `A` et `B` avec un **crible** : O(B log log B). S'il y en a moins de `K`, la réponse est `-1`.

**Test pour un écart `D`.** On prend le plus petit nombre premier, puis, tant qu'il en faut, le plus petit nombre premier au moins égal au dernier pris plus `D` (une recherche dichotomique dans la liste triée le trouve). `D` est possible si l'on arrive à `K` nombres. *Pourquoi le glouton suffit* (argument d'échange) : soit `c₁ < c₂ < … < c_K` un choix valide quelconque et `g₁, g₂, …` les choix du glouton. Par récurrence, `g_i ≤ c_i` : c'est vrai pour `i = 1`, et si `g_i ≤ c_i`, alors `c_(i+1) ≥ c_i + D ≥ g_i + D`, donc `c_(i+1)` était un candidat pour le glouton, qui a pris le plus petit : `g_(i+1) ≤ c_(i+1)`. Le glouton ne s'arrête donc pas avant `K`.

**Dichotomie sur la réponse.** Si un choix a tous ses écarts au moins `D`, ils sont aussi au moins `D − 1` : la propriété est monotone. On cherche le plus grand `D` possible entre `1` (toujours possible quand il y a `K` nombres premiers) et `B − A`.

**Complexité.** Le crible, puis environ 20 étapes de dichotomie, chacune avec au plus `K` recherches en O(log P), où `P` est le nombre de nombres premiers (78 498 jusqu'à 10⁶). Essayer toutes les valeurs de `D` une par une avec un glouton qui parcourt la liste coûterait jusqu'à 10⁶ × 78 498 opérations.

**Pièges.** `1` n'est pas premier. Le milieu de la dichotomie se prend vers le haut (`(bas + haut + 1) / 2`) quand on garde `bas = milieu` en cas de succès, sinon la boucle ne s'arrête pas. Si `A = B`, il n'y a pas deux nombres différents : `-1`.
