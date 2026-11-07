---
title: Integer square root
---

## Statement
For each of the `Q` given integers `N`, print its **integer square root** `R`, that is the largest integer such that `R × R ≤ N`, then the gap `N − R × R`.

For example, for `N = 30`, we have 5 × 5 = 25 ≤ 30 < 36 = 6 × 6: print `5 5`.

## Input
The first line contains the integer `Q`. Each of the next `Q` lines contains an integer `N`.

## Output
`Q` lines: for each `N`, in order, the integers `R` and `N − R × R` separated by a space.

## Constraints
- 1 ≤ Q ≤ 1,000
- 0 ≤ N ≤ 10¹⁸

## Hints
1. `N ** 0.5` in Python, or `sqrt(N)` in C++, gives an approximate value of the root. For large `N`, it can be off by one once converted to an integer: for example for `N = 999,999,999,999,999,999`.
2. Start from this approximate value `R`, then correct it with integers, which are exact.
3. While `R × R > N`, decrease `R`. Then, while `(R + 1) × (R + 1) ≤ N`, increase `R`. At the end, `R × R ≤ N < (R + 1) × (R + 1)`.

## Solution
Trying every integer `R` from 0 is too slow: the root of 10¹⁸ is 10⁹. So use the float root as a starting point: `R = int(N ** 0.5)`.

This value is almost right, but not always. A float only keeps about 16 significant digits, and `N = 10¹⁸ − 1` is converted to exactly 10¹⁸: its float root is 10⁹, whereas the right answer is 999,999,999, since (10⁹)² = 10¹⁸ exceeds `N`.

So correct `R` with integer computations, which are exact:
- while `R × R > N`, decrease `R` by 1;
- while `(R + 1) × (R + 1) ≤ N`, increase `R` by 1.

When both loops are done, both conditions are false: `R × R ≤ N < (R + 1) × (R + 1)`, which is exactly the definition of the integer square root. The starting error never exceeds one or two units, so each loop makes very few turns.

In C++, `R` is at most about 10⁹ and `(R + 1) × (R + 1)` about 10¹⁸: everything fits in a `long long`.
