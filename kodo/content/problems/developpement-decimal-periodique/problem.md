---
id: developpement-decimal-periodique
title: Développement décimal périodique
chapter: p2-dictionnaires
order: 7
tags: [dictionnaires, mathématiques, arithmétique]
samples: 3
---

## Énoncé
Écrire la fraction `N / D` en écriture décimale exacte. Quand les chiffres après la virgule finissent par se répéter, le bloc qui se répète est écrit une seule fois, entre parenthèses.

Par exemple, `22 / 7 = 3,142857142857…` s'écrit `3.(142857)`, et `1 / 6 = 0,1666…` s'écrit `0.1(6)`. Le bloc entre parenthèses est le plus court possible, et il commence le plus tôt possible.

## Entrée
Une seule ligne contenant les entiers `N` et `D`, séparés par une espace.

## Sortie
L'écriture décimale de `N / D`, avec un point comme séparateur décimal :
- si la division tombe juste, la partie entière seule (par exemple `3`) ;
- si le développement s'arrête, tous ses chiffres (par exemple `1.75`) ;
- sinon, la partie entière, un point, les chiffres qui ne se répètent pas, puis le bloc qui se répète entre parenthèses (par exemple `0.41(6)`).

## Contraintes
- 0 ≤ N ≤ 10⁹
- 1 ≤ D ≤ 100 000

## Indices
1. Faire la division posée : à chaque étape, on multiplie le reste par 10, le chiffre suivant est `reste // D` et le nouveau reste est `reste % D`.
2. Le reste est toujours entre 0 et `D - 1`. Si un reste réapparaît, tous les chiffres suivants se répètent à partir de là.
3. Garder un dictionnaire qui associe à chaque reste la position du chiffre qu'il a produit : quand un reste revient, cette position donne le début du bloc.

## Solution
La partie entière est `N // D`. Pour les chiffres après la virgule, on refait la **division posée** de l'école : en partant du reste `r = N % D`, on calcule `10 × r`, le chiffre suivant est `(10 × r) // D` et le nouveau reste est `(10 × r) % D`. Chaque chiffre ne dépend que du reste courant.

Deux cas se présentent :
- le reste devient 0 : la division s'arrête, le développement est fini ;
- un reste déjà rencontré revient : à partir de là, les mêmes calculs se refont dans le même ordre, et les mêmes chiffres se répètent pour toujours.

Comme il n'existe que `D` restes possibles, l'un des deux cas arrive en au plus `D` étapes. Pour détecter le retour d'un reste, on garde un dictionnaire `position` qui associe à chaque reste la position (dans la liste des chiffres) du chiffre qu'il produit. Quand le reste courant est déjà une clé, `position[reste]` est l'endroit où commence le bloc : les chiffres avant lui ne se répètent pas, ceux à partir de lui forment le bloc.

Ce bloc est bien le plus court et commence le plus tôt possible : le reste détermine entièrement la suite des chiffres, et deux restes différents donnent des suites différentes, donc la répétition commence exactement au premier reste qui revient.

Comme les restes sont des entiers entre 0 et `D - 1`, une liste de taille `D` remplie de `-1` conviendrait aussi ; le dictionnaire évite d'avoir à y penser.
