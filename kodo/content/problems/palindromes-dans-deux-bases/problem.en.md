---
title: Palindromes in two bases
---

## Statement
A number is a palindrome **in base `B`** when its writing in base `B`, without leading zeros, reads the same in both directions. For example, 585 is a palindrome in base 10, and also in base 2, where it is written `1001001001`.

Two integers `N` and `B` are given. Count the integers `x` with `1 ≤ x ≤ N` that are palindromes both in base 10 and in base `B`.

## Input
One line: the integers `N` and `B`.

## Output
The number of valid integers.

## Constraints
- 1 ≤ N ≤ 10⁹
- 2 ≤ B ≤ 9

## Hints
1. Testing the `N` numbers one by one would take up to a billion tests: far too many. How many base-10 palindromes are there up to 10⁹?
2. A decimal palindrome is entirely determined by its first half: `123` gives `123321` (even length) and `12321` (odd length).
3. For each length, go through the first halves in increasing order: the palindromes obtained are increasing, and you can stop as soon as you exceed `N`. Then write a function that tests whether a number is a palindrome in base `B`.

## Solution
Decimal palindromes are rare: a palindrome of `L` digits is determined by its first `h = (L + 1) // 2` digits, the first half, which does not start with 0. So there are 9 × 10^(h − 1) of each length, that is 109,998 in all up to 10⁹, against a billion numbers. Build them instead of searching for them.

**Building.** For each length `L` from 1 to the number of digits of `N`, and for each first half `m` from 10^(h − 1) to 10^h − 1, form the string `s = str(m)`, then the palindrome `s + s[::-1]` if `L` is even, or `s + s[:-1][::-1]` if `L` is odd (the middle digit is not repeated). Each palindrome of `L` digits is obtained exactly once, from its first half. For a fixed length, two palindromes compare like their first halves: going through the halves in increasing order, the palindromes are increasing, and as soon as one exceeds `N`, all the following ones of the same length exceed it too. So this loop is placed in a function `count_length`, which stops with `return` as soon as the palindrome exceeds `N`.

**Testing in base `B`.** The function `palindrome_in_base(x, b)` computes the digits of `x` in base `b` with the remainder method: `x % b` is the last digit, then replace `x` by `x // b`, until 0. The digits come out from right to left, which does not matter for a palindrome test. Then compare the first and the last, the second and the second to last, with two indices moving towards each other, and return `False` at the first mismatch.

**Cost.** At most 109,998 palindromes, and for each of them at most about thirty digits in base `B`: a few million operations at worst. Most tests actually stop at the first comparison. The trap: building the reversed string with `s = c + s` in a loop is correct here, since the strings are short, but the slice `[::-1]` is simpler.
