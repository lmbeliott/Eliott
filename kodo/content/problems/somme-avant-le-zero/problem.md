---
id: somme-avant-le-zero
title: Somme avant le zéro
chapter: p1-tant-que
order: 1
tags: [boucles]
samples: 2
---

## Énoncé
Le programme lit des entiers, un par ligne. La valeur `0` marque la fin de l'entrée : elle ne compte pas comme une donnée.

Afficher la somme des entiers lus avant ce `0`, puis combien il y en a.

## Entrée
Des entiers non nuls, un par ligne, suivis d'une ligne contenant `0`.

## Sortie
Une seule ligne avec deux entiers séparés par une espace : la somme des valeurs, puis le nombre de valeurs.

## Contraintes
- Au plus 1 000 valeurs avant le `0` (il peut n'y en avoir aucune).
- Chaque valeur est comprise entre -1 000 000 et 1 000 000.

## Indices
1. On ne sait pas combien de valeurs il y a : il faut une boucle `while`, qui continue tant que la valeur lue n'est pas `0`.
2. Lire une première valeur avant la boucle. Dans le corps de la boucle, ajouter la valeur à la somme, augmenter le compteur, puis lire la valeur suivante, en dernier.
3. Si l'entrée ne contient que `0`, la boucle ne fait aucun tour : la réponse est `0 0`.

## Solution
C'est le schéma de la lecture jusqu'à une **sentinelle**. On lit une valeur avant la boucle ; tant qu'elle est différente de `0`, on la traite (on l'ajoute à `somme` et on augmente `nombre` de 1), puis on lit la suivante à la fin du corps de la boucle.

Comme la condition est testée juste après chaque lecture, le `0` final n'est jamais ajouté ni compté. Les deux variables `somme` et `nombre` sont mises à 0 avant la boucle, une seule fois.

Le piège principal est d'oublier la lecture à la fin du corps : la valeur ne change plus et la boucle ne s'arrête jamais.
