---
id: quadruplets-de-somme-nulle
title: Quadruplets de somme nulle
chapter: p2-synthese
order: 8
tags: [dictionnaires, mathématiques, listes]
samples: 2
---

## Énoncé
Quatre listes `A`, `B`, `C` et `D` contiennent chacune `N` entiers. Compter les quadruplets de positions `(i, j, k, l)` tels que `A[i] + B[j] + C[k] + D[l] = 0`.

Par exemple, avec `A = 1 -2`, `B = 3 0`, `C = -1 2` et `D = 0 -2`, il y a 3 quadruplets : `1 + 0 - 1 + 0`, `-2 + 3 - 1 + 0` et `-2 + 0 + 2 + 0`.

## Entrée
La première ligne contient `N`. Les quatre lignes suivantes contiennent respectivement les listes `A`, `B`, `C` et `D`, chacune formée de `N` entiers séparés par des espaces.

## Sortie
Un seul entier : le nombre de quadruplets.

## Contraintes
- 1 ≤ N ≤ 400
- -10⁸ ≤ chaque entier ≤ 10⁸
- La réponse peut dépasser 10¹⁰ : en C++, utiliser des `long long`.

## Indices
1. Essayer tous les quadruplets fait N⁴, soit 2,56 × 10¹⁰ cas. Même en fixant trois valeurs et en cherchant la quatrième dans un ensemble, il reste N³ = 64 millions d'étapes : trop pour Python.
2. Couper en deux moitiés : `A[i] + B[j] = -(C[k] + D[l])`. Il n'y a que N² = 160 000 sommes `A[i] + B[j]`.
3. Ranger dans un dictionnaire le nombre de façons d'obtenir chaque somme `A[i] + B[j]`. Pour chaque couple `(k, l)`, ajouter le nombre de façons d'obtenir `-(C[k] + D[l])`.

## Solution
L'idée est de **couper le problème en deux moitiés** qui se rencontrent au milieu. L'égalité `A[i] + B[j] + C[k] + D[l] = 0` s'écrit aussi `A[i] + B[j] = -(C[k] + D[l])`.

1. On parcourt les N² couples `(i, j)` et on compte dans un dictionnaire `sommes_ab` combien de fois chaque somme `A[i] + B[j]` est obtenue.
2. On parcourt les N² couples `(k, l)`. Pour chacun, les quadruplets qui le complètent sont exactement les couples `(i, j)` dont la somme vaut `-(C[k] + D[l])` : il y en a `sommes_ab.get(-(C[k] + D[l]), 0)`, que l'on ajoute au total.

Chaque quadruplet est compté exactement une fois : au moment où l'on traite son couple `(k, l)`, dans le nombre de couples `(i, j)` qui conviennent.

On fait ainsi 2 × N² = 320 000 opérations sur le dictionnaire, au lieu de 2,56 × 10¹⁰ comparaisons pour la méthode directe. Les valeurs du dictionnaire comptent des couples, pas des positions : si plusieurs couples `(i, j)` donnent la même somme, ils sont tous comptés.

La réponse peut atteindre 400⁴ = 2,56 × 10¹⁰ (tout vaut 0) : en C++, il faut des `long long` pour le total et pour les valeurs du dictionnaire.
