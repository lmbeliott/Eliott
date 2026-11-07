---
title: Cutting bars
---

## Statement
We have N metal bars; bar number i is Lᵢ centimetres long. We can make at most K cuts. A cut splits a piece into two pieces whose lengths are positive **integer** numbers of centimetres.

Print the smallest possible length of the longest piece obtained.

For example, with bars of 7 and 5 centimetres and K = 2, we can cut the first into 3 + 4 and the second into 2 + 3: the longest piece is 4 long. We cannot do better.

## Input
The first line contains N and K. The second line contains the N lengths L₁, …, L_N.

## Output
The smallest possible length of the longest piece.

## Constraints
- 1 ≤ N ≤ 10,000
- 0 ≤ K ≤ 10⁹
- 1 ≤ Lᵢ ≤ 10⁹

## Hints
1. Turn the question around: for a given length X, how many cuts are needed at least so that every piece is at most X long?
2. A bar of length L must be cut into at least ⌈L / X⌉ pieces, so ⌈L / X⌉ − 1 cuts, and this number is enough.
3. If X is possible, every larger length is too: look for the smallest possible X by binary search.

## Solution
**The test for a length X.** A bar of length L cut into pieces of at most X centimetres has at least ⌈L / X⌉ pieces, since their total is L. So at least ⌈L / X⌉ − 1 cuts are needed, and this number is enough: cut pieces of X centimetres while the rest exceeds X. With integers, ⌈L / X⌉ is written (L + X − 1) // X. The length X is **possible** if the sum of these numbers of cuts, over all bars, is at most K.

**Monotonicity and binary search.** If X is possible, so is X + 1, because each ⌈L / X⌉ can only decrease when X grows. So we look for the smallest possible X, with the invariant "lo is not possible, hi is possible". The length max(Lᵢ) is possible without any cut: start from hi = max(Lᵢ) and lo = 0 (a zero length is never possible). At the end, hi is the answer.

**Cost.** The binary search makes about thirty steps, and each test goes through the N bars: about 30 × N operations. Trying every length X one by one would cost up to 10⁹ × N operations. In C++, the sum of the cuts can reach 10¹³: keep it in a `long long`, or stop as soon as it exceeds K.
