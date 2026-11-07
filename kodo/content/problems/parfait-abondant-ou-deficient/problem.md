---
id: parfait-abondant-ou-deficient
title: Parfait, abondant ou déficient
chapter: p2-fonctions
order: 4
tags: [fonctions, mathématiques]
samples: 2
---

## Énoncé
Les **diviseurs propres** d'un entier `N` sont ses diviseurs autres que `N` lui-même. Par exemple, ceux de 12 sont 1, 2, 3, 4 et 6. Soit `S` leur somme. Le nombre `N` est :
- **parfait** si `S = N` (comme 6 = 1 + 2 + 3) ;
- **abondant** si `S > N` (comme 12, car 1 + 2 + 3 + 4 + 6 = 16) ;
- **déficient** si `S < N` (comme 10, car 1 + 2 + 5 = 8).

Classer plusieurs nombres.

## Entrée
- La première ligne contient l'entier `Q`.
- Chacune des `Q` lignes suivantes contient un entier `N`.

## Sortie
`Q` lignes : pour chaque nombre, dans l'ordre, `PARFAIT`, `ABONDANT` ou `DEFICIENT`.

## Contraintes
- 1 ≤ Q ≤ 20
- 1 ≤ N ≤ 10⁹

## Indices
1. Écrire une fonction `somme_diviseurs_propres(n)`. Essayer tous les diviseurs jusqu'à `n - 1` est beaucoup trop lent pour `n = 10⁹`.
2. Les diviseurs vont par paires : si `d` divise `n`, alors `n / d` aussi. Il suffit de parcourir les `d` tels que `d × d ≤ n`, et d'ajouter à chaque fois `d` et `n / d`.
3. Attention à deux cas : quand `d × d = n`, la paire ne contient qu'un seul nombre ; et `n` lui-même (associé à `d = 1`) ne doit pas être compté.

## Solution
Une fonction `somme_diviseurs_propres(n)` calcule `S`, puis une fonction `classer(n)` compare `S` à `n` et renvoie le mot à afficher.

Pour calculer `S` vite, on regroupe les diviseurs par paires `(d, n / d)` avec `d ≤ n / d`, c'est-à-dire `d × d ≤ n`. On parcourt donc `d` de 1 tant que `d × d ≤ n`, et quand `d` divise `n` on ajoute `d` et `n / d`. Cela fait au plus 31 623 tours pour `n = 10⁹`, au lieu d'un milliard.

Deux corrections sont nécessaires :
- si `d × d = n`, les deux nombres de la paire sont égaux : on n'ajoute `d` qu'une fois. Sans cela, 16 aurait pour somme 1 + 2 + 4 + 4 + 8 = 19 et serait déclaré abondant, alors que 1 + 2 + 4 + 8 = 15 ;
- la paire `(1, n)` contient `n` lui-même, qui n'est pas un diviseur propre : on retire `n` à la fin. Pour `n = 1`, il n'y a aucun diviseur propre, `S = 0`, et 1 est déficient.

Les nombres parfaits sont rares : jusqu'à 10⁹, il n'y a que 6, 28, 496, 8 128 et 33 550 336.
