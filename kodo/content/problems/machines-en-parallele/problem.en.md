---
title: Machines in parallel
---

## Statement
A workshop has N machines. Machine number i takes exactly T_i minutes to make one part, and it makes one part after another without ever stopping: it finishes one after T_i minutes, a second one after 2 × T_i minutes, and so on.

All the machines start at the same time. Write a program that computes the minimum number of minutes after which the machines, all together, will have finished at least M parts.

## Input
- The first line contains two integers N and M.
- The second line contains N integers T_1, T_2, …, T_N.

## Output
A single integer: the minimum number of minutes needed to get at least M parts.

## Constraints
- 1 ≤ N ≤ 10 000
- 1 ≤ M ≤ 10⁹
- 1 ≤ T_i ≤ 10⁹

## Hints
1. If you know a duration t, can you compute how many parts are finished after t minutes? And if t minutes are enough, what can you say about t + 1 minutes?
2. The answer can be huge (up to 10¹⁸): you cannot try every duration one by one. Look for the smallest sufficient duration with a binary search on the answer.
3. Start from `trop_court = 0` ("too short": no part at all) and `suffisant = min(T) × M` ("enough": the fastest machine makes everything on its own). While the gap is larger than 1, test the middle. In C++, stop counting parts as soon as the count reaches M.

## Solution
**The idea: binary search on the answer.** In t minutes, machine i finishes `t // T_i` parts (integer division). The total `f(t)` over all machines can only increase with t. So the question "are t minutes enough?" has answers of the form no, no, …, no, yes, yes, yes… We look for the first "yes".

We keep two bounds: `trop_court`, a duration we know is not enough, and `suffisant`, a duration we know is enough. At the start, `trop_court = 0` and `suffisant = min(T) × M`. While `suffisant − trop_court > 1`, we test `milieu` (the middle): if it is enough, it becomes `suffisant`, otherwise it becomes `trop_court`. At the end, `suffisant` is the answer.

On the first example (machines of 2, 3 and 5 minutes, 8 parts): in 8 minutes we get 4 + 2 + 1 = 7 parts, in 9 minutes 4 + 3 + 1 = 8 parts. The answer is 9.

**Complexity.** The search interval is at most 10¹⁸ long, so about 60 tests, each in O(N): O(N log(min(T) × M)), about 600 000 operations.

**Why the naive solution is too slow.** Moving forward minute by minute can take 10¹⁸ steps. Simulating the parts one by one (each time looking for the machine that finishes next) takes M = 10⁹ steps: far too many as well.

**Traps.**
- The answer can reach 10¹⁸: in C++, use `long long` everywhere (bounds, middle, total).
- Hidden overflow: with t close to 10¹⁸ and 10 000 machines of 1 minute, the sum of the `t / T_i` goes far beyond 2⁶³. You must **stop the sum as soon as it reaches M**: the total then stays below M + 10¹⁸, which fits in a `long long`.
- Check that the starting bound `suffisant` really is enough, and that `trop_court` really is not: otherwise the binary search may return a wrong value.
