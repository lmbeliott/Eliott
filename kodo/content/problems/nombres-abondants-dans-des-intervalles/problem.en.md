---
title: Abundant numbers in intervals
---

## Statement
An integer m ≥ 1 is **abundant** if the sum of its divisors strictly smaller than itself exceeds m. For example, 12 is abundant, since 1 + 2 + 3 + 4 + 6 = 16 > 12, but 10 is not: 1 + 2 + 5 = 8.

Answer Q questions: how many abundant numbers are there between L and R (inclusive)?

## Input
The first line contains Q. Each of the next Q lines contains L and R.

## Output
Q lines: the answer to each question.

## Constraints
- 1 ≤ Q ≤ 10,000
- 1 ≤ L ≤ R ≤ 100,000

## Hints
1. Computing the sum of the divisors of a number by trying divisors up to its square root costs about 300 operations for a number close to 100,000. Doing it again for every number of every question is far too slow.
2. Compute once and for all the sum of the divisors of **all** numbers up to 100,000: for each d, add d to all its multiples 2d, 3d, 4d… How many additions does this make?
3. With a prefix-sum array of the number of abundant numbers, each question is solved with one subtraction.

## Solution
**All divisor sums at once.** Let N be the largest value of R. Start from an array `s` of N + 1 zeros. For each d from 1 to N/2, add d to `s[2d]`, `s[3d]`, `s[4d]`… up to N. Each number m receives exactly its divisors d < m: at the end, `s[m]` is the sum we want.

**Why it is fast.** For a given d, at most N/d additions are made. The total is at most N/1 + N/2 + N/3 + … + N/N = N × (1 + 1/2 + … + 1/N). This **harmonic sum** is about ln(N) + 0.58, that is 12 for N = 10⁵: about 1.2 million additions, a complexity of O(N log N). Trying divisors up to √m for each m would cost O(N√N), about 2 × 10⁷ operations.

**Answering the questions.** Compute `c[m]`, the number of abundant numbers between 1 and m: `c[m] = c[m − 1] + 1` if `s[m] > m`, and `c[m] = c[m − 1]` otherwise. The number of abundant numbers between L and R is `c[R] − c[L − 1]`: one operation per question, instead of scanning the interval, which would cost up to 10⁴ × 10⁵ = 10⁹ operations.

**Total cost.** O(N log N + Q). Note that all the multiples of an abundant number, or of a perfect number such as 6 (1 + 2 + 3 = 6), are abundant: about a quarter of the numbers up to 100,000 are.
