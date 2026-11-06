---
title: Frosty mornings
---

## Statement
At the Valcorde observatory, Sofia reads the temperature every morning at 7 o'clock. When the thermometer drops below zero, the water in the village fountain freezes and the children come to slide on it. Sofia wants to know how many mornings it froze this month.

Write a program that reads the number of mornings `N`, then the `N` temperatures recorded by Sofia, and prints the number of mornings when the temperature was **strictly** negative, meaning less than 0.

## Input
- The first line contains the integer `N`, the number of mornings.
- Each of the next `N` lines contains an integer: the temperature recorded that morning, in degrees.

## Output
A single integer: the number of mornings when the temperature was strictly negative.

## Constraints
- 1 ≤ N ≤ 1,000
- Each temperature is between −30 and 30.

## Hints
1. It's like a sum, except that instead of adding the temperature, you add 1 to a counter… but only on the mornings when it froze.
2. Inside the loop, after reading the temperature `t`, use an `if`: if `t < 0`, increase the counter by 1.
3. A morning at 0 degrees doesn't count: 0 is not strictly negative.

## Solution
We use a **counter**: a variable equal to `0` before the loop. At each turn, we read a temperature; if it is strictly negative (`t < 0`), we add 1 to the counter. After the loop, we print the counter.

It's the same pattern as for a sum, with an `if` inside the loop. Watch the indentation: the `if` is inside the loop, and the line that adds 1 is inside the `if`.

The classic trap: writing `t <= 0`. Mornings at exactly 0 degrees would then be counted, even though the statement asks for strictly negative temperatures.
