---
title: Geometric sum modulo M
---

## Statement
Write a program that answers T questions. Each question gives three integers A, N and M, and asks for the remainder of the division by M of the sum

1 + A + A² + A³ + … + A^N

This sum has N + 1 terms; the first one is always 1, even when A = 0.

## Input
- The first line contains an integer T.
- Each of the next T lines contains three integers A, N and M.

## Output
T lines: for each question, in order, the value of (1 + A + … + A^N) mod M.

## Constraints
- 1 ≤ T ≤ 1,000
- 0 ≤ A ≤ 10¹⁸
- 0 ≤ N ≤ 10¹⁸
- 1 ≤ M ≤ 10⁹

## Hints
1. Adding the N + 1 terms one by one is impossible for N = 10¹⁸. The formula (A^(N+1) − 1) / (A − 1) does not work either: you cannot divide modulo M when M is not prime (look at the second example), nor when A − 1 is a multiple of M.
2. Let S(n) be the sum of the first n terms, 1 + A + … + A^(n−1). The first 2k terms are the first k terms, followed by the first k terms multiplied by A^k: S(2k) = S(k) × (1 + A^k).
3. Write a recursive function that computes A^n mod M and S(n) mod M at the same time, like fast exponentiation: if n is even, from n / 2; if n is odd, from n − 1, with S(n) = S(n − 1) + A^(n−1). The answer is S(N + 1).

## Solution
**Why not use the formula.** We know that 1 + A + … + A^N = (A^(N+1) − 1) / (A − 1) when A ≠ 1. But modulo M, dividing is only possible if A − 1 has an inverse modulo M, which is not the case in general: in the second example, (4⁶ − 1) / 3 with M = 6, and 3 has no inverse modulo 6. We need a method that only uses additions and multiplications.

**The idea: divide and conquer, like fast exponentiation.** Let `S(n) = 1 + A + … + A^(n−1)` be the sum of the first n terms, with S(0) = 0. We compute the pair `(A^n mod M, S(n) mod M)` together:
- if n = 0: `(1, 0)`;
- if n is even, n = 2k: the 2k terms are the first k, then the next k, which are the first k multiplied by A^k. So `A^n = (A^k)²` and `S(n) = S(k) × (1 + A^k)`;
- if n is odd: `A^n = A^(n−1) × A` and `S(n) = S(n − 1) + A^(n−1)`.

We reduce modulo M after each operation. The answer to the question is `S(N + 1)`, since the sum has N + 1 terms.

In the first example, for A = 2, N = 3 and M = 100: S(4) = S(2) × (1 + 2²) = 3 × 5 = 15 = 1 + 2 + 4 + 8.

**Complexity.** As with fast exponentiation, n is at least halved every two calls: O(log N) per question, about 120 calls for N = 10¹⁸, and 120,000 for the 1,000 questions.

**Why the naive solution is too slow.** Adding the terms one by one costs N + 1 operations per question: up to 10¹⁸. The formula with a division gives wrong results as soon as A − 1 and M have a common divisor.

**Traps.**
- Reduce A modulo M right away: A can be 10¹⁸, and `A × A` would overflow.
- In C++, the values stay below M ≤ 10⁹, so the product of two of them is below 10¹⁸: it fits in a `long long`.
- When M = 1, everything is 0: write `1 % M` rather than `1` for the base case.
- When A is a multiple of M plus 1, every term is 1 modulo M: the answer is (N + 1) mod M. The recursive method finds it without any special case.
