---
title: Ordering late tasks
---

## Statement
A machine must perform `N` tasks, one at a time, without any break, starting at time `0`. Task `i` lasts `P[i]`, should be finished by the deadline `D[i]` and has an importance `W[i]`.

If task `i` ends at time `C`, its penalty is `W[i] × (C - D[i])` when `C > D[i]`, and `0` otherwise.

Write a program that computes the smallest possible total penalty, by choosing the order of the tasks.

## Input
- The first line contains the integer `N`.
- The next `N` lines each contain three integers `P[i]`, `D[i]` and `W[i]`.

## Output
A single integer: the smallest total penalty.

## Constraints
- 1 ≤ N ≤ 18
- 1 ≤ P[i] ≤ 100 000
- 0 ≤ D[i] ≤ 2 000 000
- 1 ≤ W[i] ≤ 10 000

## Hints
1. Trying all `N!` orders is out of the question (18! ≈ 6 × 10¹⁵). But if you know which tasks were done first, you know the current time, whatever their order.
2. Represent a set of tasks with a bitmask `m`. Compute `best[m]`, the smallest penalty when the tasks of `m` are done first.
3. In `m`, one of the tasks `j` is done last: it ends at time `end[m]`, the sum of the durations in `m`. So `best[m] = min over j in m of best[m without j] + penalty of j finished at end[m]`.

## Solution
**The key observation.** Once the tasks of a set `m` have been done first, the current time is `end[m]`, the sum of their durations, whatever order was followed. For what comes next, only the set `m` matters, not the order inside it. So we replace the `N!` orders with the `2ᴺ` sets.

**The recurrence.** We encode a set as an integer `m` whose bit `j` is `1` if task `j` belongs to it. Let `best[m]` be the smallest total penalty of the tasks of `m` when they are done first. The last task `j` of `m` ends at `end[m]`:

`best[m] = min over j ∈ m of best[m - {j}] + W[j] × max(0, end[m] - D[j])`, with `best[0] = 0`.

Smaller masks are computed first (`m - {j} < m`), so we go through `m` from `1` to `2ᴺ - 1`. We also compute `end[m]` from the mask without its lowest bit. The answer is `best[2ᴺ - 1]`. Complexity: **O(2ᴺ × N)**, about 4.7 million operations for N = 18.

Why simple ideas fail: listing the orders costs `N!`. The classic greedy rules are wrong: "nearest deadline first", "smallest ratio `P / W` first", "smallest slack `D - P` first". The tests contain cases where all three are wrong. The problem is hard in general (no polynomial algorithm is known): dynamic programming over subsets is the right approach for small `N`.

Traps:
- The total penalty can exceed 2³¹: in C++, use `long long`.
- `D[i]` can be `0`: the task is then late no matter what.
- Keep the condition `C > D[i]`: a task finished exactly at its deadline has no penalty.
