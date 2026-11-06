A **greedy** algorithm builds its answer step by step, making at each step the choice that looks best, without ever going back. It is simple and fast (often a sort, then a single pass). The danger: a choice that looks good right now may be bad for what comes next. So you must be able to **justify** the choice.

## A greedy algorithm that gets it wrong

You have coins worth 1, 3 and 4. To pay 6 with as few coins as possible, the greedy rule always takes the biggest coin that fits: 4, then 1, then 1, so 3 coins. Yet 3 + 3 uses only 2. A natural greedy idea can therefore be wrong: you need a proof, or at least a serious check.

## Staying ahead: stops along a road

A car follows a road lined with petrol stations, at kilometres `r[0] < r[1] < …`, and can drive at most D km on a full tank. It starts from the first station with a full tank and wants to reach the last one while stopping to refuel as few times as possible. Greedy choice: each time, go to the **farthest** station it can reach.

Why is it optimal? Let's compare with any other plan. After the first leg, the greedy plan is at least as far as the other plan, since it took the farthest station. And if it is at least as far after k stops, it is still at least as far after k + 1 stops: any station the other plan reaches on its next leg is also within reach of the greedy plan. The greedy plan **stays ahead** at every step: so it never needs more stops than any other plan.

```python
r = [0, 4, 9, 11, 17, 20, 26]
D = 10
stops = 0
pos = 0                     # index of the station where we are
while pos < len(r) - 1:
    nxt = pos
    while nxt + 1 < len(r) and r[nxt + 1] - r[pos] <= D:
        nxt += 1            # move on while it is within reach
    if nxt == pos:
        print("impossible")
        break
    pos = nxt
    if pos < len(r) - 1:
        stops += 1          # we refuel at this station
print(stops)                # 2: we stop at kilometres 9 and 17
```

```cpp
vector<int> r = {0, 4, 9, 11, 17, 20, 26};
int D = 10;
int stops = 0, pos = 0;     // pos: index of the station where we are
while (pos < (int)r.size() - 1) {
    int nxt = pos;
    while (nxt + 1 < (int)r.size() && r[nxt + 1] - r[pos] <= D) {
        nxt++;              // move on while it is within reach
    }
    if (nxt == pos) { cout << "impossible\n"; break; }
    pos = nxt;
    if (pos < (int)r.size() - 1) stops++;    // we refuel at this station
}
cout << stops << "\n";      // 2: we stop at kilometres 9 and 17
```

## The exchange argument

Another way to prove a greedy algorithm: start from **any** optimal solution and change it little by little until it looks like the greedy one, without ever making it worse.

Example: a printer must print N documents, one after the other. Document i needs t_i minutes, and the person who sent it waits until it is printed. To minimize the sum of the waiting times, the greedy rule prints the **shortest** documents first.

Proof: take an order where two neighbouring documents a then b have t_a > t_b. If we swap them, the waiting times of the other documents do not change. Before the swap, b waited t_a extra minutes because of a; afterwards, it is a who waits t_b extra minutes because of b. Since t_b < t_a, the sum decreases. So an optimal order has no pair of badly arranged neighbours: it is sorted.

```python
t = [7, 2, 5]
t.sort()               # shortest first
end = 0
total = 0
for duration in t:
    end += duration    # this document is ready at minute end
    total += end
print(total)           # 2 + 7 + 14 = 23
```

```cpp
vector<int> t = {7, 2, 5};
sort(t.begin(), t.end());   // shortest first
long long end = 0, total = 0;
for (int duration : t) {
    end += duration;        // this document is ready at minute end
    total += end;
}
cout << total << "\n";      // 2 + 7 + 14 = 23
```

The same ideas help you choose time slots or form pairs: you show that an optimal solution can always start with the greedy choice.

## Checking your greedy algorithm

Before trusting a greedy algorithm, also write a **brute force** solution that tries every possibility (slow, but safe), and compare the two on hundreds of small random tests. A single disagreement proves that the greedy algorithm is wrong, and the small failing test helps you understand why.

## Key takeaways

- A greedy algorithm makes the best local choice at each step, without going back: it is fast, often O(N log N) because of the sort.
- A natural greedy idea can be wrong: look for a counterexample before believing it.
- To prove a greedy algorithm: show that it "stays ahead" of any other solution, or that you can swap elements of an optimal solution to get back the greedy choice without losing anything.
- Always compare your greedy algorithm with a brute force on small random tests.
