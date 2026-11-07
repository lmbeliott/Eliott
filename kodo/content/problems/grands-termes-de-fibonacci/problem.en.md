---
title: Large Fibonacci terms
---

## Statement
The Fibonacci sequence is defined by F(0) = 0, F(1) = 1 and F(n) = F(n − 1) + F(n − 2) for n ≥ 2: 0, 1, 1, 2, 3, 5, 8, 13, 21…

Answer T questions: for given N and M, print the remainder of F(N) divided by M.

## Input
The first line contains T. Each of the next T lines contains two integers N and M.

## Output
T lines: for each question, F(N) mod M.

## Constraints
- 1 ≤ T ≤ 1,000
- 0 ≤ N ≤ 10¹⁸
- 1 ≤ M ≤ 10⁹

## Hints
1. Computing the terms one by one takes N steps: impossible for N = 10¹⁸. You need to go from n to 2n in a single step, as in fast exponentiation.
2. One can prove that F(2k) = F(k) × (2 F(k + 1) − F(k)) and F(2k + 1) = F(k)² + F(k + 1)².
3. Write a recursive function that returns the pair (F(n), F(n + 1)) modulo M, from the pair for ⌊n/2⌋.

## Solution
**The doubling formulas.** First prove, by induction on n, that F(m + n) = F(m) × F(n + 1) + F(m − 1) × F(n) for m ≥ 1 and n ≥ 0: for n = 0 and n = 1, these are F(m) = F(m) and F(m + 1) = F(m) + F(m − 1); and if the formula holds for n − 1 and n, add the two equalities. With m = k + 1 and n = k, we get F(2k + 1) = F(k + 1)² + F(k)². With m = n = k (k ≥ 1), F(2k) = F(k) × F(k + 1) + F(k − 1) × F(k) = F(k) × (2 F(k + 1) − F(k)), replacing F(k − 1) by F(k + 1) − F(k); the formula still holds for k = 0.

**Divide and conquer.** The function fib(n) returns the pair (F(n), F(n + 1)) modulo M. If n = 0, it is (0, 1). Otherwise, compute (a, b) = fib(⌊n/2⌋), then c = a × (2b − a) and d = a² + b², which are F(2k) and F(2k + 1) for k = ⌊n/2⌋. If n is even, the result is (c, d); if it is odd, it is (d, c + d). The formulas remain valid modulo M, since remainders are compatible with additions, subtractions and multiplications.

**Traps.** In C++, 2b − a can be negative, and the `%` operator then returns a negative remainder: add M before taking the remainder. Products of two remainders below 10⁹ fit in a `long long`. For M = 1, every answer is 0.

**Cost.** Each call halves n: about 60 calls per question, that is a recursion depth of 60 and a few tens of thousands of operations in total.
