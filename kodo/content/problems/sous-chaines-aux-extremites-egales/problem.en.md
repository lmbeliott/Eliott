---
title: Substrings with equal ends
---

## Statement
A word of `N` lowercase letters is given. Count its substrings of at least two letters that start and end with the same letter. Two substrings at different positions are counted separately, even if they are equal.

For example, `abca` has only one (`abca`), and `aaa` has three (`aa` twice, and `aaa`).

## Input
- The first line contains the integer `N`.
- The second line contains the word.

## Output
The number of substrings.

## Constraints
- 1 ≤ N ≤ 100,000

## Hints
1. A substring is determined by its first and its last position. Trying every pair would take about 5 × 10⁹ comparisons for `N = 100,000`.
2. A valid substring corresponds to a pair of positions `i < j` holding the same letter. How many such pairs are there for a letter that appears `c` times?
3. With `c` occurrences, you choose two positions among `c`: there are `c × (c − 1) / 2` ways.

## Solution
A substring of at least two letters is determined by the pair `(i, j)` of its start and end positions, with `i < j`. It is valid exactly when the word holds the same letter at positions `i` and `j`. So it is enough to count the pairs of positions `i < j` that hold the same letter.

This takes a single pass: when reaching position `j`, the letter `x` found there forms a pair with each occurrence of `x` met before. Keep a counting array of 26 cells, `seen[r]` being the number of occurrences of the letter of rank `r` before the current position. For each letter, add `seen[r]` to the total, **then** increase `seen[r]` by 1. Each pair `(i, j)` is counted exactly once, when `j` is reached.

This also gives a formula: a letter that appears `c` times gives `0 + 1 + … + (c − 1) = c × (c − 1) / 2` pairs. The answer is the sum of these numbers over the 26 letters.

The program does a constant number of operations per letter: work proportional to `N`, against about `N² / 2` for trying every pair. The answer can reach 5 × 10⁹ (a word made of a single repeated letter): in C++, a `long long` is needed.
