---
id: tour-de-puissances-modulo-p
title: Tour de puissances modulo P
chapter: p4-arithmetique
order: 5
tags: [arithmétique, mathématiques]
samples: 1
---

## Énoncé
On note P = 1 000 000 007, qui est un nombre premier. Répondre à T questions : pour A, B et C donnés, afficher le reste de la division par P de A puissance (B puissance C), c'est-à-dire A^(B^C). Par exemple, pour A = 2, B = 3 et C = 2, on calcule 2⁹ = 512.

On convient que x⁰ = 1 pour tout x, y compris 0⁰ = 1.

## Entrée
La première ligne contient T. Chacune des T lignes suivantes contient trois entiers A, B et C.

## Sortie
T lignes : pour chaque question, A^(B^C) mod P.

## Contraintes
- 1 ≤ T ≤ 1 000
- 0 ≤ A, B, C ≤ 10¹⁸

## Indices
1. L'exposant B^C peut avoir 10¹⁹ chiffres : impossible de le calculer, même en Python. Il faut le réduire.
2. Petit théorème de Fermat : si A n'est pas un multiple de P, alors A^(P−1) ≡ 1 (mod P). L'exposant peut donc être pris modulo P − 1.
3. Attention aux cas où A est un multiple de P (la réponse vaut 0, sauf si l'exposant est nul) et où l'exposant est nul (B = 0 et C ≥ 1).

## Solution
**Réduire l'exposant.** Notons E = B^C. Si A n'est pas un multiple de P, le petit théorème de Fermat donne A^(P−1) ≡ 1 (mod P). En écrivant E = q × (P − 1) + r, on obtient A^E = (A^(P−1))^q × A^r ≡ A^r (mod P). Il suffit donc de calculer r = B^C mod (P − 1) par exponentiation rapide, puis A^r mod P, encore par exponentiation rapide. Attention : on réduit modulo P − 1, pas modulo P.

**Les cas particuliers.** Si A est un multiple de P (A = 0 ou A = P, 2P…), Fermat ne s'applique pas : A^E ≡ 0 si E ≥ 1, et A⁰ = 1. Or E = 0 exactement quand B = 0 et C ≥ 1 (avec la convention 0⁰ = 1, B = 0 et C = 0 donnent E = 1). Si A n'est pas un multiple de P, la formule de Fermat traite tous les cas, y compris E = 0 (r = 0) et E multiple de P − 1 non nul (r = 0 aussi, et A^E ≡ 1, ce qui est juste).

**Les pièges.** Réduire l'exposant modulo P au lieu de P − 1 ; oublier le cas A multiple de P, qui fait répondre 1 au lieu de 0 quand E est un multiple de P − 1. En C++, on réduit A et B avant de multiplier : un produit de deux restes inférieurs à P tient dans un `long long`. **Coût** : deux exponentiations rapides, environ 120 multiplications par question.
