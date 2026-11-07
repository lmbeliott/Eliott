To find a word in a paper dictionary, nobody reads the pages one by one: you open it in the middle, check whether the word comes before or after, and start again in the remaining half. After about twenty tries, a single page is left, even in a dictionary of a million words. This is **binary search** (in French, *recherche dichotomique*, from the Greek *dikhotomia*, "cutting in two").

This chapter studies it precisely, because it is as easy to explain as it is easy to get wrong by one. We first look at searching in a sorted array, with its invariant, termination and cost; then at the ready-made functions of Python and C++; then at the most fruitful idea of the chapter: **searching for the answer** of a problem by binary search, on integers up to 10¹⁸ or on real numbers.

## Searching a sorted array

We have an array `t` of `n` integers sorted in increasing order, and a value `x`. Scanning the array costs `n` comparisons. If we compare `x` with the middle cell, a single comparison eliminates half of the array: if `t[mid] < x`, all the cells up to `mid` are too small, since the array is sorted; otherwise, all the cells from `mid` on are at least `x`.

Rather than looking for "a cell equal to `x`", a question with zero, one or several answers, we look for **the first index `i` such that `t[i] ≥ x`**. This question always has a unique answer, possibly `n` if every value is smaller than `x`. We keep two indices `lo` and `hi` with the **invariant**:

- every cell with index at most `lo` is **strictly smaller** than `x`;
- every cell with index at least `hi` is **at least** `x`.

At the start, `lo = −1` and `hi = n`: both indices are outside the array, and the invariant talks about no cell at all, so it holds. You can picture `t[−1] = −∞` and `t[n] = +∞`, but the program never reads these cells.

```python
def premier_au_moins(t, x):
    # t is sorted; smallest index i such that t[i] >= x, or len(t) if there is none
    lo, hi = -1, len(t)
    # invariant: t[i] < x for i <= lo, and t[i] >= x for i >= hi
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if t[mid] < x:
            lo = mid
        else:
            hi = mid
    return hi

t = [2, 3, 5, 5, 5, 8, 13, 21]
print(premier_au_moins(t, 5), premier_au_moins(t, 6), premier_au_moins(t, 1), premier_au_moins(t, 30))
i = premier_au_moins(t, 8)
print(i < len(t) and t[i] == 8)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

// t is sorted; smallest index i such that t[i] >= x, or t.size() if there is none
int premierAuMoins(const vector<int>& t, int x) {
    int lo = -1, hi = t.size();
    // invariant: t[i] < x for i <= lo, and t[i] >= x for i >= hi
    while (hi - lo > 1) {
        int mid = lo + (hi - lo) / 2;
        if (t[mid] < x) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return hi;
}

int main() {
    vector<int> t = {2, 3, 5, 5, 5, 8, 13, 21};
    cout << premierAuMoins(t, 5) << " " << premierAuMoins(t, 6) << " "
         << premierAuMoins(t, 1) << " " << premierAuMoins(t, 30) << "\n";
    int i = premierAuMoins(t, 8);
    cout << (i < (int) t.size() && t[i] == 8 ? "True" : "False") << "\n";
    return 0;
}
```

The program prints `2 5 0 8`, then `True`. The first 5 is at index 2; the first value at least 6 is the 8, at index 5; every value is at least 1, hence 0; none reaches 30, hence 8, the length of the array. To know whether `x` is **present**, we then check that `i < n` and `t[i] == x`.

## Correctness, termination and cost

**Preservation.** While `hi − lo > 1`, the index `mid` is strictly between `lo` and `hi`, so it is a real cell of the array. If `t[mid] < x`, every cell with index at most `mid` is at most `t[mid]`, since the array is sorted, hence strictly smaller than `x`: we can set `lo = mid` without breaking the invariant. Otherwise, `t[mid] ≥ x`, and so are all the following cells: we set `hi = mid`.

**Conclusion.** On exit, `hi = lo + 1`. All the cells before `hi` are smaller than `x`, and `t[hi] ≥ x` if `hi < n`: `hi` is indeed the first index where `t[i] ≥ x`.

**Termination.** The quantity `hi − lo` is a variant: it is an integer, and since `lo < mid < hi`, each turn makes it strictly smaller.

