---
title: Longest portion with average at least M
---

## Statement
A weather station recorded N integer temperatures a₁, …, a_N. For a threshold M, we look for the longest period of consecutive days whose average temperature is at least M.

Answer for Q different thresholds.

## Input
The first line contains N and Q. The second line contains the N temperatures. The third line contains the Q thresholds.

## Output
Q lines: for each threshold, the length of the longest period with average at least M, or `0` if there is none.

## Constraints
- 1 ≤ N ≤ 30,000
- 1 ≤ Q ≤ 5
- 0 ≤ aᵢ ≤ 1,000 and 0 ≤ M ≤ 1,000

## Hints
1. An average is not convenient: the period from i to j has an average of at least M if and only if the sum of the (a_k − M) for k from i to j is non-negative. Replace each temperature with b_k = a_k − M.
2. With the prefix sums P₀ = 0 and P_k = b₁ + … + b_k, the period from i + 1 to j works if and only if P_i ≤ P_j. So we look for the largest difference j − i with i < j and P_i ≤ P_j.
3. Compute L[i] = min(P₀, …, P_i) and R[j] = max(P_j, …, P_N). Both sequences are non-increasing, and they can be scanned with two indices that only move forward.

## Solution
**Reducing to sums.** The average of a_{i+1}, …, a_j is at least M if and only if a_{i+1} + … + a_j ≥ M × (j − i), that is if the sum of the b_k = a_k − M over the period is non-negative. With the prefix sums P_k = b₁ + … + b_k (and P₀ = 0), this sum is P_j − P_i. We look for the largest value of j − i, with 0 ≤ i < j ≤ N and P_i ≤ P_j. Everything is done with integers, without decimals.

**Two arrays and two indices.** Compute L[i] = min(P₀, …, P_i) and R[j] = max(P_j, …, P_N). Start from i = 0 and j = 0, and while i ≤ N and j ≤ N: if L[i] ≤ R[j], record j − i and move j forward; otherwise move i forward. The answer is the largest recorded value (0 at the start).

**Correctness.** Every recorded value is achievable: if L[i] ≤ R[j] with j > i, there are i' ≤ i and j' ≥ j with P_{i'} ≤ P_{j'}, hence a period of length j' − i' ≥ j − i. Conversely, let (i*, j*) be a best pair. As long as j ≤ j*, the index i cannot pass i*: when i = i*, we have L[i*] ≤ P_{i*} ≤ P_{j*} ≤ R[j], so j is the one that moves. Since the loop only stops when one of the indices exceeds N, j eventually goes from j* to j* + 1, which only happens when the condition holds: we then record j* − i, with i ≤ i*, which is at least the optimal length.

**Cost.** For each threshold, three passes over the list and at most 2N + 2 loop iterations: O(N) per threshold, O(QN) in total. Trying every period with prefix sums would cost O(N²) per threshold, 4.5 × 10⁸ operations: too slow, especially in Python.
