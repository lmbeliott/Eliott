---
title: Counting triangles
---

## Statement
There are N sticks with integer lengths. Three sticks of lengths x ≤ y ≤ z can form a real (non-flat) triangle if and only if x + y > z.

Count the ways to choose three sticks (three different positions) that can form a triangle.

## Input
The first line contains N. The second line contains the N lengths.

## Output
The number of triples of sticks that form a triangle.

## Constraints
- 1 ≤ N ≤ 2,500
- 1 ≤ length ≤ 10⁹

## Hints
1. Trying every triple costs about N³/6 ≈ 2.6 × 10⁹ operations: too many, even in C++. Sorting the lengths simplifies the condition: in a sorted triple, only the inequality x + y > z matters.
2. Fix the largest stick z = a[k]. What remains is to count the pairs i < j < k such that a[i] + a[j] > a[k]: a pair problem in a sorted list.
3. With two indices i (on the left) and j = k − 1 (on the right): if a[i] + a[j] > a[k], then every i' between i and j − 1 also works with j.

## Solution
**Why a single inequality.** A triangle with sides x, y, z exists (non-flat) if each side is strictly smaller than the sum of the other two. If x ≤ y ≤ z, the inequalities y < x + z and x < y + z are automatic, and only z < x + y remains.

**Algorithm.** Sort the lengths: a[0] ≤ a[1] ≤ … ≤ a[N−1]. Each triple of positions is counted once, by its indices in sorted order i < j < k. For each k, count the pairs i < j < k with a[i] + a[j] > a[k], using two indices: i = 0 and j = k − 1. While i < j:

- if a[i] + a[j] > a[k], then for every i' from i to j − 1, a[i'] + a[j] ≥ a[i] + a[j] > a[k]: count j − i pairs at once, and decrease j;
- otherwise, for every j' from i + 1 to j, a[i] + a[j'] ≤ a[i] + a[j] ≤ a[k]: a[i] forms a triangle with no remaining element, and i increases.

**Invariant.** All the valid pairs that are not entirely inside [i, j] have been counted exactly once. When i = j, no pair is left: the count for this k is complete.

**Cost.** Sorting costs O(N log N). For each k, each iteration brings i and j closer, so at most k iterations: O(N²) in total, about 3 × 10⁶ iterations for N = 2,500, against 2.6 × 10⁹ triples for the direct method. The sums a[i] + a[j] reach 2 × 10⁹, beyond an `int`, and the number of triangles can exceed 2.6 × 10⁹: use `long long` in C++ for the sums and the total.
