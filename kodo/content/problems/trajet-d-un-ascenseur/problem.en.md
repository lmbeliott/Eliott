---
title: Path of a lift
---

## Statement
A lift starts at floor `0` and goes successively to `N` floors, in the given order. Negative floors are basements. Print:
- the total number of floors travelled;
- the highest floor reached (counting the starting floor);
- the number of times the lift changes direction, that is, starts going down after going up, or going up after going down.

A request for the floor where the lift already is does not make it move.

## Input
- The first line contains the integer `N`.
- Each of the next `N` lines contains an integer: a requested floor.

## Output
Three lines: the number of floors travelled, the highest floor reached, then the number of changes of direction.

## Constraints
- 1 ≤ N ≤ 1 000
- −100 ≤ each floor ≤ 100

## Hints
1. To go from floor `e` to floor `c`, the lift travels `c − e` floors if it goes up, `e − c` if it goes down.
2. For the changes of direction, you need to remember the direction of the **last** move (up, down, or no move yet). It can be encoded as an integer: `1` for up, `-1` for down, `0` at the start.
3. A move counts as a change of direction only if there was a move before, in the other direction. A request for the current floor does not change the last direction.

## Solution
Simulate the trip with four variables: the current floor `floor` (starting at 0), the total distance, the highest floor (starting at 0, the starting floor), and `last`, the direction of the last move (`0` as long as the lift has not moved).

For each requested floor `c`:
- if `c > floor`, the lift goes up: add `c − floor` to the distance, and the direction is `1`;
- if `c < floor`, it goes down: add `floor − c`, and the direction is `-1`;
- otherwise, it does not move, and the direction is `0`.

If the lift moved (direction different from 0), look at `last`: if it is not zero and differs from the current direction, this is a change of direction. Then `last` takes the value of the current direction. Finally, `floor` becomes `c`, and the highest floor is updated.

The traps: a request for the current floor must neither count as a move nor erase the last direction (going up, staying, then going down is indeed a change of direction); the first move is not a change of direction; and the highest floor is at least 0, even if the lift only goes down.
