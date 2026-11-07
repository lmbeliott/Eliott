---
title: Pairs of equal values
---

## Statement
Count the pairs of positions `(i, j)`, with `i < j`, that hold the same value in a sequence of `N` integers.

For example, in `5 3 5 5 3`, the value 5 forms 3 pairs and the value 3 forms 1: the answer is 4.

## Input
The first line contains the integer `N`. The second line contains the `N` integers, separated by spaces.

## Output
A single integer: the number of pairs of positions with the same value.

## Constraints
- 1 ≤ N ≤ 30,000
- Each integer is between 1 and 1,000.

## Hints
1. Comparing every pair with two nested loops takes about `N × N / 2` comparisons, that is 450 million: far too slow in Python.
2. Only the number of occurrences of each value matters. How many pairs do `c` equal elements form?
3. Another method, in a single pass: when you meet a value `x`, it forms a pair with each previous occurrence of `x`. So add `cpt[x]` to the answer, then increase `cpt[x]`.

## Solution
Use a counting array `cpt` of 1,001 cells. Go through the sequence once. For each value `x`, the new occurrence forms a pair with each of the `cpt[x]` occurrences already seen: add `cpt[x]` to the answer, then do `cpt[x] = cpt[x] + 1`. Each pair `(i, j)` is counted exactly once, when you meet `j`.

You can also count first, then use a formula: a value that appears `c` times forms `c × (c − 1) / 2` pairs, because each of the `c` occurrences goes with the `c − 1` others, and each pair is then counted twice. Both methods give 3 pairs for three 5s: 0 + 1 + 2 with the first, 3 × 2 / 2 with the second.

The answer can reach 30,000 × 29,999 / 2, about 4.5 × 10⁸: it fits in an `int`, but a `long long` avoids any worry.
