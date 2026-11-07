A subway network joins stations by lines; a social network joins people who know each other; a maze joins rooms by corridors. In all three cases, the questions are the same: can you get from here to there? In how many steps at least? How many separate pieces are there? All these situations are described by a **graph**, and two algorithms, depth-first search and breadth-first search, answer them in time proportional to the size of the graph. This chapter presents them, with their proof, their cost and their applications.

## Vocabulary

A **graph** is made of **vertices** and **edges**; each edge joins two vertices, its **endpoints**. We write `N` for the number of vertices, numbered from `1` to `N`, and `M` for the number of edges. Two vertices joined by an edge are **neighbours** (or adjacent). The **degree** of a vertex is the number of edges that touch it.

The graph is **undirected** when an edge can be travelled both ways (a two-way road), and **directed** when each edge, then called an **arc**, goes from one vertex to another (a one-way street). A **loop** joins a vertex to itself; two edges joining the same vertices are **multiple edges**.

A **path** is a sequence of vertices in which consecutive vertices are neighbours; its **length** is its number of edges. A **cycle** is a path of at least one edge that comes back to its starting point without reusing an edge or going through another vertex twice. An undirected graph is **connected** if a path joins any two vertices. Otherwise, it splits into **connected components**: two vertices are in the same component exactly when a path joins them.

The example graph of the whole chapter has 7 vertices and 6 edges, in the usual format of the exercises (`N` and `M`, then one edge per line):

```text
7 6
1 2
1 5
2 3
2 5
3 4
6 7
```

It has two components, `{1, 2, 3, 4, 5}` and `{6, 7}`, and a cycle `1 → 2 → 5 → 1`. Vertex 2 has degree 3.

A useful remark: each edge adds 1 to the degree of each of its two endpoints, so **the sum of the degrees is 2M**. This is called the handshake lemma. Here, 2 + 3 + 2 + 1 + 2 + 1 + 1 = 12 = 2 × 6.

## Storing a graph in memory

The most common representation is the **adjacency list**: for each vertex, the list of its neighbours. Since vertices are numbered from 1, we create `N + 1` lists and leave cell 0 unused. For an undirected graph, each edge is added **to both lists**.

```python
n, m = map(int, input().split())
neighbours = [[] for _ in range(n + 1)]    # cell 0 is unused
for _ in range(m):
    a, b = map(int, input().split())
    neighbours[a].append(b)
    neighbours[b].append(a)                # undirected graph: both ways
for v in range(1, n + 1):
    print(v, "degree", len(neighbours[v]), ":", *neighbours[v])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> neighbours(n + 1);   // cell 0 is unused
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        neighbours[a].push_back(b);
        neighbours[b].push_back(a);          // undirected graph: both ways
    }
    for (int v = 1; v <= n; v++) {
        cout << v << " degree " << neighbours[v].size() << " :";
        for (int w : neighbours[v]) cout << " " << w;
        cout << "\n";
    }
    return 0;
}
```

On the example graph, the program prints:

```text
1 degree 2 : 2 5
2 degree 3 : 1 3 5
3 degree 2 : 2 4
4 degree 1 : 3
5 degree 2 : 1 2
6 degree 1 : 7
7 degree 1 : 6
```

For a directed graph, the arc `a → b` is only added to the list of `a`.

The other representation is the **adjacency matrix**: an `N × N` array of booleans, where `adj[a][b]` tells whether `a` and `b` are neighbours.

```python
n, m = map(int, input().split())
adj = [[False] * (n + 1) for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    adj[a][b] = True
    adj[b][a] = True
print(adj[2][5], adj[3][5])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<bool>> adj(n + 1, vector<bool>(n + 1, false));
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        adj[a][b] = true;
        adj[b][a] = true;
    }
    cout << (adj[2][5] ? "True" : "False") << " " << (adj[3][5] ? "True" : "False") << "\n";
    return 0;
}
```

The program prints `True False`: 2 and 5 are neighbours, 3 and 5 are not. The two representations have different costs.

| | Adjacency lists | Adjacency matrix |
| --- | --- | --- |
| Memory | N + 2M cells | N² cells |
| Are `a` and `b` neighbours? | scan the list of `a` | one cell: O(1) |
| List the neighbours of `a` | O(degree of `a`) | O(N) |

