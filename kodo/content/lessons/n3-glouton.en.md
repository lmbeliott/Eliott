A **greedy** algorithm builds its answer step by step, making at each step the choice that looks best, without ever going back. It is simple and fast (often a sort, then a single pass). The danger: a choice that looks good right now may be bad for what comes next. So you must be able to **justify** the choice.

## A greedy algorithm that gets it wrong

At the cable car, you pay with tokens worth 1, 3 and 4. To pay 6 with as few tokens as possible, the greedy rule always takes the biggest token that fits: 4, then 1, then 1, so 3 tokens. Yet 3 + 3 uses only 2. A natural greedy idea can therefore be wrong: you need a proof, or at least a serious check.

## Staying ahead: hiking stages

Inès follows a trail lined with mountain huts, at kilometres `r[0] < r[1] < …`, and walks at most D km per day. She starts from the first hut and wants to reach the last one while sleeping as few nights as possible. Greedy choice: each day, go to the **farthest** hut she can reach.

Why is it optimal? Let's compare with any other plan. After the first day, the greedy plan is at least as far as the other plan, since it took the farthest hut. And if it is at least as far after k days, it is still at least as far after k + 1 days: any hut the other plan reaches on the next day is also within reach of the greedy plan. The greedy plan **stays ahead** every day: so it reaches the goal no later than any other plan.

```python
r = [0, 4, 9, 11, 17, 20, 26]
D = 10
nights = 0
pos = 0                     # index of the hut where Inès sleeps
while pos < len(r) - 1:
    nxt = pos
    while nxt + 1 < len(r) and r[nxt + 1] - r[pos] <= D:
        nxt += 1            # move on while it is within reach
    if nxt == pos:
        print("impossible")
        break
    pos = nxt
    if pos < len(r) - 1:
        nights += 1         # we sleep at this hut
print(nights)               # 2: we sleep at kilometres 9 and 17
```

```cpp
vector<int> r = {0, 4, 9, 11, 17, 20, 26};
int D = 10;
int nights = 0, pos = 0;    // pos: index of the hut where Inès sleeps
while (pos < (int)r.size() - 1) {
    int nxt = pos;
    while (nxt + 1 < (int)r.size() && r[nxt + 1] - r[pos] <= D) {
        nxt++;              // move on while it is within reach
    }
    if (nxt == pos) { cout << "impossible\n"; break; }
    pos = nxt;
    if (pos < (int)r.size() - 1) nights++;   // we sleep at this hut
}
cout << nights << "\n";     // 2: we sleep at kilometres 9 and 17
```

## The exchange argument

Another way to prove a greedy algorithm: start from **any** optimal solution and change it little by little until it looks like the greedy one, without ever making it worse.

Example: the ski instructor must adjust the bindings of N skiers, one after the other. Skier i needs t_i minutes and waits until the end of their adjustment. To minimize the sum of the waiting times, the greedy rule handles the **shortest** adjustments first.

Proof: take an order where two neighbouring skiers a then b have t_a > t_b. If we swap them, the other skiers see no difference. Before the swap, b waited t_a extra minutes because of a; afterwards, it is a who waits t_b extra minutes because of b. Since t_b < t_a, the sum decreases. So an optimal order has no pair of badly arranged neighbours: it is sorted.

```python
t = [7, 2, 5]
t.sort()               # shortest first
end = 0
total = 0
for duration in t:
    end += duration    # this skier leaves at minute end
    total += end
print(total)           # 2 + 7 + 14 = 23
```

```cpp
vector<int> t = {7, 2, 5};
sort(t.begin(), t.end());   // shortest first
long long end = 0, total = 0;
for (int duration : t) {
    end += duration;        // this skier leaves at minute end
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
