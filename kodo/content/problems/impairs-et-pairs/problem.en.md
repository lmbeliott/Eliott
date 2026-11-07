---
title: Odd and even
---

## Statement
Read `N` non-negative integers, then print how many of them are odd, and how many are even.

## Input
- The first line contains the integer `N`.
- The second line contains `N` integers separated by spaces.

## Output
Two lines: the number of odd values, then the number of even values.

## Constraints
- 1 ≤ N ≤ 1 000
- 0 ≤ each value ≤ 1 000 000 000

## Hints
1. Conditions (`if`) come in the next chapter: here, everything is computed with arithmetic operations.
2. What is `x % 2` when `x` is even? And when `x` is odd?
3. If you add up `x % 2` for all values, each odd value adds `1` and each even value adds `0`.
4. A value that is not odd is even: the second number follows from the first one and `N`.

## Solution
The remainder of the division of a non-negative integer by 2 is `0` if it is even and `1` if it is odd. By adding up `x % 2` for all the values read, you add exactly `1` per odd value: the sum is the number of odd values. The number of even values is then `N` minus that number.

This trick, which turns a test into a computation, works here because the values are non-negative. With negative numbers, the remainder does not have the same sign in Python and in C++: the next chapter shows how to write this count with a condition, which works in every case.

In Python, the values are on a single line: go through it with `for piece in input().split():`.