With `N = 100,000`, a matrix has 10¹⁰ cells: far too much memory. It is kept for small graphs, and lists are used everywhere else.

## Depth-first search

**Depth-first search** (DFS) explores the graph the way you explore a maze with a piece of chalk: move forward as long as a corridor leads to a room not yet marked, and go back when every neighbouring room is marked. An array `seen` records the vertices already visited. The recursive version is the shortest:

```python
import sys
sys.setrecursionlimit(10000)

def depth_first(u):
    seen[u] = True
    order.append(u)
    for v in neighbours[u]:
        if not seen[v]:
            depth_first(v)

n, m = map(int, input().split())
neighbours = [[] for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    neighbours[a].append(b)
    neighbours[b].append(a)
seen = [False] * (n + 1)
order = []
depth_first(1)
print(*order)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> neighbours;
vector<bool> seen;
vector<int> order;

void depth_first(int u) {
    seen[u] = true;
    order.push_back(u);
    for (int v : neighbours[u]) {
        if (!seen[v]) depth_first(v);
    }
}

int main() {
    int n, m;
    cin >> n >> m;
    neighbours.assign(n + 1, {});
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        neighbours[a].push_back(b);
        neighbours[b].push_back(a);
    }
    seen.assign(n + 1, false);
    depth_first(1);
    for (int v : order) cout << v << " ";
    cout << "\n";
    return 0;
}
```

The program prints `1 2 3 4 5`. From 1, we go to 2, then to 3 (the first unmarked neighbour of 2), then to 4. Vertex 4 has no free neighbour left: we go back to 3, then to 2, whose neighbour 5 is still free. Vertices 6 and 7 are never reached.

**Correctness.** The search started from `s` marks exactly the vertices reachable from `s`.
- Every marked vertex is reachable: `v` is only marked when coming from an already marked neighbour `u`, so, step by step, a path leads from `s` to `v`.
- Every reachable vertex is marked. Otherwise, take a path from `s` to a reachable unmarked vertex, and on that path the first unmarked vertex `w`. Its predecessor `p` on the path is marked; but the call on `p` examined all its neighbours, including `w`, and would have marked it. Contradiction.

**Complexity.** Each vertex is marked at most once, so the call on a vertex happens at most once, and its neighbour list is scanned only then. By the handshake lemma, the lists have total length `2M`: the search costs O(N + M). With a matrix, listing the neighbours of a vertex costs `N`, and the search costs O(N²).

## Recursion depth and explicit stack

The recursion depth can reach the number of vertices: on a path `1 – 2 – … – 100,000`, the call on 1 calls 2, which calls 3, and so on. The previous program then stops with `RecursionError: maximum recursion depth exceeded`. Raising the limit further is not safe: the machine stack has a fixed size, small in a browser. In C++, the program stops with `Segmentation fault` on a path of one million vertices.

The cure is to manage the stack yourself, with a list. Push the start; while the stack is not empty, pop a vertex; if it is already marked, skip it, otherwise mark it and push its unmarked neighbours.

```python
n, m = map(int, input().split())
neighbours = [[] for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    neighbours[a].append(b)
    neighbours[b].append(a)

seen = [False] * (n + 1)
order = []
stack = [1]
while stack:
    u = stack.pop()
    if seen[u]:
        continue                         # already visited through another path
    seen[u] = True
    order.append(u)
    for v in reversed(neighbours[u]):    # backwards: the first neighbour comes out first
        if not seen[v]:
            stack.append(v)
print(*order)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> neighbours(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        neighbours[a].push_back(b);
        neighbours[b].push_back(a);
    }
    vector<bool> seen(n + 1, false);
    vector<int> stack = {1};
    while (!stack.empty()) {
        int u = stack.back();
        stack.pop_back();
        if (seen[u]) continue;                        // already visited through another path
        seen[u] = true;
        cout << u << " ";
        for (int i = (int)neighbours[u].size() - 1; i >= 0; i--) {   // backwards
            int v = neighbours[u][i];
            if (!seen[v]) stack.push_back(v);
        }
    }
    cout << "\n";
    return 0;
}
```

This program also prints `1 2 3 4 5`: pushing the neighbours backwards makes the first neighbour come out first, as in the recursive version. A vertex may be pushed several times (5 is pushed by 1 and by 2), hence the test when popping; but each push corresponds to a cell of a neighbour list, so the stack receives at most `2M + 1` elements and the cost stays O(N + M).

