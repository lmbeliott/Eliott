A **greedy** algorithm builds its answer step by step, making at each step the choice that looks best, without ever going back. It is simple and fast (often a sort, then a single pass). The danger: a choice that looks good right now may be bad for what comes next. So the choice must be **justified**.

## A greedy algorithm that gets it wrong

Take coins worth 1, 3 and 4. To pay 6 with as few coins as possible, the greedy rule always takes the biggest coin that fits: 4, then 1, then 1, so 3 coins. Yet 3 + 3 uses only 2. A natural greedy idea can therefore be wrong: it needs a proof, or at least a serious check.

## Staying ahead: stops along a road

A car follows a road lined with petrol stations, at kilometres `r[0] < r[1] < …`, and can drive at most D km on a full tank. It starts from the first station with a full tank and wants to reach the last one while stopping to refuel as few times as possible. Greedy choice: each time, go to the **farthest** station it can reach.

Why is it optimal? Compare with any other plan. After the first leg, the greedy plan is at least as far as the other plan, since it took the farthest station. And if it is at least as far after k stops, it is still at least as far after k + 1 stops: any station the other plan reaches on its next leg is also within reach of the greedy plan. The greedy plan **stays ahead** at every step: so it never needs more stops than any other plan.

```python
r = [0, 4, 9, 11, 17, 20, 26]
D = 10
stops = 0
pos = 0                     # index of the station where we are
possible = True
while pos < len(r) - 1:
    nxt = pos
    while nxt + 1 < len(r) and r[nxt + 1] - r[pos] <= D:
        nxt += 1            # move on while it is within reach
    if nxt == pos:
        possible = False    # the next station is too far
        break
    pos = nxt
    if pos < len(r) - 1:
        stops += 1          # we refuel at this station
if possible:
    print(stops)            # 2: we stop at kilometres 9 and 17
else:
    print("impossible")
```

```cpp
vector<int> r = {0, 4, 9, 11, 17, 20, 26};
int D = 10;
int stops = 0, pos = 0;     // pos: index of the station where we are
bool possible = true;
while (pos < (int)r.size() - 1) {
    int nxt = pos;
    while (nxt + 1 < (int)r.size() && r[nxt + 1] - r[pos] <= D) {
        nxt++;              // move on while it is within reach
    }
    if (nxt == pos) { possible = false; break; }  // the next station is too far
    pos = nxt;
    if (pos < (int)r.size() - 1) stops++;    // we refuel at this station
}
if (possible) cout << stops << "\n";        // 2: we stop at kilometres 9 and 17
else cout << "impossible\n";
```

## The exchange argument

Another way to prove a greedy algorithm: start from **any** optimal solution and change it little by little until it looks like the greedy one, without ever making it worse.

Example: a printer must print N documents, one after the other. Document i needs t_i minutes, and the person who sent it waits until it is printed. To minimize the sum of the waiting times, the greedy rule prints the **shortest** documents first.

Proof: take an order where two neighbouring documents a then b have t_a > t_b. If they are swapped, the waiting times of the other documents do not change. Before the swap, b waited t_a extra minutes because of a; afterwards, it is a who waits t_b extra minutes because of b. Since t_b < t_a, the sum decreases. So an optimal order has no pair of badly arranged neighbours: it is sorted.

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

The same ideas help choose time slots or form pairs: the proof shows that an optimal solution can always start with the greedy choice.

## A stack to fix earlier choices

Some greedy algorithms read the items one by one and keep the ones they care about in a **stack**: a list where items are only added and removed at the end, the **top**. In Python, it is a list with `append`, `pop()` and `stack[-1]`; in C++, a `vector` with `push_back`, `pop_back` and `back()`.

The classic pattern: before pushing a new item, pop from the top every item that is **worse** than it. Example: buildings in a row, with heights given from left to right. Looking from the right, a building is only visible if it is strictly taller than every building to its right. When a new building arrives, the ones in the stack that are not taller than it are hidden for good: they are popped.

```python
h = [5, 3, 8, 2, 4, 1]
stack = []
for x in h:
    while stack and stack[-1] <= x:
        stack.pop()         # hidden by x: it will never matter again
    stack.append(x)
print(stack)                # [8, 4, 1]: the visible buildings
```

```cpp
vector<int> h = {5, 3, 8, 2, 4, 1};
vector<int> stack;
for (int x : h) {
    while (!stack.empty() && stack.back() <= x) {
        stack.pop_back();   // hidden by x: it will never matter again
    }
    stack.push_back(x);
}
for (int x : stack) cout << x << " ";   // 8 4 1: the visible buildings
cout << "\n";
```

There is again a `while` loop inside a `for` loop, but it is O(N): each item is pushed once and popped at most once.

This pattern is often used to build the smallest (or largest) possible number. A useful reminder: two numbers with the same number of digits are compared digit by digit from the left, and the first digit that differs decides. `31999` is smaller than `32000`: so the first digit must be made as small as possible first, then the second one, and so on.

## Checking a greedy algorithm

Before trusting a greedy algorithm, write a **brute force** solution as well that tries every possibility (slow, but safe), and compare the two on hundreds of small random tests. A single disagreement proves that the greedy algorithm is wrong, and the small failing test helps explain why.

## Key takeaways

- A greedy algorithm makes the best local choice at each step, without going back: it is fast, often O(N log N) because of the sort.
- A natural greedy idea can be wrong: look for a counterexample before believing it.
- To prove a greedy algorithm: show that it "stays ahead" of any other solution, or that elements of an optimal solution can be swapped to get back the greedy choice without losing anything.
- A stack makes it possible to go back on the last choices: whatever is worse than the new item is popped, in O(N) in total.
- Always compare the greedy algorithm with a brute force on small random tests.
