---
id: rendu-de-monnaie-de-1-a-50
title: Rendu de monnaie de 1 à 50
chapter: p1-variables
order: 8
synthesis: true
tags: [boucles, arithmétique]
samples: 1
no_input: true
---

## Énoncé
Une caisse dispose d'autant de pièces de `1`, `2`, `5` et `10` euros qu'elle veut. Pour chaque somme de `1` à `50` euros, afficher le plus petit nombre de pièces qui permet de former exactement cette somme. Afficher ensuite le total de ces 50 nombres de pièces.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
50 lignes, pour les sommes de 1 à 50 dans l'ordre : la somme, une espace, puis le nombre minimal de pièces. Enfin, une dernière ligne contenant le total des 50 nombres de pièces.

Par exemple, la ligne de la somme 18 est `18 4`, car 18 = 10 + 5 + 2 + 1, et on ne peut pas faire mieux.

## Indices
1. Pour utiliser peu de pièces, on prend d'abord autant de pièces de 10 que possible, puis de 5 avec ce qui reste, puis de 2, puis de 1.
2. Le nombre de pièces de 10 est `m // 10`, et il reste `m % 10` euros à former. Continuer de la même façon avec 5, puis avec 2.
3. Un accumulateur, initialisé avant la boucle, additionne les nombres de pièces des 50 sommes.

## Solution
Pour une somme `m`, on applique la méthode « la plus grosse pièce d'abord » à l'aide du quotient et du reste :

- `m // 10` pièces de 10, et il reste `r = m % 10` ;
- `r // 5` pièces de 5, et il reste `r % 5` ;
- puis, avec ce reste `s`, `s // 2` pièces de 2 et `s % 2` pièce de 1.

Pour m = 18 : 1 pièce de 10, reste 8 ; 1 pièce de 5, reste 3 ; 1 pièce de 2 et 1 pièce de 1 : 4 pièces. On calcule ce nombre dans une boucle sur `m` de 1 à 50, on l'affiche avec `m`, et on l'ajoute à un accumulateur `total` initialisé à 0. Après la boucle, on affiche `total`, qui vaut 190.

Pourquoi cette méthode donne-t-elle le minimum ? Dans une solution optimale, on n'utilise jamais deux pièces de 5 (une pièce de 10 les remplace), ni deux pièces de 1 (une pièce de 2 suffit), ni trois pièces de 2 (5 + 1 fait pareil avec une pièce de moins), ni 2 + 2 + 1 (une pièce de 5). Les petites pièces d'une solution optimale totalisent donc au plus 9 euros, et elles sont exactement celles que choisit la méthode. Attention : ce n'est pas vrai pour n'importe quel système de pièces. Avec des pièces de 1, 3 et 4, la méthode donne 4 + 1 + 1 pour 6 euros, alors que 3 + 3 suffit.
