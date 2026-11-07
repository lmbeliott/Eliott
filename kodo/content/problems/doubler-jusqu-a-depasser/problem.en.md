---
title: Double until exceeding
---

## Statement
A colony of bacteria has `A` individuals, and their number doubles every hour.

Print the number of hours after which the colony has **strictly more** than `B` individuals.

## Input
A single line containing two integers `A` and `B` separated by a space.

## Output
A single integer: the smallest number of hours after which the colony has strictly more than `B` individuals. If this is already the case at the start, print `0`.

## Constraints
- 1 ≤ A ≤ 10⁹
- 1 ≤ B ≤ 10¹⁸ (in C++, use `long long`)

## Hints
1. Simulate hour by hour: as long as the colony has not exceeded `B`, double it and count one more hour.
2. "Strictly more than `B`": the loop must go on as long as the colony is less than **or equal** to `B`.
3. Check by hand with `A = 5` and `B = 5`: the answer is 1, not 0.

## Solution
Simulate: a variable `colonie` starts at `A`, a counter `heures` starts at 0. As long as `colonie <= B`, double `colonie` and add 1 to `heures`. When the loop ends, its condition is false: the colony is strictly above `B`, for the first time.

The loop makes at most about sixty turns, because 2⁶⁰ is already more than 10¹⁸.

The traps: writing `colonie < B` instead of `colonie <= B` (one turn too few when the colony lands exactly on `B`), and, in C++, using an `int`. The colony can reach almost 2 × 10¹⁸: only a `long long` can hold it.