**Cost.** Each turn replaces the interval by one of its two halves, of length at most `⌈(hi − lo) / 2⌉`. Starting from `n + 1`, it takes about `log₂(n)` turns to reach 1: 20 turns for a million cells, 60 for 10¹⁸. Binary search is in **O(log n)**, against O(n) for a scan. Beware: the array must be **sorted**. Sorting costs O(n log n); it is worth it as soon as we make many searches in the same array.

## Off-by-one traps

Binary search is famous for its bugs. The program below looks for the last cell at most `x`, with another convention: `lo` and `hi` are both possible cells, and the loop runs while `lo < hi`.

```python
def dernier_au_plus(t, x):
    lo, hi = 0, len(t) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if t[mid] <= x:
            lo = mid           # bug: when hi = lo + 1, mid = lo and nothing changes
        else:
            hi = mid - 1
    return lo

print(dernier_au_plus([2, 3, 5, 8], 5))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int dernierAuPlus(const vector<int>& t, int x) {
    int lo = 0, hi = t.size() - 1;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (t[mid] <= x) {
            lo = mid;          // bug: when hi = lo + 1, mid = lo and nothing changes
        } else {
            hi = mid - 1;
        }
    }
    return lo;
}

int main() {
    cout << dernierAuPlus({2, 3, 5, 8}, 5) << "\n";
    return 0;
}
```

This program prints nothing and never stops. After two turns, `lo = 2` and `hi = 3`; then `mid = 2`, `t[2] = 5 ≤ 5`, and we set `lo = 2` again: the variant `hi − lo` no longer decreases. The cure is not to try `mid + 1` at random, but to choose a convention and prove it. With the convention of this chapter (`lo` and `hi` on either side of the boundary, loop while `hi − lo > 1`), `mid` is always strictly between them, and termination is guaranteed.

Two other classic traps:

- **Overflow of the middle.** In C++, with `int`s close to 2³¹, the sum `lo + hi` exceeds the capacity. Write `lo + (hi − lo) / 2`, which gives the same result without overflowing. Python does not have this problem.
- **Starting bounds.** The invariant must hold at the start. If you start from `hi = n − 1` instead of `n`, you claim that the last cell is at least `x`, which may be false: the program then returns `n − 1` for a value larger than all the others.

## The functions of Python and C++

Both languages provide these searches. In Python, the `bisect` module contains `bisect_left(t, x)`, the first index `i` such that `t[i] ≥ x`, and `bisect_right(t, x)`, the first index such that `t[i] > x`. In C++, `lower_bound` and `upper_bound` (in `<algorithm>`) do the same and return an iterator, from which we subtract `t.begin()` to get the index.

```python
from bisect import bisect_left, bisect_right

t = [2, 3, 5, 5, 5, 8, 13, 21]
print(bisect_left(t, 5), bisect_right(t, 5))
print(bisect_right(t, 5) - bisect_left(t, 5))     # occurrences of 5
print(bisect_right(t, 13) - bisect_left(t, 4))    # values between 4 and 13
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {2, 3, 5, 5, 5, 8, 13, 21};
    int g = lower_bound(t.begin(), t.end(), 5) - t.begin();
    int d = upper_bound(t.begin(), t.end(), 5) - t.begin();
    cout << g << " " << d << "\n";
    cout << d - g << "\n";                                     // occurrences of 5
    cout << (upper_bound(t.begin(), t.end(), 13) - lower_bound(t.begin(), t.end(), 4)) << "\n";
    return 0;
}
```

The program prints `2 5`, then `3`, then `5`. The occurrences of 5 occupy indices 2, 3 and 4: from `bisect_left` included to `bisect_right` excluded. Likewise, the number of values between `a` and `b` (included) is `bisect_right(t, b) − bisect_left(t, a)`: here 5, 5, 5, 8 and 13. Each query costs O(log n): after one sort, we answer thousands of "how many values in this interval?" questions almost for free.

## Searching for the answer

Binary search is not only for arrays. A **predicate** is a property `P(x)` of an integer `x`, true or false. It is **monotone** if it is false up to some value, then true afterwards (or the reverse): as soon as `P(x)` is true, so is `P(x + 1)`. The sorted array of the previous section is a special case, with `P(i)`: "`t[i] ≥ x`".

