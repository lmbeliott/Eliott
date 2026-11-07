---
id: somme-de-deux-nombres
title: Somme de deux nombres
chapter: n1-affichage
order: 1
tags: [entrées-sorties, arithmétique]
samples: 2
---

## Énoncé
Écris un programme qui lit deux nombres entiers `A` et `B`, écrits sur la même ligne, et affiche leur somme.

## Entrée
Une seule ligne contenant deux entiers `A` et `B` séparés par une espace.

## Sortie
Un seul entier : `A + B`.

## Contraintes
- 0 ≤ A, B ≤ 1 000

## Indices
1. Il faut d'abord lire la ligne, puis la découper en deux nombres.
2. En Python, `input().split()` découpe la ligne en morceaux, et `int(...)` transforme un morceau de texte en nombre. En C++, `cin >> a >> b;` lit deux entiers d'un coup.
3. `a, b = map(int, input().split())` lit les deux nombres d'un coup ; il ne reste qu'à afficher `a + b` avec `print`.

## Solution
On lit la ligne, on la découpe en deux morceaux que l'on convertit en entiers, puis on affiche leur somme.

Le piège classique en Python : `input()` renvoie du **texte**. Sans conversion, `"3" + "4"` vaut `"34"` et non `7`. Il faut donc convertir chaque morceau avec `int`.

En C++, `cin >> a >> b;` lit directement deux entiers séparés par des espaces.
