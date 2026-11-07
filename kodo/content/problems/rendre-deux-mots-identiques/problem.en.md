---
title: Make two words identical
---

## Statement
There are `M` replacement rules. Rule `X Y C` allows replacing **one** letter `X` with the letter `Y`, at a cost `C`; it does not allow replacing `Y` with `X`. Rules can be applied as many times as wanted, at any position, in either of two words `S` and `T` of the same length.

Print the minimum total cost to make both words identical, or `-1` if it is impossible.

## Input
- The first line contains `M`.
- Each of the next `M` lines contains a rule: two letters `X` and `Y` and an integer `C`.
- The next two lines contain the words `S` and `T`.

## Output
A single integer: the minimum cost, or `-1`.

## Constraints
- 0 ≤ M ≤ 1,000
- 1 ≤ C ≤ 10⁶
- `S` and `T` have the same length, between 1 and 50,000
- all letters are lowercase letters from `a` to `z`

## Hints
1. Positions are independent. At one position, both letters can be turned into the same third letter: in the first sample, `a` and `c` both become `b`.
2. You need the minimum cost to turn each letter into each other letter, chaining rules. The graph has only 26 vertices.
3. With Floyd-Warshall you get `d[x][y]` for all pairs. The cost of a position holding `a` and `b` is the minimum over `z` of `d[a][z] + d[b][z]`.

## Solution
See letters as the 26 vertices of a directed graph: rule `X Y C` is an arc from `X` to `Y` of length `C`. Turning `x` into `y` by a sequence of rules costs at least `d[x][y]`, the distance from `x` to `y` (and `d[x][x] = 0`). With 26 vertices, **Floyd-Warshall** computes all these distances in 26³ ≈ 17,600 steps.

At a position where `S` holds `a` and `T` holds `b`, both letters must end up equal to some letter `z`; turning `a` into `z` and `b` into `z` are two independent tasks, of minimum costs `d[a][z]` and `d[b][z]`. The cost of the position is therefore `e[a][b] = min over z of d[a][z] + d[b][z]` (with `z = a` or `z = b`, this includes changing only one of the two letters). Precompute `e` for the 676 pairs, then sum over positions; if one position has an infinite cost, the answer is `-1`.

**Complexity.** 26³ for Floyd-Warshall and for the table `e`, then O(L) for the sum. Recomputing shortest paths at each position would be tens of thousands of times slower.

**Pitfalls.** It is not only `d[a][b]` and `d[b][a]`: meeting on a third letter can be cheaper, or be the only option (first sample). Rules are directed and can be repeated with different costs: keep the smallest. The answer reaches 50,000 × 25 × 10⁶: `long long` is needed, and an "infinity" that does not overflow when two infinite values are added.
