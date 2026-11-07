---
title: K-th letter of a compressed text
---

## Statement
A text is written in compressed form: `c(T)` means "the text T repeated c times". Repetitions can be nested. For example, `ab3(cd)e` expands to `abcdcdcde`, and `2(x3(yz))w` to `xyzyzyzxyzyzyzw`.

The expanded text can be gigantic. Answer Q questions: what is the K-th letter of the expanded text?

## Input
The first line contains the compressed text S. The second line contains Q. Each of the next Q lines contains an integer K.

## Output
Q lines: for each question, the K-th letter of the expanded text (the first letter has number 1).

## Constraints
- 1 ≤ length of S ≤ 10,000
- S is made of lowercase letters, digits and parentheses. Each number c is written without leading zeros, satisfies 1 ≤ c ≤ 10⁹, and is followed by a non-empty text in parentheses.
- Parentheses are nested at most 1,000 levels deep.
- The length L of the expanded text satisfies L ≤ 10¹⁸.
- 1 ≤ Q ≤ 50 and 1 ≤ K ≤ L

## Hints
1. Expanding the text is impossible: it can have 10¹⁸ letters. You only need the expanded length of each piece.
2. Read S with a recursive function: a text is a sequence of pieces, each being a letter or a group `c(T)`, and T is read by a recursive call. The function returns the pieces, the expanded length, and the position where reading stopped.
3. To find the K-th letter, go through the pieces, subtracting their length from K. If K falls inside a group `c(T)` whose T has length ℓ, the letter sought is letter number `(K − 1) mod ℓ + 1` of T.

## Solution
**Reading.** The function `read_text(i)` reads a text from position `i`, up to a `)` or the end of S. Until it gets there, it reads a piece: a letter, of length 1, or a number c followed by `(`; in that case a recursive call reads the text T of the group and returns its length ℓ, then the `)` is skipped. The group has length c × ℓ. For each text, keep the list of its pieces and its length. Each character of S is read once: the cost is proportional to the length of S.

**Search.** The function `find(pieces, k)` goes through the pieces in order. A letter is the right one if `k = 1`; otherwise subtract 1 from k. A group `c(T)` of length `c × ℓ` contains the letter if `k ≤ c × ℓ`; the expanded text of the group is T repeated, so its k-th letter is letter number `(k − 1) mod ℓ + 1` of T, found by a recursive call. Otherwise subtract `c × ℓ` from k and move to the next piece.

**Correctness.** By induction on the nesting depth: at each step, k is the position of the letter sought within the part of the text still to be scanned, and the modulo rule follows from the periodicity of T repeated c times.

**Cost.** A question scans each piece of S at most once, at most 10,000 steps, and goes down at most 1,000 levels. In Python this depth exceeds the default limit: `sys.setrecursionlimit(10000)` is needed. In C++, lengths are `long long`; `c × ℓ` does not overflow, since it is the length of a part of the text, at most 10¹⁸.
