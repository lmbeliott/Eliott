---
id: meilleurs-compromis-prix-qualite
title: Meilleurs compromis prix-qualité
chapter: p3-tris-simples
order: 8
synthesis: true
tags: [tri, chaînes, mathématiques]
samples: 2
---

## Énoncé
Un comparateur connaît `N` produits. Chacun a un nom, une note de qualité `Q` et un prix `P`. Un produit A est **dépassé** par un produit B si B est au moins aussi bon (`Q_B ≥ Q_A`) et au moins aussi bon marché (`P_B ≤ P_A`), et différent de A sur au moins un des deux critères. Deux produits qui ont la même note et le même prix ne se dépassent donc pas l'un l'autre.

Afficher les produits qui ne sont dépassés par aucun autre.

## Entrée
La première ligne contient `N`. Les `N` lignes suivantes décrivent chacune un produit : son nom, puis `Q`, puis `P`, séparés par des espaces. Les noms sont formés de lettres minuscules et sont tous différents.

## Sortie
Sur la première ligne, le nombre `K` de produits non dépassés. Puis leurs noms, un par ligne, par prix croissant ; à prix égal, par ordre alphabétique.

## Contraintes
- 1 ≤ N ≤ 8 000
- 0 ≤ Q ≤ 1 000
- 1 ≤ P ≤ 10⁶
- chaque nom a de 1 à 10 lettres

## Indices
1. Comparer chaque produit à tous les autres coûte N² opérations, 64 millions : trop pour Python.
2. Trier les produits par prix croissant. Un produit ne peut être dépassé que par un produit placé avant lui… à condition de bien choisir l'ordre des produits de même prix.
3. Trier par prix croissant, puis par note **décroissante**. En parcourant la liste, garder la meilleure note rencontrée jusque-là. Attention aux produits identiques (même note, même prix) : ils doivent être traités ensemble.

## Solution
On trie les produits selon la clé `(P, −Q, nom)` : prix croissant, puis note décroissante, puis nom. On les parcourt dans cet ordre en gardant `meilleure`, la plus grande note parmi les produits déjà traités, et on traite d'un coup chaque **groupe** de produits identiques (même `P`, même `Q`) : ils sont consécutifs dans l'ordre trié.

**Invariant.** Avant de traiter un groupe de note `Q` et de prix `P`, les produits déjà traités sont exactement ceux qui sont moins chers que `P`, ou au même prix avec une meilleure note que `Q`. Chacun d'eux est différent du groupe sur au moins un critère et coûte au plus `P`. Donc le groupe est dépassé si et seulement si l'un d'eux a une note au moins égale à `Q`, c'est-à-dire si `meilleure ≥ Q`. Les produits traités plus tard sont plus chers, ou au même prix avec une note plus faible : aucun ne peut dépasser le groupe. On garde donc le groupe entier quand `Q > meilleure`, puis on met `meilleure` à jour.

**Ordre d'affichage.** Les produits gardés sortent par prix croissant. Deux produits gardés de même prix ont forcément la même note (sinon le meilleur dépasserait l'autre) : la clé les range alors par nom, comme demandé.

**Coût.** Le tri, puis un seul passage. Les pièges : trier les produits de même prix par note croissante (un produit serait gardé avant que l'on voie celui qui le dépasse), utiliser `≥` au lieu de `>`, ou considérer qu'un produit identique en dépasse un autre.
