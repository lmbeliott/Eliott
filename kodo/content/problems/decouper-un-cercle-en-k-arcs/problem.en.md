---
title: Cutting a circle into K arcs
---

## Statement
N positive integers A_1, A_2, …, A_N are placed on a circle: each cell is next to the following one, and A_N is next to A_1. You must cut the circle into **exactly K arcs**: an arc is a run of neighbouring cells (it may go from A_N to A_1), each cell belongs to exactly one arc, and each arc contains at least one cell. The weight of an arc is the sum of its cells.

Write a program that computes the smallest possible weight of the heaviest arc.

## Input
- The first line contains two integers N and K.
- The second line contains N integers A_1, A_2, …, A_N, in the order of the circle.

## Output
A single integer: the smallest possible weight of the heaviest arc.

## Constraints
- 1 ≤ K ≤ N ≤ 15,000
- 1 ≤ A_i ≤ 10,000

## Hints
1. As for a list, turn the question around: for a limit D, can the circle be cut into at most K arcs of weight ≤ D? If yes for D, then yes for D + 1: the smallest limit can be found by binary search. The whole difficulty is answering this question quickly.
2. If you know where **one** cut of a good split is, the rest works as on a list: start there and take arcs as long as possible. Trying all N starting points costs too much when K is large. But the arc that contains cell p necessarily ends before the end of the longest arc starting at p.
3. For a limit D, call `next(i)` the end of the longest arc starting at i (a binary search in the prefix sums of the circle unrolled twice). Pick the cell p where this arc is the shortest: a good split necessarily cuts between p and `next(p)`. Only try those starting points, stopping as soon as you go over K arcs.

## Solution
**Binary search on the answer.** The question "can the circle be cut into at most K arcs of weight ≤ D?" is answered "no" for small D, then "yes" from some threshold on. At most K arcs is enough: since K ≤ N, an arc of several cells can always be cut in two. The answer is at least `max(A)` and at least ⌈S / K⌉ (S is the total sum), and `⌈S / K⌉ + max(A)` is always enough: the greedy split of a list, with this limit, makes every arc (except the last) weigh at least ⌈S / K⌉, so at most K arcs. The binary search does about 14 rounds.

**Answering the question on a circle.** On a list, we take as much as possible in each arc. On a circle, we also have to choose where to start. We unroll the circle twice (A_1 … A_N A_1 … A_N) and compute its prefix sums. For a limit D, `next(i)` is the end of the longest arc starting at cell i: a binary search (`bisect_right` or `upper_bound`) in the prefix sums finds it. The greedy split starting at i jumps from `i` to `next(i)`, then to `next(next(i))`, and so on until it has gone around: it uses as few arcs as possible among the splits that cut just before i.

**Where to start?** Take any cell p. In a good split, the arc containing p weighs at most D, so it ends no later than `next(p)`: there is a cut between p and `next(p)`. It is therefore enough to try the starts p + 1, …, `next(p)`. We pick the cell p for which `next(p) − p` is the smallest, and stop each attempt as soon as it goes over K arcs.

Why this is fast: if the greedy split starting at cell 1 succeeds, we are done. Otherwise, its first K arcs fit in fewer than N cells, so one of them has at most N / K cells, and so does the shortest of the arcs `next(p) − p`. We make at most N / K attempts of at most K + 1 jumps: about 2N jumps in total.

In the first example (5 1 3 8 9 3 6, K = 3), the total is 35, so some arc weighs at least 12. The arcs 6 + 5 + 1 = 12, 3 + 8 = 11 and 9 + 3 = 12 reach this bound: the answer is 12. Without going from the last cell to the first, the best would be 17.

**Complexity.** Each question costs O(N log N) (one binary search per jump), and the binary search on D does about log₂(10,000) ≈ 14 rounds: O(N log N log(max A)).

**Why the naive solution is too slow.** Cutting the circle at each of the N places and solving the list problem each time gives the right answer, but costs N times more. Even trying the N starts in each question, stopping after K + 1 arcs, makes N × K jumps, that is 7.5 × 10⁷ for N = 15,000 and K = 5,000, in each of the 14 rounds. And always cutting after the last cell is wrong: in the first example, it gives 17 instead of 12.

**Traps.**
- If D ≥ S, a single arc is enough: answer "yes" right away (otherwise `next(p)` may go around more than once).
- An attempt starting at cell `start` stops when it reaches `start + N` in the unrolled circle: take `start` modulo N to stay inside the array.
- Do not only try the starts in the arc beginning at cell 1: it can contain thousands of light cells.
