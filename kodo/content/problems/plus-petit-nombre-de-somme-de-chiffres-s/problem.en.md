---
title: Smallest number with digit sum S
---

## Statement
Print the smallest non-negative integer whose digit sum is exactly `S`.

For example, for `S = 20`, the numbers `299`, `389`, `479`, `992` or `5555` have a digit sum equal to 20, and the smallest of all is `299`.

## Input
A single line containing the integer `S`.

## Output
A single integer: the smallest number whose digit sum is `S`.

## Constraints
- 0 ≤ S ≤ 162
- The answer is less than 10¹⁸: in C++, use a `long long`.

## Hints
1. Trying every number one by one takes far too long: for `S = 162`, the answer has 18 digits. You must build the answer directly.
2. Between two numbers without leading zeros, the one with fewer digits is the smaller. Each digit is at most 9: how many digits are needed at least to reach the sum `S`?
3. With the same number of digits, you want the first digit as small as possible, so the others as large as possible: 9s. The answer is the remainder `S % 9` followed by `S // 9` digits 9 (without the remainder if it's 0).

## Solution
Two remarks build the answer.

**As few digits as possible.** A number with `k` digits has a digit sum of at most `9 × k`. So you need at least `S / 9` digits, rounded up. And a number with fewer digits than another (without leading zeros) is always smaller.

**Small digits in front.** With this minimal number of digits, you want the first digit as small as possible, then the second, and so on. For that, put as much as possible in the last digits: 9s. With `q = S // 9` and `r = S % 9`, the answer is `r` followed by `q` digits 9. If `r = 0`, the answer is just `q` digits 9. For `S = 20`: `q = 2`, `r = 2`, the answer is `299`.

To build this number without strings, start from `r` and add a digit 9 on the right `q` times: `result = result × 10 + 9`. When `r = 0`, the starting 0 disappears by itself. The case `S = 0` gives 0, which is correct.

This is a **greedy** reasoning: at each step you make the best local choice (fewest digits, then the smallest leading digit), and you justify that this choice leads to the best answer.
