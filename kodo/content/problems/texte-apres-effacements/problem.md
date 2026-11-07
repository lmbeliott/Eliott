---
id: texte-apres-effacements
title: Texte après effacements
chapter: p3-piles-files
order: 1
tags: [listes, chaînes, simulation]
samples: 2
---

## Énoncé
On enregistre les touches frappées sur un clavier. Une lettre minuscule ajoute cette lettre à la fin du texte ; le caractère `<` représente la touche d'effacement, qui supprime la dernière lettre du texte. Sur un texte vide, l'effacement ne fait rien.

Afficher le texte obtenu à la fin.

## Entrée
Une seule ligne : la suite des `N` touches frappées, sans espace.

## Sortie
Le texte final, ou `VIDE` s'il ne contient aucune lettre.

## Contraintes
- 1 ≤ N ≤ 100 000

## Indices
1. La lettre effacée est toujours la **dernière** ajoutée parmi celles qui restent : c'est le comportement d'une pile.
2. Garder les lettres dans une liste : `append` pour une lettre, `pop` pour `<` (seulement si la liste n'est pas vide).

## Solution
On garde le texte dans une pile de caractères (une liste Python, un `string` ou un `vector<char>` en C++). Pour une lettre, on l'empile ; pour `<`, on dépile si la pile n'est pas vide. À la fin, la pile contient le texte, de la première lettre (en bas) à la dernière (en haut).

C'est juste, car à tout moment la pile est exactement le texte affiché : ajouter une lettre l'ajoute en haut, c'est-à-dire à la fin, et l'effacement retire celle du haut, c'est-à-dire la dernière.

Chaque touche coûte une seule opération sur la pile : environ N opérations en tout. Reconstruire une nouvelle chaîne à chaque effacement (`s = s[:-1]`) recopierait tout le texte à chaque fois. Le piège classique : dépiler une pile vide, ce qui provoque `IndexError: pop from empty list` en Python.
