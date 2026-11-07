---
title: Words hidden in a grid
---

## Statement
A grid of letters and a list of `Q` words are given. A word is **hidden** in the grid if it can be read by following consecutive cells in a straight line, in one of the 8 directions: horizontally, vertically or diagonally, in either direction.

Count the words of the list that are hidden in the grid.

For example, in the grid `abc` / `def`, you can read `fed` (right to left), `ae` and `bf` (diagonally), `cf` (top to bottom), but not `abcd`.

## Input
- The first line contains `R` and `C`, the number of rows and columns.
- Each of the next `R` lines contains `C` lowercase letters.
- The next line contains `Q`.
- Each of the next `Q` lines contains a word of lowercase letters. The `Q` words are all different.

## Output
A single integer: the number of words hidden in the grid.

## Constraints
- 1 ≤ R, C ≤ 30
- 1 ≤ Q ≤ 2,000
- Each word has between 1 and 8 letters.

## Hints
1. Searching for each word separately, from each cell and in each direction, takes up to 2,000 × 900 × 8, about 14 million starts: too slow in Python.
2. Turn the problem around: from each cell and in each direction, you can only read at most 8 words of 1 to 8 letters. So there are at most 900 × 8 × 8 = 57,600 readable words.
3. Store all the readable words in a set, then test each word of the list with `in`.

## Solution
Rather than searching for each word in the grid, first build **the set of all readable words**. For each starting cell `(i, j)` and each direction `(di, dj)` among the 8 possible ones, a function `ajouter_lectures` ("add readings") moves cell by cell, adding one letter at a time: after each letter, the word read so far is added to the set. It stops at the edge of the grid or at 8 letters, since no word is longer.

The set contains at most 900 × 8 × 8 = 57,600 words, and far fewer in practice, because it removes duplicates (a single letter is read 8 times from the same cell). Then each word of the list is tested with a single `in` operation.

The 8 directions are stored in a list of pairs `(di, dj)`: it's safer than writing 8 nearly identical loops. Reading a word from right to left simply corresponds to the direction `(0, -1)`: there's no need to reverse the words.
