---
title: Common time of two slots
---

## Statement
The times of a day are counted in minutes since midnight. A first time slot starts at minute `A` and ends at minute `B`: it lasts `B - A` minutes. A second time slot starts at minute `C` and ends at minute `D`.

Write a program that prints the number of minutes during which both slots take place at the same time.

If a slot ends exactly when the other one starts, they have no minute in common.

## Input
- The first line contains two integers `A` and `B`: the start and the end of the first slot.
- The second line contains two integers `C` and `D`: the start and the end of the second slot.

## Output
A single integer: the number of minutes shared by both slots.

## Constraints
- 0 ≤ A < B ≤ 1,440
- 0 ≤ C < D ≤ 1,440

## Hints
1. Draw both slots on a timeline. When both take place at the same time, the common part is a slot too: when does it start? When does it end?
2. The common part starts at the later of the two starts, and ends at the earlier of the two ends. Compute these two numbers with `if`s.
3. If the common part ends before it starts, or at the very moment it starts, the slots have nothing in common: the answer is 0.

## Solution
During the common part, both slots have already started: so it starts at the later of the two starts, `start = max(A, C)`. And neither of them has ended yet: it ends at the earlier of the two ends, `end = min(B, D)`.

If `end > start`, the common part lasts `end - start` minutes. Otherwise, one slot ends before the other one starts (or just as it starts), and the answer is 0.

To compute the larger of two numbers, one `if` is enough: `start` is `A`, and if `C > A`, it is `C`. Same thing for the end.

Example: `A = 60`, `B = 180`, `C = 120`, `D = 300`. The common part goes from minute 120 to minute 180: 60 minutes.

The traps:
- computing `B - C` without thinking: if the second slot is entirely inside the first one (`100 500` and `200 250`), the right answer is 50, the length of the second slot, and not 300;
- forgetting the case where the slots are apart: `end - start` is then negative, and you must print 0;
- forgetting that the slots can be given in any order: the second one may start before the first one.
