---
title: The little Lac Noir cable car
---

## Statement
The little cable car that goes up to the Lac Noir hut has tiny cabins: a cabin carries **one or two people**, and the total weight of its passengers (bags included) must not exceed C kilos.

This morning, N hikers are waiting at the bottom station. Hiker number i weighs P_i kilos with their bag, and nobody weighs more than C kilos.

Write a program that computes the minimum number of cabins needed to take everyone up.

## Input
- The first line contains two integers N and C.
- The second line contains N integers P_1, P_2, …, P_N.

## Output
A single integer: the minimum number of cabins.

## Constraints
- 1 ≤ N ≤ 30 000
- 1 ≤ P_i ≤ C ≤ 400

## Hints
1. Sort the weights. Look at the heaviest hiker: who is the most likely to be able to share a cabin with them?
2. If the heaviest hiker cannot ride with the lightest one, they cannot ride with anyone: they go alone. Otherwise, put them together.
3. Keep two indices in the sorted list: `leger` ("light") at the beginning and `lourd` ("heavy") at the end. For each cabin, `lourd` moves back; `leger` moves forward only if the two of them fit together.

## Solution
**The greedy idea.** We sort the weights. Each cabin takes the heaviest of the remaining hikers, together with the lightest of the remaining hikers if their two weights fit within the limit C. With two indices `leger` (beginning of the list) and `lourd` (end of the list), we move one or the other depending on the case.

**Why it is optimal (exchange argument).** Let h be the heaviest hiker and l the lightest.
- If `P_h + P_l > C`, then h cannot ride with anyone, since all the others weigh at least P_l. In **every** solution, h is alone: the greedy algorithm does the same.
- If `P_h + P_l ≤ C`, take any optimal solution. If h travels alone in it, we can put l in with them (l leaves their cabin, which stays valid): we don't use more cabins. If h travels with another hiker x, and l with y (or alone), we swap x and l: h's cabin becomes {h, l}, which fits by assumption, and the cabin {x, y} fits too because `P_x + P_y ≤ P_x + P_h ≤ C` (h is the heaviest). The number of cabins does not change.

So there is always an optimal solution that starts like the greedy one. We then repeat the same reasoning with the remaining hikers.

**Complexity.** Sorting costs O(N log N), then the two indices go through the list only once: O(N log N) in total.

**Why the naive solution is too slow.** Trying every way of forming pairs is exponential. Even the greedy version that, for each hiker, looks for a partner by scanning the whole list costs O(N²), about 10⁹ operations for N = 30 000.

**Traps.**
- Pairing neighbouring hikers after sorting does not work: with C = 100 and the weights 10, 20, 80, 90, you would make (10, 20), then 80 and 90 alone, so 3 cabins, while (10, 90) and (20, 80) only use 2.
- When `leger == lourd`, only one person is left: they go alone. Don't count them twice.
