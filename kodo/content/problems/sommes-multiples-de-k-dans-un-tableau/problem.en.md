---
title: Sums that are multiples of K in an array
---

## Statement
An array of `N` non-negative integers and an integer `K` are given. Count the pairs of positions `(i, j)` with `i < j` such that the sum of the two values is a multiple of `K`.

For example, with `K = 5` and the array `1 4 6 9 5`, the valid pairs are `1 + 4`, `1 + 9`, `4 + 6` and `6 + 9`: there are 4 of them.

## Input
- The first line contains `N` and `K`.
- The second line contains the `N` integers.

## Output
The number of pairs.

## Constraints
- 1 ≤ N ≤ 20,000
- 1 ≤ K ≤ 1,000,000
- The values are between 0 and 1,000,000.

## Hints
1. The remainder of `a + b` in the division by `K` depends only on the remainders of `a` and `b`.
2. If `a` has remainder `r`, which remainders can `b` have so that `a + b` is a multiple of `K`? Watch out for the case `r = 0`.
3. A counting array `cnt` of `K` cells, where `cnt[r]` is the number of values already read with remainder `r`, lets you count the pairs in a single pass.

## Solution
The sum `a + b` is a multiple of `K` exactly when `(a % K + b % K) % K` is 0, that is when the remainder of `b` is `(K − a % K) % K`. This "complementary" remainder is 0 if the remainder of `a` is 0, and `K − r` otherwise. The values themselves hardly matter: only their remainders count.

Go through the array once, keeping a counting array `cnt` of `K` cells up to date: `cnt[r]` is the number of values **already read** whose remainder is `r`. For each new value `x`, with remainder `r = x % K`, add `cnt[(K − r) % K]` to the total, the number of possible partners read before it, **then** increase `cnt[r]` by 1. Each pair `(i, j)` is counted exactly once, when the value at index `j` is read. The order of the two operations matters: the other way round, a value with remainder 0 (or remainder `K / 2`) would form a pair with itself.

Cost: one pass over the array, with a constant number of operations per value, plus creating the array of `K` cells. Trying the `N × (N − 1) / 2` pairs would take 200 million.
