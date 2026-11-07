---
id: chute-de-blocs-et-lignes-pleines
title: Chute de blocs et lignes pleines
chapter: p2-grilles
order: 8
synthesis: true
tags: [grilles, simulation, fonctions]
samples: 2
---

## Énoncé
Un puits vertical de `H` lignes et `W` colonnes est vide au départ. On y lâche `Q` blocs rectangulaires, l'un après l'autre. Chaque bloc a une hauteur `h`, une largeur `w`, et occupe les colonnes `c` à `c + w - 1` (colonnes numérotées de 1 à `W`).

Pour chaque bloc, dans l'ordre :
1. Le bloc apparaît tout en haut du puits : il occupe les lignes 1 à `h`.
2. Il descend d'une ligne tant que toutes les cases qu'il occuperait sont dans le puits et vides.
3. Une fois arrêté, ses cases deviennent pleines.
4. Chaque ligne entièrement pleine est supprimée. Les lignes situées au-dessus descendent pour combler le vide, sans changer d'ordre, et des lignes vides apparaissent en haut du puits.

Afficher le nombre total de lignes supprimées, puis l'état final du puits.

## Entrée
- La première ligne contient trois entiers `H`, `W` et `Q`.
- Chacune des `Q` lignes suivantes contient trois entiers `h`, `w` et `c` : la hauteur, la largeur et la colonne de gauche d'un bloc.

## Sortie
- Sur la première ligne, le nombre total de lignes supprimées.
- Puis `H` lignes de `W` caractères, du haut vers le bas du puits : `#` pour une case pleine, `.` pour une case vide.

## Contraintes
- 1 ≤ H ≤ 30 et 1 ≤ W ≤ 15
- 1 ≤ Q ≤ 200
- 1 ≤ h ≤ H, 1 ≤ w ≤ W et 1 ≤ c ≤ W - w + 1
- Quand un bloc apparaît, les cases qu'il occupe sont toujours vides.

## Indices
1. Découper en fonctions : `place_libre(g, r, c, h, w)` dit si le rectangle dont le coin en haut à gauche est `(r, c)` est entièrement dans le puits et vide ; `poser(g, r, c, h, w)` remplit ce rectangle ; `supprimer_lignes(g)` retire les lignes pleines.
2. Pour la chute : partir de `r = 0` et augmenter `r` tant que `place_libre(g, r + 1, c, h, w)` est vrai.
3. Pour supprimer les lignes pleines, construire une nouvelle grille : d'abord autant de lignes vides que de lignes pleines trouvées, puis les lignes non pleines, dans leur ordre.

## Solution
Le puits est une grille de caractères, avec une nouvelle ligne par tour de boucle à la création. Trois fonctions font tout le travail.

- `place_libre(g, r, c, h, w)` renvoie `False` si le rectangle sort du puits (`r + h > H`), ou si l'une de ses cases est pleine ; sinon `True`. Le bloc qui tombe n'est pas encore écrit dans la grille, il ne se gêne donc pas lui-même.
- La chute : on part de `r = 0` (l'énoncé garantit que cette place est libre) et, tant que `place_libre(g, r + 1, c, h, w)`, on augmente `r`. Puis `poser` remplit le rectangle de `#`.
- `supprimer_lignes(g)` compte les lignes pleines et construit une nouvelle grille : `k` lignes vides en haut, où `k` est le nombre de lignes pleines, puis les lignes non pleines de haut en bas. Les lignes conservent ainsi leur ordre, et chacune descend d'autant de lignes qu'il y avait de lignes pleines sous elle. La fonction renvoie la nouvelle grille et `k` : en Python avec `return h, k`, en C++ en modifiant la grille passée par référence et en renvoyant `k`.

Construire une nouvelle grille évite un piège : supprimer les lignes une par une dans la grille elle-même, en parcourant les indices, fait sauter la ligne qui vient prendre la place de la ligne supprimée, et deux lignes pleines voisines ne seraient pas toutes les deux retirées.

Attention aussi : après une suppression, les lignes descendent d'un bloc entier, pas case par case. Une case pleine peut rester au-dessus d'un trou : c'est la règle, il n'y a pas de seconde chute.

Chaque bloc demande au plus `H` essais de `h × w` cases, puis un passage sur la grille : le programme est très rapide.
