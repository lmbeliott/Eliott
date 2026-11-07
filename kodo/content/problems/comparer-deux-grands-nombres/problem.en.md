---
title: Compare two large numbers
---

## Statement
Compare two integers `A` and `B` that can have up to 10,000 digits, and be negative. Print `<` if `A` is smaller than `B`, `>` if it is larger, and `=` if they are equal.

## Input
The first line contains `A`, the second `B`. A negative number starts with the sign `-`. No number has useless leading zeros, and zero is always written `0`, without a sign.

## Output
A single symbol: `<`, `>` or `=`.

## Constraints
- `A` and `B` each have between 1 and 10,000 digits.

## Hints
1. These numbers are too large to be converted to integers: you must reason on the strings. But comparing the strings directly does not work: `"9" > "10"` in dictionary order.
2. Start with the signs: a negative number is smaller than a non-negative one.
3. For two non-negative numbers without leading zeros, the one with more digits is larger; with equal lengths, the order of the strings is the order of the numbers. For two negative numbers, the comparison of the values without the sign is reversed.

## Solution
First handle the signs. If only one of the two numbers starts with `-`, it is the smaller one.

Otherwise, both numbers have the same sign, and you compare their **absolute values**, that is the strings without the possible `-` (`a[1:]` in Python, `a.substr(1)` in C++):
- if the lengths differ, the longer number is the larger in absolute value, since there are no useless leading zeros;
- with equal lengths, the lexicographic order of the strings is exactly the order of the numbers: compare the digits from left to right, and the first different digit decides, as for words in a dictionary.

If both numbers are negative, the order is reversed: −500 < −20 whereas 500 > 20.

The main trap is comparing the strings directly: `"9" > "10"` and `"-1" < "-2"` in lexicographic order, two wrong answers for numbers. In Python, `int()` is moreover refused for strings of more than 4,300 digits.
