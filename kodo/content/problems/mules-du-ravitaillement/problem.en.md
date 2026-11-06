---
title: The supply mules
---

## Statement
The Aiguilles hut gets its supplies on muleback. This morning, Inès must share N bags among her K mules: bag number i weighs P_i kilos, and each bag must be loaded whole onto a single mule. A mule can carry as many bags as you like, or none at all.

The caravan moves at the pace of the most heavily loaded mule. So Inès wants the load of the most heavily loaded mule to be as small as possible.

Write a program that computes this minimum load.

## Input
- The first line contains two integers N and K.
- The second line contains N integers P_1, P_2, …, P_N.

## Output
A single integer: the smallest possible load for the most heavily loaded mule.

## Constraints
- 1 ≤ N ≤ 12
- 1 ≤ K ≤ 5
- 1 ≤ P_i ≤ 1 000

## Hints
1. Putting each bag on the least loaded mule does not always work: look at the second example. You need to try several distributions. But there are Kᴺ = 5¹² ≈ 244 million of them: you must avoid exploring the useless ones.
2. Write `placer(i)` ("place(i)"), which tries to put bag i on each of the mules, then calls `placer(i + 1)`. Keep the best maximum load found so far, and abandon a branch as soon as a mule reaches this value: it can no longer do better.
3. Two mules carrying the same load are interchangeable: only try one of them. Place the bags from the heaviest to the lightest, and try the least loaded mule first: you quickly find a good distribution, and pruning then cuts almost everything.

## Solution
**The idea: backtracking with pruning ("branch and bound").** We sort the bags from the heaviest to the lightest. The recursive function `placer(i)` tries to load bag i on each mule, calls `placer(i + 1)`, then removes the bag. When all the bags are placed, we have a complete distribution and we update `meilleur` ("best"), the smallest maximum load found so far.

Without care, this means Kᴺ distributions. Three ideas cut the search tree:
- **Cut hopeless branches.** If a mule with load c receives a bag of weight p with `c + p ≥ meilleur`, this branch cannot give a strictly better distribution: we abandon it. By trying the mules from the least loaded to the most loaded, we can even stop the loop (`break`): the following mules are even more loaded.
- **Don't repeat symmetric cases.** Two mules that have the same load at this moment give exactly the same possibilities for the rest: we only try the first one. In particular, this avoids trying every empty mule.
- **Stop as soon as it is perfect.** No distribution can do better than `borne = max(heaviest bag, ⌈total / K⌉)` (*borne* means "bound"). If `meilleur` reaches this bound, we stop the whole search.

Starting with the heavy bags and with the least loaded mule means that the very first distribution found is already good (it is the one of the greedy "least loaded mule" rule). Pruning then becomes very effective.

**Why the greedy rule alone is not enough.** On the second example (bags of 3, 3, 2, 2, 2 and two mules), the greedy rule gives 3 + 2 + 2 = 7 and 3 + 2 = 5, so 7. The best distribution is 3 + 3 = 6 and 2 + 2 + 2 = 6, so 6.

**Complexity.** Exponential in the worst case, but on the tests (N = 12, K = 5), the function `placer` is called fewer than 10 000 times, instead of hundreds of millions.

**Why the naive solution is too slow.** Trying the Kᴺ distributions without pruning means 5¹² ≈ 2.4 × 10⁸ complete distributions, each with a maximum to compute: several minutes in Python, and about a second even in C++.

**Traps.**
- Restore the load of the mule after the recursive call (`charges[j] -= sacs[i]`, i.e. "loads" and "bags").
- Pruning uses `≥` and not `>`: a distribution that equals `meilleur` does not improve it.
- There may be more mules than bags: some mules stay empty, and the answer is then the heaviest bag.
