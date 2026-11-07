A **tree** is a connected graph with no cycle: `N` vertices, `N - 1` edges, and a single path between any two vertices. Once a **root** is chosen, every other vertex has a **parent** (the neighbour on the root's side) and **children**. The **subtree** of `v` is made of `v` and all its descendants.

## Storing a rooted tree

The problems of this chapter often give the tree by the parent of each vertex `2, 3, …, N`, the root being `1`. From it, we deduce the lists of children. Be careful: the numbers do not follow the hierarchy, a child may have a smaller number than its parent.

## Traversing without recursion

A breadth-first search from the root produces a list `order` where each vertex appears **after its parent**. We also use it to compute the depths. Read **backwards**, the same list processes each vertex **after all its children**: that is the right direction to carry information from the leaves up to the root, like the sizes of the subtrees.

```python
children = [[] for _ in range(n + 1)]
for v in range(2, n + 1):
    children[parent[v]].append(v)
order = [1]
depth = [0] * (n + 1)
for u in order:                  # the list grows while we go through it
    for v in children[u]:
        depth[v] = depth[u] + 1
        order.append(v)
size = [1] * (n + 1)
for v in reversed(order):        # each vertex after its children
    if v != 1:
        size[parent[v]] += size[v]
```

```cpp
vector<vector<int>> children(n + 1);
for (int v = 2; v <= n; v++) children[parent[v]].push_back(v);
vector<int> order = {1}, depth(n + 1, 0);
for (size_t i = 0; i < order.size(); i++)
    for (int v : children[order[i]]) {
        depth[v] = depth[order[i]] + 1;
        order.push_back(v);
    }
vector<int> size(n + 1, 1);
for (int i = n - 1; i >= 1; i--)   // each vertex after its children
    size[parent[order[i]]] += size[order[i]];
```

Why not a recursive function? On a path-shaped tree, the depth reaches `N`, and Python stops at around 1,000 nested calls. The traversal with a list does not have this problem.

## The diameter

The **diameter** is the longest path of the tree. Two breadth-first searches are enough: the vertex `a` farthest from any vertex is an end of a longest path, and the vertex `b` farthest from `a` is the other end. The middle of the path from `a` to `b` is the **centre**: one vertex if the diameter is even, two neighbours if it is odd. All the longest paths go through it.

This trick only works with positive lengths: with negative edge weights, dynamic programming over the subtrees is needed.

## Rerooting

Many questions ask for a value **for every vertex taken as the root**: the sum of the distances to the other vertices, the largest distance… Starting a new search from every vertex costs O(N²). The idea of **rerooting**: compute the value for root `1`, then slide it along each edge in O(1).

For the sum of distances `S(v)`, when moving from a vertex `p` to its child `v`, the `size[v]` vertices of the subtree of `v` get `1` closer, and the `N - size[v]` others get `1` farther:

```python
S = [0] * (n + 1)
S[1] = sum(depth)
for v in order:                  # from the root down to the leaves
    if v != 1:
        S[v] = S[parent[v]] + n - 2 * size[v]
```

```cpp
vector<long long> S(n + 1, 0);
for (int v = 1; v <= n; v++) S[1] += depth[v];
for (int v : order)              // from the root down to the leaves
    if (v != 1) S[v] = S[parent[v]] + n - 2 * size[v];
```

## Lowest common ancestor and binary lifting

The path between `u` and `v` goes up to their **lowest common ancestor** (LCA), then down again; its length is `depth[u] + depth[v] - 2 × depth[lca]`. To find it quickly, we precompute `up[j][v]`, the ancestor located `2ʲ` levels above `v` (or `0`): climbing `2ʲ` levels means climbing `2ʲ⁻¹` levels twice. To climb `k` levels, we follow the bits of `k`.

```python
up = [parent]                    # parent[1] = 0
for j in range(1, LOG):
    up.append([up[j - 1][up[j - 1][v]] for v in range(n + 1)])

def lca(u, v):
    if depth[u] < depth[v]:
        u, v = v, u
    k, j = depth[u] - depth[v], 0
    while k:                     # u climbs to the level of v
        if k & 1:
            u = up[j][u]
        k, j = k >> 1, j + 1
    if u == v:
        return u
    for j in range(LOG - 1, -1, -1):
        if up[j][u] != up[j][v]:
            u, v = up[j][u], up[j][v]
    return parent[u]
```

```cpp
// up[0] = parent, with parent[1] = 0
for (int j = 1; j < LOG; j++)
    for (int v = 0; v <= n; v++) up[j][v] = up[j - 1][up[j - 1][v]];

int lca(int u, int v) {
    if (depth[u] < depth[v]) swap(u, v);
    for (int k = depth[u] - depth[v], j = 0; k > 0; k >>= 1, j++)
        if (k & 1) u = up[j][u];     // u climbs to the level of v
    if (u == v) return u;
    for (int j = LOG - 1; j >= 0; j--)
        if (up[j][u] != up[j][v]) u = up[j][u], v = up[j][v];
    return up[0][u];
}
```

Once both vertices are on the same level, we lift them together by decreasing jumps, as long as they do not meet: they stop just below the common ancestor. With `LOG` such that `2^LOG > N`, the table costs O(N log N), and each question O(log N).

## Key takeaways

- A breadth-first search from the root gives an order where each vertex follows its parent; backwards, it follows its children. No recursion needed.
- Subtree sizes and sums are carried from the leaves up to the root, in O(N).
- The diameter is found with two breadth-first searches; all the longest paths go through its centre.
- **Rerooting** computes a value for every possible root in O(N): one formula to move from the parent to the child.
- **Binary lifting** gives the ancestor at distance `k` and the lowest common ancestor in O(log N).
