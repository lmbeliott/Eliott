---
title: Two groups with close sums
---

## Statement
You are given N positive integers. You must split them into two groups: each number goes into exactly one of the two groups, and a group may stay empty.

Write a program that computes the smallest possible difference between the sum of the first group and the sum of the second one.

## Input
- The first line contains an integer N.
- The second line contains the N integers.

## Output
A single integer: the smallest possible value of |sum of group 1 − sum of group 2|.

## Constraints
- 1 ≤ N ≤ 36
- Each integer is between 1 and 10¹².

## Hints
1. There are 2ᴺ ways to split, about 7 × 10¹⁰ for N = 36: too many to try them all. The numbers are too large for an array indexed by the sums. But 2¹⁸ ≈ 260,000 is small.
2. Cut the list into two halves. For each half, compute the sums of all its subsets (2¹⁸ sums each). A group 1 is made of a subset of the first half and a subset of the second half.
3. If group 1 has sum s, the difference is |total − 2s|. Sort the sums of the second half. For each sum a of the first half, use a binary search to find the sum b of the second half that makes 2 × (a + b) as close as possible to the total: you only need to look at the first one that reaches or exceeds this target, and the one just before it.

## Solution
**Reducing to a target sum.** If group 1 has sum s, group 2 has sum `total − s`, and the difference is `|total − 2s|`. So we are looking for the subset sum closest to `total / 2`.

**The idea: cut in two ("meet in the middle").** We split the list into two halves of N/2 numbers. We list the subsets of each half and their sums: each number is taken or not, which doubles the list of sums for each number. We get two lists `gauche` (*left*) and `droite` (*right*) of at most 2¹⁸ = 262,144 sums. A group 1 corresponds exactly to choosing a sum a in `gauche` and a sum b in `droite`, with s = a + b.

We sort `droite`. For each a, the best value of b is right around `total / 2 − a`. With a binary search, we find the first sum b such that `2 × (a + b) ≥ total`: it gives the difference `2 × (a + b) − total`. The sum just before it gives `total − 2 × (a + b)`. No other sum in `droite` can do better for this a: they are further from the target.

In the first example (7 3 2 9 4, total 25), the group {9, 3} has sum 12 and the other group 13: the difference is 1, and it cannot be zero because the total is odd.

**Complexity.** Listing the sums costs O(2^(N/2)) for each half, sorting costs O(2^(N/2) × N/2), and so do the searches: about 262,144 × 18 ≈ 5 × 10⁶ operations for N = 36.

**Why the naive solution is too slow.** Trying all 2³⁶ ≈ 7 × 10¹⁰ splits would take minutes in C++ and days in Python. Dynamic programming on the possible sums (an array of booleans indexed by the sum) does not work either: the sums go up to 3.6 × 10¹³.

**Traps.**
- The sums go beyond 2³¹: use `long long` in C++.
- Look at **both** candidates around the target: the first sum that reaches it and the one just before. When the binary search returns the start or the end of the list, one of the two does not exist.
- Sorting only one of the two lists is enough: the other one can be read in any order.
