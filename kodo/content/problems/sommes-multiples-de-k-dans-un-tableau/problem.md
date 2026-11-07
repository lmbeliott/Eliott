---
id: sommes-multiples-de-k-dans-un-tableau
title: Sommes multiples de K dans un tableau
chapter: p3-tableaux-avances
order: 4
tags: [listes, mathématiques]
samples: 2
---

## Énoncé
Un tableau de `N` entiers positifs ou nuls et un entier `K` sont donnés. Compter les paires de positions `(i, j)` avec `i < j` telles que la somme des deux valeurs soit un multiple de `K`.

Par exemple, avec `K = 5` et le tableau `1 4 6 9 5`, les paires qui conviennent sont `1 + 4`, `1 + 9`, `4 + 6` et `6 + 9` : il y en a 4.

## Entrée
- La première ligne contient `N` et `K`.
- La deuxième ligne contient les `N` entiers.

## Sortie
Le nombre de paires.

## Contraintes
- 1 ≤ N ≤ 20 000
- 1 ≤ K ≤ 1 000 000
- Les valeurs sont comprises entre 0 et 1 000 000.

## Indices
1. Le reste de `a + b` dans la division par `K` ne dépend que des restes de `a` et de `b`.
2. Si `a` a pour reste `r`, quels restes `b` peut-il avoir pour que `a + b` soit un multiple de `K` ? Attention au cas `r = 0`.
3. Un tableau de comptage `cpt` de `K` cases, où `cpt[r]` est le nombre de valeurs déjà lues de reste `r`, permet de compter les paires en un seul passage.

## Solution
La somme `a + b` est un multiple de `K` exactement quand `(a % K + b % K) % K` vaut 0, c'est-à-dire quand le reste de `b` vaut `(K − a % K) % K`. Ce reste « complémentaire » vaut 0 si le reste de `a` est 0, et `K − r` sinon. Les valeurs elles-mêmes importent peu : seuls leurs restes comptent.

On parcourt le tableau une fois en tenant à jour un tableau de comptage `cpt` de `K` cases : `cpt[r]` est le nombre de valeurs **déjà lues** dont le reste vaut `r`. Pour chaque nouvelle valeur `x`, de reste `r = x % K`, on ajoute au total `cpt[(K − r) % K]`, le nombre de partenaires possibles lus avant elle, **puis** on augmente `cpt[r]` de 1. Chaque paire `(i, j)` est comptée exactement une fois, au moment où l'on lit la valeur d'indice `j`. L'ordre des deux opérations compte : dans l'autre ordre, une valeur de reste 0 (ou de reste `K / 2`) formerait une paire avec elle-même.

Coût : un passage sur le tableau, avec un nombre constant d'opérations par valeur, plus la création du tableau de `K` cases. Essayer les `N × (N − 1) / 2` paires en demanderait 200 millions.
