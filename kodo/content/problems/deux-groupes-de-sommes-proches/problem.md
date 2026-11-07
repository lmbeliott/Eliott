---
id: deux-groupes-de-sommes-proches
title: Deux groupes de sommes proches
chapter: n3-recursivite
order: 6
tags: [récursivité, tri, dichotomie]
samples: 2
---

## Énoncé
On te donne N entiers positifs. Tu dois les répartir en deux groupes : chaque nombre va dans exactement un des deux groupes, et un groupe peut rester vide.

Écris un programme qui calcule la plus petite différence possible entre la somme du premier groupe et la somme du second.

## Entrée
- La première ligne contient un entier N.
- La deuxième ligne contient les N entiers.

## Sortie
Un seul entier : la plus petite valeur possible de |somme du groupe 1 − somme du groupe 2|.

## Contraintes
- 1 ≤ N ≤ 36
- Chaque entier est entre 1 et 10¹².

## Indices
1. Il y a 2ᴺ répartitions, soit environ 7 × 10¹⁰ pour N = 36 : trop pour les essayer toutes. Les nombres sont trop grands pour un tableau indexé par les sommes. Mais 2¹⁸ ≈ 260 000, c'est peu.
2. Coupe la liste en deux moitiés. Pour chaque moitié, calcule les sommes de tous ses sous-ensembles (2¹⁸ sommes chacune). Un groupe 1 est fait d'un sous-ensemble de la première moitié et d'un sous-ensemble de la seconde.
3. Si le groupe 1 a pour somme s, la différence vaut |total − 2s|. Trie les sommes de la seconde moitié. Pour chaque somme a de la première moitié, cherche par dichotomie la somme b de la seconde qui rend 2 × (a + b) le plus proche possible de total : il suffit de regarder la première qui atteint ou dépasse ce but, et celle juste avant.

## Solution
**Se ramener à une somme cible.** Si le groupe 1 a pour somme s, le groupe 2 a pour somme `total − s`, et la différence vaut `|total − 2s|`. On cherche donc la somme de sous-ensemble la plus proche de `total / 2`.

**L'idée : couper en deux (« rencontre au milieu »).** On sépare la liste en deux moitiés de N/2 nombres. On énumère les sous-ensembles de chaque moitié et leurs sommes : chaque nombre est pris ou non, ce qui double la liste des sommes à chaque nombre. On obtient deux listes `gauche` et `droite` d'au plus 2¹⁸ = 262 144 sommes. Un groupe 1 correspond exactement à un choix d'une somme a dans `gauche` et d'une somme b dans `droite`, avec s = a + b.

On trie `droite`. Pour chaque a, la meilleure valeur de b est juste autour de `total / 2 − a`. Par dichotomie, on trouve la première somme b telle que `2 × (a + b) ≥ total` : elle donne la différence `2 × (a + b) − total`. La somme juste avant donne `total − 2 × (a + b)`. Aucune autre somme de `droite` ne peut faire mieux pour ce a : elles sont plus loin de la cible.

Sur le premier exemple (7 3 2 9 4, total 25), le groupe {9, 3} a pour somme 12 et l'autre groupe 13 : la différence est 1, et elle ne peut pas être nulle car le total est impair.

**Complexité.** Énumérer les sommes coûte O(2^(N/2)) pour chaque moitié, le tri O(2^(N/2) × N/2), et les recherches aussi : environ 262 144 × 18 ≈ 5 × 10⁶ opérations pour N = 36.

**Pourquoi la solution naïve est trop lente.** Essayer les 2³⁶ ≈ 7 × 10¹⁰ répartitions prendrait des minutes en C++ et des jours en Python. La programmation dynamique sur les sommes possibles (un tableau de booléens indexé par la somme) ne marche pas non plus : les sommes vont jusqu'à 3,6 × 10¹³.

**Pièges.**
- Les sommes dépassent 2³¹ : utilise des `long long` en C++.
- Regarde les **deux** candidats autour de la cible : la première somme qui atteint le but et celle juste avant. Quand la dichotomie renvoie le début ou la fin de la liste, l'un des deux n'existe pas.
- Il suffit de trier une seule des deux listes : on parcourt l'autre dans n'importe quel ordre.
