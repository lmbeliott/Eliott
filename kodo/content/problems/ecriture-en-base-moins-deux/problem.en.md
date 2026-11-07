---
title: Writing in base minus two
---

## Statement
In base −2, an integer is written with digits 0 and 1, the digit of rank `i` (counting from 0 on the right) being worth `(−2)ⁱ`. For example, `11011` is worth `16 − 8 + 0 − 2 + 1 = 7`, and `11` is worth `−2 + 1 = −1`. Every integer, positive or negative, has a unique writing in base −2 that does not start with 0 (except 0 itself, written `0`).

For each of the `T` given integers, print its writing in base −2.

## Input
- The first line contains `T`.
- Each of the next `T` lines contains an integer `N`.

## Output
For each integer, one line with its writing in base −2.

## Constraints
- 1 ≤ T ≤ 1,000
- −10¹⁸ ≤ N ≤ 10¹⁸

## Hints
1. As in base 2, the rightmost digit is fixed by the parity of `N`: it is 0 if `N` is even, 1 otherwise.
2. Once the rightmost digit `r` is removed, the rest of the writing represents `(N − r) / (−2)`. Start again with this number, until 0.
3. Why does the loop stop? Look at how `|n|` evolves, and handle the cases `n = 1` and `n = −1` separately.

## Solution
If `N` is written `c_k … c_1 c_0` in base −2, then `N = c_0 + (−2) × M`, where `M` is written `c_k … c_1`. So the digit `c_0` has the parity of `N`, and `M = (N − c_0) / (−2)`, an exact division since `N − c_0` is even. The digits come out from right to left: while `n ≠ 0`, compute `r` (0 if `n` is even, 1 otherwise), store `r`, then replace `n` by `(n − r) / (−2)`. Finally, print the digits in reverse order.

**Invariant.** After `k` turns, writing `v` for the value of the `k` digits already stored, `N = v + (−2)ᵏ × n`. It holds at the start (`k = 0`, `v = 0`, `n = N`), and a turn keeps it, since `n = r + (−2) × n'`. When `n = 0`, `N = v`: the stored digits are indeed the writing of `N`.

**Termination.** If `|n| ≥ 2`, then `|n'| = |n − r| / 2 ≤ (|n| + 1) / 2 < |n|`: the absolute value strictly decreases. It cannot decrease forever: you end up reaching `n ∈ {−1, 0, 1}`. But beware, `|n|` does not always decrease: `−1` gives `r = 1` and `n' = 1`, then `1` gives `n' = 0`. So the loop always stops, in at most two more turns. Since `|n|` is (roughly) at least halved at each turn, there are at most about 64 turns for `|N| ≤ 10¹⁸`.

**Traps.** In Python, `n % 2` is 0 or 1 even if `n` is negative, and `(n − r) // (−2)` is exact. In C++, `n % 2` is −1 for a negative odd `n`: take `r = 1` as soon as `n % 2 != 0`. The case `N = 0` must print `0`, while the loop makes no turn.
