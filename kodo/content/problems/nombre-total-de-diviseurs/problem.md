---
id: nombre-total-de-diviseurs
title: Nombre total de diviseurs
chapter: n3-arithmetique
order: 3
tags: [arithmétique, mathématiques]
samples: 2
---

## Énoncé
Pour un entier n ≥ 1, on note d(n) son nombre de diviseurs. Par exemple, d(6) = 4, car 6 a pour diviseurs 1, 2, 3 et 6.

Écris un programme qui calcule d(L) + d(L + 1) + … + d(R).

## Entrée
Une seule ligne avec deux entiers L et R.

## Sortie
Un seul entier : la somme des nombres de diviseurs de tous les entiers de L à R.

## Contraintes
- 1 ≤ L ≤ R ≤ 10¹²

## Indices
1. Il suffit de savoir calculer `D(n) = d(1) + d(2) + … + d(n)` : la réponse est `D(R) − D(L − 1)`. Pour D(n), compte dans l'autre sens : combien de nombres entre 1 et n sont des multiples de a ? Il y en a `n // a`.
2. Donc `D(n)` est la somme des `n // a` pour a de 1 à n : c'est aussi le nombre de couples (a, b) d'entiers positifs avec a × b ≤ n. Mais n peut valoir 10¹² : il faut éviter de parcourir tous les a.
3. Dans un couple (a, b) avec a × b ≤ n, on a forcément a ≤ s ou b ≤ s, où s = ⌊√n⌋. Compte les couples avec a ≤ s, puis ceux avec b ≤ s (c'est le même nombre), et enlève ceux qui ont été comptés deux fois.

## Solution
**Compter par diviseur plutôt que par nombre.** Notons `D(n) = d(1) + … + d(n)` ; la réponse est `D(R) − D(L − 1)`, avec `D(0) = 0`. Chaque diviseur a d'un nombre m ≤ n est compté une fois dans D(n). Au lieu de chercher les diviseurs de chaque m, on se demande, pour chaque a, combien de nombres m ≤ n il divise : ce sont ses multiples a, 2a, 3a…, et il y en a `n // a`. Donc `D(n) = n // 1 + n // 2 + … + n // n`.

Autrement dit, `D(n)` est le nombre de couples (a, b) d'entiers positifs tels que a × b ≤ n (pour chaque a, b va de 1 à `n // a`). C'est encore O(n) : trop lent pour n = 10¹².

**L'idée : couper à la racine carrée.** Soit `s = ⌊√n⌋`. Dans un couple (a, b) avec a × b ≤ n, on ne peut pas avoir à la fois a > s et b > s, sinon a × b ≥ (s + 1)² > n. Donc :
- les couples avec a ≤ s sont au nombre de `X = n // 1 + n // 2 + … + n // s` ;
- par symétrie, les couples avec b ≤ s sont aussi au nombre de X ;
- les couples comptés deux fois ont a ≤ s et b ≤ s : il y en a s × s, car a × b ≤ s² ≤ n est alors automatique.

D'où `D(n) = 2 × X − s²`, calculé en O(√n).

Sur le premier exemple, n = 6 et s = 2 : X = 6 + 3 = 9, et D(6) = 2 × 9 − 4 = 14 = 1 + 2 + 2 + 3 + 2 + 4.

**Complexité.** O(√R), soit 10⁶ divisions pour R = 10¹², pour chacun des deux appels.

**Pourquoi la solution naïve est trop lente.** Calculer d(n) pour chaque n en cherchant ses diviseurs, ou même additionner les `n // a` pour tous les a jusqu'à n, coûte au moins 10¹² opérations quand R = 10¹². Un crible qui compte les diviseurs de tous les nombres jusqu'à R aurait besoin de 10¹² cases.

**Pièges.**
- La réponse dépasse 2³¹ et même 10¹³ : utilise des `long long` en C++.
- En C++, `sqrt` travaille avec des nombres à virgule et peut se tromper de 1 pour de grands nombres : corrige s pour avoir exactement s² ≤ n < (s + 1)². En Python, `math.isqrt` donne directement la bonne valeur.
- N'oublie pas le cas L = 1 : il faut D(0) = 0.
