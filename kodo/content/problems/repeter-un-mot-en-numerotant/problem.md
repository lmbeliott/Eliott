---
id: repeter-un-mot-en-numerotant
title: Répéter un mot en numérotant
chapter: p1-lecture
order: 2
tags: [entrées-sorties, boucles]
samples: 2
---

## Énoncé
Lire un mot `M` et un entier `K`, puis afficher `K` lignes numérotées qui contiennent toutes le mot `M`.

## Entrée
- La première ligne contient le mot `M`, écrit en lettres minuscules sans accent.
- La deuxième ligne contient l'entier `K`.

## Sortie
`K` lignes. La ligne numéro `i` (en comptant à partir de 1) contient l'entier `i`, une espace, puis le mot `M`.

## Contraintes
- 1 ≤ K ≤ 100
- Le mot `M` a entre 1 et 20 lettres.

## Indices
1. Le mot se lit tel quel, sans `int()` ; l'entier `K`, lui, doit être converti.
2. Une boucle qui fait `K` tours donne à `i` les valeurs `0`, `1`, …, `K - 1`. Le numéro à afficher est `i + 1`.

## Solution
On lit le mot avec `input()` (ou `cin >> m` avec une variable `string`), puis `K` avec `int(input())`. Une boucle de `K` tours affiche, à chaque tour, le numéro `i + 1` suivi du mot.

Le piège est l'ordre des lectures : le mot est sur la première ligne et le nombre sur la deuxième. Les lire dans l'autre ordre provoque une erreur de conversion en Python, et une lecture ratée en C++.
