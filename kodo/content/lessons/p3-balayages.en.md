A shop has recorded its takings every day for a year, and we want to answer a thousand questions like "how much did it earn from day 40 to day 200?". Adding up the days concerned for each question takes up to 365 additions per question. Yet a single preparatory pass over the data is enough to then answer each question with **a single subtraction**.

This chapter presents **sweep** techniques: you go through the data once, in order, keeping a few well-chosen pieces of information up to date. Prefix sums and the difference array prepare an array that then answers instantly. Two pointers and the sliding window move two indices in the same direction, never going back. In each case, work of about `n²` operations is replaced by work of about `n`, and you justify both that the result is correct and that the number of operations is the one announced.

## Prefix sums

Let `t` be an array of `n` numbers, numbered from 0 to `n − 1`. Its array of **prefix sums** `P` has `n + 1` cells: `P[0] = 0`, and `P[i]` is the sum of the first `i` elements, `t[0] + … + t[i − 1]`. It is filled in one pass, since `P[i + 1] = P[i] + t[i]`.

The sum of a **segment** `t[a], t[a + 1], …, t[b]` (consecutive cells) is then `P[b + 1] − P[a]`: from `P[b + 1] = t[0] + … + t[b]`, remove the first `a` terms, whose sum is `P[a]`.

```python
t = [3, -1, 4, 1, 5, 9, 2, 6]
n = len(t)
p = [0] * (n + 1)
for i in range(n):
    p[i + 1] = p[i] + t[i]
print(p)
print(p[6] - p[2])
print(p[1] - p[0])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<long long> t = {3, -1, 4, 1, 5, 9, 2, 6};
    int n = t.size();
    vector<long long> p(n + 1, 0);
    for (int i = 0; i < n; i++) {
        p[i + 1] = p[i] + t[i];
    }
    for (long long x : p) {
        cout << x << " ";
    }
    cout << "\n";
    cout << p[6] - p[2] << "\n";
    cout << p[1] - p[0] << "\n";
    return 0;
}
```

The program prints `[0, 3, 2, 6, 7, 12, 21, 23, 29]`, then `19`, the sum from `t[2]` to `t[5]` (4 + 1 + 5 + 9), then `3`, the segment made of `t[0]` alone. The cell `P[0] = 0` avoids a special case for segments starting at the beginning.

**Cost.** The preparation makes `n` additions, then each question costs one subtraction. For `q` questions, that is about `n + q` operations, instead of `n × q` in the worst case when adding up each time. For `n = q = 100,000`, that is 200,000 operations instead of 10 billion.

The same idea is used to **count**. If `C[i]` is the number of elements among the first `i` that have some property (being even, being a multiple of 7, being 0…), the number of elements of segment `[a, b]` that have it is `C[b + 1] − C[a]`. An equality of prefix sums also has a meaning: `P[b + 1] = P[a]` means that segment `[a, b]` has a zero sum. Many problems on segments thus reduce to questions about pairs of prefix sums.

## Two-dimensional prefix sums

For a grid `g` with `n` rows and `m` columns, write `S[i][j]` for the sum of the rectangle made of rows `0` to `i − 1` and columns `0` to `j − 1`, with a row and a column of zeros (`S[0][j] = S[i][0] = 0`). The rectangle `S[i][j]` splits into the one above, `S[i − 1][j]`, and the one on the left, `S[i][j − 1]`, which overlap on `S[i − 1][j − 1]`, plus the cell `g[i − 1][j − 1]`. Hence:

`S[i][j] = S[i − 1][j] + S[i][j − 1] − S[i − 1][j − 1] + g[i − 1][j − 1]`.

The same reasoning, called **inclusion-exclusion**, gives the sum of the rectangle of rows `a` to `b` and columns `c` to `d` (included): `S[b + 1][d + 1] − S[a][d + 1] − S[b + 1][c] + S[a][c]`. Remove the two bands above and on the left, and add back their common corner, removed twice.

