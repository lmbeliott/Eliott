Two programs can give the same answer and not be worth the same. To count the pairs of equal values in a list of 100,000 numbers, comparing every pair takes about 5 billion comparisons: several minutes in Python. Sorting the list, then counting the blocks of equal values, takes a few million operations: a fraction of a second. On a practice site as in a contest, the first program gets the verdict "time limit exceeded", even though it is correct.

This chapter teaches you to **predict** the running time of a program before writing it: count its operations, summarize them with O notation, compare the result with the constraints of the statement, and choose accordingly which algorithm to program.

## Counting operations

The time of a program is not measured in seconds, since it depends on the machine and the language. Instead, count its **elementary operations**: an assignment, a comparison, an arithmetic operation, access to a cell of a list. Each takes roughly constant time. What matters is how their number grows with the size n of the data.

```python
n = 1000
t = [i % 7 for i in range(n)]
comparisons = 0
pairs = 0
for i in range(n):
    for j in range(i + 1, n):
        comparisons = comparisons + 1
        if t[i] == t[j]:
            pairs = pairs + 1
print(comparisons, pairs)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n = 1000;
    vector<int> t(n);
    for (int i = 0; i < n; i++) t[i] = i % 7;
    long long comparisons = 0, pairs = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            comparisons++;
            if (t[i] == t[j]) pairs++;
        }
    }
    cout << comparisons << " " << pairs << "\n";
    return 0;
}
```

The program prints `499500 70929`. For a fixed i, the inner loop makes n − 1 − i iterations; the total is (n − 1) + (n − 2) + … + 1 + 0 = n(n − 1)/2. If n is multiplied by 10, this number is multiplied by about 100. This **growth** is what we want to describe.

## O notation

The exact number of operations is often complicated, and depends on unimportant details (one assignment more or less). It is summarized by its order of magnitude.

**Definition.** Let f and g be two functions of the integer n, with positive values. We say that f(n) is **big O of g(n)**, and write f(n) = O(g(n)), if there exist a constant c > 0 and an integer n₀ such that f(n) ≤ c × g(n) for every n ≥ n₀. In other words, from some size on, f does not grow faster than g, up to a constant factor.

A few examples:

- 3n + 5 = O(n): for n ≥ 5, 3n + 5 ≤ 3n + n = 4n. Take c = 4 and n₀ = 5.
- n(n − 1)/2 = O(n²): for every n ≥ 1, n(n − 1)/2 ≤ n²/2. Take c = 1/2.
- 2n² + 100n + 7 = O(n²): for n ≥ 100, 100n ≤ n² and 7 ≤ n², so the whole is at most 4n².
- 1,000 = O(1): a quantity bounded by a constant is O(1).

In practice, keep the fastest-growing term and forget the multiplicative constants. An algorithm is said to be **in O(n²)**, or to have a **complexity** of O(n²), if its number of operations is O(n²). The notation gives an upper bound: it is true that n = O(n²), but imprecise; always look for the smallest possible bound.

Two rules are enough most of the time. Steps **in sequence** add up, and the most expensive one wins: O(n) then O(n²) gives O(n²). **Nested** loops multiply: n iterations each doing O(n) work give O(n²).

## Common classes

| Complexity | Name | Example |
| --- | --- | --- |
| O(1) | constant | formula n(n + 1)/2, access to `t[i]` |
| O(log n) | logarithmic | number of digits of n, Euclid's algorithm |
| O(n) | linear | sum, maximum, prefix sums |
| O(n log n) | quasi-linear | sorting a list |
| O(n²) | quadratic | examining every pair, simple sorts |
| O(2^n) | exponential | examining every subset |

The **logarithm** deserves an explanation. log₂(n) is roughly the number of times n can be halved before reaching 1. It grows extremely slowly: log₂(1,000) ≈ 10, log₂(10⁶) ≈ 20, log₂(10¹⁸) ≈ 60. A loop that divides its variable by 2 (or by 10) at each iteration is O(log n). The base of the logarithm does not matter inside an O, since going from one base to another multiplies by a constant.

```python
n = 1000000
steps = 0
while n > 1:
    n = n // 2
    steps = steps + 1
print(steps)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    long long n = 1000000;
    int steps = 0;
    while (n > 1) {
        n = n / 2;
        steps++;
    }
    cout << steps << "\n";
    return 0;
}
```

The program prints `19`, since 2¹⁹ = 524,288 ≤ 10⁶ < 2²⁰.

The built-in sort (`sort` in Python and in C++) is O(n log n). Simple sorts, by selection or insertion, are O(n²); the difference shows quickly: for n = 10⁵, n log₂ n ≈ 1.7 × 10⁶, while n² = 10¹⁰.

