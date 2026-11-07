---
title: Path in the Stern-Brocot tree
---

## Statement
The **Stern-Brocot tree** is an infinite binary tree that contains each positive irreducible fraction exactly once. Each node has two **bounds** `a/b` and `c/d` and holds the fraction `(a + c)/(b + d)`. The root has bounds `0/1` and `1/0`: it holds `1/1`. The left child of a node with bounds `a/b`, `c/d` and fraction `m` has bounds `a/b` and `m`; its right child has bounds `m` and `c/d`. So the children of the root hold `1/2` and `2/1`, and those of `1/2` hold `1/3` and `2/3`.

It is a binary search tree: the fractions of the left subtree of a node are smaller than its own, those of the right subtree larger. To reach a fraction, start from the root and go down left (`L`) or right (`R`).

For each of the `T` given fractions `P/Q`, print the path from the root, in compressed form: the blocks of consecutive identical steps.

## Input
- The first line contains `T`.
- Each of the next `T` lines contains two coprime integers `P` and `Q`.

## Output
For each fraction, one line: the number `B` of blocks, then the `B` blocks, each written as a letter (`L` or `R`) followed by the number of steps. For example, `3/5` is reached by `L R L`: the line is `3 L 1 R 1 L 1`. For `1/1`, the line is `0`.

## Constraints
- 1 ≤ T ≤ 1,000
- 1 ≤ P, Q ≤ 10¹⁸
- GCD(P, Q) = 1

## Hints
1. The path of `10¹⁸/1` has nearly 10¹⁸ steps to the right: going down step by step is impossible.
2. The right subtree of the root looks like the whole tree, shifted by 1: each fraction `x` becomes `x + 1`. And the left subtree? What becomes of `P/Q` after a step to the right?
3. A step to the right turns the problem `(P, Q)` into `(P − Q, Q)`, a step to the left into `(P, Q − P)`. Several identical steps in a row are chained at once with a division, as in Euclid's algorithm.

## Solution
**A step is a subtraction.** By induction on the depth, the right subtree of the root is the whole tree with each fraction `x` replaced by `x + 1`, and the left subtree is the whole tree with `x` replaced by `x / (1 + x)`. Indeed, adding 1 to the bounds `a/b` and `c/d` (which become `(a + b)/b` and `(c + d)/d`) adds 1 to the mediant `(a + c)/(b + d)`, and the root `1/1`, with bounds `0/1` and `1/0`, becomes the node `2/1`, with bounds `1/1` and `1/0`: the construction is the same. The reasoning is symmetric on the left. So if `P > Q`, the fraction is on the right, and it remains to find `(P − Q)/Q` in the whole tree; if `P < Q`, it is on the left, and it remains to find `P/(Q − P)`. Stop at `1/1`. These subtractions keep `P` and `Q` coprime and positive, and `P + Q` decreases at each step: the descent ends.

**Whole blocks at once.** If `P > Q`, steps to the right are made as long as `P > Q`: exactly `k = (P − 1) / Q` steps (integer division), after which `P` becomes `P − k Q`, between `1` and `Q`. The same on the left. This is Euclid's algorithm with divisions: the numbers of steps are the quotients of the continued fraction of `P/Q`, the last one decreased by 1.

**Complexity.** As for Euclid, O(log(P + Q)) blocks per fraction, fewer than 90. Going down step by step would take up to 10¹⁸ steps.

**Pitfalls.** Use `(P − 1) / Q`, not `P / Q`: when `Q` divides `P` (that is, `Q = 1`), the last block stops at `1/1`, one step earlier. The products `k × Q` stay at most `P`: no overflow in `long long`. The fraction `1/1` gives an empty path.
