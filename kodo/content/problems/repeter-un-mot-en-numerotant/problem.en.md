---
title: Repeat a word with numbers
---

## Statement
Read a word `M` and an integer `K`, then print `K` numbered lines that all contain the word `M`.

## Input
- The first line contains the word `M`, written in lowercase letters.
- The second line contains the integer `K`.

## Output
`K` lines. Line number `i` (counting from 1) contains the integer `i`, a space, then the word `M`.

## Constraints
- 1 ≤ K ≤ 100
- The word `M` has between 1 and 20 letters.

## Hints
1. The word is read as it is, without `int()`; the integer `K`, however, must be converted.
2. A loop that runs `K` times gives `i` the values `0`, `1`, …, `K - 1`. The number to print is `i + 1`.

## Solution
Read the word with `input()` (or `cin >> m` with a `string` variable), then `K` with `int(input())`. A loop of `K` iterations prints, each time, the number `i + 1` followed by the word.

The trap is the order of the reads: the word is on the first line and the number on the second. Reading them the other way round causes a conversion error in Python, and a failed read in C++.