## Connected components

Start a search from each vertex not yet reached: each new search discovers a new component, whose number is stored in an array `comp`. When the visiting order does not matter, a vertex is marked **when it is pushed**: it then enters the stack only once.

```python
n, m = map(int, input().split())
neighbours = [[] for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    neighbours[a].append(b)
    neighbours[b].append(a)

comp = [0] * (n + 1)          # 0: not visited yet
count = 0
for start in range(1, n + 1):
    if comp[start] != 0:
        continue
    count += 1                # new component
    comp[start] = count
    stack = [start]
    while stack:
        u = stack.pop()
        for v in neighbours[u]:
            if comp[v] == 0:
                comp[v] = count
                stack.append(v)
print(count)
print(*comp[1:])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> neighbours(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        neighbours[a].push_back(b);
        neighbours[b].push_back(a);
    }
    vector<int> comp(n + 1, 0);   // 0: not visited yet
    int count = 0;
    for (int start = 1; start <= n; start++) {
        if (comp[start] != 0) continue;
        count++;                  // new component
        comp[start] = count;
        vector<int> stack = {start};
        while (!stack.empty()) {
            int u = stack.back();
            stack.pop_back();
            for (int v : neighbours[u]) {
                if (comp[v] == 0) {
                    comp[v] = count;
                    stack.push_back(v);
                }
            }
        }
    }
    cout << count << "\n";
    for (int v = 1; v <= n; v++) cout << comp[v] << " ";
    cout << "\n";
    return 0;
}
```

The program prints `2`, then `1 1 1 1 1 2 2`. Each search marks exactly the component of its start, by the previous proof. The total cost stays O(N + M), not O(N × (N + M)): each vertex is visited by a single search, the one of its component.

## Breadth-first search and shortest paths

**Breadth-first search** (BFS) replaces the stack with a **queue**: first the start is visited, then all its neighbours, then all their neighbours, and so on, like a spreading wave. It computes the **distance** of each vertex from the start, that is the length of a shortest path. The array `dist` also serves as marking: `-1` means "not discovered yet". We also record the `parent` of each vertex, the one that discovered it.

```python
from collections import deque

n, m = map(int, input().split())
neighbours = [[] for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    neighbours[a].append(b)
    neighbours[b].append(a)

dist = [-1] * (n + 1)         # -1: not discovered yet
parent = [0] * (n + 1)
dist[1] = 0
queue = deque([1])
while queue:
    u = queue.popleft()
    for v in neighbours[u]:
        if dist[v] == -1:     # mark when entering the queue
            dist[v] = dist[u] + 1
            parent[v] = u
            queue.append(v)
print(*dist[1:])

path = [4]                    # climb the parents from 4
while path[-1] != 1:
    path.append(parent[path[-1]])
print(*reversed(path))
```

```cpp
#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> neighbours(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        neighbours[a].push_back(b);
        neighbours[b].push_back(a);
    }
    vector<int> dist(n + 1, -1), parent(n + 1, 0);   // -1: not discovered yet
    dist[1] = 0;
    queue<int> q;
    q.push(1);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : neighbours[u]) {
            if (dist[v] == -1) {                     // mark when entering the queue
                dist[v] = dist[u] + 1;
                parent[v] = u;
                q.push(v);
            }
        }
    }
    for (int v = 1; v <= n; v++) cout << dist[v] << " ";
    cout << "\n";
    vector<int> path = {4};                          // climb the parents from 4
    while (path.back() != 1) path.push_back(parent[path.back()]);
    reverse(path.begin(), path.end());
    for (int v : path) cout << v << " ";
    cout << "\n";
    return 0;
}
```

The program prints `0 1 2 3 1 -1 -1`, then `1 2 3 4`. The queue successively contains `[1]`, `[2, 5]`, `[5, 3]`, `[3]`, `[4]`. The links to the parents form the **search tree**; climbing from 4 to 1, a shortest path is read backwards.

