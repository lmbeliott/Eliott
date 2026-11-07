---
title: Pairs with product at most N
---

## Statement
Count the pairs (a, b) of strictly positive integers such that a × b ≤ N. Order matters: (2, 3) and (3, 2) are two different pairs.

For example, for N = 6, there are 14 pairs: (1, 1) to (1, 6), (2, 1), (2, 2), (2, 3), (3, 1), (3, 2), (4, 1), (5, 1) and (6, 1).

## Input
One line containing N.

## Output
The number of pairs.

## Constraints
- 1 ≤ N ≤ 10¹²

## Hints
1. For a fixed a, the possible values of b are 1, 2, …, ⌊N/a⌋. The answer is therefore ⌊N/1⌋ + ⌊N/2⌋ + … + ⌊N/N⌋. But this sum has 10¹² terms.
2. Let k = ⌊√N⌋. In a pair (a, b) with a × b ≤ N, the smaller of the two numbers is at most k (otherwise the product would exceed N).
3. Count the pairs with a ≤ k, those with b ≤ k (the same number, by symmetry), then subtract those counted twice.

## Solution
For a fixed a, there are ⌊N/a⌋ values of b. The number of pairs is therefore Σ_{a=1..N} ⌊N/a⌋, which is also the sum of the numbers of divisors of the integers from 1 to N (each pair (a, b) with a × b = m corresponds to a divisor a of m). Computing it directly costs O(N): 10¹² loop iterations, hours of computation.

**Cutting in the middle.** Let k = ⌊√N⌋. If a > k and b > k, then a ≥ k + 1 and b ≥ k + 1, and a × b ≥ (k + 1)² > N. So every valid pair has a ≤ k or b ≤ k.

- The pairs with a ≤ k number A = Σ_{a=1..k} ⌊N/a⌋.
- By symmetry (swap a and b), the pairs with b ≤ k also number A.
- The pairs with a ≤ k **and** b ≤ k are all valid, since a × b ≤ k² ≤ N: there are k² of them.

By inclusion-exclusion, the answer is 2A − k². On the example N = 6: k = 2, A = 6 + 3 = 9, and 2 × 9 − 4 = 14.

It can be seen as a picture: the pairs are the integer points under the hyperbola a × b = N, a figure symmetric about the diagonal. Count the two strips of width k along the axes, and subtract the k × k square counted twice.

**Cost.** A loop of k ≤ 10⁶ iterations: O(√N) instead of O(N). To compute k without rounding errors, start from the floating-point square root and correct it: while (k + 1)² ≤ N, increase k; while k² > N, decrease it (in Python, `math.isqrt(N)` does it directly). The answer exceeds 2³¹: `long long` in C++.
