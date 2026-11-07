---
title: Sorting by reversing prefixes
---

## Statement
A stack of `N` pancakes of pairwise different sizes is described from top to bottom by a permutation of the integers from `1` to `N`. The only allowed operation is to slide a spatula under the top `k` pancakes (with `2 ≤ k ≤ N`) and flip them as a block: the first `k` numbers of the list are put in reverse order. For example, flipping the top 3 pancakes of `3 1 2 4` gives `2 1 3 4`.

For each of the `Q` given stacks, compute the minimum number of flips to obtain `1 2 … N`, the smallest pancake on top.

## Input
- The first line contains two integers `N` and `Q`.
- Each of the next `Q` lines contains a permutation of the integers from `1` to `N`.

## Output
`Q` lines: for each stack, in order, the minimum number of flips.

## Constraints
- 1 ≤ N ≤ 8
- 1 ≤ Q ≤ 1,000

## Hints
1. A state is a permutation; a flip joins two states. There are at most 8! = 40,320 states, each with `N − 1` neighbours.
2. Running a breadth-first search for each stack costs `Q` times a search of the whole state space. Can a single one be enough?
3. Flipping the same `k` pancakes twice gives back the initial stack: the distance from a stack `P` to the sorted stack is also the distance from the sorted stack to `P`.

## Solution
Stacks are the vertices of an implicit graph: two stacks are joined if a flip goes from one to the other. A stack is encoded as a string (`"3124"`) or a tuple, used as a key in a dictionary of distances.

A flip is its own inverse, so the graph is undirected: the minimum number of flips to sort `P` is the distance between `P` and the sorted stack, either way. A **single** breadth-first search, started from the sorted stack, therefore computes the answer for every permutation at once; each question is then answered by a simple dictionary lookup.

**Complexity.** The search visits the `N!` states and produces `N − 1` neighbours per state, each in O(N): about 40,320 × 7 × 8 operations for `N = 8`. One search per question would cost `Q` times more.

**Pancake numbers.** Bringing the largest pancake to the top and then flipping it to the bottom places it for good in 2 flips: so sorting always takes at most `2N − 3` flips. The true maximum is smaller; for `N = 8`, the search shows it is 9. Finding this maximum for every `N` is an open problem.
