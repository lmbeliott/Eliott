---
title: Sum before the zero
---

## Statement
The program reads integers, one per line. The value `0` marks the end of the input: it does not count as data.

Print the sum of the integers read before that `0`, then how many there are.

## Input
Non-zero integers, one per line, followed by a line containing `0`.

## Output
A single line with two integers separated by a space: the sum of the values, then the number of values.

## Constraints
- At most 1,000 values before the `0` (there may be none).
- Each value is between -1,000,000 and 1,000,000.

## Hints
1. You don't know how many values there are: you need a `while` loop that goes on as long as the value read is not `0`.
2. Read a first value before the loop. In the body, add the value to the sum, increase the counter, then read the next value, last.
3. If the input only contains `0`, the loop makes no turn: the answer is `0 0`.

## Solution
This is the pattern for reading until a **sentinel**. Read one value before the loop; as long as it is different from `0`, process it (add it to the sum `somme` and increase the counter `nombre` by 1), then read the next one at the end of the body.

Since the condition is tested right after each read, the final `0` is never added or counted. The two variables are set to 0 before the loop, once.

The main trap is forgetting the read at the end of the body: the value never changes and the loop never stops.
