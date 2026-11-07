---
title: Largest sum of a segment, with updates
---

## Statement
An array contains `N` integers `a[1], a[2], …, a[N]`. A **segment** of the range `[L, R]` is a sequence of consecutive cells `a[x], a[x+1], …, a[y]` with `L ≤ x ≤ y ≤ R`; it contains at least one cell.

Write a program that processes, in order, a sequence of `Q` operations of two kinds:
- `1 P V`: replace the value `a[P]` with `V`;
- `2 L R`: print the largest sum of a segment of the range `[L, R]`.

## Input
- The first line contains two integers `N` and `Q`.
- The second line contains `N` integers `a[1] … a[N]`.
- Each of the next `Q` lines contains an operation: the integer `1` followed by `P` and `V`, or the integer `2` followed by `L` and `R`.

## Output
For each operation of kind `2`, in order, a line with the largest sum of a segment of the requested range.

## Constraints
- 1 ≤ N ≤ 10,000
- 1 ≤ Q ≤ 8,000
- -1,000 ≤ a[i], V ≤ 1,000
- 1 ≤ P ≤ N and 1 ≤ L ≤ R ≤ N

## Hints
1. For a single query, one pass over the range is enough (keep the best sum of a segment ending at the current cell). But doing this pass again for every query costs up to `N × Q` operations.
2. In a segment tree, the best segment of a node is either entirely in its left child, or entirely in its right child, or straddles both. What do you need to know about each child to handle the "straddling" case?
3. Store four values for each node: the total sum, the best prefix, the best suffix and the best segment. They can all be combined from those of the two children.

## Solution
Each node of a **segment tree** stores, for its range:
- `sum`: the sum of all the cells;
- `pref`: the largest sum of a non-empty prefix;
- `suff`: the largest sum of a non-empty suffix;
- `best`: the largest sum of a segment.

For a node whose left child is `G` and right child is `D`:
- `sum = G.sum + D.sum`;
- `pref = max(G.pref, G.sum + D.pref)`: the best prefix stops inside `G`, or covers all of `G` and goes on into `D`;
- `suff = max(D.suff, D.sum + G.suff)`, in the same way;
- `best = max(G.best, D.best, G.suff + D.pref)`: the best segment is inside `G`, inside `D`, or straddles both, and then it is made of a suffix of `G` followed by a prefix of `D`.

A leaf of value `v` has its four values equal to `v`. An **update** changes a leaf and then recomputes its O(log N) ancestors. A **query** splits `[L, R]` into O(log N) nodes, which are combined **from left to right** with the same formulas: the order matters, because the operation is not commutative.

Complexity: **O(N + Q log N)**.

Why the naive method fails: one pass per query costs O(N); with thousands of queries on long ranges, that is tens of millions of operations, too many for Python. Storing only the best segment of each node is not enough: you could not combine two nodes when the best segment straddles them.

Pitfalls:
- A segment is never empty: if all the values are negative, the answer is the largest of them, not `0` (second example).
- For empty nodes (extra leaves, starting accumulators), take `sum = 0` and a very negative value for `pref`, `suff` and `best`, with no risk of overflow when two of them are added.
- In a query, accumulate the left nodes in order, and put the right nodes **in front of** the right accumulator.
