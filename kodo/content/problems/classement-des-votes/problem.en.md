---
title: Ranking the votes
---

## Statement
People vote for their favourite colour: each vote gives between 1 and 5 points to a colour. The same colour can receive several votes, and its score is the sum of all the points it received.

Write a program that prints the ranking of the colours, from the highest score to the lowest. When two colours have the same score, the one whose name comes first in alphabetical order is ranked first.

## Input
- The first line contains an integer `N`: the number of votes.
- The next `N` lines each contain a vote: the name of a colour (in lowercase letters without accents), then an integer, the number of points, separated by a space.

## Output
One line for each colour that received at least one vote, in ranking order: its name, a space, then its score.

## Constraints
- 1 ≤ N ≤ 1,000
- Each name has between 1 and 15 letters.
- Each vote gives between 1 and 5 points.

## Hints
1. First you need to compute the score of each colour. A dictionary whose keys are the names and whose values are the scores is perfect for that.
2. To rank them, make a list of pairs and sort it. Which pair should you choose so that sorting puts the scores from highest to lowest, and ties in alphabetical order?
3. Trick: sort pairs `(-score, name)`. The highest score has the smallest `-score`, so it comes first; and for equal scores, the sort compares the names, in alphabetical order. Don't forget to print the score without the minus sign.

## Solution
The problem takes two steps.

**Counting.** We go through the votes and add up the points of each colour in a dictionary `total`. In Python, you have to create the key with the value `0` the first time you meet a name. In C++, with a `map<string, int>`, `total[nom] += points` is enough: a missing key is created automatically with the value `0`. (`nom` is French for "name".)

**Sorting.** We want an order with two criteria: decreasing score, then increasing name. We build the list of pairs `(-score, name)` and sort it normally, in increasing order. Since `-score` is compared first, the highest score comes first; and when the scores are equal, the names break the tie in alphabetical order. Then we print each name with its score, turning the score back the right way round.

The traps:
- sorting the pairs `(score, name)` with `reverse=True` (or sorting them, then reversing the list): ties would then be in **reverse** alphabetical order too, which is wrong;
- forgetting that a colour can receive several votes: you must add the points, not replace them;
- the alphabetical order of words that start the same way: `or` comes before `orange`. String comparisons in Python and C++ handle this on their own.
