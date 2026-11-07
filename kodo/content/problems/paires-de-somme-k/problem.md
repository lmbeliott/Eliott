---
id: paires-de-somme-k
title: Paires de somme K
chapter: p2-dictionnaires
order: 6
tags: [dictionnaires, mathématiques]
samples: 2
---

## Énoncé
Une suite de `N` entiers `A₁, A₂, A₃…` et un entier `K` sont donnés. Compter les paires de positions `(i, j)` avec `i < j` telles que `Aᵢ + Aⱼ = K`.

Par exemple, avec `K = 10` et la suite `3 7 5 5 2 7 8`, il y a 4 paires : le `3` avec chacun des deux `7`, les deux `5` entre eux, et le `2` avec le `8`.

## Entrée
La première ligne contient `N` et `K`. La deuxième ligne contient les `N` entiers, séparés par des espaces.

## Sortie
Un seul entier : le nombre de paires.

## Contraintes
- 1 ≤ N ≤ 30 000
- -10⁹ ≤ Aᵢ ≤ 10⁹
- -2 × 10⁹ ≤ K ≤ 2 × 10⁹

## Indices
1. Essayer toutes les paires demande environ N² / 2 = 450 millions de tests : beaucoup trop. Il faut un seul passage.
2. Quand on lit `x`, les valeurs qui forment une paire avec lui sont exactement celles égales à `K - x`. Combien de fois `K - x` est-il déjà apparu ?
3. Garder un dictionnaire qui associe à chaque valeur son nombre d'apparitions parmi les valeurs déjà lues. Ajouter `x` au dictionnaire **après** avoir compté ses paires.

## Solution
Une paire `(i, j)` avec `i < j` est comptée au moment où l'on lit sa seconde valeur `Aⱼ`. À ce moment, il suffit de savoir combien de valeurs déjà lues valent `K - Aⱼ` : chacune forme une paire avec `Aⱼ`.

On garde donc un dictionnaire `deja_vus` qui associe à chaque valeur son nombre d'apparitions parmi les valeurs lues avant la position courante. Pour chaque nouvelle valeur `x` :

1. on ajoute `deja_vus.get(K - x, 0)` au nombre de paires ;
2. puis on augmente `deja_vus[x]` de 1.

L'ordre compte : si on ajoutait `x` d'abord, une valeur `x` égale à `K - x` (c'est-à-dire `x = K / 2`) formerait une paire avec elle-même. Avec le bon ordre, `c` valeurs égales à `K / 2` donnent bien 0 + 1 + … + (c - 1) = c × (c - 1) / 2 paires.

Chaque valeur demande deux opérations sur le dictionnaire, quelle que soit sa taille : environ 60 000 opérations au lieu de 450 millions. Le nombre de paires peut atteindre 30 000 × 29 999 / 2, environ 4,5 × 10⁸, et `K - x` peut atteindre 3 × 10⁹ : en C++, on utilise des `long long`.
