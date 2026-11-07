Level 3 moved from programming to algorithmics. The tools are many: advanced strings and arrays, invariants, sorting, stacks and queues, prefix sums and two pointers, recursion, and above all estimating running time. In a review problem, no chapter title tells you which tool to use. This chapter gathers the habits that help you find it, then make a program correct and fast enough.

## Start from the constraints

The first line to read in a statement is the constraints line. It tells you the target complexity, counting on the order of 10⁸ simple operations per second in C++ and 10⁷ in Python.

| Data size | Target complexity | Typical tools of the level |
| --- | --- | --- |
| N ≤ 10 | O(N!) | all permutations (recursion) |
| N ≤ 20 | O(2^N) | all subsets (recursion) |
| N ≤ 2,000 | O(N²) | all pairs, simple sorts |
| N ≤ 2 × 10⁵ | O(N log N) or O(N) | sorting, two pointers, prefix sums, stacks, frequency arrays |
| values ≤ 10⁶ | O(M log M) | going through multiples (harmonic series) |
| N ≤ 10¹² | O(√N) | splitting around √N |
| N ≤ 10¹⁸ | O(log N) or O(1) | formula, recursion that divides N, digit by digit |

The table can be read both ways. If your idea is O(N²) and N is 10⁵, there is no point programming it: look for something else. Conversely, N ≤ 15 almost always suggests an exhaustive search.

When the direct idea is too slow, a few questions keep coming back:

- **Does the order matter?** If the answer does not depend on the order of the elements (counting pairs, triangles), sort, then sweep with two pointers.
- **What happens for a portion?** A sum over a portion is a difference of two prefix sums; a condition that stays true when the portion is shortened is handled with a sliding window.
- **Can contributions be counted?** Rather than enumerating the objects, count how many times each element takes part in the total (each number in the subsets, each minimum in the portions).
- **Can the point of view be swapped?** Start from the divisors to reach their multiples, count wheel by wheel rather than step by step, count position by position.
- **Are there few cases left?** The numbers of the form 2ᵃ × 3ᵇ up to 10¹⁸ are only about a thousand: they can all be built.

## Checking that an algorithm is correct

A program that passes the examples can be wrong. Before submitting, check three points, as in the chapter on correctness.

1. **An invariant.** For each important loop, state what stays true at each iteration: "all the pairs that are not entirely inside [l, r] have been counted", "the stack holds increasing heights". Check that it holds at the start, that an iteration preserves it, and that at the end it gives the answer.
2. **An induction.** For a recursive function, check the base case, then the recursive case assuming the smaller calls are correct.
3. **Termination.** An integer quantity strictly decreases at each iteration or each call: an index that moves forward, an N that is halved.

Then come the **edge cases**, the main source of mistakes at this level:

- a single element, or no possible pair: the answer is often 0;
- all elements equal, or duplicates where you imagined distinct values;
- the largest allowed value, which goes beyond 2³¹ in C++ (a number of pairs, a sum of products);
- a wrap-around: the last and the first element of a circle are neighbours;
- a recursion depth of several thousand calls, which requires `sys.setrecursionlimit` in Python;
- a negative remainder in C++ after a subtraction modulo m.

## Testing against a naive solution

The best way to find a mistake is to compare the program with a **naive solution**: slow, but so simple that it is surely correct. Run both on hundreds of small random inputs, and stop at the first difference. Here is this test for counting the pairs with sum at most S, by sorting and two pointers:

```python
import random

def naive(a, s):
    n = len(a)
    return sum(1 for i in range(n) for j in range(i + 1, n) if a[i] + a[j] <= s)

def fast(a, s):
    a = sorted(a)
    l, r, total = 0, len(a) - 1, 0
    while l < r:
        if a[l] + a[r] <= s:
            total = total + (r - l)
            l = l + 1
        else:
            r = r - 1
    return total

random.seed(1)
for attempt in range(1000):
    a = [random.randint(0, 10) for _ in range(random.randint(1, 8))]
    s = random.randint(0, 20)
    if naive(a, s) != fast(a, s):
        print("Difference:", a, s, naive(a, s), fast(a, s))
        break
else:
    print("1000 identical attempts")
```

