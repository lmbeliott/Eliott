---
title: Rotation with the fewest inversions
---

## Statement
An **inversion** of a sequence a₁, …, a_N is a pair of positions i < j such that aᵢ > a_j. A **rotation** moves the first element of the sequence to the end: `3 1 2` becomes `1 2 3`, then `2 3 1`. Applying 0, 1, …, N − 1 rotations gives N sequences, not necessarily different.

Print the smallest number of inversions among these N sequences.

The sequence is built by a formula, to keep the input short: a₁ = X, then a_{i+1} = (aᵢ × B + C) mod M. For example, with N = 4, X = 3, B = 1, C = 1 and M = 4, the sequence is `3 0 1 2`, which has 3 inversions; after one rotation, `0 1 2 3` has none: the answer is 0.

## Input
A single line: the five integers N, X, B, C and M.

## Output
The smallest number of inversions of a rotation of the sequence.

## Constraints
- 1 ≤ N ≤ 100,000
- 1 ≤ M ≤ 10⁹
- 0 ≤ X, B, C < M

## Hints
1. Count the inversions of the initial sequence with merge sort.
2. When the first element x moves to the end, only the pairs containing x change. Before, x formed an inversion with each strictly smaller element; after, with each strictly larger element.
3. These two numbers depend only on x and on the set of values: a binary search in the sorted sequence gives them.

## Solution
**Starting point.** Count the inversions I₀ of the initial sequence with merge sort, in O(N log N), as in the lesson.

**Effect of a rotation.** Let x be the first element of the current sequence, and let p(x) be the number of elements of the sequence strictly smaller than x and g(x) the number of strictly larger ones. Pairs not containing x keep the same order, hence the same status. Before the rotation, x is in front: it forms an inversion with each element smaller than it, that is p(x) inversions. After, x is in last position: it forms an inversion with each larger element, that is g(x). The number of inversions therefore becomes I − p(x) + g(x).

**Fast computation.** p(x) and g(x) depend only on x and on the values of the sequence, which do not change. With the sorted sequence s, p(x) = `bisect_left(s, x)` and g(x) = N − `bisect_right(s, x)` (`lower_bound` and `upper_bound` in C++). Apply the formula for x = a₁, then a₂, …, a_{N−1}, and keep the minimum of all the values obtained, I₀ included.

**Cost.** O(N log N) for merge sort, then N binary searches. Recounting the inversions of each rotation, even with merge sort, would cost O(N² log N). In C++, the number of inversions can reach 5 × 10⁹: `long long`.
