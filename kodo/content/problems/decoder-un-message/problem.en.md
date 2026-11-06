---
title: Decode a message
---

## Statement
A message has been coded like this: each letter is replaced by the letter that comes `K` places further on in the alphabet. After `z`, you start again at `a`. For example, with `K = 3`, `a` becomes `d`, `x` becomes `a` and `chat` becomes `fkdw`. The spaces between words are not coded.

You know `K` and the coded message. Write a program that recovers the original message.

## Input
- The first line contains the integer `K`.
- The second line contains the coded message: words in lowercase letters without accents, separated by a single space.

## Output
A single line: the decoded message, with the spaces in the same places.

## Constraints
- 0 ≤ K ≤ 25
- The message has between 1 and 200 characters.

## Hints
1. To decode, you have to go the other way: each letter moves back `K` places in the alphabet. Be careful with what happens before `a`: moving back 3 places from `b`, you get to `y`.
2. Turn each letter into a number from 0 (`a`) to 25 (`z`). In Python: `ord(c) - ord("a")`; in C++: `c - 'a'`. It's much easier to compute with numbers than with letters.
3. The remainder of the division by 26 (`% 26`) lets you "wrap around" the alphabet. Move back by `K`, take the remainder modulo 26, then turn the number back into a letter with `chr(ord("a") + number)` in Python or `(char)('a' + number)` in C++. In C++, add 26 before the `%` so that you don't get a negative number.

## Solution
We go through the message character by character and build the decoded message:
- a space is copied as it is;
- a letter is turned into its number in the alphabet (from 0 to 25), we subtract `K`, take the remainder modulo 26 to get back between 0 and 25, then turn this number back into a letter.

The modulo is what makes the alphabet "loop": with `K = 3`, the letter `b` (number 1) gives 1 − 3 = −2, and −2 modulo 26 is 24, which is `y`.

The traps:
- in C++ (and in many other languages), `-2 % 26` is `-2`, not `24`. So we write `(number - K + 26) % 26`: since `K ≤ 25`, the number stays positive. In Python, `%` always gives a positive result when you divide by a positive number;
- you must move **back** `K` places, not forward: what you receive is the *coded* message;
- in C++, after `cin >> k`, there is still an end of line left to read before using `getline` for the message. Otherwise, `getline` returns an empty line.
