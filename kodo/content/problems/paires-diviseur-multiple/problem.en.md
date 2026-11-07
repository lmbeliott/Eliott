---
title: Divisor-multiple pairs
---

## Statement
An array of `N` positive integers is given. Count the pairs of positions `(i, j)`, with `i ≠ j`, such that the value at position `i` divides the value at position `j`. The pairs `(i, j)` and `(j, i)` are different: if two positions hold the same value, they give two pairs.

For example, with `2 3 6 2`, the valid pairs are `2 | 6` (twice, with each of the two `2`s), `3 | 6`, and `2 | 2` (twice, in one direction and the other): the answer is 5.

## Input
- The first line contains `N`.
- The second line contains the `N` integers.

## Output
The number of pairs.

## Constraints
- 1 ≤ N ≤ 20,000
- The values are between 1 and 100,000.

## Hints
1. Testing every pair would take 400 million divisions: too slow. The values are small: a frequency array `f`, where `f[v]` is the number of positions holding value `v`, summarises the whole input.
2. For a value `d` that is present, its multiples are `d`, `2d`, `3d`, … up to the largest value `V`. Going through them costs about `V / d` steps.
3. How much do these loops cost for all the values `d` from 1 to `V`? The sum `V/1 + V/2 + V/3 + … + V/V` is much smaller than one might think.

## Solution
Build the frequency array `f`: `f[v]` is the number of positions with value `v`, for `v` from 1 to `V`, the largest value. For a value `d` that is present (`f[d] > 0`), count the positions whose value is a multiple of `d`: `s = f[d] + f[2d] + f[3d] + …` up to `V`. Each of the `f[d]` positions with value `d` divides these `s` positions, which gives `f[d] × s` pairs. Adding over all `d`, each pair `(i, j)` such that `A[i]` divides `A[j]` is counted exactly once, with `d = A[i]`. But the `N` pairs `(i, i)` have been counted too, since each value divides itself: remove them at the end.

**Cost.** For a value `d`, the loop over its multiples makes at most `V / d` steps. In total, even if all the values from 1 to `V` were present, this would make `V × (1 + 1/2 + 1/3 + … + 1/V)` steps. This sum, the **harmonic series**, grows very slowly: it is about 12 for `V = 100,000`. So there are at most 1.2 million steps, against 400 million divisions when trying every pair. The answer can reach about 4 × 10⁸ (all values equal): in C++, use a `long long` to be safe.
