---
title: Squares of points
---

## Statement
`N` distinct points with integer coordinates are placed in the plane. Count the squares whose four vertices are among these points. The squares may be tilted: their sides are not necessarily horizontal and vertical.

For example, the 9 points of a 3 × 3 grid form 6 squares: four small squares of side 1, the big square of side 2, and a tilted square whose vertices are the midpoints of the edges.

## Input
The first line contains the integer `N`. Each of the next `N` lines contains the coordinates `x` and `y` of a point, separated by a space.

## Output
A single integer: the number of squares.

## Constraints
- 1 ≤ N ≤ 500
- -1,000 ≤ x, y ≤ 1,000
- All points are different.

## Hints
1. Trying every quadruple of points takes about N⁴ / 24, that is 2.6 billion cases: too many. But two points `A` and `B` are enough to describe a side, and a side is enough to rebuild the square.
2. If `B - A` is the vector `(dx, dy)`, turning it a quarter turn counterclockwise gives `(-dy, dx)`. The two other vertices are then `B + (-dy, dx)` and `A + (-dy, dx)`.
3. Store the points in a set of pairs `(x, y)` to test quickly whether they exist. Count how many times each square is found when you try every pair `(A, B)`.

## Solution
A square is fully determined by one of its sides and by which side of it the square lies on. Take two points `A` and `B`, and let `(dx, dy) = (xB - xA, yB - yA)`. Turning this vector a quarter turn counterclockwise gives `(-dy, dx)`: same length, perpendicular direction. The points `C = B + (-dy, dx)` and `D = A + (-dy, dx)` then complete `A`, `B` into a square `ABCD`, traversed counterclockwise.

Store all the points in a **set of pairs** `(x, y)`. For each ordered pair `(A, B)` of different points, compute `C` and `D` and test whether they are in the set. A small function `is_present(x, y)` makes this test readable.

How many times is each square counted? A square has four sides; traversed counterclockwise, each one gives exactly one ordered pair `(A, B)` for which the test succeeds. The pair `(B, A)` builds the square on the other side of `AB`. Each square is therefore counted exactly 4 times, and the answer is the total divided by 4.

There are `N × (N - 1)`, about 250,000 pairs, each with two membership tests that are almost instant thanks to the set. With a list of points, each test would go through the 500 points: 250 million operations.

In C++, use a `set<pair<int, int>>`. The computed coordinates may leave the interval [-1,000, 1,000]: that's not a problem, the point is simply not in the set.
