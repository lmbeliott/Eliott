---
title: Reaching every threshold
---

## Statement
An array has N cells, numbered from 1 to N, all equal to `0` at the start. Each cell i has a **threshold** S_i. You are given a list of M additions, applied in order: the addition (L, R, V) adds V to every cell from L to R.

Write a program that computes the smallest number k such that after the first k additions, **every** cell i is at least S_i.

## Input
- The first line contains two integers N and M.
- The second line contains N integers S_1, S_2, …, S_N.
- Each of the next M lines contains three integers L, R and V: an addition.

## Output
A single integer: the smallest suitable k, or `-1` if a cell is still below its threshold even after the M additions.

## Constraints
- 1 ≤ N ≤ 12,000
- 1 ≤ M ≤ 5,000
- 1 ≤ S_i ≤ 10⁶
- 1 ≤ L ≤ R ≤ N
- 1 ≤ V ≤ 1,000

## Hints
1. Applying the additions one by one, cell by cell, and checking every cell after each addition can cost tens of millions of operations: too slow in Python. Ask yourself a simpler question instead: for a given k, are the first k additions enough?
2. This question can be settled in O(N + k) with a difference array: `+V` at L, `−V` at R + 1, then the running sums give the value of every cell.
3. Values only go up: if k additions are enough, so are k + 1. The answers are therefore no, no, …, no, yes, yes: look for the first "yes" by binary search between `0` (never enough, since thresholds are ≥ 1) and M.

## Solution
**The idea: binary search on the number of additions.** We ask a simpler question: "After the first k additions, has every cell reached its threshold?"

To answer it, we do not apply the additions cell by cell. We write each addition in a **difference array**: `+V` at L and `−V` at R + 1. The running sums of this array, from left to right, give the value of every cell. We then compare each cell with its threshold. Cost: O(N + k).

Additions never take anything away: a cell that has reached its threshold after k additions still has after k + 1. The answer to the question is therefore "no" for small k, then "yes" from some point on. We first check that the M additions are enough (otherwise we print `-1`), then look for the first "yes" by binary search between `not_enough = 0` and `enough = M`.

In the first example, after 3 additions the array is 2 3 5 3 2: cell 1 is below its threshold 3. After 4 additions, it is 3 4 5 3 2, and every cell has reached its threshold (3 1 4 2 2). The answer is 4.

**Complexity.** The binary search does about log₂(5,000) ≈ 13 rounds, each in O(N + M): O((N + M) log M), about 250,000 operations.

**Why the naive solution is too slow.** Applying each addition cell by cell costs up to N operations per addition. If the answer comes late and the additions are long, that is M × N = 6 × 10⁷ additions, plus the checks: several seconds in Python. Rebuilding the difference array for k = 1, 2, 3… is even worse: O(M × (N + M)).

**Traps.**
- The difference array needs one extra cell (R + 1 can be N + 1).
- A cell can go up to 5,000 × 1,000 = 5 × 10⁶: `int` is enough, but remember to check this kind of bound.
- Do not search between 1 and M without checking the `-1` case first: the binary search would wrongly assume that M additions are enough.