```python
g = [[1, 2, 0, 3],
     [4, 0, 1, 1],
     [2, 5, 2, 0]]
n, m = 3, 4
s = []
for i in range(n + 1):
    s.append([0] * (m + 1))
for i in range(1, n + 1):
    for j in range(1, m + 1):
        s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + g[i - 1][j - 1]
# rows 1 to 2, columns 0 to 2
print(s[3][3] - s[1][3] - s[3][0] + s[1][0])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<int>> g = {{1, 2, 0, 3}, {4, 0, 1, 1}, {2, 5, 2, 0}};
    int n = 3, m = 4;
    vector<vector<int>> s(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + g[i - 1][j - 1];
        }
    }
    // rows 1 to 2, columns 0 to 2
    cout << s[3][3] - s[1][3] - s[3][0] + s[1][0] << "\n";
    return 0;
}
```

The program prints `14`: 4 + 0 + 1 + 2 + 5 + 2. The preparation costs `n × m` operations, then each rectangle is computed with four reads, whatever its size.

## The difference array

This is the reverse problem: you must **add** a value `v` to all cells of a segment `[a, b]`, many times, then read the final array. Instead of changing all the cells, only note the start and the end of each addition in a **difference array** `D` of size `n + 1`: `D[a] += v` and `D[b + 1] −= v`. At the end, the value of cell `i` is the prefix sum `D[0] + D[1] + … + D[i]`.

```python
n = 8
d = [0] * (n + 1)
ajouts = [(1, 4, 5), (3, 7, 2), (0, 0, 10)]
for a, b, v in ajouts:
    d[a] = d[a] + v
    d[b + 1] = d[b + 1] - v
t = []
c = 0
for i in range(n):
    c = c + d[i]
    t.append(c)
print(*t)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n = 8;
    vector<long long> d(n + 1, 0);
    int ajouts[3][3] = {{1, 4, 5}, {3, 7, 2}, {0, 0, 10}};
    for (int k = 0; k < 3; k++) {
        int a = ajouts[k][0], b = ajouts[k][1], v = ajouts[k][2];
        d[a] += v;
        d[b + 1] -= v;
    }
    long long c = 0;
    for (int i = 0; i < n; i++) {
        c += d[i];
        cout << c << " ";
    }
    cout << "\n";
    return 0;
}
```

The program prints `10 5 5 7 7 2 2 2`. **Why**: in the sum `D[0] + … + D[i]`, an addition `(a, b, v)` contributes `+v` if `a ≤ i`, and `−v` if `b + 1 ≤ i`. What remains is `+v` exactly when `a ≤ i ≤ b`, that is, when cell `i` is in the segment. **Cost**: two operations per addition, then one pass: about `m + n` operations for `m` additions, instead of `m × n`.

The two techniques are inverse of each other: the difference array of `P` is `t`, and the prefix sum array of `D` is the final array. This is the discrete analogue of the derivative and the integral.

## Two pointers on a sorted array

In a **sorted** array `t[0] ≤ t[1] ≤ … ≤ t[n − 1]`, look for two positions `g < d` such that `t[g] + t[d] = S`. Testing all pairs costs `n² / 2` operations. Instead, place an index `g` at the start and an index `d` at the end, and bring them closer:

- if `t[g] + t[d] < S`, cell `g` cannot be part of any solution with some `d' ≤ d`, since `t[g] + t[d'] ≤ t[g] + t[d] < S`: move `g` forward;
- if `t[g] + t[d] > S`, likewise cell `d` is useless: move `d` back;
- otherwise, found.

```python
t = [1, 3, 4, 6, 8, 11, 15]
S = 14
g = 0
d = len(t) - 1
trouve = False
while g < d and not trouve:
    if t[g] + t[d] < S:
        g = g + 1
    elif t[g] + t[d] > S:
        d = d - 1
    else:
        trouve = True
if trouve:
    print(t[g], t[d])
else:
    print("AUCUNE")
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {1, 3, 4, 6, 8, 11, 15};
    int S = 14;
    int g = 0, d = t.size() - 1;
    bool trouve = false;
    while (g < d && !trouve) {
        if (t[g] + t[d] < S) {
            g++;
        } else if (t[g] + t[d] > S) {
            d--;
        } else {
            trouve = true;
        }
    }
    if (trouve) {
        cout << t[g] << " " << t[d] << "\n";
    } else {
        cout << "AUCUNE\n";
    }
    return 0;
}
```

The program prints `3 11`. The pairs examined are `(1, 15)`: too big; `(1, 11)`: too small; `(3, 11)`: found.

