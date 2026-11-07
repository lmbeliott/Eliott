---
title: Frieze of numbered waves
---

## Statement
A vertical frieze is drawn with lines of `#`. The lengths of the successive lines follow the pattern 1, 2, 3, 2, 1, 2, 3, 2, 1, …: they go up from 1 to 3, back down to 1, up again, and so on. The frieze starts and ends with a line of a single `#`, and contains exactly 12 **crests**, that is, 12 lines of three `#`.

Each crest is followed, on the same line, by a space and then its number: `1` for the first crest from the top, `2` for the second one, and so on up to `12`.

Print the frieze.

## Input
None: the program reads nothing.

## Output
The frieze, one line of `#` per printed line. Crest lines have the form `### k`. The frieze starts with the line `#`, then `##`, then `### 1`, then `##`, then `#`, then `##`, then `### 2`, etc.

## Hints
1. Find the pattern that repeats exactly: a crest and what surrounds it. Careful, the single-`#` lines are shared between two neighbouring waves.
2. The block `#`, `##`, `### k`, `##` is repeated 12 times. What is missing at the end?
3. The loop variable can directly serve as the crest number.

## Solution
Cut the frieze into blocks of 4 lines: `#`, `##`, `### k`, `##`. Putting 12 blocks one after the other, you get every line of the frieze except the very last one: the final `#` line, which must be printed once, after the loop. The frieze therefore has 4 × 12 + 1 = 49 lines.

The crest number is the loop variable itself, provided it goes from 1 to 12: `for k in range(1, 13)`, and the crest line is printed with `print("###", k)`.

The classic traps are those of **fence posts and gaps**: for 12 waves, there are 13 single-`#` lines (one more than crests). A block containing both `#` lines (`#`, `##`, `###`, `##`, `#`) would produce two consecutive `#` lines between two waves; a block without a final line forgets the last `#`. You must also number from 1 to 12, not from 0 to 11 as with `range(12)`.
