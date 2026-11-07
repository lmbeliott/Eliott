---
title: Reading a book in K days
---

## Statement
A book has N chapters, and chapter i is L_i pages long. You want to read it in **exactly K days**: each day, you read one or more consecutive chapters, whole and in order.

Write a program that computes the smallest possible number of pages for the busiest day, in the best possible split.

## Input
- The first line contains two integers N and K.
- The second line contains N integers L_1, L_2, …, L_N.

## Output
A single integer: the smallest possible value of the number of pages read on the busiest day.

## Constraints
- 1 ≤ K ≤ N ≤ 25 000
- 1 ≤ L_i ≤ 10 000

## Hints
1. Turn the question around: if you refuse to read more than D pages per day, how many days do you need at least? This number can be computed in a single pass over the chapters.
2. For a fixed limit D, it is enough to read as much as possible each day, and to stop as soon as the next chapter would take you over D. The larger D is, the fewer days you need: look for the smallest limit D by binary search.
3. D cannot be smaller than the longest chapter, and D = the sum of all the chapters is always enough (a single day). Why does "at most K days" give the same answer as "exactly K days"?

## Solution
**The idea: binary search on the answer.** We ask a simpler question: "Can the book be read in at most K days without ever reading more than D pages per day?"

To answer it, we read as much as possible each day: we add the chapters one by one, and as soon as the next one would take us over D, we stop and start a new day. This greedy split uses as few days as possible: stopping earlier on a given day never lets you go further afterwards. We compare its number of days with K.

The answer to this question is "no" for small values of D, then "yes" from some threshold on: if D works, D + 1 works too. We look for this threshold by binary search between `trop_petit = max(L) − 1` ("too small": a chapter fits in no day) and `suffisant = L_1 + … + L_N` ("enough": everything in one day).

**Exactly K days.** The greedy split may use fewer than K days. That is not a problem: since K ≤ N, we can always cut a day with several chapters in two until we reach exactly K days, and cutting a day never makes the longest day longer.

On the first example (12 7 9 15 4 8, K = 3), with D = 24 we get 12 + 7 | 9 + 15 | 4 + 8: three days. With D = 23, four days are needed (12 + 7 | 9 | 15 + 4 | 8). The answer is 24.

**Complexity.** The binary search makes about log₂(25 000 × 10 000) ≈ 28 steps, each in O(N): O(N log S), where S is the total number of pages. Less than a million operations.

**Why the naive solution is too slow.** Trying D = max(L), max(L) + 1, max(L) + 2… until it works costs O(N) per value, and the answer can exceed 10⁸ when K is small: more than 10¹² operations. Starting from the average ⌈S / K⌉ (the busiest day holds at least that many pages) is not enough either: the answer can be several thousand above it, and that many tries are still too slow in Python. Trying every possible split is even worse.

**Traps.**
- Start the search at `max(L) − 1`, not at 0: with a limit smaller than a chapter, the greedy split makes no sense.
- In the binary search, keep the meaning of the bounds straight: `trop_petit` is never enough, `suffisant` is always enough, and we stop when they are next to each other.
