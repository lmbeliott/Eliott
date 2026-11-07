---
id: losange-d-etoiles
title: Losange d'étoiles
chapter: p1-affichage
order: 4
tags: [entrées-sorties]
samples: 1
no_input: true
---

## Énoncé
Afficher un losange d'étoiles `*` de largeur 7, dans un cadre de 7 lignes et 7 colonnes. Les cases vides sont remplies avec des points `.`. La ligne du milieu est entièrement remplie d'étoiles ; en s'éloignant du milieu, chaque ligne perd une étoile à chaque extrémité, jusqu'à la première et la dernière ligne, qui n'ont qu'une étoile, au centre.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
7 lignes de 7 caractères chacune, composées uniquement de `*` et de `.`.

## Indices
1. Commencer par la ligne du milieu (la quatrième) : elle contient 7 étoiles.
2. Les lignes 3 et 5 contiennent 5 étoiles, centrées : il reste un point de chaque côté.
3. La figure est symétrique : la ligne 7 est identique à la ligne 1, la ligne 6 à la ligne 2, etc.

## Solution
On part de la ligne du milieu, `*******`. En montant d'une ligne, on retire une étoile à chaque bout, remplacée par un point : `.*****.`, puis `..***..`, puis `...*...`. La moitié basse est le reflet de la moitié haute.

Le nombre d'étoiles par ligne est donc 1, 3, 5, 7, 5, 3, 1 : il augmente de 2 jusqu'au milieu puis diminue de 2. Chaque ligne a toujours 7 caractères : nombre de points à gauche + nombre d'étoiles + nombre de points à droite = 7. Les points sont indispensables : le correcteur ignore les espaces, il ne verrait donc pas un décalage fait avec des espaces.
