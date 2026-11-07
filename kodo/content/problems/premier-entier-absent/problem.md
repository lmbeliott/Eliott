---
id: premier-entier-absent
title: Premier entier absent
chapter: p2-tableaux
order: 4
tags: [listes, mathématiques]
samples: 2
---

## Énoncé
Afficher le plus petit entier positif ou nul qui n'apparaît pas parmi `N` entiers donnés.

Par exemple, parmi `3 0 1 7 1`, les entiers 0 et 1 sont présents mais pas 2 : la réponse est 2.

## Entrée
La première ligne contient l'entier `N`. La deuxième ligne contient les `N` entiers, séparés par des espaces.

## Sortie
Un seul entier : le plus petit entier positif ou nul absent.

## Contraintes
- 1 ≤ N ≤ 20 000
- Chaque entier est compris entre 0 et 10⁹.

## Indices
1. Essayer 0, puis 1, puis 2… en parcourant à chaque fois tout le tableau marche, mais peut demander jusqu'à `N × N` = 400 millions de comparaisons : trop lent.
2. Un tableau de présence `vu`, où `vu[v]` vaut `True` si `v` apparaît, répond en une seule opération. Mais on ne peut pas créer un milliard de cases.
3. Avec `N` entiers, au plus `N` valeurs différentes sont présentes : parmi 0, 1, …, `N`, il en manque forcément une. La réponse est donc au plus `N`, et les valeurs plus grandes que `N` ne servent à rien.

## Solution
La remarque clé est mathématique : les `N + 1` entiers 0, 1, …, `N` ne peuvent pas tous apparaître parmi seulement `N` valeurs. La réponse est donc comprise entre 0 et `N`. C'est le principe des **tiroirs** : on ne range pas `N + 1` objets dans `N` tiroirs avec au plus un objet par tiroir.

On crée un tableau `vu` de `N + 1` cases, toutes à faux. Pour chaque valeur `x` lue, si `x ≤ N`, on met `vu[x]` à vrai ; les valeurs plus grandes sont ignorées, car elles ne peuvent pas être la réponse ni l'empêcher. Il reste à trouver le premier indice `v` tel que `vu[v]` est faux, en partant de 0.

Le programme fait deux parcours de longueur `N` environ : il est très rapide. Le piège est de vouloir un tableau aussi grand que la plus grande valeur (10⁹ cases), ou d'oublier de tester `x ≤ N` avant d'écrire `vu[x]`, ce qui sort du tableau.
