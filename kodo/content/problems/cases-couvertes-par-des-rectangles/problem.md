---
id: cases-couvertes-par-des-rectangles
title: Cases couvertes par des rectangles
chapter: n3-complexite
order: 7
tags: [sommes-préfixes, grilles]
samples: 2
---

## Énoncé
Une grille a N lignes, numérotées de 1 à N, et M colonnes, numérotées de 1 à M. On y pose Q rectangles. Le rectangle (R1, C1, R2, C2) couvre toutes les cases dont la ligne est entre R1 et R2 et dont la colonne est entre C1 et C2 (inclus). Les rectangles peuvent se chevaucher : une case peut être couverte plusieurs fois.

Écris un programme qui compte les cases couvertes par **au moins** K rectangles.

## Entrée
- La première ligne contient quatre entiers N, M, Q et K.
- Les Q lignes suivantes contiennent chacune quatre entiers R1, C1, R2 et C2 : un rectangle.

## Sortie
Un seul entier : le nombre de cases de la grille couvertes par au moins K rectangles.

## Contraintes
- 1 ≤ N, M ≤ 1 000
- 1 ≤ Q ≤ 5 000
- 1 ≤ K ≤ 5 000
- 1 ≤ R1 ≤ R2 ≤ N et 1 ≤ C1 ≤ C2 ≤ M

## Indices
1. Ajouter 1 à chaque case de chaque rectangle peut coûter Q × N × M = 5 × 10⁹ opérations. Il faut traiter chaque rectangle en temps constant, puis calculer la couverture de toutes les cases en un seul parcours de la grille.
2. En une dimension, pour ajouter 1 de la case L à la case R, on note `+1` en L et `−1` en R + 1, puis on fait les sommes cumulées. En deux dimensions, la couverture d'une case (r, c) sera la somme des marques des cases (x, y) avec x ≤ r et y ≤ c : où faut-il placer des marques pour qu'un rectangle ne compte que pour ses propres cases ?
3. Pour le rectangle (R1, C1, R2, C2), note `+1` en (R1, C1), `−1` en (R1, C2 + 1), `−1` en (R2 + 1, C1) et `+1` en (R2 + 1, C2 + 1). Ensuite, la somme cumulée en deux dimensions se calcule ligne par ligne : couverture de (r, c) = couverture de (r − 1, c) + somme des marques de la ligne r, de la colonne 1 à c.

## Solution
**L'idée : un tableau de différences en deux dimensions.** On garde une grille `diff`, avec une ligne et une colonne de plus, remplie de 0. Pour chaque rectangle (R1, C1, R2, C2), on écrit quatre marques :
- `+1` en (R1, C1) ;
- `−1` en (R1, C2 + 1) et `−1` en (R2 + 1, C1) ;
- `+1` en (R2 + 1, C2 + 1).

La couverture d'une case (r, c) est alors la somme des `diff[x][y]` pour x ≤ r et y ≤ c. Vérifions-le pour un rectangle : si (r, c) est dedans, seule la marque `+1` en (R1, C1) est dans la zone, et la somme vaut 1. Si r > R2 et que la colonne est dans le rectangle, les marques `+1` en (R1, C1) et `−1` en (R2 + 1, C1) s'annulent. Si r > R2 et c > C2, les quatre marques sont dans la zone : 1 − 1 − 1 + 1 = 0. Les autres cas se vérifient de la même façon.

**Calculer toutes les sommes d'un coup.** On parcourt la grille ligne par ligne. Pour la ligne r, on garde `cumul`, la somme des marques de cette ligne de la colonne 1 à c, et la couverture de (r, c) vaut la couverture de (r − 1, c) plus `cumul`. Il suffit de garder en mémoire la ligne précédente. À chaque case, on compare la couverture à K.

Sur le premier exemple, les rectangles (1, 1, 3, 3) et (2, 2, 4, 5) se chevauchent sur les 4 cases des lignes 2 et 3, colonnes 2 et 3, et le petit rectangle (3, 1, 3, 1) couvre une case déjà couverte par le premier : 5 cases sont couvertes au moins 2 fois.

**Complexité.** O(1) par rectangle, puis un parcours de la grille : O(Q + N × M), soit environ un million d'opérations.

**Pourquoi la solution naïve est trop lente.** Remplir chaque rectangle case par case coûte jusqu'à N × M = 10⁶ additions par rectangle, soit 5 × 10⁹ pour 5 000 grands rectangles : plusieurs secondes même en C++, beaucoup trop en Python.

**Pièges.**
- La grille `diff` doit avoir une ligne N + 1 et une colonne M + 1, car R2 + 1 et C2 + 1 peuvent dépasser la grille d'une case.
- Oublier la quatrième marque `+1` en (R2 + 1, C2 + 1) : les cases en bas à droite du rectangle auraient une couverture de −1.
- On compte les cases couvertes **au moins** K fois, pas exactement K fois.
