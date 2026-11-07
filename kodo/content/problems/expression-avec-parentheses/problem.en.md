---
title: Expression with brackets
---

## Statement
Compute the value of an expression written on one line, without spaces, with non-negative integers, the operations `+`, `-`, `*` and brackets. The rules are those of mathematics: what is in brackets is computed first, multiplications come before additions and subtractions, and operations of the same priority are done from left to right. So `2+3*4` is `14`, `(2+3)*4` is `20` and `10-4-3` is `3`.

The `-` sign is never placed in front of a number to make it negative: it is always between two operands.

## Input
A single line: the expression, of length `N`. It is correct, and numbers have no useless leading zero.

## Output
A single integer: the value of the expression.

## Constraints
- 1 ≤ N ≤ 100,000
- each number is between `0` and `999`
- the results of all operations of the computation are between −10¹⁸ and 10¹⁸
- brackets can be nested up to 20,000 levels deep

## Hints
1. Searching for the innermost brackets, computing them, replacing and starting again can cost N² operations.
2. Use two stacks: one for values, one for operators and opening brackets. "Applying" an operator means popping two values `b` then `a` and pushing `a op b`.
3. Before pushing an operator, apply all the operators at the top of the stack with a **greater or equal** priority (without going past an opening bracket). A closing bracket applies everything down to the matching opening bracket, then removes it.

## Solution
Read the expression from left to right with two stacks: `valeurs` (values) and `ops` (operators and opening brackets). Applying the top of `ops` means: remove the operator, pop `b` then `a`, push `a op b`.

- A **number** (read all its digits) is pushed onto `valeurs`.
- An **opening** bracket is pushed onto `ops`.
- An **operator** `o`: while the top of `ops` is an operator with a priority greater than or equal to that of `o`, apply it; then push `o`. Priorities are 2 for `*`, 1 for `+` and `-`.
- A **closing** bracket: apply operators down to the opening bracket, which is removed.

At the end, apply all remaining operators; the remaining value is the result.

**Why.** Invariant: in the stack `ops`, between two opening brackets, priorities strictly increase towards the top. An operator stays in the stack as long as its right operand is not complete: it is complete as soon as an operator of lower or equal priority (left-to-right rule), a closing bracket or the end arrives. When it is applied, the two top values are exactly its two operands, already fully computed. This reproduces the order of computation of mathematics.

**Cost.** Each number, operator or bracket is pushed once and popped once: about N operations. A solution that calls itself for each bracket would exceed the depth allowed in Python with 20,000 levels. In C++, `long long` is needed. The traps: applying `-` with swapped operands, and using "strictly greater priority" instead of "greater or equal", which would compute `10-4-3` as `10-(4-3)`.
