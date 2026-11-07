---
id: sous-nombres-divisibles-par-k
title: Sous-nombres divisibles par K
chapter: p3-chaines-avancees
order: 7
tags: [chaînes, mathématiques]
samples: 2
---

## Énoncé
Une suite de `N` chiffres `D` et un entier `K` sont donnés, `K` étant un diviseur de 1 000. Chaque morceau de chiffres consécutifs de `D` se lit comme un nombre, les zéros de tête étant permis : dans `1024`, le morceau `02` vaut 2. Compter les morceaux dont la valeur est divisible par `K`. Deux morceaux situés à des positions différentes sont comptés séparément.

Par exemple, avec `D = 1250` et `K = 25`, les morceaux `0`, `25`, `50`, `125`, `250` et `1250` conviennent : la réponse est 6.

## Entrée
- La première ligne contient l'entier `K`.
- La deuxième ligne contient les `N` chiffres de `D`, collés.

## Sortie
Le nombre de morceaux divisibles par `K`.

## Contraintes
- 1 ≤ N ≤ 150 000
- `K` divise 1 000 : `K` vaut 1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500 ou 1 000.

## Indices
1. Un nombre est divisible par 4 si et seulement si le nombre formé par ses deux derniers chiffres l'est. Pourquoi ? Que se passe-t-il avec trois chiffres et un diviseur de 1 000 ?
2. Un nombre `x` d'au moins trois chiffres s'écrit `x = 1000 × q + r`, où `r` est le nombre formé par ses trois derniers chiffres.
3. Tous les morceaux d'au moins trois chiffres qui finissent à la même position ont les mêmes trois derniers chiffres : ils sont tous divisibles par `K`, ou aucun ne l'est.

## Solution
Un nombre `x` d'au moins trois chiffres s'écrit `x = 1000 × q + r`, où `r` (entre 0 et 999) est formé par ses trois derniers chiffres. Comme `K` divise 1 000, `K` divise `1000 × q` ; donc `K` divise `x` si et seulement si `K` divise `r`. La divisibilité d'un morceau d'au moins trois chiffres ne dépend que de ses trois derniers chiffres.

On compte alors les morceaux selon leur dernière position `j` (indices à partir de 0) :
- le morceau d'un chiffre `D[j]` : on teste directement ;
- le morceau de deux chiffres `D[j − 1]D[j]` (si `j ≥ 1`) : on teste directement ;
- les morceaux d'au moins trois chiffres finissant en `j` commencent aux indices 0, 1, …, `j − 2` : il y en a `j − 1`. Ils ont tous les mêmes trois derniers chiffres `D[j − 2]D[j − 1]D[j]`. Si ce nombre est divisible par `K`, on ajoute `j − 1` au total ; sinon, rien.

Chaque morceau a une seule dernière position et une seule longueur : il est compté exactement une fois. Le programme fait un nombre constant d'opérations par position : un travail proportionnel à `N`. Calculer la valeur de chacun des `N × (N + 1) / 2` morceaux, environ 10¹⁰ ici, serait beaucoup trop lent, même en mettant à jour le reste chiffre par chiffre. La réponse peut dépasser 10¹⁰ (avec `K = 1`, tous les morceaux conviennent) : en C++, il faut un `long long`.
