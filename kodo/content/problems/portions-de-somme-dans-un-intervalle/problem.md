---
id: portions-de-somme-dans-un-intervalle
title: Portions de somme dans un intervalle
chapter: p4-diviser-regner
order: 6
tags: [sommes-préfixes, tri, récursivité]
samples: 2
time_limit_ms: 500
---

## Énoncé
On donne une suite de N entiers a₁, …, a_N, positifs ou négatifs, et deux entiers L ≤ R. Une **portion** est une suite de cases consécutives aᵢ, …, a_j avec i ≤ j.

Compter les portions dont la somme est comprise entre L et R (inclus).

La suite est fabriquée par une formule, pour que l'entrée reste courte : u₁ = X, puis u_{k+1} = (u_k × B + C) mod M, et a_k = u_k − D. Par exemple, avec N = 4, X = 1, B = 3, C = 2, M = 7 et D = 3, les u_k valent 1, 5, 3, 4 et la suite est −2, 2, 0, 1.

## Entrée
La première ligne contient N, L et R. La deuxième ligne contient X, B, C, M et D.

## Sortie
Le nombre de portions dont la somme est entre L et R.

## Contraintes
- 1 ≤ N ≤ 100 000
- 1 ≤ M ≤ 10⁹ ; 0 ≤ X, B, C < M ; 0 ≤ D ≤ M
- −10¹⁴ ≤ L ≤ R ≤ 10¹⁴

## Indices
1. Avec les sommes préfixes P₀ = 0 et P_k = a₁ + … + a_k, la portion de i + 1 à j a pour somme P_j − P_i. On compte les paires i < j telles que L ≤ P_j − P_i ≤ R.
2. Les valeurs peuvent être négatives : la fenêtre glissante ne marche pas. Diviser la suite P en deux moitiés, et compter récursivement les paires de chaque moitié.
3. Pour les paires à cheval, on peut supposer les deux moitiés triées. Quand P_i augmente à gauche, les P_j de droite qui conviennent forment un bloc [P_i + L, P_i + R] qui se déplace vers la droite : deux indices qui avancent suffisent.

## Solution
**Sommes préfixes.** Avec P₀ = 0 et P_k = a₁ + … + a_k, la portion de i + 1 à j (0 ≤ i < j ≤ N) a pour somme P_j − P_i. On compte donc les paires d'indices i < j de la suite P₀, …, P_N telles que L ≤ P_j − P_i ≤ R. Comme les valeurs peuvent être négatives, P n'est pas croissante, et les deux pointeurs du niveau 3 ne s'appliquent pas directement.

**Diviser pour régner.** On découpe P en deux moitiés. Les paires dont les deux indices sont dans la même moitié sont comptées récursivement. Pour une paire à cheval, i est à gauche et j à droite, et la condition i < j est automatique : seules les valeurs comptent. On peut donc supposer chaque moitié **triée** (la récursion renvoie la moitié triée, comme le tri fusion). Pour chaque valeur v de la moitié gauche, dans l'ordre croissant, les valeurs w de la moitié droite qui conviennent sont celles de [v + L, v + R] : elles forment un bloc de la moitié droite triée, de l'indice `bas` (premier w ≥ v + L) à l'indice `haut` (premier w > v + R) exclu. Quand v augmente, les deux bornes augmentent, donc `bas` et `haut` ne reculent jamais : on les fait avancer, et on ajoute `haut − bas`. Ce comptage coûte O(longueur) ; puis on fusionne les deux moitiés.

**Coût.** Chaque niveau de récursion fait un travail linéaire, sur environ log₂ N niveaux : O(N log N). Essayer toutes les portions coûterait N²/2 = 5 × 10⁹ opérations. Les sommes atteignent 5 × 10¹³ en valeur absolue, et la réponse 5 × 10⁹ : `long long` en C++.
