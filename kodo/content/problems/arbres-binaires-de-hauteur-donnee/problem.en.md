---
title: Binary trees of a given height
---

## Statement
The **height** of a binary tree is the largest number of edges of a path going down from the root to a node: a tree reduced to one node has height 0. Only the **shape** of trees matters: two trees are different if one has a left or right child at a place where the other has none. For example, there are 5 shapes of trees with 3 nodes: 4 paths of height 2 and one tree of height 1 (a root and its two children).

Count the shapes of binary trees with `N` nodes whose height is exactly `H`. Print this number modulo 1,000,000,007.

## Input
A single line containing two integers `N` and `H`.

## Output
A single integer: the number of shapes, modulo 1,000,000,007.

## Constraints
- 1 ≤ N ≤ 150
- 0 ≤ H ≤ N − 1

## Hints
1. It is simpler to count the trees of height **at most** `h`: those of height exactly `H` are those of height at most `H` that are not of height at most `H − 1`.
2. A non-empty tree of height at most `h` is a root, a left subtree with `g` nodes and a right subtree with `N − 1 − g` nodes, both of height at most `h − 1`. The empty tree has height −1.
3. The resulting recursive function keeps recomputing the same values: it must be memoised.

## Solution
Let `A(n, h)` be the number of shapes with `n` nodes and height at most `h`. The empty tree counts as one shape, of height −1: `A(0, h) = 1` for every `h ≥ −1`, and `A(n, −1) = 0` if `n ≥ 1`. A non-empty tree is made of a root, a left subtree with `g` nodes and a right subtree with `n − 1 − g` nodes; its height is at most `h` if and only if both subtrees have height at most `h − 1`. Choices on the left and on the right are independent, so

`A(n, h) = Σ A(g, h − 1) × A(n − 1 − g, h − 1)`, for `g` from 0 to `n − 1`.

The answer is `A(N, H) − A(N, H − 1)` (modulo 1,000,000,007, bringing the result back between 0 and 1,000,000,006).

**Memoisation.** Without care, the recursion recomputes the same `A(n, h)` an exponential number of times. Each computed value is stored in a dictionary (or an array), as in the "Recursion" chapter. There are at most `N × N` values, each computed in O(N): O(N³), about 3 million operations for `N = 150`, often much fewer since only the useful values are computed.

**To check.** The sum of the answers for `H` from 0 to `N − 1` is the **Catalan number** `C(2N, N) / (N + 1)`: 1, 2, 5, 14, 42… Trees of height `N − 1` are paths, where each node chooses left or right for its child: there are `2^(N−1)` of them. A tree of height `h` has at most `2^(h+1) − 1` nodes, and has exactly that many for a single shape, the perfect tree: the answer for `N = 7`, `H = 2` is 1.