For a monotone predicate, we find the **boundary** exactly as in an array: choose `lo` such that `P(lo)` is false and `hi` such that `P(hi)` is true, and keep this invariant while testing the middle. After about `log₂(hi − lo)` tests, `hi` is the smallest value where `P` is true. There is no array at all: the "array" is the sequence of answers of `P`, computed only at the tested points.

Many optimisation problems are solved this way. "What is the smallest length…", "the largest number…": instead of computing the optimum directly, we ask "is the value `x` **possible**?". This question is often much easier, and if possibility is monotone in `x`, a binary search finds the optimum, adding only a `log` factor to the cost of the test. This technique is called **searching for the answer** (or binary search on the answer). Before applying it, you must **prove monotonicity**, and choose bounds you are sure of: a value certainly impossible and a value certainly possible.

## Integers up to 10¹⁸

The search interval can be huge: 60 tests are enough for 10¹⁸ values. The danger lies elsewhere, in computing the predicate. Take the **integer square root** of `n`, the largest integer `r` such that `r² ≤ n`. The predicate "`r² ≤ n`" is true then false, and the answer is at most 10⁹ for `n ≤ 10¹⁸`.

```python
from math import sqrt

def racine_carree(n):
    lo, hi = 0, 10**9 + 1          # invariant: lo × lo <= n < hi × hi
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if mid * mid <= n:
            lo = mid
        else:
            hi = mid
    return lo

n = 10**18 - 1
print(racine_carree(n), int(sqrt(n)))
```

```cpp
#include <cmath>
#include <iostream>
using namespace std;

long long racineCarree(long long n) {
    long long lo = 0, hi = 1000000001;   // invariant: lo × lo <= n < hi × hi
    while (hi - lo > 1) {
        long long mid = lo + (hi - lo) / 2;
        if (mid <= n / mid) {            // mid × mid <= n, without computing mid × mid
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return lo;
}

int main() {
    long long n = 999999999999999999LL;
    cout << racineCarree(n) << " " << (long long) sqrt((double) n) << "\n";
    return 0;
}
```

The program prints `999999999 1000000000`. The binary search gives the right answer; the `sqrt` function is off by one, because a floating-point number has only 53 bits of precision, about 16 digits, and 10¹⁸ − 1 is rounded to 10¹⁸ before the computation even starts. For integers, do not trust floating point.

In C++, the test `mid × mid <= n` would overflow for `mid` close to 10⁹ + 1 if `n` were larger; the equivalent test `mid <= n / mid` (for `mid ≥ 1`) never overflows. For a cube root or a K-th root, compute the power factor by factor and stop as soon as it exceeds `n`, checking **before** each multiplication that `p ≤ n / mid`.

## On real numbers

The same principle finds an approximate solution of an equation `f(x) = c` when `f` is increasing. Let us look for the real `x` such that `x³ + x = 5`. The function is increasing, is 0 at 0 and 130 at 5: the solution is between 0 and 5.

```python
lo, hi = 0.0, 5.0                  # f(lo) < 5 <= f(hi), with f(x) = x³ + x
for _ in range(100):
    mid = (lo + hi) / 2
    if mid ** 3 + mid < 5:
        lo = mid
    else:
        hi = mid
print(f"{lo:.6f}")
```

```cpp
#include <cstdio>

int main() {
    double lo = 0.0, hi = 5.0;     // f(lo) < 5 <= f(hi), with f(x) = x³ + x
    for (int i = 0; i < 100; i++) {
        double mid = (lo + hi) / 2;
        if (mid * mid * mid + mid < 5) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    printf("%.6f\n", lo);
    return 0;
}
```

The program prints `1.515980`. After `k` turns, the solution lies in an interval of length `5 / 2^k`: 100 turns give a precision far better than that of floating-point numbers themselves. We fix the **number of turns** rather than writing `while hi - lo > 1e-9`. With values close to 10⁹, two neighbouring floating-point numbers are about 10⁻⁷ apart: the gap `hi − lo` can never go below 10⁻⁹, the computed middle falls back on `lo` or `hi`, and the loop runs forever without printing anything.

## Common mistakes

**An infinite loop.** The middle falls back on a bound that does not move, as in `dernier_au_plus`. Keep the convention `while hi - lo > 1` with `lo = mid` or `hi = mid`, which always makes `hi − lo` decrease.

