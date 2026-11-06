---
id: cases-visitees-par-un-robot
title: Cases visitées par un robot
chapter: n2-grilles
order: 3
tags: [grilles, simulation]
samples: 2
---

## Énoncé
Un robot se déplace dans une grille. Chaque case est libre (`.`) ou contient un obstacle (`#`). La case `D` est la case libre où se trouve le robot au départ.

Le robot suit une liste d'ordres, chacun étant une lettre : `N` (nord : monter d'une ligne), `S` (sud : descendre d'une ligne), `E` (est : aller d'une colonne vers la droite) ou `O` (ouest : aller d'une colonne vers la gauche). Si la case visée est un obstacle ou sort de la grille, l'ordre est ignoré et le robot ne bouge pas.

Écris un programme qui affiche le nombre de cases **différentes** visitées par le robot, case de départ comprise.

## Entrée
- La première ligne contient deux entiers `H` et `W` : le nombre de lignes et de colonnes de la grille.
- Les `H` lignes suivantes contiennent chacune `W` caractères parmi `.`, `#` et `D` : la grille. Il y a exactement un `D`.
- La dernière ligne contient la liste des ordres, écrits à la suite sans espace.

## Sortie
Un seul entier : le nombre de cases différentes visitées.

## Contraintes
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50
- La liste contient entre 1 et 1 000 ordres, chacun parmi `N`, `S`, `E`, `O`.

## Indices
1. Garde la position du robot dans deux variables : sa ligne et sa colonne. Pour chaque ordre, calcule d'abord la case visée, puis vérifie qu'elle est dans la grille et que ce n'est pas un obstacle avant de déplacer le robot.
2. Une même case peut être visitée plusieurs fois, mais elle ne doit compter qu'une fois. Comment savoir si le robot est déjà passé quelque part ?
3. Utilise une deuxième grille, de la même taille que la première, remplie de `False` (`false` en C++). Quand le robot arrive sur une case encore à `False`, passe-la à `True` et augmente ton compteur.

## Solution
On simule le trajet ordre par ordre. La position du robot est un couple (ligne, colonne). Pour chaque ordre, on calcule la case visée : `N` enlève 1 à la ligne, `S` ajoute 1 à la ligne, `E` ajoute 1 à la colonne, `O` enlève 1 à la colonne. Si cette case est dans la grille et n'est pas un `#`, le robot s'y déplace ; sinon, rien ne se passe.

Pour compter les cases différentes, on garde une grille de booléens `visitee`, initialement à `False` partout sauf sur la case de départ. À chaque déplacement, si la nouvelle case n'était pas encore visitée, on la marque et on augmente le compteur.

Les pièges :
- **le sens des lettres** : `N` fait *monter* dans la grille, donc diminue le numéro de ligne (la ligne `0` est en haut) ;
- vérifier que la case est dans la grille **avant** de lire `grille[nl][nc]`, sinon on lit hors du tableau (en Python, un indice `-1` lirait même silencieusement la dernière ligne) ;
- compter la case de départ, même si le robot ne bouge jamais ;
- compter le nombre de déplacements au lieu du nombre de cases différentes : sur le premier exemple, le robot fait 9 déplacements mais ne visite que 8 cases.

Pour créer la grille de booléens en Python, on ajoute `h` fois une nouvelle liste `[False] * w`. Attention, `[[False] * w] * h` ne marche pas : les `h` lignes seraient **la même** liste, et cocher une case cocherait toute la colonne.
