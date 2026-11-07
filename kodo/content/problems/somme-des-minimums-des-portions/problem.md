---
id: somme-des-minimums-des-portions
title: Somme des minimums des portions
chapter: p3-piles-files
order: 7
tags: [listes, mathématiques]
samples: 2
---

## Énoncé
Une suite de `N` entiers `A₁, …, A_N` est donnée. Une **portion** est une suite de cases consécutives `Aₗ, …, Aᵣ` avec `l ≤ r` ; il y en a `N × (N + 1) / 2`. Calculer la somme des minimums de toutes les portions.

Par exemple, pour `3 1 2`, les portions sont `3`, `1`, `2`, `3 1`, `1 2` et `3 1 2`, de minimums `3, 1, 2, 1, 1, 1` : la somme vaut `9`.

## Entrée
La première ligne contient `N`. La deuxième ligne contient `A₁, …, A_N`, séparés par des espaces.

## Sortie
Un seul entier : la somme des minimums.

## Contraintes
- 1 ≤ N ≤ 20 000
- 1 ≤ Aᵢ ≤ 100 000

## Indices
1. Parcourir chaque portion en tenant à jour son minimum coûte N² / 2 opérations, 200 millions : trop pour Python.
2. Retourner la question : pour chaque position `i`, dans combien de portions `Aᵢ` est-il le minimum ? Attention aux valeurs égales, qui ne doivent pas compter le même minimum deux fois.
3. Décider que le minimum d'une portion est porté par sa position la plus à gauche parmi celles qui ont la valeur minimale. Il faut alors connaître, pour chaque `i`, la position de la valeur `≤ Aᵢ` la plus proche à gauche, et celle de la valeur `< Aᵢ` la plus proche à droite : deux passages avec une pile.

## Solution
Pour chaque portion, on attribue son minimum à la position **la plus à gauche** qui atteint ce minimum. La position `i` porte le minimum de la portion `[l, r]` (avec `l ≤ i ≤ r`) si et seulement si toutes les valeurs de `l` à `i − 1` sont **strictement** plus grandes que `Aᵢ`, et toutes celles de `i + 1` à `r` sont **supérieures ou égales** à `Aᵢ`.

Notons `g` la position la plus proche à gauche de `i` telle que `A_g ≤ Aᵢ` (ou `0` s'il n'y en a pas), et `d` la plus proche à droite telle que `A_d < Aᵢ` (ou `N + 1`). Les débuts possibles sont `g + 1, …, i`, soit `i − g` choix, et les fins possibles `i, …, d − 1`, soit `d − i` choix. Chaque combinaison donne une portion différente : `Aᵢ` contribue `Aᵢ × (i − g) × (d − i)` à la somme. Chaque portion est comptée exactement une fois, par la position qui porte son minimum.

Pour trouver tous les `g` en un passage de gauche à droite, on garde une pile de positions dont les valeurs croissent (au sens large) du bas vers le haut. En arrivant en `i`, on dépile tant que la valeur du haut est `> Aᵢ` : ces positions ne peuvent plus être le `g` de personne, car `Aᵢ` est plus proche et au moins aussi petit. Le haut restant, s'il existe, est `g`. On empile `i`. Le passage de droite à gauche pour `d` est le même, en dépilant tant que la valeur du haut est `≥ Aᵢ`.

**Coût.** Chaque position est empilée et dépilée au plus une fois par passage : environ 4N opérations. La somme peut atteindre 10⁵ × 2 × 10⁸ = 2 × 10¹³ : en C++, `long long`. Le piège : utiliser `<` des deux côtés, ce qui compte deux fois les portions dont le minimum apparaît plusieurs fois, ou `≤` des deux côtés, ce qui les oublie.
