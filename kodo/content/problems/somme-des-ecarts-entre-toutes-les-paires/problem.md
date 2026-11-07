---
id: somme-des-ecarts-entre-toutes-les-paires
title: Somme des écarts entre toutes les paires
chapter: p3-tris-simples
order: 6
tags: [tri, mathématiques]
samples: 2
---

## Énoncé
Une suite de `N` entiers `A₁, …, A_N` est donnée. Calculer la somme des écarts `|Aᵢ − Aⱼ|` sur toutes les paires de positions `i < j`.

Par exemple, pour `4 1 3`, les écarts sont `3`, `1` et `2`, et leur somme vaut `6`.

## Entrée
La première ligne contient `N`. La deuxième ligne contient les `N` entiers, séparés par des espaces.

## Sortie
Un seul entier : la somme des écarts.

## Contraintes
- 1 ≤ N ≤ 20 000
- 0 ≤ Aᵢ ≤ 10⁶

## Indices
1. Il y a N × (N − 1) / 2 paires, soit 200 millions : trop pour les examiner une par une en Python.
2. La somme ne dépend pas de l'ordre des valeurs : on peut les trier. Une fois triées, `|Bᵢ − Bⱼ| = Bⱼ − Bᵢ` pour `i < j`.
3. Combien de fois `Bⱼ` est-il compté avec le signe `+` ? Avec le signe `−` ?

## Solution
Échanger deux éléments de la suite ne change pas l'ensemble des paires, donc pas la somme : on trie la suite, `B₀ ≤ B₁ ≤ … ≤ B_{N−1}` (numérotée à partir de 0). Pour `i < j`, l'écart vaut alors `Bⱼ − Bᵢ`, sans valeur absolue.

Fixons `j`. Les paires où `Bⱼ` est la plus grande valeur sont celles avec `i = 0, 1, …, j − 1`. Elles apportent `(Bⱼ − B₀) + … + (Bⱼ − B_{j−1}) = j × Bⱼ − (B₀ + … + B_{j−1})`. On parcourt donc la suite triée en gardant dans une variable `deja` la somme des valeurs déjà vues, et on ajoute `j × Bⱼ − deja` au total avant d'ajouter `Bⱼ` à `deja`.

En regroupant, on obtient aussi une formule directe : `Bⱼ` est compté `j` fois avec le signe `+` et `N − 1 − j` fois avec le signe `−`, donc le total vaut la somme des `(2j − N + 1) × Bⱼ`.

**Coût.** Un tri, puis un seul passage : quelques dizaines de milliers d'opérations au lieu de 200 millions. Le total peut atteindre 10⁶ × 2 × 10⁸ = 2 × 10¹⁴ : en C++, `long long` obligatoire, y compris pour le produit `j × Bⱼ`.
