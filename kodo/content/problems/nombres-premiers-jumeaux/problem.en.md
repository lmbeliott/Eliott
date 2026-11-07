---
title: Twin primes
---

## Statement
A number is **prime** if it is greater than 1 and can only be divided by 1 and by itself: `2`, `3`, `5`, `7`, `11` and `13` are prime, but not `1`, `9` or `15`.

Two prime numbers are **twins** when they differ by exactly 2: for example `11` and `13`, or `17` and `19`.

Write a program that counts the pairs of twin primes whose two numbers are both between `A` and `B` (included).

## Input
A single line containing two integers `A` and `B`.

## Output
A single integer: the number of pairs `(p, p + 2)` such that `p` and `p + 2` are prime, with `A ≤ p` and `p + 2 ≤ B`.

## Constraints
- 1 ≤ A ≤ B ≤ 20 000

## Hints
1. First write a function `is_prime(n)` that returns true or false. Test it on its own on a few numbers: `1`, `2`, `9`, `13`.
2. To know whether `n` is prime, look for a divisor `d` starting from 2. No need to go up to `n - 1`: if `n` has a divisor, it has one such that `d × d ≤ n`.
3. The main program goes through the `p` from `A` to `B - 2` and counts those for which `is_prime(p)` and `is_prime(p + 2)` are both true.

## Solution
The problem splits into two pieces:
- a function `is_prime(n)`, which answers the question "is `n` prime?";
- a main program that calls it twice for each `p` from `A` to `B - 2`: the pair `(p, p + 2)` is counted when both answers are true.

In the reference solutions, the function is called `est_premier`.

In `is_prime`, first handle the case `n < 2`: `0` and `1` are not prime. Then try the divisors `d = 2, 3, 4…` as long as `d × d ≤ n`. If one of them divides `n` (the remainder `n % d` is 0), return false straight away. If none does, return true.

Why stop when `d × d` goes past `n`? If `n = d × e` with `d ≤ e`, then `d × d ≤ d × e = n`. So a divisor, if there is one, is found before this limit. For `n = 19 997`, this means at most 141 tries instead of almost 20 000.

The traps:
- `1` is not prime: without the case `n < 2`, the loop doesn't run at all and the function answers true;
- the bounds: you need `p + 2 ≤ B`, so `p` only goes up to `B - 2`. Between 6 and 30, the pair `(29, 31)` doesn't count;
- the same number can be part of two pairs: `(3, 5)` and `(5, 7)` both count.
