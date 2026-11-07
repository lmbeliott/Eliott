---
id: ordres-d-insertion-donnant-le-meme-abr
title: Ordres d'insertion donnant le même arbre
chapter: p4-arbres-binaires
order: 7
tags: [mathématiques, arithmétique]
samples: 2
---

## Énoncé
On insère les entiers de `1` à `N`, dans l'ordre donné, dans un arbre binaire de recherche initialement vide, avec l'insertion du cours (sans rééquilibrage). Par exemple, insérer `3 4 5 1 2` donne un arbre de racine 3, dont le fils gauche est 1 (avec 2 comme fils droit) et le fils droit est 4 (avec 5 comme fils droit).

D'autres ordres d'insertion des mêmes entiers donnent exactement le même arbre : par exemple `3 1 4 2 5`. Compter les ordres d'insertion de `1` à `N` (l'ordre donné compris) qui produisent le même arbre que l'ordre donné, modulo 1 000 000 007.

## Entrée
- La première ligne contient `N`.
- La deuxième ligne contient une permutation des entiers de `1` à `N` : l'ordre d'insertion.

## Sortie
Un seul entier : le nombre d'ordres d'insertion qui donnent le même arbre, modulo 1 000 000 007.

## Contraintes
- 1 ≤ N ≤ 1 000

## Indices
1. Un ordre produit le même arbre si et seulement si la racine vient en premier, et si les clés du sous-arbre gauche, prises dans l'ordre où elles apparaissent, produisent le même sous-arbre gauche (et de même à droite).
2. Les clés de gauche et celles de droite n'interagissent jamais : seul compte leur ordre à l'intérieur de chaque côté. De combien de façons peut-on entrelacer une suite de `a` éléments et une suite de `b` éléments ?
3. Il y a `C(a + b, a)` entrelacements. Les coefficients binomiaux se calculent avec des factorielles et des inverses modulaires.

## Solution
**La propriété.** Dans un ordre d'insertion qui produit un arbre de racine `r`, la clé `r` vient en premier (la première clé insérée est la racine). Ensuite, une clé plus petite que `r` descend toujours à gauche et une clé plus grande à droite : le sous-arbre gauche est exactement celui que produit la sous-suite des clés plus petites que `r`, et de même à droite. Un ordre donne donc le même arbre si et seulement si `r` est en premier, la sous-suite des clés de gauche donne le même sous-arbre gauche, et celle des clés de droite le même sous-arbre droit, **quelle que soit la façon dont ces deux sous-suites sont entrelacées**.

**Le dénombrement.** Si `f(v)` est le nombre d'ordres qui produisent le sous-arbre de racine `v`, avec un sous-arbre gauche de `a` nœuds et un sous-arbre droit de `b` nœuds, alors `f(v) = C(a + b, a) × f(gauche) × f(droite)` : on choisit les `a` places des clés de gauche parmi les `a + b` places après la racine, puis un ordre valable de chaque côté. Pour l'arbre vide, `f = 1`.

**Calcul.** On construit l'arbre par insertions (O(N × hauteur), au plus 500 000 étapes). Pour traiter les fils avant leur père sans récursion, on remarque que les descendants d'un nœud sont insérés **après** lui : parcourir l'ordre d'insertion à l'envers donne un ordre où chaque nœud vient après tous ses descendants. Les coefficients binomiaux modulo le nombre premier `p = 1 000 000 007` se calculent par `C(n, k) = n! × (k!)⁻¹ × ((n − k)!)⁻¹`, où l'inverse de `x` modulo `p` est `x^(p−2)` (petit théorème de Fermat, calculé par exponentiation rapide). On calcule une seule exponentiation, pour `(N!)⁻¹`, puis `((i − 1)!)⁻¹ = (i!)⁻¹ × i`.

**Pour vérifier.** Un ordre trié produit un chemin : une seule façon. Avec `3 4 5 1 2`, il y a `C(4, 2) = 6` ordres, car chaque côté est un chemin.
