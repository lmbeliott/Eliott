---
id: decouper-un-rectangle-en-carres
title: Découper un rectangle en carrés
chapter: p3-correction
order: 2
tags: [arithmétique, mathématiques]
samples: 2
---

## Énoncé
Une feuille rectangulaire mesure `A × B`. On y découpe le plus grand carré possible, dont le côté est le plus petit côté de la feuille. Il reste une feuille rectangulaire plus petite, sur laquelle on recommence. On s'arrête quand la feuille restante est elle-même un carré : c'est le dernier carré découpé.

Par exemple, une feuille `5 × 3` donne un carré de côté 3, puis il reste `2 × 3` : un carré de côté 2, puis il reste `2 × 1` : deux carrés de côté 1. Il y a 4 carrés, et le dernier a pour côté 1.

Pour chacune des `T` feuilles, afficher le nombre de carrés découpés et le côté du dernier.

## Entrée
- La première ligne contient `T`.
- Les `T` lignes suivantes contiennent chacune deux entiers `A` et `B`.

## Sortie
Pour chaque feuille, une ligne avec deux entiers : le nombre de carrés et le côté du dernier carré.

## Contraintes
- 1 ≤ T ≤ 1 000
- 1 ≤ A, B ≤ 10¹⁸

## Indices
1. Simuler les découpes une par une est trop lent : une feuille `10¹⁸ × 1` donne 10¹⁸ carrés.
2. Sur une feuille `a × b` avec `a ≥ b`, combien de carrés de côté `b` découpe-t-on de suite ? Que reste-t-il ensuite ?
3. On reconnaît l'algorithme d'Euclide. Quelle quantité ne change pas d'une découpe à l'autre ?

## Solution
Sur une feuille `a × b` avec `a ≥ b`, on découpe des carrés de côté `b` tant que la longueur restante est au moins `b` : on en découpe `q = a // b` d'affilée, et il reste une feuille `r × b` avec `r = a % b`. Si `r = 0`, le dernier carré découpé était le dernier de tous. Sinon, on recommence avec la feuille `b × r`. On compte donc les carrés par paquets : le nombre total est la somme des quotients de l'algorithme d'Euclide appliqué à `(A, B)`.

On écrit la boucle `while b != 0: carres += a // b; a, b = b, a % b`, en partant de `(a, b) = (A, B)`. Si `A < B`, le premier tour donne un quotient nul et échange simplement les deux nombres.

**Invariant.** Au début de chaque tour, la partie non découpée de la feuille est un rectangle `a × b`, et `carres` est le nombre de carrés déjà découpés. De plus, le PGCD de `a` et `b` ne change pas : un diviseur commun de `a` et `b` divise `r = a − q × b`, et réciproquement. À la fin, `b = 0`, et `a` est le côté du dernier carré, mais aussi `PGCD(a, 0) = a`. Le dernier carré a donc pour côté `PGCD(A, B)`.

**Terminaison et coût.** `b` est un entier positif qui diminue strictement à chaque tour, puisque `r < b` : la boucle s'arrête. Elle fait même très peu de tours : le cours montre que `a` est au moins divisé par deux tous les deux tours, d'où moins de 2 × 60 tours pour des nombres inférieurs à 10¹⁸ ≈ 2⁶⁰. Le nombre de carrés peut atteindre 10¹⁸ : en C++, il faut des `long long`.