**A predicate that is not monotone.** Binary search then finds "a" boundary, not necessarily the right one, and the program is wrong without any message. Prove monotonicity before coding, and compare with a naive solution on small cases.

**A bound that breaks the invariant.** If `hi` is not certainly possible, the returned answer may be `hi` while no value works. Choose wide and safe bounds: searching between 0 and 2 × 10¹⁸ only costs a few more turns.

**Overflow.** `(lo + hi) / 2` with `int`s, `mid * mid`, or a sum of N values in an `int`: in C++, the result becomes wrong or negative, without any error. Use `long long`, test before multiplying, and stop a sum as soon as it exceeds the threshold.

**An unsorted array.** `bisect_left` on an unsorted list returns a meaningless index. Sort first.

## A complete example

**Statement.** We have N bags of sweets; bag i contains aᵢ sweets. We want to give **the same number** x of sweets to each of K children, each child receiving all their sweets from a single bag (a bag can serve several children, and sweets may be left over). What is the largest possible value of x? Print 0 if it is impossible.

**Idea.** For a given x, bag i can serve ⌊aᵢ / x⌋ children, so x is possible if and only if the sum of the ⌊aᵢ / x⌋ is at least K. When x grows, each ⌊aᵢ / x⌋ decreases or stays equal: if x is possible, every smaller value is too. We look for the last possible value, with `lo` possible and `hi` impossible. We agree that 0 is possible (it is the "impossible" answer); max(aᵢ) + 1 is impossible, since no bag can then serve a child.

```python
n, k = map(int, input().split())
sacs = list(map(int, input().split()))

def possible(x):
    # can we serve k children with x sweets each?
    enfants = 0
    for a in sacs:
        enfants += a // x
    return enfants >= k

lo, hi = 0, max(sacs) + 1          # invariant: lo possible (0 by convention), hi impossible
while hi - lo > 1:
    mid = (lo + hi) // 2
    if possible(mid):
        lo = mid
    else:
        hi = mid
print(lo)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int n;
long long k;
vector<long long> sacs;

// can we serve k children with x sweets each?
bool possible(long long x) {
    long long enfants = 0;
    for (long long a : sacs) {
        enfants += a / x;
    }
    return enfants >= k;
}

int main() {
    cin >> n >> k;
    sacs.resize(n);
    long long hi = 0;
    for (int i = 0; i < n; i++) {
        cin >> sacs[i];
        if (sacs[i] + 1 > hi) {
            hi = sacs[i] + 1;
        }
    }
    long long lo = 0;              // invariant: lo possible (0 by convention), hi impossible
    while (hi - lo > 1) {
        long long mid = lo + (hi - lo) / 2;
        if (possible(mid)) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    cout << lo << "\n";
    return 0;
}
```

**Checking by hand.** With the bags `10 6 15` and K = 7. For x = 4: 2 + 1 + 3 = 6 children, not enough. For x = 3: 3 + 2 + 5 = 10 children, it is possible. The answer is 3, and the program prints `3`. With K = 40, even x = 1 serves only 31 children: `lo` stays at 0 and the program prints `0`.

**Cost.** Each test goes through the N bags, and the binary search makes about log₂(max aᵢ) tests: O(N log(max aᵢ)), that is 30 × N operations for bags of 10⁹ sweets. Trying every value of x one by one would cost up to 10⁹ × N operations.

## Key takeaways

- Binary search keeps two indices `lo` and `hi` on either side of a boundary (invariant), tests the middle and moves one bound: `while hi - lo > 1`, then `lo = mid` or `hi = mid`. It terminates because `hi − lo` strictly decreases, in O(log n) turns.
- Look for a boundary ("first index where `t[i] ≥ x`"), not for a value: the question always has an answer, and duplicates cause no trouble.
- `bisect_left`/`bisect_right` in Python, `lower_bound`/`upper_bound` in C++; their difference counts occurrences, and `bisect_right(t, b) − bisect_left(t, a)` counts the values between `a` and `b`.
- Searching for the answer: if "the value x is possible" is monotone in x, a binary search finds the optimum; prove monotonicity and choose safe bounds.
- On large integers, no floating point, and no overflowing product: test `p > n / mid` before multiplying. On reals, fix the number of turns (100 is enough).
