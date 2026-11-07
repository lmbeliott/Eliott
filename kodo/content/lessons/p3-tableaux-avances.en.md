At level 2, an array was mostly used to keep values in order to read them again: find a maximum, count, reverse. This chapter presents classic **algorithms** on arrays: rotating an array, transforming it without creating a second one, merging two sorted arrays, counting pairs with a frequency array, making two passes to avoid recomputing everything, and finding the stretch with the largest sum.

Each time, the obvious method exists, but it is often too slow: it makes on the order of `n²` operations when `n` is the size of the array. For `n = 100,000`, that is ten billion, minutes of computation. The methods of this chapter make on the order of `n` operations, and each time we will see **why they are correct** and **how much they cost**. But first, two instructions that make many loops simpler.

## Leaving a loop: break and continue

The **`break`** instruction immediately stops the loop containing it: the program resumes right after that loop. The **`continue`** instruction only stops the **current turn**: the loop goes straight to the next turn (in a `for`, the variable takes the next value; in a `while`, the condition is tested again). Both are written the same way in Python and C++ (with a semicolon in C++), in a `for` as well as in a `while`.

At level 1, to look for the first value that fits, you wrote a `while` loop whose condition combined the limit and the criterion: `while i < n and t[i] >= 0`. With `break`, you write an ordinary traversal and leave as soon as you have found it.

```python
t = [4, 8, -3, 5, -1]
pos = -1
for i in range(len(t)):
    if t[i] < 0:
        pos = i
        break
print(pos)

total = 0
for x in t:
    if x < 0:
        continue
    total = total + x
print(total)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {4, 8, -3, 5, -1};
    int pos = -1;
    for (int i = 0; i < (int) t.size(); i++) {
        if (t[i] < 0) {
            pos = i;
            break;
        }
    }
    cout << pos << "\n";

    int total = 0;
    for (int x : t) {
        if (x < 0) {
            continue;
        }
        total = total + x;
    }
    cout << total << "\n";
    return 0;
}
```

The program prints `2`, then `17`. The first loop stops at the first negative value, at index 2: the value `-1`, further on, is never examined. If there were no negative value, the loop would run to the end and `pos` would keep the value `-1`. The second loop skips the negative values and adds `4 + 8 + 5`.

The two ways of writing the search are equivalent. The condition `while i < n and not found` gathers the whole stopping rule, which makes reasoning about the loop easier; `break` is shorter when the stop is decided in the middle of the body. `continue` discards uninteresting cases early, without nesting the whole rest of the body inside an `if`. Inside a function, `return` stops both the loop and the function, which is often even clearer.

## Shifts and rotations

**Rotating** an array by `k` steps to the right means moving each value `k` positions to the right, those passing the end coming back to the start: `1 2 3 4 5` rotated by 2 steps gives `4 5 1 2 3`. The value at index `i` goes to index `(i + k) % n`. After `n` steps, every value is back in its place: only `k % n` matters. Rotating an array by a billion steps is therefore no more expensive than by a few steps, provided you do not make them one by one.

```python
t = [1, 2, 3, 4, 5]
n = len(t)
k = 12 % n
r = [0] * n
for i in range(n):
    r[(i + k) % n] = t[i]
print(*r)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {1, 2, 3, 4, 5};
    int n = t.size();
    int k = 12 % n;
    vector<int> r(n);
    for (int i = 0; i < n; i++) {
        r[(i + k) % n] = t[i];
    }
    for (int x : r) cout << x << " ";
    cout << "\n";
    return 0;
}
```

The program prints `4 5 1 2 3`: 12 steps are two full turns, plus 2 steps. This method uses a second array. You can also rotate **in place**, with three reversals: reverse the first `n − k` values, then the last `k`, then the whole array. On the example: `3 2 1 5 4`, then `4 5 1 2 3`. Why this is correct: call `A` the block of the first `n − k` values and `B` the block of the last `k`. The array is `A` followed by `B`, and we want `B` followed by `A`. Reversing an array made of a block `X` followed by a block `Y` gives `Y` reversed followed by `X` reversed: the last value goes to the front, and so on. After the first two reversals, the array is `A` reversed followed by `B` reversed; the last reversal therefore gives `B` reversed twice, that is `B`, followed by `A`. Each reversal is done with swaps, as in level 2, and each value is moved at most twice: the cost is proportional to `n` in both methods.

## Transforming in place

