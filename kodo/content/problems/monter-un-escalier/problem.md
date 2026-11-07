---
id: monter-un-escalier
title: Monter un escalier
chapter: p1-synthese
order: 9
tags: [boucles, mathématiques]
samples: 2
---

## Énoncé
On monte un escalier de `N` marches en partant du sol. À chaque pas, on monte de 1, 2 ou 3 marches, et on doit s'arrêter exactement sur la dernière marche. Deux montées sont différentes si leurs suites de pas sont différentes : monter de 1 puis de 2 n'est pas la même chose que monter de 2 puis de 1.

Par exemple, il y a 7 façons de monter 4 marches : `1+1+1+1`, `1+1+2`, `1+2+1`, `2+1+1`, `2+2`, `1+3` et `3+1`.

Afficher le nombre de façons de monter l'escalier.

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
Un seul entier : le nombre de façons de monter les `N` marches.

## Contraintes
- 1 ≤ N ≤ 70
- La réponse peut dépasser 10¹⁸ : en C++, utiliser des `long long`.

## Indices
1. Le nombre de façons devient énorme : impossible d'énumérer les montées une par une. Il faut trouver comment le nombre de façons pour `n` marches se déduit des nombres pour les escaliers plus petits.
2. Regarder le **dernier pas** d'une montée de `n` marches : il fait 1, 2 ou 3 marches. Avant ce dernier pas, on a monté `n - 1`, `n - 2` ou `n - 3` marches.
3. En notant `W(n)` le nombre de façons, on a `W(n) = W(n - 1) + W(n - 2) + W(n - 3)`, avec `W(0) = 1` (une seule façon de monter 0 marche : ne rien faire). Il suffit de garder les trois dernières valeurs dans trois variables.

## Solution
Notons `W(n)` le nombre de façons de monter `n` marches. On classe les montées selon leur **dernier pas** :
- s'il fait 1 marche, ce qui précède est une montée de `n - 1` marches, et il y en a `W(n - 1)` ;
- s'il fait 2 marches, ce qui précède est une montée de `n - 2` marches : `W(n - 2)` possibilités ;
- s'il fait 3 marches, `W(n - 3)` possibilités.

Ces trois groupes ne se recoupent pas et couvrent toutes les montées, donc `W(n) = W(n - 1) + W(n - 2) + W(n - 3)`. On fixe `W(0) = 1` (la montée vide), et `W(n) = 0` pour `n` négatif. On retrouve `W(1) = 1`, `W(2) = 2`, `W(3) = 4`, `W(4) = 7`.

Sans tableau, on garde seulement les trois dernières valeurs : `a = W(n - 3)`, `b = W(n - 2)`, `c = W(n - 1)`. À chaque tour, on calcule `nouveau = a + b + c`, puis on décale : `a` prend la valeur de `b`, `b` celle de `c`, et `c` celle de `nouveau`. L'ordre des trois affectations est important : si on écrivait d'abord `b = c`, l'ancienne valeur de `b` serait perdue avant d'être copiée dans `a`.

Cette idée, calculer une réponse à partir des réponses de problèmes plus petits, s'appelle la **programmation dynamique**. Elle sera étudiée en détail plus tard. La réponse pour `N = 70` dépasse 2 × 10¹⁸ : en C++, il faut des `long long`.
