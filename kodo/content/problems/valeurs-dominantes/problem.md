---
id: valeurs-dominantes
title: Valeurs dominantes
chapter: n1-listes
order: 7
tags: [listes]
samples: 2
---

## Énoncé
On te donne une liste de `N` entiers. Une valeur de la liste est **dominante** si elle est strictement plus grande que toutes les valeurs placées après elle. La dernière valeur est toujours dominante, puisque rien ne la suit.

Écris un programme qui affiche le nombre de valeurs dominantes, puis leurs positions. Les positions sont numérotées à partir de 1.

## Entrée
- La première ligne contient l'entier `N`.
- La deuxième ligne contient `N` entiers séparés par des espaces : la liste.

## Sortie
- Sur la première ligne, le nombre de valeurs dominantes.
- Sur la deuxième ligne, leurs positions, dans l'ordre croissant, séparées par des espaces.

## Contraintes
- 1 ≤ N ≤ 20 000
- Chaque valeur est comprise entre 0 et 100 000.

## Indices
1. Comparer chaque valeur à toutes celles qui la suivent demande beaucoup trop de comparaisons quand la liste est longue : jusqu'à 200 millions pour 20 000 valeurs. Il faut un seul parcours.
2. Parcours la liste **en partant de la fin**. Garde dans une variable la plus grande valeur déjà rencontrée, c'est-à-dire la plus grande valeur placée après la case où tu es.
3. Une valeur est dominante si elle est strictement plus grande que ce maximum. Range sa position dans une liste, puis mets le maximum à jour. Comme tu as trouvé les positions de droite à gauche, affiche cette liste à l'envers.

## Solution
Une valeur est dominante si elle dépasse strictement le **maximum de tout ce qui la suit**. Ce maximum, on peut le calculer au fur et à mesure en parcourant la liste de droite à gauche.

On garde une variable `plus_grand`, qui vaut au départ `-1` (plus petit que toutes les valeurs : la dernière valeur est donc toujours dominante). Pour chaque position `i`, de `N - 1` jusqu'à `0` :
- si `liste[i] > plus_grand`, la valeur est dominante : on ajoute la position `i + 1` à une liste `positions`, et `plus_grand` devient `liste[i]` ;
- sinon, rien ne change.

Les positions sont trouvées de la droite vers la gauche : il faut les afficher à l'envers pour qu'elles soient dans l'ordre croissant.

Exemple avec `5 9 3 7 7 2 6 1` : en partant de la fin, `1` est dominante (maximum `1`), `6` aussi (maximum `6`), `2` non, le `7` de la position 5 oui (maximum `7`), le `7` de la position 4 non, car il n'est pas **strictement** plus grand que l'autre `7`, `3` non, `9` oui, `5` non. Les positions sont 8, 7, 5, 2, qu'on affiche dans l'ordre : `2 5 7 8`.

Les pièges :
- utiliser `>=` au lieu de `>` : deux valeurs égales ne sont pas dominantes toutes les deux, seule la dernière l'est ;
- comparer chaque valeur à toutes les suivantes : la réponse est juste, mais pour une liste décroissante de 20 000 valeurs, cela fait environ 200 millions de comparaisons, ce qui est beaucoup trop lent. Le parcours depuis la fin n'en fait que 20 000.
