---
title: Merging in groups of K
---

## Statement
There are N piles of tokens: pile number i holds S_i tokens. In one operation, you choose **between 2 and K piles** and put them together into a single pile. This operation costs the number of tokens in the new pile.

Write a program that computes the minimal total cost to put all the tokens into a single pile.

## Input
- The first line contains two integers N and K.
- The second line contains N integers S_1, S_2, …, S_N.

## Output
A single integer: the minimal total cost. If N is `1`, there is nothing to do and the cost is `0`.

## Constraints
- 1 ≤ N ≤ 25,000
- 2 ≤ K ≤ 30,000
- 1 ≤ S_i ≤ 10,000

## Hints
1. A token is paid for once for every merge that involves its pile. Small piles can be merged often, large piles should be merged as rarely as possible. With K = 2, always merging the two smallest piles is optimal.
2. With any K, always merging the K smallest piles is not always optimal: look at the first example. The problem comes from the **last** merge, which may take fewer than K piles, although it is the one that touches every token.
3. A merge of K piles removes K − 1 piles. Add empty piles (0 tokens) until (number of piles − 1) is a multiple of K − 1: they cost nothing. Then always merge the K smallest piles, using a heap (`heapq` or `priority_queue`).

## Solution
**Seeing the merges as a tree.** Each merge puts piles together into a new pile: we get a tree whose leaves are the starting piles and whose nodes each have between 2 and K children. A token is paid for once per merge above its leaf, so the total cost is the sum of `S_i × depth(i)`. We want the large piles near the top of the tree, and the small ones at the very bottom.

**The greedy idea: the smallest together, as low as possible.** For K = 2, this is Huffman coding: we always merge the two smallest piles. For any K, the ideal tree has full nodes, with exactly K children, so that as few tokens as possible are paid for often. Each merge of K piles removes K − 1 piles: all merges can be full only if `N − 1` is a multiple of `K − 1`.

Otherwise, at least one merge will take fewer than K piles. It is better for it to be the very first one, the one that joins the smallest piles, at the bottom of the tree: a "gap" at the top of the tree makes many tokens pay for one more merge. The simplest trick: add empty piles (0 tokens) until `number of piles − 1` is a multiple of `K − 1`. These piles cost nothing and will be merged in the first operation. Then we always merge the K smallest piles. The exchange that justifies the greedy algorithm is the same as for Huffman: in an optimal tree, we can always swap leaves so that the K smallest ones are siblings, at the deepest level, without increasing the cost.

In the first example (5 1 2 4, K = 3), we add an empty pile: 0 + 1 + 2 = 3 (cost 3), then 3 + 4 + 5 = 12 (cost 12), total 15. Merging the three smallest right away (1 + 2 + 4 = 7, then 5 + 7 = 12) costs 19.

**Complexity.** We add at most K − 2 empty piles. Each merge does K removals and one insertion in a heap: O((N + K) log(N + K)) overall.

**Why the simple solutions fail.** The greedy "the K smallest each time" without empty piles goes wrong as soon as `N − 1` is not a multiple of `K − 1`. Trying every way of merging is exponential. And sorting everything again after each merge costs O(N² log N).

**Traps.**
- The total cost goes beyond 2³¹ (more than 3 × 10⁹ for K = 2, N = 25,000 and large piles): use `long long` in C++.
- When K > N, everything is merged at once: the cost is the sum of all piles. With the empty piles, the program finds this by itself.
- When N = 1, the cost is `0`: (N − 1) is already a multiple of K − 1 and the loop does nothing.
