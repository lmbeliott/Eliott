---
id: somme-des-distances-de-manhattan
title: Somme des distances de Manhattan
chapter: p3-complexite
order: 4
tags: [tri, sommes-préfixes, mathématiques]
samples: 2
---

## Énoncé
Dans une ville aux rues quadrillées, on se déplace seulement parallèlement aux axes. La distance entre les points (x₁, y₁) et (x₂, y₂) est alors |x₁ − x₂| + |y₁ − y₂| : c'est la **distance de Manhattan**.

On donne N points. Calculer la somme des distances de Manhattan entre toutes les paires de points.

## Entrée
La première ligne contient N. Chacune des N lignes suivantes contient les coordonnées x et y d'un point.

## Sortie
La somme des distances sur toutes les paires de points {i, j}, avec i < j.

## Contraintes
- 1 ≤ N ≤ 15 000
- 0 ≤ x, y ≤ 10 000
- Plusieurs points peuvent être confondus.

## Indices
1. Il y a environ 1,1 × 10⁸ paires pour N = 15 000 : trop pour Python, qui fait de l'ordre de 10⁷ opérations simples par seconde.
2. La somme se sépare en deux : la somme des |xᵢ − xⱼ| plus la somme des |yᵢ − yⱼ|. Il suffit de savoir résoudre le problème sur une droite.
3. Sur une droite, trier les valeurs : si v₀ ≤ v₁ ≤ … ≤ v_{N−1}, la valeur v_k est plus grande que les k valeurs placées avant elle, et sa contribution aux écarts avec elles vaut k × v_k − (v₀ + … + v_{k−1}).

## Solution
**Séparer les coordonnées.** La somme des distances vaut Σ (|xᵢ − xⱼ| + |yᵢ − yⱼ|) = Σ |xᵢ − xⱼ| + Σ |yᵢ − yⱼ|, les sommes portant sur les paires i < j. On calcule la même quantité pour la liste des x et pour la liste des y.

**Sur une droite.** La somme des |vᵢ − vⱼ| ne change pas si on permute les valeurs : on les trie. Pour une paire k > l, on a alors |v_k − v_l| = v_k − v_l. En regroupant les paires selon leur plus grand indice k, la somme vaut Σ_k (k × v_k − P_k), où P_k = v₀ + … + v_{k−1} est une somme préfixe. On parcourt les valeurs triées en tenant à jour P_k : chaque terme s'obtient en temps constant.

**Coût.** Deux tris en O(N log N), puis deux parcours en O(N). La méthode directe calcule N(N − 1)/2 distances, soit O(N²) : environ 1,1 × 10⁸ pour N = 15 000, plusieurs dizaines de secondes en Python.

**Taille du résultat.** Il y a au plus 1,1 × 10⁸ paires, chacune à distance au plus 20 000 : le total peut dépasser 2³¹, il faut un `long long` en C++.
