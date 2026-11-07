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
| N ≤ 10¹⁸ | O(log N) or O(√N) | formula, recursion that divides N, splitting around √N |

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

## Key takeaways

- The constraints indicate the expected complexity: estimate the number of operations of an idea before programming it.
- To speed up: sort, sweep with two pointers, use prefix sums, count contributions, change the point of view, go through multiples.
- An algorithm is justified by an invariant, an induction and a decreasing quantity; a program is checked on edge cases.
- Comparing the program with a naive solution on small random inputs finds most mistakes.
- Against a time limit, recount the operations, hidden costs included, and change the algorithm rather than shaving off details.
