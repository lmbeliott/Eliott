---
id: compter-les-voyelles
title: Compter les voyelles
chapter: n2-chaines
order: 1
tags: [chaînes, boucles]
samples: 2
---

## Énoncé
On te donne un mot. Écris un programme qui affiche le nombre de voyelles du mot, puis le nombre de consonnes.

Les voyelles sont `a`, `e`, `i`, `o`, `u` et `y`. Toutes les autres lettres sont des consonnes.

## Entrée
Une seule ligne contenant le mot, écrit en lettres minuscules sans accents.

## Sortie
Deux lignes :
- sur la première, le nombre de voyelles du mot ;
- sur la seconde, le nombre de consonnes.

## Contraintes
- Le mot contient entre 1 et 100 lettres, toutes entre `a` et `z`.

## Indices
1. Parcours le mot lettre par lettre avec une boucle, et garde un compteur.
2. Pour chaque lettre, teste si c'est l'une des six voyelles. En Python, `lettre in "aeiouy"` fait ce test d'un coup.
3. Inutile de compter aussi les consonnes : chaque lettre est soit une voyelle, soit une consonne. Le nombre de consonnes vaut donc la longueur du mot moins le nombre de voyelles.

## Solution
On parcourt les lettres du mot une par une. Chaque fois que la lettre fait partie des voyelles, on ajoute 1 à un compteur. À la fin, ce compteur donne le nombre de voyelles, et la longueur du mot moins ce compteur donne le nombre de consonnes.

Le piège : oublier le `y`, qui compte ici comme une voyelle (`lynx` a une voyelle et trois consonnes).

En C++, on peut écrire le test avec des `||` : `c == 'a' || c == 'e' || …`. La longueur du mot s'obtient avec `mot.size()`.