**Why it is correct.** Invariant: *if a solution exists, there is one with both positions between `g` and `d`*. It holds at the start, and each move only discards a cell that was shown to belong to no remaining solution. If the loop stops with `g = d`, no pair remains, so there was no solution. **Cost**: `d − g` decreases by 1 at each turn, so at most `n − 1` turns. Everything relies on the sort: on an arbitrary array, discarding a cell is no longer justified.

## The sliding window

A **window** is a segment `[g, d]` whose two edges are moved to the right, never back. It is used when the property sought is **monotonic**: if a segment works, all the segments it contains work too (or the other way round). Example: in an array of **strictly positive** numbers, find the shortest segment with sum at least `S`.

Move `d` forward one cell at a time, adding `t[d]` to the sum of the window. As long as this sum reaches `S`, the window `[g, d]` works: note its length, then remove `t[g]` and move `g` forward to try shorter.

```python
t = [2, 1, 5, 2, 3, 2]
S = 7
g = 0
somme = 0
meilleure = len(t) + 1
for d in range(len(t)):
    somme = somme + t[d]
    while somme >= S:
        meilleure = min(meilleure, d - g + 1)
        somme = somme - t[g]
        g = g + 1
if meilleure == len(t) + 1:
    print("AUCUNE")
else:
    print(meilleure)
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {2, 1, 5, 2, 3, 2};
    int S = 7;
    int n = t.size();
    int g = 0, somme = 0, meilleure = n + 1;
    for (int d = 0; d < n; d++) {
        somme += t[d];
        while (somme >= S) {
            meilleure = min(meilleure, d - g + 1);
            somme -= t[g];
            g++;
        }
    }
    if (meilleure == n + 1) {
        cout << "AUCUNE\n";
    } else {
        cout << meilleure << "\n";
    }
    return 0;
}
```

The program prints `2`: the segment `5 2`.

**Why it is correct.** Each length noted is that of a window that works. It remains to see that the shortest one is noted. Let `[a, b]` be a shortest segment that works, and look at `g` at the start of the turn `d = b`.

- If `g ≤ a`, each window `[g, b]` with `g ≤ a` contains `[a, b]`; since the values are positive, its sum is at least that of `[a, b]`, so at least `S`. The `while` loop therefore moves `g` at least up to `a + 1`, and notes the length of `[a, b]` on the way.
- If `g > a`, then `g` went from `a` to `a + 1` during a turn `d' < b`, just after noting the window `[a, d']`. That window works and is shorter than `[a, b]`: this is impossible.

**Cost**: `d` moves forward `n` times and `g` moves forward at most `n` times in total, since it never moves back: at most `2n` steps, even though a single turn of the `for` loop can move `g` a long way. With negative values, a larger window no longer necessarily has a larger sum: the first case no longer holds, and the method gives wrong answers.

**The longest segment.** The same method handles monotonicity in the other direction: when every segment **contained** in a segment that works also works (a sum at most `S` with positive values, at most `K` zeros, at most `K` distinct values…), you look for the **longest** segment that works. For each end `d`, add `t[d]`, then move `g` forward **as long as the window does not work**. Here is the longest segment with sum at most `S`:

```python
t = [2, 1, 5, 2, 3, 2]
S = 7
g = 0
somme = 0
meilleure = 0
for d in range(len(t)):
    somme = somme + t[d]
    while somme > S:
        somme = somme - t[g]
        g = g + 1
    meilleure = max(meilleure, d - g + 1)
print(meilleure)
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {2, 1, 5, 2, 3, 2};
    int S = 7;
    int n = t.size();
    int g = 0, somme = 0, meilleure = 0;
    for (int d = 0; d < n; d++) {
        somme += t[d];
        while (somme > S) {
            somme -= t[g];
            g++;
        }
        meilleure = max(meilleure, d - g + 1);
    }
    cout << meilleure << "\n";
    return 0;
}
```

The program prints `3`: the segment `2 3 2`. Invariant: after the `while` loop, `g` is the smallest start such that `[g, d]` works. Indeed, if `[g', d + 1]` works, `[g', d]`, which is contained in it, works too: the smallest valid start never moves back when `d` moves forward, and `g` never needs to go back. The longest segment ending at `d` is therefore `[g, d]`, and every end is tried. If `t[d]` alone exceeds `S`, `g` reaches `d + 1`: the window is empty, of length 0. The cost is the same: at most `2n` steps.

## Common mistakes

