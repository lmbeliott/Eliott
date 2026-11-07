---
title: Word obtained by rotation
---

## Statement
Rotating a word by `K` steps means moving its first `K` letters to the end, in the same order. For example, `bonjour` rotated by 3 steps gives `jourbon`.

Two words `A` and `B` of the same length are given. Print the smallest number of steps `K`, with `0 ≤ K < length`, that turns `A` into `B`, or `-1` if no rotation works.

## Input
The first line contains the word `A`, the second the word `B`. Both words have the same length and are made of lowercase letters.

## Output
A single integer: the smallest `K` that works, or `-1`.

## Constraints
- The words have between 1 and 2,000 letters.

## Hints
1. With a length `L`, there are only `L` possible rotations: you can try them all, from `K = 0` to `K = L − 1`, and stop at the first one that works.
2. The rotation by `K` steps is written with two slices: `A[K:] + A[:K]` in Python, `A.substr(K) + A.substr(0, K)` in C++.
3. A repeating word, like `abab`, comes back to itself before `L` steps. That is why the **smallest** `K` is asked for.

## Solution
Try every rotation in increasing order of `K`. For each `K`, build the rotated word: the end of the word from index `K`, followed by its first `K` letters. Compare it with `B`. As soon as they are equal, print `K` and stop; if no rotation works, print `-1`.

There are at most 2,000 rotations, each built and compared in about 2,000 operations: 4 million elementary operations, which is fast.

Remark: `B` is a rotation of `A` exactly when `B` appears in the word `A + A` (the word `A` written twice in a row). With `A = bonjour`, `A + A = bonjourbonjour` contains `jourbon` from index 3: that is the number of steps. The same idea appears with indices: the letter of index `i` of the rotated word is `A[(K + i) % L]`.
