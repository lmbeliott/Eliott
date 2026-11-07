---
id: somme-des-multiples-de-a-ou-de-b
title: Somme des multiples de A ou de B
chapter: p3-complexite
order: 1
tags: [mathématiques, arithmétique]
samples: 2
---

## Énoncé
Calculer la somme des entiers de 1 à N qui sont multiples de A, ou de B, ou des deux. Par exemple, pour N = 10, A = 3 et B = 5, ces entiers sont 3, 5, 6, 9 et 10, de somme 33.

## Entrée
Une ligne contenant N, A et B.

## Sortie
La somme demandée.

## Contraintes
- 1 ≤ N ≤ 10⁹
- 1 ≤ A, B ≤ 10⁹

## Indices
1. Une boucle de 1 à N fait jusqu'à un milliard de tours : trop lent, même en C++. Il faut une formule.
2. Les multiples de A jusqu'à N sont A, 2A, …, kA avec k = ⌊N/A⌋. Leur somme vaut A × (1 + 2 + … + k) = A × k(k + 1)/2.
3. En ajoutant la somme des multiples de A et celle des multiples de B, les multiples communs sont comptés deux fois. Les multiples communs de A et B sont exactement les multiples de leur PPCM.

## Solution
Notons S(d) la somme des multiples de d compris entre 1 et N. Avec k = ⌊N/d⌋, ce sont d, 2d, …, kd, donc S(d) = d × k(k + 1)/2 (formule de la somme 1 + 2 + … + k).

Un entier multiple de A ou de B est compté une fois dans S(A) + S(B) s'il n'est multiple que de l'un des deux, et deux fois s'il est multiple des deux. On retire donc la somme des multiples communs. Un entier est multiple de A et de B si et seulement s'il est multiple de leur **PPCM**, qui vaut A × B / pgcd(A, B). La réponse est S(A) + S(B) − S(ppcm(A, B)). C'est le principe d'**inclusion-exclusion**.

**Coût.** Le calcul du PGCD par l'algorithme d'Euclide prend quelques dizaines d'étapes ; tout le reste est constant. On passe d'un milliard d'opérations à moins de cent : la complexité est O(log(min(A, B))) au lieu de O(N).

**Dépassements en C++.** La réponse peut atteindre N(N + 1)/2 ≈ 5 × 10¹⁷ : il faut des `long long`. Le PPCM peut valoir 10¹⁸ : on le calcule comme `A / pgcd(A, B) * B`, en divisant d'abord. S'il dépasse N, il n'y a aucun multiple commun et k = 0. Enfin, on calcule `k * (k + 1) / 2` avant de multiplier par d : comme d × k ≤ N, le produit reste inférieur à 10¹⁸.
