---
title: Multiplicative persistence
---

## Statement
Start from a non-negative integer. As long as it has at least two digits, replace it with the product of its digits. For example: 39 → 27 → 14 → 4. The **persistence** of the starting number is the number of replacements made: 3 for 39, 0 for 4.

Compute the persistence of each of the Q given numbers.

## Input
The first line contains Q. Each of the next Q lines contains an integer N.

## Output
Q lines: the persistence of each number, in input order.

## Constraints
- 1 ≤ Q ≤ 1,000
- 0 ≤ N ≤ 10¹⁸

## Hints
1. First write a recursive function `product(n)`: the product of the digits of `n` is the last digit times the product of the digits of `n // 10`. What is the base case?
2. Persistence can also be defined recursively: 0 if `n < 10`, otherwise 1 more than the persistence of `product(n)`.

## Solution
Two recursive functions are enough.

- `product(n)`: if `n < 10`, the number has a single digit and the product is `n`. Otherwise it is `(n % 10) × product(n // 10)`.
- `persistence(n)`: if `n < 10`, no replacement is needed, it is 0. Otherwise one replacement is made, and what remains is the persistence of `product(n)`: the result is `1 + persistence(product(n))`.

**Correctness.** For `product`, by induction on the number of digits: true for one digit (base case); if it is true for `n // 10`, which has one digit less, multiplying by the last digit gives the product of all the digits. For `persistence`, the recursive definition copies the rule of the statement exactly.

**Termination.** For `n ≥ 10`, the product of the digits is strictly smaller than `n`: if `n` has `k` digits and starts with digit `a`, the product is at most `a × 9^(k−1)`, while `n ≥ a × 10^(k−1)`. The sequence of values strictly decreases, so the calls stop.

**Cost.** `product` makes one call per digit, at most 19. Persistence stays very small: no number up to 10¹⁸ goes above 11 (the smallest number with persistence 11 is 277,777,788,888,899). In C++, `n` must be a `long long`, and so must the product: 9¹⁸ exceeds 2³¹.
