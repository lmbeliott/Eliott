---
id: triangles-de-perimetre-donne
title: Triangles de périmètre donné
chapter: p1-synthese
order: 7
tags: [boucles, mathématiques]
samples: 2
---

## Énoncé
Compter les triangles dont les trois côtés sont des entiers strictement positifs et dont le périmètre vaut `P`. Deux triangles qui ont les mêmes longueurs de côtés, dans un ordre différent, ne comptent qu'une fois.

Trois longueurs `a ≤ b ≤ c` forment un vrai triangle quand `a + b > c` (sinon, les côtés ne se rejoignent pas, ou le triangle est aplati).

Par exemple, pour `P = 12`, il y a 3 triangles : `2 5 5`, `3 4 5` et `4 4 4`.

## Entrée
Une seule ligne contenant l'entier `P`.

## Sortie
Un seul entier : le nombre de triangles de périmètre `P`.

## Contraintes
- 1 ≤ P ≤ 3 000

## Indices
1. Pour compter chaque triangle une seule fois, on impose l'ordre `a ≤ b ≤ c`.
2. Il suffit de choisir `a` et `b` : alors `c = P - a - b` est imposé. Deux boucles imbriquées suffisent.
3. Pour chaque couple `(a, b)` avec `a ≤ b`, calculer `c`, puis vérifier `b ≤ c` et `a + b > c`.

## Solution
On compte chaque triangle sous la forme `a ≤ b ≤ c`, ce qui évite de compter plusieurs fois le même triangle dans des ordres différents.

Une fois `a` et `b` choisis, le troisième côté est imposé : `c = P - a - b`. On fait donc deux boucles imbriquées, `a` de 1 à `P` et `b` de `a` à `P`, et on compte les couples pour lesquels `b ≤ c` et `a + b > c`. La condition `b ≤ c` garantit aussi `c ≥ 1`.

On peut réduire les boucles : comme `a` est le plus petit des trois côtés, `3 × a ≤ P` ; et comme `b ≤ c`, `a + 2 × b ≤ P`. Avec ces bornes, il y a environ `P × P / 12` couples, soit 750 000 pour `P = 3 000`.

Vérification pour `P = 12` : avec `a = 2`, seul `b = 5` donne `c = 5` et `2 + 5 > 5` ; avec `a = 3`, `b = 4` donne `c = 5` ; avec `a = 4`, `b = 4` donne `c = 4`. Les autres couples échouent, comme `1 5 6` (`1 + 5 = 6`, triangle aplati). Total : 3.
