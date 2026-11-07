---
id: racine-numerique
title: Racine numérique
chapter: p2-fonctions
order: 1
tags: [fonctions, arithmétique, mathématiques]
samples: 2
---

## Énoncé
La **racine numérique** d'un entier positif s'obtient en remplaçant le nombre par la somme de ses chiffres, encore et encore, jusqu'à obtenir un seul chiffre. Par exemple, 9875 donne 9 + 8 + 7 + 5 = 29, puis 2 + 9 = 11, puis 1 + 1 = 2 : la racine numérique de 9875 est 2.

Calculer la racine numérique de plusieurs nombres.

## Entrée
- La première ligne contient l'entier `Q`, le nombre de nombres.
- Chacune des `Q` lignes suivantes contient un entier `N`.

## Sortie
`Q` lignes : la racine numérique de chaque nombre, dans l'ordre de l'entrée.

## Contraintes
- 1 ≤ Q ≤ 1 000
- 0 ≤ N ≤ 10¹⁸

## Indices
1. Écrire une fonction `somme_chiffres(n)` qui renvoie la somme des chiffres de `n`.
2. Tant que le nombre a au moins deux chiffres, c'est-à-dire tant qu'il vaut au moins 10, le remplacer par `somme_chiffres` de lui-même.
3. En C++, `N` peut atteindre 10¹⁸ : utiliser `long long`.

## Solution
La fonction `somme_chiffres(n)` est celle du cours : on ajoute `n % 10` à une somme et on divise `n` par 10, tant que `n > 0`. Une seconde fonction, `racine(n)`, appelle la première tant que `n ≥ 10`, puis renvoie `n`. Le programme principal lit `Q`, puis appelle `racine` sur chaque nombre lu.

Un nombre d'au plus 19 chiffres a une somme de chiffres d'au plus 9 × 19 = 171 : après un tour, le nombre est déjà petit, et deux ou trois tours suffisent toujours.

Cas particulier : 0 a un seul chiffre, sa racine est 0. Les nombres d'un seul chiffre sont leur propre racine : la boucle ne fait alors aucun tour.

Pour aller plus loin : un nombre et la somme de ses chiffres ont le même reste dans la division par 9 (car 10 = 9 + 1). La racine numérique d'un entier `N ≥ 1` vaut donc `1 + (N - 1) % 9`.
