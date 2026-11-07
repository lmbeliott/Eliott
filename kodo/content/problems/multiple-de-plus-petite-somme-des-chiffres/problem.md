---
id: multiple-de-plus-petite-somme-des-chiffres
title: Multiple de plus petite somme des chiffres
chapter: p4-plus-courts-chemins
order: 5
tags: [graphes, dijkstra, mathématiques]
samples: 2
---

## Énoncé
Parmi les multiples strictement positifs de `K`, on cherche celui dont la somme des chiffres, écrits en base `B`, est la plus petite. Afficher cette somme.

Par exemple, pour `K = 7` en base 10, le multiple `1001 = 7 × 143` a une somme des chiffres égale à 2, et aucun multiple de 7 n'a une somme égale à 1 (une puissance de 10 n'est jamais divisible par 7).

## Entrée
Une ligne : deux entiers `K` et `B`.

## Sortie
Un seul entier : la plus petite somme des chiffres en base `B` d'un multiple strictement positif de `K`.

## Contraintes
- 1 ≤ K ≤ 100 000
- 2 ≤ B ≤ 10

## Indices
1. Le multiple cherché peut être gigantesque (pour `K = 19`, c'est `1 000 000 001`) : impossible d'essayer les multiples un par un. Seul compte le reste modulo `K` du nombre construit.
2. Tout entier positif s'obtient à partir de `1` avec deux opérations : « ajouter 1 » et « multiplier par `B` ». Que deviennent la somme des chiffres et le reste modulo `K` à chaque opération ?
3. Graphe sur les `K` restes : `r → r + 1` coûte 1, `r → r × B` coûte 0 (modulo `K`). La réponse est la distance du reste de `1` au reste `0`, plus 1.

## Solution
**Modélisation.** On construit un nombre en partant de `1`, avec deux opérations : « ajouter 1 », qui augmente la somme des chiffres d'au plus 1 (exactement 1 sans retenue), et « multiplier par `B` », qui ajoute un `0` à droite sans changer la somme. Seul le reste modulo `K` importe pour savoir si l'on a un multiple de `K`. D'où un graphe dont les sommets sont les restes `0, …, K − 1`, avec les arcs `r → (r + 1) mod K` de coût 1 et `r → (r × B) mod K` de coût 0. La réponse est `dist(1 mod K → 0) + 1`.

**Pourquoi c'est juste.** *Tout multiple donne un chemin.* Si `n` s'écrit `d₁d₂…d_k` en base `B`, on part de `1`, on ajoute `d₁ − 1` fois 1, puis pour chaque chiffre suivant on multiplie par `B` et on ajoute `d_i` fois 1. Ce chemin mène au reste de `n` (donc `0` si `n` est un multiple) et coûte `somme des chiffres de n − 1`. *Tout chemin donne un multiple.* Un chemin de coût `c` du reste de `1` au reste `0` décrit un nombre `n ≥ 1` divisible par `K` ; chaque « ajouter 1 » augmente la somme des chiffres d'au plus 1 et chaque multiplication ne la change pas, donc cette somme vaut au plus `c + 1`. Les deux inégalités donnent l'égalité.

**Algorithme.** Les coûts valent 0 ou 1 : Dijkstra avec un tas convient, avec `K` sommets et `2K` arcs, en O(K log K). (Une file à double entrée, où l'on ajoute devant pour un arc de coût 0 et derrière pour un arc de coût 1, donne la même chose en O(K).) On peut s'arrêter dès que le reste `0` sort du tas.

**Pièges.** Pour `K = 1`, le départ est déjà le reste `0` : la réponse est `1`. Le nombre `0` n'est pas un multiple « strictement positif » : on part bien de `1`, pas de `0`. Un parcours en largeur ordinaire compte les opérations, pas les sommes de chiffres : il donne une réponse fausse.
