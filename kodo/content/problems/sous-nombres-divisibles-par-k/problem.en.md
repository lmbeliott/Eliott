---
title: Sub-numbers divisible by K
---

## Statement
A sequence of `N` digits `D` and an integer `K` are given, `K` being a divisor of 1,000. Each piece of consecutive digits of `D` reads as a number, leading zeros being allowed: in `1024`, the piece `02` is worth 2. Count the pieces whose value is divisible by `K`. Two pieces at different positions are counted separately.

For example, with `D = 1250` and `K = 25`, the pieces `0`, `25`, `50`, `125`, `250` and `1250` are valid: the answer is 6.

## Input
- The first line contains the integer `K`.
- The second line contains the `N` digits of `D`, written together.

## Output
The number of pieces divisible by `K`.

## Constraints
- 1 ≤ N ≤ 150,000
- `K` divides 1,000: `K` is 1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500 or 1,000.

## Hints
1. A number is divisible by 4 if and only if the number formed by its last two digits is. Why? What happens with three digits and a divisor of 1,000?
2. A number `x` with at least three digits can be written `x = 1000 × q + r`, where `r` is the number formed by its last three digits.
3. All the pieces of at least three digits ending at the same position have the same last three digits: they are all divisible by `K`, or none of them is.

## Solution
A number `x` with at least three digits can be written `x = 1000 × q + r`, where `r` (between 0 and 999) is formed by its last three digits. Since `K` divides 1,000, `K` divides `1000 × q`; so `K` divides `x` if and only if `K` divides `r`. The divisibility of a piece of at least three digits depends only on its last three digits.

Then count the pieces by their last position `j` (indices from 0):
- the one-digit piece `D[j]`: test it directly;
- the two-digit piece `D[j − 1]D[j]` (if `j ≥ 1`): test it directly;
- the pieces of at least three digits ending at `j` start at indices 0, 1, …, `j − 2`: there are `j − 1` of them. They all have the same last three digits `D[j − 2]D[j − 1]D[j]`. If this number is divisible by `K`, add `j − 1` to the total; otherwise, nothing.

Each piece has a single last position and a single length: it is counted exactly once. The program does a constant number of operations per position: work proportional to `N`. Computing the value of each of the `N × (N + 1) / 2` pieces, about 10¹⁰ here, would be far too slow, even when updating the remainder digit by digit. The answer can exceed 10¹⁰ (with `K = 1`, every piece is valid): in C++, a `long long` is needed.
