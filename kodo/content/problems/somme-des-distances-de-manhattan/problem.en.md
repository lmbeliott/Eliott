---
title: Sum of Manhattan distances
---

## Statement
In a city with grid streets, one only moves parallel to the axes. The distance between points (x₁, y₁) and (x₂, y₂) is then |x₁ − x₂| + |y₁ − y₂|: this is the **Manhattan distance**.

N points are given. Compute the sum of the Manhattan distances between all pairs of points.

## Input
The first line contains N. Each of the next N lines contains the coordinates x and y of a point.

## Output
The sum of the distances over all pairs of points {i, j}, with i < j.

## Constraints
- 1 ≤ N ≤ 15,000
- 0 ≤ x, y ≤ 10,000
- Several points may coincide.

## Hints
1. There are about 1.1 × 10⁸ pairs for N = 15,000: too many for Python, which performs on the order of 10⁷ simple operations per second.
2. The sum splits in two: the sum of the |xᵢ − xⱼ| plus the sum of the |yᵢ − yⱼ|. It is enough to solve the problem on a line.
3. On a line, sort the values: if v₀ ≤ v₁ ≤ … ≤ v_{N−1}, the value v_k is larger than the k values placed before it, and its contribution to the gaps with them is k × v_k − (v₀ + … + v_{k−1}).

## Solution
**Separating the coordinates.** The sum of the distances is Σ (|xᵢ − xⱼ| + |yᵢ − yⱼ|) = Σ |xᵢ − xⱼ| + Σ |yᵢ − yⱼ|, the sums being over the pairs i < j. Compute the same quantity for the list of x and for the list of y.

**On a line.** The sum of the |vᵢ − vⱼ| does not change if the values are permuted: sort them. For a pair k > l, we then have |v_k − v_l| = v_k − v_l. Grouping the pairs by their larger index k, the sum is Σ_k (k × v_k − P_k), where P_k = v₀ + … + v_{k−1} is a prefix sum. Go through the sorted values while keeping P_k up to date: each term takes constant time.

**Cost.** Two sorts in O(N log N), then two passes in O(N). The direct method computes N(N − 1)/2 distances, that is O(N²): about 1.1 × 10⁸ for N = 15,000, several tens of seconds in Python.

**Size of the result.** There are at most 1.1 × 10⁸ pairs, each at distance at most 20,000: the total can exceed 2³¹, a `long long` is needed in C++.