**Why the distances are correct.** Let δ(v) be the true distance from 1 to `v`.
1. `dist[v] ≥ δ(v)`: `dist[v]` is the length of the path formed by the parents, and no path is shorter than δ(v).
2. **Queue invariant**: at all times, the `dist` values of the vertices in the queue, from head to tail, are non-decreasing and take at most two consecutive values `d` and `d + 1`. It holds at the start; dequeuing a vertex of value `d` and enqueuing vertices of value `d + 1` at the tail preserves it. Consequence: vertices leave the queue in non-decreasing order of `dist`.
3. `dist[v] ≤ δ(v)`, by induction on k = δ(v). For k = 0, v is the start. If k ≥ 1, let `u` be the vertex before `v` on a shortest path: δ(u) = k − 1, so `dist[u] = k − 1` by the induction hypothesis. When `u` is dequeued, either `v` is not discovered yet and gets `k`, or it was discovered by a vertex `w` dequeued before `u`, hence with `dist[w] ≤ dist[u]` by the invariant, and `dist[v] = dist[w] + 1 ≤ k`.

A depth-first search does not give distances: it reaches 5 through 2, whereas 5 is a neighbour of 1.

**Complexity.** Each vertex enters the queue at most once, since it is marked when entering: O(N + M), provided a real queue is used (`deque` in Python, `queue` in C++).

## Cycles and two-colouring

In a connected undirected graph with `s` vertices, the tree of a search contains `s − 1` edges, one per discovered vertex. The graph therefore has at least `s − 1` edges. If it has exactly `s − 1`, they are all tree edges, and it has no cycle: in a cycle made of tree edges, the vertex discovered last would have two neighbours on the cycle discovered before it, and only one of them can be its parent. If it has more, an edge `u – v` outside the tree closes a cycle with the tree paths leading from `u` and `v` to their last common ancestor. A connected graph without a cycle is called a **tree**, and we remember: **a component with `s` vertices contains a cycle if and only if it has at least `s` edges**. To detect a cycle, it is enough to count the vertices and edges of each component.

A graph is **bipartite** if its vertices can be coloured with two colours so that each edge joins two different colours (splitting students into two rooms, separating those who are joined). In a component, the colour of the start forces the colour of its neighbours, then of their neighbours: a search colours everything, and we check that no edge joins two vertices of the same colour.

```python
from collections import deque

def bipartite(n, edges):
    neighbours = [[] for _ in range(n + 1)]
    for a, b in edges:
        neighbours[a].append(b)
        neighbours[b].append(a)
    colour = [-1] * (n + 1)
    for start in range(1, n + 1):
        if colour[start] != -1:
            continue
        colour[start] = 0
        queue = deque([start])
        while queue:
            u = queue.popleft()
            for v in neighbours[u]:
                if colour[v] == -1:
                    colour[v] = 1 - colour[u]
                    queue.append(v)
                elif colour[v] == colour[u]:
                    return False      # two neighbours with the same colour
    return True

print(bipartite(7, [(1, 2), (1, 5), (2, 3), (2, 5), (3, 4), (6, 7)]))
print(bipartite(6, [(1, 2), (2, 3), (3, 4), (4, 1), (5, 6)]))
```

```cpp
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

bool bipartite(int n, const vector<pair<int, int>> &edges) {
    vector<vector<int>> neighbours(n + 1);
    for (auto [a, b] : edges) {
        neighbours[a].push_back(b);
        neighbours[b].push_back(a);
    }
    vector<int> colour(n + 1, -1);
    for (int start = 1; start <= n; start++) {
        if (colour[start] != -1) continue;
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
                    return false;      // two neighbours with the same colour
                }
            }
        }
    }
    return true;
}

int main() {
    cout << (bipartite(7, {{1, 2}, {1, 5}, {2, 3}, {2, 5}, {3, 4}, {6, 7}}) ? "True" : "False") << "\n";
    cout << (bipartite(6, {{1, 2}, {2, 3}, {3, 4}, {4, 1}, {5, 6}}) ? "True" : "False") << "\n";
    return 0;
}
```

The program prints `False` (the triangle 1, 2, 5 cannot be coloured), then `True` (the square 1, 2, 3, 4 alternates colours).

**Why it is correct.** With a breadth-first search, the colour of a vertex is the parity of its distance from the start. If the program answers `True`, every edge joins two different colours: the colouring works. If it answers `False`, it found an edge `u – v` with `dist[u]` and `dist[v]` of the same parity. The tree paths from `u` and `v` to their last common ancestor `w`, plus the edge `u – v`, form a cycle of length `(dist[u] − dist[w]) + (dist[v] − dist[w]) + 1`, an odd number. But an odd cycle cannot be coloured by alternating two colours. We have proved the theorem: **a graph is bipartite if and only if it has no cycle of odd length.**