Transforming an array **in place** means modifying it without creating a second one. Typical example: removing all the zero values from an array, keeping the order of the others. The naive method, repeating `t.remove(0)`, is slow: each `remove` searches for the value from the start then shifts everything after it by one cell. With many zeros, this makes on the order of `n²` moves.

The right method uses two indices. The **read** index `i` goes through the whole array; the **write** index `w` tells where to store the next value kept.

```python
t = [3, 0, 0, 7, 0, 2]
w = 0
for i in range(len(t)):
    if t[i] != 0:
        t[w] = t[i]
        w = w + 1
print(t[:w], w)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {3, 0, 0, 7, 0, 2};
    int w = 0;
    for (int i = 0; i < (int) t.size(); i++) {
        if (t[i] != 0) {
            t[w] = t[i];
            w = w + 1;
        }
    }
    t.resize(w);
    for (int x : t) cout << x << " ";
    cout << w << "\n";
    return 0;
}
```

Python prints `[3, 7, 2] 3` (C++ prints `3 7 2 3`). Why it is correct: before each turn, cells `t[0]` to `t[w − 1]` contain exactly the non-zero values among `t[0]` to `t[i − 1]`, in order. A turn keeps this property: if `t[i]` is kept, it is stored at `t[w]`. A value not yet read is never overwritten, since `w ≤ i`. At the end, `i` equals `n`, and the first `w` cells are the result. The cost is one pass. In C++, `t.resize(w)` shortens the array to its first `w` cells; in Python, the slice `t[:w]` gives a copy of them, or `del t[w:]` cuts off the end.

## Merging two sorted arrays

Two arrays `a` and `b` are sorted in increasing order. **Merging** them means producing a single sorted array containing all their values. Move through both at the same time, with an index `i` in `a` and an index `j` in `b`: at each step, take the smaller of the two values `a[i]` and `b[j]`, and advance the corresponding index. When one of the arrays is exhausted, copy the rest of the other.

```python
a = [1, 4, 4, 9]
b = [2, 4, 10]
r = []
i = 0
j = 0
while i < len(a) or j < len(b):
    if j == len(b) or (i < len(a) and a[i] <= b[j]):
        r.append(a[i])
        i = i + 1
    else:
        r.append(b[j])
        j = j + 1
print(*r)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> a = {1, 4, 4, 9}, b = {2, 4, 10}, r;
    int i = 0, j = 0;
    int n = a.size(), m = b.size();
    while (i < n || j < m) {
        if (j == m || (i < n && a[i] <= b[j])) {
            r.push_back(a[i]);
            i = i + 1;
        } else {
            r.push_back(b[j]);
            j = j + 1;
        }
    }
    for (int x : r) cout << x << " ";
    cout << "\n";
    return 0;
}
```

The program prints `1 2 4 4 4 9 10`. The condition reads: take from `a` if `b` is exhausted, or if `a` is not and `a[i] ≤ b[j]`. The order of the tests matters: `b[j]` is never read when `j == len(b)`, because `or` stops as soon as its first part is true.

**Why it is correct.** Invariant: at the start of each turn, `r` contains `a[0..i − 1]` and `b[0..j − 1]`, in increasing order, and every value of `r` is less than or equal to all remaining values (`a[i..]` and `b[j..]`). It holds at the start, when `r` is empty. Since `a` is sorted, the remaining values of `a` are all at least `a[i]`; likewise for `b`. So the value taken is the smallest of all remaining values: it is at least the last value of `r` (invariant), so `r` stays sorted, and it is less than or equal to everything that remains. The invariant is kept. At the exit, `i = n` and `j = m`: `r` contains all the values, sorted. **Cost.** Each step advances one index: exactly `n + m` steps. The same idea of two indices moving together computes the intersection of two sorted arrays, or the smallest gap between their values.

## Counting with a frequency array

The **frequency array** (or counting array) of level 2, where `f[v]` is the number of occurrences of value `v`, summarises a whole array when the values are small integers. It is used to count **pairs** without listing them. How many pairs of positions `i < j` hold the same value? A value appearing `c` times forms `c × (c − 1) / 2` pairs: you choose two positions among `c`. You can also count in a single pass: when a value `x` is read, it forms a pair with each of the `f[x]` occurrences already read.

