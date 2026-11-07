---
id: moyenne-a-deux-decimales
title: Moyenne à deux décimales
chapter: p2-nombres
order: 1
tags: [arithmétique, entrées-sorties]
samples: 2
---

## Énoncé
Afficher la moyenne de `N` entiers, arrondie au centième le plus proche, avec exactement deux chiffres après le point.

Les données sont choisies pour que l'arrondi ne soit jamais ambigu : la moyenne exacte ne tombe jamais pile au milieu entre deux centièmes.

## Entrée
La première ligne contient l'entier `N`. La deuxième ligne contient les `N` entiers, séparés par des espaces.

## Sortie
Un seul nombre : la moyenne, écrite avec exactement deux décimales (par exemple `13.67` ou `5.00`).

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque entier est compris entre 0 et 1 000 000.

## Indices
1. La moyenne est la somme divisée par `N`. Il faut une division décimale : `/` en Python, `(double) somme / n` en C++.
2. Pour afficher exactement deux décimales : `f"{m:.2f}"` en Python, `printf("%.2f\n", m)` en C++. `round(m, 2)` ne suffit pas : il affiche `5.0` au lieu de `5.00`.

## Solution
On calcule la somme des entiers avec un accumulateur, puis la moyenne avec une division décimale. Le format `.2f` arrondit au centième le plus proche et complète avec des zéros si besoin.

Le piège principal en C++ : écrire `somme / n` avec deux entiers donne une division entière, et la moyenne perd sa partie décimale avant même d'être affichée. Il faut convertir l'un des deux en `double`. En Python, le piège est d'utiliser `round(moyenne, 2)` puis `print` : le nombre de décimales affichées n'est alors pas garanti.
