---
id: nombre-a-l-envers
title: Nombre à l'envers
chapter: p1-tant-que
order: 4
tags: [boucles, arithmétique]
samples: 2
---

## Énoncé
On retourne un entier `N` en lisant ses chiffres de droite à gauche ; les zéros qui se retrouvent devant disparaissent. Par exemple, `1203` retourné donne `3021`, et `4500` donne `54`.

Afficher `N` retourné, puis indiquer si `N` est un **palindrome**, c'est-à-dire s'il est égal à son retourné.

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
- Sur la première ligne, `N` retourné.
- Sur la deuxième ligne, `OUI` si `N` est égal à son retourné, `NON` sinon.

## Contraintes
- 0 ≤ N ≤ 10¹⁸ (en C++, utiliser des `long long`)

## Indices
1. On construit le retourné chiffre par chiffre, dans une variable `r` qui vaut 0 au départ. Pour ajouter un chiffre `c` à droite de `r`, on calcule `r * 10 + c`.
2. Les chiffres de `N` s'obtiennent de droite à gauche avec `% 10` et `// 10`, dans une boucle `while`.
3. La boucle détruit `N`. Pour comparer `N` à son retourné à la fin, il faut garder une copie de `N` avant la boucle.

## Solution
On parcourt les chiffres de `N` de droite à gauche : le dernier chiffre est `n % 10`, puis on l'enlève avec `n // 10`. Chaque chiffre obtenu est ajouté **à droite** du nombre retourné `r` : `r = r * 10 + chiffre`. Pour `1203`, `r` vaut successivement 3, 30, 302 puis 3021.

Les zéros de la fin de `N` se placent en tête de `r`, où ils ne comptent pas : pour `4500`, `r` vaut 0, 0, 5 puis 54. C'est exactement ce que demande l'énoncé.

Pour savoir si `N` est un palindrome, on compare le retourné au nombre de départ. Comme la boucle a ramené `n` à 0, il faut avoir recopié `N` dans une autre variable avant la boucle : c'est le piège principal. Le cas `N = 0` fonctionne sans traitement spécial : la boucle ne fait aucun tour, `r` vaut 0, et `0` est un palindrome.
