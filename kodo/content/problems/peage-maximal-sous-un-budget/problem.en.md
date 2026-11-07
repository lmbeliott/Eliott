---
title: Maximum toll under a budget
---

## Statement
A network has `N` cities and `M` two-way roads. Each road has a length and a toll. We want to go from city `1` to city `N` travelling a total length of at most `B`, and we want the **largest toll** paid on a road of the trip to be as small as possible.

Print this smallest maximum toll, or `-1` if no trip respects the length limit. If `N = 1`, the trip is empty and the answer is `0`.

## Input
- The first line contains `N`, `M` and `B`.
- Each of the next `M` lines contains four integers `A`, `C`, `L` and `T`: a road joins `A` and `C`, of length `L` and toll `T`.

## Output
A single integer: the smallest possible maximum toll, or `-1`.

## Constraints
- 1 ≤ N ≤ 10,000
- 0 ≤ M ≤ 6,000
- 1 ≤ A, C ≤ N
- 1 ≤ L, T ≤ 10⁶
- 1 ≤ B ≤ 10¹²

## Hints
1. A simpler question: using only roads with toll at most `S`, can we go from `1` to `N` with a length at most `B`? This is a shortest path.
2. If it is possible for `S`, it is possible for any larger threshold: the smallest `S` can be found by binary search.
3. The answer is necessarily one of the tolls: search among the sorted tolls, about fifteen runs of Dijkstra.

## Solution
**Test for a threshold.** For a threshold `S`, keep only roads with toll at most `S` and compute with **Dijkstra** the shortest length from `1` to `N`. The threshold works if it is at most `B`: a trip using only these roads has a maximum toll at most `S`, and conversely any trip with maximum toll at most `S` uses only these roads.

**Binary search on the answer.** Increasing `S` only adds roads, so it cannot make the shortest path longer: the property "`S` works" is monotone. The answer is the smallest threshold that works; it is the toll of a road of the trip, so one of the `T`. Sort the distinct tolls and binary-search for the first one that works. If even the largest does not work, the answer is `-1`.

**Complexity.** O(log M) runs of Dijkstra, each in O((N + M) log N). Trying all tolls one by one would cost `M` runs of Dijkstra, 6,000 instead of 13.

**Pitfalls.** Minimising the length first does not work: the shortest trip may use a road with a huge toll while a slightly longer trip, still within the budget, avoids all big tolls (first sample: the shortest trip has toll 5, the trip `1 – 3 – 4`, of length 11, toll 2). Minimising only the maximum toll does not work either: the trip obtained may exceed the budget (the direct road `1 – 4`, with toll 1, has length 20). Lengths add up to 10¹⁰: `long long` in C++. For `N = 1`, the answer is `0`.
