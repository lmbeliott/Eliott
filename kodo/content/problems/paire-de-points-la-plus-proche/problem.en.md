---
title: Closest pair of points
---

## Statement
We are given N points of the plane with integer coordinates; several points may coincide. Print the **square** of the smallest distance between two of these points, that is the smallest value of (xᵢ − x_j)² + (yᵢ − y_j)² for i ≠ j.

The coordinates are built by a formula, to keep the input short: u₁ = X, then u_{k+1} = (u_k × B + C) mod M. Point i has coordinates (u_{2i−1}, u_{2i}). For example, with N = 3, X = 1, B = 2, C = 3 and M = 10, the sequence u starts with 1, 5, 3, 9, 1, 5: the points are (1, 5), (3, 9) and (1, 5), and the answer is 0.

## Input
A single line: the five integers N, X, B, C and M.

## Output
The square of the smallest distance between two points.

## Constraints
- 2 ≤ N ≤ 70,000
- 1 ≤ M ≤ 10⁹
- 0 ≤ X, B, C < M

## Hints
1. Sort the points by abscissa, and cut into two halves with a vertical line. The best pair is in the left half, in the right half, or across.
2. Let d be the best squared distance found in the two halves. A closer pair across has both points in a vertical **strip** around the cutting line, with abscissa less than √d away from the line.
3. In the strip, ordered by increasing ordinate, each point only needs to be compared with the following points while the gap in ordinate stays below √d: there are at most 7 of them.

## Solution
**Divide.** Sort the points by abscissa. The recursive function receives a list of points sorted by abscissa and returns the smallest squared distance of the list, together with the list sorted by ordinate. For 3 points or fewer, compare every pair. Otherwise, cut in the middle: xm is the abscissa of the middle point, and call the function on both halves. Let d be the minimum of the two results.

**The strip.** A pair across with squared distance strictly below d has both points less than √d away from the line x = xm, horizontally: keep in the **strip** the points with (x − xm)² < d. By merging the two halves already sorted by ordinate (as in merge sort), we get the strip sorted by ordinate without a new sort. Compare each point of the strip with the following points of the strip, and stop as soon as the squared gap in ordinate reaches d: points further in the list are even further away vertically.

**Why it is fast.** If d = 0, the strip is empty. Otherwise, the points of the strip whose ordinate is between y and y + √d fit in a rectangle of width 2√d and height √d, which we cut into 8 squares of side √d / 2, four on each side of the line. Two points of the same half are at squared distance at least d, by definition of d; but two points of the same small square are at squared distance at most d / 2. So each small square contains at most one point, and the inner loop makes at most 7 turns. Each recursion level costs O(N), and there are log₂ N levels: O(N log N) overall. Comparing every pair would cost N²/2 = 2.5 × 10⁹ distance computations. A squared distance reaches 2 × 10¹⁸: `long long` in C++.