## Estimating the running time

To go from a number of operations to a time, remember an order of magnitude: a C++ program performs on the order of **10⁸ simple operations per second** (between 10⁷ and 10⁹ depending on the operations), and Python **about 10⁷**, that is 10 to 50 times fewer. Python running in a browser is another 2 to 3 times slower. This gives the largest data size that can be handled in about one second:

| Complexity | Max n in C++ | Max n in Python |
| --- | --- | --- |
| O(log n) or O(1) | no practical limit | no practical limit |
| O(n) | 10⁸ | 10⁷ |
| O(n log n) | 5 × 10⁶ | 5 × 10⁵ |
| O(n²) | 10⁴ | 3 × 10³ |
| O(n³) | 500 | 200 |
| O(2^n) | 25 | 20 |
| O(n!) | 11 | 9 |

This table can also be read the other way round, and that is the most useful: **the constraints of the statement indicate the expected complexity**. If N ≤ 20, exploring every subset is probably the solution. If N ≤ 2,000, an O(N²) algorithm passes. If N ≤ 200,000, you need O(N log N) or O(N). If N ≤ 10¹², you need O(√N), O(log N), or a formula. Before writing a line, estimate the number of operations of your idea by replacing N with its maximum value.

## Worst case and average case

The number of operations sometimes depends on the data themselves, not only on their size. Searching for a value in a list by scanning it stops as soon as it is found: a single comparison if it is at the front (the **best case**), n if it is absent (the **worst case**), and about n/2 on average if it is present at a random position (the **average case**). Insertion sort makes about n²/2 shifts on a list sorted in reverse, but none on a list already sorted.

Unless stated otherwise, the complexity of an algorithm means its **worst case**. It is the only useful guarantee: the tests of an exercise always contain the most unfavourable data, built on purpose. A notable exception: the test `x in a_set` (and access to a dictionary) is O(1) **on average**, thanks to hashing, while `x in a_list` is O(n). That is why replacing a list with a set often changes everything.

## Amortized cost

A loop inside another loop is not always O(n²). Here is the search for the longest portion with sum at most S in a list of positive numbers, using the sliding window method:

```python
t = [2, 1, 3, 2, 4, 1, 1, 1]
S = 6
left = 0
total = 0
best = 0
moves = 0
for right in range(len(t)):
    total = total + t[right]
    while total > S:
        total = total - t[left]
        left = left + 1
        moves = moves + 1
    best = max(best, right - left + 1)
print(best, moves)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {2, 1, 3, 2, 4, 1, 1, 1};
    int S = 6;
    int left = 0, total = 0, best = 0, moves = 0;
    for (int right = 0; right < (int)t.size(); right++) {
        total += t[right];
        while (total > S) {
            total -= t[left];
            left++;
            moves++;
        }
        best = max(best, right - left + 1);
    }
    cout << best << " " << moves << "\n";
    return 0;
}
```

The program prints `3 5`. One iteration of the `while` loop can move `left` forward by several cells, but `left` never moves back and does not exceed n: over the **whole** execution, the inner loop makes at most n iterations in total. The program is O(n). This is called **amortized cost**: a single step can be expensive, but the total, spread over the n steps, stays small. The same reasoning applies to a stack where each element is pushed once and popped at most once, or to `append` on a Python list, which sometimes copies the whole list to enlarge it but whose amortized cost stays O(1) per append: over a sequence of n appends, the copies add up to O(n).

## Common mistakes

**Time limit exceeded.** The verdict "time limit exceeded" (TLE) does not signal a programming error: the program is too slow on the largest tests. Speeding up a few lines is useless; you must change the algorithm, after recomputing the number of operations with the maximum values.

**Hidden costs.** Some one-line instructions hide a loop. In Python: `x in a_list`, `a_list.index(x)`, `a_list.count(x)`, `min(a_list)`, `sum(a_list)`, a slice `t[a:b]`, `a_list.insert(0, x)` and `a_list.pop(0)` cost O(n). Written inside a loop of n iterations, they give O(n²). In C++, passing a `vector` to a function without `&` copies it entirely at every call. For a queue, use `deque`, and for membership tests, a set.

**Slow input.** Reading 10⁵ lines with `input()` is still fine, but for several hundred thousand numbers, `sys.stdin.read().split()` is much faster. In C++, add `ios::sync_with_stdio(false);` and `cin.tie(nullptr);` at the start of `main`.

**Forgetting overflows.** A fast algorithm often handles large totals: counting pairs among 10⁵ elements gives up to 5 × 10⁹, beyond the limit of an `int` (about 2.1 × 10⁹). In C++, the result becomes wrong without any message. Use `long long`.

