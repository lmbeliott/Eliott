---
id: plus-grande-somme-de-k-consecutifs
title: Plus grande somme de K valeurs consécutives
chapter: p2-tableaux
order: 7
tags: [listes, sommes-préfixes]
samples: 2
---

## Énoncé
Dans une suite de `N` entiers, dont les positions sont numérotées de 1 à `N`, trouver `K` valeurs consécutives dont la somme est la plus grande possible. Afficher cette somme, puis la position de la première de ces `K` valeurs. Si plusieurs groupes donnent la même somme maximale, choisir celui qui commence le plus tôt.

## Entrée
La première ligne contient `N` et `K`. La deuxième ligne contient les `N` entiers, séparés par des espaces.

## Sortie
Une seule ligne avec deux entiers séparés par une espace : la plus grande somme, puis la position où commence le groupe.

## Contraintes
- 1 ≤ K ≤ N ≤ 30 000
- Chaque entier est compris entre −1 000 et 1 000.

## Indices
1. Il y a `N − K + 1` groupes possibles. Recalculer la somme de chacun avec une boucle de `K` tours demande jusqu'à environ 225 millions d'additions : trop lent.
2. Comparer deux groupes voisins : celui qui commence à l'indice `i + 1` contient presque les mêmes valeurs que celui qui commence à `i`.
3. En passant du groupe qui commence à `i` à celui qui commence à `i + 1`, on perd `t[i]` et on gagne `t[i + K]`. La nouvelle somme vaut donc `somme - t[i] + t[i + K]`.

## Solution
On calcule la somme du premier groupe, `t[0] + … + t[K − 1]`, avec une boucle. Ensuite, on fait **glisser** la fenêtre d'une case à la fois : pour passer du groupe qui commence à l'indice `i` à celui qui commence à `i + 1`, on retire `t[i]`, qui sort de la fenêtre, et on ajoute `t[i + K]`, qui y entre. Chaque nouvelle somme coûte deux opérations au lieu de `K`. À chaque étape, on compare la somme à la meilleure trouvée, avec `>` strict pour garder le groupe le plus à gauche en cas d'égalité.

Le programme fait environ `N` opérations au lieu de `N × K`. L'indice `i + K` doit rester dans le tableau : la boucle fait varier `i` de 0 à `N − K − 1`, et le groupe obtenu commence à l'indice `i + 1`, c'est-à-dire à la position `i + 2`. Attention au décalage entre indices et positions dans l'affichage, et à l'initialisation du maximum : les sommes peuvent être négatives, on part donc de la somme du premier groupe et non de 0.
