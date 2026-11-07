---
title: Values present twice
---

## Statement
You are given an array `a[1..N]` of integers and `Q` queries. Each query is an interval `[l, r]`.

Write a program that prints, for each query, the number of distinct values that appear **exactly twice** among `a[l], a[l+1], …, a[r]`.

## Input
The first line contains three integers `N`, `Q` and `G`.

**If `G = 0`**, the data is written out in full:
- the second line contains the `N` integers `a[1]`, …, `a[N]`;
- the next `Q` lines each contain two integers `l` and `r`.

**If `G > 0`**, the second line contains two integers `V` and `D`, and the data is produced by a generator. Start with `x = G`, and each call to `next()` does:
- `x ← (x × 6364136223846793005 + 1442695040888963407) mod 2⁶⁴`;
- then returns `x` divided by `2³³` (integer division).

First compute `a[i] = 1 + (next() mod V)` for `i` from `1` to `N`. Then, for each query, in order: `l = 1 + (next() mod D)`, then `r = N - (next() mod D)`, and swap `l` and `r` if `l > r`.

For example, with `G = 2`, the first calls to `next()` return `1649717740`, `1969491882` and `1484760456`. With `N = 10`, `V = 5` and `D = 6`, the array is `1 3 2 5 1 5 4 4 1 3`. In C++, computing modulo 2⁶⁴ is automatic with `unsigned long long`. In Python, use `% 2**64`.

## Output
`Q` lines: the answer to each query, in order.

## Constraints
- 1 ≤ N, Q ≤ 100 000
- 1 ≤ a[i] ≤ N
- 1 ≤ V ≤ N and 1 ≤ D ≤ N
- 1 ≤ l ≤ r ≤ N

## Hints
1. Fix the right end `r`. For a value `v`, let `p₁ < p₂` be its last two occurrences up to `r` and `p₀` the one before (`0` if there is none). For which `l` does `v` appear exactly twice in `[l, r]`?
2. This happens exactly for `p₀ < l ≤ p₁`. So each value adds `1` to an interval of positions `l`, and the answer to `[l, r]` is the total accumulated at `l`.
3. Handle the queries by increasing `r` (offline). When `r` moves forward by one cell, only one value changes its interval: remove the old one, add the new one. A Fenwick tree over the differences does each interval addition and each read in O(log N).

## Solution
**For a fixed `r`.** Let `v` be a value, `p₁ < p₂` its last two occurrences in `a[1..r]` and `p₀` the occurrence before (`0` if it doesn't exist). The interval `[l, r]` contains exactly the occurrences `≥ l`. It contains exactly two of them if and only if `p₀ < l ≤ p₁`. Let `c_r(l)` be the number of values whose interval `]p₀, p₁]` contains `l`. The answer to the query `[l, r]` is `c_r(l)`.

**Sweep.** We move `r` from `1` to `N`, handling the queries **offline**, grouped by their `r`. When we add position `r`, with value `v`, only the intervals of `v` change. The old `]p₀, p₁]` disappears and the new `]p₁, p₂]` appears, where `p₂` is the previous last occurrence. We keep, for each value, its last three positions.

**Fenwick.** Adding `1` over a whole interval `]x, y]` amounts, on the difference array, to adding `+1` at `x + 1` and `-1` at `y + 1`. The value `c_r(l)` is then the sum of the differences up to `l`: a prefix sum. A Fenwick tree does each operation in O(log N). Each position causes at most 4 updates, each query one read.

Complexity: **O((N + Q) log N)**.

Why simple ideas fail: counting the values of each query one by one costs O(N) per query. The tests have almost full intervals, which means 10¹⁰ operations. A segment tree storing "the number of values seen twice" doesn't combine: you can't merge two halves without knowing all their values. The sweep is what makes the problem simple.

Traps:
- `p₀`, `p₁` or `p₂` may not exist: with a single occurrence, the interval is empty.
- With the generator, the order of the calls matters: the whole array first, then for each query `l` before `r`.
- In Python, the product of `x` and the constant exceeds 2⁶⁴: take the remainder modulo 2⁶⁴ at each step.
