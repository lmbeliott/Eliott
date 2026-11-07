---
id: plus-longue-portion-de-moyenne-au-moins-m
title: Plus longue portion de moyenne au moins M
chapter: p3-synthese
order: 6
tags: [sommes-préfixes, deux-pointeurs, mathématiques]
samples: 2
---

## Énoncé
Une station météo a relevé N températures entières a₁, …, a_N. Pour un seuil M, on cherche la plus longue période de jours consécutifs dont la moyenne des températures est au moins M.

Répondre pour Q seuils différents.

## Entrée
La première ligne contient N et Q. La deuxième ligne contient les N températures. La troisième ligne contient les Q seuils.

## Sortie
Q lignes : pour chaque seuil, la longueur de la plus longue période de moyenne au moins M, ou `0` s'il n'y en a aucune.

## Contraintes
- 1 ≤ N ≤ 30 000
- 1 ≤ Q ≤ 5
- 0 ≤ aᵢ ≤ 1 000 et 0 ≤ M ≤ 1 000

## Indices
1. Une moyenne n'est pas pratique : la période de i à j a une moyenne au moins M si et seulement si la somme des (a_k − M) pour k de i à j est positive ou nulle. On remplace chaque température par b_k = a_k − M.
2. Avec les sommes préfixes P₀ = 0 et P_k = b₁ + … + b_k, la période de i + 1 à j convient si et seulement si P_i ≤ P_j. On cherche donc la plus grande différence j − i avec i < j et P_i ≤ P_j.
3. Calculer L[i] = min(P₀, …, P_i) et R[j] = max(P_j, …, P_N). Ces deux suites sont décroissantes, et on peut les parcourir avec deux indices qui ne font qu'avancer.

## Solution
**Se ramener à des sommes.** La moyenne de a_{i+1}, …, a_j est au moins M si et seulement si a_{i+1} + … + a_j ≥ M × (j − i), c'est-à-dire si la somme des b_k = a_k − M sur la période est positive ou nulle. Avec les sommes préfixes P_k = b₁ + … + b_k (et P₀ = 0), cette somme vaut P_j − P_i. On cherche la plus grande valeur de j − i, avec 0 ≤ i < j ≤ N et P_i ≤ P_j. Tout se fait en entiers, sans nombre à virgule.

**Deux tableaux et deux indices.** On calcule L[i] = min(P₀, …, P_i) et R[j] = max(P_j, …, P_N). On part de i = 0 et j = 0, et tant que i ≤ N et j ≤ N : si L[i] ≤ R[j], on note j − i et on avance j ; sinon, on avance i. La réponse est la plus grande valeur notée (0 au départ).

**Correction.** Toute valeur notée est réalisable : si L[i] ≤ R[j] avec j > i, il existe i' ≤ i et j' ≥ j avec P_{i'} ≤ P_{j'}, donc une période de longueur j' − i' ≥ j − i. Réciproquement, soit (i*, j*) une meilleure paire. Tant que j ≤ j*, l'indice i ne peut pas dépasser i* : quand i = i*, on a L[i*] ≤ P_{i*} ≤ P_{j*} ≤ R[j], donc c'est j qui avance. Comme la boucle ne s'arrête que si l'un des indices dépasse N, j finit par passer de j* à j* + 1, ce qui n'arrive que si la condition est vraie : on note alors j* − i, avec i ≤ i*, soit au moins la longueur optimale.

**Coût.** Pour chaque seuil, trois parcours de la liste et au plus 2N + 2 tours de boucle : O(N) par seuil, O(QN) en tout. Essayer toutes les périodes avec des sommes préfixes coûterait O(N²) par seuil, soit 4,5 × 10⁸ opérations : trop lent, surtout en Python.
