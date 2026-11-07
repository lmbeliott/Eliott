---
title: Number of distinct values
---

## Statement
A sequence of `N` integers is given. Print the number of different values it contains.

For example, the sequence `4 7 4 1 7 4` contains three different values: `1`, `4` and `7`.

## Input
The first line contains the integer `N`. The second line contains the `N` integers, separated by spaces.

## Output
A single integer: the number of distinct values.

## Constraints
- 1 ≤ N ≤ 50,000
- -10⁹ ≤ each integer ≤ 10⁹

## Hints
1. A set keeps only one copy of each value, even if you add it several times.
2. Add each integer to an empty set, then print the size of the set with `len`.
3. With a list and a test `if v not in list`, each test goes through the whole list: with 50,000 distinct values, that makes more than a billion comparisons, far too many.

## Solution
Add the `N` integers to a **set** (`set` in Python, `unordered_set` or `set` in C++). A set never contains the same value twice: adding a value that is already there changes nothing. At the end, its size is exactly the number of distinct values.

The trap is to build a list without duplicates with `if v not in list: list.append(v)`. The result is correct, but each `in` test on a list compares `v` with every element already stored. When all values are distinct, that makes 1 + 2 + … + 49,999 comparisons, about 1.25 billion: several seconds in Python, far beyond the time limit. Membership in a set, on the other hand, is checked in almost a single step, whatever its size.
