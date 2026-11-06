---
id: course-de-luge
title: La course de luge
chapter: n1-conditions
order: 2
tags: [conditions]
samples: 3
---

## Énoncé
Chaque hiver, Mia et Théo font la course de luge sur la piste du village. Chacun descend à son tour, et Hugo chronomètre leur descente en secondes. Le plus rapide, c'est-à-dire celui qui a mis **le moins de temps**, gagne la course.

Écris un programme qui lit le temps de Mia puis celui de Théo, et affiche le nom du gagnant, ou `EGALITE` si leurs temps sont égaux.

## Entrée
Une seule ligne contenant deux entiers `A` et `B` séparés par une espace : le temps de Mia, puis le temps de Théo, en secondes.

## Sortie
Un seul mot, en majuscules et sans accent :
- `MIA` si Mia a gagné ;
- `THEO` si Théo a gagné ;
- `EGALITE` si les deux temps sont égaux.

## Contraintes
- 1 ≤ A, B ≤ 600

## Indices
1. Il y a trois cas possibles. En Python, on les enchaîne avec `if`, `elif` et `else` ; en C++, avec `if`, `else if` et `else`.
2. Mia gagne si son temps est **plus petit** que celui de Théo : `a < b`.
3. Si Mia n'a pas gagné et que Théo non plus, il ne reste qu'une possibilité : l'égalité. Le `else` final s'en occupe.

## Solution
On compare les deux temps :
- si `A < B`, Mia a été plus rapide : on affiche `MIA` ;
- sinon, si `B < A`, c'est Théo : on affiche `THEO` ;
- sinon, les deux temps sont égaux : on affiche `EGALITE`.

Le premier piège est de croire que le plus grand nombre gagne, comme pour un score. Ici, on compte un temps : le plus petit est le meilleur.

Le second piège est d'oublier l'égalité. Avec seulement un `if` et un `else`, un programme comme « si `A < B` alors `MIA`, sinon `THEO` » donnerait la victoire à Théo quand les temps sont égaux.
