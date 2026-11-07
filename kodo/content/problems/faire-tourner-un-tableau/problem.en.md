---
title: Rotate an array
---

## Statement
Rotating an array by one step to the right means moving each value forward by one position, the last one coming back to the first position: `1 2 3 4 5` becomes `5 1 2 3 4`. Rotating by one step to the left is the inverse operation.

An array of `N` integers and an integer `K` are given. Print the array obtained by rotating it by `K` steps to the right if `K ≥ 0`, or by `−K` steps to the left if `K < 0`.

## Input
- The first line contains `N` and `K`.
- The second line contains the `N` integers of the array.

## Output
The `N` integers of the resulting array, on one line, separated by spaces.

## Constraints
- 1 ≤ N ≤ 40,000
- −10¹⁸ ≤ K ≤ 10¹⁸
- The values of the array are between 0 and 999.

## Hints
1. After `N` steps, the array is back to its initial state. Rotating step by step would take far too long.
2. After a rotation by `k` steps to the right, with `0 ≤ k < N`, the value at index `i` ends up at index `(i + k) % N`.
3. A rotation by `−K` steps to the left is a rotation by `K` steps to the right, with `K` negative. In Python, `K % N` is always between 0 and `N − 1`; in C++, write `((K % N) + N) % N`.

## Solution
A rotation by `N` steps brings every value back to its place: only the remainder `k = K mod N`, between 0 and `N − 1`, matters. A rotation by `−K` steps to the left is the same as a rotation by `K` steps to the right for `K < 0`, and the remainder modulo `N` handles this case too: rotating 1 step to the left is rotating `N − 1` steps to the right. In Python, `K % N` directly gives this remainder; in C++, `K % N` can be negative, so compute `((K % N) + N) % N` (with `long long`, since `|K|` reaches 10¹⁸).

Then build a new array `r` of `N` cells: for each index `i`, the value `t[i]` goes to index `(i + k) % N`. This formula is correct: the values at indices 0 to `N − k − 1` move forward by `k` places without passing the end, and the last `k` ones, at indices `N − k` to `N − 1`, pass the end and come back to indices 0 to `k − 1`, in the same order. Each destination index is reached exactly once.

Cost: one remainder computation, then one pass over the array, so work proportional to `N`. Rotating `|K|` times by one step would take up to 10¹⁸ × `N` moves. The rotation can also be done **in place**, without a second array, with three reversals (see the lesson).
