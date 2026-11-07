Prefix sums give the sum of `a[l..r]` in O(1)… as long as the array doesn't change: a single modification forces you to recompute everything, in O(N). The structures in this chapter do both operations, modify and query, in **O(log N)**. They rely on binary representation: let's start there.

## Bitwise operations

The operators `&` (and), `|` (or), `^` (exclusive or), `<<` and `>>` (shifts) work bit by bit, in Python as in C++.

- `1 << p` equals 2ᵖ: only bit `p` is `1`.
- `(x >> p) & 1` reads bit `p` of `x`.
- `x | (1 << p)` sets bit `p` to `1`; `x ^ (1 << p)` flips it.
- `x & -x` isolates the lowest bit set to `1`: `12 & -12 = 4`, because `12 = 1100` in binary.

An integer can encode a **set** of elements numbered from `0` to `k - 1`: element `p` is present if bit `p` is `1`. This is called a **mask**. Then `a & b` is the intersection, `a | b` the union, and `(a & b) == a` tests whether `a` is included in `b`. Keep the parentheses: in C++, `==` has higher precedence than `&`, `|` and `^`, so `a & b == a` reads as `a & (b == a)`. Going through all the sets means going through the integers from `0` to `2ᵏ - 1`.

```python
k = 3
for m in range(1 << k):
    elements = [p for p in range(k) if (m >> p) & 1]
    print(m, elements)
```

```cpp
int k = 3;
for (int m = 0; m < (1 << k); m++) {
    cout << m << " :";
    for (int p = 0; p < k; p++)
        if ((m >> p) & 1) cout << " " << p;
    cout << "\n";
}
```

To go through the **subsets** of a mask `b`, start from `a = b` and do `a = (a - 1) & b` until `0`, without forgetting `0` itself. To get, for **every** mask `m`, the sum of a value `c[a]` over all the `a` included in `m`, there is something faster than enumerating: the **sum over subsets** handles the bits one by one, in O(k × 2ᵏ).

```python
S = c[:]                         # c[a]: value of mask a
for b in range(k):
    for m in range(1 << k):
        if m & (1 << b):
            S[m] += S[m ^ (1 << b)]
# S[m] = sum of c[a] for a included in m
```

```cpp
vector<long long> S = c;         // c[a]: value of mask a
for (int b = 0; b < k; b++)
    for (int m = 0; m < (1 << k); m++)
        if (m & (1 << b)) S[m] += S[m ^ (1 << b)];
// S[m] = sum of c[a] for a included in m
```

## The Fenwick tree

A Fenwick tree stores, in cell `i` (numbered from `1`), the sum of the last `i & -i` values up to `i`. For a prefix sum, we remove the lowest bit of `i` until we reach `0`; for a modification, we add it until we go past `N`. Each loop runs at most log₂ N times.

```python
tree = [0] * (n + 1)

def add(i, x):           # a[i] += x
    while i <= n:
        tree[i] += x
        i += i & -i

def prefix_sum(i):       # a[1] + ... + a[i]
    s = 0
    while i > 0:
        s += tree[i]
        i -= i & -i
    return s
```

```cpp
vector<long long> tree(n + 1, 0);

void add(int i, long long x) {      // a[i] += x
    for (; i <= n; i += i & -i) tree[i] += x;
}

long long prefixSum(int i) {        // a[1] + ... + a[i]
    long long s = 0;
    for (; i > 0; i -= i & -i) s += tree[i];
    return s;
}
```

The sum of `a[l..r]` is `prefix_sum(r) - prefix_sum(l - 1)` (`prefixSum` in C++). A Fenwick tree over the **values** (cell `v` = how many `v` have been seen so far) quickly counts the elements already seen that are smaller than `v`.

## The segment tree

A Fenwick tree can do sums, but not a **maximum** with arbitrary modifications. A segment tree accepts any associative operation (sum, minimum, maximum…). We take a size `T`, a power of two at least equal to `N`. The leaves are at indices `T` to `2T - 1`, node `k` has children `2k` and `2k + 1` and holds the maximum of their two values. The root is node `1`.

```python
T = 1
while T < n:
    T *= 2
tree = [0] * (2 * T)        # tree[T + i] = a[i], i counted from 0
for i in range(n):
    tree[T + i] = a[i]
for k in range(T - 1, 0, -1):   # build, from the leaves up to the root
    tree[k] = max(tree[2 * k], tree[2 * k + 1])

def update(i, v):
    k = T + i
    tree[k] = v
    while k > 1:
        k //= 2
        tree[k] = max(tree[2 * k], tree[2 * k + 1])

def range_max(l, r):        # max of a[l..r-1], values >= 0
    res = 0
    l, r = l + T, r + T
    while l < r:
        if l % 2 == 1:
            res = max(res, tree[l])
            l += 1
        if r % 2 == 1:
            r -= 1
            res = max(res, tree[r])
        l, r = l // 2, r // 2
    return res
```

```cpp
int T = 1;
vector<int> tree;

void build(const vector<int>& a) {   // tree[T + i] = a[i], i counted from 0
    int n = a.size();
    while (T < n) T *= 2;
    tree.assign(2 * T, 0);
    for (int i = 0; i < n; i++) tree[T + i] = a[i];
    for (int k = T - 1; k >= 1; k--) tree[k] = max(tree[2 * k], tree[2 * k + 1]);
}

void update(int i, int v) {
    int k = T + i;
    tree[k] = v;
    for (k /= 2; k >= 1; k /= 2) tree[k] = max(tree[2 * k], tree[2 * k + 1]);
}

int rangeMax(int l, int r) {   // max of a[l..r-1], values >= 0
    int res = 0;
    for (l += T, r += T; l < r; l /= 2, r /= 2) {
        if (l % 2 == 1) res = max(res, tree[l++]);
        if (r % 2 == 1) res = max(res, tree[--r]);
    }
    return res;
}
```

The query uses at most two nodes per level. A node's maximum also lets you **discard** a whole block in one go, which makes it possible to find the first element that is large enough by going down the tree.

## Key takeaways

- `1 << p`, `(x >> p) & 1` and `x & -x` are the basic moves on bits; a mask encodes a set. In C++, use parentheses: `(a & b) == a`.
- The sum over subsets computes, for all masks at once, a sum over their subsets in O(k × 2ᵏ).
- Fenwick tree: modification and prefix sum in O(log N), by adding or removing `i & -i`.
- Segment tree: any associative operation, modification and query in O(log N).
