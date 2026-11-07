---
title: Pebbles and carries
---

## Statement
`N` boxes stand in a row, numbered from 1 to `N`, and box `i` contains `Cᵢ` pebbles. An **operation** consists in choosing a box `i < N` containing at least 2 pebbles, removing 2 of them, and adding 1 pebble to box `i + 1`. Operations are made, in any order, until none is possible.

One can show that the process always stops, and that the number of operations and the final state do not depend on the order chosen. Print this number of operations and the final contents of the boxes.

## Input
- The first line contains `N`.
- The second line contains the `N` integers `C₁, …, Cₙ`.

## Output
- On the first line, the number of operations.
- On the second line, the `N` numbers of pebbles at the end, separated by spaces.

## Constraints
- 1 ≤ N ≤ 15,000
- 0 ≤ Cᵢ ≤ 10⁹

## Hints
1. The total number of pebbles decreases by 1 with each operation: that is why the process stops. But simulating the operations one by one can take thousands of billions of them.
2. An operation in box `i` does not touch the boxes on its left. So you can empty box 1 "as much as possible" in one go, then box 2, and so on.
3. To justify that the order does not matter, look for a quantity that does not change: give each pebble in box `i` the value `2^(i − 1)`.

## Solution
**A fast method.** The operations made in box `i` only modify boxes `i` and `i + 1`. So handle the boxes from left to right: in box `i` (for `i < N`), which then contains `c` pebbles, make the `q = c // 2` possible operations in one go. `c % 2` pebble remains, and box `i + 1` receives `q`. No later operation touches box `i` again. At the end, each box except the last one contains 0 or 1 pebble: no operation is possible any more. The number of operations is the sum of the `q`.

**Why the order does not matter.** Give each pebble in box `i` the value `2^(i − 1)`, and let `S` be the total value. An operation removes two pebbles of value `2^(i − 1)` and adds one pebble of value `2^i`: `S` does not change, it is an **invariant**. At the end, boxes 1 to `N − 1` contain 0 or 1 pebble, and box `N` contains `m`. Then `S = b₁ + 2 b₂ + … + 2^(N−2) b_(N−1) + 2^(N−1) m`, with each `bᵢ` equal to 0 or 1: this is the writing of `S` in base 2 for its last `N − 1` digits, and `m` is the quotient of `S` by `2^(N−1)`. So this final state is entirely determined by `S`, whatever the order of the operations.

**Termination.** The total number of pebbles is a non-negative integer that decreases by 1 with each operation: it is a **variant**, and the process stops. Better: the number of operations is exactly the number of pebbles at the start minus the number at the end, which is fixed. So it does not depend on the order either.

**Cost.** One pass over the boxes: on the order of `N` operations, instead of one per pebble removed, up to 1.5 × 10¹³. The numbers of pebbles received can exceed 2³¹: in C++, `long long` is needed.
