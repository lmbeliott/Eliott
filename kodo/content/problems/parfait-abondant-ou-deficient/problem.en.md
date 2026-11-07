---
title: Perfect, abundant or deficient
---

## Statement
The **proper divisors** of an integer `N` are its divisors other than `N` itself. For example, those of 12 are 1, 2, 3, 4 and 6. Let `S` be their sum. The number `N` is:
- **perfect** if `S = N` (like 6 = 1 + 2 + 3);
- **abundant** if `S > N` (like 12, because 1 + 2 + 3 + 4 + 6 = 16);
- **deficient** if `S < N` (like 10, because 1 + 2 + 5 = 8).

Classify several numbers.

## Input
- The first line contains the integer `Q`.
- Each of the next `Q` lines contains an integer `N`.

## Output
`Q` lines: for each number, in order, `PARFAIT` (perfect), `ABONDANT` (abundant) or `DEFICIENT` (deficient).

## Constraints
- 1 ≤ Q ≤ 20
- 1 ≤ N ≤ 10⁹

## Hints
1. Write a function `proper_divisor_sum(n)`. Trying every divisor up to `n - 1` is far too slow for `n = 10⁹`.
2. Divisors come in pairs: if `d` divides `n`, then so does `n / d`. It is enough to go through the `d` such that `d × d ≤ n`, and add both `d` and `n / d` each time.
3. Watch out for two cases: when `d × d = n`, the pair contains a single number; and `n` itself (paired with `d = 1`) must not be counted.

## Solution
A function `proper_divisor_sum(n)` computes `S`, then a function `classify(n)` compares `S` with `n` and returns the word to print.

To compute `S` quickly, group the divisors in pairs `(d, n / d)` with `d ≤ n / d`, that is `d × d ≤ n`. So go through `d` from 1 while `d × d ≤ n`, and when `d` divides `n` add `d` and `n / d`. That's at most 31,623 turns for `n = 10⁹`, instead of a billion.

Two corrections are needed:
- if `d × d = n`, both numbers of the pair are equal: add `d` only once. Otherwise 16 would get the sum 1 + 2 + 4 + 4 + 8 = 19 and be declared abundant, whereas 1 + 2 + 4 + 8 = 15;
- the pair `(1, n)` contains `n` itself, which is not a proper divisor: subtract `n` at the end. For `n = 1`, there is no proper divisor, `S = 0`, and 1 is deficient.

Perfect numbers are rare: up to 10⁹, there are only 6, 28, 496, 8,128 and 33,550,336.
