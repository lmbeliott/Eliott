---
title: Count prime numbers
---

## Statement
An integer is **prime** if it is greater than or equal to 2 and has no divisor other than 1 and itself: `2`, `3`, `5`, `7`, `11` are prime, but not `1`, `9` or `15`.

Print how many integers between 2 and `N` are prime, then the largest of them.

## Input
A single line containing the integer `N`.

## Output
A single line with two integers separated by a space: the number of primes between 2 and `N` (inclusive), then the largest prime less than or equal to `N`.

## Constraints
- 2 ≤ N ≤ 30,000

## Hints
1. An outer loop on the candidates `n` from 2 to `N`, and an inner loop that looks for a divisor `d` of `n`, starting from 2.
2. If `n` has a divisor `d` with `2 ≤ d < n`, it has one with `d × d ≤ n`: it's enough to test the `d` as long as `d × d ≤ n`. Without this remark, the program is too slow in Python.
3. A boolean variable `premier`, set to `True` at the start of each outer turn, becomes `False` as soon as a divisor is found. The inner loop can stop at that moment: `while d * d <= n and premier`.

## Solution
For each candidate `n`, look for a divisor `d` starting from 2. You don't need to go up to `n - 1`: if `n = d × e` with `2 ≤ d ≤ e`, then `d × d ≤ d × e = n`. So if no `d` with `d × d ≤ n` divides `n`, then `n` is prime.

The inner loop is written `while d * d <= n and premier`, where `premier` is a boolean reset to `True` at the start of each turn of the outer loop. As soon as a divisor is found, `premier` becomes `False` and the inner loop stops. After the inner loop, if `premier` is still true, increase the counter and remember `n` as the largest prime found: since the candidates are visited in increasing order, the last one remembered is the largest.

With the bound `d × d ≤ n`, the inner loop makes at most 172 turns for `n ≤ 30,000`, and far fewer for numbers that are not prime. Without this bound, it would take almost 450 million turns in total for `N = 30,000`: far too many for Python.

The trap: initialising `premier` only once before the outer loop. From the first non-prime number (`4`) on, it would stay `False` forever.
