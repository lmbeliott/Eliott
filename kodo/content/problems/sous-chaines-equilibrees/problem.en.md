---
title: Balanced substrings
---

## Statement
You are given a string of N letters, all chosen among the first K letters of the alphabet (`a`, `b`, `c`…). A substring (a sequence of consecutive letters of the string) is **balanced** if each of the K letters appears the same number of times in it. For example, with K = 3, `cab` and `abcbac` are balanced, but not `abca` nor `ab` (`c` does not appear in it).

Write a program that counts the balanced substrings. Two substrings with the same letters but at different positions in the string count twice.

## Input
- The first line contains two integers N and K.
- The second line contains the string of N lowercase letters, all among the first K letters of the alphabet.

## Output
A single integer: the number of balanced substrings.

## Constraints
- 1 ≤ N ≤ 100,000
- 1 ≤ K ≤ 26

## Hints
1. Testing every substring means about N² / 2 = 5 × 10⁹ cases for N = 100,000: far too many. As with sums over intervals, count the letters in each **prefix**: the number of `c`s between positions i + 1 and j is (number of `c`s in the first j letters) − (number of `c`s in the first i letters).
2. The substring between prefixes i and j is balanced when every letter gained as many occurrences as `a` between i and j. In other words, for every letter `c`, the difference (number of `c`s) − (number of `a`s) is the same in prefix i and in prefix j.
3. Give each prefix the list of its K differences "count of the letter − count of `a`". Balanced substrings correspond exactly to pairs of prefixes that have the same list: count them with a dictionary, using the list (a `tuple` in Python) as the key.

## Solution
**From prefixes to pairs.** Let `cnt_c(i)` be the number of letters `c` among the first i letters of the string (with `cnt_c(0) = 0`). The substring that goes from position i + 1 to position j contains `cnt_c(j) − cnt_c(i)` letters `c`. It is balanced when this number is the same for every letter, so equal to that of the `a`s:

`cnt_c(j) − cnt_c(i) = cnt_a(j) − cnt_a(i)`, that is `cnt_c(j) − cnt_a(j) = cnt_c(i) − cnt_a(i)`, for every letter `c`.

So we give each prefix its **signature**: the list of differences `cnt_c − cnt_a`, for the K letters. A substring is balanced if and only if the two prefixes that delimit it have the same signature.

**Counting the pairs.** We go through the string and update the signature at each letter: a letter `c` other than `a` increases its difference by 1, and an `a` decreases all the others by 1. A dictionary `vus` (*seen*) counts how many previous prefixes had each signature (at the start, the empty prefix, whose signature contains only 0s). For each new prefix, we add `vus[signature]` to the answer, then increment `vus[signature]`. It is the same idea as counting the subarrays with a given sum, with a list of numbers instead of a single number.

In the first example (K = 2), the difference `cnt_b − cnt_a` of the prefixes of `aabbab` is successively 0, −1, −2, −1, 0, −1, 0. The value 0 appears 3 times (3 pairs), so does the value −1 (3 pairs), and −2 only once: 6 balanced substrings, which are `ab`, `ba`, `ab`, `aabb`, `abba` and `aabbab`.

**Complexity.** Each letter updates the signature and looks it up in the dictionary in O(K): O(N × K) in total, a few million operations.

**Why the naive solution is too slow.** Even when updating the counters as the substring grows, going through all the substrings costs N² / 2 = 5 × 10⁹ steps for N = 100,000.

**Traps.**
- Do not forget the empty prefix: without it, the substrings that start at the first letter are never counted.
- In Python, a list cannot be a dictionary key: you have to turn it into a `tuple`. In C++, a `map<vector<int>, long long>` works.
- With K = 1, every substring is balanced: there are N × (N + 1) / 2 of them, more than 5 × 10⁹. You need a `long long` in C++.
- A letter among the K that never appears in the string makes every substring unbalanced: the answer is then 0, and the signature takes care of it by itself.
