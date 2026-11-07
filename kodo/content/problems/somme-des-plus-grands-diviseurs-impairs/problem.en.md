---
title: Sum of the largest odd divisors
---

## Statement
For an integer k ≥ 1, let g(k) be its largest odd divisor. For example, g(12) = 3, g(7) = 7 and g(8) = 1.

Answer Q questions: what is g(L) + g(L + 1) + … + g(R)?

## Input
The first line contains Q. Each of the next Q lines contains L and R.

## Output
Q lines: the requested sum for each question.

## Constraints
- 1 ≤ Q ≤ 1,000
- 1 ≤ L ≤ R ≤ 10⁹

## Hints
1. Computing g(k) for each k from L to R takes up to 10⁹ computations per question: far too many. It is enough to know how to compute F(N) = g(1) + … + g(N), since the answer is F(R) − F(L − 1).
2. Separate the odd k and the even k. For odd k, g(k) = k. For even k = 2j, g(2j) = g(j).
3. The sum of the odd numbers from 1 to N is m², where m = ⌊(N + 1)/2⌋ is how many there are.

## Solution
Let F(N) = g(1) + g(2) + … + g(N), with F(0) = 0. The answer to a question is F(R) − F(L − 1).

**A recurrence relation.** Among the integers from 1 to N:

- the odd ones are 1, 3, 5, …, there are m = ⌊(N + 1)/2⌋ of them, and for them g(k) = k. Their sum is 1 + 3 + … + (2m − 1) = m²;
- the even ones are written k = 2j with 1 ≤ j ≤ ⌊N/2⌋. Dividing by 2 does not change the largest odd divisor: g(2j) = g(j). Their sum is therefore g(1) + … + g(⌊N/2⌋) = F(⌊N/2⌋).

Hence F(N) = m² + F(⌊N/2⌋). For example, F(6) = 3² + F(3) = 9 + (2² + F(1)) = 9 + 4 + 1 = 14, and indeed 1 + 1 + 3 + 1 + 5 + 3 = 14.

**Correctness and termination.** The relation is proved above for every N ≥ 1; the recursion stops because N is at least halved at each call, down to F(0) = 0.

**Cost.** About log₂(N) + 1 calls, 31 for N = 10⁹: O(log N) per question, against O(R − L) for the direct computation. The answer can reach about 3.3 × 10¹⁷: `long long` in C++, including for m², since m can be 5 × 10⁸.
