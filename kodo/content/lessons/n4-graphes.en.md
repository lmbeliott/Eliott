Cities linked by roads, web pages linked by hyperlinks, neighbouring cells in a grid: all of these form a **graph**. The elements are the **vertices** (numbered from `1` to `N`) and the links are the **edges**.

## Adjacency lists

For each vertex, we keep the list of its neighbours. In an undirected graph, an edge between `a` and `b` can be followed in both directions: we add it to both lists.

```python
import sys
data = sys.stdin.buffer.read().split()
n, m = int(data[0]), int(data[1])
neighbours = [[] for _ in range(n + 1)]
for i in range(m):
    a, b = int(data[2 + 2 * i]), int(data[3 + 2 * i])
    neighbours[a].append(b)
    neighbours[b].append(a)
```

```cpp
int n, m;
cin >> n >> m;
vector<vector<int>> neighbours(n + 1);
for (int i = 0; i < m; i++) {
    int a, b;
    cin >> a >> b;
    neighbours[a].push_back(b);
    neighbours[b].push_back(a);
}
```

For large inputs: `sys.stdin.buffer` in Python, `ios::sync_with_stdio(false);` in C++.

## Breadth-first search

**Breadth-first search** (BFS) starts from a vertex and visits the vertices by increasing distance: first the neighbours, then the neighbours' neighbours… It uses a **queue**: we take out the first vertex, and each of its neighbours not seen yet gets its distance plus one and joins the back of the queue.

```python
from collections import deque
dist = [-1] * (n + 1)   # -1: not reached yet
dist[1] = 0
queue = deque([1])
while queue:
    u = queue.popleft()
    for v in neighbours[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            queue.append(v)
```

```cpp
vector<int> dist(n + 1, -1);   // -1: not reached yet
queue<int> q;
dist[1] = 0;
q.push(1);
while (!q.empty()) {
    int u = q.front();
    q.pop();
    for (int v : neighbours[u]) {
        if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            q.push(v);
        }
    }
}
```

At the end, `dist[v]` is the minimum number of edges to go from `1` to `v`, or `-1` if `v` is unreachable. Each vertex enters the queue only once and each edge is looked at twice: the search costs **O(N + M)**. A vertex is marked **when it is added** to the queue, otherwise it may enter it several times.

## Depth-first search and components

**Depth-first search** (DFS) goes as deep as possible before backtracking. Written recursively, it exceeds Python's recursion limit (1 000 calls) on a long chain: an explicit **stack** is used instead.

A **connected component** is a group of vertices linked together. To count them, we start a search from each vertex not visited yet: each search we start discovers a new component, entirely.

```python
seen = [False] * (n + 1)
components = 0
for start in range(1, n + 1):
    if not seen[start]:
        components += 1
        seen[start] = True
        stack = [start]
        while stack:
            u = stack.pop()
            for v in neighbours[u]:
                if not seen[v]:
                    seen[v] = True
                    stack.append(v)
```

```cpp
vector<bool> seen(n + 1, false);
int components = 0;
for (int start = 1; start <= n; start++) {
    if (seen[start]) continue;
    components++;
    seen[start] = true;
    vector<int> stack = {start};
    while (!stack.empty()) {
        int u = stack.back();
        stack.pop_back();
        for (int v : neighbours[u]) {
            if (!seen[v]) {
                seen[v] = true;
                stack.push_back(v);
            }
        }
    }
}
```

This stack-based search marks vertices as soon as they are pushed: it does visit the whole component, but not exactly in the order of a true recursive DFS. That does not matter for counting components.

For components, both BFS and DFS work; for a **distance**, only BFS works.

## Two-colouring

Sometimes we want to give each vertex a label `0` or `1`, so that the two ends of every edge get different labels. A BFS does it: the start gets `0`, and each new neighbour gets the label opposite to the vertex it was reached from. If a neighbour that already has a label carries **the same** label as the current vertex, the graph contains an odd-length cycle: it is impossible.

```python
colour = [-1] * (n + 1)   # -1: no label yet
possible = True
colour[start] = 0
queue = deque([start])
while queue:
    u = queue.popleft()
    for v in neighbours[u]:
        if colour[v] == -1:
            colour[v] = 1 - colour[u]
            queue.append(v)
        elif colour[v] == colour[u]:
            possible = False   # two neighbours with the same label
```

```cpp
vector<int> colour(n + 1, -1);   // -1: no label yet
bool possible = true;
colour[start] = 0;
queue<int> q;
q.push(start);
while (!q.empty()) {
    int u = q.front();
    q.pop();
    for (int v : neighbours[u]) {
        if (colour[v] == -1) {
            colour[v] = 1 - colour[u];
            q.push(v);
        } else if (colour[v] == colour[u]) {
            possible = false;   // two neighbours with the same label
        }
    }
}
```

The label of the start only decides its own component: as when counting components, we start a search from each vertex with no label yet, and handle each component separately.

## Shortest path on a grid

A grid is an implicit graph: each free cell is a vertex linked to its four free neighbours, which we compute on the fly. A BFS from the starting cell gives the distance to every cell.

Be careful in Python: with `sys.stdin.buffer`, each line read is a `bytes` object, and `line[j]` is a **number**, not a character. The test `line[j] != '#'` would then always be true. The lines must be decoded with `.decode()`, as below, or compared with `ord('#')`.

```python
r, c = int(data[0]), int(data[1])
grid = [line.decode() for line in data[2:2 + r]]
dist = [[-1] * c for _ in range(r)]
dist[si][sj] = 0
queue = deque([(si, sj)])
while queue:
    i, j = queue.popleft()
    for ni, nj in ((i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)):
        if 0 <= ni < r and 0 <= nj < c and grid[ni][nj] != '#' and dist[ni][nj] == -1:
            dist[ni][nj] = dist[i][j] + 1
            queue.append((ni, nj))
```

```cpp
vector<string> grid(r);
for (string& line : grid) cin >> line;
vector<vector<int>> dist(r, vector<int>(c, -1));
queue<pair<int, int>> q;
dist[si][sj] = 0;
q.push({si, sj});
int di[4] = {1, -1, 0, 0}, dj[4] = {0, 0, 1, -1};
while (!q.empty()) {
    auto [i, j] = q.front();
    q.pop();
    for (int d = 0; d < 4; d++) {
        int ni = i + di[d], nj = j + dj[d];
        if (ni >= 0 && ni < r && nj >= 0 && nj < c && grid[ni][nj] != '#' && dist[ni][nj] == -1) {
            dist[ni][nj] = dist[i][j] + 1;
            q.push({ni, nj});
        }
    }
}
```

To get the distance from each cell to the **nearest** of several sources, we put all the sources in the queue at the start, at distance `0`, then run a single BFS: this is **multi-source BFS**.

Two BFS can also be chained. If something spreads through the grid during the move, a first BFS (often multi-source) computes the minute `t[x]` at which it reaches each cell. The second BFS, from the starting position, enters a cell at minute `d` only if `d < t[x]`: the cell is reached first.

## Key takeaways

- A graph is stored as **adjacency lists**: O(N + M) memory.
- **BFS** (with a queue) gives shortest distances in number of edges, in O(N + M); vertices are marked as soon as they are added.
- **DFS** (with a stack, no deep recursion in Python) and BFS find the **connected components**: one search per unvisited vertex.
- **Two-colouring**: alternate labels `0`/`1` during the search; two neighbours with the same label make it impossible. Each component is handled on its own.
- On a grid, neighbours are computed on the fly; several sources are handled with a single BFS, and two BFS in a row make it possible to stay ahead of something that spreads.
