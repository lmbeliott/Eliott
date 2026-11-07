---
id: generations-d-un-automate-cellulaire
title: Générations d'un automate cellulaire
chapter: p2-synthese
order: 4
tags: [grilles, simulation, fonctions]
samples: 2
---

## Énoncé
Une grille de `R` lignes et `C` colonnes contient des cases vivantes (`#`) et des cases mortes (`.`). Les **voisines** d'une case sont les 8 cases qui la touchent, par un côté ou par un coin ; les cases hors de la grille comptent comme mortes.

À chaque génération, toutes les cases changent **en même temps**, selon le nombre de leurs voisines vivantes :
- une case vivante reste vivante si elle a 2 ou 3 voisines vivantes, sinon elle meurt ;
- une case morte devient vivante si elle a exactement 3 voisines vivantes, sinon elle reste morte.

Afficher la grille après `K` générations.

## Entrée
La première ligne contient `R`, `C` et `K`. Les `R` lignes suivantes contiennent chacune `C` caractères `#` ou `.`.

## Sortie
La grille après `K` générations : `R` lignes de `C` caractères.

## Contraintes
- 1 ≤ R, C ≤ 30
- 0 ≤ K ≤ 50

## Indices
1. Écrire une fonction `voisins_vivants(grille, i, j)` qui compte les voisines vivantes de la case `(i, j)`, en ignorant les positions hors de la grille.
2. Les changements sont simultanés : calculer la génération suivante dans une **nouvelle** grille, sans modifier l'ancienne pendant le calcul.
3. Une deuxième fonction `generation_suivante(grille)` renvoie la nouvelle grille ; il reste à l'appeler `K` fois.

## Solution
On découpe le problème en deux fonctions.

`voisins_vivants(grille, i, j)` parcourt les décalages `di` et `dj` dans `{-1, 0, 1}`, sauf `(0, 0)` qui désigne la case elle-même. Pour chaque voisine `(i + di, j + dj)`, on vérifie d'abord qu'elle est dans la grille (`0 ≤ i + di < R` et `0 ≤ j + dj < C`), puis qu'elle est vivante. Tester la position **avant** de lire la case évite une erreur `IndexError`, et surtout, en Python, évite qu'un indice `-1` lise silencieusement la dernière ligne.

`generation_suivante(grille)` construit une nouvelle grille, ligne par ligne. Une case y est vivante si elle a 3 voisines vivantes, ou si elle en a 2 et qu'elle était déjà vivante : c'est une écriture compacte des deux règles.

Le piège principal est de modifier la grille sur place : une case changée trop tôt fausse le compte de ses voisines qui n'ont pas encore été traitées. Avec une nouvelle grille, chaque génération est calculée entièrement à partir de la précédente.

Le programme fait au plus 50 × 30 × 30 × 8, soit 360 000 tests de voisines : c'est rapide.
