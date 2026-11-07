---
id: evaluer-une-expression-prefixee
title: Évaluer une expression préfixée
chapter: p3-recursivite
order: 2
tags: [récursivité, chaînes]
samples: 3
---

## Énoncé
Dans l'**écriture préfixée**, l'opérateur est placé avant ses deux opérandes, sans parenthèses. Une expression est :

- soit un entier positif ou nul, comme `7` ;
- soit un opérateur `+`, `-` ou `*`, suivi d'une première expression, puis d'une seconde.

Par exemple, `- * 3 4 5` signifie (3 × 4) − 5 = 7, et `* 3 - 4 5` signifie 3 × (4 − 5) = −3.

Calculer la valeur d'une expression préfixée.

## Entrée
La première ligne contient N, le nombre de morceaux de l'expression (opérateurs et entiers). La deuxième ligne contient les N morceaux, séparés par des espaces.

## Sortie
La valeur de l'expression.

## Contraintes
- 1 ≤ N ≤ 3 999
- Les entiers de l'expression sont compris entre 0 et 10⁹.
- L'expression est correcte, et la valeur de chacune de ses sous-expressions est comprise entre −10¹⁸ et 10¹⁸.

## Indices
1. La définition d'une expression est récursive : le programme peut l'être aussi. Une fonction `evaluer(i)` calcule la valeur de l'expression qui commence au morceau numéro `i`.
2. Après avoir évalué la première opérande, il faut savoir où commence la seconde. La fonction peut renvoyer deux choses : la valeur, et la position du morceau qui suit l'expression lue.
3. Une expression comme `+ + + … 1 1 1 1` provoque près de 2 000 appels imbriqués : en Python, il faut relever la limite avec `sys.setrecursionlimit`.

## Solution
La fonction `evaluer(i)` renvoie la valeur de l'expression qui commence au morceau `i`, et l'indice du premier morceau qui la suit.

- Si le morceau `i` est un entier, c'est toute l'expression : on renvoie sa valeur et `i + 1`.
- Sinon, c'est un opérateur. La première opérande commence en `i + 1` : l'appel `evaluer(i + 1)` donne sa valeur `a` et sa fin `j`. La seconde opérande commence en `j` : `evaluer(j)` donne `b` et `k`. On renvoie `a op b` et `k`.

**Correction.** Par récurrence sur la longueur de l'expression : une expression d'un seul morceau est un entier (cas de base). Une expression plus longue commence par un opérateur, et ses deux opérandes sont des expressions strictement plus courtes, que les appels récursifs évaluent correctement par hypothèse de récurrence ; l'indice renvoyé par le premier appel est exactement le début de la seconde opérande.

**Coût.** Chaque morceau est lu par un seul appel : il y a N appels en tout, donc un temps proportionnel à N.

**Piège.** La profondeur des appels peut atteindre (N + 1) / 2, soit 2 000. La limite par défaut de Python est 1 000 appels imbriqués : sans `sys.setrecursionlimit(10000)`, le programme s'arrête avec `RecursionError: maximum recursion depth exceeded`. En C++, les valeurs nécessitent un `long long`.
