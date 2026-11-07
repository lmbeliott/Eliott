---
title: Quadruples with zero sum
---

## Statement
Four lists `A`, `B`, `C` and `D` each contain `N` integers. Count the quadruples of positions `(i, j, k, l)` such that `A[i] + B[j] + C[k] + D[l] = 0`.

For example, with `A = 1 -2`, `B = 3 0`, `C = -1 2` and `D = 0 -2`, there are 3 quadruples: `1 + 0 - 1 + 0`, `-2 + 3 - 1 + 0` and `-2 + 0 + 2 + 0`.

## Input
The first line contains `N`. The next four lines contain the lists `A`, `B`, `C` and `D` respectively, each made of `N` integers separated by spaces.

## Output
A single integer: the number of quadruples.

## Constraints
- 1 ≤ N ≤ 400
- -10⁸ ≤ each integer ≤ 10⁸
- The answer can exceed 10¹⁰: in C++, use `long long`.

## Hints
1. Trying all quadruples makes N⁴, that is 2.56 × 10¹⁰ cases. Even fixing three values and looking for the fourth one in a set, N³ = 64 million steps remain: too many for Python.
2. Cut into two halves: `A[i] + B[j] = -(C[k] + D[l])`. There are only N² = 160,000 sums `A[i] + B[j]`.
3. Store in a dictionary the number of ways to obtain each sum `A[i] + B[j]`. For each pair `(k, l)`, add the number of ways to obtain `-(C[k] + D[l])`.

## Solution
The idea is to **cut the problem into two halves** that meet in the middle. The equality `A[i] + B[j] + C[k] + D[l] = 0` can also be written `A[i] + B[j] = -(C[k] + D[l])`.

1. Go through the N² pairs `(i, j)` and count in a dictionary `sommes_ab` how many times each sum `A[i] + B[j]` is obtained.
2. Go through the N² pairs `(k, l)`. For each one, the quadruples that complete it are exactly the pairs `(i, j)` whose sum is `-(C[k] + D[l])`: there are `sommes_ab.get(-(C[k] + D[l]), 0)` of them, which you add to the total.

Each quadruple is counted exactly once: when its pair `(k, l)` is handled, in the number of matching pairs `(i, j)`.

This makes 2 × N² = 320,000 dictionary operations, instead of 2.56 × 10¹⁰ comparisons for the direct method. The values of the dictionary count pairs, not positions: if several pairs `(i, j)` give the same sum, they are all counted.

The answer can reach 400⁴ = 2.56 × 10¹⁰ (everything is 0): in C++, you need `long long` for the total and for the values of the dictionary.
