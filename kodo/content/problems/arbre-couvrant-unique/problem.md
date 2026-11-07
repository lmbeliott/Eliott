---
id: arbre-couvrant-unique
title: Arbre couvrant unique
chapter: p4-union-find
order: 7
tags: [graphes, union-find, tri]
samples: 2
---

## Énoncé
Un graphe non orienté et connexe a `N` sommets et `M` arêtes ; chaque arête a un poids. Afficher le poids d'un arbre couvrant de poids minimal, puis dire si cet arbre est **unique**.

Deux arbres couvrants sont différents s'ils n'ont pas exactement les mêmes arêtes ; deux arêtes parallèles comptent comme deux arêtes différentes.

## Entrée
- La première ligne contient `N` et `M`.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `W` : une arête de poids `W` relie `A` et `B`.

## Sortie
Deux lignes : le poids minimal d'un arbre couvrant, puis `OUI` si un seul arbre couvrant a ce poids, `NON` sinon.

## Contraintes
- 1 ≤ N ≤ 8 000
- N − 1 ≤ M ≤ 8 000
- 1 ≤ A, B ≤ N
- 1 ≤ W ≤ 10⁶
- le graphe est connexe

## Indices
1. Si tous les poids sont différents, l'arbre est toujours unique. Les difficultés viennent des arêtes de même poids.
2. Dans Kruskal, traiter ensemble toutes les arêtes d'un même poids `w`. Juste avant ce groupe, une arête du groupe est **utile** si ses extrémités sont dans deux composantes différentes.
3. L'arbre est unique si et seulement si, pour chaque poids, le nombre d'arêtes utiles est égal au nombre d'arêtes que Kruskal choisit dans le groupe.

## Solution
On applique **Kruskal** en traitant les arêtes **par groupes de même poids**. Pour un groupe de poids `w`, on compte d'abord les arêtes **utiles** : celles dont les extrémités sont dans des composantes différentes avant le groupe. Puis on traite le groupe normalement, en comptant les arêtes choisies. Si un groupe a plus d'arêtes utiles que d'arêtes choisies, l'arbre n'est pas unique.

**Pourquoi c'est juste.** Notons `G_(<w)` le graphe des arêtes de poids strictement inférieur à `w`. Soit `T` un arbre couvrant minimal quelconque.

- *Les arêtes de `T` de poids `< w` relient exactement les composantes de `G_(<w)`.* Sinon, une arête `e` de poids `< w` relierait deux parties que `T` ne relie qu'avec une arête `f` de poids `≥ w` (sur le chemin de `T` entre les extrémités de `e`) ; échanger `f` contre `e` donnerait un arbre plus léger.
- Donc une arête de poids `w` qui n'est pas utile fermerait un cycle avec les arêtes plus légères de `T` : `T` n'en contient aucune. Et `T` contient exactement autant d'arêtes de poids `w` que Kruskal en choisit, puisque dans les deux cas elles font passer des composantes de `G_(<w)` à celles des arêtes de poids `≤ w`.
- Si, pour chaque poids, utiles = choisies, alors `T` contient toutes les arêtes utiles de chaque poids, et rien d'autre : tous les arbres minimaux sont égaux.
- Si un groupe a une arête utile `e` non choisie, on relance Kruskal en plaçant `e` en tête de son groupe : elle est choisie. Kruskal donne un arbre minimal quel que soit l'ordre des égalités, et ce second arbre contient `e`, pas le premier : il y en a au moins deux.

**Complexité.** O(M log M) pour le tri, puis deux passages par groupe avec l'Union-Find.

**Pièges.** Compter les arêtes utiles **avant** de fusionner quoi que ce soit dans le groupe : après les premières fusions, une arête utile peut sembler inutile. Deux arêtes parallèles de même poids, toutes deux utiles, rendent l'arbre non unique. Une boucle n'est jamais utile. Le poids peut dépasser 2³¹ : `long long` en C++. Pour `N = 1`, l'arbre vide est unique, de poids `0`.