**The index shift.** With `P[0] = 0`, the sum of `t[a..b]` is `P[b + 1] − P[a]`. Writing `P[b] − P[a]` forgets `t[b]`, without any error message. Check the formula on a segment of a single cell.

**A difference array that is too short.** For an addition running to the last cell, you write at `D[n]`. With an array of size `n`, Python prints `IndexError: list index out of range`; in C++, the program writes outside the array without warning.

**The forgotten corner in two dimensions.** Without the term `+ S[a][c]`, the common corner is removed twice: the result is wrong, with no message.

**Overflow in C++.** A prefix sum of 100,000 values up to 10⁹ reaches 10¹⁴: an `int` overflows and gives absurd numbers, sometimes negative. Use `long long` for `P`.

**A window on negative values.** With `t = [5, -10, 6]` and `S = 6`, the window `[0, 2]` has sum 1, which never reaches `S`: the start does not move, and the program prints `AUCUNE` although the segment `6` alone works. The sliding window requires a monotonic property; otherwise, go through prefix sums.

**Two pointers on an unsorted array.** The reasoning that discards a cell assumes the array is sorted: sort first.

## A complete example

**Statement.** `N` trees are planted along a path, at positions `X₁, …, X_N` (integers, in any order). Count the pairs of trees at most `D` metres apart, with `D ≥ 0`. `N` can reach 100,000.

**Idea.** Testing the pairs costs 5 billion operations. Sort the positions. For each tree `d`, the trees placed before it and at distance at most `D` form a block `g, g + 1, …, d − 1` ending just before it: keep track of the start `g` of this block, which never moves back when `d` moves forward.

**Program.**

```python
n, dist = map(int, input().split())
x = list(map(int, input().split()))
x.sort()
paires = 0
g = 0
for d in range(n):
    while x[d] - x[g] > dist:
        g = g + 1
    paires = paires + (d - g)
print(paires)
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    long long dist;
    cin >> n >> dist;
    vector<long long> x(n);
    for (int i = 0; i < n; i++) {
        cin >> x[i];
    }
    sort(x.begin(), x.end());
    long long paires = 0;
    int g = 0;
    for (int d = 0; d < n; d++) {
        while (x[d] - x[g] > dist) {
            g++;
        }
        paires += d - g;
    }
    cout << paires << "\n";
    return 0;
}
```

**Checking by hand.** With `6 3` then `10 1 4 12 2 8`, the sorted positions are `1 2 4 8 10 12`. For `d = 0` (1), no pair. For 2: `g = 0`, one pair. For 4: `4 − 1 = 3 ≤ 3`, so `g = 0` and two pairs. For 8: `g` moves up to the position of 8, no pair. For 10: `g` stops on 8, one pair. For 12: `12 − 8 = 4 > 3`, `g` moves on to 10, one pair. The program prints `5`: the pairs `(1, 2)`, `(1, 4)`, `(2, 4)`, `(8, 10)` and `(10, 12)`.

**Why it is correct.** Invariant: after the `while` loop, `g` is the smallest position such that `x[d] − x[g] ≤ D`. Since the array is sorted, trees `g` to `d − 1` are exactly those before `d` and at distance at most `D`, and there are `d − g` of them. When `d` moves forward, `x[d]` increases: a tree too far from the old `x[d]` is even further from the new one, so `g` never has to move back. Each pair is counted once, when `d` is its rightmost tree. **Cost**: the sort, then `d` and `g` each move forward at most `N` times, that is at most `2N` steps. The number of pairs can reach 5 × 10⁹: `long long` in C++.

## Key takeaways

- Prefix sums: `P[0] = 0`, `P[i + 1] = P[i] + t[i]`, and the sum of `t[a..b]` is `P[b + 1] − P[a]`. In two dimensions, four terms by inclusion-exclusion.
- Difference array: `D[a] += v`, `D[b + 1] −= v`, then prefix sums of `D`. It is the inverse operation of prefix sums.
- Two pointers on a sorted array: each step discards a cell that can no longer be used, justified by the sort; at most `n` steps.
- Sliding window: when the property is monotonic, the start never moves back; each edge moves forward at most `n` times, so at most `2n` steps in total.
- For each technique, prove correctness with an invariant and count operations globally: about `n` instead of `n²`.
- Traps: index shifts, cell `n` of the difference array, `long long` in C++, and no sliding window without monotonicity.
