---
title: The great crossing
---

## Statement
Hugo is preparing the great crossing of Valcorde. The route is split into N sections that follow each other, of lengths L_1, L_2, …, L_N kilometres, with a mountain hut at the end of each section.

He wants to do the crossing in **exactly K days**. Each day, he walks one or more consecutive sections, in order, and sleeps at the hut where he stops. He cannot stop in the middle of a section. To avoid wearing himself out, he wants the longest of his days to be as short as possible.

Write a program that computes the distance of the longest day, in the best possible split.

## Input
- The first line contains two integers N and K.
- The second line contains N integers L_1, L_2, …, L_N.

## Output
A single integer: the smallest possible value of the distance of the longest day.

## Constraints
- 1 ≤ K ≤ N ≤ 50 000
- 1 ≤ L_i ≤ 99

## Hints
1. Turn the question around: if Hugo refuses to walk more than D km per day, how many days does he need at least? This number can be computed in a single pass over the sections.
2. For a fixed limit D, it is enough to go as far as possible each day, and to sleep at the hut as soon as the next section would take you over D. The larger D is, the fewer days you need: look for the smallest limit D by binary search.
3. D cannot be smaller than the longest section, and D = the sum of all the sections is always enough (a single day). Why does "at most K days" give the same answer as "exactly K days"?

## Solution
**The idea: binary search on the answer.** We ask a simpler question: "Can the crossing be done in at most K days without ever walking more than D km per day?"

To answer it, we walk as far as possible each day: we add the sections one by one, and as soon as the next one would take us over D, we sleep at the hut and start a new day. This greedy split uses as few days as possible: stopping earlier on a given day never lets you go further afterwards. We compare its number of days with K.

The answer to this question is "no" for small values of D, then "yes" from some threshold on: if D works, D + 1 works too. We look for this threshold by binary search between `trop_petit = max(L) − 1` ("too small": a section fits in no day) and `suffisant = L_1 + … + L_N` ("enough": everything in one day).

**Exactly K days.** The greedy split may use fewer than K days. That is not a problem: since K ≤ N, we can always cut a day with several sections in two until we reach exactly K days, and cutting a day never makes the longest day longer.

On the first example (12 7 9 15 4 8, K = 3), with D = 24 we get 12 + 7 | 9 + 15 | 4 + 8: three days. With D = 23, four days are needed (12 + 7 | 9 | 15 + 4 | 8). The answer is 24.

**Complexity.** The binary search makes about log₂(50 000 × 99) ≈ 23 steps, each in O(N): O(N log S), where S is the total length. About a million operations.

**Why the naive solution is too slow.** Trying D = max(L), max(L) + 1, max(L) + 2… until it works costs O(N) per value, and the answer can exceed a million when K is small: more than 10¹⁰ operations. Trying every possible split is even worse.

**Traps.**
- Start the search at `max(L) − 1`, not at 0: with a limit smaller than a section, the greedy split makes no sense.
- In the binary search, keep the meaning of the bounds straight: `trop_petit` is never enough, `suffisant` is always enough, and we stop when they are next to each other.
