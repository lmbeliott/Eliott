---
title: The groups of refuges
---

## Statement
After a stormy night, Awa, head of the Valcorde rescue team, takes stock: many trails are cut off. Two refuges are in the **same group** if you can go from one to the other using only trails that are still passable, possibly through other refuges.

Write a program that computes the number of groups of refuges and the number of refuges in the largest group.

## Input
- The first line contains two integers `N` and `M`: the number of refuges (numbered from `1` to `N`) and the number of passable trails.
- Each of the next `M` lines contains two integers `A` and `B`: a trail links refuges `A` and `B`, in both directions.

A trail may link a refuge to itself, and two refuges may be linked by several trails.

## Output
Two lines: the number of groups, then the number of refuges in the largest group.

## Constraints
- 1 ≤ N ≤ 10 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N

## Hints
1. Store the network as **adjacency lists**: for each refuge, the list of its neighbouring refuges.
2. Starting from a refuge not yet visited, a traversal (depth-first or breadth-first) visits exactly its whole group. How many times do you start a new traversal?
3. Go through the refuges from `1` to `N`; each time you find one that hasn't been visited, it starts a new group: explore it while counting the refuges you visit. Watch the recursion depth if you write a recursive DFS.

## Solution
We build the adjacency lists, then go through the refuges from `1` to `N`. Each refuge not yet visited is the starting point of a **new group**: a depth-first traversal (with a stack) or a breadth-first traversal (with a queue) marks every refuge of this group, and we count how many it marked. The number of traversals started is the number of groups; we keep the largest size.

Each refuge is marked only once and each trail is looked at twice (once from each end): the total complexity is **O(N + M)**.

A naive idea is to give each refuge a label, then repeat "for each trail, copy the smaller of the two labels onto the other end" until nothing changes. On a long chain of refuges, this takes up to `N` passes over the `M` trails, that is 10⁸ operations: far too slow in Python.

Traps:
- A **recursive** DFS on a chain of 10 000 refuges exceeds Python's recursion limit (1 000 by default). Use an explicit stack, or `sys.setrecursionlimit`.
- Mark a refuge as visited **when you add it** to the stack or the queue, otherwise it may be added several times.
- A refuge with no trail at all forms a group on its own.
