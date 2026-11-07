---
id: couvrir-un-sol-de-dalles
title: Couvrir un sol de dalles
chapter: n1-affichage
order: 7
tags: [entrées-sorties, arithmétique]
samples: 2
---

## Énoncé
Un sol rectangulaire mesure `L` centimètres de long et `H` centimètres de large. On le recouvre de dalles carrées de `C` centimètres de côté, posées en lignes et en colonnes à partir d'un coin du sol. Au bord, les dalles qui dépassent sont coupées à la bonne taille, et les morceaux coupés sont jetés.

Écris un programme qui affiche le nombre de dalles utilisées, puis la surface jetée, en centimètres carrés.

Ce problème se résout sans `if` et sans boucle : uniquement avec des calculs.

## Entrée
Une seule ligne contenant trois entiers `L`, `H` et `C` séparés par des espaces : la longueur et la largeur du sol, puis le côté d'une dalle, en centimètres.

## Sortie
Deux lignes :
- sur la première, le nombre de dalles utilisées ;
- sur la deuxième, la surface des morceaux jetés, en centimètres carrés.

## Contraintes
- 1 ≤ L, H, C ≤ 10 000

## Indices
1. Commence par une seule ligne de dalles, le long du côté de `L` centimètres. Avec `L = 250` et `C = 50`, il faut 5 dalles. Et avec `L = 260` ? Il en faut 6 : la dernière est coupée.
2. Le nombre de dalles sur une ligne est `L` divisé par `C`, arrondi **au-dessus**. Or `L // C` arrondit au-dessous. L'astuce : `(L + C - 1) // C` arrondit au-dessus, sans `if`. Essaie-la avec `L = 250` puis `L = 260`.
3. Le nombre total de dalles est le nombre de dalles sur la longueur multiplié par le nombre de dalles sur la largeur. Pour la surface jetée : calcule la surface de toutes les dalles posées, et enlève la surface du sol.

## Solution
Sur la longueur, il faut assez de dalles pour couvrir `L` centimètres : c'est `L / C` arrondi au-dessus. Par exemple, pour 260 centimètres et des dalles de 50, 5 dalles ne couvrent que 250 centimètres : il en faut 6.

La division entière `L // C` arrondit au-dessous. Pour arrondir au-dessus sans `if`, on ajoute `C - 1` avant de diviser : `(L + C - 1) // C`. Si `L` est un multiple de `C`, ajouter `C - 1` ne suffit pas à passer au multiple suivant, et le résultat ne change pas. Sinon, il reste déjà au moins 1, et ajouter `C - 1` fait passer exactement au quotient suivant.

On fait de même sur la largeur, et le nombre de dalles est le produit des deux nombres : `nl × nh`.

Pour la surface jetée, inutile de calculer chaque morceau : toutes les dalles posées couvrent `nl × nh × C × C` centimètres carrés, et le sol en garde `L × H`. La différence est ce qui a été jeté.

Exemple : `L = 250`, `H = 130`, `C = 50`. Sur la longueur, `(250 + 49) // 50 = 5` dalles ; sur la largeur, `(130 + 49) // 50 = 3` dalles. Cela fait 15 dalles, qui couvrent 15 × 2 500 = 37 500 centimètres carrés, pour un sol de 32 500 : 5 000 centimètres carrés sont jetés.

Les pièges : utiliser `L // C`, qui oublie la dernière dalle coupée ; ou calculer `(L × H) // (C × C)` arrondi au-dessus, ce qui compte la surface mais pas la façon dont les dalles sont posées. Avec `L = H = 30` et `C = 20`, la surface du sol vaut 900, moins que 3 dalles (1 200), et pourtant il en faut 4.
