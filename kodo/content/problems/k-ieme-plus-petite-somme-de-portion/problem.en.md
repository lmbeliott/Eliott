---
title: K-th smallest segment sum
---

## Statement
You are given a list of N positive integers A_1, A_2, …, A_N. A **segment** is a run of consecutive cells of the list, with at least one cell: there are N × (N + 1) / 2 of them.

We compute the sum of every segment, then sort all these sums in increasing order, keeping repeated values. Write a program that prints the K-th sum in this order.

## Input
- The first line contains two integers N and K.
- The second line contains N integers A_1, A_2, …, A_N.

## Output
A single integer: the K-th smallest segment sum.

## Constraints
- 1 ≤ N ≤ 30,000
- 1 ≤ K ≤ N × (N + 1) / 2
- 1 ≤ A_i ≤ 10,000

## Hints
1. There are up to 4.5 × 10⁸ segments: you cannot compute every sum and then sort them. Turn the question around: for a given value S, how many segments have a sum less than or equal to S?
2. This number can be computed in O(N) with two pointers, because the values are positive: for each segment end, the valid starts form an interval that ends at that end, and its first start never moves back.
3. The answer is the smallest value S for which at least K segments have a sum ≤ S. Find it with a binary search between `0` (no segment) and the sum of the whole list (every segment).

## Solution
**The idea: binary search for the answer, and count with two pointers.** Let `f(S)` be the number of segments whose sum is less than or equal to S. The larger S is, the larger `f(S)` is. The K-th smallest sum is exactly the smallest value S such that `f(S) ≥ K`: below it there are fewer than K sums, and from it on, at least K.

We find this threshold with a binary search: `trop_petit = 0` (*too small*: no segment has sum zero, since the values are positive) and `suffisant = A_1 + … + A_N` (*enough*: every segment has at most this sum). We test the middle and move the matching bound.

**Computing f(S) in O(N).** We move `fin` (*end*) from left to right, keeping a window `debut..fin` (*debut* means "start") and its sum. After adding `A[fin]`, as long as the sum is greater than S, we remove `A[debut]` and move `debut` forward. Then every segment that ends at `fin` and starts between `debut` and `fin` has a sum ≤ S (a shorter segment has a smaller sum, since the values are positive), and those that start before `debut` have a sum > S. So we add `fin − debut + 1` to the count. Since `debut` never moves back, the computation takes O(N) steps in total.

In the first example (3 1 4 2, K = 4), the 10 sorted sums are 1, 2, 3, 4, 4, 5, 6, 7, 8, 10: f(3) = 3 < 4 and f(4) = 5 ≥ 4, so the answer is 4.

**Complexity.** The binary search takes about log₂(3 × 10⁸) ≈ 29 rounds, each in O(N): O(N log(sum)), about 10⁶ operations.

**Why the naive solution is too slow.** Computing and sorting the N × (N + 1) / 2 ≈ 4.5 × 10⁸ sums takes billions of operations and several gigabytes of memory, even in C++. Extracting the sums one by one in order (with a priority queue) costs at least K operations, and K can be 4.5 × 10⁸.

**Traps.**
- K and the number of segments go beyond 2³¹: use `long long` in C++ for K, for the count `f(S)` and for the sums.
- The condition is `f(S) ≥ K`, not `f(S) == K`: when several segments have the same sum, `f` jumps over several values at once and may never be exactly K.
- The answer is always the sum of a real segment: it is the smallest S such that `f(S) ≥ K`, and `f` only increases at values that are segment sums.
