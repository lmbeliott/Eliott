---
id: minimum-et-maximum
title: Minimum et maximum
chapter: p1-conditions
order: 3
tags: [conditions, boucles]
samples: 2
---

## Énoncé
Lire `N` entiers et afficher le plus petit, puis le plus grand.

## Entrée
- La première ligne contient l'entier `N`.
- Les `N` lignes suivantes contiennent chacune un entier.

## Sortie
Une seule ligne contenant deux entiers séparés par une espace : la plus petite valeur, puis la plus grande.

## Contraintes
- 1 ≤ N ≤ 1 000
- −1 000 000 000 ≤ chaque valeur ≤ 1 000 000 000

## Indices
1. On garde deux variables : la plus petite valeur vue jusqu'ici, et la plus grande.
2. Les deux partent de la première valeur lue. Que se passerait-il si on partait de 0 et que toutes les valeurs étaient négatives ?
3. Pour chaque nouvelle valeur, deux tests indépendants : est-elle plus petite que le minimum ? Est-elle plus grande que le maximum ?

## Solution
On lit la première valeur et on la range à la fois dans `mini` et dans `maxi`. Puis, pour chacune des `N − 1` valeurs suivantes, on la compare aux deux : si elle est plus petite que `mini`, elle devient le nouveau `mini` ; si elle est plus grande que `maxi`, elle devient le nouveau `maxi`.

Le piège est de partir de `0` : si toutes les valeurs sont positives, le minimum affiché serait `0`, qui n'est pas dans l'entrée ; si elles sont toutes négatives, c'est le maximum qui serait faux. Avec `N = 1`, la boucle ne fait aucun tour, et la seule valeur est à la fois le minimum et le maximum.
