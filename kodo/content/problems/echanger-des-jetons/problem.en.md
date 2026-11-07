---
title: Exchanging tokens
---

## Statement
A token carries a non-negative integer, its **value**. A token of value n can be exchanged for three tokens, of values ⌊n/2⌋, ⌊n/3⌋ and ⌊n/5⌋ (integer divisions). Each token obtained can in turn be exchanged, or kept. For example, a token of value 100 is exchanged for 50, 33 and 20, 103 in total; by then exchanging the token 50 for 25, 16 and 10, the total goes up to 104.

For Q starting tokens, find the largest total value that can be obtained.

## Input
The first line contains Q. Each of the next Q lines contains the value N of a starting token.

## Output
Q lines: for each token, the largest total value that can be obtained.

## Constraints
- 1 ≤ Q ≤ 50
- 0 ≤ N ≤ 10¹⁸

## Hints
1. Let `v(n)` be the best value from a token n. Either the token is kept, or it is exchanged and each of the three new tokens is handled as well as possible: `v(n) = max(n, v(⌊n/2⌋) + v(⌊n/3⌋) + v(⌊n/5⌋))`.
2. Programmed as is, this function keeps recomputing the same values: `v(⌊n/6⌋)` is requested by `v(⌊n/2⌋)` and by `v(⌊n/3⌋)`, and so on. The number of calls explodes.
3. Store each value already computed in a dictionary (memoization). Very few different integers are actually reached.

## Solution
The best value obtained from a token n satisfies `v(0) = 0` and `v(n) = max(n, v(⌊n/2⌋) + v(⌊n/3⌋) + v(⌊n/5⌋))`. Indeed, either the token is kept, or it is exchanged; in that case the three new tokens evolve independently, and the best is to get the most out of each one.

**Why the direct version is too slow.** Without memory, the number of calls A(n) satisfies A(n) = 1 + A(⌊n/2⌋) + A(⌊n/3⌋) + A(⌊n/5⌋). Since 1/2 + 1/3 + 1/5 > 1, it grows faster than n itself: about 10¹⁹ calls for N = 10¹⁸ (and already 4 million for N = 10⁶).

**Memoization.** Before computing `v(n)`, look it up in a dictionary; if it is not there, compute it and store it. Each value is then computed only once. The integers reached are all of the form ⌊N / (2^a 3^b 5^c)⌋, since ⌊⌊x/p⌋/q⌋ = ⌊x/(pq)⌋. With a ≤ 59, b ≤ 37 and c ≤ 25, and only the triples for which 2^a 3^b 5^c ≤ N, this gives about 7,000 different values for N = 10¹⁸. The dictionary is shared between questions.

The depth of the calls does not exceed 61, since the value is at least halved at each level. In C++, use a `map<long long, long long>`; the results stay below 4 × 10¹⁸ and fit in a `long long`.
