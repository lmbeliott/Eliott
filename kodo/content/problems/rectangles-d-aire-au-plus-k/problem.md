---
id: rectangles-d-aire-au-plus-k
title: Rectangles d'aire au plus K
chapter: p1-boucles-imbriquees
order: 8
synthesis: true
tags: [boucles, mathématiques]
samples: 3
---

## Énoncé
Une grille compte `N` lignes et `M` colonnes de cases carrées. Un **rectangle** de la grille est un bloc de cases formé de lignes consécutives et de colonnes consécutives ; son aire est son nombre de cases. Deux rectangles sont différents s'ils ne couvrent pas exactement les mêmes cases.

Compter les rectangles de la grille dont l'aire est au plus `K`.

Par exemple, dans une grille de 2 lignes et 3 colonnes, avec `K = 2`, il y a 6 rectangles d'une case, 4 rectangles horizontaux de 2 cases et 3 rectangles verticaux de 2 cases : la réponse est 13.

## Entrée
Une seule ligne contenant trois entiers `N`, `M` et `K` séparés par des espaces.

## Sortie
Un seul entier : le nombre de rectangles d'aire inférieure ou égale à `K`.

## Contraintes
- 1 ≤ N ≤ 500
- 1 ≤ M ≤ 500
- 1 ≤ K ≤ 250 000
- La réponse peut dépasser 10⁹ : en C++, utiliser un `long long`.

## Indices
1. Essayer toutes les positions de tous les rectangles demande quatre boucles imbriquées et des milliards de tours : beaucoup trop. Il faut regrouper les rectangles par dimensions.
2. Un rectangle de hauteur `h` et de largeur `w` peut être placé à combien d'endroits ? Compter les positions possibles de sa ligne du haut, puis de sa colonne de gauche.
3. Il y a `(N - h + 1) × (M - w + 1)` rectangles de hauteur `h` et de largeur `w`. Deux boucles imbriquées sur `h` et `w` suffisent : on ajoute ce nombre quand `h × w ≤ K`.

## Solution
On regroupe les rectangles selon leurs dimensions : une hauteur `h` (de 1 à `N`) et une largeur `w` (de 1 à `M`). Un rectangle de hauteur `h` a sa ligne du haut entre la ligne 1 et la ligne `N - h + 1` : cela fait `N - h + 1` choix. De même, sa colonne de gauche a `M - w + 1` choix. Chaque choix de ligne du haut se combine avec chaque choix de colonne de gauche, donc il y a `(N - h + 1) × (M - w + 1)` rectangles de dimensions `h × w`.

Le programme fait deux boucles imbriquées sur `h` et `w` et, quand `h × w ≤ K`, ajoute ce nombre au total. Cela fait au plus 500 × 500 = 250 000 tours. Vérification sur l'exemple (`N = 2`, `M = 3`, `K = 2`) : `1 × 1` donne `2 × 3 = 6`, `1 × 2` donne `2 × 2 = 4`, `2 × 1` donne `1 × 3 = 3`, et les autres dimensions ont une aire supérieure à 2. Total : 13.

La méthode directe, qui essaie chaque rectangle avec quatre boucles (ligne du haut, ligne du bas, colonne de gauche, colonne de droite), ferait environ 15 milliards de tours dans le pire cas : bien trop lent. Regrouper les objets à compter par « type » et compter chaque type par un calcul est une idée très fréquente.

En C++, la réponse atteint environ 1,6 × 10¹⁰ quand `K` est grand : il faut un `long long` pour le total.
