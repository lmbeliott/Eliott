---
id: nombres-de-la-forme-2a-3b
title: Nombres de la forme 2ᵃ × 3ᵇ
chapter: p3-synthese
order: 2
tags: [mathématiques, tri]
samples: 2
---

## Énoncé
On s'intéresse aux entiers qui s'écrivent 2ᵃ × 3ᵇ, avec a ≥ 0 et b ≥ 0 entiers : 1, 2, 3, 4, 6, 8, 9, 12, 16, 18, 24, 27… Ce sont les entiers qui n'ont aucun diviseur premier autre que 2 et 3.

Répondre à Q questions : combien y a-t-il de tels entiers entre A et B (inclus) ?

## Entrée
La première ligne contient Q. Chacune des Q lignes suivantes contient A et B.

## Sortie
Q lignes : la réponse à chaque question.

## Contraintes
- 1 ≤ Q ≤ 1 000
- 1 ≤ A ≤ B ≤ 10¹⁸

## Indices
1. Parcourir les entiers de A à B est impossible. Mais combien y a-t-il d'entiers de la forme 2ᵃ × 3ᵇ jusqu'à 10¹⁸ ? On a 2ᵃ ≤ 10¹⁸, donc a ≤ 59, et 3ᵇ ≤ 10¹⁸, donc b ≤ 37.
2. Il y en a donc au plus 60 × 38 = 2 280. On peut tous les fabriquer avec deux boucles imbriquées, en s'arrêtant dès que le produit dépasse 10¹⁸.
3. Ensuite, pour chaque question, il suffit de compter ceux de la liste qui sont entre A et B.

## Solution
**Fabriquer la liste.** Pour chaque puissance de 2, p = 1, 2, 4… tant que p ≤ 10¹⁸, on multiplie p par 1, 3, 9… tant que le produit reste au plus 10¹⁸, et on range chaque produit dans une liste. Chaque entier 2ᵃ × 3ᵇ est obtenu exactement une fois, pour son couple (a, b), car la décomposition en facteurs premiers est unique. La liste en contient 1 178.

**Répondre.** Pour chaque question, on parcourt la liste et on compte les valeurs comprises entre A et B. On peut aussi trier la liste et s'arrêter dès qu'on dépasse B.

**Coût.** Environ 1 200 valeurs fabriquées, puis 1 200 comparaisons par question : un peu plus d'un million d'opérations, au lieu de jusqu'à 10¹⁸ en testant chaque entier de [A, B]. La remarque clé est de compter les objets à trouver avant de chercher : ici, ils sont très rares (de l'ordre de (log N)²).

**Dépassement en C++.** Le produit doit être testé avant de dépasser la capacité d'un `long long` (environ 9,2 × 10¹⁸) : comme on ne multiplie par 3 que des valeurs au plus 10¹⁸, les produits restent inférieurs à 3 × 10¹⁸, ce qui tient.
