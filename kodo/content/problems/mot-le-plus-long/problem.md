---
id: mot-le-plus-long
title: Mot le plus long
chapter: p2-chaines
order: 1
tags: [chaînes]
samples: 2
---

## Énoncé
Parmi `N` mots, afficher le plus long, puis sa longueur. Si plusieurs mots ont la longueur maximale, afficher celui qui apparaît en premier.

## Entrée
La première ligne contient l'entier `N`. La deuxième ligne contient les `N` mots, séparés par des espaces. Chaque mot est formé de lettres minuscules.

## Sortie
Une seule ligne avec le mot le plus long, une espace, puis sa longueur.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque mot contient entre 1 et 100 lettres.

## Indices
1. `len(m)` donne la longueur du mot `m` (en C++, `m.size()`).
2. C'est une recherche de maximum : on garde le meilleur mot trouvé jusqu'ici, et on le remplace quand un mot est **strictement** plus long.

## Solution
On parcourt les mots en gardant le meilleur trouvé jusqu'ici, initialisé avec le premier mot. Chaque fois qu'un mot est strictement plus long que le meilleur, il le remplace. À la fin, on affiche le meilleur mot et sa longueur.

Le piège : utiliser `>=` au lieu de `>`. On garderait alors le **dernier** des mots de longueur maximale, et non le premier. Il ne faut pas non plus comparer les mots eux-mêmes avec `<` : cette comparaison suit l'ordre du dictionnaire, pas la longueur (« zoo » est plus grand que « abricot »).
