---
id: generations-du-jeu-de-la-vie
title: Générations du jeu de la vie
chapter: p2-grilles
order: 7
tags: [grilles, simulation]
samples: 2
---

## Énoncé
Le **jeu de la vie** se joue sur une grille de `N` lignes et `M` colonnes dont chaque case est vivante `#` ou morte `.`. Les voisines d'une case sont les cases qui la touchent par un côté ou par un coin ; tout ce qui est en dehors de la grille est mort. À chaque génération, toutes les cases changent **en même temps** :
- une case vivante reste vivante si elle a 2 ou 3 voisines vivantes, et meurt sinon ;
- une case morte devient vivante si elle a exactement 3 voisines vivantes, et reste morte sinon.

Afficher la grille après `K` générations.

## Entrée
- La première ligne contient trois entiers `N`, `M` et `K`.
- Chacune des `N` lignes suivantes contient `M` caractères `#` ou `.`.

## Sortie
`N` lignes de `M` caractères : la grille après `K` générations.

## Contraintes
- 1 ≤ N ≤ 25 et 1 ≤ M ≤ 25
- 0 ≤ K ≤ 100

## Indices
1. Écrire une fonction `voisines_vivantes(g, i, j)` qui compte les voisines vivantes d'une case parmi les 8, en ignorant celles qui sont hors de la grille.
2. Écrire une fonction `generation(g)` qui **renvoie une nouvelle grille**, calculée uniquement à partir de l'ancienne.
3. Modifier la grille sur place pendant le calcul donne un résultat faux : les cases suivantes compteraient des voisines déjà transformées.

## Solution
Le programme se découpe en deux fonctions. `voisines_vivantes(g, i, j)` parcourt les 8 déplacements `(a, b)` avec `a` et `b` entre -1 et 1, sauf `(0, 0)`, et compte les voisines qui sont dans la grille et vivantes. `generation(g)` crée une nouvelle grille et, pour chaque case, y écrit le nouvel état selon les règles, en ne lisant que l'ancienne grille `g`. Le programme principal répète `K` fois `g = generation(g)`, puis affiche `g`. Si `K = 0`, la grille est affichée telle quelle.

Le point essentiel est que toutes les cases changent **en même temps**. Si on écrivait le nouvel état directement dans `g`, une case examinée plus tard compterait parmi ses voisines des cases déjà passées à la génération suivante. Il faut donc une seconde grille. En Python, on la crée avec une nouvelle ligne par tour de boucle ; attention à `h = g`, qui ne copie rien, et à `[["."] * M] * N`, dont toutes les lignes sont la même liste.

Quelques motifs à essayer : un carré de 2 × 2 ne change jamais ; une barre de 3 cases alterne entre horizontale et verticale ; le « planeur » (`.#.`, `..#`, `###`) se reproduit à l'identique toutes les 4 générations, décalé d'une case en diagonale, et finit par se coincer contre le bord de la grille.

Chaque génération demande `N × M × 8` lectures, au plus 5 000 ; pour 100 générations, cela fait 500 000 lectures.
