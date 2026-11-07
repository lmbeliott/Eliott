From now on, a correct program is not enough: it must also be **fast**, otherwise it fails on the large tests. Its speed can be predicted before writing it, by counting its operations.

## Estimating the number of operations

Remember these orders of magnitude: in one second, a C++ program does about 10⁸ simple operations, and a Python program about 10⁷ (and even fewer in the browser).

We describe the speed of an algorithm by its **complexity**, written O(…): we count the operations as a function of the input size N, keeping only the biggest term. A loop over N elements is O(N). Two nested loops over N elements make N × N steps: O(N²).

Before coding, replace N by its maximum value:

| maximum N | what passes in C++ | what passes in Python |
| --- | --- | --- |
| 10 | O(N!), everything can be tried | O(N!) |
| 20 | O(2ᴺ) | O(2ᴺ) |
| 500 | O(N³) | O(N²) |
| 5 000 | O(N²) | O(N log N) |
| 100 000 and more | O(N log N) or O(N) | O(N log N) or O(N) |

Python does about ten times fewer operations per second: a complexity that only just passes in C++ is often too slow in Python.

With N = 50 000, a double loop makes 2.5 × 10⁹ steps: several minutes in Python. Large constraints are a message: a smarter idea is needed.

## Prefix sums

Given N numbers and many questions "what is the sum of cells A to B?". Redoing the addition costs up to N operations per question.

The trick: compute once and for all `pref[i]`, the sum of the first i numbers, with `pref[0] = 0`. Then the sum of cells A to B (numbered from 1) is `pref[B] − pref[A − 1]`: a single subtraction.

```python
t = [4, 1, 3, 0, 5]
n = len(t)
pref = [0] * (n + 1)
for i in range(n):
    pref[i + 1] = pref[i] + t[i]
# pref is [0, 4, 5, 8, 8, 13]
a, b = 2, 4
print(pref[b] - pref[a - 1])     # 1 + 3 + 0 = 4
```

```cpp
vector<int> t = {4, 1, 3, 0, 5};
int n = t.size();
vector<long long> pref(n + 1, 0);
for (int i = 0; i < n; i++) {
    pref[i + 1] = pref[i] + t[i];
}
// pref is 0 4 5 8 8 13
int a = 2, b = 4;
cout << pref[b] - pref[a - 1] << "\n";   // 1 + 3 + 0 = 4
```

Building `pref` costs O(N), then each question costs O(1). With Q questions: O(N + Q) instead of O(N × Q).

Prefix sums also help **count**. A stretch from A to B has a sum of zero exactly when `pref[B] = pref[A − 1]`. To count these stretches, go through the `pref` values in order, writing down in a dictionary how many times each value has already appeared: each new value forms a pair with all of its earlier appearances.

## Two pointers and sliding window

Consider the longest run of consecutive cells whose sum does not exceed a limit, with **positive** numbers. Trying every start and every end is O(N²).

Instead, we keep a **window** from `start` to `end`, together with its sum. We move `end` forward one cell at a time. If the window becomes too heavy, we move `start` forward until it is fine again. Since the numbers are positive, making a window that is too heavy longer never makes it fine: `start` never needs to move back.

```python
t = [2, 5, 1, 1, 3, 6, 1]
limit = 10
start = 0
total = 0
best = 0
for end in range(len(t)):
    total += t[end]
    while total > limit:
        total -= t[start]
        start += 1
    best = max(best, end - start + 1)
print(best)    # 4, for example 5 + 1 + 1 + 3 = 10
```

```cpp
vector<int> t = {2, 5, 1, 1, 3, 6, 1};
int limit = 10;
int start = 0, total = 0, best = 0;
for (int end = 0; end < (int)t.size(); end++) {
    total += t[end];
    while (total > limit) {
        total -= t[start];
        start++;
    }
    best = max(best, end - start + 1);
}
cout << best << "\n";   // 4, for example 5 + 1 + 1 + 3 = 10
```

There is a `while` loop inside a `for` loop, and yet it is O(N): `end` moves forward N times, and `start` moves forward at most N times **in total**. To count operations, look at how many times each pointer moves, not at the shape of the loops.

The same idea works with other conditions, for example "the window contains every letter". At each step, what is known about the window is kept up to date (a sum, some counters…) instead of recomputing it.

Watch the direction of the loop. Here, we look for the **longest** valid window: we move `start` forward while the window is **invalid**, then we record its length. For the **shortest** window that meets a condition which stays true as the window grows (like "contains every letter"), it is the other way around: while the window is **valid**, record its length, then move `start` forward.

## Key takeaways

- Before coding, replace N by its maximum in the complexity: in Python, aim for at most a few million operations.
- Prefix sums give the sum of any stretch in O(1), after an O(N) precomputation.
- The sum of a stretch is a difference of two `pref` values: a dictionary counts the stretches with a given sum.
- Two pointers that only move to the right cost O(N) in total, even with a loop inside a loop.
- Watch out for overflow: with large sums, use `long long` in C++.
