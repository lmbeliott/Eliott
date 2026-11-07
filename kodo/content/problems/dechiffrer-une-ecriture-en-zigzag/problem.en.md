---
title: Decode a zigzag writing
---

## Statement
To encrypt a message, its letters are written in a zigzag over `K` rows: the first letter on row 1, the second on row 2, and so on up to row `K`, then back up (row `K − 1`, …, row 1), then down again, etc. With `K = 1`, all the letters are on row 1. The encrypted message is row 1 read from left to right, followed by row 2, and so on.

For example, `programmation` with `K = 3` is written:

```text
p...r...a...n
.r.g.a.m.t.o.
..o...m...i..
```

and becomes `pran` + `rgamto` + `omi`, that is `pranrgamtoomi`.

The encrypted message and `K` are given. Recover the original message.

## Input
- The first line contains the integer `K`.
- The second line contains the encrypted message.

## Output
The original message.

## Constraints
- 1 ≤ K ≤ 10⁹
- The message has between 1 and 150,000 lowercase letters.

## Hints
1. The row on which the letter of index `i` (from 0) lands depends only on `i`: the pattern of rows repeats every `2K − 2` letters.
2. By counting how many letters land on each row, you know where each row starts in the encrypted message.
3. If `K` exceeds the length `N` of the message, the rows beyond the `N`-th stay empty: you can replace `K` by `N`.

## Solution
Let `N` be the length of the message. If `K > N`, the descent never ends before the end of the message: the letter of index `i` goes to the row of index `i`, exactly as with `K = N`. So replace `K` by `min(K, N)`, which avoids creating a billion rows.

**The row of a letter.** If `K = 1`, every letter goes to row 0. Otherwise, a full round trip (down then up) contains `P = 2K − 2` letters, and the pattern repeats. For index `i`, compute `r = i % P`: if `r < K`, the letter is on row `r` (going down); otherwise it is on row `P − r` (going up). With `K = 3` and `P = 4`, indices 0, 1, 2, 3, 4 indeed give rows 0, 1, 2, 1, 0.

**Two passes.** The first pass computes, for each row, the number of letters that land on it. The encrypted message is row 0, then row 1, etc.: so row `r` starts there at index `start[r] = length[0] + … + length[r − 1]`. The second pass rebuilds the message in order: for each index `i`, compute its row `r`, take the next unused letter of that row, `C[start[r]]`, then move `start[r]` forward by 1. This is correct because, inside a row, the letters are stored in the order of their indices: the `j`-th letter of row `r` in the encrypted message is indeed the `j`-th letter of the message landing on that row.

Cost: two passes of `N` steps and an array of `min(K, N)` cells, so work proportional to `N`. Building the full grid, `K` rows of `N` cells, would take up to 150,000 × 150,000 cells. The message is built in a list joined with `join` at the end.
