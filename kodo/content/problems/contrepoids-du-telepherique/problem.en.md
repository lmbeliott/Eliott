---
title: The cable car counterweight
---

## Statement
Every morning, the small supply cabin of the cable car takes parcels up to the Aiguilles refuge. It is balanced by a fixed counterweight: to keep the cable safe, it must be loaded with **exactly** `W` kilograms, no more, no less. Sofia, the refuge keeper, has `N` parcels waiting; each one has a weight and a usefulness (fresh food is more useful than postcards).

Write a program that chooses parcels, each at most once, whose total weight is exactly `W`, maximising the sum of their usefulness. If no choice of parcels weighs exactly `W` kilograms, print `-1`.

## Input
- The first line contains two integers `N` and `W`.
- Each of the next `N` lines contains two integers: the weight `P` of a parcel, in kilograms, and its usefulness `U`.

## Output
A single integer: the maximum total usefulness of a load of exactly `W` kilograms, or `-1` if there is none.

## Constraints
- 1 ≤ N ≤ 100
- 1 ≤ W ≤ 10 000
- 1 ≤ P ≤ 10 000
- 0 ≤ U ≤ 1 000

## Hints
1. There are 2¹⁰⁰ ways to choose parcels. On the other hand, there are only `W + 1` possible total weights between `0` and `W`.
2. Handle the parcels one by one, keeping up to date `meilleur[w]` ("best"): the best usefulness of a load of exactly `w` kilograms using the parcels handled so far. How does a new parcel of weight `P` and usefulness `U` change this array?
3. At the start, only `meilleur[0] = 0` is possible: the other cells must be "impossible" (for example `-1`), not `0`. For each parcel, go through `w` from `W` down to `P` in **decreasing** order, so as not to use the same parcel twice.

## Solution
This is the **knapsack** problem, with an equality constraint. Let `meilleur[w]` be the best usefulness of a load weighing exactly `w` kilograms, using only the parcels examined so far, or `-1` if no load weighs `w`.

- At the start (no parcels), only the empty load exists: `meilleur[0] = 0` and `meilleur[w] = -1` for `w > 0`.
- When we examine a parcel of weight `P` and usefulness `U`, a load of `w` kilograms either doesn't contain it (usefulness `meilleur[w]`), or contains it and the rest weighs `w - P` (usefulness `meilleur[w - P] + U`, if `meilleur[w - P]` is not `-1`). We keep the better of the two.

We go through `w` from `W` down to `P` in **decreasing** order: this way, `meilleur[w - P]` has not yet been changed for this parcel, and each parcel is used at most once. The answer is `meilleur[W]`.

Complexity: **O(N × W)**, that is 10⁶ operations at most. Trying every subset would cost 2¹⁰⁰: impossible. A greedy approach (taking the most useful parcels first, or the most "profitable" per kilogram) doesn't work either: it can miss the exact weight or a better combination.

Traps:
- Initialising the whole array to `0` computes the best usefulness for a weight **at most** `W`, not exactly `W`. On the first example, you would get `90` instead of `70`.
- Going through `w` in increasing order would allow taking the same parcel several times.
- A parcel of usefulness `0` can be essential to reach the exact weight: the answer can be `0` without being `-1`.
