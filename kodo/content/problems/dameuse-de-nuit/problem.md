---
id: dameuse-de-nuit
title: La dameuse de nuit
chapter: n2-grilles
order: 3
tags: [grilles, simulation]
samples: 2
---

## Énoncé
Chaque nuit, Nathan conduit la dameuse qui prépare les pistes de la station. Le plan de la station est un quadrillage : `.` est une case de neige, `#` un sapin, et `D` la case de neige où la dameuse se trouve au départ.

Nathan suit une liste d'ordres, chacun étant une lettre : `N` (monter d'une ligne), `S` (descendre d'une ligne), `E` (aller d'une colonne vers la droite) ou `O` (aller d'une colonne vers la gauche). Si la case visée est un sapin ou sort du plan, Nathan ignore l'ordre et la dameuse ne bouge pas.

Chaque case sur laquelle passe la dameuse est damée, y compris la case de départ. Écris un programme qui affiche le nombre de cases **différentes** damées à la fin de la nuit.

## Entrée
- La première ligne contient deux entiers `H` et `W` : le nombre de lignes et de colonnes du plan.
- Les `H` lignes suivantes contiennent chacune `W` caractères parmi `.`, `#` et `D` : le plan. Il y a exactement un `D`.
- La dernière ligne contient la liste des ordres, écrits à la suite sans espace.

## Sortie
Un seul entier : le nombre de cases différentes damées.

## Contraintes
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50
- La liste contient entre 1 et 1 000 ordres, chacun parmi `N`, `S`, `E`, `O`.

## Indices
1. Garde la position de la dameuse dans deux variables : sa ligne et sa colonne. Pour chaque ordre, calcule d'abord la case visée, puis vérifie qu'elle est dans le plan et que ce n'est pas un sapin avant de déplacer la dameuse.
2. Une même case peut être damée plusieurs fois, mais elle ne doit compter qu'une fois. Comment savoir si la dameuse est déjà passée quelque part ?
3. Utilise une deuxième grille, de la même taille que le plan, remplie de `False` (`false` en C++). Quand la dameuse arrive sur une case encore à `False`, passe-la à `True` et augmente ton compteur.

## Solution
On simule la nuit de Nathan ordre par ordre. La position de la dameuse est un couple (ligne, colonne). Pour chaque ordre, on calcule la case visée : `N` enlève 1 à la ligne, `S` ajoute 1 à la ligne, `E` ajoute 1 à la colonne, `O` enlève 1 à la colonne. Si cette case est dans le plan et n'est pas un `#`, la dameuse s'y déplace ; sinon, rien ne se passe.

Pour compter les cases différentes, on garde une grille de booléens `damee`, initialement à `False` partout sauf sur la case de départ. À chaque déplacement, si la nouvelle case n'était pas encore damée, on la marque et on augmente le compteur.

Les pièges :
- **le sens des lettres** : `N` fait *monter* sur le plan, donc diminue le numéro de ligne (la ligne `0` est en haut) ;
- vérifier que la case est dans le plan **avant** de lire `carte[nl][nc]`, sinon on lit hors du tableau (en Python, un indice `-1` lirait même silencieusement la dernière ligne) ;
- compter la case de départ, même si la dameuse ne bouge jamais ;
- compter le nombre de déplacements au lieu du nombre de cases différentes : sur le premier exemple, la dameuse fait 9 déplacements mais ne dame que 8 cases.

Pour créer la grille de booléens en Python, on ajoute `h` fois une nouvelle liste `[False] * w`. Attention, `[[False] * w] * h` ne marche pas : les `h` lignes seraient **la même** liste, et cocher une case cocherait toute la colonne.
