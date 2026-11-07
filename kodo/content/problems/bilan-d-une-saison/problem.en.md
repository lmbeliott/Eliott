---
title: Season summary
---

## Statement
A team played `N` matches. For each one, the number of goals scored `M` and the number of goals conceded `E` are known. A win (`M > E`) is worth 3 points, a draw 1 point, a loss 0 points. Print:
- the total number of points;
- the longest run of consecutive matches without a loss;
- the number of wins without conceding a goal.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains two integers `M` and `E`, in the order of the matches.

## Output
Three lines: the number of points, the length of the longest run without a loss, then the number of wins without conceding.

## Constraints
- 1 ≤ N ≤ 1 000
- 0 ≤ M, E ≤ 20

## Hints
1. For each match, you can compute two booleans: `win = M > E` and `loss = M < E`. A draw is neither.
2. The run without a loss works like a current run: it grows by 1 after a win or a draw, and goes back to 0 after a loss.
3. A win without conceding: `win and E == 0`.

## Solution
Read the matches one by one and keep four variables up to date: `points`, `run` (the current run without a loss), `record` (the longest run) and `clean` (the wins without conceding).

For each match:
- if `M > E`, add 3 points; if `M == E`, add 1 point;
- if `M >= E` (no loss), `run` grows by 1 and `record` is updated; otherwise, `run` goes back to 0;
- if `M > E and E == 0`, increase `clean`.

The traps: a draw **extends** the run without a loss (it is not a loss); a `0 0` match is a draw, not a win without conceding; and the record must be updated during the run, so as not to miss a run that lasts until the last match.
