---
title: Teams of two with the same total
---

## Statement
`N` players, `N` even, each have a level `Vᵢ`. We want to split them into `N / 2` teams of two players so that all teams have the **same** total level (the sum of the levels of their two players).

Print this common total if such a split exists, and `IMPOSSIBLE` otherwise.

## Input
The first line contains `N`. The second line contains `V₁, …, V_N`, separated by spaces.

## Output
The common total, or `IMPOSSIBLE`.

## Constraints
- 2 ≤ N ≤ 20,000, `N` even
- 1 ≤ Vᵢ ≤ 100,000

## Hints
1. If the split exists, the common total `T` is forced: the sum of all levels is `(N / 2) × T`.
2. Who must the weakest player team up with? Compare their partner `T − min` with the partners of the other players.
3. Sort the levels, then pair the first with the last, the second with the second to last, and so on.

## Solution
Sort the levels: `V[0] ≤ V[1] ≤ … ≤ V[N − 1]`. Look at the pairs `(V[g], V[d])` with an index `g` starting from the beginning and an index `d` starting from the end: `(0, N − 1)`, `(1, N − 2)`, … The split exists if and only if all these pairs have the same sum; it is then the common total.

**Why.** If all these sums are equal, these pairs form a suitable split. Conversely, suppose a split with total `T` exists. In this split, each player of level `x` has a partner of level `T − x`. The weakest player, of level `V[0]`, has partner `T − V[0]`, and for any other player `x ≥ V[0]`, the partner `T − x` is at most `T − V[0]`. Since the partners run through all the players, `T − V[0]` is the highest level: `T = V[0] + V[N − 1]`. So you can pair the weakest and the strongest, remove them, and apply the same reasoning to the remaining players, who must also be splittable with total `T`. So all the pairs `(V[g], V[d])` have sum `T`.

**Cost.** The sort, then N / 2 additions. Searching for each player's partner by going through the whole list would cost about N² operations.
