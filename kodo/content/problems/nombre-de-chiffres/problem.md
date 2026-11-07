---
id: nombre-de-chiffres
title: Nombre de chiffres
chapter: p1-tant-que
order: 2
tags: [boucles, arithmétique]
samples: 2
---

## Énoncé
Afficher le nombre de chiffres de l'entier `N`, écrit normalement en base 10, sans zéro inutile devant.

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
Un seul entier : le nombre de chiffres de `N`.

## Contraintes
- 0 ≤ N ≤ 10¹⁸ (en C++, utiliser un `long long`)

## Indices
1. `N // 10` (en C++, `N / 10`) enlève le dernier chiffre de `N`. Combien de fois peut-on l'appliquer avant d'arriver à `0` ?
2. Compter les tours d'une boucle `while` qui continue tant que `N > 0`.
3. Le nombre `0` s'écrit avec un chiffre, mais la boucle ne fait alors aucun tour.

## Solution
Chaque division entière par 10 enlève exactement un chiffre. On compte donc les tours d'une boucle `while n > 0: n = n // 10`. Pour `2026`, `n` passe par 202, 20, 2 et 0 : quatre tours, quatre chiffres.

Le cas `N = 0` est le piège : la boucle ne fait aucun tour et le compteur reste à 0, alors que `0` s'écrit avec un chiffre. On le traite à part avec un `if`.

En C++, `10¹⁸` ne tient pas dans un `int` (limité à environ 2 × 10⁹) : il faut un `long long`.
