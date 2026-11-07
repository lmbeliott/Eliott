---
title: Rebuilding a tree from two traversals
---

## Statement
A binary tree has `N` nodes, numbered from `1` to `N`. The tree was lost, but the list of its nodes in **preorder** and in **inorder** was kept.

Print the list of its nodes in **postorder**, or `IMPOSSIBLE` if no binary tree has these two traversals.

## Input
- The first line contains `N`.
- The second line contains the `N` nodes in preorder.
- The third line contains the `N` nodes in inorder.

Each of the two lines contains each integer from `1` to `N` exactly once.

## Output
The `N` nodes in postorder, on one line, or `IMPOSSIBLE`.

## Constraints
- 1 ≤ N ≤ 1,000

## Hints
1. The first node of the preorder is the root. Where is it in the inorder, and what lies on each side?
2. If the root is at position `k` in the inorder portion, the left subtree has `k` nodes (relative to the start of the portion): they are also the `k` nodes following the root in the preorder. Repeat on each subtree.
3. Storing the position of each node in the inorder in an array avoids searching for it every time. If the root of a portion is not in the corresponding inorder portion, the two traversals are incompatible.

## Solution
In preorder, the root comes first, then the whole left subtree, then the whole right subtree. In inorder, we find the left subtree, then the root, then the right subtree.

The recursive function `build(p, i, size)` handles a subtree of `size` nodes, occupying positions `p` to `p + size − 1` of the preorder and `i` to `i + size − 1` of the inorder. If `size = 0`, there is nothing to do. Otherwise, its root is `r = preorder[p]`; let `k` be the position of `r` in the inorder (read from a precomputed array). If `k` is not between `i` and `i + size − 1`, no tree works: answer `IMPOSSIBLE`. Otherwise, the left subtree has `g = k − i` nodes: call `build(p + 1, i, g)`, then `build(p + 1 + g, k + 1, size − 1 − g)`, and write `r` at the end, which directly produces the postorder.

**Correctness.** If a tree has these two traversals, the description above is forced at each step: the tree is **unique**, and the function writes its postorder. Conversely, if no check fails, each preorder portion and the corresponding inorder portion contain the same nodes (each node of the preorder portion was found, as a root, in the inorder portion of the same size), and the tree built indeed has the two given traversals.

**Complexity.** Each node is the root of a single call: O(N) thanks to the array of positions. Searching for the root in the inorder portion with a loop would cost O(N²) in the worst case, which is still acceptable here. The recursion depth reaches `N` for a path-shaped tree.

**Remark.** Preorder and postorder are not enough to recover the tree: a node with a single child gives the same traversals whether that child is on the left or on the right.
