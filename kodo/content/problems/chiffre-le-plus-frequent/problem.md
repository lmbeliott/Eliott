---
id: chiffre-le-plus-frequent
title: Chiffre le plus fréquent
chapter: p1-synthese
order: 4
tags: [boucles, arithmétique]
samples: 2
---

## Énoncé
Afficher le chiffre qui apparaît le plus souvent dans l'écriture de l'entier `N`, puis son nombre d'apparitions. Si plusieurs chiffres apparaissent le même nombre maximal de fois, choisir le plus petit.

Par exemple, dans `3141592653`, les chiffres `3`, `1` et `5` apparaissent deux fois chacun : la réponse est `1 2`.

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
Une seule ligne avec deux entiers séparés par une espace : le chiffre le plus fréquent, puis son nombre d'apparitions.

## Contraintes
- 0 ≤ N ≤ 10¹⁸ (en C++, utiliser des `long long`)

## Indices
1. Sans tableau, on ne peut pas compter les dix chiffres en un seul passage. Mais on peut faire dix passages : un pour chaque chiffre `c` de 0 à 9.
2. Pour un chiffre `c` donné, parcourir les chiffres de `N` avec `% 10` et `// 10` dans une boucle `while`, et compter ceux qui valent `c`. Travailler sur une copie de `N`, car on en a besoin pour chacun des dix passages.
3. Le nombre `0` s'écrit avec un chiffre `0` : la boucle `while` ne fait alors aucun tour, il faut traiter ce cas à part.

## Solution
Une boucle externe essaie chaque chiffre `c` de 0 à 9. Pour chacun, une boucle interne parcourt les chiffres d'une **copie** `m` de `N` (avec `m % 10` et `m // 10`) et compte ceux qui sont égaux à `c`. On garde ensuite le meilleur : si le compte de `c` est strictement plus grand que le meilleur compte connu, on retient `c`. Comme les chiffres sont essayés dans l'ordre croissant et que la comparaison est stricte, c'est le plus petit chiffre qui l'emporte en cas d'égalité.

La copie est indispensable : la boucle interne ramène `m` à 0, et il faut repartir de `N` pour le chiffre suivant. Le nombre de tours est d'au plus 10 × 19 = 190.

Le cas `N = 0` se traite à part : la boucle interne ne fait aucun tour et tous les comptes vaudraient 0, alors que la réponse est `0 1`.
