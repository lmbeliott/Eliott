---
title: Full cells of a fractal pattern
---

## Statement
A **pattern** is an M × M grid of cells `#` (full) and `.` (empty). From this pattern, we build larger and larger square grids:
- the grid of order 0 is a single full cell;
- the grid of order t (t ≥ 1) has Mᵗ rows and Mᵗ columns. It is cut into M × M blocks of M^(t−1) × M^(t−1) cells. The block at row i and column j of the blocks is a copy of the grid of order t − 1 if cell (i, j) of the pattern is `#`, and it is entirely empty otherwise.

For example, with the pattern `###`, `#.#`, `###`, the grid of order 1 is the pattern itself, and the grid of order 2 is 9 × 9 cells with a 3 × 3 hole in the middle.

Write a program that answers Q questions about the grid of order K: how many full cells does a given rectangle contain?

## Input
- The first line contains three integers M, K and Q.
- Each of the next M lines contains M characters `#` or `.`: the pattern.
- Each of the next Q lines contains four integers L1, C1, L2 and C2: the rectangle goes from row L1 to row L2 and from column C1 to column C2, edges included. Rows and columns are numbered from 1.

## Output
Q lines: for each question, in order, the number of full cells in the rectangle.

## Constraints
- 2 ≤ M ≤ 5
- 0 ≤ K and Mᴷ ≤ 10⁹
- 1 ≤ Q ≤ 1,000
- 1 ≤ L1 ≤ L2 ≤ Mᴷ and 1 ≤ C1 ≤ C2 ≤ Mᴷ

## Hints
1. The grid can be 10⁹ × 10⁹ cells: impossible to build it. As with two-dimensional prefix sums, reduce each rectangle to four "corners": P(r, c), the number of full cells in the first r rows and the first c columns.
2. To compute P(r, c) at order t, cut into blocks of side s = M^(t−1): the blocks entirely inside the corner, then a strip at the bottom (r is not a multiple of s), a strip on the right, and the corner block. Whole blocks are counted directly, the rest is the same problem at order t − 1.
3. Do not cut the bottom strip block by block, calling the function on each one: these blocks are all cut the same way (their first rr rows, in full). Compute P(rr, s) at order t − 1 **only once** and multiply by the number of `#` of the pattern in this row of blocks. Also keep the results already computed in a dictionary.

## Solution
**Reducing to corners.** Let P(t, r, c) be the number of full cells in the first r rows and the first c columns of the grid of order t. As with two-dimensional prefix sums, the rectangle (L1, C1, L2, C2) contains
`P(K, L2, C2) − P(K, L1 − 1, C2) − P(K, L2, C1 − 1) + P(K, L1 − 1, C1 − 1)` full cells.

**Sizes first.** The grid of order t has side `side[t] = Mᵗ` and contains `total[t] = Nᵗ` full cells, where N is the number of `#` in the pattern.

**The recursion.** To compute P(t, r, c), we cut into blocks of side s = `side[t − 1]`. We write r = br × s + rr and c = bc × s + rc (integer divisions). The corner contains:
- the whole blocks (block rows < br, block columns < bc): each is worth `total[t − 1]` if it is full in the pattern;
- if rr > 0, the bottom strip: the blocks of row br, columns < bc, of which we keep the first rr rows **in full**. Each contains P(t − 1, rr, s) full cells;
- if rc > 0, the right strip: the blocks of column bc, rows < br, of which we keep the first rc columns. Each contains P(t − 1, s, rc);
- if rr > 0 and rc > 0, the corner block (br, bc), which contains P(t − 1, rr, rc) if it is full.

We count the `#` of the pattern in each zone with prefix sums over the pattern. The base cases: P is 0 if r = 0 or c = 0, and `total[t]` if the corner is the whole grid (this covers order 0).

In the first example (9 × 9 carpet, whole row 2), we compute P(2, 2, 9) − P(2, 1, 9). With s = 3: br = 0 and rr = 2, bc = 3 and rc = 0. There is no whole block and no right strip, only the bottom strip: 3 full blocks, each with P(1, 2, 3) = 5 full cells (`###` then `#.#`). P(2, 2, 9) = 15 and likewise P(2, 1, 9) = 3 × 3 = 9: row 2 contains 6 full cells.

**Why it is fast.** A call P(t, r, c) triggers at most three calls at order t − 1: P(t − 1, rr, s), P(t − 1, s, rc) and P(t − 1, rr, rc). The first one then triggers only one useful call (its bottom strip), and so does the second. And these calls repeat: P(t − 1, rr, rc) calls P(t − 2, rr mod s', s'), exactly like P(t − 1, rr, s). By keeping the results in a dictionary, each corner costs at most 3K calls.

**Complexity.** O(K) calls per corner, so O(Q × K) in total, with a small dictionary: a few hundred thousand operations.

**Why the naive solution is too slow.** Building the grid is impossible beyond a few thousand cells per side. Cutting the rectangle block by block and calling the function on every cut block seems reasonable, but a thin strip crosses up to M blocks, which are each cut into M pieces at the next order, and so on: Mᴷ calls, that is 2²⁹ for M = 2.

**Traps.**
- The number of full cells can reach (Mᴷ)², almost 10¹⁸: use `long long` in C++.
- When r = Mᵗ (the whole height), br is M and rr is 0: there is no bottom strip, and you must not read row M of the pattern.
- The strips are only called if the pattern contains at least one `#` in the zone, and the bottom strip does not depend on the block's column: a single call, multiplied.
