---
title: Pairs of amicable numbers
---

## Statement
For an integer `m ≥ 2`, let `s(m)` be the sum of its divisors strictly smaller than itself. Two different integers `a` and `b` are **amicable** if `s(a) = b` and `s(b) = a`.

For example, `s(220) = 1 + 2 + 4 + 5 + 10 + 11 + 20 + 22 + 44 + 55 + 110 = 284` and `s(284) = 1 + 2 + 4 + 71 + 142 = 220`: 220 and 284 are amicable.

Find all pairs of amicable numbers `a < b` with `b ≤ N`.

## Input
A single line containing the integer `N`.

## Output
On the first line, the number of pairs. Then one line per pair, with `a` and `b` separated by a space, in increasing order of `a`.

## Constraints
- 1 ≤ N ≤ 100,000

## Hints
1. Computing `s(m)` for each `m` by trying all divisors up to `√m` takes about 20 million operations: more than a second in Python. You can do far less work by computing all the `s(m)` at once, in a list.
2. Turn the question around: instead of looking for the divisors of each `m`, start from each divisor `d` and add it to all its multiples `2d, 3d, 4d…` up to `N`.
3. Then, for each `a`, let `b = s[a]` and check `a < b ≤ N` and `s[b] == a`. The condition `b ≤ N` must be tested before reading `s[b]`.

## Solution
Fill a list `s` of size `N + 1`, at 0 to start with. For each `d` from 1 to `N // 2`, add `d` to `s[2d]`, `s[3d]`, `s[4d]`…: these are exactly the numbers of which `d` is a divisor strictly smaller than them. At the end, `s[m]` is the sum of the proper divisors of `m`.

How many operations? For a fixed `d`, there are about `N / d` multiples. The total is `N/1 + N/2 + N/3 + … + N/(N/2)`, that is `N` times the sum of the inverses, which grows very slowly (like the logarithm): about 1.1 million additions for `N = 100,000`. The direct method, which tests all divisors up to `√m` for each `m`, would make more than 20 million.

Then go through `a` from 2 to `N`. Let `b = s[a]`; the pair fits if `a < b`, if `b ≤ N` and if `s[b] = a`. The condition `a < b` counts each pair only once, by its smaller element, and rules out **perfect numbers** like 6 or 28, for which `s(a) = a`. The condition `b ≤ N` avoids going out of the list: `s(a)` can exceed `N`, for example `s(63,020) = 76,084`.

Since `a` increases, the pairs are found in the required order. Store them in a list so that you can print their number first.
