---
title: LCM of a list
---

## Statement
The **LCM** of several positive integers is the smallest positive integer that is a multiple of each of them. For example, the LCM of 4, 6 and 10 is 60.

We are given N integers. Print their LCM if it is at most 10¹⁸, and `-1` otherwise.

## Input
The first line contains N. The second line contains the N integers.

## Output
The LCM of the N integers, or `-1` if it exceeds 10¹⁸.

## Constraints
- 1 ≤ N ≤ 1,000
- 1 ≤ each integer ≤ 10¹⁸

## Hints
1. The LCM is computed step by step: LCM(a, b, c) = LCM(LCM(a, b), c), and LCM(a, b) = a / GCD(a, b) × b.
2. In C++, the product a / GCD(a, b) × b can exceed 2⁶³ − 1 before we can even compare it with 10¹⁸: the result becomes wrong, often negative, without any message.
3. Test before multiplying: q × b > 10¹⁸ if and only if q > ⌊10¹⁸ / b⌋, for positive integers.

## Solution
**The formula.** For two integers, GCD(a, b) × LCM(a, b) = a × b: in the prime factorizations, the GCD takes the smaller exponent of each prime and the LCM the larger, and min + max = sum of the two exponents. So we compute LCM(a, b) = (a / GCD(a, b)) × b, dividing first: the division is exact, and the number stays smaller. The LCM of the whole list is computed step by step, since a common multiple of a, b and c is a multiple of LCM(a, b) and of c.

**Overflow.** Even dividing first, q = a / GCD(a, b) multiplied by b can reach 10³⁶. In C++, this product exceeds the capacity of a `long long` and gives a wrong result. So we test before multiplying: for integers q, b ≥ 1, q × b > 10¹⁸ if and only if q > ⌊10¹⁸ / b⌋. As soon as the LCM exceeds 10¹⁸, it can only grow: print `-1`. In Python, integers have no limit, but there is no point letting a number of thousands of digits grow: stop as well.

**Cost.** N GCD computations, each in O(log 10¹⁸) steps, as seen in level 3.
