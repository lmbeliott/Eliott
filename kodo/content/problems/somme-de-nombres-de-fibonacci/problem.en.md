---
title: Sum of Fibonacci numbers
---

## Statement
Here we call **Fibonacci numbers** the numbers 1, 2, 3, 5, 8, 13, 21, …: the first two are 1 and 2, and each of the following is the sum of the two previous ones.

Every integer N ≥ 1 can be written as a sum of Fibonacci numbers, possibly using the same one several times: for example 10 = 8 + 2 = 5 + 5 = 3 + 3 + 2 + 2. Answer T questions: for a given N, print the smallest number of terms of such a sum.

## Input
The first line contains T. Each of the next T lines contains an integer N.

## Output
T lines: for each question, the smallest number of terms.

## Constraints
- 1 ≤ T ≤ 1,000
- 1 ≤ N ≤ 10¹⁸

## Hints
1. Try greedy: take the largest Fibonacci number at most N, then start again with the rest. There are fewer than 90 Fibonacci numbers up to 10¹⁸.
2. To justify greedy, transform an optimal solution: two consecutive terms F_k + F_{k+1} can be replaced by F_{k+2} (one term less), and two equal terms 2 F_k by F_{k+1} + F_{k−2}.
3. A sum of distinct, pairwise non-consecutive Fibonacci numbers whose largest is F_m is strictly less than F_{m+1}.

## Solution
**Greedy.** Compute the Fibonacci numbers up to 10¹⁸ (there are 86 of them), then take the largest one not exceeding N, subtract it, and start again until 0. Count the terms.

**A "clean" optimal solution.** Let F₁ = 1, F₂ = 2, F₃ = 3, … Among the optimal solutions, take one whose sum of **squares** of the terms is the largest. It does not contain two consecutive terms F_k and F_{k+1}: we would replace them by F_{k+2}, with one term less. It does not contain the same term twice: 1 + 1 = 2 would save a term; 2 + 2 = 3 + 1 keeps the same number of terms but increases the sum of squares (from 8 to 10); and for k ≥ 3, 2 F_k = F_k + F_{k−1} + F_{k−2} = F_{k+1} + F_{k−2}, with F_{k+1}² + F_{k−2}² − 2 F_k² = F_{k−1} × (F_{k+1} − F_{k−2}) > 0. In every case, this contradicts the choice of the solution.

**It coincides with greedy.** A sum of distinct, non-consecutive terms whose largest is F_m is at most F_m + F_{m−2} + F_{m−4} + …, and this sum is strictly less than F_{m+1} (induction: F_m + (something < F_{m−1}) < F_m + F_{m−1} = F_{m+1}). So the largest term of our optimal solution satisfies F_m ≤ N < F_{m+1}: it is the greedy choice. Remove this term; the rest is a solution of the same kind for N − F_m, and repeat. Greedy therefore uses exactly the minimum number of terms.

**Cost.** At most 86 terms and 86 comparisons per question. Computing the best number of terms for every amount up to N would be impossible for N = 10¹⁸.
