---
title: Disagreements between two judges
---

## Statement
Two judges score the same N candidates. The judges **disagree** on two candidates u and v if the first judge gives a strictly higher score to u than to v, while the second gives a strictly higher score to v than to u (or the reverse). If one of the two judges gives the same score to u and v, it is not a disagreement.

Count the pairs of candidates on which the two judges disagree.

The scores are built by a formula, to keep the input short: x₁ = X, then x_{k+1} = (x_k × B + C) mod M. Candidate i receives score x_{2i−1} from the first judge and score x_{2i} from the second.

For example, with N = 4, X = 2, B = 17, C = 21 and M = 22, the sequence starts with 2, 11, 10, 15, 12, 5, 18, 19: the four candidates have the scores (2, 11), (10, 15), (12, 5) and (18, 19). The judges disagree on candidates 1 and 3, and on candidates 2 and 3: the answer is 2.

## Input
A single line: the five integers N, X, B, C and M.

## Output
The number of pairs of candidates on which the judges disagree.

## Constraints
- 2 ≤ N ≤ 100,000
- 1 ≤ M ≤ 10⁹
- 0 ≤ X, B, C < M

## Hints
1. Order the candidates by the first judge's score. A pair is then a disagreement if the candidate placed first has a **strictly larger** score from the second judge: it is an inversion.
2. Candidates with the same score from the first judge must never count: just order them among themselves by increasing score from the second judge.
3. Inversions are counted in O(N log N) with merge sort: during the merge, each element taken from the right half forms an inversion with each element still in the left half.

## Solution
**Reducing to inversions.** Sort the candidates by the pair (first judge's score, second judge's score), in increasing order, and let r₁, r₂, …, r_N be the second judge's scores in this order. Take two candidates at positions p < q. If their first-judge scores differ, p has the smaller one, and there is a disagreement if and only if r_p > r_q. If they are equal, there is never a disagreement, and indeed r_p ≤ r_q thanks to the second sorting criterion. The answer is therefore the number of **inversions** of the sequence r: the pairs p < q with r_p > r_q.

**Counting inversions.** Adapt merge sort: sort and count the inversions of each half, then merge the two sorted halves. When we take an element from the right half because it is strictly smaller than the current left element, it is smaller than every element left in the left half: it forms an inversion with each of them, and we add their number. On ties, take the left element first, so as not to count equalities. Each inversion between the two halves is counted exactly once, when its right element is placed.

**Cost.** Sorting the pairs and merge sort cost O(N log N), about 2 million operations. Comparing every pair would take N(N − 1)/2 ≈ 5 × 10⁹ comparisons. The answer can exceed 2³¹: `long long` in C++.
