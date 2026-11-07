---
title: Shift letters and digits
---

## Statement
A text is encrypted by shifting each of its characters by `K` steps:
- a lowercase letter is replaced by the lowercase letter `K` places further in the alphabet, wrapping around to `a` after `z`;
- an uppercase letter is handled the same way and stays uppercase;
- a digit is replaced by the digit `K` places further, wrapping around to `0` after `9`;
- other characters (spaces, punctuation) do not change.

If `K` is negative, you move back by `−K` places: with `K = −1`, `a` becomes `z` and `0` becomes `9`. Print the encrypted text.

## Input
- The first line contains the integer `K`.
- The second line contains the text.

## Output
The encrypted text, on one line.

## Constraints
- −10⁹ ≤ K ≤ 10⁹
- The text has between 1 and 100,000 characters: letters, digits, spaces and the signs `.,;:!?'()-`. It neither starts nor ends with a space and never contains two spaces in a row.

## Hints
1. Shifting by 26 steps changes no letter, and shifting by 10 steps changes no digit. Repeating a one-step shift `K` times would be far too slow for `K = 10⁹`.
2. For a lowercase letter `c`, compute its rank `r = ord(c) − ord("a")`, then the new rank `(r + K) mod 26`, then the letter with that rank.
3. In C++, `%` can give a negative result when `K < 0`: first bring the shift between 0 and 25 with `((K % 26) + 26) % 26`.

## Solution
The shift of a letter only depends on the remainder of `K` modulo 26: 26 steps are exactly one full turn of the alphabet. So compute once `k26 = K mod 26` and `k10 = K mod 10`, two non-negative shifts, then handle each character:
- a lowercase letter of rank `r` (with `r = ord(c) − ord("a")`) becomes `chr(ord("a") + (r + k26) % 26)`;
- an uppercase letter, likewise with `"A"`;
- a digit, likewise with `"0"`, `k10` and 10;
- any other character is copied.

In Python, `K % 26` is always between 0 and 25, even when `K` is negative. In C++, `-3 % 26` is `-3`: you must write `((K % 26) + 26) % 26`. This is the main trap of the exercise.

The program does a constant number of operations per character, so its work is proportional to the length of the text. Repeating a one-step shift `|K|` times would take up to 10⁹ × 100,000 operations. The result is built in a list of characters joined with `join` at the end (in C++, the `string` is modified directly). Finally, the text contains spaces: read it whole with `input()`, and in C++ with `getline`, after consuming the end of the first line.
