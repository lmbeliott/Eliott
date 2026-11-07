---
id: sept-lignes-du-triangle-de-pascal
title: Sept lignes du triangle de Pascal
chapter: p1-affichage
order: 6
tags: [entrées-sorties, mathématiques]
samples: 1
no_input: true
---

## Énoncé
Un triangle de nombres se construit ligne par ligne. La première ligne contient seulement `1`. Chaque ligne suivante contient un nombre de plus que la précédente : elle commence et se termine par `1`, et chaque autre nombre est la somme des deux nombres situés juste au-dessus de lui dans la ligne précédente (celui de même position et celui qui le précède).

Afficher les 7 premières lignes de ce triangle.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
7 lignes. La ligne numéro k (de 1 à 7) contient k nombres séparés par une espace.

## Indices
1. Les quatre premières lignes sont `1`, `1 1`, `1 2 1` et `1 3 3 1`. Dans `1 3 3 1`, le premier `3` vaut 1 + 2 et le second 2 + 1.
2. Construire chaque ligne sur papier à partir de la précédente, puis vérifier qu'elle se lit de la même façon dans les deux sens.

## Solution
On construit les lignes une à une. La cinquième ligne est `1 4 6 4 1` (1 + 3, 3 + 3, 3 + 1), la sixième `1 5 10 10 5 1` et la septième `1 6 15 20 15 6 1`.

Deux vérifications rapides évitent les erreurs de calcul : chaque ligne est **symétrique** (elle se lit pareil de gauche à droite et de droite à gauche), et la somme des nombres d'une ligne est le double de celle de la ligne précédente (1, 2, 4, 8, 16, 32, 64). Par exemple 1 + 6 + 15 + 20 + 15 + 6 + 1 = 64.

Ce triangle s'appelle le **triangle de Pascal**. Ses nombres comptent de nombreuses choses : la ligne 7 donne, par exemple, le nombre de façons de choisir 0, 1, 2… 6 objets parmi 6.
