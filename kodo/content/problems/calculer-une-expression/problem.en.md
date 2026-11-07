---
title: Evaluate an expression
---

## Statement
You are given a calculation written on a single line, without spaces and without brackets, with non-negative integers and the three operations `+`, `-` and `*` (multiplication). For example: `7*0+100*2*3-50`.

Write a program that prints the result of this calculation, with the usual rules of mathematics: multiplications are done before additions and subtractions, and additions and subtractions are done from left to right.

For example, `2+3*4` is 14 (not 20), and `8-2-3` is 3.

## Input
A single line: the calculation. It starts and ends with a number, and two numbers are always separated by exactly one operation.

## Output
A single integer: the result of the calculation.

## Constraints
- The line has at most 1 000 characters.
- Each number is between 0 and 1 000, and is written without unnecessary leading zeros.
- During the calculation done in the usual order, each product and each intermediate result stays between -1 000 000 000 and 1 000 000 000.

## Hints
1. The `+` and `-` signs split the calculation into **terms**, and each term is a product: `7*0+100*2*3-50` is made of the terms `7*0`, `100*2*3` and `50`. The result is the first term, plus or minus each of the following ones.
2. To read a number written with several digits, read it digit by digit: starting from 0, at each digit, multiply by 10 and add the value of the digit. For the string `305`: 0, then 3, then 30, then 305.
3. Keep three variables: the total of the terms already finished, the sign of the current term (`1` or `-1`) and the value of the current term. When a number follows a `*`, it multiplies the current term. When it follows a `+` or a `-`, the previous term is finished: add it to the total, then start a new term. Don't forget the last term at the end.

## Solution
Go through the string only once, from left to right, reading a number and an operation in turn.

To read a number, move forward as long as the character is a digit, and build its value: `number = number × 10 + digit`, where the digit is obtained from the code of the character (`ord(c) - ord("0")` in Python, `c - '0'` in C++).

To respect the priority of multiplication, split the calculation into terms separated by `+` and `-`. Keep:
- `total`: the sum of the terms already finished;
- `sign`: `1` if the current term is preceded by a `+` (or if it's the first one), `-1` if it's preceded by a `-`;
- `term`: the value of the current product.

In the reference solutions, these variables are called `total`, `signe` and `terme`.

When you read a number, look at the operation before it:
- a `*`: the product goes on, do `term = term × number`;
- a `+` or a `-`: the previous term is finished. Do `total = total + sign × term`, then set `sign` according to the operation, and the new term starts with `term = number`.

At the end of the string, the last term isn't followed by any operation: add it to the total before printing.

Example with `10-2*3-4`: the term 10 starts; the `-` finishes it (total 10), and the next term is 2, with sign `-1`; the `*3` turns it into 6; the `-` finishes it (total 10 - 6 = 4), and the term 4 starts with sign `-1`; at the end, total 4 - 4 = 0.

The traps:
- computing from left to right without priority: `2+3*4` would give 20;
- forgetting to add the last term;
- reading a single character per number: `100` is one number, not three.