```cpp
#include <algorithm>
#include <cstdlib>
#include <iostream>
#include <vector>
using namespace std;

long long naive(const vector<int> &a, int s) {
    long long total = 0;
    for (int i = 0; i < (int)a.size(); i++)
        for (int j = i + 1; j < (int)a.size(); j++)
            if (a[i] + a[j] <= s) total++;
    return total;
}

long long fast(vector<int> a, int s) {
    sort(a.begin(), a.end());
    int l = 0, r = a.size() - 1;
    long long total = 0;
    while (l < r) {
        if (a[l] + a[r] <= s) {
            total += r - l;
            l++;
        } else {
            r--;
        }
    }
    return total;
}

int main() {
    srand(1);
    for (int attempt = 0; attempt < 1000; attempt++) {
        vector<int> a(1 + rand() % 8);
        for (int &x : a) x = rand() % 11;
        int s = rand() % 21;
        if (naive(a, s) != fast(a, s)) {
            cout << "Difference:";
            for (int x : a) cout << " " << x;
            cout << " / S = " << s << "\n";
            return 0;
        }
    }
    cout << "1000 identical attempts\n";
    return 0;
}
```

The program prints `1000 identical attempts`. If `total + (r - l)` is replaced with `total + (r - l + 1)`, it stops at the first affected attempt and prints a small faulty input, easy to unroll by hand. The inputs must stay **small** (a few elements, small values): duplicates and edge cases show up often, and a difference is quickly understood.

## Debugging a time limit exceeded

The verdict "time limit exceeded" calls for a precise approach:

1. **Recount** the operations with the maximum values of the statement, without forgetting hidden costs: `x in a_list`, `a_list.pop(0)`, a slice `t[a:b]`, a `sum` or a `min` inside a loop, a string rebuilt at every iteration.
2. **Measure** on an input of maximum size, built by a small program: a list of 2 × 10⁵ random numbers, but also unfavourable cases (all equal, already sorted, sorted in reverse).
3. **Change the algorithm** if the count clearly exceeds the limit. Small optimizations (fast input with `sys.stdin`, `ios::sync_with_stdio(false)`) gain a factor of 2 or 3, never a factor of 1,000.
4. **Check the recursion**: a recursive function without memoization that recomputes the same values explodes, and a recursion that is too deep causes `RecursionError` or `Segmentation fault` instead of a time limit.

## Complete example: the sum of minimums

**Statement.** The program reads N (1 ≤ N ≤ 2 × 10⁵), then N integers a₀, …, a_{N−1} between 1 and 10⁶. It prints the sum of the minimums of all the segments a_l, …, a_r, for 0 ≤ l ≤ r < N. With `3 1 2 1`, the four one-element segments have minimums 3, 1, 2 and 1, and the six others all have minimum 1: the answer is 13.

**Start from the constraints.** There are N(N + 1)/2 segments, that is 2 × 10¹⁰ for N = 2 × 10⁵. Going through all of them, even while updating the minimum as the segment grows, costs O(N²): too slow in both languages. O(N) or O(N log N) is needed. Sorting is useless, since the order of the elements matters; stacks and counting contributions remain. The answer can reach 2 × 10¹⁰ × 10⁶ = 2 × 10¹⁶: `long long` in C++.

**The idea: count contributions.** Instead of computing the minimum of each segment, find, for each position i, the number of segments whose minimum is a_i. Equal values require a precise rule: in the segment `1 2 1`, the minimum is reached twice, and the segment must count only once. Assign it to the **leftmost** position of its minimum. The segment [l, r] is then assigned to i exactly when l ≤ i ≤ r, a_l, …, a_{i−1} are **strictly** greater than a_i, and a_{i+1}, …, a_r are **at least** a_i. Let g(i) be the last position before i with value ≤ a_i (−1 if there is none), and d(i) the first position after i with value < a_i (N if there is none). The segments assigned to i are those with g(i) < l ≤ i and i ≤ r < d(i): there are (i − g(i)) × (d(i) − i) of them. The answer is therefore the sum of a_i × (i − g(i)) × (d(i) − i). On the example: 3 × 1 × 1 + 1 × 2 × 3 + 2 × 1 × 1 + 1 × 2 × 1 = 13.

**Computing g and d.** This is the monotonic stack of the chapter "Stacks and queues". For g, go through the positions from left to right; before pushing i, pop while the top has a value > a_i, and the remaining top, if any, is g(i). For d, do the same from right to left, popping while the top has a value ≥ a_i.

