---
id: somme-des-pgcd-de-toutes-les-paires
title: Somme des PGCD de toutes les paires
chapter: p3-synthese
order: 10
synthesis: true
tags: [mathématiques, arithmétique, listes]
samples: 2
---

## Énoncé
On dispose de N entiers strictement positifs a₁, …, a_N. Calculer la somme des PGCD de toutes les paires : la somme de pgcd(aᵢ, aⱼ) pour toutes les paires de positions i < j.

Par exemple, avec 4, 6, 9 et 12, les six paires ont pour PGCD 2, 1, 4, 3, 6 et 3 : la somme vaut 19.

## Entrée
La première ligne contient N. La deuxième ligne contient les N entiers.

## Sortie
La somme des PGCD de toutes les paires.

## Contraintes
- 1 ≤ N ≤ 20 000
- 1 ≤ aᵢ ≤ 100 000

## Indices
1. Il y a jusqu'à 2 × 10⁸ paires : calculer chaque PGCD avec l'algorithme d'Euclide est beaucoup trop lent. Regrouper plutôt les paires selon la valeur de leur PGCD : la réponse est la somme des d × E(d), où E(d) est le nombre de paires dont le PGCD vaut exactement d.
2. Compter les paires dont le PGCD est un **multiple** de d est facile : ce sont les paires dont les deux éléments sont des multiples de d. S'il y a c(d) tels éléments, cela fait c(d)(c(d) − 1)/2 paires. Les c(d) se calculent tous avec un tableau de fréquences, en parcourant d, 2d, 3d…
3. Les paires dont le PGCD est un multiple de d ont pour PGCD d, ou 2d, ou 3d… Donc E(d) = c(d)(c(d) − 1)/2 − E(2d) − E(3d) − … : calculer les E(d) de d = 100 000 jusqu'à d = 1.

## Solution
**Regrouper par PGCD.** Notons M la plus grande valeur, et E(d) le nombre de paires i < j avec pgcd(aᵢ, aⱼ) = d. La réponse vaut Σ d × E(d), pour d de 1 à M.

**Compter les multiples.** Avec un tableau de fréquences f (f[v] = nombre de positions de valeur v), le nombre de valeurs multiples de d vaut c(d) = f[d] + f[2d] + f[3d] + … Une paire a un PGCD multiple de d si et seulement si ses deux éléments sont multiples de d (d divise pgcd(x, y) exactement quand d divise x et y). Il y a donc P(d) = c(d)(c(d) − 1)/2 telles paires.

**Inclusion-exclusion.** Les paires comptées dans P(d) ont pour PGCD d, 2d, 3d…, chacune exactement une fois : P(d) = E(d) + E(2d) + E(3d) + … D'où E(d) = P(d) − E(2d) − E(3d) − …, qu'on calcule pour d décroissant, de M à 1 : au moment de calculer E(d), les E(kd) avec k ≥ 2 sont déjà connus. La correction se prouve par récurrence descendante sur d : pour d > M/2, il n'y a pas de terme à retirer, et E(d) = P(d).

**Coût.** Pour chaque d, on parcourt ses multiples jusqu'à M deux fois, soit environ 2 × M/d opérations. Le total vaut 2M × (1 + 1/2 + … + 1/M) ≈ 2M ln M, environ 2,4 millions d'opérations pour M = 10⁵ : O(N + M log M) grâce à la série harmonique. La méthode directe calcule N(N − 1)/2 ≈ 2 × 10⁸ PGCD, chacun en une dizaine d'étapes : plusieurs secondes en C++, des minutes en Python.

**Taille du résultat.** Jusqu'à 2 × 10⁸ paires de PGCD au plus 10⁵ : la somme peut approcher 2 × 10¹³, et c(d)² dépasse 2³¹ : `long long` en C++.

**Pour aller plus loin.** Le même schéma, compter les multiples puis retirer les multiples des multiples, sert à compter les paires premières entre elles (E(1)), ou les paires de PGCD donné : c'est un outil classique d'arithmétique en concours.
