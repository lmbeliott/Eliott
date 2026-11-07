---
id: contraintes-d-ecarts
title: Contraintes d'écarts
chapter: p4-plus-courts-chemins
order: 4
tags: [graphes, mathématiques]
samples: 3
---

## Énoncé
On cherche des entiers `x₁, x₂, …, x_N` qui vérifient `M` contraintes, chacune de la forme `x_B − x_A ≤ C`. Le nombre `C` peut être négatif : `x₁ − x₃ ≤ −4` signifie que `x₃` dépasse `x₁` d'au moins 4.

Si aucun choix des `x_i` ne vérifie toutes les contraintes, afficher `IMPOSSIBLE`. Sinon, afficher la plus grande valeur possible de `x_N − x₁`, ou `INFINI` si `x_N − x₁` peut être aussi grand qu'on le veut.

## Entrée
- La première ligne contient `N` et `M`.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `C` : la contrainte `x_B − x_A ≤ C`.

## Sortie
`IMPOSSIBLE`, `INFINI` ou un entier.

## Contraintes
- 1 ≤ N ≤ 300
- 0 ≤ M ≤ 3 000
- 1 ≤ A, B ≤ N
- −10⁶ ≤ C ≤ 10⁶

## Indices
1. `x_B ≤ x_A + C` ressemble à l'inégalité vérifiée par les distances après relâchement de l'arc `A → B` de longueur `C`. Que dit une suite de contraintes `x₂ − x₁ ≤ 5`, `x₃ − x₂ ≤ 2` sur `x₃ − x₁` ?
2. En additionnant les contraintes le long d'un chemin de `1` à `N`, on obtient `x_N − x₁ ≤ longueur du chemin`. Le long d'un cycle, on obtient `0 ≤ longueur du cycle`.
3. Les longueurs peuvent être négatives : Bellman-Ford. Un cycle de longueur négative rend le système impossible ; sinon, la réponse est la distance de `1` à `N`, et `INFINI` si `N` n'est pas accessible depuis `1`.

## Solution
**Modélisation.** Chaque contrainte `x_B − x_A ≤ C` devient un arc `A → B` de longueur `C`. Pour un chemin `1 → v₁ → … → N`, en additionnant les contraintes de ses arcs, les termes intermédiaires s'annulent : `x_N − x₁ ≤ longueur du chemin`. Pour un cycle, la même somme donne `0 ≤ longueur du cycle`.

**Impossible ⟺ cycle négatif.** Si un cycle a une longueur négative, la somme précédente donne `0 ≤ négatif` : aucune solution. Sinon, on ajoute une source fictive reliée à chaque sommet par un arc de longueur `0`, et l'on calcule les distances `p(v)` depuis cette source. Elles vérifient `p(B) ≤ p(A) + C` pour chaque arc (c'est l'inégalité triangulaire des distances) : `x_v = p(v)` est une solution. En pratique, la source fictive revient à **initialiser toutes les distances à 0**. On fait alors au plus `N` tours de Bellman-Ford : s'il y a encore une amélioration au `N`-ième tour, il existe un cycle négatif (sans cycle négatif, tout est stable après `N − 1` tours, car un plus court chemin depuis la source a au plus `N` arcs dont le premier est fictif).

**La plus grande valeur.** Soit `D(v)` la distance de `1` à `v`. Toute solution vérifie `x_N − x₁ ≤ D(N)`. Réciproquement, `x_v = min(D(v), p(v) − p(1) + T)` est une solution pour toute constante `T ≥ 0` : le minimum de deux solutions en est une, car `min(f, g)(B) ≤ min(f(A) + C, g(A) + C)`, et une valeur infinie de `D(A)` ne contraint rien. On a `x₁ = 0`. Si `N` est accessible, `T` assez grand donne `x_N = D(N)` : la réponse est `D(N)`. Sinon, `x_N = p(N) − p(1) + T` grandit avec `T` : la réponse est `INFINI`.

**Complexité.** Deux Bellman-Ford : O(N × M), soit au plus 900 000 relâchements. Dijkstra ne convient pas, à cause des longueurs négatives.

**Pièges.** Le sens de l'arc : `x_B − x_A ≤ C` donne `A → B`. Une contrainte `x_A − x_A ≤ C` avec `C < 0` est un cycle négatif d'un seul arc. Si `N = 1`, la réponse est `0` (quand le système est possible).
