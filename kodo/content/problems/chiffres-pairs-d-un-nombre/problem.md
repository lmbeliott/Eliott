---
id: chiffres-pairs-d-un-nombre
title: Chiffres pairs d'un nombre
chapter: n1-boucles
order: 5
tags: [boucles, arithmétique]
samples: 2
---

## Énoncé
Écris un programme qui lit un entier `N` et affiche combien de chiffres pairs il contient quand on l'écrit normalement, sans zéro devant. Les chiffres pairs sont `0`, `2`, `4`, `6` et `8`.

Par exemple, `2026` contient 4 chiffres pairs, et `305` en contient un seul, le `0`.

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
Un seul entier : le nombre de chiffres pairs de `N`.

## Contraintes
- 0 ≤ N ≤ 1 000 000 000

## Indices
1. Le dernier chiffre de `N` est le reste de la division de `N` par 10 : `N % 10`. Et `N // 10` (en C++, `N / 10`) est le nombre `N` sans son dernier chiffre.
2. Répète avec une boucle `while` : regarde le dernier chiffre, compte-le s'il est pair, puis enlève-le. Continue tant que `N` est plus grand que 0.
3. Teste ton programme avec `N = 0`. Le nombre `0` s'écrit avec un chiffre, et ce chiffre est pair : la réponse est 1.

## Solution
On ne connaît pas à l'avance le nombre de chiffres de `N` : c'est un travail pour une boucle `while`. À chaque tour :
- on prend le dernier chiffre, `N % 10` ;
- s'il est pair (son reste dans la division par 2 vaut 0), on augmente le compteur ;
- on enlève ce chiffre : `N = N // 10`.

La boucle s'arrête quand `N` vaut 0 : il n'y a plus de chiffre à regarder. Par exemple, pour `305` : on regarde `5`, puis `0` (compté), puis `3`, et on obtient 1.

Le piège est `N = 0` : la boucle ne fait alors aucun tour, et le compteur reste à 0. Or le nombre `0` s'écrit avec un chiffre pair ! Il faut traiter ce cas à part, avec un `if` avant la boucle.

Attention aussi à ne pas confondre « chiffres pairs » et « nombre pair » : `2026` et `13` ne sont pas tous les deux pairs, mais seul le premier a des chiffres pairs.
