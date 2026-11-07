---
title: Pairs with a sum multiple of K
---

## Statement
Count the pairs of integers `(i, j)` such that `1 ≤ i < j ≤ N` and `i + j` is a multiple of `K`.

For example, for `N = 6` and `K = 4`, the pairs that fit are `(1, 3)`, `(2, 6)` and `(3, 5)`: the answer is 3.

## Input
A single line containing two integers `N` and `K` separated by a space.

## Output
A single integer: the number of pairs.

## Constraints
- 1 ≤ N ≤ 1,000
- 1 ≤ K ≤ 2,000

## Hints
1. Go through all the pairs with two nested loops. To get `i < j`, the loop on `j` starts at `i + 1`.
2. `i + j` is a multiple of `K` when `(i + j) % K == 0`.
3. There are at most 1,000 × 999 / 2, about 500,000 pairs: trying them all is fast enough.

## Solution
Do an **exhaustive search**: try every pair and count those that fit. The outer loop fixes `i` from 1 to `N`, the inner loop makes `j` go from `i + 1` to `N`, which gives each pair exactly once, with `i < j`. For each pair, if `(i + j) % K == 0`, increase the counter.

The traps: starting `j` at 1 (you then count `(3, 1)` as well as `(1, 3)`, and pairs like `(2, 2)`), or starting `j` at `i` (you count `(2, 2)`).

The number of turns is `N × (N - 1) / 2`, about 500,000 at most: it's fast, even in Python. A more direct formula exists, but it isn't needed here.
