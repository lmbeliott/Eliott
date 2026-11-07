---
title: Power tower modulo P
---

## Statement
Let P = 1,000,000,007, which is a prime number. Answer T questions: for given A, B and C, print the remainder of A to the power (B to the power C), that is A^(B^C), divided by P. For example, for A = 2, B = 3 and C = 2, we compute 2⁹ = 512.

We agree that x⁰ = 1 for every x, including 0⁰ = 1.

## Input
The first line contains T. Each of the next T lines contains three integers A, B and C.

## Output
T lines: for each question, A^(B^C) mod P.

## Constraints
- 1 ≤ T ≤ 1,000
- 0 ≤ A, B, C ≤ 10¹⁸

## Hints
1. The exponent B^C can have 10¹⁹ digits: impossible to compute, even in Python. It must be reduced.
2. Fermat's little theorem: if A is not a multiple of P, then A^(P−1) ≡ 1 (mod P). So the exponent can be taken modulo P − 1.
3. Beware of the cases where A is a multiple of P (the answer is 0, unless the exponent is zero) and where the exponent is zero (B = 0 and C ≥ 1).

## Solution
**Reducing the exponent.** Let E = B^C. If A is not a multiple of P, Fermat's little theorem gives A^(P−1) ≡ 1 (mod P). Writing E = q × (P − 1) + r, we get A^E = (A^(P−1))^q × A^r ≡ A^r (mod P). So it is enough to compute r = B^C mod (P − 1) by fast exponentiation, then A^r mod P, again by fast exponentiation. Beware: reduce modulo P − 1, not modulo P.

**Special cases.** If A is a multiple of P (A = 0 or A = P, 2P…), Fermat does not apply: A^E ≡ 0 if E ≥ 1, and A⁰ = 1. Now E = 0 exactly when B = 0 and C ≥ 1 (with the convention 0⁰ = 1, B = 0 and C = 0 give E = 1). If A is not a multiple of P, Fermat's formula handles every case, including E = 0 (r = 0) and a nonzero E multiple of P − 1 (r = 0 too, and A^E ≡ 1, which is right).

**Traps.** Reducing the exponent modulo P instead of P − 1; forgetting the case A multiple of P, which answers 1 instead of 0 when E is a multiple of P − 1. In C++, reduce A and B before multiplying: a product of two remainders below P fits in a `long long`. **Cost**: two fast exponentiations, about 120 multiplications per question.
