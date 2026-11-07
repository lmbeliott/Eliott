---
title: Numbers with allowed digits
---

## Statement
We choose a few **allowed** digits. A positive integer is **written with the allowed digits** if every digit of its usual form (with no leading `0`) is allowed. For example, with the digits `0` and `5`, the numbers `5`, `50`, `505` and `550` qualify, but not `15` nor `501`.

Write a program that answers `Q` questions: for each one, it prints how many integers between `A` and `B` (inclusive) are written with the allowed digits.

## Input
- The first line contains the integer `Q`, the number of questions.
- Each of the next `Q` lines contains one question: the allowed digits, written together in increasing order, then the integers `A` and `B`, separated by spaces.

## Output
`Q` lines: for each question, in order, the number of integers `n` with `A ≤ n ≤ B` that are written with the allowed digits.

## Constraints
- 1 ≤ Q ≤ 20
- 1 ≤ A ≤ B ≤ 10¹⁸
- Between 1 and 10 allowed digits, all different.

## Hints
1. Testing every number from `A` to `B` is out of the question: there can be 10¹⁸ of them. Write instead a function `compter(x)` (*count*) that gives the number of integers from `1` to `x` written with the allowed digits. The answer is then `compter(B) - compter(A - 1)`.
2. With `m` allowed digits, `z` of them non-zero, how many numbers with `L` digits qualify? The first digit cannot be `0`: that makes `z × m × m × … × m`, with `L - 1` factors `m`. This counts all the numbers that have fewer digits than `x`.
3. For those with as many digits as `x`: such a number smaller than `x` starts like `x`, then, at some position `i`, it has an allowed digit smaller than the digit of `x`; after that position, every allowed digit is possible. Go through the digits of `x` from left to right, and stop as soon as the digit of `x` is not allowed.

## Solution
**Split the work with a function.** Counting directly between `A` and `B` is awkward. We write instead `compter(x)`, the number of integers from `1` to `x` that qualify, and the answer is `compter(B) - compter(A - 1)`: those that are at most `B`, minus those that are before `A`. The same function is used twice, and `compter(0)` is 0.

**Numbers shorter than `x`.** Let `m` be the number of allowed digits and `z` the number of them that are not `0`. A qualifying number with `L` digits has a non-zero first digit (`z` choices) then `L - 1` arbitrary digits (`m` choices each): there are `z × m^(L-1)` of them. We add this up for every length `L` smaller than that of `x`. A small function `puissance(m, e)` (*power*) computes `m^e` with a loop.

**Numbers with the same length as `x`.** Such a number `n < x` matches `x` on its first digits, then has, at some position `i`, a digit smaller than that of `x`. For each position `i`, we count the allowed digits smaller than the digit of `x` (without `0` if `i` is the first position), and multiply by `m^(number of remaining positions)`. But we can only follow `x` up to position `i` if all its previous digits are allowed: as soon as a digit of `x` is not, we stop. If we reach the end, `x` itself qualifies: we add 1.

Example with the digits `2` and `7`, and `x = 100`: there are 2 one-digit numbers and 2 × 2 = 4 two-digit numbers. For three digits, the first digit of `x` is `1`: no non-zero allowed digit is smaller, and `1` is not allowed, so we stop. `compter(100) = 6`: they are `2`, `7`, `22`, `27`, `72` and `77`.

Each call only takes about twenty loop steps (one per digit of `x`), instead of up to 10¹⁸ for the naive solution.

Traps:
- `0` cannot be the first digit: `05` is not a way of writing `5`;
- if only `0` is allowed, no positive integer qualifies: the answer is 0;
- in C++, numbers go up to 10¹⁸: you need `long long`. `10¹⁸` itself has 19 digits, and `m^18` can be 10¹⁸, which still fits in a `long long`.
