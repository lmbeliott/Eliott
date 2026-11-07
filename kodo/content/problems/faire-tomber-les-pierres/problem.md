---
id: faire-tomber-les-pierres
title: Faire tomber les pierres
chapter: p2-grilles
order: 4
tags: [grilles, simulation]
samples: 2
---

## Énoncé
Une grille verticale de `N` lignes et `M` colonnes contient des pierres `o`, des blocs fixes `#` et des cases vides `.`. Les pierres tombent vers le bas : chacune descend tant que la case juste en dessous est vide. Elle s'arrête sur le fond de la grille, sur un bloc fixe ou sur une pierre déjà arrêtée. Les blocs fixes ne bougent pas.

Afficher la grille quand plus aucune pierre ne peut bouger.

## Entrée
- La première ligne contient deux entiers `N` et `M`.
- Chacune des `N` lignes suivantes contient `M` caractères parmi `o`, `#` et `.`. La première ligne est le haut de la grille.

## Sortie
`N` lignes de `M` caractères : la grille finale.

## Contraintes
- 1 ≤ N ≤ 100 et 1 ≤ M ≤ 100

## Indices
1. Les colonnes sont indépendantes : une pierre ne quitte jamais sa colonne.
2. Dans une colonne, parcourir les cases **de bas en haut**, en retenant la ligne `libre` où la prochaine pierre rencontrée viendra se poser.
3. Au départ, `libre` est la dernière ligne. Un bloc `#` en ligne `i` donne `libre = i - 1` ; une pierre est déplacée en ligne `libre`, puis `libre` remonte d'une ligne.

## Solution
Une pierre ne change jamais de colonne, et dans une colonne, les pierres qui se trouvent au-dessus d'un même bloc fixe (ou du fond), sans autre bloc entre elles, finissent empilées sur ce bloc. On traite donc chaque colonne séparément.

On lit la grille sous forme de listes de caractères (`list(input())`) pour pouvoir la modifier. Pour une colonne `j`, on parcourt `i` de `N - 1` à 0 en gardant `libre`, la ligne la plus basse encore disponible, qui vaut `N - 1` au départ :
- si la case est un bloc `#`, rien ne peut descendre en dessous : `libre = i - 1` ;
- si c'est une pierre, on la retire de la ligne `i` et on la pose en ligne `libre`, puis `libre` diminue de 1 ;
- si la case est vide, on ne fait rien.

Comme on parcourt de bas en haut, `libre` est toujours supérieur ou égal à `i` au moment où l'on rencontre une pierre : on la déplace vers le bas ou on la laisse en place. Il faut retirer la pierre **avant** de la poser, sinon une pierre déjà à sa place (`libre == i`) serait effacée.

Une autre méthode, plus lente mais juste : répéter « chaque pierre qui a une case vide en dessous descend d'une case » jusqu'à ce que plus rien ne bouge. Elle peut demander `N` passages sur toute la grille, soit jusqu'à un million d'opérations, ce qui reste acceptable ici.
