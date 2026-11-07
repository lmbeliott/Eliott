---
title: Writing with only 1s
---

## Statement
In base 2, the integer 31 is written `11111`, and in base 5 it is written `111`, since 31 = 1 + 5 + 25. For every integer N ≥ 3, there is at least one base b ≥ 2 in which N is written only with digits 1: for example base N − 1, where N is written `11`.

Answer T questions: for a given N, print the **smallest** base b ≥ 2 in which N is written only with digits 1.

## Input
The first line contains T. Each of the next T lines contains an integer N.

## Output
T lines: for each question, the smallest base that works.

## Constraints
- 1 ≤ T ≤ 100
- 3 ≤ N ≤ 10¹⁸

## Hints
1. N is written with m digits 1 in base b if and only if N = 1 + b + b² + … + b^(m−1). How many digits at most? Since b ≥ 2, N ≥ 2^(m−1).
2. For a fixed number of digits m, the sum 1 + b + … + b^(m−1) grows with b: you can search for b by binary search.
3. The more digits, the smaller the base. So try m from 60 down to 2, and stop at the first length for which a base exists.

## Solution
**Writing an equation.** N is written `11…1` (m digits) in base b if and only if N = S_m(b) = 1 + b + b² + … + b^(m−1). Since b ≥ 2, S_m(b) ≥ 2^(m−1), so m − 1 ≤ log₂(10¹⁸) < 60: there are at most 60 digits. And m = 2 always works, with b = N − 1.

**More digits, smaller base.** If N = S_m(b) = S_m'(c) with m' > m, then c < b: otherwise S_m'(c) ≥ S_m'(b) > S_m(b), since we add positive terms. So we try the lengths from m = 60 down to m = 2, and the first one that admits a base gives the answer.

**Binary search on the base.** For a fixed m, S_m is strictly increasing in b, so there is at most one base b with S_m(b) = N, and we find it by binary search: look for the smallest b such that S_m(b) ≥ N, then check equality. Since b^(m−1) ≤ N < 2⁶⁰, the base is below 2^(⌊60 / (m − 1)⌋ + 1): this is the upper bound of the search. To compute S_m(b) without overflow, add the powers one by one and stop as soon as the sum exceeds N, checking before each multiplication that the next power does not exceed N.

**Cost.** For each m, about 60 / (m − 1) binary search steps, each with at most m multiplications: a few thousand operations per question. Trying every base b = 2, 3, … would take up to 10¹⁸ attempts when the answer is N − 1.
