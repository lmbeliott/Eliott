---
title: Elimination in a circle
---

## Statement
`N` people, numbered from 1 to `N`, stand in a circle in order: after person `N` comes person 1. People are counted starting from person 1, and the `K`-th person counted leaves the circle. Counting then starts again from the next person, among those who remain, and so on until everybody has left. Print the numbers of the people in the order in which they leave.

For example, with `N = 5` and `K = 2`, people leave in the order `2 4 1 5 3`.

## Input
A single line containing `N` and `K`, separated by a space.

## Output
A single line with the `N` numbers, in leaving order, separated by spaces.

## Constraints
- 1 ≤ N ≤ 2,000
- 1 ≤ K ≤ 10⁹

## Hints
1. An array `present` of `N` cells tells who is still in the circle. To move forward by one person, go to the next index, coming back to 0 after `N − 1`: `(i + 1) % N`. People who left are skipped.
2. `K` can be a billion: counting one person at a time would take far too long. When `R` people remain, a full turn of the circle brings you back to the same place.
3. With `R` people remaining, counting `K` people amounts to counting `(K − 1) % R + 1` people. So move forward by `(K − 1) % R` present people from the current person, who counts as 1.

## Solution
Simulate the departure of the `N` people, one at a time. The array `present` tells who is still in the circle, and `pos` is the index of the person from whom counting starts (they are counted "1").

For each departure, with `R` people remaining:
- compute `s = (K − 1) % R`. Indeed, after counting `R` people, you are back at the starting person: only incomplete turns matter;
- move `pos` forward by `s` **present** people: go to `(pos + 1) % N` and count down only if that person is still there;
- person `pos` leaves: record their number `pos + 1` and set `present[pos]` to false;
- if someone remains, move `pos` forward to the next present person, who will be counted "1" in the next round.

Thanks to the remainder, each departure needs at most one turn of the circle, that is `N` cells examined: in total, at most `N × N` = 4 million steps. Without the remainder, with `K = 10⁹`, each departure would need a billion steps. The main trap is the off-by-one: the starting person already counts as 1, so you must move forward by `K − 1` people, not `K`.
