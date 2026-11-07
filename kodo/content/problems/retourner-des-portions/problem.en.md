---
title: Reverse portions
---

## Statement
`M` operations are applied to a sequence of `N` integers, whose positions are numbered from 1 to `N`. The operation `L R` reverses the portion going from position `L` to position `R`: its elements are put back in reverse order, the rest does not move. Print the sequence after the `M` operations, applied in order.

For example, the operation `2 4` turns `1 2 3 4 5` into `1 4 3 2 5`.

## Input
The first line contains `N` and `M`. The second line contains the `N` integers of the sequence. Each of the next `M` lines contains an operation: two integers `L` and `R`.

## Output
A single line with the `N` integers of the final sequence, separated by spaces.

## Constraints
- 1 ≤ N ≤ 1,000
- 1 ≤ M ≤ 1,000
- 1 ≤ L ≤ R ≤ N
- Each integer of the sequence is between −10⁹ and 10⁹.

## Hints
1. Positions in the statement start at 1, array indices at 0: position `L` corresponds to index `L - 1`.
2. To reverse a portion, swap its two ends, then move both indices one step closer, and start again.
3. With two indices `i = L - 1` and `j = R - 1`: while `i < j`, swap `t[i]` and `t[j]`, then `i` increases and `j` decreases.

## Solution
Each operation is done in place, with swaps. Put an index `i` at the start of the portion (`L − 1`) and an index `j` at the end (`R − 1`). While `i < j`, swap `t[i]` and `t[j]`, then move `i` forward and `j` backward. When the two indices cross or meet, the portion is reversed: the middle element, if any, does not need to move.

The traps: forgetting the shift between positions (from 1) and indices (from 0), and going on swapping beyond the middle, which would put the portion back in its starting order. Each operation makes at most `N / 2` swaps, that is at most 500,000 swaps in all: it is fast.
