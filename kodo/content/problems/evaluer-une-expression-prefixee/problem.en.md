---
title: Evaluate a prefix expression
---

## Statement
In **prefix notation**, the operator is written before its two operands, without parentheses. An expression is:

- either a non-negative integer, such as `7`;
- or an operator `+`, `-` or `*`, followed by a first expression, then a second one.

For example, `- * 3 4 5` means (3 × 4) − 5 = 7, and `* 3 - 4 5` means 3 × (4 − 5) = −3.

Compute the value of a prefix expression.

## Input
The first line contains N, the number of tokens of the expression (operators and integers). The second line contains the N tokens, separated by spaces.

## Output
The value of the expression.

## Constraints
- 1 ≤ N ≤ 3,999
- The integers of the expression are between 0 and 10⁹.
- The expression is valid, and the value of each of its subexpressions is between −10¹⁸ and 10¹⁸.

## Hints
1. The definition of an expression is recursive: the program can be too. A function `evaluate(i)` computes the value of the expression that starts at token number `i`.
2. After evaluating the first operand, you need to know where the second one starts. The function can return two things: the value, and the position of the token that follows the expression it read.
3. An expression like `+ + + … 1 1 1 1` causes nearly 2,000 nested calls: in Python, the limit must be raised with `sys.setrecursionlimit`.

## Solution
The function `evaluate(i)` returns the value of the expression that starts at token `i`, and the index of the first token after it.

- If token `i` is an integer, it is the whole expression: return its value and `i + 1`.
- Otherwise it is an operator. The first operand starts at `i + 1`: the call `evaluate(i + 1)` gives its value `a` and its end `j`. The second operand starts at `j`: `evaluate(j)` gives `b` and `k`. Return `a op b` and `k`.

**Correctness.** By induction on the length of the expression: an expression of a single token is an integer (base case). A longer expression starts with an operator, and its two operands are strictly shorter expressions, which the recursive calls evaluate correctly by the induction hypothesis; the index returned by the first call is exactly where the second operand starts.

**Cost.** Each token is read by exactly one call: there are N calls in total, so the time is proportional to N.

**Pitfall.** The depth of the calls can reach (N + 1) / 2, that is 2,000. Python's default limit is 1,000 nested calls: without `sys.setrecursionlimit(10000)`, the program stops with `RecursionError: maximum recursion depth exceeded`. In C++, the values need a `long long`.
