---
title: Compress a string
---

## Statement
To shorten a text that contains many repeated letters, it is compressed like this: each group of identical letters that follow each other is replaced by the letter, followed by the number of times it is repeated. When a letter is on its own, you write only the letter, without the number `1`.

For example, `aaabcc` becomes `a3bc2`, and `xyyyyyyyyyyyx` (with twelve `y`) becomes `xy12x`.

Write a program that prints the compressed string.

## Input
A single line: the string to compress, made of lowercase letters without accents, with no spaces.

## Output
A single line: the compressed string.

## Constraints
- The string has between 1 and 1 000 letters.

## Hints
1. Go through the string and spot the **groups**: a run of identical letters that follow each other. A group ends when the next letter is different, or when you reach the end of the string.
2. A simple way: a position `i` marks the start of a group. Move a second position `j` forward as long as `s[j]` is equal to `s[i]` (without going past the end). The group then has `j - i` letters, and the next group starts at `j`.
3. To add a number to a string, you first have to turn it into text: `str(n)` in Python, `to_string(n)` in C++. Don't forget that a group can have 10 letters or more: the number then has several digits.

## Solution
Split the string into groups of identical letters. Keep a position `i`, the start of the current group. A second position `j` starts at `i` and moves forward as long as it stays inside the string and `s[j]` is the same letter as `s[i]`. When it stops, the group goes from `i` to `j - 1` and has `j - i` letters:
- add the letter to the result;
- if the group has at least 2 letters, also add this number, turned into text;
- the next group starts at `j`: start again with `i = j`, until the end of the string.

The traps:
- forgetting the **last** group: with a method that writes a group when the letter changes, the last group is never followed by a change, so you have to write it after the loop. The method with two positions avoids this problem;
- writing `1` for single letters: the statement asks you to write nothing;
- thinking the number has only one digit: twelve `y` give `y12`, and the same letter 1 000 times gives four digits. By turning the whole number into text, rather than adding a single digit character, every case is handled.
