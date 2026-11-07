---
title: Smallest counterexample to greedy change
---

## Statement
A coin system is made of K values 1 = c₁ < c₂ < … < c_K, and there are as many coins of each value as needed. To form an amount S, the **greedy** algorithm takes the largest coin not exceeding what remains to be formed, and starts again until 0. With the coins 1, 3 and 4, it forms 6 = 4 + 1 + 1 with three coins, whereas 3 + 3 uses only two.

Print the smallest amount S for which greedy does **not** use the smallest possible number of coins, or `0` if greedy is optimal for every amount.

We admit the following result: if there is an amount for which greedy is not optimal, the smallest of these amounts is strictly less than c_{K−1} + c_K.

## Input
The first line contains K. The second line contains the K values c₁, …, c_K, in increasing order.

## Output
The smallest amount for which greedy is not optimal, or `0`.

## Constraints
- 1 ≤ K ≤ 15
- 1 = c₁ < c₂ < … < c_K ≤ 30,000

## Hints
1. For an amount s, greedy takes the largest coin c ≤ s, then handles s − c the same way: its number of coins is 1 + greedy(s − c). Compute it for every amount in increasing order.
2. The true minimum is also computed in increasing order: the last coin added has some value c ≤ s, and the rest s − c is formed in the best way. So opt(s) = 1 + min(opt(s − c)) over the coins c ≤ s.
3. Thanks to the admitted result, it is enough to examine the amounts from 1 to c_{K−1} + c_K − 1.

## Solution
**Two arrays.** For each amount s, from 1 to c_{K−1} + c_K − 1, compute two numbers. The number of coins of greedy: g(s) = 1 + g(s − c), where c is the largest coin at most s (greedy takes c, then continues on s − c the same way). The minimum number of coins: opt(s) = 1 + min(opt(s − c)) over all coins c ≤ s. This formula is correct by induction: an optimal solution for s contains at least one coin c; without it, what remains is a solution for s − c, which uses at least opt(s − c) coins; conversely, adding c to an optimal solution for s − c gives a solution for s. Since c₁ = 1, every amount can be formed.

**The answer.** The first s such that g(s) > opt(s) is the answer. If no amount below c_{K−1} + c_K works, the admitted result guarantees that greedy is always optimal, and we print 0. For K ≤ 2, there is never a counterexample anyway.

**Lessons.** Real systems (1, 2, 5, 10, 20, 50…) are optimal for greedy, which explains why change is given this way. But a greedy algorithm is never right "obviously": three coins, such as 1, 3, 4, are enough for it to fail. It is by comparing with an exact computation on small amounts that the counterexample is found.

**Cost.** At most 60,000 amounts, each in O(K): about 10⁶ operations.
