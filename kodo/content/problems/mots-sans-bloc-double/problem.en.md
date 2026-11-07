---
title: Words without a doubled block
---

## Statement
Consider the words written with the three letters `a`, `b` and `c`. A word contains a **doubled block** if it contains two identical pieces glued to each other: for example `abcbc` contains `bcbc`, `cabbac` contains `bb`, and `abacabac` is itself made of `abac` repeated. The word `abcacb` contains no doubled block.

You are given a length `N` and a word start `P`. Count the words of length `N` that start with `P` and contain no doubled block, and give the first of them in alphabetical order.

## Input
A single line containing the integer `N` and the word `P`, separated by a space.

## Output
On the first line, the number of suitable words. If it is not 0, on the second line, the first of these words in alphabetical order.

## Constraints
- 1 ≤ N ≤ 30
- 1 ≤ length of `P` ≤ N, and `P` only contains the letters `a`, `b` and `c`

## Hints
1. There are `3^30 ≈ 2 × 10¹⁴` words of length 30: impossible to write them all. Build the word letter by letter and abandon a branch as soon as a doubled block appears.
2. If the word `w` has no doubled block, a doubled block of `w` followed by a letter must end at the end of the word: it is enough to compare, for each length `l`, the last `l` letters with the `l` before them.
3. If the letters are tried in the order `a`, `b`, `c`, the first complete word found is the smallest in alphabetical order.

## Solution
Build the word letter by letter, by backtracking. After each addition, check that the word does not **end** with a doubled block: for each length `l` from 1 to half the length, compare the last `l` letters with the `l` letters before them. This is enough, since any doubled block that does not touch the last letter was already present before the addition, and the branch would have been cut earlier. Start by adding the letters of `P` (if one of them creates a doubled block, the answer is 0), then try `a`, `b` and `c` at each position.

**Counting and finding.** When the word reaches length `N`, count it; the first complete word met is the smallest, since branches are explored in alphabetical order. To only find this word, one could stop there; to count, the whole tree must be visited.

**Size of the tree.** The nodes of the tree are exactly the words without a doubled block of length at most `N` that start with `P`. Their number grows slowly: there are 34,422 words of length 30 without a doubled block, and about 150,000 nodes in total. Each node costs O(N²) comparisons in the worst case, often much less since comparisons stop at the first difference.

**A bit of mathematics.** With only two letters, every word of length 4 contains a doubled block (try `abab`, `abba`, `abaa`…). With three letters, a theorem of Axel Thue (1906) states that there are words without a doubled block of every length. Some word starts still cannot be extended: `abacaba` cannot be followed by any letter.
