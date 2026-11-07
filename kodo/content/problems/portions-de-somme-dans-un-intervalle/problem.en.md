---
title: Portions with sum in an interval
---

## Statement
We are given a sequence of N integers a₁, …, a_N, positive or negative, and two integers L ≤ R. A **portion** is a sequence of consecutive cells aᵢ, …, a_j with i ≤ j.

Count the portions whose sum lies between L and R (inclusive).

The sequence is built by a formula, to keep the input short: u₁ = X, then u_{k+1} = (u_k × B + C) mod M, and a_k = u_k − D. For example, with N = 4, X = 1, B = 3, C = 2, M = 7 and D = 3, the u_k are 1, 5, 3, 4 and the sequence is −2, 2, 0, 1.

## Input
The first line contains N, L and R. The second line contains X, B, C, M and D.

## Output
The number of portions whose sum is between L and R.

## Constraints
- 1 ≤ N ≤ 100,000
- 1 ≤ M ≤ 10⁹; 0 ≤ X, B, C < M; 0 ≤ D ≤ M
- −10¹⁴ ≤ L ≤ R ≤ 10¹⁴

## Hints
1. With the prefix sums P₀ = 0 and P_k = a₁ + … + a_k, the portion from i + 1 to j has sum P_j − P_i. Count the pairs i < j such that L ≤ P_j − P_i ≤ R.
2. Values can be negative: the sliding window does not work. Split the sequence P into two halves, and count the pairs inside each half recursively.
3. For the pairs across, you can assume both halves are sorted. When P_i grows on the left, the valid P_j on the right form a block [P_i + L, P_i + R] that moves right: two advancing indices are enough.

## Solution
**Prefix sums.** With P₀ = 0 and P_k = a₁ + … + a_k, the portion from i + 1 to j (0 ≤ i < j ≤ N) has sum P_j − P_i. So we count the pairs of indices i < j of the sequence P₀, …, P_N such that L ≤ P_j − P_i ≤ R. Since values can be negative, P is not increasing, and the two pointers of level 3 do not apply directly.

**Divide and conquer.** Split P into two halves. Pairs whose two indices lie in the same half are counted recursively. For a pair across, i is on the left and j on the right, and the condition i < j is automatic: only the values matter. So we can assume each half is **sorted** (the recursion returns the sorted half, like merge sort). For each value v of the left half, in increasing order, the valid values w of the right half are those in [v + L, v + R]: they form a block of the sorted right half, from index `bas` (first w ≥ v + L) to index `haut` (first w > v + R) excluded. When v grows, both bounds grow, so `bas` and `haut` never move back: advance them, and add `haut − bas`. This count costs O(length); then merge the two halves.

**Cost.** Each recursion level does linear work, over about log₂ N levels: O(N log N). Trying every portion would cost N²/2 = 5 × 10⁹ operations. The sums reach 5 × 10¹³ in absolute value, and the answer 5 × 10⁹: `long long` in C++.
