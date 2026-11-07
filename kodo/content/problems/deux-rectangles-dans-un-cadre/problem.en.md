---
title: Two rectangles in a frame
---

## Statement
A rectangular frame is `W` wide and `H` high. You want to place two rectangles inside it: the first one is `A` by `B`, the second one `C` by `D`.

The rules are:
- each rectangle must be completely inside the frame;
- the two rectangles must not overlap, but they may touch along an edge;
- the sides of the rectangles stay parallel to the sides of the frame, but each rectangle can be turned a quarter turn: an `A` by `B` rectangle can also be placed as a `B` by `A` rectangle.

Write a program that prints `OUI` (French for "yes") if both rectangles can be placed in the frame, and `NON` ("no") otherwise.

## Input
- The first line contains two integers `W` and `H`: the width and the height of the frame.
- The second line contains two integers `A` and `B`: the sides of the first rectangle.
- The third line contains two integers `C` and `D`: the sides of the second rectangle.

## Output
A single word: `OUI` if both rectangles can be placed, `NON` otherwise.

## Constraints
- 1 ≤ W, H, A, B, C, D ≤ 1 000

## Hints
1. Picture two rectangles placed in the frame without overlapping. Can you always draw a straight line, vertical or horizontal, that goes between them?
2. So there are only two ways to place them: **side by side** (their widths add up and must fit in `W`, and each height must fit in `H`), or **one above the other** (their heights add up and must fit in `H`, and each width must fit in `W`).
3. Each rectangle can be placed in two ways, which makes 4 combinations, and for each of them there are 2 placements: 8 cases in all. The answer is `OUI` if at least one of the 8 cases works. You can use a variable that starts as false, and becomes true as soon as a case works.

## Solution
The key to the problem is one remark: two rectangles that don't overlap, with sides parallel to those of the frame, are always separated by a vertical line or by a horizontal line. Indeed, if no vertical line goes between them, their parts seen "from the front" overlap; if in addition no horizontal line goes between them, their parts seen "from the side" overlap too, and then the rectangles overlap.

So you only need to try two placements:
- **side by side**: the sum of the widths is at most `W`, and each of the two heights is at most `H`;
- **one above the other**: the sum of the heights is at most `H`, and each of the two widths is at most `W`.

For each rectangle, you also choose its direction: the first one has width and height `A` and `B`, or `B` and `A`; same for the second one. With 2 directions for each rectangle and 2 placements, you get 8 conditions. Test them all, and answer `OUI` as soon as a single one is true.

Example: a 7 by 4 frame, and two 4 by 3 rectangles. Placed as they are side by side, they need a width of 8: too wide. One above the other, they need a height of 6: too high. But both turned, they are 3 by 4: side by side, they take a width of 6 and a height of 4, and they fit.

The traps:
- forgetting cases: you must think about the rotations of **both** rectangles, independently of each other;
- using `<` instead of `<=`: two rectangles that fill the frame exactly are allowed;
- only checking that the total area is small enough: two 3 by 3 squares have a total area of 18, smaller than the 25 of a 5 by 5 frame, and yet they don't fit in it.
