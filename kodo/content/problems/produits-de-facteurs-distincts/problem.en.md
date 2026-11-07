---
title: Products of distinct factors
---

## Statement
Count the ways to write an integer `N` as a product of **distinct** integers, all greater than or equal to 2. The order of the factors does not matter, and `N` itself (a single factor) is one way.

For example, 24 can be written in 5 ways: 24, 2 × 12, 3 × 8, 4 × 6 and 2 × 3 × 4. The writing 2 × 2 × 6 does not count, since the factor 2 appears twice.

## Input
A single line containing `N`.

## Output
A single integer: the number of ways.

## Constraints
- 2 ≤ N ≤ 100,000,000

## Hints
1. To avoid counting the same product several times in different orders, require **strictly increasing** factors.
2. A recursive function `count(rest, d)` counts the ways to write `rest` with increasing factors greater than or equal to `d`. The possible factors are divisors of `N`: compute them once and for all.
3. If `f` is the next factor and other factors follow, they are larger than `f`, so `rest ≥ f × (f + 1)`: the loop can stop as soon as `f × f ≥ rest`.

## Solution
**Breaking the symmetry.** A product of distinct factors can be written in exactly one way with strictly increasing factors: only those writings are enumerated.

First compute the sorted list `div` of the divisors of `N` greater than or equal to 2, by trying the integers up to √N. The function `count(rest, i)` counts the ways to write `rest` as an increasing product of factors taken among `div[i], div[i + 1], …`:
- `rest` itself can be the last factor: this counts for 1 (it is at least `div[i]`, since it is larger than the previous factor);
- otherwise, choose the smallest factor `f = div[j]`, with `j ≥ i`, that divides `rest`, and count the ways to write `rest / f` with factors taken from `div[j + 1]` on.

**Pruning.** After `f`, at least one factor remains, larger than `f`: `rest / f > f`, so `f × f < rest`. The loop on `j` stops as soon as `div[j]² ≥ rest`. A writing has at most 10 factors, since distinct factors are at least 2, 3, 4…, and 2 × 3 × … × 12 = 479,001,600 exceeds 10⁸: the recursion depth does not exceed 10.

**Size of the tree.** Each call counts at least the writing "`rest` alone": the number of calls is exactly the answer. The worst case for `N ≤ 10⁸` is `N = 86,486,400`, with 327,873 writings. Enumerating all ordered products, or all sets of divisors (`N` can have 768 of them), would be hopeless.

**To check.** For a prime number, the answer is 1. For `N = 2^k`, the factors are distinct powers of 2, and the answer is the number of ways to write `k` as a sum of distinct integers.
