---
title: Collatz sequence starting at 7
---

## Statement
A sequence of integers starts at `7` and is built with the following rule: if the number is even, the next one is its half; if it is odd, the next one is three times it plus one. The sequence stops as soon as it reaches `1`.

Print, on a first line, all the terms of the sequence, from `7` down to `1` included, separated by a space. Then print, on a second line, the largest term of the sequence, and on a third line, the number of terms.

## Input
None: the program reads nothing.

## Output
Three lines: the terms of the sequence separated by a space; the largest term; the number of terms printed on the first line.

## Hints
1. Compute the sequence on paper. After 7, which is odd, comes 3 × 7 + 1 = 22; 22 is even, so the next one is 11.
2. Double-check each computation: a single mistake breaks the whole end of the sequence. The last term is `1`.

## Solution
Apply the rule by hand: 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1. The sequence has 17 terms and its largest term is 52.

The program prints these three results with three instructions. To count the terms without mistakes, you can number them on paper; do not forget to count the starting `7` and the final `1`.

This sequence is called the **Collatz sequence** (or Syracuse sequence). Whatever the starting number, it has always been observed to reach 1 eventually, but nobody has managed to prove it yet. In a few chapters, a program will be able to compute the sequence by itself for any starting value.
