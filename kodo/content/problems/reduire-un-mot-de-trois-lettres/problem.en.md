---
title: Reduce a three-letter word
---

## Statement
A word is made of the letters `a`, `b` and `c`. A **reduction** replaces two different neighbouring letters by the third letter: `ab` or `ba` becomes `c`, `ac` or `ca` becomes `b`, `bc` or `cb` becomes `a`. The word loses one letter with each reduction. You make as many reductions as you like, in any order.

For example, `aabb` can become `acb`, then `bb`; or `abab` can become `cab`, then `cc`.

For each word, print the smallest length that can be reached. When this length is 1, the remaining letter is always the same, whatever reductions are chosen: print it too, after a space.

## Input
- The first line contains `T`, the number of words.
- Each of the next `T` lines contains a word.

## Output
For each word, one line: the smallest reachable length, followed by the remaining letter if this length is 1.

## Constraints
- 1 ≤ T ≤ 5,000
- Each word has at least one letter, and the total length of the words of a test does not exceed 100,000.

## Hints
1. If the word uses only one letter, no reduction is possible. Otherwise, try small examples by hand and look at the number of `a`s, `b`s and `c`s.
2. A reduction changes each of the three letter counts by 1 (two decrease, one increases). What happens to their parities?
3. If the three counts have the same parity, this stays true after each reduction; yet a one-letter word has the counts `1, 0, 0`. It remains to show that you can always get down to 1 or 2 letters.

## Solution
Count `na`, `nb` and `nc`, the numbers of `a`s, `b`s and `c`s.

**A word made of a single repeated letter.** No reduction is possible: the answer is the length of the word (followed by the letter if the word has a single letter).

**An invariant.** A reduction decreases two of the counts by 1 and increases the third by 1: **all three parities change** at the same time. So the property "`na`, `nb` and `nc` have the same parity" is preserved, as well as the identity of the letter whose parity differs from the other two, when there is one. A one-letter word, for example `a`, has the counts `1, 0, 0`: the parities are not all equal, and `a` is the one whose parity differs. Therefore, if the three parities are equal at the start, a single letter can never be reached; otherwise, if a single letter is reached, it must be the one whose parity differs at the start.

**You can always get down to at most 2 letters.** As long as the word has at least 4 letters and at least two different letters, there is a reduction that keeps at least two different letters. Indeed, if a reduction gave a word made only of the letter `z`, all the other letters would be `z`s, and the word would look like `z…z x y z…z`; by reducing instead `y` with a neighbouring `z` (or `x` with a neighbouring `z`), you get `x x` (or `y y`) next to at least one remaining `z`, since there were at least two `z`s. You go down this way to 3 letters. At 3 letters, either a reduction keeps two different letters, and a last reduction gives 1 letter, or all of them give a word of 2 identical letters. In every case, you reach 1 or 2 letters.

**Conclusion.** If the parities are equal, 1 letter is impossible and 2 is reachable: the answer is 2. Otherwise, a word of 2 identical letters (counts `2, 0, 0`, equal parities) is impossible, so the descent ends at 1 letter: the answer is 1, with the letter whose parity differs. The program only counts letters: one pass per word, a cost proportional to the total length. Trying every sequence of reductions would be exponential.
