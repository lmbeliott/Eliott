---
title: K-th multiple of A or B
---

## Statement
We write in increasing order all the positive integers that are multiples of A, or of B, or of both, without repetition. For A = 4 and B = 6, we get 4, 6, 8, 12, 16, 18, 20, 24…

Answer T questions: for given A, B and K, print the K-th number of this list.

## Input
The first line contains T. Each of the next T lines contains three integers A, B and K.

## Output
T lines: for each question, the K-th number of the list.

## Constraints
- 1 ≤ T ≤ 1,000
- 1 ≤ A, B ≤ 10⁹
- 1 ≤ K ≤ 10⁹

## Hints
1. It is easy to **count** the numbers of the list that are at most x: there are ⌊x/A⌋ multiples of A, ⌊x/B⌋ multiples of B, and the common multiples must not be counted twice.
2. The common multiples of A and B are exactly the multiples of their LCM, which is A / GCD(A, B) × B.
3. The number we want is the smallest x such that this count reaches K: a binary search on x, between 1 and K × min(A, B).

## Solution
**Count instead of listing.** Let f(x) be the number of elements of the list that are at most x. Among 1, …, x, there are ⌊x/A⌋ multiples of A and ⌊x/B⌋ multiples of B; the numbers counted twice are the common multiples, that is the multiples of L = LCM(A, B). So f(x) = ⌊x/A⌋ + ⌊x/B⌋ − ⌊x/L⌋. We compute L = A / GCD(A, B) × B, dividing **before** multiplying; L is at most A × B ≤ 10¹⁸ and fits in a `long long`.

**Search for the answer.** f is non-decreasing. The K-th number of the list is the smallest x such that f(x) ≥ K: below it, fewer than K numbers are at most x; and x itself is in the list, because f increases exactly at the elements of the list. We run a binary search with the invariant "f(lo) < K ≤ f(hi)", starting from lo = 0 and hi = K × min(A, B): the first K multiples of the smaller of the two are already in the list, so f(hi) ≥ K. This number is at most 10¹⁸.

**Cost.** About sixty steps per question, each in O(1), plus one GCD: instantaneous. Listing the numbers by merging the multiples of A and B would take K steps, up to 10⁹ per question.
