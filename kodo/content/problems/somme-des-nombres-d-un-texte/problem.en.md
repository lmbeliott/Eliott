---
title: Sum of the numbers in a text
---

## Statement
A word mixes lowercase letters and digits. Each group of consecutive digits forms a number. Print the sum of these numbers.

For example, in `ab12c3d045`, the numbers are 12, 3 and 45 (the leading `0` does not change the value): the sum is 60.

## Input
A single line containing the word, without spaces.

## Output
A single integer: the sum of the numbers in the word, or `0` if it contains no digit.

## Constraints
- The word contains between 1 and 100,000 characters.
- Each group of digits contains at most 9 digits.

## Hints
1. Go through the word character by character, building the current number. How does the value of `12` become that of `123` when you read the digit `3`?
2. Adding a digit `d` to the right of a number `x` gives `10 × x + d`. The value of the digit is `ord(c) - ord("0")` (or `c - '0'` in C++).
3. When you meet a letter, the current number is over: add it to the total and start again from 0. Do not forget the number that may end the word.

## Solution
Keep two variables: `total`, the sum of the finished numbers, and `courant`, the value of the number being read. For each character `c`:
- if `c` is a digit, it is added to the right of the current number: `courant = 10 × courant + (value of c)`;
- otherwise, the current number (if any) is over: `total = total + courant`, then `courant = 0`. Adding 0 when there was no number changes nothing.

After the loop, you must still add `courant` to the total: if the word ends with digits, no letter came to close this last number. This is the main trap.

The value is built with `10 × courant + d`, the way a number is read from left to right: 0, then 1, then 12, then 123. The total can exceed 2³¹: in C++, you need a `long long`.
