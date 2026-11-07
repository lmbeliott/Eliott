---
title: Nodes visible from the left
---

## Statement
A binary tree has `N` nodes, numbered from `1` to `N`, and the two children of each node are given. The tree is drawn the usual way: the root at the top, at level 0, the children of a node of level `k` at level `k + 1`, the left child to the left of the right child, and the nodes of each level in order from left to right.

For each level, print the leftmost node: these are the nodes seen by an observer standing to the left of the tree.

## Input
- The first line contains `N`.
- Line `i + 1` (for `i` from 1 to `N`) contains two integers `L` and `R`: the left and right children of node `i` (`0` if the child does not exist).

The data always describe a binary tree; its root is the only node that is nobody's child.

## Output
One line: for each level, from level 0 to the deepest one, the number of the leftmost node of that level.

## Constraints
- 1 ≤ N ≤ 10,000

## Hints
1. The leftmost node of a level is not necessarily a left child: a level may contain only right children.
2. A breadth-first search that always enqueues the left child before the right child visits the nodes level by level, and each level from left to right.
3. The tree can have height 10,000: a recursive traversal may exceed the allowed depth, a queue does not have this problem.

## Solution
Find the root (the only node that is nobody's child), then run a **breadth-first search** from the root, enqueuing the left child then the right child of each node, and recording the level of each one (that of its parent plus 1). The first dequeued node of each level is the leftmost: print it.

**Why it is correct.** As for distances in a graph, nodes leave the queue by increasing level. Inside a level, they leave from left to right, by induction: if level `k` leaves from left to right, its children are enqueued in the order "children of the first node (left then right), children of the second…", which is exactly the left-to-right order of level `k + 1` in the drawing.

**Complexity.** O(N). Traversing the tree by levels is also called **level-order traversal**.
