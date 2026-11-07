---
id: ajouter-des-rampes
title: Ajouter des rampes
chapter: n3-complexite
order: 6
tags: [sommes-préfixes]
samples: 2
---

## Énoncé
Un tableau contient N cases, numérotées de 1 à N, qui valent toutes `0` au départ. On lui applique Q opérations. L'opération (L, R) ajoute une **rampe** : elle ajoute 1 à la case L, 2 à la case L + 1, 3 à la case L + 2, et ainsi de suite jusqu'à la case R, qui reçoit R − L + 1. Les autres cases ne changent pas.

Écris un programme qui affiche, après toutes les opérations, la plus grande valeur du tableau et le nombre de cases qui ont cette valeur.

## Entrée
- La première ligne contient deux entiers N et Q.
- Les Q lignes suivantes contiennent chacune deux entiers L et R : une opération.

## Sortie
Deux entiers séparés par une espace : la plus grande valeur du tableau, puis le nombre de cases qui ont cette valeur.

## Contraintes
- 1 ≤ N ≤ 1 000 000
- 1 ≤ Q ≤ 10 000
- 1 ≤ L ≤ R ≤ N

## Indices
1. Appliquer chaque opération case par case peut coûter N × Q = 10¹⁰ additions. Il faut traiter chaque opération en temps constant, puis reconstruire tout le tableau en un seul parcours.
2. Pour une seule valeur ajoutée à toutes les cases de L à R, on connaît l'astuce des sommes préfixes : noter `+v` en L et `−v` en R + 1, puis faire les sommes cumulées. Ici, la valeur ajoutée à la case x n'est pas constante, mais elle s'écrit `x − L + 1` = `1 × x + (1 − L)`.
3. Garde deux tableaux de différences : un pour les « pentes » (le coefficient de x) et un pour les constantes. En les cumulant de gauche à droite, tu obtiens pour chaque case x une pente totale `a` et une constante totale `b` : sa valeur est `a × x + b`.

## Solution
**L'idée : décomposer chaque rampe.** L'opération (L, R) ajoute à la case x, pour L ≤ x ≤ R, la valeur `x − L + 1`, qu'on écrit `1 × x + (1 − L)`. La valeur finale d'une case x est donc `a × x + b`, où `a` est le nombre de rampes qui couvrent x et `b` la somme des `1 − L` de ces rampes.

`a` et `b` sont des sommes de valeurs constantes sur des intervalles : c'est l'astuce des tableaux de différences. Pour chaque opération, on note `pente[L] += 1` et `pente[R + 1] −= 1`, puis `constante[L] += 1 − L` et `constante[R + 1] −= 1 − L`. Ensuite, en parcourant les cases de 1 à N, les sommes cumulées de `pente` et de `constante` donnent exactement `a` et `b` pour la case courante. On calcule sa valeur et on met à jour le maximum et le nombre de cases qui l'atteignent.

Sur le premier exemple, la rampe (2, 5) seule donnerait à la case 5 les valeurs a = 1 et b = 1 − 2 = −1, soit 5 − 1 = 4… mais la rampe (4, 8) la couvre aussi : a = 2, b = −1 + (1 − 4) = −4, et la valeur vaut 2 × 5 − 4 = 6.

**Complexité.** O(1) par opération, puis un parcours de N cases : O(N + Q).

**Pourquoi la solution naïve est trop lente.** Ajouter chaque rampe case par case coûte jusqu'à N additions par opération, soit 10¹⁰ pour N = 1 000 000 et Q = 10 000 : plusieurs secondes même en C++, des heures en Python.

**Une autre façon de voir.** On peut aussi utiliser les différences secondes : une rampe a une différence constante (+1) entre deux cases voisines, donc ses différences de différences ne sont non nulles qu'en trois endroits (L, R + 1 et R + 2). Deux sommes cumulées successives reconstruisent le tableau. C'est la même idée, un cran plus loin.

**Pièges.**
- Les valeurs dépassent 2³¹ : jusqu'à Q × N = 10¹⁰. Utilise des `long long` en C++.
- Les tableaux de différences ont besoin d'une case N + 1, car R + 1 peut valoir N + 1.
- Les constantes `1 − L` sont négatives : la valeur `a × x + b` est quand même toujours positive ou nulle.
