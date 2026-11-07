---
title: Two disjoint palindromes
---

## Statement
A **palindrome** is a word that reads the same in both directions, like `kayak` or `abba`. A single letter is a palindrome.

You are given a word `S` of length `N`. You must choose two pieces of `S` (runs of consecutive letters) that are palindromes and don't overlap: the first one must end strictly before the second one starts.

Write a program that computes the greatest possible product of the lengths of the two chosen palindromes.

## Input
A single line containing the word `S`, made of lowercase letters.

## Output
A single integer: the greatest product of the two lengths.

## Constraints
- 2 ≤ N ≤ 100 000

## Hints
1. Cut the word between positions `i` and `i + 1`: you need the longest palindrome entirely to the left of the cut and the longest one entirely to the right. Everything comes down to knowing, for each position, the longest palindrome that **ends** there (and the one that **starts** there).
2. Manacher's algorithm gives in O(N), for each center, the radius of the longest palindrome centered there. The maximal palindrome of a center gives one end and one start.
3. A palindrome ending at `e + 1`, without its first and last letters, is a palindrome ending at `e`. So `end[e] ≥ end[e + 1] - 2`, and this rule, together with the maximal palindromes, is enough to find every `end[e]`.

## Solution
**Reduction.** Two disjoint palindromes are separated by at least one cut, between `i` and `i + 1`. For a fixed cut, we take the longest palindrome of `S[0..i]` and the longest one of `S[i+1..N-1]`, since both lengths are positive. The answer is the maximum, over all cuts, of `left[i] × right[i + 1]`. So we only need `end[e]`, the length of the longest palindrome ending at `e`, and `start[x]`, the length of the longest one starting at `x`. We get `left` and `right` from them with running maximums.

**Manacher.** We insert a separator between the letters (`#a#b#a#`) to handle palindromes of even and odd length the same way. The array `p[i]` gives the radius of the longest palindrome centered at `i`. We keep the palindrome `[c - p[c], c + p[c]]` that reaches furthest to the right. For `i` inside it, the mirror `2c - i` already gives `p[i] ≥ min(d - i, p[2c - i])`, then we extend. Each successful extension moves `d` forward: the whole thing is **O(N)**. The maximal palindrome centered at `i` has length `p[i]` in the original word, and it starts at `(i - p[i]) / 2`.

**The ends.** The longest palindrome ending at `e` has some center `c`. Either the maximal palindrome centered at `c` ends exactly at `e`, and we recorded it. Or it goes further: it then contains a palindrome that ends at `e + 1` and is 2 letters longer. So by going through `e` from right to left with `end[e] = max(end[e], end[e + 1] - 2)`, we get every `end[e]`. Same for the starts, from left to right. Total: **O(N)**.

Why simple ideas fail: growing a palindrome around each of the 2N - 1 centers costs O(N²) on `aaaa…a` or `abab…ab`, which means billions of comparisons for N = 100 000.

Traps:
- The product reaches `50 000 × 50 000 = 2.5 × 10⁹`: in C++, use `long long`.
- Recording only the maximal palindromes is not enough: in `abcba`, the longest palindrome ending at position 3 is `bcb`, but the maximal palindrome with the same center is `abcba`, which goes further. The propagation `end[e + 1] - 2` handles this case.
- Even-length palindromes count too.
