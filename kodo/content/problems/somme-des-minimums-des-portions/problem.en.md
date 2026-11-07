---
title: Sum of the minimums of all segments
---

## Statement
A sequence of `N` integers `A₁, …, A_N` is given. A **segment** is a run of consecutive cells `Aₗ, …, Aᵣ` with `l ≤ r`; there are `N × (N + 1) / 2` of them. Compute the sum of the minimums of all segments.

For example, for `3 1 2`, the segments are `3`, `1`, `2`, `3 1`, `1 2` and `3 1 2`, with minimums `3, 1, 2, 1, 1, 1`: the sum is `9`.

## Input
The first line contains `N`. The second line contains `A₁, …, A_N`, separated by spaces.

## Output
A single integer: the sum of the minimums.

## Constraints
- 1 ≤ N ≤ 20,000
- 1 ≤ Aᵢ ≤ 100,000

## Hints
1. Going through each segment while keeping its minimum up to date costs N² / 2 operations, 200 million: too much for Python.
2. Turn the question around: for each position `i`, in how many segments is `Aᵢ` the minimum? Watch out for equal values, which must not count the same minimum twice.
3. Decide that the minimum of a segment belongs to its leftmost position among those holding the minimal value. Then, for each `i`, you need the position of the nearest value `≤ Aᵢ` on the left, and that of the nearest value `< Aᵢ` on the right: two passes with a stack.

## Solution
For each segment, assign its minimum to the **leftmost** position reaching this minimum. Position `i` holds the minimum of segment `[l, r]` (with `l ≤ i ≤ r`) if and only if all values from `l` to `i − 1` are **strictly** greater than `Aᵢ`, and all those from `i + 1` to `r` are **greater than or equal** to `Aᵢ`.

Write `g` for the nearest position to the left of `i` such that `A_g ≤ Aᵢ` (or `0` if there is none), and `d` for the nearest to the right such that `A_d < Aᵢ` (or `N + 1`). The possible starts are `g + 1, …, i`, that is `i − g` choices, and the possible ends `i, …, d − 1`, that is `d − i` choices. Each combination gives a different segment: `Aᵢ` contributes `Aᵢ × (i − g) × (d − i)` to the sum. Each segment is counted exactly once, by the position holding its minimum.

To find all the `g` in one left-to-right pass, keep a stack of positions whose values strictly increase towards the top. Arriving at `i`, pop while the value at the top is `> Aᵢ`: these positions can no longer be anyone's `g`, since `Aᵢ` is closer and at least as small. The remaining top, if any, is `g`. Push `i`. The right-to-left pass for `d` is the same, popping while the value at the top is `≥ Aᵢ`.

**Cost.** Each position is pushed and popped at most once per pass: about 4N operations. The sum can reach 10⁵ × 2 × 10⁸ = 2 × 10¹³: in C++, `long long`. The trap: using `<` on both sides, which counts twice the segments whose minimum appears several times, or `≤` on both sides, which misses them.
