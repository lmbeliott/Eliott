---
title: People who see each other
---

## Statement
`N` people of all different heights stand in a row; person `i` is `Hᵢ` tall. Two people `i < j` **see each other** if all the people standing between them are shorter than each of the two. In particular, two neighbours always see each other.

Count the pairs of people who see each other.

## Input
The first line contains `N`. The second line contains `H₁, …, H_N`, separated by spaces.

## Output
A single integer: the number of pairs who see each other.

## Constraints
- 1 ≤ N ≤ 20,000
- 1 ≤ Hᵢ ≤ 100,000, all different

## Hints
1. Go through the people from left to right. When person `j` arrives, which people on their left can they see? A person `i` who has, between them and `j`, someone taller than them will never again be seen by anyone arriving later.
2. Keep a stack of the people still "visible from the right": their heights decrease from the bottom to the top of the stack.
3. When `j` arrives, they see all the people they push out of the stack (shorter than them), plus the first person taller than them, if there is one.

## Solution
Go through the people from left to right with a stack of heights. **Invariant**: before processing `j`, the stack holds, from bottom to top, the people `i < j` taller than everyone standing between `i` and `j`; so their heights decrease towards the top. A person missing from the stack is hidden by someone taller standing after them, who will also hide them from everyone arriving later.

When `j` arrives:

1. while the top of the stack is shorter than `Hⱼ`, pop it and count one pair: between this person and `j`, there are only people shorter than them, hence shorter than `Hⱼ`;
2. if the stack is not empty, its top is taller than `Hⱼ`, and everyone separating it from `j` is shorter than `Hⱼ`: one more pair. People lower in the stack are hidden by this top, which is taller than `Hⱼ`;
3. push `Hⱼ`, which keeps the invariant: the popped people are now hidden by `j`.

Each pair who see each other is counted exactly once, when the rightmost of the two arrives.

**Cost and mathematical property.** Each person is pushed once and popped at most once: fewer than 2N operations. This also shows that the number of pairs is at most `2N − 3` as soon as `N ≥ 2`. Indeed, you count one pair per pop, and at most one more per person except the first: at most `(N − 1) + (N − 1)`. One more must be saved. If the tallest person is the last one, it empties the stack when it arrives and counts no extra pair. Otherwise, the tallest and the last are two people who are never popped: at most `N − 2` pops. Testing every pair would cost N² / 2 operations, and stopping as soon as a person taller than `i` appears is not enough: on decreasing heights, you never stop.
