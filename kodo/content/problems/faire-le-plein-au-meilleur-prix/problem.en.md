---
title: Filling up at the best price
---

## Statement
A road goes from kilometre 0 to kilometre L. A vehicle burns exactly 1 litre of fuel per kilometre, and its tank holds at most C litres. It starts at kilometre 0 with an empty tank.

There are N stations along the road: station i is at kilometre X_i and sells a litre for P_i. The first station is at kilometre 0. At each station it goes through, the vehicle may buy any whole number of litres, as long as the tank does not overflow.

Write a program that computes the minimal cost to reach kilometre L.

## Input
- The first line contains three integers N, L and C.
- Each of the next N lines contains two integers X_i and P_i, by increasing position.

## Output
A single integer: the minimal total cost, or `-1` if kilometre L cannot be reached.

## Constraints
- 1 ≤ N ≤ 10,000
- 1 ≤ L ≤ 10⁹ and 1 ≤ C ≤ 10⁹
- 0 = X_1 < X_2 < … < X_N < L
- 1 ≤ P_i ≤ 1,000

## Hints
1. Buying just enough to reach the next station is wrong, and so is filling up everywhere: look at the first example. What matters is the price of the litres you actually burn.
2. Imagine you fill up at every station, but only pay for a litre when you burn it. If you reach a cheaper station with even more expensive litres still in the tank, you would have done better not to buy them: throw them away (they cost you nothing), and replace them with the station's.
3. Keep the tank as a queue of lots (price, litres), from cheapest to most expensive. At each station: remove on the right the lots more expensive than the station, top up on the right at the station's price, then drive to the next stop burning the litres on the left, the cheapest ones, and paying for them.

## Solution
**The impossible case.** If two neighbouring stops (a station and the next one, or the last station and the finish) are more than C kilometres apart, no amount of fuel is enough: the answer is `-1`. Otherwise, filling up everywhere gets you there, and what remains is paying as little as possible.

**The idea: deciding afterwards.** We fill up at every station, but "on credit": we only pay for a litre when we burn it. A litre never burned was never really bought. The tank is a queue of lots (price, litres) sorted from cheapest to most expensive. At each station:
- we remove from the end of the queue all the lots more expensive than the station: it was better not to buy them and to take these litres here;
- we top the tank up to C litres with a lot at the station's price, added at the end of the queue (the queue stays sorted);
- we drive to the next stop: we burn the cheapest litres first, at the front of the queue, and pay for them.

This matches a real buying plan: each burned litre was bought at the station of its lot, and it really was in the tank, because the real tank only holds the litres that will be burned later, which are in the queue. And this plan is the best one: each kilometre is driven with the cheapest litre that could still be in the tank at that moment, never going over C litres. It is the same pattern as the stack in the lesson: we go back on choices that became bad as soon as a better option shows up.

In the first example (L = 10, C = 6): at kilometre 0, we take 6 litres at 5. At kilometre 3, 3 litres at 5 are left, more expensive than the station at 2: we throw them away and fill 6 litres at 2. At kilometre 5, 4 litres at 2 are left; we top up with 2 litres at 4. At kilometre 8, 1 litre at 2 and 2 litres at 4 are left: we throw away the ones at 4 and top up with 5 litres at 3. In total, we burned 3 litres at 5, 6 at 2 and 1 at 3: 15 + 12 + 3 = 30.

**Complexity.** Each station adds one lot, removed at most once. Each trip starts at most one lot without finishing it. Everything is O(N).

**Why the simple solutions fail.** Buying at each station just enough to reach the next one costs 37 in the first example. Filling up everywhere buys useless expensive litres. The greedy "if a cheaper station is within reach, buy just enough to reach it; otherwise fill up and go to the cheapest one within reach" is correct, but finding these stations by going through all those within reach costs O(N²) when prices go up along the road: about 5 × 10⁷ comparisons, too slow in Python.

**Traps.**
- Costs go beyond 2³¹ (up to 10⁹ litres at 1,000): use `long long` in C++.
- Do not forget the last trip, from the last station to kilometre L.
- Only remove the lots that are **strictly** more expensive; keeping those at the same price does not change the cost.
