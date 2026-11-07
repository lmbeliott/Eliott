---
title: Letters common to all words
---

## Statement
Print, in alphabetical order, the letters that appear in each of the `N` given words. Each letter is printed only once.

For example, `tartine`, `patate` and `attention` all three contain the letters `a`, `e` and `t`.

## Input
The first line contains the integer `N`. Each of the next `N` lines contains a word of lowercase letters without accents.

## Output
The common letters stuck together, in alphabetical order, on a single line. If there are none, print `AUCUNE`.

## Constraints
- 1 ≤ N ≤ 1,000
- Each word has between 1 and 100 letters.

## Hints
1. `set(word)` gives the set of the letters of a word, without duplicates.
2. The intersection `a & b` of two sets contains the elements present in both. Start from the letters of the first word and take the intersection with each of the following words.
3. A set has no order: to print in alphabetical order, go through the letters from `a` to `z` with `ord` and `chr`, and keep those that are in the set.

## Solution
The set `common` contains, at each step, the letters present in all the words read so far. At the start, these are the letters of the first word. For each following word, replace `common` with its **intersection** with the set of letters of that word: a letter missing from the word disappears, the others remain. After the last word, `common` contains exactly the letters present everywhere.

For the output, don't go through the set itself, since the order of its elements is not guaranteed in Python. Go through the 26 letters from `a` to `z` (codes `ord("a")` to `ord("z")`) and keep those in `common`.

In C++, there is no `&` operator for sets: build the intersection by hand, keeping the elements of `common` that are also found in the set of letters of the word. Think of the case `N = 1` (all the letters of the word) and of the case where the intersection becomes empty (`AUCUNE`).
