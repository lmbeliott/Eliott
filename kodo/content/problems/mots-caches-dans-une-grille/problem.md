---
id: mots-caches-dans-une-grille
title: Mots cachés dans une grille
chapter: p2-synthese
order: 6
tags: [grilles, dictionnaires, chaînes]
samples: 2
---

## Énoncé
Une grille de lettres et une liste de `Q` mots sont données. Un mot est **caché** dans la grille si on peut le lire en suivant des cases consécutives en ligne droite, dans l'une des 8 directions : horizontalement, verticalement ou en diagonale, dans un sens ou dans l'autre.

Compter les mots de la liste qui sont cachés dans la grille.

Par exemple, dans la grille `abc` / `def`, on lit `fed` (de droite à gauche), `ae` et `bf` (en diagonale), `cf` (de haut en bas), mais pas `abcd`.

## Entrée
- La première ligne contient `R` et `C`, le nombre de lignes et de colonnes.
- Les `R` lignes suivantes contiennent chacune `C` lettres minuscules.
- La ligne suivante contient `Q`.
- Les `Q` lignes suivantes contiennent chacune un mot de lettres minuscules. Les `Q` mots sont tous différents.

## Sortie
Un seul entier : le nombre de mots cachés dans la grille.

## Contraintes
- 1 ≤ R, C ≤ 30
- 1 ≤ Q ≤ 2 000
- Chaque mot a entre 1 et 8 lettres.

## Indices
1. Chercher chaque mot séparément, à partir de chaque case et dans chaque direction, demande jusqu'à 2 000 × 900 × 8, soit environ 14 millions de départs : trop lent en Python.
2. Retourner le problème : depuis chaque case et dans chaque direction, on ne peut lire qu'au plus 8 mots de 1 à 8 lettres. Il y a donc au plus 900 × 8 × 8 = 57 600 mots lisibles.
3. Ranger tous les mots lisibles dans un ensemble, puis tester chaque mot de la liste avec `in`.

## Solution
Plutôt que de chercher chaque mot dans la grille, on fabrique d'abord **l'ensemble de tous les mots lisibles**. Pour chaque case de départ `(i, j)` et chaque direction `(di, dj)` parmi les 8 possibles, une fonction `ajouter_lectures` avance case par case en ajoutant une lettre à la fois : après chaque lettre, le mot lu jusque-là est ajouté à l'ensemble. Elle s'arrête au bord de la grille ou à 8 lettres, car aucun mot n'est plus long.

L'ensemble contient au plus 900 × 8 × 8 = 57 600 mots, et beaucoup moins en réalité, car il supprime les doublons (une lettre seule est lue 8 fois depuis la même case). Ensuite, chaque mot de la liste se teste en une seule opération `in`.

Les 8 directions sont rangées dans une liste de couples `(di, dj)` : c'est plus sûr que d'écrire 8 boucles presque identiques. La lecture d'un mot de droite à gauche correspond simplement à la direction `(0, -1)` : il n'y a pas besoin de retourner les mots.
