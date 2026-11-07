---
title: Prime numbers in a window
---

## Statement
We are interested in the prime numbers between L and R (both included). Reminder: a prime number is an integer greater than or equal to 2 whose only divisors are 1 and itself.

Write a program that prints how many prime numbers there are between L and R, then the largest gap between two **consecutive** prime numbers of this interval.

## Input
A single line with two integers L and R.

## Output
Two integers separated by a space: the number of primes p such that L ≤ p ≤ R, then the largest gap q − p between two of these primes that follow each other. If the interval contains fewer than two primes, the second number is `0`.

## Constraints
- 1 ≤ L ≤ R ≤ 10¹²
- R − L ≤ 1,000,000

## Hints
1. A sieve of Eratosthenes up to R is impossible: R can be 10¹². But to know whether a number n ≤ R is prime, it is enough to know its prime divisors up to √R ≤ 10⁶.
2. First run an ordinary sieve up to √R. Then create an array of R − L + 1 cells, one per number of the interval, and for each prime p ≤ √R, cross out its multiples in the interval.
3. The first multiple of p that is at least L is `⌈L / p⌉ × p`, that is `(L + p − 1) // p * p`. Start at `max(p × p, this multiple)` so as not to cross out p itself. Don't forget that 1 is not prime.

## Solution
**The idea: a sieve on a window.** A number n ≥ 2 that is not prime has a prime divisor p ≤ √n. So to recognise the primes between L and R, it is enough to cross out, in this interval, the multiples of the primes up to √R ≤ 10⁶.

1. We run an ordinary sieve of Eratosthenes up to √R, to know these small primes.
2. We create an array `fenetre` (*window*) of R − L + 1 cells, all marked "prime", where cell i stands for the number L + i. For each prime p ≤ √R, we cross out the multiples of p in the window, starting at `max(p × p, ⌈L / p⌉ × p)`: the multiples smaller than p × p have a prime divisor smaller than p, so they are already crossed out; above all, this avoids crossing out p itself when it is in the window.
3. If L = 1, we cross out the cell of 1. The remaining cells are the primes of the interval: we go through them in order to count them and measure the gap with the previous one.

In the second example (100 to 130), the primes are 101, 103, 107, 109, 113 and 127: there are 6 of them, and the largest gap is 127 − 113 = 14.

**Complexity.** The small sieve costs O(√R log log √R). In the window, the prime p crosses out about (R − L) / p cells; in total, this is O((R − L) log log R + √R), a few million operations.

**Why the naive solution is too slow.** Testing each number of the window by trying every divisor up to its square root costs up to 10⁶ divisions per prime found, for tens of thousands of primes: more than 10¹⁰ operations. And an ordinary sieve up to 10¹² would need an array of a trillion cells.

**Traps.**
- In C++, the numbers go beyond 2³¹: use `long long` (including for `p × p`).
- Do not cross out p itself: this is why we start at `p × p` at the earliest.
- 1 is not prime, but no prime crosses it out: handle it separately.
- The small sieve must go up to √R included: if R = 49, the multiples of 7 must be crossed out.
