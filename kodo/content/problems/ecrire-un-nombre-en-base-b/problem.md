---
id: ecrire-un-nombre-en-base-b
title: Écrire un nombre en base B
chapter: p1-tant-que
order: 8
synthesis: true
tags: [boucles, arithmétique]
samples: 3
---

## Énoncé
En base 10, `347 = 3 × 100 + 4 × 10 + 7 × 1` : les chiffres sont les coefficients des puissances de 10. En **base B**, on utilise les puissances de `B` (1, `B`, `B × B`, …) et des chiffres compris entre `0` et `B - 1`. Par exemple, en base 2, `13 = 1 × 8 + 1 × 4 + 0 × 2 + 1 × 1` s'écrit `1101`, avec les chiffres `1`, `1`, `0` et `1`.

Afficher le nombre de chiffres de `N` écrit en base `B`, puis ces chiffres, du plus fort (à gauche) au plus faible (à droite). L'écriture ne commence jamais par `0`, sauf pour le nombre `0` lui-même, qui s'écrit avec un seul chiffre `0`.

## Entrée
Une seule ligne contenant deux entiers `N` et `B` séparés par une espace.

## Sortie
- Sur la première ligne, le nombre `K` de chiffres de `N` en base `B`.
- Sur les `K` lignes suivantes, les chiffres, un par ligne, de gauche à droite. Chaque chiffre est écrit comme un nombre en base 10 : en base 16, le chiffre qui vaut onze s'écrit `11`.

## Contraintes
- 0 ≤ N ≤ 10¹²
- 2 ≤ B ≤ 16
- En C++, utiliser des `long long`.

## Indices
1. `N % B` donne le chiffre le plus faible (le plus à droite) et `N // B` l'enlève, exactement comme `% 10` et `// 10` en base 10. Mais on obtient alors les chiffres de droite à gauche, et il faut les afficher de gauche à droite.
2. Commencer par chercher la plus grande puissance de `B` qui ne dépasse pas `N` : partir de `p = 1` et multiplier par `B` tant que `p × B ≤ N`. Le nombre de chiffres est le nombre de puissances parcourues.
3. Ensuite, tant que `p > 0` : le chiffre courant est `N // p`, on retire sa contribution avec `N = N % p`, puis on passe à la puissance suivante avec `p = p // B`.

## Solution
Le problème se fait en deux boucles `while` successives.

**Première boucle : trouver le chiffre de gauche.** On part de `p = 1` et `K = 1`, et tant que `p × B ≤ N`, on multiplie `p` par `B` et on ajoute 1 à `K`. À la fin, `p` est la plus grande puissance de `B` qui ne dépasse pas `N`, et `K` le nombre de chiffres. Pour `N = 13` et `B = 2`, `p` passe par 1, 2, 4 et 8, et `K` vaut 4. Pour `N = 0`, la boucle ne fait aucun tour : `p = 1` et `K = 1`, ce qui est juste.

**Deuxième boucle : extraire les chiffres de gauche à droite.** Tant que `p > 0`, le chiffre devant `p` est `N // p` ; on l'affiche, on enlève sa contribution avec `N = N % p`, puis on divise `p` par `B`. Pour `13` : `13 // 8 = 1` (reste 5), `5 // 4 = 1` (reste 1), `1 // 2 = 0` (reste 1), `1 // 1 = 1`. On affiche les chiffres `1`, `1`, `0` et `1`.

Une idée tentante est de construire le nombre « retourné » avec `r = r × B + chiffre`, puis de le redécouper. Elle échoue quand `N` se termine par des zéros en base `B` : ces zéros passent en tête du retourné et disparaissent. Par exemple, `4` s'écrit `100` en base 2, mais son retourné vaut simplement `1`.

En C++, `p × B` peut dépasser la limite d'un `int` : on utilise des `long long`.
