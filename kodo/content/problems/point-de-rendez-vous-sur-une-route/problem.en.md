---
title: Meeting point on a road
---

## Statement
`N` houses stand along a straight road, house `i` at kilometre `Xᵢ`. Several houses can be at the same kilometre. A meeting point is chosen at an integer kilometre `P`, and each inhabitant travels the distance `|Xᵢ − P|`.

Find the point `P` that makes the **total distance** travelled as small as possible. If there are several, choose the smallest.

## Input
The first line contains `N`. The second line contains `X₁, …, X_N`, separated by spaces.

## Output
Two integers on one line: the chosen point `P`, then the corresponding total distance.

## Constraints
- 1 ≤ N ≤ 20,000
- 0 ≤ Xᵢ ≤ 10⁶

## Hints
1. Trying each house as the meeting point, and computing the total distance each time, costs N² operations: 400 million.
2. Start from a point `P` and move one kilometre to the right. The total distance increases by 1 for each house to the left of `P` or on `P`, and decreases by 1 for each house to the right. When is it worth moving?
3. Sort the positions. The answer is related to the middle house.

## Solution
Sort the positions: `Y₀ ≤ Y₁ ≤ … ≤ Y_{N−1}`. The answer is `P = Y_m` with `m = (N − 1) // 2`, the **median** (the smaller of the two middle ones when `N` is even). Then compute the sum of the `|Yᵢ − P|`.

**Why.** Write `D(P)` for the total distance, `G` for the number of houses at kilometre `P` or before, and `R = N − G` for the number of houses after. Going from `P` to `P + 1`, each of the `G` houses gets 1 further and each of the `R` houses gets 1 closer: `D(P + 1) − D(P) = G − R`.

- If `P < Y_m`, at most `m` houses are at `P` or before, so `G ≤ (N − 1) / 2 < N / 2` and `G < R`: the distance **strictly decreases** when moving right.
- If `P ≥ Y_m`, at least `m + 1` houses are at `P` or before, so `G ≥ N / 2` and `G ≥ R`: the distance **no longer decreases**.

The distance strictly decreases up to `Y_m`, then no longer decreases: `Y_m` is the smallest optimal point.

**Cost.** The sort, then one pass for the sum. Positions do not exceed 10⁶: a counting sort works too. The total distance can reach 2 × 10¹⁰: in C++, use a `long long`.
