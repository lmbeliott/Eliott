---
id: ordre-des-taches-en-retard
title: Ordre des tâches en retard
chapter: n4-dynamique-avancee
order: 1
tags: [programmation-dynamique, bits]
samples: 2
---

## Énoncé
Une machine doit effectuer `N` tâches, une à la fois, sans pause, à partir de l'instant `0`. La tâche `i` dure `P[i]`, doit être finie avant la limite `D[i]` et a une importance `W[i]`.

Si la tâche `i` se termine à l'instant `C`, sa pénalité vaut `W[i] × (C - D[i])` lorsque `C > D[i]`, et `0` sinon.

Écris un programme qui calcule la plus petite pénalité totale possible, en choisissant l'ordre des tâches.

## Entrée
- La première ligne contient l'entier `N`.
- Les `N` lignes suivantes contiennent chacune trois entiers `P[i]`, `D[i]` et `W[i]`.

## Sortie
Un seul entier : la plus petite pénalité totale.

## Contraintes
- 1 ≤ N ≤ 18
- 1 ≤ P[i] ≤ 100 000
- 0 ≤ D[i] ≤ 2 000 000
- 1 ≤ W[i] ≤ 10 000

## Indices
1. Essayer les `N!` ordres est hors de question (18! ≈ 6 × 10¹⁵). Mais si on sait quelles tâches ont été faites en premier, on connaît l'instant présent, quel que soit leur ordre.
2. Représente un ensemble de tâches par un masque de bits `m`. Calcule `meilleur[m]`, la plus petite pénalité quand les tâches de `m` sont faites en premier.
3. Dans `m`, une des tâches `j` est faite en dernier : elle se termine à l'instant `fin[m]`, la somme des durées de `m`. Donc `meilleur[m] = min sur j dans m de meilleur[m sans j] + pénalité de j terminée à fin[m]`.

## Solution
**L'observation clé.** Quand les tâches d'un ensemble `m` ont été faites en premier, l'instant présent vaut `fin[m]`, la somme de leurs durées, quel que soit l'ordre suivi. Pour la suite, seul compte l'ensemble `m`, pas l'ordre à l'intérieur. On remplace donc les `N!` ordres par les `2ᴺ` ensembles.

**La récurrence.** On code un ensemble par un entier `m` dont le bit `j` vaut `1` si la tâche `j` en fait partie. On note `meilleur[m]` la plus petite pénalité totale des tâches de `m` quand elles sont faites en premier. La dernière tâche `j` de `m` se termine à `fin[m]` :

`meilleur[m] = min sur j ∈ m de meilleur[m - {j}] + W[j] × max(0, fin[m] - D[j])`, avec `meilleur[0] = 0`.

Les masques plus petits sont calculés avant (`m - {j} < m`), donc on parcourt `m` de `1` à `2ᴺ - 1`. On calcule aussi `fin[m]` à partir du masque sans son bit le plus faible. La réponse est `meilleur[2ᴺ - 1]`. Complexité : **O(2ᴺ × N)**, environ 4,7 millions d'opérations pour N = 18.

Pourquoi les idées simples échouent : énumérer les ordres coûte `N!`. Les règles gloutonnes classiques sont fausses : « limite la plus proche d'abord », « plus petit rapport `P / W` d'abord », « plus petite marge `D - P` d'abord ». Les tests contiennent des cas où les trois se trompent. Le problème est difficile en général (on ne connaît pas d'algorithme polynomial) : la programmation dynamique sur les sous-ensembles est la bonne approche pour `N` petit.

Pièges :
- La pénalité totale peut dépasser 2³¹ : en C++, utilise `long long`.
- `D[i]` peut valoir `0` : la tâche est alors en retard quoi qu'il arrive.
- Garde la condition `C > D[i]` : une tâche finie exactement à sa limite n'a pas de pénalité.
