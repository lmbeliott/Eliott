---
title: Postfix expression
---

## Statement
In a **postfix** expression, each operator is written after its two operands. So `3 4 +` is `3 + 4 = 7`, and `5 1 2 + 4 * + 3 -` is `5 + (1 + 2) × 4 − 3 = 14`. Brackets are never needed.

The operators are `+`, `-` and `*`. For `a b -`, the result is `a − b`. Compute the value of the given expression, or print `ERREUR` if it is ill-formed: an operator comes while fewer than two values are available, or exactly one value does not remain at the end.

## Input
A single line: the `N` items of the expression (non-negative integers and operators), separated by spaces.

## Output
The value of the expression, or `ERREUR`.

## Constraints
- 1 ≤ N ≤ 40,000
- numbers in the expression are between `0` and `99`
- all results of the operations performed are between −10¹⁸ and 10¹⁸

## Hints
1. Read the expression from left to right. A number is put aside; an operator uses the last two numbers put aside.
2. A stack: a number is pushed; an operator pops `b`, then `a`, and pushes `a op b`. Watch the order for `-`.
3. The expression is ill-formed if you must pop a stack with fewer than two elements, or if the stack does not hold exactly one element at the end.

## Solution
Go through the items with a stack of values. A number is pushed. For an operator, if there are fewer than two values in the stack, the expression is ill-formed; otherwise, pop `b` (the top), then `a`, and push the result of `a op b`. At the end, the expression is correct if and only if the stack holds exactly one value: it is the result.

**Why.** In a postfix expression, the two operands of an operator are the two most recent values not yet used. The stack holds exactly these unused values, the most recent at the top: the invariant is "the stack holds, in order, the values of the sub-expressions already read and not yet used".

**Cost.** One stack operation per item: about N operations. Searching the string for a pattern "number number operator", replacing it with its value and starting again would cost up to N² / 2 operations. The traps: swapping `a` and `b` for subtraction, and forgetting the remaining values (`1 2 3 +` is ill-formed). In C++, the values need `long long`.
