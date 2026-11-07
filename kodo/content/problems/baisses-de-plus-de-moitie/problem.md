---
id: baisses-de-plus-de-moitie
title: Baisses de plus de moitié
chapter: p4-diviser-regner
order: 4
tags: [tri, récursivité]
samples: 2
time_limit_ms: 500
---

## Énoncé
On a relevé le prix d'un produit pendant N jours : a₁, a₂, …, a_N. Une **baisse de plus de moitié** est une paire de jours i < j telle que le prix du jour j est strictement inférieur à la moitié du prix du jour i, c'est-à-dire 2 × a_j < a_i.

Compter les baisses de plus de moitié.

Les prix sont fabriqués par une formule, pour que l'entrée reste courte : a₁ = X, puis a_{i+1} = (aᵢ × B + C) mod M. Par exemple, avec N = 5, X = 11, B = 21, C = 33 et M = 37, les prix sont 11, 5, 27, 8, 16 : seules les paires de jours (1, 2) et (3, 4) conviennent, car 2 × 5 < 11 et 2 × 8 < 27.

## Entrée
Une seule ligne : les cinq entiers N, X, B, C et M.

## Sortie
Le nombre de baisses de plus de moitié.

## Contraintes
- 2 ≤ N ≤ 100 000
- 1 ≤ M ≤ 10⁹
- 0 ≤ X, B, C < M

## Indices
1. Couper la suite en deux moitiés. Une paire est soit dans la moitié gauche, soit dans la moitié droite (on les compte récursivement), soit à cheval : i à gauche et j à droite.
2. Pour les paires à cheval, l'ordre à l'intérieur de chaque moitié ne compte plus : on peut supposer les deux moitiés triées, comme dans le tri fusion.
3. Si les deux moitiés sont triées, quand y augmente dans la moitié droite, le premier élément x de la moitié gauche tel que x > 2y ne peut que reculer vers la droite : deux indices qui avancent suffisent. On fait ce comptage avant la fusion, car la condition n'est pas celle du tri.

## Solution
**Diviser.** On adapte le tri fusion. La fonction reçoit une portion de la suite, renvoie la portion triée et le nombre de baisses dont les deux jours sont dans la portion. Une baisse (i, j) a ses deux jours dans la moitié gauche, ou dans la moitié droite (appels récursifs), ou bien i est à gauche et j à droite. Pour ces dernières, la condition i < j est automatique : seules les valeurs comptent, pas leurs positions dans chaque moitié.

**Compter les paires à cheval.** Après les appels récursifs, les deux moitiés g et d sont triées. Pour chaque y de d, dans l'ordre croissant, on veut le nombre d'éléments x de g tels que x > 2y. Ces éléments forment une fin de g, qui commence au premier indice i tel que g[i] > 2y. Quand y augmente, 2y augmente, donc cet indice ne recule jamais : on le fait avancer tant que g[i] ≤ 2y, et on ajoute len(g) − i. Ce passage coûte O(len(g) + len(d)). On ne peut pas le faire pendant la fusion elle-même : la fusion compare x à y, alors que la baisse compare x à 2y.

**Fusionner, puis coût.** On fusionne ensuite g et d comme dans le tri fusion. Chaque niveau de récursion fait un travail linéaire, et il y a environ log₂ N niveaux : O(N log N) en tout, soit quelques millions d'opérations. Comparer toutes les paires demanderait 5 × 10⁹ comparaisons pour N = 100 000. En C++, 2y peut atteindre 2 × 10⁹ et la réponse 5 × 10⁹ : `long long`.
