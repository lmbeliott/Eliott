---
id: rendre-une-suite-strictement-croissante
title: Rendre une suite strictement croissante
chapter: n4-dynamique
order: 6
tags: [programmation-dynamique, dichotomie]
samples: 2
---

## Énoncé
On donne une suite de `N` entiers `a[1], a[2], …, a[N]`, tous supérieurs ou égaux à `1`. On peut **modifier** autant de valeurs que l'on veut : une valeur modifiée peut être remplacée par n'importe quel entier supérieur ou égal à `1`.

Écris un programme qui calcule le nombre minimal de valeurs à modifier pour que la suite devienne **strictement croissante** (`a[1] < a[2] < … < a[N]`).

## Entrée
- La première ligne contient un entier `N`.
- La deuxième ligne contient `N` entiers : `a[1]` à `a[N]`.

## Sortie
Un seul entier : le nombre minimal de valeurs à modifier.

## Contraintes
- 1 ≤ N ≤ 20 000
- 1 ≤ a[i] ≤ 10⁹

## Indices
1. Garder la plus longue sous-suite strictement croissante ne suffit pas : dans `1 2 2 3 4`, on ne peut pas garder `1 2 3 4`, car il n'existe aucun entier strictement entre `2` et `3` pour remplacer le deuxième `2`.
2. On peut garder `a[i]` puis `a[j]` (avec `i < j`) seulement s'il y a assez de place entre eux pour les `j - i - 1` valeurs modifiées : `a[j] - a[i] ≥ j - i`, c'est-à-dire `a[j] - j ≥ a[i] - i`. Et devant `a[i]`, il faut placer `i - 1` valeurs entre `1` et `a[i] - 1`.
3. Pose `b[i] = a[i] - i`. Les valeurs gardées sont exactement une sous-suite de `b` **croissante au sens large** formée de valeurs `b[i] ≥ 0`. Cherche la plus longue en O(N log N).

## Solution
Choisissons les positions que l'on **garde** ; toutes les autres sont modifiées. Quand peut-on compléter la suite ?
- Entre deux positions gardées consécutives `i < j`, il faut placer `j - i - 1` entiers strictement entre `a[i]` et `a[j]` : il en faut `a[j] - a[i] ≥ j - i`.
- Avant la première position gardée `i`, il faut `i - 1` entiers distincts entre `1` et `a[i] - 1` : il faut `a[i] ≥ i`.
- Après la dernière position gardée, aucune contrainte : les valeurs peuvent grandir autant qu'on veut.

Ces conditions suffisent : on remplit chaque trou avec les entiers qui suivent la valeur gardée à sa gauche (ou `1, 2, 3…` au début). En posant `b[i] = a[i] - i`, la première condition devient `b[i] ≤ b[j]` et la deuxième `b[i] ≥ 0`. On cherche donc la **plus longue sous-suite croissante au sens large** de `b`, en ne prenant que les valeurs `b[i] ≥ 0`. La réponse est `N` moins sa longueur.

Pour la plus longue sous-suite, on garde le tableau `fins`, où `fins[L]` est la plus petite fin possible d'une sous-suite de longueur `L + 1`. Ce tableau reste trié. Pour chaque valeur `b`, on cherche par **dichotomie** la première case **strictement plus grande** que `b` (`bisect_right` en Python, `upper_bound` en C++) : on la remplace par `b`, ou on ajoute `b` au bout. La longueur finale de `fins` est la longueur cherchée.

Complexité : **O(N log N)**.

Pourquoi les autres idées échouent :
- `N` moins la plus longue sous-suite strictement croissante de `a` est faux : elle ne tient pas compte de la place nécessaire entre deux valeurs gardées (premier indice).
- Oublier la condition `b[i] ≥ 0` est faux aussi : sur `3 1 2`, on ne peut pas garder `1 2`, car il faudrait un entier plus petit que `1` en première position. La réponse est `2`, pas `1`.
- La programmation dynamique en O(N²), qui teste tous les couples `i < j`, fait 2 × 10⁸ comparaisons : trop lent en Python.

Pièges :
- Les égalités entre les `b[i]` sont permises : avec `bisect_left` (ou `lower_bound`), on calculerait une sous-suite strictement croissante de `b`, trop courte. Sur `1 2 3 4`, tous les `b[i]` valent `0` et on garde tout.
- Les positions sont comptées à partir de `1` dans `b[i] = a[i] - i` : avec des indices à partir de `0`, la condition devient `a[i] - i ≥ 1`.
