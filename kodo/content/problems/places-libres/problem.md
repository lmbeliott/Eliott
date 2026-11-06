---
id: places-libres
title: Places libres
chapter: n1-affichage
order: 2
tags: [entrées-sorties, arithmétique]
samples: 2
---

## Énoncé
Une salle contient `C` places, et `P` de ces places sont déjà occupées.

Écris un programme qui lit `C` et `P`, puis affiche le nombre de places encore libres.

## Entrée
Deux lignes :
- la première contient l'entier `C`, le nombre de places dans la salle ;
- la deuxième contient l'entier `P`, le nombre de places déjà occupées.

## Sortie
Un seul entier : le nombre de places encore libres.

## Contraintes
- 1 ≤ C ≤ 200
- 0 ≤ P ≤ C

## Indices
1. Les deux nombres sont sur deux lignes différentes : il faut lire deux fois, une ligne à chaque fois.
2. En Python, `int(input())` lit une ligne et la transforme en nombre. En C++, `cin >> c >> p;` lit les deux nombres, même s'ils sont sur deux lignes.
3. Le nombre de places libres est `C - P`. Range-le dans une variable, par exemple `libres`, puis affiche-la.

## Solution
On lit `C`, puis `P`, chacun sur sa ligne, en les convertissant en entiers. Le nombre de places libres est la différence `C - P`, qu'on affiche.

Le piège classique en Python : appeler `input()` une seule fois. Chaque appel ne lit qu'**une** ligne ; comme les deux nombres sont sur deux lignes, il faut deux appels. À l'inverse, `map(int, input().split())` ne marche pas ici, car il cherche plusieurs nombres sur la même ligne.

Autre piège : afficher autre chose que le nombre demandé, par exemple `Places libres : 15`. La machine compare ta sortie mot à mot avec la réponse attendue : n'affiche que le nombre.
