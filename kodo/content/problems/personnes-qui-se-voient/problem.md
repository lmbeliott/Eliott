---
id: personnes-qui-se-voient
title: Personnes qui se voient
chapter: p3-piles-files
order: 6
tags: [listes, mathématiques]
samples: 2
---

## Énoncé
`N` personnes de tailles toutes différentes sont alignées ; la personne `i` mesure `Hᵢ`. Deux personnes `i < j` **se voient** si toutes les personnes placées entre elles sont plus petites que chacune des deux. En particulier, deux voisines se voient toujours.

Compter les paires de personnes qui se voient.

## Entrée
La première ligne contient `N`. La deuxième ligne contient `H₁, …, H_N`, séparés par des espaces.

## Sortie
Un seul entier : le nombre de paires qui se voient.

## Contraintes
- 1 ≤ N ≤ 20 000
- 1 ≤ Hᵢ ≤ 100 000, toutes différentes

## Indices
1. Parcourir les personnes de gauche à droite. Quand la personne `j` arrive, quelles personnes à sa gauche peut-elle voir ? Une personne `i` qui a, entre elle et `j`, quelqu'un de plus grand qu'elle ne sera plus jamais vue par personne arrivant après.
2. Garder une pile des personnes encore « visibles depuis la droite » : leurs tailles décroissent du bas vers le haut de la pile.
3. Quand `j` arrive, elle voit toutes les personnes qu'elle fait sortir de la pile (plus petites qu'elle), plus la première personne plus grande qu'elle, s'il y en a une.

## Solution
On parcourt les personnes de gauche à droite avec une pile de tailles. **Invariant** : avant de traiter `j`, la pile contient, du bas vers le haut, les personnes `i < j` plus grandes que toutes celles placées entre `i` et `j` ; leurs tailles décroissent donc vers le haut. Une personne absente de la pile est cachée par quelqu'un de plus grand placé après elle, qui la cachera aussi pour tous ceux qui arrivent ensuite.

Quand `j` arrive :

1. tant que le haut de la pile est plus petit que `Hⱼ`, on le dépile et on compte une paire : entre cette personne et `j`, il n'y a que des personnes plus petites qu'elle, donc que `Hⱼ` ;
2. si la pile n'est pas vide, son haut est plus grand que `Hⱼ`, et tous ceux qui le séparent de `j` sont plus petits que `Hⱼ` : encore une paire. Les personnes plus bas dans la pile sont cachées par ce haut, plus grand que `Hⱼ` ;
3. on empile `Hⱼ`, ce qui garde l'invariant : les personnes dépilées sont désormais cachées par `j`.

Chaque paire qui se voit est comptée exactement une fois, quand arrive la plus à droite des deux.

**Coût et propriété mathématique.** Chaque personne est empilée une fois et dépilée au plus une fois : moins de 2N opérations. On en déduit aussi que le nombre de paires est au plus `2N − 3` dès que `N ≥ 2` : une paire par dépilement, et au plus une de plus par personne, sauf la première. Tester toutes les paires coûterait N² / 2 opérations, et s'arrêter dès qu'une personne plus grande que `i` apparaît ne suffit pas : sur des tailles décroissantes, on ne s'arrête jamais.
