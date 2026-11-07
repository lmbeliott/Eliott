---
id: paires-de-sommets-relies
title: Paires de sommets reliés
chapter: p4-graphes
order: 2
tags: [graphes, parcours-en-profondeur, mathématiques]
samples: 2
---

## Énoncé
On donne un graphe non orienté de `N` sommets et `M` arêtes. Compter les paires de sommets `{U, V}`, avec `U ≠ V`, telles qu'un chemin relie `U` à `V`. La paire `{U, V}` et la paire `{V, U}` sont la même paire.

## Entrée
- La première ligne contient deux entiers `N` et `M` : le nombre de sommets (numérotés de `1` à `N`) et le nombre d'arêtes.
- Chacune des `M` lignes suivantes contient deux entiers `A` et `B` : une arête relie les sommets `A` et `B`.

Une arête peut relier un sommet à lui-même, et deux sommets peuvent être reliés par plusieurs arêtes.

## Sortie
Un seul entier : le nombre de paires de sommets reliés par un chemin.

## Contraintes
- 1 ≤ N ≤ 100 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N

## Indices
1. Lancer un parcours depuis chaque sommet coûte O(N × (N + M)) : bien trop lent pour N = 100 000.
2. Deux sommets sont reliés exactement quand ils sont dans la même composante connexe.
3. Une composante de `s` sommets contient `s × (s − 1) / 2` paires.

## Solution
Deux sommets sont reliés par un chemin si et seulement s'ils sont dans la même **composante connexe**. Une composante de `s` sommets fournit donc `s(s − 1)/2` paires, et deux sommets de composantes différentes ne forment jamais une paire reliée. La réponse est la somme de `s(s − 1)/2` sur toutes les composantes.

On calcule la taille de chaque composante avec la boucle du cours : pour chaque sommet pas encore visité, un parcours en profondeur (avec une pile explicite, car une composante peut être un long chemin) visite toute sa composante et compte ses sommets.

**Complexité.** O(N + M) : chaque sommet est visité une fois et chaque liste de voisins parcourue une fois. L'approche naïve, un parcours depuis chaque sommet, fait de l'ordre de N² = 10¹⁰ opérations.

**Remarque.** Une composante connexe de `s` sommets contient au moins `s − 1` arêtes (voir le cours). Avec `M ≤ 10 000`, une composante a donc au plus 10 001 sommets, et la réponse ne dépasse pas 10 001 × 10 000 / 2 = 50 005 000.
