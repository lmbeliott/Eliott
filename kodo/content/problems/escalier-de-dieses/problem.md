---
id: escalier-de-dieses
title: Escalier de dièses
chapter: p1-affichage
order: 1
tags: [entrées-sorties]
samples: 1
no_input: true
---

## Énoncé
Afficher un escalier de 6 marches dessiné avec le caractère `#` : la première ligne contient un seul `#`, et chaque ligne en contient un de plus que la précédente.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
6 lignes. La ligne numéro k (de 1 à 6) contient exactement k caractères `#`, collés, sans autre caractère.

## Indices
1. Chaque ligne de la figure correspond à une instruction d'affichage.
2. Avant d'écrire le programme, dessiner l'escalier sur papier et compter les `#` de chaque ligne : 1, 2, 3, 4, 5, 6.

## Solution
Le programme est une séquence de 6 instructions d'affichage, une par marche, dans l'ordre : `#`, `##`, `###`, `####`, `#####`, `######`.

Le piège est de se tromper d'une marche : une ligne en trop, une ligne oubliée, ou deux lignes de même longueur. On le détecte en comparant la sortie à l'exemple, ligne par ligne. En C++, il ne faut pas oublier le `"\n"` à la fin de chaque ligne, sinon tous les `#` se retrouvent collés sur une seule ligne.
