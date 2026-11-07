---
title: Staircase of hashes
---

## Statement
Print a staircase of 6 steps drawn with the character `#`: the first line contains a single `#`, and each line contains one more than the previous one.

## Input
None: the program reads nothing.

## Output
6 lines. Line number k (from 1 to 6) contains exactly k characters `#`, stuck together, with no other character.

## Hints
1. Each line of the figure corresponds to one print instruction.
2. Before writing the program, draw the staircase on paper and count the `#` on each line: 1, 2, 3, 4, 5, 6.

## Solution
The program is a sequence of 6 print instructions, one per step, in order: `#`, `##`, `###`, `####`, `#####`, `######`.

The trap is to be off by one step: an extra line, a missing line, or two lines of the same length. You spot it by comparing the output with the example, line by line. In C++, do not forget the `"\n"` at the end of each line, otherwise all the `#` end up stuck together on a single line.
