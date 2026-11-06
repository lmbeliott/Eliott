---
title: The trail race ranking
---

## Statement
The Aiguilles trail race has just finished: N runners crossed the finish line, each with a time in seconds. The next day, Q hikers run the same course, stopwatch in hand, and want to know which rank they would have obtained in the official race.

For a time t, the **place** is 1 plus the number of official runners who are strictly faster (whose time is strictly less than t). The **ties** are the official runners whose time is exactly t.

Write a program that gives, for each hiker, their place and their number of ties. The hikers are not added to the ranking: each one is compared only with the N official runners.

## Input
- The first line contains two integers N and Q.
- The second line contains N integers: the times of the official runners, in no particular order.
- The third line contains Q integers: the times of the hikers.

## Output
Q lines, one per hiker in the order of the input: two integers separated by a space, the place and then the number of ties.

## Constraints
- 1 ≤ N ≤ 12 000
- 1 ≤ Q ≤ 12 000
- All times are integers between 1 and 50 000.

## Hints
1. Comparing each hiker with every runner takes N × Q = 144 million comparisons: too slow. First sort the times of the official runners.
2. In the sorted list, the runners strictly faster than t form a block at the beginning of the list. Their number is the first index i such that `temps[i] >= t` (*temps* means "times"): find it by binary search.
3. The number of times equal to t is (number of times `< t + 1`) − (number of times `< t`), because the times are integers. So a single search function is enough, called twice.

## Solution
**The idea: sort, then binary search.** We sort the N official times once. In the sorted list, the condition `temps[i] >= t` is false at the beginning and then true until the end. The first index where it becomes true is exactly the number of runners strictly faster than t. We find it by binary search, keeping an interval `[gauche, droite)` ("left", "right") that contains the answer:
- if `temps[milieu] < t` (*milieu* means "middle"), the answer is after `milieu`: `gauche = milieu + 1`;
- otherwise, `milieu` may be the answer: `droite = milieu`.

The place is this number plus 1. Since the times are integers, "time ≤ t" is the same as "time < t + 1": the number of ties is `nb_plus_rapides(t + 1) − nb_plus_rapides(t)` (*nb_plus_rapides* = "number of faster runners").

On the first example, the sorted list is `6540 6540 7100 7300 8100 9020`. For t = 7300, three runners are strictly faster (6540, 6540 and 7100): the hiker is 4th, with one tie.

**Complexity.** Sorting costs O(N log N), then each hiker needs two searches in O(log N): O((N + Q) log N) in total, a few hundred thousand operations.

**Why the naive solution is too slow.** Scanning the N times for each hiker takes N × Q = 1.44 × 10⁸ comparisons, about ten seconds in Python.

**Traps.**
- The loop `while gauche < droite` with `droite = milieu` (and not `milieu − 1`) never skips the answer and always stops: the interval shrinks at every step.
- A hiker faster than everyone gets place 1; a hiker slower than everyone gets place N + 1. So the search must be able to return 0 and N: that is why we start with `droite = len(temps)`, not `len(temps) − 1`.
- In Python, the `bisect` module does the same thing: `bisect_left(temps, t)` counts the times `< t` and `bisect_right(temps, t)` counts the times `≤ t`.
