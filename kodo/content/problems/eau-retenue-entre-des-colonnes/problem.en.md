---
title: Water trapped between columns
---

## Statement
`N` columns of width 1 stand side by side, with heights `H₁, H₂, …, Hₙ`. It rains for a long time: the water fills the hollows between the columns and flows off at both edges. Count the cells of water that are trapped.

With heights `3 0 2 0 4`, the water (`~`) fills 7 cells:

```text
    #
#~~~#
#~#~#
#~#~#
```

## Input
- The first line contains `N`.
- The second line contains the `N` heights.

## Output
The number of cells of trapped water.

## Constraints
- 1 ≤ N ≤ 30,000
- 0 ≤ Hᵢ ≤ 1,000

## Hints
1. Above column `i`, the water rises up to some level. What does this level depend on?
2. The water above column `i` is held on the left by the highest column on the left, and on the right by the highest column on the right. It rises up to the lower of these two heights.
3. Recomputing these two maximums for each column would be too slow. A first pass from left to right gives all the "left" maximums, a second one from right to left all the "right" maximums.

## Solution
Let `L[i]` be the largest height among columns 1 to `i`, and `R[i]` the largest among columns `i` to `N` (column `i` is included in both). The water level above column `i` is `min(L[i], R[i])`, and the column holds `min(L[i], R[i]) − H[i]` cells of water, which is non-negative since both maximums are at least `H[i]`.

Why: the water above column `i` cannot exceed `L[i]`, otherwise it would flow to the left over all the columns on the left; likewise for `R[i]`. Conversely, up to level `min(L[i], R[i])`, it is blocked on both sides by a column at least as high, so it stays.

The `L[i]` are computed in one pass from left to right: `L[i] = max(L[i − 1], H[i])`. The `R[i]` are computed in one pass from right to left: `R[i] = max(R[i + 1], H[i])`. A third pass adds up the amounts of water.

Cost: three passes of `N` steps. Recomputing both maximums for each column by scanning the whole array would take `N²` steps, that is 900 million. The answer can reach about 3 × 10⁷, which fits in an `int`.
