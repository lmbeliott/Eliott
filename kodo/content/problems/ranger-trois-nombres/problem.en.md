---
title: Sort three numbers
---

## Statement
Read three integers and print them from smallest to largest.

## Input
A single line containing three integers `A`, `B` and `C` separated by spaces.

## Output
A single line containing the three integers in increasing order, separated by spaces.

## Constraints
- −1 000 000 ≤ A, B, C ≤ 1 000 000

## Hints
1. If `A > B`, you can **swap** the contents of `A` and `B` using a third variable: `t = a`, then `a = b`, then `b = t`.
2. After a swap between `A` and `B`, then a swap between `B` and `C` (when needed), the largest number is surely in `C`.
3. It then remains to put `A` and `B` back in order.

## Solution
Put the numbers in order with successive swaps, each one controlled by an `if`:
1. if `A > B`, swap `A` and `B`;
2. if `B > C`, swap `B` and `C`: at this point, `C` holds the largest of the three;
3. if `A > B`, swap `A` and `B` again: the two smallest are now in order.

To swap two variables, use a helper variable `t`: writing `a = b` then `b = a` does not work, because the value of `a` is lost by the first assignment.

The third test is essential. With `5 9 1`: the first test changes nothing; the second swaps 9 and 1, giving `5 1 9`; you still have to swap 5 and 1 to get `1 5 9`. Ties are not a problem: with a strict `>`, two equal numbers are simply not swapped.
