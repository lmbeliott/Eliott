---
title: The two shepherds
---

## Statement
This summer, two shepherds, Inès and Malik, share the `N` alpine pastures of Valcorde: each pasture will be looked after by one of them. Some pairs of pastures are **neighbours**: if the same shepherd looked after both, the flocks would get mixed up. So two neighbouring pastures must be looked after by different shepherds.

Inès, who also runs the cheese dairy, wants to look after as few pastures as possible. Write a program that computes the minimum number of pastures given to Inès in a split that respects all the neighbouring pairs, or prints `-1` if no split works.

## Input
- The first line contains two integers `N` and `M`: the number of pastures (numbered from `1` to `N`) and the number of neighbouring pairs.
- Each of the next `M` lines contains two distinct integers `A` and `B`: pastures `A` and `B` are neighbours.

The same pair may appear several times.

## Output
A single integer: the minimum number of pastures given to Inès, or `-1` if it is impossible to respect all the neighbouring pairs.

## Constraints
- 1 ≤ N ≤ 10 000
- 0 ≤ M ≤ 10 000
- 1 ≤ A, B ≤ N and A ≠ B

## Hints
1. If you choose the shepherd of one pasture, the shepherd of all its neighbours is forced, then that of the neighbours' neighbours… How far does this chain reaction go?
2. In a group of pastures linked together (a connected component), choosing the shepherd of a single pasture decides the whole group. So there are only two possible splits per group, one being the reverse of the other.
3. Colour each component with a breadth-first search, alternating the two colours. If two neighbours get the same colour, it is impossible. Otherwise, in each component, Inès takes the smaller of the two colours.

## Solution
The pastures and the neighbouring pairs form a graph. In a connected component, as soon as the shepherd of one pasture is fixed, the shepherd of each neighbour is forced (the other shepherd), and step by step that of the whole component. So a component has only **two** possible splits, one the reverse of the other.

We colour each component with a breadth-first search: the start gets colour `0`, and each neighbour gets the opposite colour of the pasture we come from. If we find two neighbours with the same colour, the component contains a cycle of odd length and no split works: we print `-1`. Otherwise, we count `c₀` and `c₁`, the sizes of the two colours in the component, and Inès takes the smaller one: we add `min(c₀, c₁)` to the total. The components are independent, so these choices are made separately. An isolated pasture counts as `min(1, 0) = 0`: it goes to Malik.

Complexity: **O(N + M)**, since each pasture and each pair is handled once.

Trying all 2ᴺ splits is out of the question as soon as `N = 40`. And the greedy strategy "give the pasture to Malik whenever possible", going through the pastures by number, is wrong: it may fix two pastures of the same component before discovering that they are linked, or choose the wrong one of the two splits for a component.

Traps:
- A single odd cycle, in any component, makes the answer `-1`: you must have coloured every component before printing the total.
- The minimum is taken component by component, not over the whole graph: taking the smaller colour over the whole graph gives a wrong answer as soon as there are several unbalanced components (this is the case in the first example).
