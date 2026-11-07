---
title: Sum of the minimums of the portions
---

## Statement
A sequence of N integers a₀, a₁, …, a_{N−1} is built by a formula, so that the input stays short: a₀ = X, then a_{i+1} = (aᵢ × B + C) mod M.

A **portion** is a run of consecutive elements aᵢ, a_{i+1}, …, aⱼ with i ≤ j; there are N(N + 1)/2 of them. Compute the sum of the minimums of all portions.

For example, for the sequence 3, 1, 2, the portions are [3], [1], [2], [3, 1], [1, 2] and [3, 1, 2], with minimums 3, 1, 2, 1, 1 and 1: the sum is 9.

## Input
The first line contains N. The second line contains X, B, C and M.

## Output
The sum of the minimums of all portions.

## Constraints
- 1 ≤ N ≤ 100,000
- 1 ≤ M ≤ 10⁶ and 0 ≤ X, B, C < M

## Hints
1. Going through every portion while keeping the minimum up to date costs O(N²), that is 5 × 10⁹ operations: too slow. You need to change your point of view.
2. For each position i, count the portions whose minimum is aᵢ. If the portion must stay between two positions g < i < d, there are (i − g) × (d − i) portions containing i.
3. To avoid counting twice a portion whose minimum appears several times, assign it to the rightmost minimum… or the leftmost, but always the same one. The positions g and d can all be found with a stack.

## Solution
**Counting contributions.** Assign each portion to **one** of its minimums: the rightmost. Position i receives the portions [l, r] with l ≤ i ≤ r such that all the elements of the portion are ≥ aᵢ, and those to the right of i are even > aᵢ. Let g be the last position before i with a value < aᵢ (or −1), and d the first position after i with a value ≤ aᵢ (or N). Then l can take the i − g values from g + 1 to i, and r the d − i values from i to d − 1, independently. The answer is the sum of the aᵢ × (i − g) × (d − i). Each portion is counted exactly once, since it has exactly one rightmost minimum.

**Finding g and d with a stack.** Go through the sequence from left to right, keeping a stack of indices whose values strictly increase. When i arrives, while the top j satisfies a_j ≥ aᵢ, pop it: i is the first position after j with a value ≤ a_j, so d = i for j; and the element below j in the stack is the last position before j with a value < a_j, so it is g for j (or −1 if the stack becomes empty). Add the contribution of j, then push i. At the end, the remaining elements have d = N.

**Amortized cost.** One step can pop many elements, but each index is pushed once and popped at most once: in total, at most 2N stack operations. The algorithm is O(N), against O(N²) for the direct method.

**Size.** The answer can reach about 5 × 10⁹ × 10⁶: `long long` in C++.
