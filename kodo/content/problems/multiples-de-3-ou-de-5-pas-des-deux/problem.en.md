---
title: Multiples of 3 or of 5, not both
---

## Statement
Count the integers from `1` to `N` that are multiples of 3 or multiples of 5, but not both at once. For example, 9 and 10 are counted, but not 15 (a multiple of both 3 and 5) nor 7 (a multiple of neither).

## Input
A single line containing the integer `N`.

## Output
A single integer: the number of integers counted.

## Constraints
- 1 ≤ N ≤ 100 000

## Hints
1. Go through the integers `k` from 1 to `N` with a loop, and count those that fit.
2. You can store two booleans: `by3 = k % 3 == 0` and `by5 = k % 5 == 0`.
3. "One or the other, but not both": `(by3 or by5) and not (by3 and by5)`. A shorter form exists: two booleans are "one true, the other false" exactly when they are different.

## Solution
For each integer `k` from 1 to `N`, compute `by3` and `by5`. The integer is counted when exactly one of them is true. This can be written `(by3 or by5) and not (by3 and by5)`: at least one of them, and not both. More simply, two booleans of which exactly one is true are two different booleans: the condition `by3 != by5` says exactly the same thing.

The trap is to write only `by3 or by5`: the "or" of programming is inclusive, and it would also count 15, 30, 45…

The loop runs at most 100,000 times, which is fast.
