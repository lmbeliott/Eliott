---
id: paires-de-valeurs-egales
title: Paires de valeurs égales
chapter: p2-tableaux
order: 6
tags: [listes, mathématiques]
samples: 2
---

## Énoncé
Compter les paires de positions `(i, j)`, avec `i < j`, qui portent la même valeur dans une suite de `N` entiers.

Par exemple, dans `5 3 5 5 3`, la valeur 5 forme 3 paires et la valeur 3 en forme 1 : la réponse est 4.

## Entrée
La première ligne contient l'entier `N`. La deuxième ligne contient les `N` entiers, séparés par des espaces.

## Sortie
Un seul entier : le nombre de paires de positions de même valeur.

## Contraintes
- 1 ≤ N ≤ 30 000
- Chaque entier est compris entre 1 et 1 000.

## Indices
1. Comparer toutes les paires avec deux boucles imbriquées demande environ `N × N / 2` comparaisons, soit 450 millions : bien trop lent en Python.
2. Seul compte le nombre d'apparitions de chaque valeur. Combien de paires forment `c` éléments égaux ?
3. Autre méthode, en un seul parcours : quand on rencontre une valeur `x`, elle forme une paire avec chacune des apparitions précédentes de `x`. On ajoute donc `cpt[x]` à la réponse, puis on augmente `cpt[x]`.

## Solution
On utilise un tableau de comptage `cpt` de 1 001 cases. On parcourt la suite une seule fois. Pour chaque valeur `x`, la nouvelle apparition forme une paire avec chacune des `cpt[x]` apparitions déjà vues : on ajoute `cpt[x]` à la réponse, puis on fait `cpt[x] = cpt[x] + 1`. Chaque paire `(i, j)` est comptée exactement une fois, au moment où l'on rencontre `j`.

On peut aussi compter d'abord, puis utiliser une formule : une valeur qui apparaît `c` fois forme `c × (c − 1) / 2` paires, car chacune des `c` apparitions s'associe aux `c − 1` autres, et chaque paire est alors comptée deux fois. Les deux méthodes donnent 1 + 2 = 3 paires pour trois 5 : 0 + 1 + 2 avec la première, 3 × 2 / 2 avec la seconde.

La réponse peut atteindre 30 000 × 29 999 / 2, environ 4,5 × 10⁸ : cela tient dans un `int`, mais un `long long` évite toute inquiétude.