## Common mistakes

**Forgetting to mark.** Without a `seen` array, a search loops forever as soon as there is a cycle: 1 pushes 2, which pushes 1, which pushes 2… The stack or queue grows until `MemoryError`, or the program exceeds the time limit.

**Marking too late in a breadth-first search.** If a vertex is marked when it leaves the queue instead of when it enters it, it can enter several times, and its distance can be overwritten by a larger value.

**Forgetting a direction.** In an undirected graph, forgetting `neighbours[b].append(a)` makes vertices unreachable; in a directed graph, adding it changes the graph.

**Getting the size wrong.** With vertices numbered from 1 to `N`, a list of size `N` causes `IndexError: list index out of range`; in C++, the program writes outside the array, with no message.

**Using a list as a queue.** `queue.pop(0)` shifts the whole list: the search becomes quadratic.

**Recursion too deep.** `RecursionError` in Python, `Segmentation fault` in C++: use an explicit stack as soon as the graph can have thousands of vertices.

## Complete example: the shortest trip

**Statement.** A network has `N` stations and `M` two-way links. Print the minimum number of links to go from station `S` to station `T`, then a trip achieving that minimum; print `-1` if `T` cannot be reached.

**Idea.** A breadth-first search from `S` gives `dist[T]`; the parents let us climb back from `T` to `S`.

```python
from collections import deque

n, m, s, t = map(int, input().split())
neighbours = [[] for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    neighbours[a].append(b)
    neighbours[b].append(a)

dist = [-1] * (n + 1)
parent = [0] * (n + 1)
dist[s] = 0
queue = deque([s])
while queue:
    u = queue.popleft()
    for v in neighbours[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            parent[v] = u
            queue.append(v)

if dist[t] == -1:
    print(-1)
else:
    print(dist[t])
    trip = [t]
    while trip[-1] != s:
        trip.append(parent[trip[-1]])
    trip.reverse()
    print(*trip)
```

```cpp
#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int n, m, s, t;
    cin >> n >> m >> s >> t;
    vector<vector<int>> neighbours(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        neighbours[a].push_back(b);
        neighbours[b].push_back(a);
    }
    vector<int> dist(n + 1, -1), parent(n + 1, 0);
    dist[s] = 0;
    queue<int> q;
    q.push(s);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : neighbours[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                parent[v] = u;
                q.push(v);
            }
        }
    }
    if (dist[t] == -1) {
        cout << -1 << "\n";
    } else {
        cout << dist[t] << "\n";
        vector<int> trip = {t};
        while (trip.back() != s) trip.push_back(parent[trip.back()]);
        reverse(trip.begin(), trip.end());
        for (int v : trip) cout << v << " ";
        cout << "\n";
    }
    return 0;
}
```

**Checking by hand.** With the following input (6 stations, from 1 to 6):

```text
6 7 1 6
1 2
1 3
2 4
3 4
4 5
5 6
3 6
```

the queue contains `[1]`, then `[2, 3]`, then `[3, 4]`, then `[4, 6]`: when 3 is dequeued, 6 is discovered with `dist[6] = 2` and `parent[6] = 3`. The program prints `2`, then `1 3 6`. Without the link `3 6`, it would print `4`, then `1 2 4 5 6`.

**Correctness and cost.** The distances are correct by the proof above, and the rebuilt trip has exactly `dist[t]` links, since each parent is one step closer. The cost is O(N + M).

## Key takeaways

- A graph is stored as **adjacency lists** (`N + 1` lists, each undirected edge added both ways): N + 2M memory, against N² for a matrix.
- A **search** marks each vertex once and costs **O(N + M)**; it reaches exactly the vertices reachable from the start.
- **Depth-first search** is written recursively, but on a large graph an **explicit stack** avoids `RecursionError` or `Segmentation fault`.
- **Breadth-first search**, with a queue and marking when entering the queue, computes **shortest distances** in an unweighted graph; the parents give a shortest path.
- A search started from each unvisited vertex discovers the **connected components**; a component with `s` vertices has a cycle if and only if it has at least `s` edges.
- A graph is **bipartite** if and only if it has no odd cycle; a search alternating two colours checks it.
