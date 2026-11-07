---
title: Counting a digit from 1 to N
---

## Statement
All the integers from 1 to N are written in base 10, without leading zeros. How many times does the digit c appear? For example, from 1 to 13, the digit 1 appears 6 times: in 1, 10, 11 (twice), 12 and 13.

Answer Q questions of this kind.

## Input
The first line contains Q. Each of the next Q lines contains N and c.

## Output
Q lines: for each question, the number of appearances of the digit c.

## Constraints
- 1 ≤ Q ≤ 1,000
- 1 ≤ N ≤ 10¹⁸
- 0 ≤ c ≤ 9

## Hints
1. Writing the numbers one by one is impossible for N = 10¹⁸. Count position by position instead: how many numbers from 1 to N have the digit c in the units position? in the tens? in the hundreds?
2. For the position of weight p = 10^k, cut N into three pieces: the **high** part h = ⌊N / (10p)⌋, the **current** digit d = ⌊N/p⌋ mod 10, and the **low** part b = N mod p. The numbers from 0 to N whose digit of weight p is c can be counted from h, d and b.
3. The digit 0 needs a correction: a number has no leading zero, so the high part of a number with a 0 in position p cannot be empty.

## Solution
Count separately, for each position p = 1, 10, 100…, the numbers x between 1 and N whose digit of weight p is c. Write N = h × 10p + d × p + b, with h the high part, d the digit of weight p and 0 ≤ b < p the low part. A number x ≤ N whose digit of weight p is c can be written x = h' × 10p + c × p + b', with 0 ≤ b' < p.

**Case c ≥ 1.**
- If h' < h, every value of b' works: h choices for h', p choices for b', that is h × p numbers.
- If h' = h: if c < d, the p values of b' work; if c = d, we need b' ≤ b, that is b + 1 values; if c > d, none.

**Case c = 0.** The high part h' of a number with a 0 in position p must be at least 1 (otherwise this 0 would be a leading zero). Count the same way with h' from 1 to h − 1, which gives (h − 1) × p, then h' = h depending on d, but only if h ≥ 1.

The answer is the sum over the 19 possible positions. For example, for N = 13 and c = 1: in the units position, h = 1, d = 3, b = 0, which gives 1 × 1 + 1 = 2 (the numbers 1 and 11); in the tens position, h = 0, d = 1, b = 3, which gives 0 + (3 + 1) = 4 (from 10 to 13). Total: 6.

**Correctness.** Each appearance of the digit c in the writing of a number x is counted once, at its position, and the cases above describe exactly the x ≤ N concerned, since comparing x with N amounts to comparing first the high parts, then the digits of weight p, then the low parts.

**Cost.** 19 positions per question: O(log N), against O(N log N) to write all the numbers. The answer can approach 2 × 10¹⁸: `long long` in C++. Beware of 10p, which exceeds the capacity of a `long long` when p = 10¹⁸: compute h as ⌊⌊N/p⌋/10⌋, and only multiply p by 10 if it stays at most N.
