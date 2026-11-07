---
title: Three traversals of a binary tree
---

## Statement
A binary tree has `N` nodes, numbered from `1` to `N`. For each node, the number of its left child and of its right child are given (`0` if it has none). The root is not given: it is the only node that is nobody's child.

Print the node numbers in **preorder**, then in **inorder**, then in **postorder**.

## Input
- The first line contains `N`.
- Line `i + 1` (for `i` from 1 to `N`) contains two integers `L` and `R`: the left and right children of node `i`.

The data always describe a binary tree.

## Output
Three lines of `N` integers separated by spaces: preorder, inorder, then postorder.

## Constraints
- 1 ≤ N ≤ 1,000

## Hints
1. To find the root, mark every node that appears as a child: the root is the only unmarked node.
2. The three traversals are written with the same recursive function: only the moment when the node is written changes (before, between or after the calls on its two children).
3. The tree can be a long path of 1,000 nodes: raise the recursion limit in Python.

## Solution
Read the arrays `left` and `right`, and mark each node that appears as a child. The root is the only unmarked node: every node except the root has exactly one parent.

The function `traverse(v)` does nothing if `v = 0`; otherwise, it writes `v` into the preorder list, calls itself on `left[v]`, writes `v` into the inorder list, calls itself on `right[v]`, and writes `v` into the postorder list. A single call on the root fills the three lists.

**Correctness.** By induction on the size of the subtree: the call on `v` writes into each list exactly the nodes of the subtree of `v`, in the requested order, since the preorder of a tree is the root followed by the preorder of the left subtree then that of the right subtree, and likewise for the other two.

**Complexity.** One call per node and one per missing child: O(N). The recursion depth is the height of the tree, at most `N = 1,000`: in Python, raise the limit with `sys.setrecursionlimit`.
