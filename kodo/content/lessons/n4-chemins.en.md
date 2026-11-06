When each edge has a different length, the path with the fewest edges is no longer necessarily the shortest: breadth-first search is not enough any more. This lesson presents two tools: **Dijkstra's algorithm**, for shortest paths in a weighted graph, and **union-find**, to group vertices together as edges are added.

## Dijkstra's algorithm

We store the graph as adjacency lists of pairs `(neighbour, length)`. We keep `dist[v]`, the best known distance to reach `v`, and a **heap** (priority queue) that always gives the vertex with the smallest distance.

At each step, we take out of the heap the closest vertex `u`. Since all lengths are positive, no other path can improve it: its distance is **final**. We then try to improve each neighbour: if `dist[u] + t < dist[v]`, we update `dist[v]` and push `(dist[v], v)` onto the heap.

```python
import heapq
INFINITY = 10 ** 18
dist = [INFINITY] * (n + 1)
dist[start] = 0
heap = [(0, start)]
while heap:
    d, u = heapq.heappop(heap)
    if d > dist[u]:
        continue   # outdated entry
    for v, t in neighbours[u]:
        if d + t < dist[v]:
            dist[v] = d + t
            heapq.heappush(heap, (dist[v], v))
```

```cpp
const long long INFINITY_ = (long long)4e18;
vector<long long> dist(n + 1, INFINITY_);
priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> heap;
dist[start] = 0;
heap.push({0, start});
while (!heap.empty()) {
    auto [d, u] = heap.top();
    heap.pop();
    if (d > dist[u]) continue;   // outdated entry
    for (auto [v, t] : neighbours[u]) {
        if (d + t < dist[v]) {
            dist[v] = d + t;
            heap.push({dist[v], v});
        }
    }
}
```

A vertex can be in the heap several times with different distances: only the smallest one counts, the others are **outdated** and we ignore them. The complexity is **O((N + M) log M)**. In C++, `priority_queue` gives the **largest** element: `greater` turns it into a min-heap. (In C++, `INFINITY` is already a macro from `<cmath>`, hence the name `INFINITY_`.) Dijkstra requires **non-negative** weights.

## Model before you compute

Many problems reduce to Dijkstra after a transformation.

- A **cost on the vertices** (a price to pay for each vertex you pass through) can be moved onto the edges entering them.
- A **limited resource** (a maximum number of special edges, of jokers…) is added to the state: a vertex of the new graph is a pair `(vertex, resource used)`. The state graph has more vertices, but the algorithm stays the same, and its arcs are computed on the fly.

## Union-find

**Union-find** manages disjoint groups with two operations: `find(x)` returns the representative of the group of `x`, and `unite(a, b)` merges the groups of `a` and `b`. Each element has a parent; the representative is the root, the element that is its own parent. Two elements are in the same group if and only if they have the same root.

Two improvements make the operations almost instantaneous: **path compression** (after a search, the whole path points directly to the root) and **union by size** (the small group joins the big one).

```python
parent = list(range(n + 1))
group_size = [1] * (n + 1)

def find(x):
    root = x
    while parent[root] != root:
        root = parent[root]
    while parent[x] != root:   # path compression
        following = parent[x]
        parent[x] = root
        x = following
    return root

def unite(a, b):
    a, b = find(a), find(b)
    if a != b:
        if group_size[a] < group_size[b]:
            a, b = b, a
        parent[b] = a
        group_size[a] += group_size[b]
```

```cpp
vector<int> parent, groupSize;   // parent[i] = i and groupSize[i] = 1 at the start

int find(int x) {
    int root = x;
    while (parent[root] != root) root = parent[root];
    while (parent[x] != root) {   // path compression
        int following = parent[x];
        parent[x] = root;
        x = following;
    }
    return root;
}

void unite(int a, int b) {
    a = find(a);
    b = find(b);
    if (a == b) return;
    if (groupSize[a] < groupSize[b]) swap(a, b);
    parent[b] = a;
    groupSize[a] += groupSize[b];
}
```

## Adding the edges in the right order

Union-find can **add** edges, not remove them. The trick is often to handle the events in a chosen order: we sort the edges (for example by weight) and add them one by one. This is the idea behind **Kruskal's algorithm**: by adding the edges from the cheapest to the most expensive, and only those that link two different groups, we get the cheapest network that connects everything.

If questions depend on a threshold ("using edges of weight at most `S`…"), you can also sort them by threshold and answer them **offline**, adding the edges along the way. Remember to keep each question's index so you can print the answers in input order.

## Key takeaways

- Dijkstra: a heap, distances final when they leave the heap, outdated entries ignored; weights must be non-negative.
- Complexity O((N + M) log M), much better than O(N × M) or O(N²).
- A cost on the vertices or a limited resource is modelled by changing the edges or the state.
- Union-find: `find` and `unite`, with path compression and union by size.
- Sorting edges and questions lets you handle everything by only adding edges.
