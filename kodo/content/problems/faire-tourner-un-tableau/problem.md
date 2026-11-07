---
id: faire-tourner-un-tableau
title: Faire tourner un tableau
chapter: p3-tableaux-avances
order: 1
tags: [listes, mathématiques]
samples: 2
---

## Énoncé
Faire tourner un tableau d'un cran vers la droite, c'est avancer chaque valeur d'une position, la dernière revenant en première position : `1 2 3 4 5` devient `5 1 2 3 4`. Faire tourner d'un cran vers la gauche est l'opération inverse.

Un tableau de `N` entiers et un entier `K` sont donnés. Afficher le tableau obtenu en le faisant tourner de `K` crans vers la droite si `K ≥ 0`, ou de `−K` crans vers la gauche si `K < 0`.

## Entrée
- La première ligne contient `N` et `K`.
- La deuxième ligne contient les `N` entiers du tableau.

## Sortie
Les `N` entiers du tableau obtenu, sur une ligne, séparés par des espaces.

## Contraintes
- 1 ≤ N ≤ 40 000
- −10¹⁸ ≤ K ≤ 10¹⁸
- Les valeurs du tableau sont comprises entre 0 et 999.

## Indices
1. Après `N` crans, le tableau est revenu à son état de départ. Faire tourner cran par cran serait beaucoup trop long.
2. Après une rotation de `k` crans vers la droite, avec `0 ≤ k < N`, la valeur d'indice `i` se retrouve à l'indice `(i + k) % N`.
3. Une rotation de `−K` crans vers la gauche est une rotation de `K` crans vers la droite, avec `K` négatif. En Python, `K % N` est toujours entre 0 et `N − 1` ; en C++, on écrit `((K % N) + N) % N`.

## Solution
Une rotation de `N` crans ramène chaque valeur à sa place : seul compte le reste `k = K mod N`, entre 0 et `N − 1`. Une rotation de `−K` crans vers la gauche est la même chose qu'une rotation de `K` crans vers la droite pour `K < 0`, et le reste modulo `N` règle aussi ce cas : tourner de 1 cran vers la gauche, c'est tourner de `N − 1` crans vers la droite. En Python, `K % N` donne directement ce reste ; en C++, `K % N` peut être négatif, et on calcule `((K % N) + N) % N` (avec des `long long`, puisque `|K|` atteint 10¹⁸).

On construit ensuite un nouveau tableau `r` de `N` cases : pour chaque indice `i`, la valeur `t[i]` va à l'indice `(i + k) % N`. Cette formule est juste : les valeurs d'indices 0 à `N − k − 1` avancent de `k` places sans dépasser la fin, et les `k` dernières, d'indices `N − k` à `N − 1`, dépassent et reviennent aux indices 0 à `k − 1`, dans le même ordre. Chaque indice d'arrivée est atteint exactement une fois.

Coût : un calcul de reste, puis un passage sur le tableau, soit un travail proportionnel à `N`. Faire tourner `|K|` fois d'un cran demanderait jusqu'à 10¹⁸ × `N` déplacements. On peut aussi faire la rotation **en place**, sans second tableau, avec trois retournements (voir le cours).
