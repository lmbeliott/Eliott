---
title: Top three times
---

## Statement
In a race, each participant wears a bib number, and their time is measured in hundredths of a second: a time of `5412` means 54 seconds and 12 hundredths. The shortest time wins.

Write a program that prints the bib numbers of the first three: first the one with the best time, then the second one, then the third one.

## Input
- The first line contains an integer `N`: the number of participants.
- The next `N` lines each contain a bib number and a time, separated by a space.

All the bib numbers are different, and all the times are different.

## Output
Three lines: the bib numbers of the participants who came first, second and third.

## Constraints
- 3 ≤ N ≤ 100
- 1 ≤ bib ≤ 999
- 1 ≤ time ≤ 100,000

## Hints
1. If you sort the results from the smallest time to the largest, the first three of the list are the three winners.
2. You have to sort the **times**, but print the **bib numbers**. Store each result as a pair `(time, bib)`: when you sort pairs, their first elements are compared first.
3. Don't forget to convert the time into a number with `int`. Otherwise, the times are compared like words, character by character, and `"950"` comes after `"1000"`.

## Solution
We store the results in a list of pairs `(time, bib)`, then sort it. Sorting pairs compares the first elements first, so the times: the participants end up sorted from fastest to slowest. We just print the bib number in the first three pairs.

In Python, we use tuples and `resultats.sort()`. In C++, we use a `vector<pair<int, int>>` and `sort(resultats.begin(), resultats.end())`; `resultats[i].second` is the bib number. (`resultats` is French for "results", and `dossard` for "bib".)

The traps:
- putting the bib number first in the pair: you would then sort by bib number!
- keeping the times as text: strings are compared character by character, and `"950"` is "bigger" than `"1000"` because `9 > 1`. The second example is there to remind you.
