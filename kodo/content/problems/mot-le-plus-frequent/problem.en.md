---
title: Most frequent word
---

## Statement
A text of `N` words is given. Print the word that appears most often and its number of occurrences. In case of a tie, choose the one whose first occurrence in the text comes earliest.

## Input
The first line contains the integer `N`. The second line contains the `N` words, separated by spaces. Each word is made of lowercase letters without accents.

## Output
The most frequent word, then its number of occurrences, separated by a space.

## Constraints
- 1 ≤ N ≤ 20,000
- Each word has between 1 and 10 letters.

## Hints
1. A dictionary whose keys are the words and whose values are their numbers of occurrences can be filled in a single pass, with `compte.get(m, 0) + 1`.
2. To respect the tie rule, don't go through the dictionary: go through the list of words again, in the order of the text.
3. Only change the best word if the new count is **strictly** greater.

## Solution
First pass: count. For each word `m`, do `compte[m] = compte.get(m, 0) + 1`. The `get` method returns 0 for a word not seen yet, which avoids the `KeyError` error. In C++, `compte[m]++` is enough: a `map` creates the key with the value 0 on first access.

Second pass: look for the maximum, going through the words **in the order of the text** and only replacing the best one if its count is strictly exceeded. The first word that reaches the maximal count is thus the one whose first occurrence comes earliest, and no tied word replaces it afterwards.

Going through the dictionary itself would be risky: in C++, a `map` gives the keys in alphabetical order and an `unordered_map` in an arbitrary order, which does not respect the tie rule.
