---
title: Repeating decimal expansion
---

## Statement
Write the fraction `N / D` in exact decimal notation. When the digits after the decimal point end up repeating, the repeating block is written only once, in parentheses.

For example, `22 / 7 = 3.142857142857…` is written `3.(142857)`, and `1 / 6 = 0.1666…` is written `0.1(6)`. The block in parentheses is as short as possible, and it starts as early as possible.

## Input
A single line containing the integers `N` and `D`, separated by a space.

## Output
The decimal writing of `N / D`, with a dot as the decimal separator:
- if the division is exact, the integer part alone (for example `3`);
- if the expansion stops, all its digits (for example `1.75`);
- otherwise, the integer part, a dot, the digits that don't repeat, then the repeating block in parentheses (for example `0.41(6)`).

## Constraints
- 0 ≤ N ≤ 10⁹
- 1 ≤ D ≤ 100,000

## Hints
1. Do long division: at each step, multiply the remainder by 10; the next digit is `remainder // D` and the new remainder is `remainder % D`.
2. The remainder is always between 0 and `D - 1`. If a remainder shows up again, all the following digits repeat from there.
3. Keep a dictionary that maps each remainder to the position of the digit it produced: when a remainder comes back, that position gives the start of the block.

## Solution
The integer part is `N // D`. For the digits after the point, redo the **long division** from school: starting from the remainder `r = N % D`, compute `10 × r`; the next digit is `(10 × r) // D` and the new remainder is `(10 × r) % D`. Each digit depends only on the current remainder.

Two cases can happen:
- the remainder becomes 0: the division stops, the expansion is finite;
- a remainder already met comes back: from there, the same computations happen again in the same order, and the same digits repeat forever.

Since there are only `D` possible remainders, one of the two cases happens within at most `D` steps. To detect the return of a remainder, keep a dictionary `position` that maps each remainder to the position (in the list of digits) of the digit it produces. When the current remainder is already a key, `position[remainder]` is where the block starts: the digits before it don't repeat, those from it onwards form the block.

This block is indeed the shortest one and starts as early as possible: the remainder fully determines the sequence of digits, and two different remainders give different sequences, so the repetition starts exactly at the first remainder that comes back.

Since remainders are integers between 0 and `D - 1`, a list of size `D` filled with `-1` would also work; the dictionary saves you from thinking about it.
