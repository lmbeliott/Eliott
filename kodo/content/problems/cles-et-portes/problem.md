---
id: cles-et-portes
title: Clés et portes
chapter: p4-graphes-implicites
order: 7
tags: [grilles, parcours-en-largeur, bits]
samples: 2
---

## Énoncé
Une grille de `R` lignes et `C` colonnes contient des cases libres, des murs, des clés et des portes. On part de la case `S` et l'on veut atteindre la case `T` ; un déplacement mène d'une case à une case voisine (haut, bas, gauche, droite), sans entrer dans un mur.

Les clés sont notées par les lettres `a` à `f`, les portes par les lettres `A` à `F`. Entrer sur une case clé ramasse cette clé, qu'on garde ensuite pour toujours. On ne peut entrer sur une porte `A` qu'après avoir ramassé au moins une clé `a`, et de même pour les autres lettres. Une même lettre peut apparaître sur plusieurs clés et plusieurs portes.

Calculer le nombre minimal de déplacements pour atteindre `T`, ou afficher `-1` si c'est impossible.

## Entrée
- La première ligne contient deux entiers `R` et `C`.
- Les `R` lignes suivantes contiennent chacune `C` caractères parmi `.` (case libre), `#` (mur), `S`, `T`, `a` à `f` et `A` à `F`.

La grille contient exactement un `S` et un `T`.

## Sortie
Un seul entier : le nombre minimal de déplacements, ou `-1`.

## Contraintes
- 1 ≤ R, C ≤ 40
- 2 ≤ R × C

## Indices
1. La position seule ne suffit pas à décrire la situation : passer deux fois par la même case peut être utile, si l'on a ramassé une clé entre-temps.
2. Un état est un triplet (ligne, colonne, clés ramassées). L'ensemble des clés ramassées parmi 6 se code par un entier de 0 à 63 : le bit `k` vaut 1 si la clé de la `k`-ième lettre est ramassée.
3. Il y a au plus 40 × 40 × 64 = 102 400 états : un parcours en largeur sur ces états, avec un tableau de distances indexé par un code entier, est assez rapide.

## Solution
Le graphe des cases ne suffit pas : on peut devoir revenir sur ses pas après avoir ramassé une clé (c'est le cas du deuxième exemple). On enrichit donc l'état : un sommet du graphe implicite est un triplet `(i, j, clés)`, où `clés` est un entier de 0 à 63 dont le bit `k` indique si la clé de la lettre `k` (`a` pour 0, `b` pour 1…) a été ramassée.

Depuis `(i, j, clés)`, on essaie les 4 cases voisines : on ignore un mur, et une porte dont le bit correspondant de `clés` vaut 0 ; sur une case clé, le nouvel ensemble est `clés | (1 << k)`. On code chaque état par l'entier `(clés × R + i) × C + j`, ce qui permet d'utiliser un simple tableau de distances de taille `64 × R × C`. Un parcours en largeur depuis `(S, 0)` donne la réponse : la distance du premier état défilé qui se trouve sur `T`.

**Pourquoi c'est juste.** Un chemin dans la grille qui respecte les règles correspond exactement à un chemin dans ce graphe d'états, de même longueur : l'ensemble des clés ramassées est entièrement déterminé par les cases déjà visitées. La plus courte distance dans le graphe d'états est donc le nombre minimal de déplacements.

**Complexité.** O(64 × R × C) états, 4 voisins chacun : environ 400 000 examens au plus.
