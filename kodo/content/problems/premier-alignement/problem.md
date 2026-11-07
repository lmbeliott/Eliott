---
id: premier-alignement
title: Premier alignement
chapter: n2-grilles
order: 6
tags: [grilles, simulation]
samples: 3
---

## Énoncé
Une grille verticale de `H` lignes et `W` colonnes est vide au départ. Deux joueurs y lâchent des jetons chacun à leur tour, le joueur 1 commençant. À chaque coup, le joueur choisit une colonne, et son jeton tombe jusqu'à la case libre la plus basse de cette colonne.

Un joueur forme un **alignement** quand au moins `K` de ses jetons se suivent sans trou sur une même ligne droite : horizontale, verticale, ou dans l'une des deux diagonales.

On te donne la liste des coups joués. Écris un programme qui affiche le numéro du premier coup après lequel le joueur qui vient de jouer forme un alignement, ou `0` si cela n'arrive jamais. Les coups sont numérotés à partir de 1 ; les coups impairs sont joués par le joueur 1, les coups pairs par le joueur 2.

## Entrée
- La première ligne contient trois entiers `H`, `W` et `K`.
- La deuxième ligne contient l'entier `M`, le nombre de coups.
- La troisième ligne contient `M` entiers entre 1 et `W` : les colonnes choisies, dans l'ordre des coups (les colonnes sont numérotées de 1 à `W`, de gauche à droite).

Aucun coup n'est joué dans une colonne déjà pleine. Les coups qui suivent le premier alignement sont quand même donnés : il faut les ignorer.

## Sortie
Un seul entier : le numéro du premier coup qui forme un alignement, ou `0`.

## Contraintes
- 1 ≤ H ≤ 50
- 1 ≤ W ≤ 50
- 1 ≤ K ≤ 50
- 1 ≤ M ≤ H × W

## Indices
1. Garde, pour chaque colonne, le nombre de jetons qu'elle contient déjà : cela donne directement la ligne où tombe le nouveau jeton. Si la ligne 0 est en haut, un jeton lâché dans une colonne qui en contient déjà `n` tombe sur la ligne `H - 1 - n`.
2. Inutile de chercher des alignements dans toute la grille après chaque coup : s'il en apparaît un nouveau, il passe forcément par le jeton qui vient d'être posé.
3. Pour chacune des quatre directions (par exemple `(0, 1)` pour l'horizontale, `(1, 1)` et `(1, -1)` pour les diagonales), pars du nouveau jeton et compte les jetons du même joueur qui le suivent sans trou dans un sens, puis dans le sens opposé. Le nouveau jeton fait partie d'une ligne de `1 + avant + après` jetons.

## Solution
On simule la partie coup par coup. La grille contient `0` pour une case vide, `1` ou `2` pour un jeton. Un tableau `hauteur` donne le nombre de jetons de chaque colonne : le jeton joué dans la colonne `c` tombe sur la ligne `H - 1 - hauteur[c]` (la ligne 0 étant en haut), puis on augmente `hauteur[c]` de 1.

Après chaque coup, on ne regarde que le jeton qui vient d'être posé, car tout nouvel alignement passe par lui. Pour chacune des quatre directions `(dl, dc)` — `(0, 1)`, `(1, 0)`, `(1, 1)` et `(1, -1)` — on avance pas à pas depuis le jeton tant qu'on reste dans la grille et qu'on trouve un jeton du même joueur, puis on fait de même dans le sens opposé `(-dl, -dc)`. Le nombre de jetons alignés est 1 (le nouveau jeton) plus ceux trouvés des deux côtés. Dès qu'il atteint `K`, on affiche le numéro du coup et on s'arrête.

Les pièges :
- ne compter que dans un seul sens : un jeton posé **au milieu** relie deux morceaux, comme dans le cinquième test, où le jeton de la colonne 3 complète `1 2 _ 4` ;
- oublier une diagonale : il y en a deux, qui montent l'une vers la droite et l'autre vers la gauche ;
- se tromper de joueur : le jeton qui vient d'être posé est celui du joueur 1 si le numéro du coup est impair ;
- continuer après le premier alignement : on affiche le **premier** coup gagnant, même si d'autres alignements apparaissent ensuite ;
- `K = 1` : le tout premier jeton forme déjà un alignement.

Chaque coup demande au plus quelques centaines de pas, et il y a au plus 2 500 coups : c'est très rapide. Vérifier toute la grille après chaque coup marcherait aussi sur les petites grilles, mais demanderait beaucoup plus de travail.
