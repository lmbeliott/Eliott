---
title: Two-colouring a graph
---

## Statement
You are given an undirected graph with `N` vertices and `M` edges. We want to colour each vertex **white** or **black**, so that the two ends of every edge have different colours.

Write a program that computes the minimum number of black vertices in such a colouring, or prints `-1` if no colouring works.

## Input
- The first line contains two integers `N` and `M`: the number of vertices (numbered from `1` to `N`) and the number of edges.
- Each of the next `M` lines contains two distinct integers `A` and `B`: an edge links vertices `A` and `B`.

The same edge may appear several times.

## Output
A single integer: the minimum number of black vertices, or `-1` if it is impossible to respect all the edges.

## Constraints
- 1 ≤ N ≤ 10 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N and A ≠ B

## Hints
1. If you choose the colour of one vertex, the colour of all its neighbours is forced, then that of the neighbours' neighbours… How far does this chain reaction go?
2. In a connected component, choosing the colour of a single vertex decides the whole component. So there are only two possible colourings per component, one being the reverse of the other.
3. Label each component with a breadth-first search, alternating two labels. If two neighbours get the same label, it is impossible. Otherwise, in each component, paint the smaller of the two classes black.

## Solution
In a connected component, as soon as the colour of one vertex is fixed, the colour of each neighbour is forced (the other colour), and step by step that of the whole component. So a component has only **two** possible colourings, one the reverse of the other.

We label each component with a breadth-first search: the start gets label `0`, and each neighbour gets the opposite label of the vertex we come from. If we find two neighbours with the same label, the component contains a cycle of odd length and no colouring works: we print `-1`. Otherwise, we count `c₀` and `c₁`, the sizes of the two classes in the component, and paint the smaller one black: we add `min(c₀, c₁)` to the total. The components are independent, so these choices are made separately. An isolated vertex counts as `min(1, 0) = 0`: it stays white.

Complexity: **O(N + M)**, since each vertex and each edge is handled once.

Trying all 2ᴺ colourings is out of the question as soon as `N = 40`. And the greedy strategy "colour the vertex white whenever possible", going through the vertices by number, is wrong: it may fix two vertices of the same component before discovering that they are linked, or choose the wrong one of the two colourings for a component.

Traps:
- A single odd cycle, in any component, makes the answer `-1`: you must have labelled every component before printing the total.
- The minimum is taken component by component, not over the whole graph: taking the smaller class over the whole graph gives a wrong answer as soon as there are several unbalanced components (this is the case in the first example).
