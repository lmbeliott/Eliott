Final-round problems almost never ask for a new algorithm. They **combine** two or three already known ones, and the whole difficulty is seeing how to put them together. This chapter gathers the combinations that come up most often, and a few tools that are still missing.

## Search for the answer, then check

When a problem asks for "the greatest value such that…", it is worth checking whether the **reverse** question is simpler: "does this value `x` work?". If the answer is monotone (true up to a threshold, false after), a binary search on `x` finds it with about 30 checks. The check is often a breadth-first search, a greedy or a dynamic program. When the answer must be one of the values in the input, the binary search runs over the sorted list of these values.

## Offline: change the order of the questions

If all the questions are known from the start, nothing forces answering them in order. We **sort** them by the parameter that makes the problem grow, then put the answers back in input order.

- Questions "with the edges of weight ≤ t": by increasing `t`, edges are only ever added, and union-find is enough.
- Questions on intervals `[l, r]`: by increasing `r`, a **sweep** moves forward and a Fenwick tree keeps the useful information for each `l`.

To add a value over a whole interval `[x, y]` and read a single point, we work on the **differences**: `+v` at `x`, `-v` at `y + 1`. The value at `l` is then a prefix sum.

When union-find must also merge sets (colours, values…), we always pour the **smaller into the larger**. A moved element lands in a set at least twice as large, so it only moves `log₂ N` times.

```python
def merge(a, b):               # a and b are different roots
    if len(sets[a]) < len(sets[b]):
        a, b = b, a
    sets[a] |= sets[b]          # pour the small one into the large one
    sets[b] = None
    parent[b] = a
```

```cpp
void merge(int a, int b) {     // a and b are different roots
    if (sets[a].size() < sets[b].size()) swap(a, b);
    for (int x : sets[b]) sets[a].insert(x);   // pour the small one into the large one
    set<int>().swap(sets[b]);
    parent[b] = a;
}
```

## Counting modulo a prime

To count paths or choices, binomial coefficients `C(n, k)` modulo `p = 10⁹ + 7` are needed. We precompute the factorials, then the inverse of the last one with Fermat's little theorem (`x^(p-2)` is the inverse of `x`), and the others going backwards.

```python
P = 10**9 + 7
fact = [1] * (m + 1)
for i in range(1, m + 1):
    fact[i] = fact[i - 1] * i % P
inv = [1] * (m + 1)
inv[m] = pow(fact[m], P - 2, P)
for i in range(m, 0, -1):
    inv[i - 1] = inv[i] * i % P

def binom(n, k):
    return fact[n] * inv[k] % P * inv[n - k] % P if 0 <= k <= n else 0
```

```cpp
const long long P = 1000000007LL;
long long power(long long a, long long e) {
    long long r = 1;
    for (a %= P; e > 0; e >>= 1, a = a * a % P)
        if (e & 1) r = r * a % P;
    return r;
}
// fact[i] = fact[i-1] * i % P ; inv[m] = power(fact[m], P - 2) ; inv[i-1] = inv[i] * i % P
long long binom(int n, int k) {
    if (k < 0 || k > n) return 0;
    return fact[n] * inv[k] % P * inv[n - k] % P;
}
```

To avoid forbidden cells, we sort them and count, for each one, the paths that reach it **without** going through another one first. For each earlier cell `j`, we subtract the paths whose *first* forbidden cell is `j`. Thinking of the **complement** ("at least one" = all − "none") often simplifies the rest.

## Games: Sprague-Grundy

In a two-player game where the player who can't move loses, each position has a **Grundy number**: the smallest non-negative integer (the *mex*) that is not the value of a position reachable in one move. A position is worth `0` exactly when the player to move loses. The key theorem: if the game is made of several **independent** games and each move is played in only one of them, the value of the whole is the **XOR** of the values. This is the rule of the game of Nim.

```python
def mex(values):
    seen = set(values)
    m = 0
    while m in seen:
        m += 1
    return m
```

```cpp
int mex(const vector<int>& values) {
    set<int> seen(values.begin(), values.end());
    int m = 0;
    while (seen.count(m)) m++;
    return m;
}
```

To **count the winning moves**, we look for the moves that bring the total XOR back to `0`.

## Large generated inputs

To keep test files small, some statements describe a pseudo-random generator. It must be copied exactly, following the order of the calls. Computing modulo 2⁶⁴ is automatic in C++ with `unsigned long long`. In Python, the remainder (`% 2**64`) must be taken at each step.

## Key takeaways

- Binary search on the answer: turns "find the best" into "check a value".
- Offline: sort the questions so that data is only ever added (union-find, sweep + Fenwick).
- Union-find with sets: always small into large, O(N log N).
- Combinatorics modulo p: factorials, inverse by Fermat, complement and "first forbidden cell".
- Games: mex, XOR of independent games, and a winning move brings the XOR back to `0`.
