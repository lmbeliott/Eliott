---
title: Pairs with sum at most S
---

## Statement
A sequence of N integers a₁, a₂, …, a_N is built by a formula, so that the input stays short: a₁ = X, then a_{i+1} = (aᵢ × B + C) mod M for i ≥ 1, where "mod M" is the remainder of the division by M. For example, with X = 3, B = 7, C = 2 and M = 11, the sequence starts with 3, 1, 9, 10, 6, since (3 × 7 + 2) mod 11 = 1, (1 × 7 + 2) mod 11 = 9, and so on.

Count the pairs of indices (i, j), with i < j, such that aᵢ + aⱼ ≤ S.

## Input
The first line contains N and S. The second line contains X, B, C and M.

## Output
The number of pairs.

## Constraints
- 2 ≤ N ≤ 200,000
- 1 ≤ M ≤ 10⁹ and 0 ≤ X, B, C < M
- 0 ≤ S ≤ 2 × 10⁹

## Hints
1. Testing every pair takes N(N − 1)/2 ≈ 2 × 10¹⁰ additions for N = 200,000: far too many, even in C++.
2. The number of pairs does not depend on the order of the values: the sequence can be sorted.
3. In the sorted sequence, with an index `l` starting from the left and an index `r` starting from the right: if `a[l] + a[r] ≤ S`, then `a[l]` forms a valid pair with each of the elements of indices l + 1 to r.

## Solution
Build the sequence, then sort it: the number of pairs of indices with sum at most S does not change when the values are permuted.

Put an index `l` at the start and an index `r` at the end, and repeat while `l < r`:

- if `a[l] + a[r] ≤ S`, then for every k between l + 1 and r, `a[l] + a[k] ≤ a[l] + a[r] ≤ S`: count these `r − l` pairs at once, and move `l` forward;
- otherwise, for every k between l and r − 1, `a[k] + a[r] ≥ a[l] + a[r] > S`: `a[r]` no longer forms any valid pair with the remaining elements, and `r` moves back.

**Invariant.** At each step, all the valid pairs that are not entirely inside the portion `[l, r]` have been counted exactly once. This holds at the start, and both cases above preserve it: in the first, all valid pairs containing `l` inside the portion are counted; in the second, none containing `r` is missed. When `l = r`, the portion contains no pair: everything has been counted.

**Cost.** Sorting costs O(N log N). Then each iteration moves `l` forward or `r` back: at most N iterations, so O(N). The total is O(N log N), about 4 million operations, against 2 × 10¹⁰ for the direct method. The number of pairs can reach 2 × 10¹⁰: `long long` in C++, as for computing aᵢ × B.
