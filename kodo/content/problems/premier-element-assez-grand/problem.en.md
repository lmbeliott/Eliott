---
title: First large enough element
---

## Statement
You are given an array of `N` integers `a[1], a[2], …, a[N]`. Write a program that processes, in order, a sequence of operations of two kinds:
- `M i v` (modify): the value `a[i]` becomes `v`;
- `Q i h` (query): print the smallest index `j ≥ i` such that `a[j] ≥ h`, or `-1` if there is none.

## Input
- The first line contains two integers `N` and `K`: the size of the array and the number of operations.
- The second line contains `N` integers: the initial values of `a[1]` to `a[N]`.
- Each of the next `K` lines contains one operation: the letter `M` or `Q`, then two integers.

## Output
For each `Q` operation, in order, one line containing the answer.

## Constraints
- 1 ≤ N ≤ 10 000
- 1 ≤ K ≤ 10 000
- 1 ≤ i ≤ N
- all values (initial ones, `v` and `h`) are between `1` and `5 000`

## Hints
1. Walking through the elements one by one from `i` costs O(N) per query: 10⁸ operations in total in the worst case.
2. A segment tree where each node stores the **maximum** of its interval tells you with a single comparison whether a whole interval contains an element that is large enough… and therefore lets you discard it in one go if it doesn't.
3. To find the first suitable element: from leaf `i`, move from block to block to the right (going up) as long as the block's maximum is too small; in the first suitable block, go back down, each time choosing the left child if it is suitable, otherwise the right one.

## Solution
We build a **segment tree** over the array where each node holds the maximum of its interval. With a size `T` that is a power of two, the leaves are at indices `T` to `2T - 1`, and node `k` has children `2k` and `2k + 1`. The extra leaves are `0`, a value smaller than any value of `h`.

**Modification** `M i v`: we change the leaf of index `i`, then go up to the root recomputing each maximum. O(log N).

**Query** `Q i h`: we look for the first index `j ≥ i` such that `a[j] ≥ h`, in two phases.
1. *Going up.* We start from the leaf `k` of index `i`. As long as `max[k] < h`, the block of `k` contains no answer: we move to the block just to its right. To do so, as long as `k` is a right child (odd), we go up to its parent, then take `k + 1`. If we go up past the root (`k = 0`), there is no answer: `-1`.
2. *Going down.* The block found contains the answer. As long as `k` is not a leaf, we go to the left child if its maximum is `≥ h` (the leftmost answer is there), otherwise to the right child.

The blocks visited while going up are consecutive, cover everything to the right of `i` in order, and their size only grows: there are O(log N) of them. Going down also costs O(log N). Total complexity: **O(N + K log N)**.

Another approach also works: a binary search on `j`, with a maximum query on `[i, j]` at each step. It costs O(log² N) per query; going straight down the tree is faster and simpler.

Why the other ideas fail:
- The direct scan costs O(N) per query, that is 10⁸ operations when all the answers are far away or `-1`: too slow in Python (in C++, it still passes at this size).
- Precomputing the answers doesn't work: each modification can change all of them.

Traps:
- The comparison is not strict: an element equal to `h` is suitable, including `a[i]` itself.
- After a modification, you must recompute **all** the ancestors of the leaf, even if the value decreased.
