---
id: rectangles-aux-coins-marques
title: Rectangles aux coins marqués
chapter: n2-grilles
order: 8
tags: [grilles, boucles]
samples: 2
---

## Énoncé
On te donne une grille de `H` lignes et `W` colonnes. Chaque case est marquée (`#`) ou vide (`.`).

On cherche les rectangles dont les côtés suivent les lignes et les colonnes de la grille, et dont les **quatre coins** sont des cases marquées. Un tel rectangle est donné par deux lignes différentes et deux colonnes différentes : ses coins sont les quatre cases où elles se croisent. Seuls les coins comptent : les autres cases du rectangle peuvent être marquées ou vides.

Écris un programme qui affiche le nombre de ces rectangles.

## Entrée
- La première ligne contient deux entiers `H` et `W`.
- Les `H` lignes suivantes contiennent chacune `W` caractères parmi `#` et `.` : la grille.

## Sortie
Un seul entier : le nombre de rectangles dont les quatre coins sont marqués.

## Contraintes
- 1 ≤ H ≤ 200
- 1 ≤ W ≤ 200

## Indices
1. Essayer toutes les paires de lignes et toutes les paires de colonnes est trop lent : pour une grille de 200 × 200 entièrement marquée, il y a près de 400 millions de rectangles à compter un par un.
2. Fixe seulement les deux lignes du rectangle, celle du haut et celle du bas. Quelles colonnes peuvent alors servir de côtés ?
3. Si `k` colonnes ont une case marquée sur les deux lignes choisies, n'importe quelle paire de ces colonnes forme un rectangle valide. Il y a `k × (k - 1) / 2` paires.

## Solution
Choisissons d'abord la ligne du haut et la ligne du bas du rectangle. Une colonne peut servir de côté si elle a une case marquée sur ces **deux** lignes ; appelons `k` le nombre de ces colonnes. N'importe quelle paire de ces `k` colonnes donne un rectangle dont les quatre coins sont marqués, et aucun autre choix de colonnes ne convient. Le nombre de paires de colonnes est `k × (k - 1) / 2` : `k` choix pour la première colonne, `k - 1` pour la seconde, et on divise par 2 car l'ordre des deux colonnes ne compte pas.

Le programme parcourt donc toutes les paires de lignes `haut < bas`. Pour chacune, il compte `k` en parcourant les colonnes, puis ajoute `k × (k - 1) / 2` au total.

Avec la deuxième grille d'exemple :

```
##.##
#.###
.####
##..#
```

Les lignes 1 et 2 ont trois colonnes marquées en commun (la 1re, la 4e et la 5e), ce qui donne 3 rectangles. Les paires (1, 3), (1, 4) et (2, 3) donnent aussi 3 rectangles chacune, et les paires (2, 4) et (3, 4) un seul. Le total est 3 + 3 + 3 + 3 + 1 + 1 = 14.

Il y a environ `H² / 2` paires de lignes, et chacune demande `W` étapes : pour une grille de 200 × 200, cela fait environ 4 millions d'étapes. Essayer en plus toutes les paires de colonnes multiplierait ce travail par environ 100 : c'est beaucoup trop lent, surtout en Python.

Les pièges :
- compter les rectangles entièrement remplis de `#` : seuls les coins comptent ;
- compter un rectangle de hauteur ou de largeur nulle : les deux lignes doivent être différentes, et les deux colonnes aussi. C'est pour cela qu'on prend `bas > haut`, et `k × (k - 1) / 2` paires de colonnes **différentes** ;
- compter chaque rectangle deux fois, en prenant les deux lignes dans les deux ordres.
