---
id: faire-rouler-un-de
title: Faire rouler un dé
chapter: p4-graphes-implicites
order: 8
synthesis: true
tags: [grilles, parcours-en-largeur, mathématiques]
samples: 2
---

## Énoncé
Un dé à six faces est posé sur la case `S` d'une grille de `R` lignes et `C` colonnes. Comme sur tout dé, deux faces opposées ont une somme de 7. Au départ, la face `1` est sur le dessus, la face `2` regarde le nord (le haut de la grille) et la face `3` regarde l'est (la droite).

Un déplacement fait **basculer** le dé sur une de ses arêtes du bas, vers une case voisine (nord, sud, est ou ouest) qui n'est pas un mur. En basculant vers l'est, par exemple, la face ouest arrive sur le dessus, la face du dessus passe à l'est, la face est passe dessous et la face du dessous passe à l'ouest ; les faces nord et sud ne bougent pas.

Calculer le nombre minimal de déplacements pour que le dé se trouve sur la case `T` avec la face `F` sur le dessus, ou afficher `-1` si c'est impossible.

## Entrée
- La première ligne contient trois entiers `R`, `C` et `F`.
- Les `R` lignes suivantes contiennent chacune `C` caractères : `.` pour une case libre, `#` pour un mur, `S` pour le départ et `T` pour l'arrivée.

La grille contient exactement un `S` et un `T`, sur des cases différentes.

## Sortie
Un seul entier : le nombre minimal de déplacements, ou `-1`.

## Contraintes
- 1 ≤ R, C ≤ 50
- 2 ≤ R × C
- 1 ≤ F ≤ 6

## Indices
1. La case ne suffit pas à décrire la situation : il faut aussi savoir comment le dé est tourné. Trois faces (dessus, nord, est) suffisent, les trois autres sont leurs opposées.
2. Écrire les nouvelles faces (dessus, nord, est) après un basculement dans chacune des 4 directions, en utilisant le fait que la face opposée à `x` est `7 − x`.
3. Un dé peut être tourné de 24 façons : il y a au plus 24 × 50 × 50 = 60 000 états. Un parcours en largeur sur les états `(ligne, colonne, dessus, nord, est)` donne la réponse.

## Solution
Un état est la position du dé et son **orientation**. On décrit l'orientation par trois faces : `h` (dessus), `n` (nord) et `e` (est) ; le dessous vaut `7 − h`, le sud `7 − n` et l'ouest `7 − e`. Un basculement donne :
- vers le nord : `(h, n, e) → (7 − n, h, e)` (la face sud monte, le dessus part au nord) ;
- vers le sud : `(h, n, e) → (n, 7 − h, e)` ;
- vers l'est : `(h, n, e) → (7 − e, n, h)` ;
- vers l'ouest : `(h, n, e) → (e, n, 7 − h)`.

On fait un parcours en largeur dans le graphe implicite des états `(i, j, h, n, e)`, depuis `(S, 1, 2, 3)`, en refusant les murs. On code chaque état par un entier (`((h × 7 + n) × 7 + e) × R × C + i × C + j`, toujours inférieur à 343 × R × C) pour utiliser un tableau de distances. La réponse est la distance du premier état défilé qui est sur `T` avec `h = F`. C'est bien un minimum, car chaque suite de basculements correspond à un chemin du graphe d'états, de même longueur.

**Complexité.** Un dé a exactement 24 orientations : 6 choix pour la face du dessus, puis 4 pour la face nord. Le parcours visite au plus 24 × R × C = 60 000 états, avec 4 voisins chacun.

**Remarques.** Dans un couloir d'une seule ligne, le dé ne roule que vers l'est ou l'ouest : la face nord ne change jamais, et la face `2` ne vient jamais dessus. Sur une grille 2 × 2, seules trois faces peuvent venir dessus : `1`, `2` et `4` si `S` est en haut à gauche. Sur une grande grille, toutes les faces peuvent venir dessus sur toutes les cases, mais le parcours montre que seules 12 des 24 orientations sont possibles sur une case donnée. Depuis l'orientation de départ, faire le tour d'un carré de 2 × 2 cases vers l'est, le sud, l'ouest puis le nord ramène le dé à sa place avec la face `4` sur le dessus ; dans l'autre sens, c'est la face `5`.
