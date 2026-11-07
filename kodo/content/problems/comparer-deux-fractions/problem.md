---
id: comparer-deux-fractions
title: Comparer deux fractions
chapter: p2-nombres
order: 6
tags: [arithmétique, mathématiques]
samples: 2
---

## Énoncé
Comparer les fractions `A / B` et `C / D`. Afficher `<` si la première est plus petite, `>` si elle est plus grande, et `=` si elles sont égales.

## Entrée
Une seule ligne contenant `A`, `B`, `C` et `D`, séparés par des espaces.

## Sortie
Un seul symbole : `<`, `>` ou `=`.

## Contraintes
- −10⁹ ≤ A, C ≤ 10⁹
- 1 ≤ B, D ≤ 10⁹

## Indices
1. Calculer `A / B` et `C / D` avec des flottants ne suffit pas : deux fractions différentes peuvent être si proches qu'elles donnent le même flottant.
2. Comme `B` et `D` sont strictement positifs, multiplier une inégalité par `B × D` ne change pas son sens.
3. `A / B < C / D` équivaut à `A × D < C × B`. Ces produits sont des entiers, calculés exactement.

## Solution
On se ramène à des entiers. Les dénominateurs `B` et `D` sont strictement positifs, donc le produit `B × D` aussi, et multiplier les deux fractions par `B × D` conserve l'ordre : comparer `A / B` et `C / D` revient à comparer `A × D` et `C × B`. C'est le **produit en croix**.

Les produits atteignent au plus 10¹⁸ en valeur absolue : ils tiennent dans un `long long` en C++.

Le piège est de comparer des flottants. Par exemple, 999 999 999 / 1 000 000 000 et 999 999 998 / 999 999 999 diffèrent d'environ 10⁻¹⁸, alors qu'un flottant n'a qu'environ 16 chiffres significatifs : les deux divisions donnent exactement le même flottant, et le programme répondrait `=` au lieu de `>`.
