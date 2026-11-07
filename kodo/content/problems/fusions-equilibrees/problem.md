---
id: fusions-equilibrees
title: Fusions équilibrées
chapter: n4-dynamique
order: 5
tags: [programmation-dynamique, sommes-préfixes]
samples: 2
---

## Énoncé
On a une rangée de `N` entiers positifs. Une **fusion** remplace deux nombres **voisins** `x` et `y` par un seul nombre, leur somme `x + y`, placé au même endroit ; elle coûte `|x - y|`. On fait des fusions jusqu'à ce qu'il ne reste qu'un seul nombre.

Écris un programme qui calcule le coût total minimal de toutes les fusions.

## Entrée
- La première ligne contient un entier `N`.
- La deuxième ligne contient `N` entiers : la rangée, de gauche à droite.

## Sortie
Un seul entier : le coût total minimal.

## Contraintes
- 1 ≤ N ≤ 250
- chaque nombre est compris entre `1` et `10⁹`

## Indices
1. Fusionner à chaque étape les deux voisins les plus proches ne marche pas : sur le deuxième exemple, cette stratégie coûte `6` au lieu de `2`.
2. Regarde la **dernière** fusion : elle réunit un nombre issu d'un bloc `a[1..k]` et un nombre issu du bloc `a[k+1..N]`. Ces deux nombres valent les sommes de leurs blocs, quel que soit l'ordre des fusions à l'intérieur de chaque bloc.
3. Note `cout[i][j]` le coût minimal pour fusionner le bloc `a[i..j]` en un seul nombre. Alors `cout[i][j]` est le minimum, sur `k` de `i` à `j - 1`, de `cout[i][k] + cout[k+1][j] + |S(i, k) - S(k+1, j)|`, où `S` est la somme d'un bloc. Calcule les blocs par longueur croissante.

## Solution
Quel que soit l'ordre des fusions, chaque nombre obtenu est la somme d'un **bloc** de nombres consécutifs de la rangée de départ. La dernière fusion réunit donc le bloc `a[i..k]` et le bloc `a[k+1..j]`, pour un certain `k`, et coûte `|S(i, k) - S(k+1, j)|`, une valeur qui ne dépend que de `k`. Avant elle, les fusions de chaque bloc se font indépendamment l'une de l'autre. D'où la **programmation dynamique sur les intervalles** :

- `cout[i][i] = 0` : un seul nombre, rien à fusionner ;
- `cout[i][j] = min(cout[i][k] + cout[k+1][j] + |S(i, k) - S(k+1, j)|)` pour `i ≤ k < j`.

Les sommes de blocs s'obtiennent en O(1) avec les **sommes préfixes**. On remplit le tableau par longueur de bloc croissante, pour que les deux sous-blocs soient déjà calculés. La réponse est `cout[1][N]`.

Il y a O(N²) blocs et O(N) coupures pour chacun : la complexité est **O(N³)**, environ 2,6 millions de coupures pour `N = 250`.

Pourquoi les autres idées échouent :
- Essayer tous les ordres de fusion est exponentiel : il y a `(N - 1)!` suites de fusions possibles, et même en regroupant les ordres équivalents, le nombre d'arbres de fusion explose (nombres de Catalan).
- Le glouton « fusionner les deux voisins les plus proches » est faux. Sur `1 1 1 2 1`, il fusionne d'abord deux `1` gratuitement, mais crée un `2` mal placé et finit à `6`. La meilleure suite coûte `2` : par exemple `1 1 1 2 1 → 1 1 1 3 → 2 1 3 → 3 3 → 6`, de coûts `1`, `0`, `1` et `0`.

Pièges :
- Le coût total peut largement dépasser 2³¹ : utilise des `long long` en C++.
- Avec `N = 1`, il n'y a aucune fusion : la réponse est `0`.
- L'ordre des longueurs compte : remplir le tableau ligne par ligne, `i` croissant, utiliserait `cout[k+1][j]` avant de l'avoir calculé.
