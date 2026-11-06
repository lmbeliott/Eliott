---
id: grand-tremplin
title: Le grand tremplin
chapter: n1-listes
order: 2
tags: [listes]
samples: 2
---

## Énoncé
Au concours de saut à ski de Valcorde, `N` sauteurs s'élancent l'un après l'autre du grand tremplin. Le premier à sauter porte le dossard 1, le deuxième le dossard 2, et ainsi de suite. Le vainqueur est celui qui saute le plus loin. En cas d'égalité, c'est celui qui a sauté le premier qui l'emporte, car il a réussi son saut avant les autres.

Écris un programme qui lit les longueurs des `N` sauts et affiche le dossard du vainqueur, puis la longueur de son saut.

## Entrée
- La première ligne contient l'entier `N`, le nombre de sauteurs.
- La deuxième ligne contient `N` entiers séparés par des espaces : les longueurs des sauts en mètres, dans l'ordre de passage.

## Sortie
Une seule ligne contenant deux entiers séparés par une espace : le dossard du vainqueur, puis la longueur de son saut.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque saut mesure entre 1 et 250 mètres.

## Indices
1. Parcours la liste en retenant deux choses : la meilleure longueur vue jusqu'ici, et la position où tu l'as vue.
2. Commence avec le premier sauteur comme meilleur provisoire. Pour chaque sauteur suivant, s'il a sauté **strictement** plus loin que le meilleur provisoire, il prend sa place.
3. Les positions dans la liste commencent à `0`, mais les dossards commencent à `1` : pense à ajouter 1 avant d'afficher.

## Solution
On cherche le maximum de la liste, et surtout **où** il se trouve. On garde une variable `meilleur` (la position du meilleur saut vu jusqu'ici), qui vaut `0` au départ : le premier sauteur est le meilleur provisoire. Puis on parcourt les positions `1`, `2`, …, `N - 1` : si le saut à la position `i` est strictement plus long que celui à la position `meilleur`, alors `meilleur` devient `i`. À la fin, on affiche `meilleur + 1` (le dossard) et la longueur du saut.

Les pièges classiques :
- utiliser `>=` au lieu de `>` : en cas d'égalité, le dernier sauteur ex æquo prendrait la place du premier, alors que c'est le premier qui gagne ;
- oublier le `+ 1` : la case `0` de la liste correspond au dossard 1 ;
- commencer le meilleur provisoire à une valeur inventée : partir du premier élément de la liste marche toujours, quelles que soient les valeurs.
