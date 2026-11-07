---
title: Adding ramps
---

## Statement
An array has N cells, numbered from 1 to N, all equal to `0` at the start. Q operations are applied to it. Operation (L, R) adds a **ramp**: it adds 1 to cell L, 2 to cell L + 1, 3 to cell L + 2, and so on up to cell R, which receives R − L + 1. The other cells do not change.

Write a program that prints, after all the operations, the largest value in the array and the number of cells that have this value.

## Input
- The first line contains two integers N and Q.
- Each of the next Q lines contains two integers L and R: one operation.

## Output
Two integers separated by a space: the largest value in the array, then the number of cells that have this value.

## Constraints
- 1 ≤ N ≤ 1,000,000
- 1 ≤ Q ≤ 10,000
- 1 ≤ L ≤ R ≤ N

## Hints
1. Applying each operation cell by cell can cost N × Q = 10¹⁰ additions. You need to handle each operation in constant time, then rebuild the whole array in a single pass.
2. To add a single value to every cell from L to R, you know the prefix sum trick: write `+v` at L and `−v` at R + 1, then take running sums. Here, the value added to cell x is not constant, but it can be written `x − L + 1` = `1 × x + (1 − L)`.
3. Keep two difference arrays: one for the "slopes" (the coefficient of x) and one for the constants. Taking their running sums from left to right gives, for each cell x, a total slope `a` and a total constant `b`: its value is `a × x + b`.

## Solution
**The idea: split each ramp.** Operation (L, R) adds to cell x, for L ≤ x ≤ R, the value `x − L + 1`, which we write `1 × x + (1 − L)`. So the final value of a cell x is `a × x + b`, where `a` is the number of ramps covering x and `b` is the sum of the `1 − L` of those ramps.

`a` and `b` are sums of constant values over intervals: this is the difference array trick. For each operation, we do `pente[L] += 1` and `pente[R + 1] −= 1` (*pente* means "slope"), then `constante[L] += 1 − L` and `constante[R + 1] −= 1 − L`. Then, going through the cells from 1 to N, the running sums of `pente` and `constante` give exactly `a` and `b` for the current cell. We compute its value and update the maximum and the number of cells that reach it.

In the first example, the ramp (2, 5) alone would give cell 5 the values a = 1 and b = 1 − 2 = −1, so 5 − 1 = 4… but the ramp (4, 8) also covers it: a = 2, b = −1 + (1 − 4) = −4, and the value is 2 × 5 − 4 = 6.

**Complexity.** O(1) per operation, then one pass over N cells: O(N + Q).

**Why the naive solution is too slow.** Adding each ramp cell by cell costs up to N additions per operation, that is 10¹⁰ for N = 1,000,000 and Q = 10,000: several seconds even in C++, hours in Python.

**Another way to see it.** You can also use second differences: a ramp has a constant difference (+1) between neighbouring cells, so its differences of differences are non-zero in only three places (L, R + 1 and R + 2). Two successive running sums rebuild the array. It is the same idea, one step further.

**Traps.**
- The values go beyond 2³¹: up to Q × N = 10¹⁰. Use `long long` in C++.
- The difference arrays need a cell N + 1, because R + 1 can be N + 1.
- The constants `1 − L` are negative: the value `a × x + b` is still always zero or positive.
