---
id: meme-couleur-sur-un-damier
title: Même couleur sur un damier
chapter: n1-conditions
order: 5
tags: [conditions, arithmétique]
samples: 2
---

## Énoncé
Un très grand damier est formé de cases noires et blanches. Ses lignes et ses colonnes sont numérotées à partir de 1. La case de la ligne 1 et de la colonne 1 est noire, et deux cases qui se touchent par un côté sont toujours de couleurs différentes.

Écris un programme qui lit la position de deux cases et affiche `OUI` si elles sont de la même couleur, `NON` sinon.

## Entrée
- La première ligne contient deux entiers `L1` et `C1` : la ligne et la colonne de la première case.
- La deuxième ligne contient deux entiers `L2` et `C2` : la ligne et la colonne de la deuxième case.

Les deux cases peuvent être la même case.

## Sortie
Un seul mot : `OUI` si les deux cases sont de la même couleur, `NON` sinon.

## Contraintes
- 1 ≤ L1, C1, L2, C2 ≤ 1 000 000 000

## Indices
1. Dessine le coin en haut à gauche du damier et écris, dans chaque case, la somme de son numéro de ligne et de son numéro de colonne. Que remarques-tu pour les cases noires ?
2. Une case est noire quand la somme `L + C` est paire, et blanche quand elle est impaire. Le reste de la division par 2 (`%`) dit si un nombre est pair.
3. Deux cases sont de la même couleur quand leurs deux sommes sont toutes les deux paires, ou toutes les deux impaires : compare les restes `(L1 + C1) % 2` et `(L2 + C2) % 2`.

## Solution
Quand on avance d'une case vers la droite, la colonne augmente de 1 et la couleur change. Quand on descend d'une case, la ligne augmente de 1 et la couleur change aussi. Dans les deux cas, la somme `L + C` augmente de 1 : elle passe de pair à impair, ou d'impair à pair. Comme la case `(1, 1)` est noire et que `1 + 1 = 2` est pair, une case est noire exactement quand `L + C` est pair.

Il suffit donc de comparer la parité des deux sommes : si `(L1 + C1) % 2` est égal à `(L2 + C2) % 2`, les cases ont la même couleur et on affiche `OUI`, sinon `NON`.

Dessiner le damier en entier est impossible : il peut avoir un milliard de lignes. C'est la remarque sur la parité qui permet de répondre avec un seul calcul. En C++, la somme `L + C` peut atteindre 2 milliards, ce qui tient tout juste dans un `int` (la limite est un peu plus de 2,1 milliards).
