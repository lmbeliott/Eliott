---
title: Largest search subtree
---

## Statement
A binary tree has `N` nodes, numbered from `1` to `N`; each node carries an integer key. The **subtree** of a node `v` is made of `v` and all its descendants. It is a **binary search tree** if, for each of its nodes `w`, the keys of the left subtree of `w` are strictly smaller than that of `w`, and those of the right subtree strictly larger.

Compute the largest number of nodes of a subtree that is a binary search tree.

## Input
- The first line contains `N`.
- Line `i + 1` (for `i` from 1 to `N`) contains three integers `K`, `L` and `R`: the key of node `i`, then its left and right children (`0` if the child does not exist).

The data always describe a binary tree; its root is the only node that is nobody's child.

## Output
A single integer: the size of the largest subtree that is a binary search tree.

## Constraints
- 1 ≤ N ≤ 5,000
- −10⁹ ≤ K ≤ 10⁹

## Hints
1. Testing each subtree separately costs O(N) per subtree, hence O(N²) on a path-shaped tree. Everything can be computed in a single pass, from the leaves up to the root.
2. The subtree of `v` is a binary search tree if and only if its two subtrees are, the largest key on the left is smaller than the key of `v`, and the smallest key on the right is larger. What must therefore be kept for each subtree?
3. To handle children before their parent without recursion, go through the order of a breadth-first search backwards.

## Solution
For each node `v`, compute four pieces of information about its subtree: is it a binary search tree (`bst[v]`), its size, its smallest key and its largest key. The empty tree (index 0) is a search tree of size 0, with smallest key `+∞` and largest key `−∞`. If `l` and `r` are the children of `v`:
- `size[v] = size[l] + size[r] + 1`;
- `min[v] = min(min[l], key[v])` and `max[v] = max(max[r], key[v])`;
- `bst[v]` is true if and only if `bst[l]` and `bst[r]` are true and `max[l] < key[v] < min[r]`.

The answer is the largest `size[v]` among the nodes where `bst[v]` is true; it is at least 1, since a leaf is always a search tree.

**Correctness.** By definition, the subtree of `v` is a search tree if and only if the condition holds at each node of this subtree. For nodes other than `v`, this is exactly "the subtrees of `l` and `r` are search trees". For `v` itself, all keys on the left must be smaller than `key[v]`, which amounts to comparing the largest of them, `max[l]`, and likewise on the right with `min[r]`. The formulas for `min` and `max` use the fact that both subtrees are search trees (otherwise, these values are no longer used). This is an induction on the size of the subtree, as for postorder traversals: each node is handled after its two children.

**Processing order.** The tree can be a path of 5,000 nodes: recursion is avoided. A breadth-first search from the root lists each parent before its children; going through this list backwards, each node is handled after its children.

**Complexity.** O(N), instead of O(N²) for a separate test of each subtree.