## Complete example: the sum of divisor sums

**Statement.** Let σ(m) be the sum of all the divisors of m; for example σ(6) = 1 + 2 + 3 + 6 = 12. The program reads N (1 ≤ N ≤ 10⁶) and prints σ(1) + σ(2) + … + σ(N).

**First idea: each number separately.** For each m, look for its divisors by trying every d up to √m, adding d and m/d when d divides m (only once if d × d = m). This is O(√m) per number, so O(N√N) in total: about 10⁹ operations for N = 10⁶. Too slow, even in C++.

**Second idea: start from the divisors.** Rather than looking for the divisors of each number, start from each d and add it to all its multiples: `s[d] += d`, `s[2d] += d`, `s[3d] += d`… For a given d there are ⌊N/d⌋ multiples, so the total number of additions is N/1 + N/2 + … + N/N = N × (1 + 1/2 + … + 1/N). The sum H(N) = 1 + 1/2 + … + 1/N is called the **harmonic series**. Bound it by grouping its terms into packets: 1/2 + 1/3 ≤ 2 × 1/2 = 1, then 1/4 + 1/5 + 1/6 + 1/7 ≤ 4 × 1/4 = 1, then the eight terms from 1/8 to 1/15, at most 1/8 each, and so on. Each packet is at most 1, and there are at most log₂(N) packets after the first term: H(N) ≤ 1 + log₂(N). More precisely, H(N) is close to ln(N) + 0.58, about 14.4 for N = 10⁶. This method therefore costs O(N log N), that is 1.4 × 10⁷ additions: very good in C++, but several seconds in Python.

**Third idea: swap the order of the sum.** We do not need each σ(m), only their total. The second idea shows that the divisor d is added exactly ⌊N/d⌋ times. So the answer is d × ⌊N/d⌋, summed for d from 1 to N: a single loop, in O(N).

```python
n = int(input())
total = 0
for d in range(1, n + 1):
    total = total + d * (n // d)    # d divides exactly n // d integers between 1 and n
print(total)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    long long total = 0;
    for (long long d = 1; d <= n; d++) {
        total += d * (n / d);    // d divides exactly n / d integers between 1 and n
    }
    cout << total << "\n";
    return 0;
}
```

**Checking by hand.** For N = 4: σ(1) + σ(2) + σ(3) + σ(4) = 1 + 3 + 4 + 7 = 15. The formula gives 1 × 4 + 2 × 2 + 3 × 1 + 4 × 1 = 4 + 4 + 3 + 4 = 15. With the input `1000000`, the program prints `822468118437`.

**Correctness.** The total σ(1) + … + σ(N) is the sum of d over all pairs (d, m) such that d divides m and 1 ≤ m ≤ N. Grouping these pairs by d instead of grouping them by m, we count, for each d, its multiples between 1 and N: there are ⌊N/d⌋ of them. Both groupings add up the same terms, so they give the same total.

**Complexity.** N loop iterations, O(N): 10⁶ iterations, instant in C++ and fast in Python. The total exceeds 2³¹ from N ≈ 51,000: `long long` in C++. We went from O(N√N) to O(N log N), then to O(N), without changing anything in the problem, only in the way of counting. This is the approach of the whole chapter: estimate the cost of an idea with the constraints, and look for a better way of counting as long as it is too high.

**What if N were 10¹²?** Even O(N) would be too slow. One last remark often helps with this kind of sum: if d × q ≤ N, the smaller of the two numbers d and q is at most √N, otherwise their product would exceed N. Splitting the terms according to whether d or q is small gives loops of only √N iterations, that is 10⁶ for N = 10¹². This **split around √N** comes back in the exercises.

## Key takeaways

- The efficiency of an algorithm is measured by the number of elementary operations as a function of the size n of the data, in the **worst case**.
- f(n) = O(g(n)) if there exist c > 0 and n₀ such that f(n) ≤ c × g(n) for n ≥ n₀: keep the dominant term and forget the constants. Successive steps: keep the most expensive one; nested loops: multiply.
- Common classes, from fastest to slowest: O(1), O(log n), O(n), O(n log n), O(n²), O(2^n).
- Order of magnitude: 10⁸ simple operations per second in C++, 10⁷ in Python. The constraints of the statement indicate the expected complexity: N ≤ 20 for O(2^N), N ≤ 10⁴ for O(N²), N ≤ 10⁶ for O(N log N).
- An inner loop is not necessarily a factor of n: if an index only moves forward, the **amortized** cost is linear.
- To speed up, change the way of counting: start from each divisor to reach its multiples, count the contribution of each element, swap the order of a sum; going through the multiples of each d costs O(N log N) (harmonic series), and the split around √N gives O(√N).
