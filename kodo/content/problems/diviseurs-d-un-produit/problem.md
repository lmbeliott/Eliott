---
id: diviseurs-d-un-produit
title: Diviseurs d'un produit
chapter: p4-arithmetique
order: 8
synthesis: true
tags: [arithmétique, mathématiques]
samples: 2
---

## Énoncé
On donne N entiers a₁, …, a_N, et on note P leur produit. Afficher le nombre de diviseurs de P et la somme des diviseurs de P, chacun modulo 1 000 000 007.

Par exemple, avec 4, 6 et 5, on a P = 120 = 2³ × 3 × 5 : il a 16 diviseurs, de somme 360.

## Entrée
La première ligne contient N. La deuxième ligne contient les N entiers.

## Sortie
Deux entiers sur une ligne : le nombre de diviseurs de P et la somme des diviseurs de P, modulo 1 000 000 007.

## Contraintes
- 1 ≤ N ≤ 10 000
- 1 ≤ aᵢ ≤ 10⁶

## Indices
1. P peut avoir des dizaines de milliers de chiffres : il ne faut pas le calculer. Sa décomposition en facteurs premiers s'obtient en additionnant les exposants de celles des aᵢ.
2. Pour décomposer vite 10 000 nombres au plus égaux à 10⁶, calculer une fois le plus petit facteur premier de chaque entier jusqu'à 10⁶, avec un crible.
3. La somme des diviseurs fait intervenir 1 + p + … + p^e = (p^(e+1) − 1) / (p − 1). Modulo un nombre premier, diviser par p − 1, c'est multiplier par son inverse, donné par le petit théorème de Fermat.

## Solution
**Décomposer sans calculer P.** Si chaque aᵢ est décomposé en facteurs premiers, l'exposant d'un nombre premier p dans P est la somme de ses exposants dans les aᵢ. On calcule d'abord, avec un crible, le plus petit facteur premier pf[x] de chaque x ≤ 10⁶ : pour chaque premier p, on parcourt ses multiples à partir de p² et on note p dans ceux qui n'ont pas encore de facteur. Ensuite, décomposer x revient à diviser par pf[x] tant que x > 1 : au plus 20 divisions, puisque chaque division divise x au moins par 2.

**Les formules.** Si P = p₁^e₁ × … × p_k^e_k, son nombre de diviseurs est (e₁ + 1) × … × (e_k + 1), et la somme de ses diviseurs est le produit des Sᵢ = 1 + pᵢ + … + pᵢ^eᵢ. Les exposants atteignent 200 000 : on calcule tout modulo M = 1 000 000 007, qui est premier.

**Diviser modulo M.** On écrit Sᵢ = (pᵢ^(eᵢ+1) − 1) / (pᵢ − 1). Comme M est premier et 1 ≤ pᵢ − 1 < M, le petit théorème de Fermat donne l'inverse de pᵢ − 1 : (pᵢ − 1)^(M−2). Sᵢ mod M vaut donc (pᵢ^(eᵢ+1) − 1) × (pᵢ − 1)^(M−2) mod M, avec deux exponentiations rapides. En C++, on ajoute M à pᵢ^(eᵢ+1) − 1 avant de prendre le reste, pour ne jamais manipuler de reste négatif.

**Coût.** O(V log log V) pour le crible avec V = 10⁶, puis au plus 20 divisions par nombre, puis deux exponentiations rapides par nombre premier de P. Décomposer chaque aᵢ par divisions successives, jusqu'à √aᵢ ≤ 1 000, marche aussi, mais coûte jusqu'à 10⁷ divisions : le crible est bien plus rapide. Calculer P puis chercher ses diviseurs serait sans espoir.
