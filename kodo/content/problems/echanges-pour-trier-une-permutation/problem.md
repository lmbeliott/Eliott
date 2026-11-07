---
id: echanges-pour-trier-une-permutation
title: Échanges pour trier une permutation
chapter: p3-tris-simples
order: 4
tags: [tri, mathématiques]
samples: 2
---

## Énoncé
Une liste contient les entiers de `1` à `N`, chacun une fois, dans le désordre. Une opération consiste à **échanger** deux éléments de la liste, à n'importe quelles positions. Afficher le plus petit nombre d'opérations qui permet de trier la liste dans l'ordre croissant.

Par exemple, `3 1 2` demande 2 échanges, et `2 1 4 3` aussi.

## Entrée
La première ligne contient `N`. La deuxième ligne contient les `N` entiers, séparés par des espaces.

## Sortie
Un seul entier : le nombre minimal d'échanges.

## Contraintes
- 1 ≤ N ≤ 25 000

## Indices
1. Le tri par sélection place à chaque étape la bonne valeur à la position `i`, avec au plus un échange. Ici, la bonne valeur pour la position `i` est connue d'avance : c'est `i`.
2. Pour éviter de chercher `i` dans toute la fin de la liste, tenir à jour un tableau `pos` : `pos[v]` est la position actuelle de la valeur `v`.
3. Ce tri fait-il le minimum d'échanges ? Suivre la flèche « position `p` → position de la valeur `p` » découpe la liste en **cycles**. Combien de cycles un échange peut-il créer au plus ?

## Solution
**Algorithme.** C'est un tri par sélection où la recherche du minimum est immédiate. Pour `i` de 1 à `N` : si la position `i` ne contient pas `i`, on échange son contenu avec la valeur `i`, qui se trouve en `pos[i]`, et on met `pos` à jour. On compte ces échanges. L'invariant est celui du tri par sélection : avant l'étape `i`, les positions `1` à `i − 1` contiennent `1` à `i − 1`. Chaque étape coûte quelques opérations : en tout, environ N opérations, au lieu des N² / 2 comparaisons d'un tri par sélection qui cherche le minimum (300 millions ici).

**Pourquoi c'est le minimum.** On relie chaque position `p` à la position où se trouve la valeur `p`. En suivant ces liens, on tourne en rond : la liste se découpe en **cycles**. Dans `3 1 2`, la position 1 mène à la position 2 (où est le `1`), qui mène à la 3, qui ramène à la 1 : un seul cycle. Dans `2 1 4 3`, il y a deux cycles de deux positions. Une liste triée a `N` cycles, chacun d'une seule position.

Un échange modifie deux liens : il coupe un cycle en deux, ou il en fusionne deux en un. Le nombre de cycles augmente donc d'au plus 1 par échange. Si la liste a `C` cycles au départ, il faut au moins `N − C` échanges pour en avoir `N`. Or chaque échange de l'algorithme met une valeur à sa place définitive et coupe un cycle en deux : il fait exactement `N − C` échanges. Il est donc optimal.
