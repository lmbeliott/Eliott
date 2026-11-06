How many ways are there to climb a staircase of `N` steps, going up `1` or `2` steps at a time? A recursive function that tries every choice recomputes the same questions billions of times. **Dynamic programming** (DP) computes each subproblem **only once** and stores its result in an array.

## The three questions to ask

1. **The state**: which subproblem does `dp[i]` stand for? For example "the number of ways to arrive on step `i`".
2. **The transition**: how is `dp[i]` obtained from smaller subproblems? We often look at the **last decision**: the last move came from step `i - 1` or `i - 2`.
3. **The base cases and the order**: `dp[0] = 1`, then we fill the array in an order where each cell only depends on cells already computed.

```python
MOD = 1_000_000_007
dp = [0] * (n + 1)
dp[0] = 1
for i in range(1, n + 1):
    dp[i] = dp[i - 1]
    if i >= 2:
        dp[i] = (dp[i] + dp[i - 2]) % MOD
```

```cpp
const long long MOD = 1000000007LL;
vector<long long> dp(n + 1, 0);
dp[0] = 1;
for (int i = 1; i <= n; i++) {
    dp[i] = dp[i - 1];
    if (i >= 2) dp[i] = (dp[i] + dp[i - 2]) % MOD;
}
```

The numbers of ways grow very fast: take the modulo at each addition. The cost is the number of states times the cost of one transition, here O(N).

## Paths in a grid

We cross a grid of `R × C` numbers, moving right or down, and we want the largest sum. The state is the cell: `best[i][j]` is the best sum of a path ending at `(i, j)`. We get there from the cell above or the cell on the left.

```python
best = [[0] * c for _ in range(r)]
for i in range(r):
    for j in range(c):
        before = []
        if i > 0: before.append(best[i - 1][j])
        if j > 0: before.append(best[i][j - 1])
        best[i][j] = grid[i][j] + (max(before) if before else 0)
```

```cpp
vector<vector<long long>> best(r, vector<long long>(c, 0));
for (int i = 0; i < r; i++) {
    for (int j = 0; j < c; j++) {
        long long before = LLONG_MIN;
        if (i > 0) before = max(before, best[i - 1][j]);
        if (j > 0) before = max(before, best[i][j - 1]);
        best[i][j] = grid[i][j] + (before == LLONG_MIN ? 0 : before);
    }
}
```

There are a huge number of paths, but only `R × C` states. To **count** the optimal paths, keep a second array: the number of paths reaching the maximum, adding up only those of the cells that achieve this maximum.

## The knapsack

We have items of weight `p` and value `v`, and a bag of capacity `W`. Each item is taken at most once. The state is the **capacity used**: `best[w]` is the best value for a total weight of at most `w`. We add the items one by one, going through `w` in **decreasing** order so as not to take the same item twice.

```python
best = [0] * (W + 1)
for p, v in items:
    for w in range(W, p - 1, -1):
        best[w] = max(best[w], best[w - p] + v)
```

```cpp
vector<long long> best(W + 1, 0);
for (auto [p, v] : items) {
    for (int w = W; w >= p; w--) {
        best[w] = max(best[w], best[w - p] + v);
    }
}
```

Cost: O(N × W). The initialisation decides the meaning of `best[w]`: with `0` everywhere, it is "weight at most `w`"; with `best[0] = 0` and an "impossible" value elsewhere, it is "weight **exactly** `w`".

## Longest increasing subsequence

We look for the longest strictly increasing subsequence of a sequence `a` (not necessarily contiguous). The direct DP, "`lis[i]` = longest subsequence ending at `i`", compares `i` with every `j < i`: O(N²).

We can do better with an array `tails` where `tails[k]` is the smallest possible final value of an increasing subsequence of length `k + 1`. This array stays sorted: for each value, a **binary search** finds its place.

```python
from bisect import bisect_left
tails = []
for x in a:
    k = bisect_left(tails, x)   # first element >= x
    if k == len(tails):
        tails.append(x)
    else:
        tails[k] = x
print(len(tails))
```

```cpp
vector<int> tails;
for (int x : a) {
    auto it = lower_bound(tails.begin(), tails.end(), x);   // first element >= x
    if (it == tails.end()) tails.push_back(x);
    else *it = x;
}
cout << tails.size() << "\n";
```

Cost: O(N log N). With `bisect_right` (`upper_bound`), you would get the longest **non-decreasing** subsequence.

## Key takeaways

- Define precisely the **state**, the **transition** (often: the last decision) and the **base cases**.
- Fill the array in an order where each cell only depends on cells already computed.
- Cost = number of states × cost of one transition.
- 0/1 knapsack: the loop over the weight goes **downwards**; the initialisation decides between "at most" and "exactly".
- The longest increasing subsequence is computed in O(N log N) with a sorted array and a binary search.
