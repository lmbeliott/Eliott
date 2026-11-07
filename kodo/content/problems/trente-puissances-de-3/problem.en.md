---
title: Thirty powers of 3
---

## Statement
We write 3ᵏ for the product of k factors equal to 3, with the convention 3⁰ = 1: 3¹ = 3, 3² = 9, 3³ = 27, etc. Print the powers of 3 from 3⁰ to 3²⁹.

## Input
None: the program reads nothing.

## Output
30 lines. Line number k + 1 (for k from 0 to 29) contains the exponent k, a space, then the value of 3ᵏ. The first line is therefore `0 1` and the second one `1 3`.

## Hints
1. Each power is three times the previous one: a variable starting at 1 and multiplied by 3 at each iteration.
2. At each iteration, print first, then multiply: otherwise the line `0 1` is missing.
3. In C++, 3²⁹ is far beyond what an `int` can hold.

## Solution
Keep a variable `p`, equal to 1 at the start (that is 3⁰). For `k` going from 0 to 29, print `k` and `p`, then replace `p` with `p * 3`. At iteration number k, `p` is therefore indeed 3ᵏ when it is printed: it is true at the first iteration (k = 0, p = 1), and each iteration multiplies `p` by 3 while `k` increases by 1.

In C++, an `int` does not exceed 2,147,483,647, whereas 3²⁰ = 3,486,784,401 and 3²⁹ = 68,630,377,364,883. With an `int`, values become wrong, even negative, from k = 20 on, without any error message. You must declare `long long p = 1;`. In Python, integers have no limit.
