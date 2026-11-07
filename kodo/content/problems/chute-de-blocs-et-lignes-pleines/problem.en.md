---
title: Falling blocks and full rows
---

## Statement
A vertical well of `H` rows and `W` columns is empty at the start. `Q` rectangular blocks are dropped into it, one after the other. Each block has a height `h`, a width `w`, and occupies the columns `c` to `c + w - 1` (columns numbered from 1 to `W`).

For each block, in order:
1. The block appears at the very top of the well: it occupies rows 1 to `h`.
2. It goes down by one row as long as all the cells it would occupy are inside the well and empty.
3. Once stopped, its cells become full.
4. Every completely full row is removed. The rows above it go down to fill the gap, without changing order, and empty rows appear at the top of the well.

Print the total number of removed rows, then the final state of the well.

## Input
- The first line contains three integers `H`, `W` and `Q`.
- Each of the next `Q` lines contains three integers `h`, `w` and `c`: the height, the width and the left column of a block.

## Output
- On the first line, the total number of removed rows.
- Then `H` lines of `W` characters, from the top to the bottom of the well: `#` for a full cell, `.` for an empty cell.

## Constraints
- 1 ≤ H ≤ 30 and 1 ≤ W ≤ 15
- 1 ≤ Q ≤ 200
- 1 ≤ h ≤ H, 1 ≤ w ≤ W and 1 ≤ c ≤ W - w + 1
- When a block appears, the cells it occupies are always empty.

## Hints
1. Split into functions: `place_free(g, r, c, h, w)` tells whether the rectangle whose top-left corner is `(r, c)` is entirely inside the well and empty; `put(g, r, c, h, w)` fills that rectangle; `remove_rows(g)` removes the full rows.
2. For the fall: start from `r = 0` and increase `r` as long as `place_free(g, r + 1, c, h, w)` is true.
3. To remove the full rows, build a new grid: first as many empty rows as full rows found, then the non-full rows, in their order.

## Solution
The well is a grid of characters, with a new row per turn of a loop when it is created. Three functions do all the work.

- `place_free(g, r, c, h, w)` returns `False` if the rectangle goes out of the well (`r + h > H`), or if one of its cells is full; otherwise `True`. The falling block is not written into the grid yet, so it does not get in its own way.
- The fall: start from `r = 0` (the statement guarantees this place is free) and, while `place_free(g, r + 1, c, h, w)`, increase `r`. Then `put` fills the rectangle with `#`.
- `remove_rows(g)` counts the full rows and builds a new grid: `k` empty rows at the top, where `k` is the number of full rows, then the non-full rows from top to bottom. The rows thus keep their order, and each one goes down by as many rows as there were full rows below it. The function returns the new grid and `k`: in Python with `return h, k`, in C++ by modifying the grid passed by reference and returning `k`.

Building a new grid avoids a trap: removing the rows one by one in the grid itself, while going through the indices, skips the row that takes the place of the removed one, and two adjacent full rows would not both be removed.

Also note: after a removal, the rows go down as a whole, not cell by cell. A full cell may stay above a hole: that's the rule, there is no second fall.

Each block needs at most `H` tries of `h × w` cells, then one pass over the grid: the program is very fast.
