---
id: nombres-en-montagne
title: Nombres en montagne
chapter: n2-fonctions
order: 2
tags: [fonctions, boucles]
samples: 2
---

## Énoncé
Un nombre est **en montagne** quand ses chiffres, lus de gauche à droite, montent puis redescendent, comme le profil d'une montagne.

Plus précisément, un nombre est en montagne si l'un de ses chiffres, qui n'est ni le premier ni le dernier, est un sommet : avant lui, les chiffres augmentent strictement, et après lui, ils diminuent strictement. Par exemple :
- `132`, `1352`, `13531` et `140` sont des nombres en montagne ;
- `123` n'en est pas un (il ne redescend jamais), ni `321` (il ne monte jamais), ni `1221` (deux chiffres égaux à la suite), ni `13513` (il remonte après être redescendu), ni `7` ou `42` (trop courts).

Écris un programme qui compte les nombres en montagne compris entre `A` et `B` (inclus).

## Entrée
Une seule ligne contenant deux entiers `A` et `B`.

## Sortie
Un seul entier : la quantité de nombres en montagne `n` tels que `A ≤ n ≤ B`.

## Contraintes
- 1 ≤ A ≤ B ≤ 100 000

## Indices
1. Découpe le problème. Écris d'abord une fonction `chiffres(n)` qui renvoie la liste des chiffres de `n` dans l'ordre (`1352` donne `[1, 3, 5, 2]`). Le dernier chiffre de `n` est `n % 10`, et `n // 10` (`n / 10` en C++, entre deux `int`) enlève ce dernier chiffre.
2. Écris ensuite une fonction `est_montagne(n)` qui renvoie vrai ou faux. Le programme principal n'aura plus qu'à l'appeler pour chaque nombre de `A` à `B`.
3. Dans `est_montagne`, avance un indice `i` tant que le chiffre suivant est plus grand : tu arrives au sommet. Vérifie que le sommet n'est ni au tout début ni à la toute fin. Puis continue d'avancer tant que le chiffre suivant est plus petit : le nombre est en montagne si tu arrives ainsi jusqu'au dernier chiffre.

## Solution
On sépare le travail en deux fonctions :
- `chiffres(n)` récupère les chiffres un par un avec `n % 10` (le dernier chiffre) et `n // 10` (le nombre sans son dernier chiffre ; `n / 10` en C++). On les obtient de droite à gauche, donc on retourne la liste à la fin ;
- `est_montagne(n)` parcourt cette liste en deux étapes. D'abord la montée : on avance tant que `c[i] < c[i + 1]`. Si l'on n'a pas bougé (`i = 0`), le nombre ne monte pas ; si l'on est déjà au bout, il ne redescend pas : dans les deux cas, il n'est pas en montagne. Ensuite la descente : on avance tant que `c[i] > c[i + 1]`. Le nombre est en montagne si et seulement si on termine sur le dernier chiffre.

Le programme principal compte simplement les `n` de `A` à `B` pour lesquels `est_montagne(n)` est vrai.

Les pièges :
- les égalités : `1221` n'est pas en montagne, car la montée et la descente doivent être **strictes**. Les deux boucles s'arrêtent au palier, et on ne termine pas sur le dernier chiffre ;
- un nombre qui remonte après être descendu, comme `13513` : la descente s'arrête trop tôt, et c'est bien le test final « suis-je au dernier chiffre ? » qui le rejette ;
- les zéros : `140` est en montagne (`1 < 4 > 0`). Le calcul avec `%` et `//` les traite comme les autres chiffres ;
- oublier d'inclure `B` : en Python, la boucle est `range(a, b + 1)`.

On pourrait tout écrire dans une seule grosse boucle, mais avec deux fonctions, chaque morceau est court et se vérifie séparément : on peut par exemple tester `est_montagne(1221)` à la main.
