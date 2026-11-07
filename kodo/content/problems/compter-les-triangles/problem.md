---
id: compter-les-triangles
title: Compter les triangles
chapter: p3-synthese
order: 3
tags: [tri, deux-pointeurs, mathématiques]
samples: 2
time_limit_ms: 250
---

## Énoncé
On dispose de N bâtons de longueurs entières. Trois bâtons de longueurs x ≤ y ≤ z permettent de construire un vrai triangle (non aplati) si et seulement si x + y > z.

Compter les façons de choisir trois bâtons (trois positions différentes) qui permettent de construire un triangle.

## Entrée
La première ligne contient N. La deuxième ligne contient les N longueurs.

## Sortie
Le nombre de triplets de bâtons qui forment un triangle.

## Contraintes
- 1 ≤ N ≤ 2 500
- 1 ≤ longueur ≤ 10⁹

## Indices
1. Essayer tous les triplets coûte environ N³/6 ≈ 2,6 × 10⁹ opérations : trop, même en C++. Trier les longueurs simplifie la condition : dans un triplet trié, seule l'inégalité x + y > z compte.
2. Fixer le plus grand bâton z = a[k]. Il reste à compter les paires i < j < k telles que a[i] + a[j] > a[k] : c'est un problème de paires dans une liste triée.
3. Avec deux indices i (à gauche) et j = k − 1 (à droite) : si a[i] + a[j] > a[k], alors chaque i' entre i et j − 1 convient aussi avec j.

## Solution
**Pourquoi une seule inégalité.** Un triangle de côtés x, y, z existe (non aplati) si chaque côté est strictement plus petit que la somme des deux autres. Si x ≤ y ≤ z, les inégalités y < x + z et x < y + z sont automatiques, et il ne reste que z < x + y.

**Algorithme.** On trie les longueurs : a[0] ≤ a[1] ≤ … ≤ a[N−1]. Chaque triplet de positions est compté une fois, par ses indices dans l'ordre trié i < j < k. Pour chaque k, on compte les paires i < j < k avec a[i] + a[j] > a[k], avec deux indices : i = 0 et j = k − 1. Tant que i < j :

- si a[i] + a[j] > a[k], alors pour tout i' de i à j − 1, a[i'] + a[j] ≥ a[i] + a[j] > a[k] : on compte j − i paires d'un coup, et on diminue j ;
- sinon, pour tout j' de i + 1 à j, a[i] + a[j'] ≤ a[i] + a[j] ≤ a[k] : a[i] ne forme de triangle avec aucun élément restant, et on augmente i.

**Invariant.** Toutes les paires valables qui ne sont pas entièrement dans [i, j] ont été comptées exactement une fois. Quand i = j, plus aucune paire ne reste : le compte pour ce k est complet.

**Coût.** Le tri coûte O(N log N). Pour chaque k, chaque tour de boucle rapproche i et j, donc au plus k tours : au total O(N²), environ 3 × 10⁶ tours pour N = 2 500, contre 2,6 × 10⁹ triplets pour la méthode directe. Les sommes a[i] + a[j] atteignent 2 × 10⁹, au-delà d'un `int`, et le nombre de triangles peut dépasser 2,6 × 10⁹ : `long long` en C++ pour les sommes et le total.
