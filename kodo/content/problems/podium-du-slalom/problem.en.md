---
title: The slalom podium
---

## Statement
It's the day of the big slalom race of the Valcorde ski school! Hugo, the instructor, times each child's run in hundredths of a second: a time of `5412` means 54 seconds and 12 hundredths. The shortest time wins.

Now Hugo has to call the three children on the podium. Write a program that prints their first names: first the gold medal (the best time), then silver, then bronze.

## Input
- The first line contains an integer `N`: the number of children.
- The next `N` lines each contain a first name (with no accent or space) and a time, separated by a space.

All the times are different.

## Output
Three lines: the first names of the children who came first, second and third.

## Constraints
- 3 ≤ N ≤ 100
- 1 ≤ time ≤ 100,000

## Hints
1. If you sort the results from the smallest time to the largest, the podium is the first three of the list.
2. You have to sort the **times**, but print the **names**. Store each result as a pair `(time, name)`: when you sort pairs, their first elements are compared first.
3. Don't forget to convert the time into a number with `int`. Otherwise, the times are compared like words, character by character, and `"950"` comes after `"1000"`.

## Solution
We store the results in a list of pairs `(time, name)`, then sort it. Sorting pairs compares the first elements first, so the times: the children end up sorted from fastest to slowest. We just print the name in the first three pairs.

In Python, we use tuples and `resultats.sort()`. In C++, we use a `vector<pair<int, string>>` and `sort(resultats.begin(), resultats.end())`; `resultats[i].second` is the name. (`resultats` is French for "results".)

The traps:
- putting the name first in the pair: you would then sort in alphabetical order!
- keeping the times as text: strings are compared character by character, and `"950"` is "bigger" than `"1000"` because `9 > 1`. The second example is there to remind you.
