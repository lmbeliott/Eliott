Dynamic programming always rests on the same question: **what do you need to know about the past to decide what comes next?** This chapter presents four kinds of state that keep coming back in contests: a set encoded in bits, an interval, a tree vertex and a prefix of digits.

## Over subsets: a bitmask

When `N` is small (up to about 20), a set of objects is encoded as an integer `m` whose bit `j` is `1` if object `j` is in it. We then replace `N!` orders with `2ᴺ` sets, by noticing that what comes next only depends on the **set** of objects already handled, not on their order.

Example: `N` students and `N` seats, `c[i][j]` is the cost of putting student `j` in seat `i`. We fill the seats in order. If `m` is the set of seated students, the last seat filled is seat `popcount(m) - 1`.

```python
INF = float("inf")
dp = [INF] * (1 << n)
dp[0] = 0
for m in range(1, 1 << n):
    i = bin(m).count("1") - 1          # seat filled last
    for j in range(n):
        if m >> j & 1:
            dp[m] = min(dp[m], dp[m ^ (1 << j)] + c[i][j])
print(dp[(1 << n) - 1])
```

```cpp
vector<long long> dp(1 << n, LLONG_MAX);
dp[0] = 0;
for (int m = 1; m < (1 << n); m++) {
    int i = __builtin_popcount(m) - 1;  // seat filled last
    for (int j = 0; j < n; j++)
        if ((m >> j) & 1) dp[m] = min(dp[m], dp[m ^ (1 << j)] + c[i][j]);
}
cout << dp[(1 << n) - 1] << "\n";
```

The masks `m ^ (1 << j)` are smaller than `m`: going through `m` in increasing order is enough. Cost: O(2ᴺ × N), about 20 million operations for N = 20.

## Over intervals

When the problem is about a sequence and a choice **cuts** the sequence into independent pieces, we compute `f[l][r]` for every interval. A value depends on shorter intervals: we go through `l` from right to left, then `r` from left to right. Example: the longest palindromic subsequence of `s`.

```python
f = [[0] * n for _ in range(n)]
for l in range(n - 1, -1, -1):
    f[l][l] = 1
    for r in range(l + 1, n):
        if s[l] == s[r]:
            f[l][r] = f[l + 1][r - 1] + 2
        else:
            f[l][r] = max(f[l + 1][r], f[l][r - 1])
```

```cpp
vector<vector<int>> f(n, vector<int>(n, 0));
for (int l = n - 1; l >= 0; l--) {
    f[l][l] = 1;
    for (int r = l + 1; r < n; r++) {
        if (s[l] == s[r]) f[l][r] = f[l + 1][r - 1] + 2;
        else f[l][r] = max(f[l + 1][r], f[l][r - 1]);
    }
}
```

There are O(N²) intervals. If each one tries O(N) cut points, the total is O(N³): N ≤ 400 or so.

## On trees

We root the tree and compute, for each vertex, a few values that summarize its subtree. They are combined from those of the children. You must choose these **states** so that the parent has all the useful information, and nothing more: every extra state multiplies the work. Classic example: the maximum-weight independent set (no two neighbours chosen), with `taken[v]` and `not_taken[v]`.

When every vertex `i ≥ 2` has a parent `p[i] < i`, going through `i` from `N` down to `1` handles the children before their parent, without recursion:

```python
taken = w[:]                # w[v]: weight of vertex v
not_taken = [0] * (n + 1)
for v in range(n, 1, -1):
    taken[p[v]] += not_taken[v]
    not_taken[p[v]] += max(taken[v], not_taken[v])
print(max(taken[1], not_taken[1]))
```

```cpp
vector<long long> taken(w), notTaken(n + 1, 0);   // w[v]: weight of vertex v
for (int v = n; v >= 2; v--) {
    taken[p[v]] += notTaken[v];
    notTaken[p[v]] += max(taken[v], notTaken[v]);
}
cout << max(taken[1], notTaken[1]) << "\n";
```

If the constraint is about a larger distance, you need more states: for example, knowing whether a **child** of the vertex is chosen.

## Over digits

To count the integers of `[A, B]` that have a property related to their digits, we compute `count(X)` over `[0, X]`, then `count(B) - count(A - 1)`. We go through the digits of `X` from left to right. As long as we copy `X`, we stay "stuck" to the bound. As soon as we put a smaller digit, the following digits are **free**. The number of free sequences doesn't depend on `X`: we compute it only once.

Example: count the integers of `[0, X]` whose digit sum is a multiple of `K`. `free_[L][r]` counts the sequences of `L` digits with sum `≡ r` modulo `K`.

```python
free_ = [[0] * K for _ in range(20)]
free_[0][0] = 1
for L in range(1, 20):
    for r in range(K):
        free_[L][r] = sum(free_[L - 1][(r - c) % K] for c in range(10))

def count(x):               # integers of [0, x]
    ch = list(map(int, str(x)))
    total, s = 0, 0
    for i, d in enumerate(ch):
        for c in range(d):  # smaller digit: the rest is free
            total += free_[len(ch) - 1 - i][(-(s + c)) % K]
        s += d
    return total + (s % K == 0)   # x itself
```

```cpp
long long freeCount[20][100];   // K ≤ 100
// freeCount[0][0] = 1 ; freeCount[L][r] = sum over c of freeCount[L-1][(r - c) mod K]
long long count(long long x) {  // integers of [0, x]
    string ch = to_string(x);
    int k = ch.size();
    long long total = 0;
    int s = 0;
    for (int i = 0; i < k; i++) {
        int d = ch[i] - '0';
        for (int c = 0; c < d; c++)   // smaller digit: the rest is free
            total += freeCount[k - 1 - i][((-(s + c)) % K + K) % K];
        s += d;
    }
    return total + (s % K == 0);   // x itself
}
```

Here, leading zeros have no effect. When they matter, as with a rule about two neighbouring digits, handle the numbers shorter than `X` separately.

## Key takeaways

- Bitmask: when the past order doesn't matter, `2ᴺ` sets replace `N!` orders. O(2ᴺ × N) for N ≤ 20.
- Intervals: a choice that cuts the sequence into independent pieces gives `f[l][r]`, computed by increasing length or decreasing `l`.
- Trees: a few states per vertex, combined from the children. With `p[i] < i`, a simple loop from `N` down to `1`.
- Digits: stuck to the bound, then free sequences. The free part doesn't depend on the bound: precompute it once.
