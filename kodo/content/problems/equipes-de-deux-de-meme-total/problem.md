---
id: equipes-de-deux-de-meme-total
title: Équipes de deux de même total
chapter: p3-balayages
order: 4
tags: [deux-pointeurs, tri, mathématiques]
samples: 3
---

## Énoncé
`N` joueurs, `N` pair, ont chacun un niveau `Vᵢ`. On veut les répartir en `N / 2` équipes de deux joueurs de sorte que toutes les équipes aient le **même** niveau total (la somme des niveaux de leurs deux joueurs).

Afficher ce total commun si une telle répartition existe, et `IMPOSSIBLE` sinon.

## Entrée
La première ligne contient `N`. La deuxième ligne contient `V₁, …, V_N`, séparés par des espaces.

## Sortie
Le total commun, ou `IMPOSSIBLE`.

## Contraintes
- 2 ≤ N ≤ 20 000, `N` pair
- 1 ≤ Vᵢ ≤ 100 000

## Indices
1. Si la répartition existe, le total commun `T` est imposé : la somme de tous les niveaux vaut `(N / 2) × T`.
2. Avec qui le joueur le plus faible doit-il faire équipe ? Comparer son partenaire `T − min` aux partenaires des autres joueurs.
3. Trier les niveaux, puis associer le premier avec le dernier, le deuxième avec l'avant-dernier, et ainsi de suite.

## Solution
On trie les niveaux : `V[0] ≤ V[1] ≤ … ≤ V[N − 1]`. On regarde les paires `(V[g], V[d])` avec un indice `g` qui part du début et un indice `d` qui part de la fin : `(0, N − 1)`, `(1, N − 2)`, … La répartition existe si et seulement si toutes ces paires ont la même somme ; c'est alors le total commun.

**Pourquoi.** Si toutes ces sommes sont égales, ces paires forment une répartition qui convient. Réciproquement, supposons qu'une répartition de total `T` existe. Dans cette répartition, chaque joueur de niveau `x` a un partenaire de niveau `T − x`. Le joueur le plus faible, de niveau `V[0]`, a pour partenaire `T − V[0]`, et pour tout autre joueur `x ≥ V[0]`, le partenaire `T − x` est au plus `T − V[0]`. Les partenaires parcourant tous les joueurs, `T − V[0]` est le plus grand niveau : `T = V[0] + V[N − 1]`. On peut donc associer le plus faible et le plus fort, les retirer, et appliquer le même raisonnement aux joueurs restants, qui doivent eux aussi pouvoir se répartir avec le total `T`. Toutes les paires `(V[g], V[d])` ont donc la somme `T`.

**Coût.** Le tri, puis N / 2 additions. Chercher pour chaque joueur un partenaire en parcourant toute la liste coûterait de l'ordre de N² opérations.
