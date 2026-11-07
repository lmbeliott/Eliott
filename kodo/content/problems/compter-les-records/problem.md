---
id: compter-les-records
title: Compter les records
chapter: p1-conditions
order: 6
tags: [conditions, boucles]
samples: 2
---

## Énoncé
Un sauteur note la longueur de chacun de ses `N` sauts, dans l'ordre. Un saut est un **record** s'il est strictement plus long que tous les sauts précédents ; le premier saut est toujours un record. Afficher le nombre de records.

## Entrée
- La première ligne contient l'entier `N`.
- Les `N` lignes suivantes contiennent chacune un entier : la longueur d'un saut, en centimètres.

## Sortie
Un seul entier : le nombre de records.

## Contraintes
- 1 ≤ N ≤ 1 000
- 1 ≤ chaque longueur ≤ 1 000 000

## Indices
1. Un saut est plus long que **tous** les précédents exactement quand il est plus long que le meilleur des précédents.
2. On tient donc à jour le maximum courant, et un compteur.
3. Le premier saut compte pour un record : le compteur peut partir de 1, et le maximum courant de la première longueur.

## Solution
Comparer chaque saut à tous les précédents demanderait de les garder en mémoire. Ce n'est pas nécessaire : être plus grand que toutes les valeurs précédentes revient à être plus grand que leur maximum. On garde donc le maximum courant `meilleur`.

On lit le premier saut : c'est un record, donc `records = 1` et `meilleur` prend sa valeur. Pour chaque saut suivant, si sa longueur est strictement plus grande que `meilleur`, c'est un nouveau record : on augmente le compteur et on met à jour `meilleur`. Sinon, rien ne change.

Le piège est l'égalité : un saut qui égale le meilleur saut n'est pas un record, car il n'est pas **strictement** plus long. Il faut donc écrire `>` et non `>=`.
