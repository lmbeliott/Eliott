---
id: distance-dans-une-spirale
title: Distance dans une spirale
chapter: n2-fonctions
order: 5
tags: [fonctions, mathématiques]
samples: 2
---

## Énoncé
On écrit les entiers 1, 2, 3… dans les cases d'un quadrillage infini, en spirale : `1` est dans une case, `2` dans la case à sa droite, puis la spirale tourne dans le sens inverse des aiguilles d'une montre : `3` au-dessus de `2`, `4` et `5` vers la gauche, `6` et `7` vers le bas, `8`, `9` et `10` vers la droite, et ainsi de suite. Voici le centre du quadrillage :

```
17 16 15 14 13
18  5  4  3 12
19  6  1  2 11
20  7  8  9 10
21 22 23 24 25
```

La **distance** entre deux nombres est le nombre minimum de pas pour aller de la case de l'un à la case de l'autre, en passant à chaque pas d'une case à une case voisine par un côté (à gauche, à droite, en haut ou en bas). Par exemple, la distance entre `12` et `21` vaut 7.

Écris un programme qui répond à `Q` questions : pour chacune, il affiche la distance entre deux nombres `A` et `B`.

## Entrée
- La première ligne contient l'entier `Q`, le nombre de questions.
- Les `Q` lignes suivantes contiennent chacune deux entiers `A` et `B`.

## Sortie
`Q` lignes : pour chaque question, dans l'ordre, la distance entre `A` et `B`.

## Contraintes
- 1 ≤ Q ≤ 10
- 1 ≤ A, B ≤ 1 000 000 000

## Indices
1. Écris une fonction qui donne la position d'un nombre : sa colonne `x` (positive vers la droite) et sa ligne `y` (positive vers le haut), avec `1` en `(0, 0)`. La distance entre `A` et `B` est alors `|xA - xB| + |yA - yB|`. Comme une fonction simple ne renvoie qu'une valeur, tu peux en écrire deux : une pour `x`, une pour `y`. Attention : suivre la spirale case par case jusqu'à un milliard serait beaucoup trop lent.
2. Regarde les carrés impairs : `9 = 3 × 3` est dans le coin en bas à droite du carré 3 sur 3 qui entoure `1`, et `25 = 5 × 5` dans le coin en bas à droite du carré 5 sur 5. Les nombres de `(2k - 1)² + 1` à `(2k + 1)²` forment l'**anneau** numéro `k`, le bord du carré de côté `2k + 1`. Une fonction `anneau(n)` peut trouver le plus petit `k` tel que `(2k + 1)² ≥ n`.
3. L'anneau `k` contient `8k` nombres, répartis en quatre côtés de `2k` nombres : le côté droit (en montant), le côté du haut (vers la gauche), le côté gauche (en descendant), puis le côté du bas (vers la droite). Calcule `m = n - (2k - 1)²`, le rang de `n` sur son anneau (de 1 à `8k`) : sur le côté droit, `m ≤ 2k`, et la position est `(k, -k + m)`.

## Solution
On découpe le problème en petites fonctions :
- `anneau(n)` trouve l'anneau de `n` ;
- `abscisse(n)` et `ordonnee(n)` donnent la colonne et la ligne de `n` ;
- `distance(a, b)` combine les deux : `|xa - xb| + |ya - yb|`.

Pour l'anneau : le carré de côté `2k + 1` centré sur `1` contient exactement les nombres de 1 à `(2k + 1)²`, et ce dernier se trouve dans son coin en bas à droite, en `(k, -k)`. L'anneau de `n` est donc le plus petit `k` tel que `(2k + 1)² ≥ n` : une boucle `while` le trouve en au plus 15 812 tours pour un milliard (bien moins que les 10⁹ pas qu'il faudrait pour suivre la spirale case par case).

Pour la position : le premier nombre de l'anneau `k`, `(2k - 1)² + 1`, est juste à droite du coin de l'anneau précédent, en `(k, -k + 1)`. Avec `m = n - (2k - 1)²`, compris entre 1 et `8k` :
- si `m ≤ 2k` : côté droit, en montant, position `(k, -k + m)` ;
- sinon si `m ≤ 4k` : côté du haut, vers la gauche, position `(k - (m - 2k), k)` ;
- sinon si `m ≤ 6k` : côté gauche, en descendant, position `(-k, k - (m - 4k))` ;
- sinon : côté du bas, vers la droite, position `(-k + (m - 6k), -k)`.

Le nombre `1` (anneau 0) est un cas à part : sa position est `(0, 0)`.

Exemple : pour `21`, on a `k = 2` (car 9 < 21 ≤ 25) et `m = 21 - 9 = 12`. Comme 8 < 12 ≤ 12, c'est le côté gauche : `(-2, 2 - (12 - 8)) = (-2, -2)`. Pour `12`, `m = 3 ≤ 4`, côté droit : `(2, 1)`. La distance vaut `|2 - (-2)| + |1 - (-2)| = 7`.

Chaque fonction se vérifie séparément sur le dessin de l'énoncé, ce qui permet de trouver vite les erreurs d'un cran, très faciles à faire ici. En C++, `(2k + 1)²` reste un peu au-dessus d'un milliard au maximum : un `int` suffit.
