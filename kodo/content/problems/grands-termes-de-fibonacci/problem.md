---
id: grands-termes-de-fibonacci
title: Grands termes de Fibonacci
chapter: p4-diviser-regner
order: 3
tags: [récursivité, mathématiques, arithmétique]
samples: 1
---

## Énoncé
La suite de Fibonacci est définie par F(0) = 0, F(1) = 1 et F(n) = F(n − 1) + F(n − 2) pour n ≥ 2 : 0, 1, 1, 2, 3, 5, 8, 13, 21…

Répondre à T questions : pour N et M donnés, afficher le reste de la division de F(N) par M.

## Entrée
La première ligne contient T. Chacune des T lignes suivantes contient deux entiers N et M.

## Sortie
T lignes : pour chaque question, F(N) mod M.

## Contraintes
- 1 ≤ T ≤ 1 000
- 0 ≤ N ≤ 10¹⁸
- 1 ≤ M ≤ 10⁹

## Indices
1. Calculer les termes un par un demande N étapes : impossible pour N = 10¹⁸. Il faut passer de n à 2n en une seule étape, comme dans l'exponentiation rapide.
2. On peut montrer que F(2k) = F(k) × (2 F(k + 1) − F(k)) et F(2k + 1) = F(k)² + F(k + 1)².
3. Écrire une fonction récursive qui renvoie le couple (F(n), F(n + 1)) modulo M, à partir du couple pour ⌊n/2⌋.

## Solution
**Les formules de doublement.** On montre d'abord, par récurrence sur n, que F(m + n) = F(m) × F(n + 1) + F(m − 1) × F(n) pour m ≥ 1 et n ≥ 0 : pour n = 0 et n = 1, ce sont F(m) = F(m) et F(m + 1) = F(m) + F(m − 1) ; et si la formule est vraie pour n − 1 et n, on additionne les deux égalités. Avec m = k + 1 et n = k, on obtient F(2k + 1) = F(k + 1)² + F(k)². Avec m = n = k (k ≥ 1), F(2k) = F(k) × F(k + 1) + F(k − 1) × F(k) = F(k) × (2 F(k + 1) − F(k)), en remplaçant F(k − 1) par F(k + 1) − F(k) ; la formule reste vraie pour k = 0.

**Diviser pour régner.** La fonction fib(n) renvoie le couple (F(n), F(n + 1)) modulo M. Si n = 0, c'est (0, 1). Sinon, on calcule (a, b) = fib(⌊n/2⌋), puis c = a × (2b − a) et d = a² + b², qui valent F(2k) et F(2k + 1) pour k = ⌊n/2⌋. Si n est pair, le résultat est (c, d) ; s'il est impair, c'est (d, c + d). Les formules restent justes modulo M, car les restes sont compatibles avec les additions, soustractions et multiplications.

**Les pièges.** En C++, 2b − a peut être négatif, et l'opérateur `%` renvoie alors un reste négatif : on ajoute M avant de prendre le reste. Les produits de deux restes inférieurs à 10⁹ tiennent dans un `long long`. Pour M = 1, toutes les réponses valent 0.

**Coût.** Chaque appel divise n par deux : environ 60 appels par question, soit une profondeur de récursion de 60 et quelques dizaines de milliers d'opérations en tout.
