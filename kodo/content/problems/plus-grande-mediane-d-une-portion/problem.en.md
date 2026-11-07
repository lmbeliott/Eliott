---
title: Largest median of a portion
---

## Statement
We are given a sequence of N integers a₁, …, a_N and an integer K. A **portion** is a sequence of consecutive cells. The **median** of a portion of length L is the value at position ⌊(L + 1) / 2⌋ when the portion is sorted in increasing order (positions start at 1). For example, the median of `4 1 5` is 4, and the median of `5 1 4 2` is 2.

Print the largest possible median of a portion of length **at least K**.

## Input
The first line contains N and K. The second line contains the N integers a₁, …, a_N.

## Output
The largest median of a portion of length at least K.

## Constraints
- 1 ≤ K ≤ N ≤ 20,000
- 1 ≤ aᵢ ≤ 100,000

## Hints
1. Ask a simpler question: for a given value x, is there a portion of length at least K whose median is **at least x**? If yes for x, then yes for every smaller value: binary search on x.
2. The median of a portion is at least x if and only if the portion contains strictly more values ≥ x than values < x. Replace each value by +1 if it is ≥ x, by −1 otherwise: you need a portion with sum at least 1.
3. With the prefix sums P₀, …, P_N of these ±1, the portion from i + 1 to j has sum P_j − P_i. For each j ≥ K, it is enough to know the minimum of P₀, …, P_{j−K}, which is updated while moving forward.

## Solution
**A monotone property.** Let ok(x) be "there is a portion of length at least K with median at least x". If ok(x) holds and y ≤ x, ok(y) holds, with the same portion. The answer is therefore the largest value x such that ok(x); it belongs to the sequence (it is a median), so we binary search over the sorted list of distinct values, with the invariant "ok(v[lo]) is true, ok(v[hi]) is false" (hi starts just past the end of the list, and ok(smallest value) is true).

**Median and counting.** In a portion of length L, let c be the number of values ≥ x and d the number of values < x. The median, at position p = ⌊(L + 1) / 2⌋ of the sorted portion, is at least x if and only if the values < x, which come first, take fewer than p places: d ≤ p − 1. If L = 2t, this means d ≤ t − 1, that is c ≥ t + 1 > d; if L = 2t + 1, this means d ≤ t, that is c ≥ t + 1 > d. In both cases: median ≥ x if and only if c − d ≥ 1.

**Testing x in O(N).** Replace aᵢ by bᵢ = +1 if aᵢ ≥ x and −1 otherwise, and compute the prefix sums P₀ = 0, P_j = b₁ + … + b_j. The portion from i + 1 to j (length j − i ≥ K) has sum P_j − P_i. One with sum at least 1 exists if and only if, for some j ≥ K, P_j − min(P₀, …, P_{j−K}) ≥ 1. We go through j from K to N while updating this minimum: a single pass.

**Cost.** Sorting costs O(N log N), then the binary search makes about log₂ N ≈ 15 tests in O(N): O(N log N). Computing the median of every portion would mean N²/2 = 2 × 10⁸ portions, each to be sorted: far too much.
