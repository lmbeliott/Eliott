---
id: plus-grande-mediane-d-une-portion
title: Plus grande médiane d'une portion
chapter: p4-dichotomie
order: 8
synthesis: true
tags: [dichotomie, sommes-préfixes, mathématiques]
samples: 2
---

## Énoncé
On donne une suite de N entiers a₁, …, a_N et un entier K. Une **portion** est une suite de cases consécutives. La **médiane** d'une portion de longueur L est la valeur qui se trouve en position ⌊(L + 1) / 2⌋ quand on trie la portion dans l'ordre croissant (les positions commencent à 1). Par exemple, la médiane de `4 1 5` est 4, et celle de `5 1 4 2` est 2.

Afficher la plus grande médiane possible d'une portion de longueur **au moins K**.

## Entrée
La première ligne contient N et K. La deuxième ligne contient les N entiers a₁, …, a_N.

## Sortie
La plus grande médiane d'une portion de longueur au moins K.

## Contraintes
- 1 ≤ K ≤ N ≤ 20 000
- 1 ≤ aᵢ ≤ 100 000

## Indices
1. Se poser une question plus simple : pour une valeur x donnée, existe-t-il une portion de longueur au moins K dont la médiane est **au moins x** ? Si oui pour x, alors oui pour toute valeur plus petite : dichotomie sur x.
2. La médiane d'une portion est au moins x si et seulement si la portion contient strictement plus de valeurs ≥ x que de valeurs < x. On remplace chaque valeur par +1 si elle est ≥ x, par −1 sinon : il faut une portion de somme au moins 1.
3. Avec les sommes préfixes P₀, …, P_N de ces ±1, la portion de i + 1 à j a pour somme P_j − P_i. Pour chaque j ≥ K, il suffit de connaître le minimum de P₀, …, P_{j−K}, qu'on met à jour en avançant.

## Solution
**Une propriété monotone.** Notons ok(x) : « il existe une portion de longueur au moins K de médiane au moins x ». Si ok(x) est vrai et y ≤ x, ok(y) est vrai, avec la même portion. La réponse est donc la plus grande valeur x telle que ok(x) ; elle fait partie de la suite (c'est une médiane), donc on fait la dichotomie sur la liste triée des valeurs distinctes, avec l'invariant « ok(v[lo]) est vrai, ok(v[hi]) est faux » (hi part juste après la fin de la liste, et ok(plus petite valeur) est vrai).

**Médiane et comptage.** Dans une portion de longueur L, notons c le nombre de valeurs ≥ x et d le nombre de valeurs < x. La médiane, en position p = ⌊(L + 1) / 2⌋ du tri, est au moins x si et seulement si les valeurs < x, qui sont rangées en tête, occupent moins de p places : d ≤ p − 1. Si L = 2t, cela donne d ≤ t − 1, c'est-à-dire c ≥ t + 1 > d ; si L = 2t + 1, cela donne d ≤ t, c'est-à-dire c ≥ t + 1 > d. Dans les deux cas : médiane ≥ x si et seulement si c − d ≥ 1.

**Tester x en O(N).** On remplace aᵢ par bᵢ = +1 si aᵢ ≥ x et −1 sinon, et on calcule les sommes préfixes P₀ = 0, P_j = b₁ + … + b_j. La portion de i + 1 à j (longueur j − i ≥ K) a pour somme P_j − P_i. Il en existe une de somme au moins 1 si et seulement si, pour un certain j ≥ K, P_j − min(P₀, …, P_{j−K}) ≥ 1. On parcourt j de K à N en mettant à jour ce minimum : un seul passage.

**Coût.** Le tri coûte O(N log N), puis la dichotomie fait environ log₂ N ≈ 15 tests en O(N) : O(N log N). Calculer la médiane de toutes les portions demanderait N²/2 = 2 × 10⁸ portions, chacune à trier : beaucoup trop.
