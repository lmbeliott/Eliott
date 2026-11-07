---
title: Checking a binary search tree
---

## Statement
A binary tree has `N` nodes, numbered from `1` to `N`; each node carries an integer **key**. It is a **binary search tree** if, for each node `v`, all keys in the left subtree of `v` are strictly smaller than the key of `v`, and all those in the right subtree strictly larger.

Tell whether the given tree is a binary search tree.

## Input
- The first line contains `N`.
- Line `i + 1` (for `i` from 1 to `N`) contains three integers `K`, `L` and `R`: the key of node `i`, then its left and right children (`0` if the child does not exist).

The data always describe a binary tree; its root is the only node that is nobody's child.

## Output
`OUI` if the tree is a binary search tree, `NON` otherwise.

## Constraints
- 1 ≤ N ≤ 5,000
- −10⁹ ≤ K ≤ 10⁹

## Hints
1. Only checking that each left child is smaller than its parent, and each right child larger, is not enough: look at the third example.
2. Each node must have its key in an interval imposed by all its ancestors. Going left from a node of key `k`, the upper bound becomes `k`; going right, the lower bound becomes `k`.
3. Another method: a tree is a binary search tree if and only if its inorder traversal gives strictly increasing keys.

## Solution
Associate with each node an open interval `]low, high[` in which its key must lie. The root gets `]−∞, +∞[`. If a node with key `k` got `]low, high[`, its left child gets `]low, k[` and its right child `]k, high[`. Traverse the tree breadth-first from the root, with a queue of pairs (node, interval), and answer `NON` as soon as a key leaves its interval.

**Why it is correct.** By induction on the depth, the interval of a node `w` is exactly the set of values compatible with its ancestors: for each ancestor `v` whose left subtree contains `w`, the key of `w` must be smaller than that of `v`, and the bound `high` keeps the smallest of these keys; likewise for `low`. The definition asks exactly that each node satisfies all these conditions.

**The trap.** In the third example, each child is well placed with respect to its parent, but key 6 lies in the **left** subtree of the root 5 while being larger than 5.

**Complexity.** O(N). The breadth-first traversal avoids recursion, whose depth could reach 5,000 on a path-shaped tree.
