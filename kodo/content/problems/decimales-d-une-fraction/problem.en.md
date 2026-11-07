---
title: Decimals of a fraction
---

## Statement
Print the integer part of `A / B`, then the first `K` digits after the decimal point of its decimal expansion. The digits are exact: do not round them, simply stop after the `K`-th one.

For example, 22 / 7 = 3.142857142857…: with `K = 5`, print `3`, then `14285`.

## Input
A single line containing `A`, `B` and `K`, separated by spaces.

## Output
Two lines: the integer part of `A / B`, then the `K` digits after the decimal point, written next to each other.

## Constraints
- 0 ≤ A ≤ 10⁹
- 1 ≤ B ≤ 10⁹
- 1 ≤ K ≤ 10,000

## Hints
1. A float only gives about 16 significant digits, and not all of them are even correct. You must compute the digits one by one, as in long division.
2. In long division, you keep the **remainder**. To get the next digit, multiply the remainder by 10, divide by `B`: the quotient is the digit, and the new remainder is used for the next digit.
3. The remainder is always smaller than `B`, so `10 × remainder` stays below 10¹⁰: in C++, you need a `long long`.

## Solution
Reproduce the long division learnt at school. The integer part is `A // B`, and the starting remainder is `r = A % B`. Then, for each of the `K` digits:
- "bring down a zero": `r = 10 × r`;
- the digit is `r // B`, which is between 0 and 9 since `r < 10 × B`;
- the new remainder is `r % B`.

Why it works: if `r / B` is the part after the decimal point still to be written, with `0 ≤ r < B`, then `10 × r / B` shifts the decimal point by one place, its integer part is the next digit, and its fractional part is `(10 × r % B) / B`.

Print the digits without spaces (`print(c, end="")` in Python), then a final newline. The program makes `K` loop turns with integers: it is exact and fast. The float solution fails from about the seventeenth digit, and sometimes earlier.
