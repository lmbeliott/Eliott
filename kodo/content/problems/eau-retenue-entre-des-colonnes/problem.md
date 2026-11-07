---
id: eau-retenue-entre-des-colonnes
title: Eau retenue entre des colonnes
chapter: p3-tableaux-avances
order: 6
tags: [listes]
samples: 2
---

## Énoncé
`N` colonnes de largeur 1 sont posées côte à côte, de hauteurs `H₁, H₂, …, Hₙ`. Il pleut longtemps : l'eau remplit les creux entre les colonnes et s'écoule par les deux bords. Compter les cases d'eau retenues.

Avec les hauteurs `3 0 2 0 4`, l'eau (`~`) remplit 7 cases :

```text
    #
#~~~#
#~#~#
#~#~#
```

## Entrée
- La première ligne contient `N`.
- La deuxième ligne contient les `N` hauteurs.

## Sortie
Le nombre de cases d'eau retenues.

## Contraintes
- 1 ≤ N ≤ 30 000
- 0 ≤ Hᵢ ≤ 1 000

## Indices
1. Au-dessus de la colonne `i`, l'eau monte jusqu'à un certain niveau. De quoi ce niveau dépend-il ?
2. L'eau au-dessus de la colonne `i` est retenue à gauche par la plus haute colonne de gauche, et à droite par la plus haute colonne de droite. Elle monte jusqu'à la plus basse de ces deux hauteurs.
3. Recalculer ces deux maximums pour chaque colonne serait trop lent. Un premier passage de gauche à droite donne tous les maximums « à gauche », un second de droite à gauche tous les maximums « à droite ».

## Solution
Notons `G[i]` la plus grande hauteur parmi les colonnes 1 à `i`, et `D[i]` la plus grande parmi les colonnes `i` à `N` (la colonne `i` est comprise dans les deux). Le niveau de l'eau au-dessus de la colonne `i` est `min(G[i], D[i])`, et la colonne retient `min(G[i], D[i]) − H[i]` cases d'eau, qui est positif ou nul puisque les deux maximums sont au moins égaux à `H[i]`.

Pourquoi : l'eau au-dessus de la colonne `i` ne peut pas dépasser `G[i]`, sinon elle s'écoulerait vers la gauche en passant au-dessus de toutes les colonnes de gauche ; de même pour `D[i]`. Inversement, jusqu'au niveau `min(G[i], D[i])`, elle est bloquée des deux côtés par une colonne au moins aussi haute, donc elle reste.

Les `G[i]` se calculent en un passage de gauche à droite : `G[i] = max(G[i − 1], H[i])`. Les `D[i]` se calculent en un passage de droite à gauche : `D[i] = max(D[i + 1], H[i])`. Un troisième passage additionne les quantités d'eau.

Coût : trois passages de `N` étapes. Recalculer les deux maximums pour chaque colonne en parcourant tout le tableau demanderait `N²` étapes, soit 900 millions. La réponse peut atteindre environ 3 × 10⁷, qui tient dans un `int`.
