---
title: Up then down
---

## Statement
Print the integers from `1` to `25` in increasing order, then go back down to `1` in decreasing order, without printing the top value `25` twice in a row. Finish with a line containing the word `FIN` (French for "end").

## Input
None: the program reads nothing.

## Output
One number per line: `1`, `2`, …, `24`, `25`, `24`, `23`, …, `2`, `1`, then a last line containing `FIN`. The number `25` appears only once, every other one twice.

## Hints
1. Two loops one after the other: one going up, one going down.
2. Which number should the way down start with, so that `25` is not printed twice?

## Solution
The first loop goes from 1 to 25 included: `range(1, 26)`. The second loop goes back from 24 down to 1 included, with a step of −1: `range(24, 0, -1)`. It starts at 24 because the top was already printed by the first loop. After the two loops, print `FIN`.

You can check the total: 25 numbers on the way up, 24 on the way down, that is 49 numbers, plus the `FIN` line. The classic mistakes are starting the way down at 25 (the top appears twice), or writing `range(24, 1, -1)`, which stops at 2.
