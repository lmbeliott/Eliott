---
title: Tokens of three colours
---

## Statement
A bag contains `R` red tokens, `V` green ones and `B` blue ones. An **operation** consists in taking two tokens of different colours and replacing them by two tokens of the third colour. For example, a red one and a green one become two blue ones.

Print the smallest number of operations that makes all the tokens the same colour, or `-1` if it is impossible. If all the tokens already have the same colour, the answer is 0.

The input contains `T` questions.

## Input
- The first line contains `T`.
- Each of the next `T` lines contains three integers `R`, `V` and `B`.

## Output
For each question, one line with the minimum number of operations, or `-1`.

## Constraints
- 1 ≤ T ≤ 5,000
- 0 ≤ R, V, B ≤ 10⁹
- R + V + B ≥ 1

## Hints
1. An operation changes the three numbers by `−1`, `−1` and `+2`, in some order. What happens to the difference between two of these numbers, modulo 3?
2. To end with only blue tokens, the red and green ones must disappear. How many operations are needed at least, given that an operation removes at most one red token?
3. If `R ≡ V (mod 3)`, all the tokens can be made blue in exactly `max(R, V)` operations. Try the three final colours.

## Solution
**An invariant.** An operation adds `−1`, `−1` and `+2` to the three numbers, in some order. So the difference between two of them changes by 0, `+3` or `−3`: **modulo 3, the differences do not change**. To end with only blue tokens, you need `R = V = 0` at the end, so `R ≡ V (mod 3)` from the start. This is a necessary condition, and likewise for the other two colours.

**A lower bound.** An operation decreases each number by at most 1. To make `R` red and `V` green tokens disappear, at least `max(R, V)` operations are needed.

**This bound is reached** when `R ≡ V (mod 3)`. Suppose `R ≤ V` (the other case is symmetric). If `R = B = 0`, all tokens are already green and the answer is 0: this case is covered by the (red, blue) pair. Otherwise, while `R < V`, replace a green and a blue token by two red ones if `B ≥ 1` (the gap `V − R` decreases by 3), and otherwise a red and a green one by two blue ones (possible since `R ≥ 1`; the gap does not change, but `B` becomes 2). Since `V − R` is a multiple of 3, the gap ends up at zero; then make the operation red + green → blues `R` times. Each operation removes exactly one green token, and you stop when there are none left: exactly `V = max(R, V)` operations have been made.

So the answer is the smallest `max(x, y)` among the three pairs of colours `(x, y)` such that `x ≡ y (mod 3)`, and `-1` if no pair fits. For example, `(1, 4, 0)` gives 4 (red-green pair), and `(2, 1, 0)` gives `-1`, since the three remainders 2, 1 and 0 are all different.

**Cost.** A few operations per question. Simulating or exploring every sequence of operations would be out of reach with numbers up to 10⁹.
