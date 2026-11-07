---
title: Goldbach decompositions
---

## Statement
It has been conjectured since 1742 that every even integer greater than or equal to 4 is the sum of two prime numbers. For example, 10 = 3 + 7 = 5 + 5: there are two decompositions.

For several even integers `N`, count the pairs of prime numbers `p ≤ q` such that `p + q = N`.

## Input
- The first line contains the integer `Q`.
- Each of the next `Q` lines contains an even integer `N`.

## Output
`Q` lines: for each `N`, in order, the number of pairs.

## Constraints
- 1 ≤ Q ≤ 10
- 4 ≤ N ≤ 10,000, `N` even

## Hints
1. Write a function `is_prime(n)` as in the lesson, which stops as soon as a divisor is found.
2. For each `p` from 2 to `N / 2`, the second number has to be `q = N - p`. You only need to test whether `p` and `q` are both prime.
3. Write a function `goldbach(n)` that returns the number of pairs; the main program calls it on each `N`.

## Solution
With `p ≤ q` and `p + q = N`, you have `p ≤ N / 2`, and `q = N - p` is fully determined by `p`. The function `goldbach(n)` therefore goes through `p` from 2 to `n / 2` and counts the `p` for which `is_prime(p)` and `is_prime(n - p)` are both true.

The function `is_prime` tries the divisors `d` while `d × d ≤ n` and returns `False` at the first divisor found. Thanks to `and`, the second test is only run if `p` is prime. For `N = 10,000`, that's at most 5,000 quick tests: the program stays very fast.

The trap: also counting the pairs `(q, p)` by letting `p` go up to `N`. For 10, you would find 3 + 7, 5 + 5 and 7 + 3, that is 3 instead of 2. The bound `p ≤ N / 2` counts each pair once, including the case `p = q` (like 5 + 5).

Nobody has proved Goldbach's conjecture yet, but it has been checked by computer up to 4 × 10¹⁸.
