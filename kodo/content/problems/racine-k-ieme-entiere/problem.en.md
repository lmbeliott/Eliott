---
title: Integer K-th root
---

## Statement
For an integer N ≥ 0 and an integer K ≥ 2, the **integer K-th root** of N is the largest integer R ≥ 0 such that R^K ≤ N, where R^K is the product of K factors equal to R.

For example, the integer cube root of 30 is 3, since 3³ = 27 ≤ 30 < 64 = 4³.

Answer T questions. Beware: floating-point numbers are approximate, and `N ** (1 / K)` or `pow(N, 1.0 / K)` is sometimes off by one; the tests contain such cases.

## Input
The first line contains T. Each of the next T lines contains two integers N and K.

## Output
T lines: for each question, the integer K-th root of N.

## Constraints
- 1 ≤ T ≤ 1,000
- 0 ≤ N ≤ 10¹⁸
- 2 ≤ K ≤ 60

## Hints
1. The property "R^K ≤ N" is true for R = 0, and if it holds for R, it holds for every smaller integer: we look for the last R where it holds, by binary search.
2. The answer is at most 10⁹, since K ≥ 2: you can search between 0 and 10⁹ + 1.
3. In C++, R^K quickly exceeds 2⁶³ − 1. Compute the power factor by factor and stop as soon as it exceeds N, by testing **before** multiplying whether `p > N / R`.

## Solution
**A monotone predicate.** Let ok(R) be the property R^K ≤ N. If ok(R) holds and R' ≤ R, then R'^K ≤ R^K ≤ N: ok is true on an initial interval, then false. The answer is the last integer where ok holds, and we find it by binary search with the invariant "ok(lo) is true and ok(hi) is false". Start with lo = 0 (0^K = 0 ≤ N) and hi = 10⁹ + 1, since (10⁹ + 1)² > 10¹⁸ ≥ N. While hi − lo > 1, test the middle and replace lo or hi; at the end, lo is the answer.

**Computing R^K without overflow.** Multiply p = 1 by R, K times, and stop as soon as p exceeds N: ok is then false. In C++, the product p × R can exceed 2⁶³ − 1 before we notice; so we test `p > N / R` before multiplying (for R ≥ 1): over the reals this is p × R > N, and integer division does not change the conclusion, because p is an integer. The computation stops after at most K multiplications, and in practice far fewer when R is large.

**Why not floating point.** A `double` has only 53 bits of precision: for N = 10¹⁸ − 1 and K = 2, `sqrt(N)` is exactly 10⁹ once rounded, whereas the right answer is 999,999,999. Fixing the floating-point result by one is possible, but the integer binary search is safe.

**Cost.** About thirty binary search steps per question, each with at most K multiplications: about 2,000 operations per question in the worst case. Trying R = 0, 1, 2, … would take up to 10⁹ attempts per question.
