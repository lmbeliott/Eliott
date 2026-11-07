---
id: montants-payables-avec-des-pieces
title: Montants payables avec des pièces
chapter: p4-plus-courts-chemins
order: 7
tags: [graphes, dijkstra, mathématiques]
samples: 2
---

## Énoncé
On dispose de `K` sortes de pièces, de valeurs `A₁, …, A_K`, et d'autant de pièces de chaque sorte qu'on le veut. Un montant est **payable** s'il est égal à une somme de pièces. Compter les montants payables compris entre `1` et `X`.

Par exemple, avec des pièces de 6, 10 et 15, les montants payables jusqu'à 30 sont 6, 10, 12, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28 et 30 : il y en a 15.

## Entrée
- La première ligne contient `K` et `X`.
- La deuxième ligne contient les `K` valeurs `A₁ … A_K`.

## Sortie
Un seul entier : le nombre de montants payables entre `1` et `X`.

## Contraintes
- 1 ≤ K ≤ 5
- 1 ≤ A_i ≤ 10⁹, et la plus petite valeur est au plus 50 000
- 1 ≤ X ≤ 10¹⁸

## Indices
1. Soit `m` la plus petite valeur. Si un montant `s` est payable, `s + m` l'est aussi. Il suffit donc de connaître, pour chaque reste `r` modulo `m`, le plus petit montant payable de reste `r`.
2. Ces plus petits montants sont des distances : les sommets sont les restes `0, …, m − 1`, et ajouter une pièce de valeur `a` mène de `r` à `(r + a) mod m` pour un coût `a`.
3. Si `D[r]` est la distance du reste `0` au reste `r`, les montants payables de reste `r` sont exactement `D[r]`, `D[r] + m`, `D[r] + 2m`, … Il en reste à compter ceux qui sont au plus `X`.

## Solution
Soit `m` la plus petite valeur de pièce. On définit un graphe dont les sommets sont les restes `0, 1, …, m − 1` ; chaque pièce de valeur `a` donne, depuis chaque reste `r`, un arc vers `(r + a) mod m` de longueur `a`. Un chemin depuis `0` correspond à une suite de pièces, et sa longueur est le montant payé. Dijkstra depuis `0` donne `D[r]`, le **plus petit montant payable de reste `r`** (infini s'il n'y en a pas).

**Pourquoi c'est juste.** Un montant payable `s` de reste `r` est la longueur d'un chemin de `0` à `r`, donc `s ≥ D[r]` ; de plus `s − D[r]` est un multiple de `m`. Réciproquement, `D[r] + j × m` est payable pour tout `j ≥ 0` : on ajoute `j` pièces de valeur `m`. Les montants payables de reste `r` sont donc exactement `D[r], D[r] + m, D[r] + 2m, …`, et ceux qui ne dépassent pas `X` sont au nombre de `(X − D[r]) / m + 1` (division entière) quand `D[r] ≤ X`. On additionne sur les restes, puis on retire 1 pour le montant `0` (compté avec le reste `0`).

**Complexité.** `m` sommets et `m × K` arcs : O(m × K × log(m × K)), soit environ 250 000 arcs, quel que soit `X`. Une méthode qui marque les montants payables un par un jusqu'à `X` est hors de question pour `X = 10¹⁸`.

**Pièges.** Les distances atteignent `m × 10⁹ ≈ 5 × 10¹³` et la réponse `10¹⁸` : `long long` en C++. Quand le PGCD des valeurs n'est pas 1, certains restes restent à distance infinie (deuxième exemple : avec 4 et 6, aucun montant impair n'est payable). Ne pas oublier de retirer le montant `0`.
