---
title: Minimum after additions
---

## Statement
An array contains `N` integers `a[1], a[2], …, a[N]`, all equal to `0` at the start. Write a program that processes, in order, a sequence of `Q` operations of two kinds:
- `+ L R V`: add `V` to each of the values `a[L], a[L+1], …, a[R]`;
- `? L R`: print the smallest value among `a[L], …, a[R]`, and the number of cells of this range that have this value.

## Input
- The first line contains two integers `N` and `Q`.
- Each of the next `Q` lines contains an operation: the character `+` followed by three integers `L`, `R` and `V`, or the character `?` followed by two integers `L` and `R`.

## Output
For each `?` operation, in order, a line with two integers: the minimum of the range, then the number of cells that reach it.

## Constraints
- 1 ≤ N ≤ 1 000 000
- 1 ≤ Q ≤ 6 000
- 1 ≤ L ≤ R ≤ N
- -10⁶ ≤ V ≤ 10⁶

## Hints
1. Changing the cells one by one costs up to `N` operations per addition: several billion in total.
2. In a segment tree, store for each node the minimum of its range **and** the number of cells that reach it. Two children combine easily: if their minimums are equal, add up the counts; otherwise keep the pair of the smaller one.
3. When an addition covers the **whole** range of a node, there is no need to go down: the minimum of the node increases by `V`, the count does not change. Write down in the node that `V` remains to be added to its whole subtree (this is **lazy propagation**), and take it into account on the way back up.

## Solution
Use a **segment tree** where each node `k` covers a range of cells and stores:
- `mini[k]` and `cnt[k]`: the minimum of its range and the number of cells that reach it;
- `pending[k]`: the sum of the additions that covered the whole range of `k` and were not passed on to its children.

At the start, all the cells are `0`: each node has `mini = 0` and `cnt` equal to the size of its range.

**Addition** `+ L R V`, from the root. If the node is outside `[L, R]`, do nothing. If it is entirely inside, do `mini[k] += V` and `pending[k] += V`, and stop: the number of minimum cells does not change when everything increases by the same value. Otherwise, go down into both children, then recompute: combine the pairs of the two children (the smaller minimum, or the sum of the counts in case of a tie) and add `pending[k]` to the minimum.

**Query** `? L R`. Go down the same way. A node entirely inside `[L, R]` returns its pair `(mini, cnt)`. A node that is cut combines the answers of its children, then adds its own `pending[k]` to the minimum, because its children don't know about it.

As in an ordinary segment tree, each operation visits O(log N) nodes. Complexity: **O(N + Q log N)**.

Here the pending value stays in the node and is never pushed down to the children: this works because an addition commutes with the minimum. For other operations (for example "replace with `V`"), you must instead **push** the pending value down to both children before going down.

Why the naive method fails: an addition or a query on a large range goes through up to a million cells. With 6,000 operations, that is several billion operations, too many even in C++. A segment tree without lazy propagation is not enough either: an addition on `[L, R]` changes every leaf of the range.

Pitfalls:
- The values can exceed 2³¹ in absolute value: use `long long` in C++.
- When both children have the same minimum, add up the counts: forgetting this case counts too few cells.
- If the tree is rounded up to a power of two, the extra leaves must never be counted: give them a huge value.
