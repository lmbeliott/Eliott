---
title: Climb back to a pair
---

## Statement
Start from a pair of positive integers `(x, y)`. A **move** replaces this pair by `(x + y, y)` or by `(x, x + y)`. For example, `(2, 3)` can become `(5, 3)` or `(2, 5)`.

Two pairs `(A, B)` and `(C, D)` are given. Print the number of moves needed to go from `(A, B)` to `(C, D)`, or `-1` if it is impossible. One can show that this number, when it exists, does not depend on the moves chosen.

Each test contains `T` questions.

## Input
- The first line contains `T`.
- Each of the next `T` lines contains four integers `A`, `B`, `C` and `D`.

## Output
For each question, one line with the number of moves, or `-1`.

## Constraints
- 1 ≤ T ≤ 1,000
- 1 ≤ A, B, C, D ≤ 10¹⁸

## Hints
1. Going forward, there are two choices at each move: too many possibilities. Going backwards from `(C, D)`, there is only one. Which one?
2. If `C > D`, the last move was necessarily `(C − D, D) → (C, D)`. If `C = D`, no move leads to `(C, D)`.
3. Going back one move at a time is too slow for `(10¹⁸, 1)`. As in Euclid's algorithm, make all the subtractions of `D` at once, taking care not to "jump" over `(A, B)`.

## Solution
**Going backwards.** Both numbers stay positive. If `C > D`, the move that produced `(C, D)` can only be `(C − D, D) → (C, D)`, because the other move would have made the second number larger than the first. Likewise if `D > C`. If `C = D`, no move produces `(C, D)`. So each pair has **at most one predecessor**, and going backwards from `(C, D)` follows a unique path. `(A, B)` leads to `(C, D)` exactly when this path goes through `(A, B)`, and the number of moves is then the length of the path between them: it does not depend on any choice.

**Speeding up.** Suppose `C > D`. As long as the first number stays larger than `D`, subtract `D`: go back `q = (C − 1) // D` moves in a single computation, and the first number becomes `C − q × D`, between 1 and `D`. During these steps back, the second number is always `D`. Two cases:
- if `D ≠ B`, no intermediate pair is `(A, B)`: the whole batch can be skipped;
- if `D = B`, the path goes through `(A, B)` exactly when `A ≤ C` and `C − A` is a multiple of `D`; the number of remaining moves is then `(C − A) / D`. Otherwise, the answer is `-1`, since afterwards the second number will drop below `B`.

Also stop with `-1` if `C < A` or `D < B` (the numbers only decrease going backwards), or if `C = D` without being at `(A, B)`.

**Termination and cost.** The sum `C + D` is a positive integer that strictly decreases at each turn of the loop: the loop stops. The successive quotients are those of Euclid's algorithm applied to `(C, D)`, so there are fewer than about 120 turns for numbers below 10¹⁸. Going back move by move would take up to 10¹⁸. The number of moves can reach 10¹⁸: in C++, `long long`.
