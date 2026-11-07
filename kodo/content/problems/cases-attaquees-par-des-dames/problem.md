---
id: cases-attaquees-par-des-dames
title: Cases attaquées par des dames
chapter: p2-grilles
order: 5
tags: [grilles]
samples: 2
---

## Énoncé
Un plateau de `N` lignes et `M` colonnes contient des dames `D`, des obstacles `#` et des cases vides `.`. Une dame attaque en ligne droite dans les 8 directions (horizontales, verticales et diagonales), case après case, jusqu'au bord du plateau ou jusqu'à la première case non vide, qui arrête sa vue.

Compter les cases **vides** attaquées par au moins une dame.

## Entrée
- La première ligne contient deux entiers `N` et `M`.
- Chacune des `N` lignes suivantes contient `M` caractères parmi `D`, `#` et `.`.

## Sortie
Le nombre de cases vides attaquées par au moins une dame.

## Contraintes
- 1 ≤ N ≤ 40 et 1 ≤ M ≤ 40

## Indices
1. Une case peut être attaquée par plusieurs dames : pour ne la compter qu'une fois, la marquer dans une grille de booléens, puis compter les cases marquées à la fin.
2. Ranger les 8 directions dans deux listes `di` et `dj`. Pour chaque dame et chaque direction, avancer pas à pas tant que la case suivante est dans le plateau et vide.
3. La boucle d'avancée s'écrit avec un `while` dont la condition vérifie d'abord les bornes, puis le contenu de la case.

## Solution
On crée une grille `attaquee` de `N × M` booléens à `False`, avec une nouvelle ligne par tour de boucle (et non `[[False] * M] * N`, qui ferait de toutes les lignes la même liste).

Pour chaque dame en `(i, j)` et chaque direction `d` parmi les 8, on part de la case voisine `(i + di[d], j + dj[d])` et on avance tant que la case est dans le plateau et vide : on la marque, puis on passe à la suivante dans la même direction. La boucle s'arrête au bord ou sur la première case occupée (dame ou obstacle), qui n'est pas comptée puisqu'elle n'est pas vide.

L'ordre des tests dans la condition du `while` compte : on vérifie `0 <= a < N and 0 <= b < M` **avant** de lire `g[a][b]`. Grâce au `and`, la case n'est lue que si elle existe. Sans le test `0 <= a`, Python lirait silencieusement la dernière ligne avec l'indice -1, et la dame « traverserait » le bord.

Il reste à compter les cases marquées. Le programme fait au plus 8 × 40 pas par dame, et il y a au plus 1 600 dames : environ 500 000 pas, c'est rapide.
