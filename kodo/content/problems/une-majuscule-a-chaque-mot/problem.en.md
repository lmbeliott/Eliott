---
title: A capital letter for each word
---

## Statement
Rewrite `N` words so that each one starts with an uppercase letter and all its other letters are lowercase.

For example, `bONjour LE monde` becomes `Bonjour Le Monde`.

## Input
The first line contains the integer `N`. The second line contains the `N` words, separated by spaces. Each word is made of letters, uppercase or lowercase.

## Output
A single line with the `N` rewritten words, in the same order, separated by a space.

## Constraints
- 1 ≤ N ≤ 1,000
- Each word contains between 1 and 50 letters.

## Hints
1. Handle each word separately: its first letter `m[0]` on one side, the rest of the word on the other.
2. In Python, `m[0].upper() + m[1:].lower()` builds the wanted word. `m[1:]` is the slice going from index 1 to the end.
3. In C++, go through the word by index: `toupper` for index 0, `tolower` for the others.

## Solution
For each word `m`, build a new word: the first letter in uppercase, followed by the rest of the word in lowercase. In Python, `m[0].upper() + m[1:].lower()`; store the resulting words in a list, glued with `" ".join`. In C++, a `string` can be modified: replace `m[0]` with `toupper(m[0])`, then each `m[i]` (for `i ≥ 1`) with `tolower(m[i])`.

The traps: forgetting to put the rest of the word in lowercase (`bONjour` would become `BONjour`), and, in Python, trying to write `m[0] = m[0].upper()`, which causes a `TypeError` because a string cannot be modified. A one-letter word works too: `m[1:]` is then the empty string.
