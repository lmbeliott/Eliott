---
title: Duplicate values
---

## Statement
You are given a list of `N` integers. Some values appear several times in it.

Write a program that finds all the values that appear **at least twice** in the list, and prints, for each of them, how many times it appears.

## Input
- The first line contains the integer `N`.
- The second line contains `N` integers separated by spaces.

## Output
- On the first line, the number `K` of different values that appear at least twice.
- Then `K` lines, one per value, from the smallest value to the largest: the value, a space, then its number of appearances.

If no value appears twice, the program prints only `0`.

## Constraints
- 1 ≤ N ≤ 10 000
- Each integer is between -1 000 000 and 1 000 000.

## Hints
1. Count the appearances of each value with a dictionary: the key is the value, and what goes with it is the number of times you've seen it.
2. Once everything is counted, keep only the keys whose count is at least 2.
3. You have to print the number of values **before** the values themselves: first store the kept values in a list, sorted, then print its length, then its contents.

## Solution
Go through the list once and count the appearances of each value in a dictionary (`dict` in Python, `map` in C++). The values go from -1 000 000 to 1 000 000: an array of 2 000 001 counters, shifted by a million, would also work, but the dictionary is simpler and only keeps the values that are present.

Then, build the list of values whose count is at least 2, and sort it. Print its length, then each value followed by its count.

The traps:
- printing a value as many times as it appears: each duplicate value must be printed only once, with its count;
- forgetting to sort: in Python, a dictionary is gone through in the order in which the keys were added, not in increasing order. In C++, a `map` keeps its keys sorted, which does the job;
- negative numbers: they come before positive ones in increasing order, and `-1` comes after `-5`.

Another method uses only sorting: once the list is sorted, equal values are next to each other, and you can count the length of each group in a single pass.
