---
id: interrupteurs-et-multiples
title: Interrupteurs et multiples
chapter: p2-tableaux
order: 5
tags: [listes, simulation, mathématiques]
samples: 2
---

## Énoncé
`N` lampes numérotées de 1 à `N` sont toutes éteintes. On fait `K` passages. Au passage numéro `p` (pour `p` allant de 1 à `K`), on actionne l'interrupteur de chaque lampe dont le numéro est un multiple de `p` : une lampe éteinte s'allume, une lampe allumée s'éteint. Afficher le nombre de lampes allumées à la fin.

## Entrée
Une seule ligne contenant `N` et `K`, séparés par une espace.

## Sortie
Un seul entier : le nombre de lampes allumées après les `K` passages.

## Contraintes
- 1 ≤ K ≤ N ≤ 100 000

## Indices
1. Un tableau de `N + 1` cases (la case 0 ne sert pas) garde l'état de chaque lampe : `0` pour éteinte, `1` pour allumée.
2. Au passage `p`, inutile de tester toutes les lampes : les multiples de `p` sont `p`, `2p`, `3p`… On les parcourt directement avec `range(p, N + 1, p)`.
3. Le passage `p` touche environ `N / p` lampes. Au total, N/1 + N/2 + … + N/K reste de l'ordre de `12 × N` pour `N = 100 000` : la simulation est rapide.

## Solution
On simule. Un tableau `lampe` de `N + 1` cases, toutes à 0, représente les lampes 1 à `N`. Pour chaque passage `p` de 1 à `K`, on parcourt les multiples de `p` avec un pas de `p` (`range(p, n + 1, p)` en Python, `j += p` en C++) et on inverse leur état : `lampe[j] = 1 - lampe[j]`. À la fin, on compte les cases qui valent 1.

Tester pour chaque lampe si son numéro est un multiple de `p` demanderait `N × K` opérations, jusqu'à 10¹⁰ : beaucoup trop. En sautant directement de multiple en multiple, le nombre total d'opérations est N/1 + N/2 + … + N/K, environ `N × 12` au maximum ici.

Une propriété à découvrir : quand `K = N`, la lampe numéro `x` est actionnée une fois par diviseur de `x`. Elle finit allumée si `x` a un nombre impair de diviseurs, c'est-à-dire si `x` est un carré parfait (les diviseurs vont par paires `d` et `x / d`, sauf quand `d × d = x`). La réponse est alors le nombre de carrés entre 1 et `N`. Pour `K < N`, il n'y a plus de formule aussi simple, et la simulation fait le travail.
