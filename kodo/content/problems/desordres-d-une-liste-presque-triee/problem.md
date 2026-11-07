---
id: desordres-d-une-liste-presque-triee
title: Désordres d'une liste presque triée
chapter: p3-tris-simples
order: 3
tags: [tri, listes]
samples: 2
---

## Énoncé
Une liste `A₁, A₂, …, A_N` contient les entiers de `1` à `N`, chacun une fois, dans un ordre **presque trié** : chaque valeur `v` se trouve à au plus 10 positions de sa place dans la liste triée, c'est-à-dire de la position `v`.

Un **désordre** est une paire de positions `i < j` telle que `Aᵢ > Aⱼ`. Compter les désordres de la liste.

## Entrée
La première ligne contient `N`. La deuxième ligne contient `A₁, …, A_N`, séparés par des espaces.

## Sortie
Un seul entier : le nombre de désordres.

## Contraintes
- 1 ≤ N ≤ 25 000
- la valeur `v` est à une position `p` telle que `|p − v| ≤ 10`

## Indices
1. Tester toutes les paires coûte N² / 2, plus de 300 millions de tests : trop pour Python.
2. Le tri par insertion échange des voisins mal placés. Combien de désordres un tel échange fait-il disparaître ?
3. Faire un tri par insertion en comptant les échanges. Sur une liste presque triée, chaque élément ne recule que de quelques positions.

## Solution
On trie la liste par insertion et on compte les échanges de voisins. Ce nombre est exactement le nombre de désordres.

**Pourquoi.** Le tri par insertion n'échange deux voisins `x` et `y` (avec `x` juste avant `y`) que si `x > y`. Après l'échange, la paire `{x, y}` n'est plus un désordre, et aucune autre paire ne change : les autres éléments sont toujours du même côté de `x` et de `y`. Chaque échange fait donc disparaître exactement un désordre. À la fin, la liste est triée et n'a plus aucun désordre : le nombre d'échanges est égal au nombre de désordres du départ.

**Coût.** Le tri par insertion fait environ N étapes plus un échange par désordre. Ici, si `i < j` et `Aᵢ > Aⱼ`, alors la valeur `Aᵢ` est au plus à `i + 10` dans la liste triée et `Aⱼ` au moins à `j − 10`, donc `j − i < 20`. Chaque position forme au plus 20 désordres avec celles qui la suivent : moins de 20N = 500 000 échanges. Le tri par insertion est rapide sur une liste presque triée, alors qu'il serait trop lent sur une liste quelconque.
