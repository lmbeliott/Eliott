---
id: somme-des-plus-grands-diviseurs-impairs
title: Somme des plus grands diviseurs impairs
chapter: p3-complexite
order: 7
tags: [mathématiques, récursivité]
samples: 2
---

## Énoncé
Pour un entier k ≥ 1, on note g(k) son plus grand diviseur impair. Par exemple, g(12) = 3, g(7) = 7 et g(8) = 1.

Répondre à Q questions : que vaut g(L) + g(L + 1) + … + g(R) ?

## Entrée
La première ligne contient Q. Chacune des Q lignes suivantes contient L et R.

## Sortie
Q lignes : la somme demandée pour chaque question.

## Contraintes
- 1 ≤ Q ≤ 1 000
- 1 ≤ L ≤ R ≤ 10⁹

## Indices
1. Calculer g(k) pour chaque k de L à R fait jusqu'à 10⁹ calculs par question : beaucoup trop. Il suffit de savoir calculer F(N) = g(1) + … + g(N), puisque la réponse vaut F(R) − F(L − 1).
2. Séparer les k impairs et les k pairs. Pour k impair, g(k) = k. Pour k = 2j pair, g(2j) = g(j).
3. La somme des nombres impairs de 1 à N vaut m², avec m = ⌊(N + 1)/2⌋, leur nombre.

## Solution
Posons F(N) = g(1) + g(2) + … + g(N), avec F(0) = 0. La réponse à une question est F(R) − F(L − 1).

**Une relation de récurrence.** Parmi les entiers de 1 à N :

- les impairs sont 1, 3, 5, …, il y en a m = ⌊(N + 1)/2⌋, et pour eux g(k) = k. Leur somme vaut 1 + 3 + … + (2m − 1) = m² ;
- les pairs s'écrivent k = 2j avec 1 ≤ j ≤ ⌊N/2⌋. Diviser par 2 ne change pas le plus grand diviseur impair : g(2j) = g(j). Leur somme vaut donc g(1) + … + g(⌊N/2⌋) = F(⌊N/2⌋).

D'où F(N) = m² + F(⌊N/2⌋). Par exemple, F(6) = 3² + F(3) = 9 + (2² + F(1)) = 9 + 4 + 1 = 14, et en effet 1 + 1 + 3 + 1 + 5 + 3 = 14.

**Correction et terminaison.** La relation se démontre ci-dessus pour tout N ≥ 1 ; la récurrence s'arrête car N est au moins divisé par 2 à chaque appel, jusqu'à F(0) = 0.

**Coût.** Environ log₂(N) + 1 appels, soit 31 pour N = 10⁹ : O(log N) par question, contre O(R − L) pour le calcul direct. La réponse peut atteindre environ 3,3 × 10¹⁷ : `long long` en C++, y compris pour m², car m peut valoir 5 × 10⁸.
