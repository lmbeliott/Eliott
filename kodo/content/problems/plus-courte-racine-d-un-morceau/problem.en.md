---
title: Shortest root of a piece
---

## Statement
The **root** of a word `W` is the shortest word `U` such that `W` is `U U … U` (`U` repeated a whole number of times). For example, the root of `abcabcabc` is `abc`, the root of `aaaa` is `a`, and the root of `abcab` is `abcab` itself.

You are given a word `S` and `Q` queries. Each query names a piece `S[l..r]` (the letters from position `l` to position `r` included, numbered from `1`).

Write a program that prints, for each query, the length of the root of the piece.

## Input
- The first line contains the word `S`, made of lowercase letters. Let `N` be its length.
- The second line contains the integer `Q`.
- The next `Q` lines each contain two integers `l` and `r`.

## Output
`Q` lines: for each query, in order, the length of the root of `S[l..r]`.

## Constraints
- 1 ≤ N ≤ 100 000
- 1 ≤ Q ≤ 10 000
- 1 ≤ l ≤ r ≤ N

## Hints
1. If `L = r - l + 1`, the length of the root is a divisor `t` of `L`, and the piece is made of a block of length `t` exactly when it has **period** `t`: `S[l..r-t]` equals `S[l+t..r]`. With a polynomial hash, this test costs O(1).
2. Trying every divisor of `L` is too expensive, since some lengths have more than 100 of them. If `t` works and `t'` is a divisor of `L` that is a multiple of `t`, then `t'` works too. And the root divides every length that works.
3. Start from `t = L`. For each prime factor `p` of `L`, divide `t` by `p` as long as `t / p` works. A sieve giving the smallest prime factor of every integer up to `N` factors `L` in a few steps.

## Solution
Let `L = r - l + 1`. A word of length `L` is `U U … U` with `|U| = t` if and only if `t` divides `L` and the word has period `t`, that is `S[l..r-t] = S[l+t..r]`. With prefix hashes, this equality is tested in **O(1)**.

**Structure of the valid lengths.** Call `t` *valid* if it divides `L` and the piece has period `t`. If `t` is valid, every divisor of `L` that is a multiple of `t` is valid too. Conversely, if `t₁` and `t₂` are valid, so is their GCD: this is the Fine and Wilf lemma, which applies because `t₁ + t₂ ≤ L + gcd(t₁, t₂)` when both divide `L`. So the root `t₀` is the smallest valid length, and the valid lengths are exactly the divisors of `L` that are multiples of `t₀`.

**Removing prime factors.** Start from `t = L`, which is always valid. For each prime `p` dividing `L`, replace `t` with `t / p` as long as `t` is still divisible by `p` and `t / p` is valid. Since "valid" means "multiple of `t₀`", this removes from `t` exactly the extra factors `p`, and the order of the primes doesn't matter. At the end, `t = t₀`. The number of tests is at most the number of prime factors of `L` counted with multiplicity, plus the number of distinct primes: fewer than 25 for `L ≤ 100 000`. A smallest-prime-factor sieve factors `L` just as fast.

Total: **O(N log log N + Q log N)**.

Why simple ideas fail: trying every divisor by comparing letter by letter costs up to about 128 × 100 000 operations per query (98 280 has 128 divisors). The tests are built so that every comparison goes almost to the end. Recomputing the prefix function of the piece for each query costs O(L) per query, several hundred million operations in total: too slow as well.

Traps:
- Don't compare hashes computed "modulo 2⁶⁴" by overflow: on the Thue-Morse word, the left half and the right half of an aligned block of length 4096 always have the same hash, and one test checks this. Use a large prime modulus (`2⁶¹ - 1`) or two moduli.
- The primes to try are those of `L`, not those of `t` (which change during the computation): factor `L` once at the start.
