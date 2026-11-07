---
title: Longest word
---

## Statement
Among `N` words, print the longest one, then its length. If several words have the maximal length, print the one that appears first.

## Input
The first line contains the integer `N`. The second line contains the `N` words, separated by spaces. Each word is made of lowercase letters.

## Output
A single line with the longest word, a space, then its length.

## Constraints
- 1 ≤ N ≤ 1,000
- Each word contains between 1 and 100 letters.

## Hints
1. `len(m)` gives the length of the word `m` (in C++, `m.size()`).
2. This is a maximum search: keep the best word found so far, and replace it when a word is **strictly** longer.

## Solution
Go through the words, keeping the best one found so far, initialised with the first word. Each time a word is strictly longer than the best one, it replaces it. At the end, print the best word and its length.

The trap: using `>=` instead of `>`. You would then keep the **last** of the words of maximal length, not the first. You must not compare the words themselves with `<` either: this comparison follows dictionary order, not length ("zoo" is greater than "abricot").
