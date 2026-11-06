---
title: The big ski jump
---

## Statement
At the Valcorde ski jumping contest, `N` jumpers take off one after the other from the big ski jump. The first one to jump wears bib number 1, the second one bib number 2, and so on. The winner is the one who jumps the farthest. If there is a tie, the one who jumped first wins, because they made their jump before the others.

Write a program that reads the lengths of the `N` jumps and prints the bib number of the winner, then the length of their jump.

## Input
- The first line contains the integer `N`, the number of jumpers.
- The second line contains `N` integers separated by spaces: the lengths of the jumps in meters, in the order the jumpers went.

## Output
A single line containing two integers separated by a space: the bib number of the winner, then the length of their jump.

## Constraints
- 1 ≤ N ≤ 1,000
- Each jump is between 1 and 250 meters long.

## Hints
1. Go through the list while remembering two things: the best length seen so far, and the position where you saw it.
2. Start with the first jumper as the best one so far. For each next jumper, if they jumped **strictly** farther than the best one so far, they take their place.
3. Positions in the list start at `0`, but bib numbers start at `1`: remember to add 1 before printing.

## Solution
We are looking for the maximum of the list, and above all **where** it is. We keep a variable `meilleur` ("best": the position of the best jump seen so far), which starts at `0`: the first jumper is the best one so far. Then we go through positions `1`, `2`, …, `N - 1`: if the jump at position `i` is strictly longer than the one at position `meilleur`, then `meilleur` becomes `i`. At the end, we print `meilleur + 1` (the bib number) and the length of the jump.

The classic traps:
- using `>=` instead of `>`: in case of a tie, the last of the tied jumpers would take the place of the first one, but it's the first one who wins;
- forgetting the `+ 1`: cell `0` of the list is bib number 1;
- starting the best-so-far with a made-up value: starting from the first element of the list always works, whatever the values are.
