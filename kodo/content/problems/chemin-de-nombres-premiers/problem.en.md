---
title: Path of prime numbers
---

## Statement
Start from a prime number `A` and reach the prime number `B`, which has the same number of digits `D`. A **step** changes a single digit of the current number. After each step, the number obtained must still be a prime with `D` digits (so its first digit is never `0`), and it must not belong to a list of **forbidden** numbers.

For example, with `D = 2` and nothing forbidden, one can go from `13` to `89` in 3 steps: 13 → 19 → 79 → 89. The minimum is 2 steps: 13 → 83 → 89.

Compute the minimum number of steps to go from `A` to `B`, or print `-1` if it is impossible.

## Input
- The first line contains two integers `A` and `B`.
- The second line contains an integer `K`: the number of forbidden numbers.
- The third line contains `K` integers: the forbidden numbers (it is empty if `K = 0`).

## Output
A single integer: the minimum number of steps, or `-1`.

## Constraints
- `A` and `B` are primes with the same number `D` of digits, with 1 ≤ D ≤ 5
- 0 ≤ K ≤ 1,000
- the forbidden numbers are primes with `D` digits, different from `A` and `B`

## Hints
1. The states are the primes with `D` digits, and two states are joined if they differ by a single digit. The answer is a distance: breadth-first search.
2. A sieve of Eratosthenes up to 100,000 tells in constant time whether a number is prime.
3. To list the neighbours of `x`, replace its digit at position `p` (of weight `10^p`) by each of the other digits: `x − c × 10^p + c' × 10^p`, where `c` is the current digit.

## Solution
The problem is an **implicit** graph: a vertex is a prime with `D` digits, and an edge joins two numbers differing by a single digit. The answer is the distance from `A` to `B`, computed by a breadth-first search.

The primes below 100,000 are precomputed with the sieve of Eratosthenes. The neighbours of `x` are obtained without strings: for each position `p`, the current digit is `c = (x // 10^p) % 10`, and we try `y = x + (c' − c) × 10^p` for each digit `c' ≠ c`, excluding `c' = 0` on the leading position. `y` is kept if it is prime, not forbidden and not visited yet. The forbidden numbers are simply marked as already visited before the search.

**Complexity.** There are at most 8,363 primes with 5 digits, and each has at most 5 × 9 = 45 candidate neighbours: about 400,000 tests, plus the sieve.

**Remark.** With nothing forbidden, this same program shows that all primes with at most 5 digits are connected to each other. This fails with 6 digits: no single-digit change of 294,001 gives a prime.
