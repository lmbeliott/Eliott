---
id: concatenations-divisibles-par-k
title: Concaténations divisibles par K
chapter: p3-recursivite
order: 5
tags: [récursivité, mathématiques]
samples: 2
---

## Énoncé
On a N cartes, chacune portant un entier. En posant toutes les cartes côte à côte, dans un certain ordre, on lit un grand nombre. Par exemple, les cartes 12, 5 et 3 posées dans l'ordre 5, 3, 12 donnent 5312.

Compter les ordres de pose pour lesquels le nombre obtenu est divisible par K. Les cartes sont toutes considérées comme différentes, même si deux d'entre elles portent le même entier : il y a N! ordres en tout.

## Entrée
La première ligne contient N et K. La deuxième ligne contient les N entiers des cartes.

## Sortie
Le nombre d'ordres de pose qui donnent un multiple de K.

## Contraintes
- 1 ≤ N ≤ 8
- 1 ≤ K ≤ 10⁹
- 1 ≤ entier d'une carte ≤ 10⁹

## Indices
1. Il y a au plus 8! = 40 320 ordres : on peut tous les essayer. Une fonction récursive choisit la carte suivante parmi celles qui ne sont pas encore posées, en marquant les cartes utilisées dans une liste de booléens.
2. Le nombre obtenu peut avoir 80 chiffres. Inutile de le construire : seul son reste dans la division par K compte. Poser la carte x, de c chiffres, à droite d'un nombre de reste r donne le reste `(r × 10^c + x) mod K`.
3. Pour éviter les dépassements en C++, calculer d'avance `10^c mod K` pour chaque carte.

## Solution
On écrit une fonction récursive `compter(posees, r)` : `posees` cartes sont déjà posées, et le nombre déjà formé a pour reste `r` modulo K. Elle renvoie le nombre de façons de terminer la pose avec un multiple de K.

- Si `posees = N`, le nombre est complet : on renvoie 1 si `r = 0`, et 0 sinon.
- Sinon, pour chaque carte `i` non utilisée : on la marque, on ajoute `compter(posees + 1, (r × p[i] + x[i]) mod K)`, où `p[i] = 10^c mod K` et `c` est le nombre de chiffres de `x[i]`, puis on la démarque.

**Pourquoi le reste suffit.** Écrire x, de c chiffres, à la droite d'un nombre A donne `A × 10^c + x`. Le reste de cette somme ne dépend que des restes de A, de `10^c` et de x : on peut réduire modulo K à chaque étape sans changer le résultat final.

**Correction.** Par récurrence sur le nombre de cartes restantes : chaque façon de terminer la pose commence par le choix d'une carte non utilisée, puis se termine d'une façon comptée par l'appel récursif ; deux choix différents donnent des ordres différents, donc la somme compte chaque ordre une fois.

**Coût.** L'arbre des appels a N! feuilles, et à chaque niveau on parcourt les N cartes : environ 8! × 8 ≈ 320 000 opérations au plus. En C++, `r × p[i]` peut atteindre 10¹⁸ : il faut des `long long`.
