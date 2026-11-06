---
title: Position of the maximum
---

## Statement
In a contest, `N` candidates go one after the other and each one gets a score. The first one to go has number 1, the second one number 2, and so on.

The winner is the one with the highest score. If there is a tie, the one who went first wins. Write a program that reads the `N` scores and prints the number of the winner, then their score.

## Input
- The first line contains the integer `N`, the number of candidates.
- The second line contains `N` integers separated by spaces: the scores, in the order the candidates went.

## Output
A single line containing two integers separated by a space: the number of the winner, then their score.

## Constraints
- 1 ≤ N ≤ 1,000
- Each score is between 1 and 250.

## Hints
1. Go through the list while remembering two things: the best score seen so far, and the position where you saw it.
2. Start with the first candidate as the best one so far. For each next candidate, if their score is **strictly** higher than the best one so far, they take their place.
3. Positions in the list start at `0`, but the candidates' numbers start at `1`: remember to add 1 before printing.

## Solution
We are looking for the maximum of the list, and above all **where** it is. We keep a variable `meilleur` ("best": the position of the best score seen so far), which starts at `0`: the first candidate is the best one so far. Then we go through positions `1`, `2`, …, `N - 1`: if the score at position `i` is strictly higher than the one at position `meilleur`, then `meilleur` becomes `i`. At the end, we print `meilleur + 1` (the number) and the score.

The classic traps:
- using `>=` instead of `>`: in case of a tie, the last of the tied candidates would take the place of the first one, but it's the first one who wins;
- forgetting the `+ 1`: cell `0` of the list is number 1;
- starting the best-so-far with a made-up value: starting from the first element of the list always works, whatever the values are.
