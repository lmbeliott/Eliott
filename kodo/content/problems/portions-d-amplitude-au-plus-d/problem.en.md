---
title: Portions with range at most D
---

## Statement
A sequence of N integers a₀, a₁, …, a_{N−1} is built by a formula, so that the input stays short: a₀ = X, then a_{i+1} = (aᵢ × B + C) mod M, where "mod M" is the remainder of the division by M. For example, with X = 3, B = 4, C = 2 and M = 5, the sequence starts with 3, 4, 3, since (3 × 4 + 2) mod 5 = 4 and (4 × 4 + 2) mod 5 = 3.

The **range** of a portion (a run of consecutive elements aᵢ, …, aⱼ, with i ≤ j) is the difference between its largest and smallest element. Count the portions with range at most D.

For example, the sequence 3, 1, 2 has six portions; with D = 1, those that work are [3], [1], [2] and [1, 2]: the answer is 4.

## Input
The first line contains N and D. The second line contains X, B, C and M.

## Output
The number of portions with range at most D.

## Constraints
- 1 ≤ N ≤ 100,000
- 0 ≤ D ≤ 10⁶
- 1 ≤ M ≤ 10⁶ and 0 ≤ X, B, C < M

## Hints
1. If a portion has range at most D, so do all the portions it contains. For each end j, the possible starts therefore form an interval [g, j], and g never moves back when j moves forward.
2. What remains is to know the maximum and minimum of the window [g, j] quickly while g and j move forward. Recomputing them each time costs O(N) per window: too slow.
3. Keep a double-ended queue (deque) of indices whose values decrease: its first element is the position of the maximum of the window. An arriving index removes from the back of the queue all those with a smaller value: they can never be the maximum again. Do the same for the minimum.

## Solution
**Two pointers.** The range of a portion can only decrease when it is shortened. For each end j, let g(j) be the smallest start such that [g(j), j] has range at most D; all the portions [i, j] with g(j) ≤ i ≤ j work, that is j − g(j) + 1 portions, and no other. Moreover g(j + 1) ≥ g(j). So move j from 0 to N − 1 and, at each step, move g forward while the range of [g, j] exceeds D. The answer is the sum of the j − g + 1.

**Maximum and minimum of the window.** Keep a deque `dmax` of indices of the window, with strictly decreasing values, whose front is the position of the maximum. When j arrives, remove from the back of `dmax` the indices with value ≤ a_j: they are older and not larger than a_j, so a_j replaces them as maximum as long as it is in the window. Then append j at the back. When g moves past the front index, remove the front. **Invariant**: `dmax` holds, in order, the indices k of the window such that a_k is larger than all the values after it in the window; the first one is therefore the maximum. A symmetric deque `dmin` gives the minimum.

**Amortized cost.** Each index enters each deque once and leaves it at most once, and both g and j move forward at most N times: despite the nested loops, the total is O(N). Examining every portion would cost O(N²), that is 5 × 10⁹ for N = 100,000.

The answer can reach N(N + 1)/2 ≈ 5 × 10⁹: `long long` in C++.
