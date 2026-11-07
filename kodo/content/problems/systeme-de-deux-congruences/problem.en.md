---
title: System of two congruences
---

## Statement
Two lighthouses flash: the first lights up at the times with remainder A₁ when divided by M₁, the second at the times with remainder A₂ when divided by M₂. Print the first time x ≥ 0 when both light up together, that is the smallest x ≥ 0 such that x ≡ A₁ (mod M₁) and x ≡ A₂ (mod M₂), or `-1` if this never happens.

For example, with x ≡ 2 (mod 3) and x ≡ 3 (mod 5), the answer is 8. With x ≡ 1 (mod 4) and x ≡ 2 (mod 6), there is no solution: x would be both odd and even.

Answer T questions.

## Input
The first line contains T. Each of the next T lines contains four integers A₁, M₁, A₂ and M₂.

## Output
T lines: for each question, the smallest solution x ≥ 0, or `-1`.

## Constraints
- 1 ≤ T ≤ 1,000
- 1 ≤ M₁, M₂ ≤ 10⁹
- 0 ≤ A₁ < M₁ and 0 ≤ A₂ < M₂

## Hints
1. The x satisfying the first condition are written x = A₁ + M₁ × k. The second condition becomes a congruence on k: M₁ × k ≡ A₂ − A₁ (mod M₂).
2. This is the congruence a × k ≡ b (mod m) of the lesson: with g = GCD(M₁, M₂), it has solutions if and only if g divides A₂ − A₁, and then k is determined modulo M₂ / g.
3. Take the smallest k ≥ 0. The answer x = A₁ + M₁ × k is then smaller than LCM(M₁, M₂), which is at most 10¹⁸.

## Solution
**Reducing to a congruence.** The x such that x ≡ A₁ (mod M₁) are the A₁ + M₁ × k with k an integer. Such an x also satisfies x ≡ A₂ (mod M₂) if and only if M₁ × k ≡ A₂ − A₁ (mod M₂). Let g = GCD(M₁, M₂). If g does not divide d = A₂ − A₁, there is no solution: M₁ × k − d would be a multiple of M₂, hence of g, whereas M₁ × k is one and d is not.

**Solving.** Otherwise, divide by g: (M₁/g) × k ≡ d/g (mod M₂/g), and M₁/g is coprime with M₂/g. The extended Euclidean algorithm gives an inverse u of M₁/g modulo M₂/g, and k ≡ u × (d/g) (mod M₂/g). Take the smallest k ≥ 0, between 0 and M₂/g − 1, and x = A₁ + M₁ × k.

**It is the smallest.** The solutions in k are k + j × (M₂/g), so the solutions in x are x + j × LCM(M₁, M₂), since M₁ × M₂ / g = LCM(M₁, M₂). Since 0 ≤ k < M₂/g and A₁ < M₁, our x is between 0 and LCM(M₁, M₂) − 1: it is the smallest non-negative solution. This is the **Chinese remainder theorem**, here without assuming M₁ and M₂ coprime.

**Traps.** d can be negative: in C++, bring d/g modulo M₂/g back between 0 and M₂/g − 1 before multiplying by u, itself brought back between 0 and M₂/g − 1; the product stays below 10¹⁸. M₁ × k is below the LCM, hence below 10¹⁸. **Cost**: O(log) per question; trying x = A₁, A₁ + M₁, … would take up to 10⁹ attempts per question.
