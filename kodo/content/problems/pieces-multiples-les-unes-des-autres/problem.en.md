---
title: Coins that are multiples of each other
---

## Statement
A country uses K kinds of coins, with values c₁ = 1 < c₂ < … < c_K, and each value **divides the next one**: for example 1, 5, 10, 50, 100, or 1, 2, 4, 8, 16. There are as many coins of each kind as needed.

Answer Q questions: for an amount S, print the smallest number of coins whose values add up to exactly S.

## Input
The first line contains K. The second line contains the K values c₁, …, c_K. The third line contains Q, and each of the next Q lines contains an amount S.

## Output
Q lines: for each amount, the smallest number of coins.

## Constraints
- 1 ≤ K ≤ 60
- c₁ = 1, c_K ≤ 10¹⁸, and c_i divides c_{i+1}
- 1 ≤ Q ≤ 1,000
- 0 ≤ S ≤ 10¹⁸

## Hints
1. The greedy algorithm takes as many coins as possible of the largest value, then continues with the rest. For S = 10¹⁸, do not remove the coins one by one: a division gives their number at once.
2. Why is greedy optimal here? In an optimal solution, how many coins of value c_i (i < K) can there be at most?
3. If a solution contains at least c_{i+1} / c_i coins of value c_i, they can be replaced by a single coin of value c_{i+1}.

## Solution
**The greedy algorithm.** Go through the values from the largest to the smallest; for value c, take ⌊S / c⌋ coins and replace S by S mod c. Since c₁ = 1, the rest ends at 0. You need a division, not a loop removing the coins one by one: with only the coin of 1, that would be 10¹⁸ turns.

**Why it is optimal.** Take an optimal solution, with x_i coins of value c_i. For i < K, x_i < c_{i+1} / c_i: otherwise we would replace c_{i+1} / c_i coins of value c_i (worth c_{i+1} in total) by a single coin of value c_{i+1}, and since c_{i+1} / c_i ≥ 2, we would save at least one coin. Then the coins of value less than c_j are worth at most (c₂ − c₁) + (c₃ − c₂) + … + (c_j − c_{j−1}) = c_j − 1 < c_j in total, since x_i × c_i ≤ (c_{i+1} / c_i − 1) × c_i = c_{i+1} − c_i. With j = K: S = x_K × c_K + (rest < c_K), so x_K = ⌊S / c_K⌋, exactly the greedy choice. Start again with the rest and the smaller values: the optimal solution **is** the greedy one.

**Cost.** K divisions per question. A method computing the best number of coins for every amount from 0 to S would be impossible for S = 10¹⁸.
