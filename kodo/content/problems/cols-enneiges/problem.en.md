---
title: The snowy passes
---

## Statement
In spring, the snow slowly melts in the Valcorde valley and the **snow line** rises week after week. Each trail between two refuges crosses a mountain pass: it can only be used if the altitude of that pass is lower than or equal to the snow line.

Malik, at the guides' office, receives questions from hikers: "If the snow line is at altitude `S`, can we go from refuge `X` to refuge `Y`, possibly through other refuges?" Write a program that answers all the questions.

## Input
- The first line contains three integers `N`, `M` and `Q`: the number of refuges (numbered from `1` to `N`), of trails and of questions.
- Each of the next `M` lines contains three integers `A`, `B` and `H`: a trail links refuges `A` and `B`, in both directions, crossing a pass at altitude `H`.
- Each of the next `Q` lines contains three integers `X`, `Y` and `S`: a question.

## Output
`Q` lines: for each question, in input order, `OUI` (French for "yes") if you can go from `X` to `Y` using only trails whose pass is at an altitude lower than or equal to `S`, and `NON` ("no") otherwise.

## Constraints
- 1 ≤ N ≤ 5 000
- 0 ≤ M ≤ 5 000
- 1 ≤ Q ≤ 5 000
- 1 ≤ A, B, X, Y ≤ N
- 500 ≤ H, S ≤ 4 800

## Hints
1. For a single question, one graph traversal is enough. But one traversal per question means up to 5 000 traversals of the whole graph.
2. If you handle the questions by increasing snow line `S`, the usable trails are only ever **added**, never removed. Which data structure can merge groups and tell whether two elements are in the same group?
3. Sort the trails by pass altitude and the questions by `S`. For each question, add to a union-find every trail with a pass `≤ S` not added yet, then compare the representatives of `X` and `Y`. Store the answer at the question's original position.

## Solution
For a given snow line `S`, the question is whether `X` and `Y` are in the same connected component of the graph of usable trails. One breadth-first search per question costs O(Q × (N + M)), that is 5 × 10⁷ operations: too slow in Python.

The key observation: when `S` increases, the set of usable trails **grows**. So we answer the questions **offline**, in order of increasing `S`, and not in input order:

1. sort the trails by pass altitude `H`;
2. sort the question numbers by `S`;
3. for each question, merge in a **union-find** the two ends of each trail with a pass `H ≤ S` not added yet (a pointer moves forward through the sorted list of trails);
4. answer `OUI` if `X` and `Y` have the same representative, and store the answer at the question's original index.

The union-find keeps a parent for each refuge; the root of the tree is the representative of the group. With **path compression** and **union by size**, each operation takes almost constant time. The total complexity is **O(M log M + Q log Q)**, dominated by the sorts.

Traps:
- The comparison is not strict: a trail whose pass is exactly at altitude `S` is usable. You must add **all** the trails with a pass `≤ S` before answering.
- The answers must be printed in input order: keep the index of each question.
- If `X = Y`, the answer is always `OUI`.
- Without union by size, the union-find trees can become very deep, and a recursive `find` may exceed Python's recursion limit. With union by size, the depth stays below log₂ N; writing `find` with a loop avoids the problem anyway.
