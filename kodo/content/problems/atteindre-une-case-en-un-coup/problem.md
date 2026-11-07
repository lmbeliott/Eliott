---
id: atteindre-une-case-en-un-coup
title: Atteindre une case en un coup
chapter: n1-conditions
order: 8
tags: [conditions]
samples: 4
---

## Énoncé
Sur un très grand échiquier, les lignes et les colonnes sont numérotées à partir de 1. Une dame est posée sur la case de la ligne `L1` et de la colonne `C1`. En un coup, la dame avance en ligne droite d'autant de cases qu'elle veut, dans une des huit directions :
- le long de sa ligne (seule la colonne change) ;
- le long de sa colonne (seule la ligne change) ;
- en diagonale : à chaque case, la ligne et la colonne changent toutes les deux de 1.

Une seule autre pièce est posée sur l'échiquier : un obstacle, sur la case de la ligne `L3` et de la colonne `C3`. La dame ne peut ni s'arrêter sur l'obstacle, ni sauter par-dessus.

Écris un programme qui affiche `OUI` si la dame peut atteindre la case de la ligne `L2` et de la colonne `C2` en un seul coup, et `NON` sinon.

## Entrée
- La première ligne contient deux entiers `L1` et `C1` : la case de la dame.
- La deuxième ligne contient deux entiers `L2` et `C2` : la case à atteindre.
- La troisième ligne contient deux entiers `L3` et `C3` : la case de l'obstacle.

Les trois cases sont différentes.

## Sortie
Un seul mot : `OUI` si la dame peut atteindre la case en un coup, `NON` sinon.

## Contraintes
- 1 ≤ L1, C1, L2, C2, L3, C3 ≤ 1 000 000 000

## Indices
1. Oublie d'abord l'obstacle. Note `DL = L2 - L1` et `DC = C2 - C1`. Pour chacune des trois sortes de déplacement, que peux-tu dire de `DL` et de `DC` ? Attention, une diagonale peut monter ou descendre.
2. Sur une diagonale, `DL = DC` dans un sens, et `DL = -DC` dans l'autre. Si aucune des quatre conditions `DL = 0`, `DC = 0`, `DL = DC`, `DL = -DC` n'est vraie, la réponse est `NON`.
3. Il reste à savoir si l'obstacle est sur le chemin. Traite chaque sorte de déplacement à part. Par exemple, le long d'une ligne : l'obstacle bloque s'il est sur la même ligne (`L3 = L1`) et si sa colonne est entre `C1` et `C2`. Pour une diagonale, l'obstacle doit être sur **la même** diagonale que la dame, et sa ligne entre `L1` et `L2`.

## Solution
On note `DL = L2 - L1` et `DC = C2 - C1` le déplacement à faire, et de même `OL = L3 - L1` et `OC = C3 - C1` la position de l'obstacle vue depuis la dame.

**La case est-elle dans une des directions de la dame ?** Le long d'une ligne, `DL = 0`. Le long d'une colonne, `DC = 0`. Sur une diagonale, la ligne et la colonne changent du même nombre de cases : soit dans le même sens (`DL = DC`), soit en sens contraires (`DL = -DC`). Si aucune de ces quatre conditions n'est vraie, la réponse est `NON`.

**L'obstacle est-il sur le chemin ?** Il faut qu'il soit sur la même droite que le déplacement, et entre la dame et la case visée :
- le long d'une ligne (`DL = 0`) : `OL = 0`, et `C3` est entre `C1` et `C2` ;
- le long d'une colonne (`DC = 0`) : `OC = 0`, et `L3` est entre `L1` et `L2` ;
- sur la diagonale `DL = DC` : `OL = OC`, et `L3` est entre `L1` et `L2` ;
- sur la diagonale `DL = -DC` : `OL = -OC`, et `L3` est entre `L1` et `L2`.

« `X` est entre `A` et `B` » s'écrit `(A < X and X < B) or (B < X and X < A)`, car on ne sait pas lequel de `A` et `B` est le plus petit. Les trois cases étant différentes, on peut utiliser des inégalités strictes.

Exemple : la dame en `(4, 4)` et la case `(8, 8)`. On a `DL = DC = 4` : c'est la diagonale. L'obstacle en `(6, 6)` vérifie `OL = OC = 2`, et sa ligne 6 est entre 4 et 8 : il bloque, la réponse est `NON`.

Les pièges :
- n'essayer qu'une des deux diagonales ;
- regarder seulement si l'obstacle est entre les deux cases « dans le rectangle » : en `(5, 7)`, il est entre la dame `(4, 4)` et la case `(8, 8)` sur les lignes comme sur les colonnes, mais il n'est pas sur la diagonale, et il ne bloque rien ;
- oublier que l'obstacle peut être sur la bonne droite, mais **derrière** la case visée, ou derrière la dame : il ne gêne alors pas.

Un échiquier d'un milliard de lignes ne se parcourt pas case par case : quelques comparaisons suffisent.
