---
id: racine-k-ieme-entiere
title: Racine K-ième entière
chapter: p4-dichotomie
order: 2
tags: [dichotomie, mathématiques]
samples: 1
---

## Énoncé
Pour un entier N ≥ 0 et un entier K ≥ 2, la **racine K-ième entière** de N est le plus grand entier R ≥ 0 tel que R^K ≤ N, où R^K est le produit de K facteurs égaux à R.

Par exemple, la racine cubique entière de 30 vaut 3, car 3³ = 27 ≤ 30 < 64 = 4³.

Répondre à T questions. Attention : les nombres à virgule sont approchés, et `N ** (1 / K)` ou `pow(N, 1.0 / K)` donne parfois un résultat faux d'une unité ; les tests contiennent de tels cas.

## Entrée
La première ligne contient T. Chacune des T lignes suivantes contient deux entiers N et K.

## Sortie
T lignes : pour chaque question, la racine K-ième entière de N.

## Contraintes
- 1 ≤ T ≤ 1 000
- 0 ≤ N ≤ 10¹⁸
- 2 ≤ K ≤ 60

## Indices
1. La propriété « R^K ≤ N » est vraie pour R = 0, et si elle est vraie pour R, elle l'est pour tout entier plus petit : on cherche le dernier R où elle est vraie, par dichotomie.
2. La réponse est au plus 10⁹, puisque K ≥ 2 : on peut chercher entre 0 et 10⁹ + 1.
3. En C++, R^K dépasse vite 2⁶³ − 1. On calcule la puissance facteur par facteur et on s'arrête dès qu'elle dépasse N, en testant **avant** de multiplier si `p > N / R`.

## Solution
**Un prédicat monotone.** Notons ok(R) la propriété R^K ≤ N. Si ok(R) est vraie et R' ≤ R, alors R'^K ≤ R^K ≤ N : ok est vraie sur un début d'intervalle, puis fausse. La réponse est le dernier entier où ok est vraie, et on la trouve par dichotomie avec l'invariant « ok(lo) est vraie et ok(hi) est fausse ». On part de lo = 0 (0^K = 0 ≤ N) et hi = 10⁹ + 1, car (10⁹ + 1)² > 10¹⁸ ≥ N. Tant que hi − lo > 1, on teste le milieu et on remplace lo ou hi ; à la fin, lo est la réponse.

**Calculer R^K sans débordement.** On multiplie p = 1 par R, K fois, et on s'arrête dès que p dépasse N : ok est alors fausse. En C++, le produit p × R peut dépasser 2⁶³ − 1 avant même qu'on s'en aperçoive ; on teste donc `p > N / R` avant de multiplier (pour R ≥ 1) : en nombres réels, cela revient à p × R > N, et la division entière ne change pas la conclusion, car p est entier. Le calcul s'arrête après au plus K multiplications, et en pratique beaucoup moins quand R est grand.

**Pourquoi pas les flottants.** Un `double` n'a que 53 bits de précision : pour N = 10¹⁸ − 1 et K = 2, `sqrt(N)` vaut exactement 10⁹ une fois arrondi, alors que la bonne réponse est 999 999 999. Corriger le résultat flottant d'une unité est possible, mais la dichotomie entière est sûre.

**Coût.** Une trentaine d'étapes de dichotomie par question, chacune avec au plus K multiplications : environ 2 000 opérations par question au pire. Essayer R = 0, 1, 2, … demanderait jusqu'à 10⁹ essais par question.
