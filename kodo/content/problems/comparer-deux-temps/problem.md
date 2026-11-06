---
id: comparer-deux-temps
title: Comparer deux temps
chapter: n1-conditions
order: 2
tags: [conditions]
samples: 3
---

## Énoncé
Deux coureurs, numérotés 1 et 2, font la même course, et on mesure le temps de chacun en secondes. Le plus rapide, c'est-à-dire celui qui a mis **le moins de temps**, gagne la course.

Écris un programme qui lit le temps du coureur 1 puis celui du coureur 2, et affiche le numéro du gagnant, ou `EGALITE` si leurs temps sont égaux.

## Entrée
Une seule ligne contenant deux entiers `A` et `B` séparés par une espace : le temps du coureur 1, puis le temps du coureur 2, en secondes.

## Sortie
Une seule ligne :
- `1` si le coureur 1 a gagné ;
- `2` si le coureur 2 a gagné ;
- `EGALITE` (en majuscules, sans accent) si les deux temps sont égaux.

## Contraintes
- 1 ≤ A, B ≤ 600

## Indices
1. Il y a trois cas possibles. En Python, on les enchaîne avec `if`, `elif` et `else` ; en C++, avec `if`, `else if` et `else`.
2. Le coureur 1 gagne si son temps est **plus petit** que celui du coureur 2 : `a < b`.
3. Si le coureur 1 n'a pas gagné et que le coureur 2 non plus, il ne reste qu'une possibilité : l'égalité. Le `else` final s'en occupe.

## Solution
On compare les deux temps :
- si `A < B`, le coureur 1 a été plus rapide : on affiche `1` ;
- sinon, si `B < A`, c'est le coureur 2 : on affiche `2` ;
- sinon, les deux temps sont égaux : on affiche `EGALITE`.

Le premier piège est de croire que le plus grand nombre gagne, comme pour un score. Ici, on compte un temps : le plus petit est le meilleur.

Le second piège est d'oublier l'égalité. Avec seulement un `if` et un `else`, un programme comme « si `A < B` alors `1`, sinon `2` » donnerait la victoire au coureur 2 quand les temps sont égaux.
