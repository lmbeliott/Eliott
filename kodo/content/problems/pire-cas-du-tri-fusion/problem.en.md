---
title: Worst case of merge sort
---

## Statement
Merge sort sorts a list of n elements as follows: if n ≥ 2, it splits the list into a first part of ⌊n/2⌋ elements and a second part of ⌈n/2⌉ elements, sorts each part the same way, then merges them. The merge compares the first remaining elements of the two lists and places the smaller one; as soon as one list is empty, it copies the other without comparisons. Merging two lists of lengths a and b therefore takes at most a + b − 1 comparisons.

Let C(n) be the largest number of comparisons merge sort makes on a list of n distinct numbers. We admit that the worst cases of the two halves and of the merge can be reached at the same time, so that C(1) = 0 and, for n ≥ 2:

C(n) = C(⌊n/2⌋) + C(⌈n/2⌉) + n − 1

For example, C(2) = 1, C(3) = 3 and C(4) = 5. Answer T questions: for a given n, print C(n).

## Input
The first line contains T. Each of the next T lines contains an integer n.

## Output
T lines: for each question, the value of C(n).

## Constraints
- 1 ≤ T ≤ 1,000
- 1 ≤ n ≤ 10¹⁷

## Hints
1. Translating the formula directly into a recursive function is correct, but it makes about 2n calls: far too many for n = 10¹⁷.
2. The two numbers ⌊n/2⌋ and ⌈n/2⌉ differ by at most 1. One level further down, they still give only two consecutive values: how many different values does the recursion meet in total?
3. Store the values already computed in a dictionary, as for Fibonacci.

## Solution
**Few different subproblems.** At level k of the recursion, every argument is ⌊n/2^k⌋ or ⌊n/2^k⌋ + 1. Indeed, this holds at level 0, and if m is q or q + 1, then ⌊m/2⌋ and ⌈m/2⌉ are ⌊q/2⌋ or ⌊q/2⌋ + 1 (check it according to the parity of q). There are about log₂ n ≈ 57 levels, hence at most 2 × 57 different values, whereas the call tree has about 2n nodes: the same values are recomputed a gigantic number of times.

**Memoization.** Keep a dictionary of the values already computed, and have the function look it up before computing. Each value is computed only once: about a hundred calls per question, and a recursion depth of about 57, which is safe.

**Going further.** One can prove by induction the formula C(n) = n × k − 2^k + 1, where k = ⌈log₂ n⌉ is the smallest integer such that 2^k ≥ n. It is a very good test of the solution. In C++, C(n) reaches 5.6 × 10¹⁸ for n = 10¹⁷: a `long long` is enough, just barely.
