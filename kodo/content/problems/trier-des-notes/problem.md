---
id: trier-des-notes
title: Trier des notes
chapter: p3-tris-simples
order: 1
tags: [tri, listes]
samples: 2
---

## Énoncé
Une classe a reçu `N` copies notées sur 20. Afficher les `N` notes dans l'ordre croissant.

## Entrée
La première ligne contient `N`. La deuxième ligne contient les `N` notes, des entiers entre `0` et `20`, séparés par des espaces.

## Sortie
Une seule ligne : les `N` notes dans l'ordre croissant, séparées par des espaces.

## Contraintes
- 1 ≤ N ≤ 50 000
- 0 ≤ chaque note ≤ 20

## Indices
1. Un tri par sélection ou par insertion fait de l'ordre de N² / 2 comparaisons : plus d'un milliard pour N = 50 000. Il faut profiter du fait que les notes ne prennent que 21 valeurs.
2. Compter combien de copies ont obtenu 0, combien ont obtenu 1, …, combien ont obtenu 20.
3. Il reste à afficher chaque note autant de fois qu'elle a été comptée, de 0 à 20.

## Solution
C'est le **tri par comptage**. Un tableau `cpt` de 21 cases, rempli en un passage sur les notes, donne `cpt[v]` = nombre de copies notées `v`. On parcourt ensuite les valeurs `v` de 0 à 20 dans l'ordre croissant et on écrit `v` exactement `cpt[v]` fois.

Le résultat est juste : chaque note est écrite autant de fois qu'elle apparaît dans l'entrée, et les valeurs sortent dans l'ordre croissant puisqu'on les parcourt dans cet ordre.

Le comptage coûte N opérations, la reconstruction N + 21 : en tout environ 2N opérations, contre environ N² / 2 = 1,25 milliard de comparaisons pour un tri par sélection quand N = 50 000. Le `sorted` de Python ou le `sort` du C++ seraient aussi assez rapides, mais ils n'exploitent pas le petit nombre de valeurs possibles.
