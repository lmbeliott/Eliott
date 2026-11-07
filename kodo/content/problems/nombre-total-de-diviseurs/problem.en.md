---
title: Total number of divisors
---

## Statement
For an integer n ≥ 1, let d(n) be its number of divisors. For example, d(6) = 4, because the divisors of 6 are 1, 2, 3 and 6.

Write a program that computes d(L) + d(L + 1) + … + d(R).

## Input
A single line with two integers L and R.

## Output
A single integer: the sum of the numbers of divisors of all integers from L to R.

## Constraints
- 1 ≤ L ≤ R ≤ 10¹²

## Hints
1. It is enough to know how to compute `D(n) = d(1) + d(2) + … + d(n)`: the answer is `D(R) − D(L − 1)`. For D(n), count the other way around: how many numbers between 1 and n are multiples of a? There are `n // a` of them.
2. So `D(n)` is the sum of `n // a` for a from 1 to n: it is also the number of pairs (a, b) of positive integers with a × b ≤ n. But n can be 10¹²: you must avoid going through every a.
3. In a pair (a, b) with a × b ≤ n, you must have a ≤ s or b ≤ s, where s = ⌊√n⌋. Count the pairs with a ≤ s, then those with b ≤ s (it is the same number), and remove those counted twice.

## Solution
**Counting by divisor rather than by number.** Let `D(n) = d(1) + … + d(n)`; the answer is `D(R) − D(L − 1)`, with `D(0) = 0`. Each divisor a of a number m ≤ n is counted once in D(n). Instead of looking for the divisors of each m, we ask, for each a, how many numbers m ≤ n it divides: these are its multiples a, 2a, 3a…, and there are `n // a` of them. So `D(n) = n // 1 + n // 2 + … + n // n`.

In other words, `D(n)` is the number of pairs (a, b) of positive integers such that a × b ≤ n (for each a, b goes from 1 to `n // a`). This is still O(n): too slow for n = 10¹².

**The idea: cut at the square root.** Let `s = ⌊√n⌋`. In a pair (a, b) with a × b ≤ n, we cannot have both a > s and b > s, otherwise a × b ≥ (s + 1)² > n. So:
- there are `X = n // 1 + n // 2 + … + n // s` pairs with a ≤ s;
- by symmetry, there are also X pairs with b ≤ s;
- the pairs counted twice have a ≤ s and b ≤ s: there are s × s of them, because a × b ≤ s² ≤ n then holds automatically.

Hence `D(n) = 2 × X − s²`, computed in O(√n).

In the first example, n = 6 and s = 2: X = 6 + 3 = 9, and D(6) = 2 × 9 − 4 = 14 = 1 + 2 + 2 + 3 + 2 + 4.

**Complexity.** O(√R), that is 10⁶ divisions for R = 10¹², for each of the two calls.

**Why the naive solution is too slow.** Computing d(n) for each n by looking for its divisors, or even adding up `n // a` for every a up to n, costs at least 10¹² operations when R = 10¹². A sieve that counts the divisors of all numbers up to R would need 10¹² cells.

**Traps.**
- The answer goes beyond 2³¹ and even 10¹³: use `long long` in C++.
- In C++, `sqrt` works with floating-point numbers and can be off by 1 for large numbers: adjust s so that exactly s² ≤ n < (s + 1)². In Python, `math.isqrt` directly gives the right value.
- Don't forget the case L = 1: you need D(0) = 0.
