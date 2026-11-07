---
title: Cover a floor with tiles
---

## Statement
A rectangular floor is `L` centimetres long and `H` centimetres wide. It is covered with square tiles whose side is `C` centimetres, laid in rows and columns starting from one corner of the floor. At the edges, the tiles that stick out are cut to the right size, and the cut pieces are thrown away.

Write a program that prints the number of tiles used, then the area thrown away, in square centimetres.

This problem can be solved without `if` and without loops: with computations only.

## Input
A single line containing three integers `L`, `H` and `C` separated by spaces: the length and the width of the floor, then the side of a tile, in centimetres.

## Output
Two lines:
- on the first one, the number of tiles used;
- on the second one, the area of the pieces thrown away, in square centimetres.

## Constraints
- 1 ≤ L, H, C ≤ 10,000

## Hints
1. Start with a single row of tiles, along the side of `L` centimetres. With `L = 250` and `C = 50`, you need 5 tiles. And with `L = 260`? You need 6: the last one is cut.
2. The number of tiles in a row is `L` divided by `C`, rounded **up**. But `L // C` rounds down. The trick: `(L + C - 1) // C` rounds up, without any `if`. Try it with `L = 250`, then `L = 260`.
3. The total number of tiles is the number of tiles along the length times the number of tiles along the width. For the area thrown away: compute the area of all the tiles laid, and subtract the area of the floor.

## Solution
Along the length, you need enough tiles to cover `L` centimetres: that's `L / C` rounded up. For example, for 260 centimetres and tiles of 50, 5 tiles only cover 250 centimetres: you need 6.

Integer division `L // C` rounds down. To round up without `if`, add `C - 1` before dividing: `(L + C - 1) // C`. If `L` is a multiple of `C`, adding `C - 1` is not enough to reach the next multiple, and the result doesn't change. Otherwise, there is already a remainder of at least 1, and adding `C - 1` moves to exactly the next quotient.

Do the same along the width, and the number of tiles is the product of both numbers: `nl × nh`.

For the area thrown away, no need to compute each piece: all the tiles laid cover `nl × nh × C × C` square centimetres, and the floor keeps `L × H` of them. The difference is what was thrown away.

Example: `L = 250`, `H = 130`, `C = 50`. Along the length, `(250 + 49) // 50 = 5` tiles; along the width, `(130 + 49) // 50 = 3` tiles. That makes 15 tiles, which cover 15 × 2,500 = 37,500 square centimetres, for a floor of 32,500: 5,000 square centimetres are thrown away.

The traps: using `L // C`, which forgets the last cut tile; or computing `(L × H) // (C × C)` rounded up, which counts the area but not the way the tiles are laid. With `L = H = 30` and `C = 20`, the area of the floor is 900, less than 3 tiles (1,200), and yet you need 4.
