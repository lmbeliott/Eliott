---
title: Smallest gap on a circle
---

## Statement
A circular track is C metres long. A position on the track is given by the distance travelled from the starting line, in the running direction: an integer from 0 to C − 1. N runners are stopped on the track. The **distance** between two runners is the length of the shorter of the two arcs joining them. For example, on a 100-metre track, positions 5 and 95 are at distance 10.

Find the smallest distance between two runners, and the number of pairs of runners at this distance.

## Input
The first line contains N and C. The second line contains the N positions.

## Output
Two integers on one line: the smallest distance, then the number of pairs of runners at this distance.

## Constraints
- 2 ≤ N ≤ 15,000
- 1 ≤ C ≤ 10⁹
- 0 ≤ position < C. Several runners can be at the same position.

## Hints
1. After sorting the positions, the two closest runners are necessarily neighbours in the order around the track. Do not forget the last and the first, who are neighbours across the starting line.
2. If two runners are at the same position, the smallest distance is 0, and every pair of runners at a same position counts.
3. With only two runners, both arcs join the same pair: it must be counted only once.

## Solution
Sort the positions p₀ ≤ p₁ ≤ … ≤ p_{N−1}. The **gaps** between neighbours are g_i = p_{i+1} − p_i for i < N − 1, and the wrap-around gap g_{N−1} = C − (p_{N−1} − p₀), which crosses the starting line. These N gaps add up to C.

**Case with equal positions.** If a gap is 0, the smallest distance is 0. The pairs at distance 0 are the pairs of runners at the same position: a group of k runners at the same place gives k(k − 1)/2 of them. These groups are consecutive blocks of the sorted list.

**Case N ≥ 3 without equal positions.** Two runners that are not neighbours are separated, in each direction, by at least two non-zero gaps, so their distance is at least twice the smallest gap. The minimum is therefore reached by neighbours. The smallest gap d is at most C/3 (at least three gaps, adding up to C), so d ≤ C − d, and the distance between these neighbours is indeed d. The answer is d, and the number of gaps equal to d: each corresponds to a different pair, and no non-neighbouring pair is at distance d.

**Case N = 2.** A single pair, at distance min(g₀, C − g₀). Answer this distance and 1.

**Cost.** Sorting costs O(N log N), the rest O(N). Testing every pair would cost O(N²), about 10⁸ comparisons: too many for Python.
