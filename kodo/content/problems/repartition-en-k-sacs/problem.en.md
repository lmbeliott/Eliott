---
title: Splitting into K bags
---

## Statement
You must share N items among K bags: item number i weighs P_i kilos, and each item goes whole into a single bag. A bag can hold as many items as you like, or none at all.

Write a program that computes the smallest possible weight for the heaviest bag.

## Input
- The first line contains two integers N and K.
- The second line contains N integers P_1, P_2, …, P_N.

## Output
A single integer: the smallest possible weight for the heaviest bag.

## Constraints
- 1 ≤ N ≤ 12
- 1 ≤ K ≤ 5
- 1 ≤ P_i ≤ 1 000

## Hints
1. Putting each item into the least loaded bag does not always work: look at the second example. You need to try several distributions. But there are Kᴺ = 5¹² ≈ 244 million of them: you must avoid exploring the useless ones.
2. Write `placer(i)` ("place(i)"), which tries to put item i into each of the bags, then calls `placer(i + 1)`. Keep the best maximum load found so far, and abandon a branch as soon as a bag reaches this value: it can no longer do better.
3. Two bags with the same load are interchangeable: only try one of them. Place the items from the heaviest to the lightest, and try the least loaded bag first: you quickly find a good distribution, and pruning then cuts almost everything.

## Solution
**The idea: backtracking with pruning ("branch and bound").** We sort the items from the heaviest to the lightest. The recursive function `placer(i)` tries to put item i into each bag, calls `placer(i + 1)`, then removes the item. When all the items are placed, we have a complete distribution and we update `meilleur` ("best"), the smallest maximum load found so far.

Without care, this means Kᴺ distributions. Three ideas cut the search tree:
- **Cut hopeless branches.** If a bag with load c receives an item of weight p with `c + p ≥ meilleur`, this branch cannot give a strictly better distribution: we abandon it. By trying the bags from the least loaded to the most loaded, we can even stop the loop (`break`): the following bags are even more loaded.
- **Don't repeat symmetric cases.** Two bags that have the same load at this moment give exactly the same possibilities for the rest: we only try the first one. In particular, this avoids trying every empty bag.
- **Stop as soon as it is perfect.** No distribution can do better than `borne = max(heaviest item, ⌈total / K⌉)` (*borne* means "bound"). If `meilleur` reaches this bound, we stop the whole search.

Starting with the heavy items and with the least loaded bag means that the very first distribution found is already good (it is the one of the greedy "least loaded bag" rule). Pruning then becomes very effective.

**Why the greedy rule alone is not enough.** On the second example (items of 3, 3, 2, 2, 2 and two bags), the greedy rule gives 3 + 2 + 2 = 7 and 3 + 2 = 5, so 7. The best distribution is 3 + 3 = 6 and 2 + 2 + 2 = 6, so 6.

**Complexity.** Exponential in the worst case, but on the tests (N = 12, K = 5), the function `placer` is called fewer than 10 000 times, instead of hundreds of millions.

**Why the naive solution is too slow.** Trying the Kᴺ distributions without pruning means 5¹² ≈ 2.4 × 10⁸ complete distributions, each with a maximum to compute: several minutes in Python, and about a second even in C++.

**Traps.**
- Restore the load of the bag after the recursive call (`charges[j] -= objets[i]`, i.e. "loads" and "items").
- Pruning uses `≥` and not `>`: a distribution that equals `meilleur` does not improve it.
- There may be more bags than items: some bags stay empty, and the answer is then the heaviest item.