```python
t = [3, 1, 3, 3, 1, 2]
f = [0] * 4
paires = 0
for x in t:
    paires = paires + f[x]
    f[x] = f[x] + 1
print(paires)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {3, 1, 3, 3, 1, 2};
    vector<long long> f(4, 0);
    long long paires = 0;
    for (int x : t) {
        paires = paires + f[x];
        f[x] = f[x] + 1;
    }
    cout << paires << "\n";
    return 0;
}
```

The program prints `4`: three pairs of `3` and one pair of `1`. Each pair is counted once, when its second value is read. The order of the two instructions is essential: by increasing `f[x]` first, each value would form a pair with itself. The same technique counts the pairs whose sum is `K`, or whose sum is a multiple of `K`: replace "the same value" with "the partner value". The cost is one pass, plus the size of the array `f`; trying every pair would cost `n × (n − 1) / 2` comparisons.

## Two passes rather than one computation per cell

Many problems ask for a piece of information **for each cell** that depends on the whole array. For example: for each value, the largest of the **other** elements. Recomputing a maximum for each cell costs `n` operations per cell, so `n²` in all. It is better to have a first pass computing once and for all what is needed, then a second one answering for each cell.

Here, the first pass computes the maximum `m1` and the **second maximum** `m2` (the largest once one occurrence of `m1` is removed). For a cell equal to `m1`, the largest of the others is `m2`; for any other cell, it is `m1`. This stays correct when the maximum appears twice: `m2` is then also equal to `m1`. The array must have at least two cells. Invariant of the first pass: after examining `t[0..i]`, `m1` and `m2` are the two largest values of `t[0..i]` (`m1 ≥ m2`, counting repeats). A new value `x` larger than `m1` becomes the maximum and the old maximum becomes the second; otherwise it only replaces `m2`, if it exceeds it.

```python
t = [5, 9, 2, 9, 4]
m1 = max(t[0], t[1])
m2 = min(t[0], t[1])
for x in t[2:]:
    if x > m1:
        m2 = m1
        m1 = x
    elif x > m2:
        m2 = x
for x in t:
    if x == m1:
        print(m2, end=" ")
    else:
        print(m1, end=" ")
print()
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {5, 9, 2, 9, 4};
    int m1 = max(t[0], t[1]);
    int m2 = min(t[0], t[1]);
    for (int i = 2; i < (int) t.size(); i++) {
        if (t[i] > m1) {
            m2 = m1;
            m1 = t[i];
        } else if (t[i] > m2) {
            m2 = t[i];
        }
    }
    for (int x : t) {
        cout << (x == m1 ? m2 : m1) << " ";
    }
    cout << "\n";
    return 0;
}
```

The program prints `9 9 9 9 9`: the maximum 9 appears twice, so each cell sees another 9. With `t = [5, 9, 2, 4]`, it would print `9 5 9 9`. The same pattern works for "the highest value to the left of each cell": a pass from left to right keeps the maximum seen so far up to date and stores it in an array. A pass from right to left likewise gives the highest value to the right. (In C++, `cond ? a : b` is `a` if the condition is true, `b` otherwise.)

## The stretch with the largest sum

A **stretch** of an array is a sequence of consecutive cells, `t[l]` to `t[r]` with `l ≤ r`. We look for the stretch whose sum is the largest. There are `n × (n + 1) / 2` stretches: trying them all, even updating the sum as you go, takes on the order of `n²` additions.

A single pass is enough. Let `end[i]` be the largest sum of a stretch that **ends** at index `i`. Such a stretch is either cell `i` alone, with sum `t[i]`, or a stretch ending at `i − 1`, extended by `t[i]`, with sum at most `end[i − 1] + t[i]`, a value reached by extending the best one. So `end[i] = max(t[i], end[i − 1] + t[i]) = t[i] + max(end[i − 1], 0)`: extend if the previous best sum is non-negative, and start again from zero otherwise. Since every stretch ends at some index, the answer is the largest `end[i]`.

```python
t = [2, -5, 3, -1, 4, -7, 2]
courant = t[0]
meilleur = t[0]
for i in range(1, len(t)):
    if courant >= 0:
        courant = courant + t[i]
    else:
        courant = t[i]
    meilleur = max(meilleur, courant)
print(meilleur)
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {2, -5, 3, -1, 4, -7, 2};
    long long courant = t[0], meilleur = t[0];
    for (int i = 1; i < (int) t.size(); i++) {
        if (courant >= 0) {
            courant = courant + t[i];
        } else {
            courant = t[i];
        }
        meilleur = max(meilleur, courant);
    }
    cout << meilleur << "\n";
    return 0;
}
```

