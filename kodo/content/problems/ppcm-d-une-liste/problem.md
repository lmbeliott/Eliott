---
id: ppcm-d-une-liste
title: PPCM d'une liste
chapter: p4-arithmetique
order: 1
tags: [arithmétique, mathématiques]
samples: 2
---

## Énoncé
Le **PPCM** de plusieurs entiers strictement positifs est le plus petit entier strictement positif qui est un multiple de chacun d'eux. Par exemple, le PPCM de 4, 6 et 10 vaut 60.

On donne N entiers. Afficher leur PPCM s'il est au plus 10¹⁸, et `-1` sinon.

## Entrée
La première ligne contient N. La deuxième ligne contient les N entiers.

## Sortie
Le PPCM des N entiers, ou `-1` s'il dépasse 10¹⁸.

## Contraintes
- 1 ≤ N ≤ 1 000
- 1 ≤ chaque entier ≤ 10¹⁸

## Indices
1. Le PPCM se calcule de proche en proche : PPCM(a, b, c) = PPCM(PPCM(a, b), c), et PPCM(a, b) = a / PGCD(a, b) × b.
2. En C++, le produit a / PGCD(a, b) × b peut dépasser 2⁶³ − 1 avant même qu'on puisse le comparer à 10¹⁸ : le résultat devient faux, souvent négatif, sans aucun message.
3. Tester avant de multiplier : q × b > 10¹⁸ si et seulement si q > ⌊10¹⁸ / b⌋, pour des entiers positifs.

## Solution
**La formule.** Pour deux entiers, PGCD(a, b) × PPCM(a, b) = a × b : dans les décompositions en facteurs premiers, le PGCD prend le plus petit exposant de chaque nombre premier et le PPCM le plus grand, et min + max = somme des deux exposants. On calcule donc PPCM(a, b) = (a / PGCD(a, b)) × b, en divisant d'abord : la division est exacte, et le nombre reste plus petit. Le PPCM de toute la liste se calcule de proche en proche, car un multiple commun de a, b et c est un multiple de PPCM(a, b) et de c.

**Le débordement.** Même en divisant d'abord, q = a / PGCD(a, b) multiplié par b peut atteindre 10³⁶. En C++, ce produit dépasse la capacité d'un `long long` et donne un résultat faux. On teste donc avant de multiplier : pour des entiers q, b ≥ 1, q × b > 10¹⁸ si et seulement si q > ⌊10¹⁸ / b⌋. Dès que le PPCM dépasse 10¹⁸, il ne peut plus que grandir : on affiche `-1`. En Python, les entiers n'ont pas de limite, mais il est inutile de laisser grandir un nombre de milliers de chiffres : on s'arrête aussi.

**Coût.** N calculs de PGCD, chacun en O(log 10¹⁸) étapes, comme vu au niveau 3.
