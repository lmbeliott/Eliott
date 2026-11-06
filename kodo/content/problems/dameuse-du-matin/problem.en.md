---
title: The morning snow groomer
---

## Statement
It snowed on the Valcorde resort last night, and no slope has been groomed. Théo, the snow groomer driver, must groom N slopes, one at a time and without breaks. Grooming slope number i takes him D_i minutes, and the slope opens as soon as it is groomed.

When Théo starts (minute 0), F_i skiers are already waiting at the bottom of slope i. Each of them waits until their slope opens: if slope i opens at minute T, its skiers have waited F_i × T minutes in total.

Write a program that computes the smallest possible total waiting time, for all the skiers together, by choosing the order of the slopes well.

## Input
- The first line contains an integer N.
- Each of the next N lines contains two integers D_i and F_i.

## Output
A single integer: the minimum total waiting time, in minutes.

## Constraints
- 1 ≤ N ≤ 15 000
- 1 ≤ D_i ≤ 1 000
- 1 ≤ F_i ≤ 1 000

## Hints
1. Start with only two slopes, a and b. Compute the total waiting time if a comes before b, then if b comes before a. What changes between the two?
2. Only the terms for a and b change: a before b costs `F_b × D_a` more for b's skiers, b before a costs `F_a × D_b` more for a's skiers. It is better to put a first if `D_a × F_b < D_b × F_a`.
3. Sort the slopes with this comparison (it means sorting by increasing `D / F`), then compute the total waiting time in one pass. Careful, the total goes beyond 2³¹.

## Solution
**The greedy idea: sort by increasing `D / F`.** You should first groom the slopes that are quick to groom (small D) and that many people are waiting for (large F). The right criterion combines both: we sort the slopes by increasing ratio `D_i / F_i`, then add up `F_i × T_i`, where T_i is the minute when slope i opens.

**Why it is optimal (swapping two neighbours).** Take any order, and two slopes a and b groomed one right after the other, a first, starting at minute t. If we swap them, the other slopes open at exactly the same moment. Only the waiting times of a and b change:
- a then b: `F_a × (t + D_a) + F_b × (t + D_a + D_b)`;
- b then a: `F_b × (t + D_b) + F_a × (t + D_b + D_a)`.

The difference between the two is `F_b × D_a − F_a × D_b`. So if `D_a × F_b > D_b × F_a`, swapping a and b decreases the total waiting time. In an optimal order, two neighbouring slopes are therefore always arranged by increasing `D / F` (when there is a tie, the order changes nothing). An order where all neighbours are well arranged is exactly the sorted order.

**Comparing without division.** Comparing `D_a / F_a < D_b / F_b` is the same as comparing `D_a × F_b < D_b × F_a` (the F values are positive). This way we avoid decimal numbers. In Python, `functools.cmp_to_key` turns this comparison into a sort key; in C++, we pass it directly to `sort`.

**Complexity.** O(N log N) for sorting, then O(N) for the computation.

**Why the naive solution is too slow.** There are N! possible orders: we cannot even try them all for N = 20. And the rules "shortest first" or "most awaited first" are wrong: on the first example, they give 860 and 820 minutes instead of 780.

**Traps.**
- The total can exceed 10¹³: in C++, use `long long`.
- The opening time T_i adds up: it is the sum of the durations of all the slopes groomed before, plus D_i.
