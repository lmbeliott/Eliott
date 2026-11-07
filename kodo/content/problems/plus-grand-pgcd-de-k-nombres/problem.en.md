---
title: Largest GCD of K numbers
---

## Statement
There are N strictly positive integers. For each K from 1 to N, we want to choose K of these integers (at different positions) so that their GCD is as large as possible.

For example, with 6, 10, 15, 12 and 9: for K = 2, the best choice is {6, 12}, with GCD 6; for K = 3, one can choose {6, 12, 9}, with GCD 3, and one cannot do better.

Print this largest GCD for each K.

## Input
The first line contains N. The second line contains the N integers.

## Output
One line of N integers: the largest possible GCD for K = 1, 2, …, N.

## Constraints
- 1 ≤ N ≤ 20,000
- 1 ≤ each integer ≤ 100,000

## Hints
1. Trying every choice of K numbers is out of the question. Turn the question around: for an integer d, how many of the N numbers are multiples of d? If at least K are, a GCD of at least d can be reached.
2. Let cnt[d] be the number of multiples of d among the N numbers. With a frequency array of the values, cnt[d] is computed by going through d, 2d, 3d… up to 100,000. How many operations for all d?
3. The answer for K is the largest d such that cnt[d] ≥ K. It can only decrease when K increases: all of them can be computed in a single sweep.

## Solution
**Rephrasing.** Let M = 100,000 and cnt[d] be the number of positions whose value is a multiple of d. The answer for K is the largest d such that cnt[d] ≥ K:

- if cnt[d] ≥ K, choose K multiples of d; their GCD is a multiple of d, so at least d;
- conversely, if K numbers have GCD g, they are all multiples of g, so cnt[g] ≥ K.

**Computing all cnt[d].** Fill a frequency array `f[v]` (number of positions with value v), then, for each d, cnt[d] = f[d] + f[2d] + f[3d] + … The total number of additions is M/1 + M/2 + … + M/M ≈ M × ln(M), about 1.2 million: this is the cost of the **harmonic series**, O(M log M). Testing divisibility of the N numbers for each d would cost N × M = 2 × 10⁹ operations; enumerating the divisors of each number up to its square root would cost about N × √M ≈ 6 × 10⁶, fine in C++ but slow in Python. The constraints (values bounded by 10⁵, N much smaller than M) point to the frequency array.

**All the answers at once.** Go through d from M down to 1 while keeping an index K, starting at 1: while K ≤ N and cnt[d] ≥ K, the answer for K is d (it is the largest possible d, since the larger d have already been examined without success for this K), and K increases. **Invariant**: when d is examined, the answers for 1, …, K − 1 are found, and no d' > d satisfies cnt[d'] ≥ K. Since cnt[1] = N, all the answers are found at the end. This sweep costs O(M + N).

**Total cost.** O(N + M log M). On the example, cnt[15] = 1, cnt[12] = 1, …, cnt[6] = 2, cnt[5] = 2, cnt[4] = 1, cnt[3] = 4, cnt[2] = 3, cnt[1] = 5: the answers are 15, 6, 3, 3, 1.
