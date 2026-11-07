---
title: Reverse and rotate a list
---

## Statement
A list of `N` integers undergoes `Q` operations, of two kinds:
- `R L D`: **reverse** the part going from position `L` to position `D` (positions numbered from 1). For example, `R 2 4` turns `1 2 3 4 5` into `1 4 3 2 5`.
- `T K`: **rotate** the list by `K` places to the left: the first `K` elements move to the end, in the same order. For example, `T 2` turns `1 2 3 4 5` into `3 4 5 1 2`.

Print the list after all the operations.

## Input
- The first line contains two integers `N` and `Q`.
- The second line contains the `N` integers of the list.
- Each of the next `Q` lines contains an operation: the letter `R` followed by two integers `L` and `D`, or the letter `T` followed by one integer `K`.

## Output
A single line: the `N` integers of the final list, separated by spaces.

## Constraints
- 1 ≤ N ≤ 1,000
- 1 ≤ Q ≤ 300
- 1 ≤ L ≤ D ≤ N
- 0 ≤ K < N
- The integers of the list are between 1 and 10⁹.

## Hints
1. Write a function `reverse_part(t, i, j)` that reverses the part of `t` between indices `i` and `j` (counted from 0) by swapping the ends, without returning anything: it modifies the list it receives.
2. Rotating can be done with three reversals. Try on `1 2 3 4 5` with `K = 2`: reverse the first 2, then the last 3, then the whole list.
3. Beware of a function that would write `t = …`: assigning a new list to the parameter does not change the caller's list.

## Solution
The function `reverse_part(t, i, j)` is the one from the lesson: while `i < j`, it swaps `t[i]` and `t[j]`, then moves `i` and `j` closer. It directly modifies the list passed as argument (in C++, the parameter is a `vector<int> &`). For the operation `R L D`, call it with `L - 1` and `D - 1`, because the positions of the statement start at 1.

To rotate by `K` places, use a neat trick: reverse the first `K` elements, then the last `N - K`, then the whole list. On `1 2 3 4 5` with `K = 2`: `2 1 5 4 3`, then `3 4 5 1 2`. Indeed, reversing the whole list moves the end block to the front, but each block ends up backwards; the first two reversals had turned them backwards in advance, which puts them back in the right order. The function `rotate(t, k)` therefore just calls `reverse_part` three times. If `K = 0`, nothing changes (the first part is empty).

Each operation moves at most `N` elements: in total, at most 300,000 swaps.

The trap: in Python, writing `def rotate(t, k): t = t[k:] + t[:k]` does nothing useful. The function builds a new list and stores it in its local parameter `t`, but the caller's list is not modified. You must either modify the list cell by cell, as here, or return the new list with `return` and write `t = rotate(t, k)`. In C++, forgetting the `&` in `vector<int> &t` causes the same kind of mistake: the function works on a copy.
