---
title: Neither square nor cube
---

## Statement
We write in increasing order the positive integers that are **neither a square** (1, 4, 9, 16, …) **nor a cube** (1, 8, 27, 64, …): 2, 3, 5, 6, 7, 10, 11, 12, 13, 14, 15, 17…

Answer T questions: for a given K, print the K-th number of this list.

## Input
The first line contains T. Each of the next T lines contains an integer K.

## Output
T lines: for each question, the K-th number of the list.

## Constraints
- 1 ≤ T ≤ 100
- 1 ≤ K ≤ 10¹⁸

## Hints
1. Count the numbers of the list that are at most x: remove from x the number of squares and the number of cubes up to x, without removing twice the numbers that are both squares and cubes.
2. A number is both a square and a cube if and only if it is a sixth power. There are ⌊√x⌋ squares up to x: these are integer roots, to be computed without floating-point numbers.
3. The answer is the smallest x whose count reaches K; it lies between K and 2K.

## Solution
**Counting.** Among 1, …, x, there are ⌊√x⌋ squares (1², 2², …, ⌊√x⌋²) and ⌊∛x⌋ cubes. An integer n ≥ 1 is both a square and a cube if and only if it is a sixth power: in its prime factorization, every exponent is even and a multiple of 3, hence a multiple of 6. There are ⌊x^(1/6)⌋ of them. The number of elements of the list up to x is therefore f(x) = x − ⌊√x⌋ − ⌊∛x⌋ + ⌊x^(1/6)⌋.

**Exact integer roots.** These roots are computed by binary search, as in the lesson, with powers computed without overflow. One can also notice that ⌊x^(1/6)⌋ = ⌊∛⌊√x⌋⌋. Floating-point functions are off by one for large x, and the tests contain squares and cubes close to 10¹⁸.

**Searching for the answer.** f is non-decreasing, and increases exactly at the elements of the list: the K-th element is the smallest x such that f(x) ≥ K. Since f(x) ≤ x, the answer is at least K; and f(2K) ≥ K, because there are at most √(2K) + ∛(2K) squares or cubes up to 2K, which does not exceed K. A binary search between K − 1 (f(K − 1) < K) and 2K finds the answer in about sixty steps, each with two or three integer roots.

**Cost.** A few thousand operations per question. Listing the integers one by one would take about K steps, up to 10¹⁸.
