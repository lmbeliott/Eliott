---
title: List in reverse
---

## Statement
Write a program that reads a list of `N` numbers and prints it in reverse order: the last number first, then the second to last, and so on down to the first one.

## Input
- The first line contains the integer `N`, the number of elements in the list.
- The second line contains `N` integers separated by spaces: the elements of the list, in order.

## Output
A single line containing the `N` numbers in reverse order, separated by spaces.

## Constraints
- 1 ≤ N ≤ 1,000
- Each number is between 0 and 4,800.

## Hints
1. You can't print the last number before you've read it: first you need to store all the numbers in a list.
2. The positions in the list go from `0` to `N - 1`. To go through it backwards, make the position go from `N - 1` down to `0`. In Python: `range(n - 1, -1, -1)`; in C++: `for (int i = n - 1; i >= 0; i--)`.
3. To print all the numbers on a single line: `print(x, end=" ")` in Python, `cout << x << " ";` in C++.

## Solution
We read the `N` numbers and store them in a list. Then we go through the list starting from the end: position `N - 1` (the last number), then `N - 2`, and so on down to position `0` (the first number).

The classic trap: positions start at `0`. So the last cell of a list of `N` elements is cell `N - 1`, not cell `N` (which doesn't exist). In Python, `range(n - 1, -1, -1)` stops just before `-1`, so cell `0` is printed too.

Python also has shortcuts: `my_list[::-1]` or `reversed(my_list)` give the list backwards. They're handy, but first make sure you can do it yourself with a loop.
