---
title: Best price-quality trade-offs
---

## Statement
A comparison site knows `N` products. Each has a name, a quality score `Q` and a price `P`. A product A is **outclassed** by a product B if B is at least as good (`Q_B ≥ Q_A`) and at least as cheap (`P_B ≤ P_A`), and differs from A on at least one of the two criteria. So two products with the same score and the same price do not outclass each other.

Print the products that are outclassed by no other product.

## Input
The first line contains `N`. Each of the next `N` lines describes a product: its name, then `Q`, then `P`, separated by spaces. Names are made of lowercase letters and are all different.

## Output
On the first line, the number `K` of products that are not outclassed. Then their names, one per line, by increasing price; for equal prices, in alphabetical order.

## Constraints
- 1 ≤ N ≤ 8,000
- 0 ≤ Q ≤ 1,000
- 1 ≤ P ≤ 10⁶
- each name has 1 to 10 letters

## Hints
1. Comparing each product with all the others costs N² operations, 64 million: too much for Python.
2. Sort the products by increasing price. A product can only be outclassed by a product placed before it… provided the order of products with the same price is chosen well.
3. Sort by increasing price, then by **decreasing** score. While going through the list, keep the best score seen so far. Watch out for identical products (same score, same price): they must be handled together.

## Solution
Sort the products by the key `(P, −Q, name)`: increasing price, then decreasing score, then name. Go through them in this order, keeping `meilleure` ("best"), the highest score among the products already processed, and process at once each **group** of identical products (same `P`, same `Q`): they are consecutive in the sorted order.

**Invariant.** Before processing a group with score `Q` and price `P`, the products already processed are exactly those cheaper than `P`, or with the same price and a better score than `Q`. Each of them differs from the group on at least one criterion and costs at most `P`. So the group is outclassed if and only if one of them has a score at least `Q`, that is, if `meilleure ≥ Q`. Products processed later are more expensive, or have the same price and a lower score: none of them can outclass the group. So keep the whole group when `Q > meilleure`, then update `meilleure`.

**Output order.** The kept products come out by increasing price. Two kept products with the same price necessarily have the same score (otherwise the better one would outclass the other): the key then orders them by name, as required.

**Cost.** The sort, then a single pass. The traps: sorting products with the same price by increasing score (a product would be kept before the one that outclasses it is seen), using `≥` instead of `>`, or considering that an identical product outclasses another one.
