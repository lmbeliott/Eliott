---
id: ecart-entre-deux-nombres
title: Écart entre deux nombres
chapter: p1-conditions
order: 1
tags: [conditions]
samples: 3
---

## Énoncé
Deux points sont placés sur une droite graduée, aux positions `A` et `B`. Afficher la distance qui les sépare, c'est-à-dire le plus grand des deux nombres moins le plus petit.

## Entrée
Une seule ligne contenant deux entiers `A` et `B` séparés par une espace.

## Sortie
Un seul entier : la distance entre `A` et `B`, toujours positive ou nulle.

## Contraintes
- −1 000 000 ≤ A, B ≤ 1 000 000

## Indices
1. `A − B` est la bonne réponse quand `A` est le plus grand. Et sinon ?
2. Un `if` choisit entre `A − B` et `B − A` selon le résultat de la comparaison `A > B`.

## Solution
Si `A ≥ B`, la distance est `A − B` ; sinon, c'est `B − A`. Un `if` suivi d'un `else` choisit le bon calcul. Quand `A = B`, les deux formules donnent `0`, donc peu importe de quel côté on met l'égalité.

Le piège est de toujours afficher `A − B`, qui est négatif quand `B` est plus grand. On remarque aussi que les positions peuvent être négatives : la distance entre `−3` et `4` est 7.