```python
import sys

data = sys.stdin.read().split()
n = int(data[0])
a = [int(x) for x in data[1:n + 1]]

# g[i] = last position before i with value <= a[i] (-1 if there is none)
g = [-1] * n
stack = []
for i in range(n):
    while stack and a[stack[-1]] > a[i]:
        stack.pop()
    if stack:
        g[i] = stack[-1]
    stack.append(i)

# d[i] = first position after i with value < a[i] (n if there is none)
d = [n] * n
stack = []
for i in range(n - 1, -1, -1):
    while stack and a[stack[-1]] >= a[i]:
        stack.pop()
    if stack:
        d[i] = stack[-1]
    stack.append(i)

total = 0
for i in range(n):
    total = total + a[i] * (i - g[i]) * (d[i] - i)
print(total)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    // g[i] = last position before i with value <= a[i] (-1 if there is none)
    vector<int> g(n, -1), stack_g;
    for (int i = 0; i < n; i++) {
        while (!stack_g.empty() && a[stack_g.back()] > a[i]) {
            stack_g.pop_back();
        }
        if (!stack_g.empty()) {
            g[i] = stack_g.back();
        }
        stack_g.push_back(i);
    }

    // d[i] = first position after i with value < a[i] (n if there is none)
    vector<int> d(n, n), stack_d;
    for (int i = n - 1; i >= 0; i--) {
        while (!stack_d.empty() && a[stack_d.back()] >= a[i]) {
            stack_d.pop_back();
        }
        if (!stack_d.empty()) {
            d[i] = stack_d.back();
        }
        stack_d.push_back(i);
    }

    long long total = 0;
    for (int i = 0; i < n; i++) {
        total += a[i] * (i - g[i]) * (d[i] - i);
    }
    cout << total << "\n";
    return 0;
}
```

**Correctness.** Each segment has a single leftmost position of its minimum: it is counted once, with the right value. It remains to check that the stacks give g and d. Let j be the last position before i with value ≤ a_i. A position p is only popped by a position k > p with value a_k < a_p; if j had been popped before i, it would be by some k between j and i with a_k < a_j ≤ a_i, which contradicts the choice of j. So j is in the stack when i is processed. The positions pushed above j are between j and i, hence have values > a_i: they are popped, then the loop stops on j. If there is no such j, the stack empties and g(i) = −1. The reasoning is the same for d.

**Cost.** In each pass, each position is pushed once and popped at most once: O(N) amortized, about a million operations instead of 2 × 10¹⁰.

**Testing against the naive solution.** The O(N²) solution fits in a few lines:

```python
def naive(a):
    total = 0
    for i in range(len(a)):
        m = a[i]                     # minimum of a[i..j]
        for j in range(i, len(a)):
            m = min(m, a[j])
            total = total + m
    return total
```

```cpp
long long naive(const vector<long long> &a) {
    long long total = 0;
    for (int i = 0; i < (int)a.size(); i++) {
        long long m = a[i];          // minimum of a[i..j]
        for (int j = i; j < (int)a.size(); j++) {
            m = min(m, a[j]);
            total += m;
        }
    }
    return total;
}
```

Put the fast computation in a function `fast(a)`, and reuse the test loop of the previous section, with lists of 1 to 8 values between 1 and 3: equal values are frequent there, and that is where mistakes hide. The program above passes the 1,000 attempts. If you write `>=` instead of `>` in the first loop, g(i) becomes the last position with a **strictly** smaller value, and a segment whose minimum appears twice is assigned to both positions. In Python, the test stops at the second attempt, on the list `2 2`: the naive solution finds 6 (2 + 2 + 2), the faulty version 8, because the whole segment is counted twice. A two-element list is easy to trace by hand, and the mistake is obvious.

## Key takeaways

- The constraints indicate the expected complexity: estimate the number of operations of an idea before programming it.
- To speed up: sort, sweep with two pointers, use prefix sums, count contributions, change the point of view, go through multiples.
- An algorithm is justified by an invariant, an induction and a decreasing quantity; a program is checked on edge cases.
- Comparing the program with a naive solution on small random inputs finds most mistakes.
- When counting contributions, each object must be assigned to a single element: with equal values, fix a rule (the leftmost position, for example) and check it with a random test.
- Against a time limit, recount the operations, hidden costs included, and change the algorithm rather than shaving off details.
