---
title: Remainder of a large number
---

## Statement
Print the remainder of the division of a very large integer `N` by an integer `M`. `N` can have up to 100,000 digits.

## Input
The first line contains `N`, written without useless leading zeros. The second line contains `M`.

## Output
A single integer: the remainder of the division of `N` by `M`, between `0` and `M − 1`.

## Constraints
- `N` has between 1 and 100,000 digits.
- 1 ≤ M ≤ 10⁹

## Hints
1. No C++ integer type can hold `N`, and in Python, `int()` refuses strings of more than 4,300 digits. You must read `N` as a string and process its digits one by one.
2. Reading `N` from left to right, the number formed by the first digits goes from `x` to `10 × x + d` when you add the digit `d`.
3. The remainder of `10 × x + d` by `M` only depends on the remainder of `x` by `M`. So you can keep only the remainder at each step: `r = (10 × r + d) % M`.

## Solution
Let `x` be the number formed by the first digits of `N`, and `r` its remainder by `M`. When you read the next digit `d`, the number becomes `10 × x + d`. Since `x = M × q + r` for some integer `q`, we have `10 × x + d = M × (10 × q) + (10 × r + d)`: the remainder of `10 × x + d` by `M` is therefore the remainder of `10 × r + d` by `M`.

You never need `x` itself: start from `r = 0`, and for each digit `d` of the string, compute `r = (10 × r + d) % M`. After the last digit, `r` is the remainder of `N` by `M`. It is the same method as long division, where only the remainder is kept.

Since `r < M ≤ 10⁹`, the value `10 × r + d` stays below 10¹⁰: in C++, it fits in a `long long`, but not in an `int`. The program makes a single pass over the string: 100,000 steps, instantaneous.
