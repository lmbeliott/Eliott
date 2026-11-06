---
id: position-du-maximum
title: Position du maximum
chapter: n1-listes
order: 2
tags: [listes]
samples: 2
---

## Énoncé
Dans un concours, `N` candidats passent l'un après l'autre et reçoivent chacun un score. Le premier à passer porte le numéro 1, le deuxième le numéro 2, et ainsi de suite.

Le gagnant est celui qui a le plus grand score. En cas d'égalité, c'est celui qui est passé le premier qui gagne. Écris un programme qui lit les `N` scores et affiche le numéro du gagnant, puis son score.

## Entrée
- La première ligne contient l'entier `N`, le nombre de candidats.
- La deuxième ligne contient `N` entiers séparés par des espaces : les scores, dans l'ordre de passage.

## Sortie
Une seule ligne contenant deux entiers séparés par une espace : le numéro du gagnant, puis son score.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque score est compris entre 1 et 250.

## Indices
1. Parcours la liste en retenant deux choses : le meilleur score vu jusqu'ici, et la position où tu l'as vu.
2. Commence avec le premier candidat comme meilleur provisoire. Pour chaque candidat suivant, s'il a un score **strictement** plus grand que le meilleur provisoire, il prend sa place.
3. Les positions dans la liste commencent à `0`, mais les numéros commencent à `1` : pense à ajouter 1 avant d'afficher.

## Solution
On cherche le maximum de la liste, et surtout **où** il se trouve. On garde une variable `meilleur` (la position du meilleur score vu jusqu'ici), qui vaut `0` au départ : le premier candidat est le meilleur provisoire. Puis on parcourt les positions `1`, `2`, …, `N - 1` : si le score à la position `i` est strictement plus grand que celui à la position `meilleur`, alors `meilleur` devient `i`. À la fin, on affiche `meilleur + 1` (le numéro) et le score.

Les pièges classiques :
- utiliser `>=` au lieu de `>` : en cas d'égalité, le dernier candidat ex æquo prendrait la place du premier, alors que c'est le premier qui gagne ;
- oublier le `+ 1` : la case `0` de la liste correspond au numéro 1 ;
- commencer le meilleur provisoire à une valeur inventée : partir du premier élément de la liste marche toujours, quelles que soient les valeurs.
