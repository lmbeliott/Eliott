---
id: payer-avec-des-pieces-de-1-2-et-5
title: Payer avec des pièces de 1, 2 et 5
chapter: n1-boucles
order: 8
tags: [boucles, arithmétique]
samples: 3
---

## Énoncé
On dispose d'autant de pièces de 1, de 2 et de 5 qu'on veut. Écris un programme qui affiche le nombre de façons différentes de payer exactement la somme `N`.

L'ordre des pièces ne compte pas : une façon de payer, c'est seulement un nombre de pièces de 1, un nombre de pièces de 2 et un nombre de pièces de 5.

Par exemple, il y a 5 façons de payer 6 : `5 + 1`, `2 + 2 + 2`, `2 + 2 + 1 + 1`, `2 + 1 + 1 + 1 + 1` et `1 + 1 + 1 + 1 + 1 + 1`.

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
Un seul entier : le nombre de façons de payer exactement `N`.

La réponse peut dépasser 2 milliards : en C++, range-la dans un `long long`.

## Contraintes
- 1 ≤ N ≤ 1 000 000

## Indices
1. Une première idée : deux boucles l'une dans l'autre, une pour le nombre de pièces de 5 et une pour le nombre de pièces de 2, les pièces de 1 complétant le reste. Mais pour `N = 1 000 000`, cela fait des dizaines de milliards de tours : beaucoup trop lent.
2. Fixe seulement le nombre `A` de pièces de 5. Il reste `R = N - 5 × A` à payer avec des pièces de 2 et de 1. Combien y a-t-il de façons de le faire ? Essaie avec `R = 4`, puis `R = 5`.
3. Pour payer `R` avec des pièces de 2 et de 1, on choisit le nombre de pièces de 2 : de 0 à `R // 2`, et les pièces de 1 complètent. Cela fait `R // 2 + 1` façons. Il ne reste qu'une boucle, sur `A`.

## Solution
Une façon de payer est fixée par le nombre `A` de pièces de 5 et le nombre `B` de pièces de 2 : les pièces de 1 complètent, à condition que `5 × A + 2 × B` ne dépasse pas `N`.

Deux boucles l'une dans l'autre, sur `A` puis sur `B`, donnent la bonne réponse, mais beaucoup trop lentement : pour `N = 1 000 000`, il y a environ 50 milliards de couples `(A, B)` à compter un par un.

On n'a pourtant pas besoin de les énumérer : pour un nombre `A` de pièces de 5 donné, il reste `R = N - 5 × A` à payer avec des 2 et des 1. Le nombre de pièces de 2 peut être 0, 1, 2… jusqu'à `R // 2`, et les pièces de 1 font l'appoint : cela fait exactement `R // 2 + 1` façons. On les ajoute d'un coup au total.

Il reste une seule boucle, pour `A` allant de 0 à `N // 5` : 200 001 tours au plus, ce qui est très rapide.

Exemple : `N = 10`. Avec 0 pièce de 5, il reste 10 : `10 // 2 + 1 = 6` façons. Avec 1 pièce de 5, il reste 5 : 3 façons. Avec 2 pièces de 5, il reste 0 : 1 façon. Le total est 6 + 3 + 1 = 10.

Les pièges :
- oublier le `+ 1` : ne mettre aucune pièce de 2 est aussi une façon de payer ;
- arrêter la boucle trop tôt : `A` va jusqu'à `N // 5` compris (en Python, `range(N // 5 + 1)`) ;
- en C++, garder le total dans un `int` : pour `N = 1 000 000`, la réponse dépasse 50 milliards.
