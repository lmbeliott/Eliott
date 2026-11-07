---
title: Distance in the infinite binary tree
---

## Statement
In an infinite binary tree, nodes are numbered from 1: the root has number `1`, and the children of node `k` are nodes `2k` (left) and `2k + 1` (right). So the root has children 2 and 3, node 2 has children 4 and 5, node 3 has children 6 and 7, and so on.

For each of the `Q` pairs of nodes `(A, B)`, compute the **lowest common ancestor** of `A` and `B` (the deepest node that is an ancestor of both, a node being considered its own ancestor) and the number of edges of the path joining `A` to `B` in the tree.

## Input
- The first line contains `Q`.
- Each of the next `Q` lines contains two integers `A` and `B`.

## Output
`Q` lines: for each pair, in order, the lowest common ancestor then the distance, separated by a space.

## Constraints
- 1 ≤ Q ≤ 2,000
- 1 ≤ A, B ≤ 10¹⁸

## Hints
1. The parent of node `k` (for `k ≥ 2`) is `k // 2`. An ancestor always has a smaller number than its descendants.
2. The path from `A` to `B` climbs from `A` up to the lowest common ancestor, then goes down to `B`. While `A ≠ B`, which of the two should climb?
3. In binary, the children of `k` are written `k` followed by `0` or `1`: the ancestors of a node are the beginnings of its binary writing.

## Solution
While `A ≠ B`, replace the larger of the two by its parent (`// 2`) and count one step. When they are equal, the lowest common ancestor is reached, and the number of steps is the distance.

**Why it is correct.** An ancestor has a smaller number than its descendants, since the number at least doubles at each generation. If `A > B`, node `A` is therefore not an ancestor of `B`: it lies strictly below the lowest common ancestor `C`, and the edge from `A` to its parent belongs to the path from `A` to `B` (which climbs from `A` up to `C`). Each step thus goes along one edge of the path, never beyond `C`, and stops exactly on `C`: the number of steps is the length of the path.

**Complexity.** The depth of a node `k` is the number of binary digits of `k` minus 1, at most 59 for `k ≤ 10¹⁸`: each question takes at most 118 steps.

**In binary.** The left child of `k` is written by appending a `0` to the binary writing of `k`, the right child by appending a `1`. The ancestors of `k` are therefore the beginnings of its binary writing, and the lowest common ancestor of `A` and `B` is the longest common beginning of their writings. For example 12 = `1100` and 13 = `1101` have common ancestor `110` = 6. This is the numbering used to store a complete binary tree in an array.
