---
title: Insertion orders giving the same tree
---

## Statement
The integers from `1` to `N` are inserted, in the given order, into an initially empty binary search tree, with the insertion of the lesson (no rebalancing). For example, inserting `3 4 5 1 2` gives a tree with root 3, whose left child is 1 (with 2 as right child) and whose right child is 4 (with 5 as right child).

Other insertion orders of the same integers give exactly the same tree: for example `3 1 4 2 5`. Count the insertion orders of `1` to `N` (the given order included) that produce the same tree as the given order, modulo 1,000,000,007.

## Input
- The first line contains `N`.
- The second line contains a permutation of the integers from `1` to `N`: the insertion order.

## Output
A single integer: the number of insertion orders giving the same tree, modulo 1,000,000,007.

## Constraints
- 1 ≤ N ≤ 1,000

## Hints
1. An order produces the same tree if and only if the root comes first, and the keys of the left subtree, taken in the order in which they appear, produce the same left subtree (and likewise on the right).
2. Left keys and right keys never interact: only their order within each side matters. In how many ways can a sequence of `a` elements and a sequence of `b` elements be interleaved?
3. There are `C(a + b, a)` interleavings. Binomial coefficients are computed with factorials and modular inverses.

## Solution
**The property.** In an insertion order producing a tree with root `r`, key `r` comes first (the first inserted key is the root). Then, a key smaller than `r` always goes down to the left and a larger key to the right: the left subtree is exactly the one produced by the subsequence of keys smaller than `r`, and likewise on the right. An order therefore gives the same tree if and only if `r` comes first, the subsequence of left keys gives the same left subtree, and that of right keys the same right subtree, **however these two subsequences are interleaved**.

**Counting.** If `f(v)` is the number of orders producing the subtree rooted at `v`, with a left subtree of `a` nodes and a right subtree of `b` nodes, then `f(v) = C(a + b, a) × f(left) × f(right)`: choose the `a` places of the left keys among the `a + b` places after the root, then a valid order on each side. For the empty tree, `f = 1`.

**Computation.** Build the tree by insertions (O(N × height), at most 500,000 steps). To handle children before their parent without recursion, notice that the descendants of a node are inserted **after** it: going through the insertion order backwards gives an order where each node comes after all its descendants. Binomial coefficients modulo the prime `p = 1,000,000,007` are computed as `C(n, k) = n! × (k!)⁻¹ × ((n − k)!)⁻¹`, where the inverse of `x` modulo `p` is `x^(p−2)` (Fermat's little theorem, computed by fast exponentiation). A single exponentiation is done, for `(N!)⁻¹`, then `((i − 1)!)⁻¹ = (i!)⁻¹ × i`.

**To check.** A sorted order produces a path: a single way. With `3 4 5 1 2`, there are `C(4, 2) = 6` orders, since each side is a path.
