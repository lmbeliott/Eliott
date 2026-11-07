---
title: Back to the initial order
---

## Statement
A deck contains `N` cards, at positions `1` to `N`. A shuffle moves the card at position `i` to position `P_i`; the `P_i` are the integers from `1` to `N`, each once. The same shuffle is repeated.

Print the smallest number `k ≥ 1` of shuffles after which all cards are back at their starting position, modulo `1,000,000,007`.

## Input
- The first line contains `N`.
- The second line contains `P₁ … P_N`.

## Output
A single integer: this number of shuffles, modulo `1,000,000,007`.

## Constraints
- 1 ≤ N ≤ 20,000

## Hints
1. Follow a card: `i → P_i → P_(P_i) → …` eventually comes back to `i`. Positions split into **cycles**, like the components of a graph where each vertex has exactly one outgoing arrow.
2. A card in a cycle of length `L` is in its place exactly after a multiple of `L` shuffles. The answer is the LCM of the cycle lengths.
3. This LCM can have hundreds of digits. For each prime `q`, its exponent in the LCM is the largest exponent of `q` in the lengths: factorise each length with a sieve.

## Solution
**Cycles.** The graph `i → P_i` has exactly one arrow leaving each vertex and one entering it: it splits into disjoint cycles. Go through them with an array `vu` (seen), following the arrows from each position not seen yet: O(N) in total.

**The LCM.** In a cycle of length `L`, a card moves one step along the cycle at each shuffle: it is in its place exactly when the number of shuffles is a multiple of `L`. All cards are in place when `k` is a multiple of all the lengths: the smallest such `k` is their **LCM**.

**Computing it modulo 10⁹ + 7.** The LCM cannot be reduced modulo a number along the way (the GCD no longer makes sense after reduction). Use prime factors instead: if `L = q₁^e₁ × q₂^e₂ × …`, the LCM has, for each prime `q`, the **maximum** of the exponents of `q` in the lengths. A sieve gives the smallest prime factor of every integer up to `N`, which factorises each length in a few divisions. Then multiply the `q^e` modulo 10⁹ + 7.

**Complexity.** O(N log log N) for the sieve, O(N) for the cycles, and each length is factorised in O(log N).

**Pitfalls.** The real LCM can exceed 10¹⁵⁰: in C++, computing `lcm = lcm / gcd × L` overflows, and taking the remainder along the way gives a wrong result. Fixed points (`P_i = i`) are cycles of length 1. If the permutation is the identity, the answer is `1`.
