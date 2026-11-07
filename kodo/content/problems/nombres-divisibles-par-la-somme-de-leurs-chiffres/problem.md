---
id: nombres-divisibles-par-la-somme-de-leurs-chiffres
title: Nombres divisibles par la somme de leurs chiffres
chapter: p1-synthese
order: 5
tags: [boucles, arithmétique]
samples: 2
---

## Énoncé
Compter les entiers compris entre `A` et `B` (inclus) qui sont divisibles par la somme de leurs chiffres.

Par exemple, `18` convient, car `1 + 8 = 9` et 18 est divisible par 9 ; `19` ne convient pas, car `1 + 9 = 10` ne divise pas 19.

## Entrée
Une seule ligne contenant deux entiers `A` et `B` séparés par une espace.

## Sortie
Un seul entier : le nombre d'entiers `n` tels que `A ≤ n ≤ B` et que `n` soit divisible par la somme de ses chiffres.

## Contraintes
- 1 ≤ A ≤ B ≤ 100 000

## Indices
1. Une boucle `for` sur les entiers `n` de `A` à `B`, et pour chacun une boucle `while` qui calcule la somme de ses chiffres.
2. La boucle `while` détruit le nombre qu'elle découpe : travailler sur une copie de `n`.
3. La somme des chiffres doit être remise à 0 pour chaque nouvel entier.

## Solution
On teste chaque entier de l'intervalle. Pour un entier `n`, on recopie `n` dans `m`, puis on calcule la somme `s` de ses chiffres avec `while m > 0`, `s = s + m % 10` et `m = m // 10`. L'entier convient si `n % s == 0`. Comme `n ≥ 1`, la somme `s` n'est jamais nulle, et la division est toujours possible.

Le nombre total de tours est au plus 100 000 × 6 = 600 000 : c'est rapide.

Les pièges sont ceux des boucles imbriquées : découper `n` directement (la boucle `for` est alors perturbée en Python, et le test `n % s` se fait sur 0), ou initialiser `s` une seule fois avant la boucle externe.