The program prints `6`, the sum of `3 -1 4`. The successive values of `courant` are 2, −3, 3, 2, 6, −1, 2: after the −5, the sum −3 is negative, and you start again from the next cell. Invariant: at the end of turn `i`, `courant` equals `end[i]` and `meilleur` the largest of `end[0..i]`; at the exit, `meilleur` is therefore the largest sum of a stretch. Initialise with `t[0]` and not with 0: if all values are negative, the answer is the largest of them. The cost is one pass.

## Common mistakes

**Removing while traversing.** Removing elements from a list traversed with `for x in t` skips elements, without any error message. Use the read-write method, or build a new list.

**Reading past the end in a merge.** With the condition `a[i] <= b[j]` alone, the loop reads `b[j]` when `j == len(b)`: `IndexError: list index out of range` in Python, an arbitrary value in C++. First test whether an array is exhausted.

**Forgetting the remainder for a rotation.** With `k = 10¹⁸`, `(i + k) % n` works in Python. In C++, 10¹⁸ does not fit in an `int`: read `k` into a `long long`, then first compute `((k % n) + n) % n`, which also brings a negative `k` between 0 and `n − 1` (otherwise `(i + k) % n` can be negative).

**A frequency array that is too large.** `[0] * (10**9 + 1)` raises `MemoryError`. The frequency array only suits small values; otherwise, use a dictionary.

**Believing that `break` leaves all loops.** In two nested loops, `break` only leaves the inner loop. To stop everything, put the loops in a function and use `return`.

## A complete example

**Statement.** Read `N` integers. Print the first position `p` (from 1) such that the sum of the values before `p` equals the sum of the values after `p`, or `-1` if there is none. The value at position `p` counts on neither side.

**Idea.** Computing both sums for each position would cost `N` operations per position, so `N²`. Instead, make two passes. The first computes the total `S`. The second goes through the positions keeping `gauche` up to date, the sum of the values already passed; the sum on the right is then `S − gauche − t[i]`, without recomputing anything. As soon as both are equal, it is found: `break`.

**Program.**

```python
n = int(input())
t = list(map(int, input().split()))
total = sum(t)
gauche = 0
reponse = -1
for i in range(n):
    if gauche == total - gauche - t[i]:
        reponse = i + 1
        break
    gauche = gauche + t[i]
print(reponse)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> t(n);
    long long total = 0;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
        total = total + t[i];
    }
    long long gauche = 0;
    int reponse = -1;
    for (int i = 0; i < n; i++) {
        if (gauche == total - gauche - t[i]) {
            reponse = i + 1;
            break;
        }
        gauche = gauche + t[i];
    }
    cout << reponse << "\n";
    return 0;
}
```

**Checking by hand.** With `6` and `1 7 3 6 5 6`, the total is 28. At position 1: left 0, right `28 − 0 − 1 = 27`. Position 2: left 1, right 20. Position 3: left 8, right 17. Position 4: left 11, right `28 − 11 − 6 = 11`: equal, the program prints `4` and leaves the loop. With `2` and `1 2`, you get left 0 against right 2, then left 1 against right 0: the loop ends without `break` and the program prints `-1`. With `1` and `5`, both sides are empty: the answer is `1`.

**Why it is correct.** Invariant: at the start of turn `i`, `gauche` is the sum of `t[0]` to `t[i − 1]`. It holds at the start (empty sum, 0), and the last instruction of the turn adds `t[i]`. The sum on the right is then `total − gauche − t[i]`, since the three parts make up the whole array. The positions are examined in order and the loop stops at the first one that fits: it is indeed the first. **Cost**: two passes, so on the order of `N` operations.

## Key takeaways

- `break` leaves the innermost loop, `continue` goes to the next turn; they replace the condition `while ... and not found` when the stop is decided in the middle of the body.
- A rotation by `k` steps sends index `i` to `(i + k) % n`; only `k % n` matters. Three reversals do it in place.
- In-place transformations use a read index and a write index: one pass, instead of `n²` for repeated removals.
- Merging two sorted arrays takes the smaller of the two heads at each step: `n + m` steps, and the result is sorted.
- A frequency array counts pairs in one pass: first add the partners already seen, then count the value.
- Two passes (one to prepare, one to answer) avoid recomputing for each cell; the stretch with the largest sum is found in one pass with `end[i] = t[i] + max(end[i − 1], 0)`.
