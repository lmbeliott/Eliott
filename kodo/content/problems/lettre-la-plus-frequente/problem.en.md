---
title: Most frequent letter
---

## Statement
In a line of text, find the letter that appears most often, treating uppercase and lowercase as the same. Spaces and punctuation marks do not count. In case of a tie, choose the letter that comes first in the alphabet.

## Input
A single line of text, made of letters without accents, spaces and punctuation marks. It contains at least one letter.

## Output
A single line with the most frequent letter, written in lowercase, a space, then its number of occurrences.

## Constraints
- The line contains between 1 and 10,000 characters.

## Hints
1. A counting array of 26 cells is enough: cell 0 for `a`, cell 1 for `b`, …, cell 25 for `z`.
2. For a character `c`, first put it in lowercase, check that it is a letter, then `ord(c) - ord("a")` gives the index of its cell.
3. To get the letter back from the index `k` of the maximum: `chr(ord("a") + k)`. Going through the indices from 0 to 25 with a strict `>` gives the first letter of the alphabet in case of a tie.

## Solution
Count the letters in an array `cpt` of 26 cells. For each character of the line, put it in lowercase (`c.lower()`, or `tolower(c)` in C++). If it is a letter, that is if `"a" <= c <= "z"`, increase `cpt[ord(c) - ord("a")]`. Other characters are ignored.

Then look for the index `k` of the largest cell, going through the indices from 0 to 25 and replacing the best one only if a cell is strictly larger: in case of a tie, this keeps the letter closest to the start of the alphabet. The letter is `chr(ord("a") + k)`.

In C++, the line contains spaces: it must be read with `getline(cin, s)`, because `cin >> s` would stop at the first space. The computation `c - 'a'` directly gives the index, and `(char) ('a' + k)` the letter.
