---
id: cabine-du-telepherique
title: La cabine du téléphérique
chapter: n1-affichage
order: 2
tags: [entrées-sorties, arithmétique]
samples: 2
---

## Énoncé
Le téléphérique de Valcorde monte du village jusqu'au col des Aiguilles. Avant chaque départ, Yanis, le conducteur, compte les passagers déjà installés dans la cabine. Un petit écran au guichet indique alors aux gens qui attendent combien de places sont encore libres.

Écris un programme qui lit la capacité `C` de la cabine et le nombre `P` de passagers déjà à bord, puis affiche le nombre de places encore libres.

## Entrée
Deux lignes :
- la première contient l'entier `C`, le nombre de places dans la cabine ;
- la deuxième contient l'entier `P`, le nombre de passagers déjà à bord.

## Sortie
Un seul entier : le nombre de places encore libres dans la cabine.

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
