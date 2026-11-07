---
id: solutions-positives-d-une-equation
title: Solutions positives d'une équation
chapter: p4-arithmetique
order: 6
tags: [arithmétique, mathématiques]
samples: 1
---

## Énoncé
Des boîtes de A objets et des boîtes de B objets permettent de livrer exactement C objets de combien de façons ? Autrement dit, compter les couples d'entiers (x, y), avec x ≥ 0 et y ≥ 0, tels que A × x + B × y = C. Par exemple, pour A = 4, B = 6 et C = 24, il y a trois couples : (0, 4), (3, 2) et (6, 0).

Répondre à T questions.

## Entrée
La première ligne contient T. Chacune des T lignes suivantes contient trois entiers A, B et C.

## Sortie
T lignes : pour chaque question, le nombre de couples (x, y).

## Contraintes
- 1 ≤ T ≤ 1 000
- 1 ≤ A, B ≤ 10⁹
- 0 ≤ C ≤ 10¹⁸

## Indices
1. Soit g = PGCD(A, B). Si C n'est pas un multiple de g, il n'y a aucune solution. Sinon, on divise A, B et C par g.
2. Après division, A × x ≡ C (mod B) : x est déterminé modulo B par un inverse de A modulo B (Euclide étendu). Soit x₀ la plus petite valeur positive ou nulle possible.
3. Les solutions sont x = x₀ + k × B pour k ≥ 0, tant que A × x ≤ C (pour que y soit positif ou nul).

## Solution
**Réduire.** Soit g = PGCD(A, B). Le membre de gauche est un multiple de g, donc il n'y a pas de solution quand g ne divise pas C. Sinon, on pose a = A/g, b = B/g, c = C/g : l'équation devient a × x + b × y = c, avec a et b premiers entre eux.

**Les valeurs possibles de x.** Si (x, y) est solution, a × x ≡ c (mod b). L'algorithme d'Euclide étendu donne u avec a × u ≡ 1 (mod b), donc x ≡ u × c (mod b). Réciproquement, si x ≡ u × c (mod b) et a × x ≤ c, alors b divise c − a × x, et y = (c − a × x) / b est un entier positif ou nul. Les solutions correspondent donc aux x = x₀ + k × b (k ≥ 0) tels que a × x ≤ c, où x₀ = (u × c) mod b est le plus petit.

**Compter.** Si a × x₀ > c, il n'y a aucune solution. Sinon, la condition a × (x₀ + k × b) ≤ c s'écrit k ≤ (c − a × x₀) / (a × b), et il y a ⌊(c − a × x₀) / (a × b)⌋ + 1 solutions. Les mêmes calculs se font sans diviser C : A × x₀ ≤ C et (C − A × x₀) / (A × b).

**Les pièges.** En C++, u peut être négatif : on le ramène entre 0 et b − 1. Le produit u × c peut atteindre 10²⁷ : on réduit c modulo b avant de multiplier, et les produits restent inférieurs à 10¹⁸, comme A × x₀ et A × b = PPCM(A, B). **Coût** : O(log) par question. Essayer tous les x de 0 à C / A demanderait jusqu'à 10¹⁸ étapes.
