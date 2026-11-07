---
title: Rank of each score
---

## Statement
`N` participants each got a score. The higher the score, the better the ranking. The **rank** of a participant is 1 plus the number of participants whose score is **strictly** higher than theirs. Participants with the same score therefore have the same rank: with the scores `90`, `80`, `80` and `50`, the ranks are 1, 2, 2 and 4 (nobody is third).

Write a program that prints the rank of each participant, in the order in which the scores are given.

## Input
- The first line contains the integer `N`, the number of participants.
- The second line contains `N` integers separated by spaces: the scores of the participants.

## Output
A single line with `N` integers separated by spaces: the rank of each participant, in the order of the input.

## Constraints
- 1 ≤ N ≤ 10,000
- Each score is between 0 and 1,000,000.

## Hints
1. For each participant, counting one by one the scores higher than theirs is too slow when `N` is 10,000: that makes 100 million comparisons. Instead, sort a **copy** of the scores, from highest to lowest, without touching the original list.
2. In the sorted list, the first occurrence of a score `s`, at position `i` (counting from 1), has exactly `i - 1` strictly higher scores in front of it: the rank of `s` is therefore `i`.
3. Store these ranks in a dictionary, keeping only the **first** occurrence of each score. All that is left is to go through the original list and print the rank of each score.

## Solution
We cannot sort the list of scores directly: the ranks must be printed in the order of the input. So we sort a copy, from highest score to lowest.

In this sorted copy, equal scores are next to each other, and all the scores strictly higher than `s` are in front of the first `s`. If this first `s` is at position `i` (counting from 1), there are `i - 1` higher scores, and the rank of `s` is `i`. We go through the sorted copy and record, in a dictionary, the rank of each score the first time we meet it. Then we go through the original list and print `rang[s]` (*rang* means "rank") for each score.

In the first example, the sorted copy is `90 80 50 50`: `90` first appears at position 1, `80` at position 2 and `50` at position 3. The ranks, in the input order `50 80 50 90`, are `3 2 3 1`.

Traps:
- overwriting the rank at each occurrence of a score: the last `50` is at position 4, but the rank of `50` is 3;
- giving ranks that follow each other with no gap (1, 2, 2, 3): after two participants in second place, the next one is fourth;
- sorting the original list itself: you then lose the order in which the ranks must be printed.

Sorting does most of the work: a few hundred thousand operations for `N = 10,000`, compared with 100 million comparisons for the method that counts, for each participant, the scores better than theirs.
