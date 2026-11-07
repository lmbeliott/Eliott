On a map, each road has a length, and we look for the shortest route between two cities. Breadth-first search is no longer enough: it minimises the **number** of roads used, not the total length. Two roads of 2 km are better than a single one of 10 km. This chapter presents the three classic algorithms, Dijkstra, Bellman-Ford and Floyd-Warshall, with their proof and their cost. Vertices will not always be places: they can be remainders modulo `K` or pairs (place, information).

## Weighted graphs and distances

A **weighted graph** associates a number with each edge, its **weight** or **length**. The **length of a path** is the sum of the lengths of its edges. The **distance** `d(s, v)` is the smallest length of a path from `s` to `v`; it is infinite if there is no path. A **shortest path** is a path whose length equals the distance.

The graph is stored as adjacency lists whose elements are pairs `(v, l)`: the neighbour and the length of the edge.

One remark guides the whole chapter: if `u` lies on a shortest path from `s` to `v`, the part from `s` to `u` is itself a shortest path (otherwise we would replace it and the path to `v` would get shorter). So shortest paths are built step by step.

The basic operation is called **relaxing** an edge `u → v` of length `l`: if `dist[u] + l < dist[v]`, replace `dist[v]` with `dist[u] + l`. The array `dist` always holds lengths of real paths, hence values at least equal to the true distances. The three algorithms differ in the order of relaxations.

## The priority queue

A **priority queue** receives elements in any order and always gives back the smallest. It is implemented with a **heap**, a structure that performs each insertion and each removal in O(log n) operations for n elements present.

In Python, the module `heapq` turns a list into a heap: `heappush(tas, x)` adds, `heappop(tas)` removes and returns the smallest. In C++, `priority_queue` from `<queue>` returns the **largest** by default; to get the smallest, give three parameters: the type, the container `vector`, and the comparator `greater<>` from `<functional>`. Pairs are compared on their first element, then on the second in case of a tie.

```python
import heapq

tas = []
heapq.heappush(tas, (5, "a"))
heapq.heappush(tas, (2, "b"))
heapq.heappush(tas, (8, "c"))
heapq.heappush(tas, (2, "a"))
while tas:
    d, x = heapq.heappop(tas)
    print(d, x)
```

```cpp
#include <functional>
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

int main() {
    priority_queue<pair<int, char>, vector<pair<int, char>>, greater<pair<int, char>>> tas;
    tas.push({5, 'a'});
    tas.push({2, 'b'});
    tas.push({8, 'c'});
    tas.push({2, 'a'});
    while (!tas.empty()) {
        auto [d, x] = tas.top();
        tas.pop();
        cout << d << " " << x << "\n";
    }
    return 0;
}
```

The program prints `2 a`, `2 b`, `5 a` then `8 c`: the pairs come out in increasing order. So we will always put the **distance first**.

## Dijkstra's algorithm

Dijkstra's algorithm computes distances from a source `s` when all lengths are **non-negative**. Start with `dist[s] = 0` and infinity for the other vertices. The heap holds pairs `(distance, vertex)`. At each step, pop the pair `(d, u)` with the smallest distance. If `d > dist[u]`, this pair is a **stale entry**: `u` has been improved since it was pushed, so skip it. Otherwise **process** `u`: relax all its edges, and each improvement pushes a new pair.

Since `heapq` and `priority_queue` cannot modify a pair already present, we push a new one and ignore the old one when it comes out: this is **lazy deletion**.

```python
import heapq

n = 5
aretes = [(1, 2, 7), (1, 3, 2), (3, 2, 3), (2, 4, 1), (3, 4, 8), (4, 5, 2), (3, 5, 10)]
voisins = [[] for _ in range(n + 1)]
for a, b, l in aretes:
    voisins[a].append((b, l))
    voisins[b].append((a, l))

INFINI = 10 ** 18
dist = [INFINI] * (n + 1)
dist[1] = 0
tas = [(0, 1)]
while tas:
    d, u = heapq.heappop(tas)
    if d > dist[u]:
        continue  # entrée périmée
    for v, l in voisins[u]:
        if d + l < dist[v]:  # relâchement de l'arête u - v
            dist[v] = d + l
            heapq.heappush(tas, (dist[v], v))
print(*dist[1:])
```

```cpp
#include <functional>
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int n = 5;
    int aretes[7][3] = {{1, 2, 7}, {1, 3, 2}, {3, 2, 3}, {2, 4, 1}, {3, 4, 8}, {4, 5, 2}, {3, 5, 10}};
    vector<vector<pair<int, long long>>> voisins(n + 1);
    for (auto& e : aretes) {
        voisins[e[0]].push_back({e[1], e[2]});
        voisins[e[1]].push_back({e[0], e[2]});
    }

    const long long INFINI = (long long)1e18;
    vector<long long> dist(n + 1, INFINI);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
    dist[1] = 0;
    tas.push({0, 1});
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > dist[u]) continue;  // entrée périmée
        for (auto [v, l] : voisins[u]) {
            if (d + l < dist[v]) {  // relâchement de l'arête u - v
                dist[v] = d + l;
                tas.push({dist[v], v});
            }
        }
    }
    for (int v = 1; v <= n; v++) cout << dist[v] << " ";
    cout << "\n";
    return 0;
}
```

The program prints `0 5 2 6 8`. Vertex `3` comes out with 2 and improves `2` from 7 to 5; `2` comes out with 5 and improves `4` to 6, which improves `5` to 8. The pairs `(7, 2)`, `(10, 4)` and `(12, 5)`, left in the heap, come out later and are ignored.

**Why it is correct.** We prove the following invariant: when a vertex `u` is processed, `dist[u] = d(s, u)`. Suppose the contrary, and take the first vertex `u` processed with `dist[u] > d(s, u)`. On a shortest path from `s` to `u`, let `y` be the first vertex not yet processed (it exists, since `u` itself is not processed yet), and `x` the vertex before it, already processed. When `x` was processed, with its true distance, the edge `x → y` was relaxed: `dist[y] ≤ d(s, x) + l = d(s, y)`. Lengths being non-negative, the rest of the path from `y` to `u` shortens nothing: `d(s, y) ≤ d(s, u) < dist[u]`. So the pair of `y` was in the heap with a distance strictly smaller than that of `u`, and should have come out first: contradiction.

**Why negative lengths break everything.** The argument uses `d(s, y) ≤ d(s, u)`: the end of the path cannot decrease the length. With arcs `1 → 2` of length 4, `1 → 3` of length 5 and `3 → 2` of length −3, vertex `2` leaves the heap with 4 while its true distance is 2. Dijkstra then gives a wrong answer (if processing a vertex twice is forbidden), or reprocesses vertices a number of times that can become exponential.

**Complexity.** Each vertex is processed once, so each arc is relaxed once and pushes at most one pair. The heap receives at most `M + 1` pairs (`2M + 1` for an undirected graph), and each operation costs O(log M) = O(log N), since `M ≤ N²`. In total: **O((N + M) log N)**. Without a heap, finding the minimum among all vertices costs O(N²): too slow for `N = 10⁵`.

## Recovering a shortest path

Distances do not say which way to go. It is enough to store, at each improvement of `dist[v]` through the edge `u → v`, the **predecessor** `pred[v] = u`. At the end, start from the destination and follow `pred` back to the source; the list obtained is the path in reverse.

```python
import heapq

n = 5
aretes = [(1, 2, 7), (1, 3, 2), (3, 2, 3), (2, 4, 1), (3, 4, 8), (4, 5, 2), (3, 5, 10)]
voisins = [[] for _ in range(n + 1)]
for a, b, l in aretes:
    voisins[a].append((b, l))
    voisins[b].append((a, l))

INFINI = 10 ** 18
dist = [INFINI] * (n + 1)
pred = [0] * (n + 1)
dist[1] = 0
tas = [(0, 1)]
while tas:
    d, u = heapq.heappop(tas)
    if d > dist[u]:
        continue
    for v, l in voisins[u]:
        if d + l < dist[v]:
            dist[v] = d + l
            pred[v] = u  # on arrive en v depuis u
            heapq.heappush(tas, (dist[v], v))

chemin = [5]
while chemin[-1] != 1:
    chemin.append(pred[chemin[-1]])
chemin.reverse()
print(dist[5], ":", *chemin)
```

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

int main() {
    int n = 5;
    int aretes[7][3] = {{1, 2, 7}, {1, 3, 2}, {3, 2, 3}, {2, 4, 1}, {3, 4, 8}, {4, 5, 2}, {3, 5, 10}};
    vector<vector<pair<int, long long>>> voisins(n + 1);
    for (auto& e : aretes) {
        voisins[e[0]].push_back({e[1], e[2]});
        voisins[e[1]].push_back({e[0], e[2]});
    }

    const long long INFINI = (long long)1e18;
    vector<long long> dist(n + 1, INFINI);
    vector<int> pred(n + 1, 0);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
    dist[1] = 0;
    tas.push({0, 1});
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > dist[u]) continue;
        for (auto [v, l] : voisins[u]) {
            if (d + l < dist[v]) {
                dist[v] = d + l;
                pred[v] = u;  // on arrive en v depuis u
                tas.push({dist[v], v});
            }
        }
    }

    vector<int> chemin = {5};
    while (chemin.back() != 1) chemin.push_back(pred[chemin.back()]);
    reverse(chemin.begin(), chemin.end());
    cout << dist[5] << " :";
    for (int v : chemin) cout << " " << v;
    cout << "\n";
    return 0;
}
```

The program prints `8 : 1 3 2 4 5`. Walking back is correct: when `v` is processed, `dist[v] = dist[pred[v]] + l` and `pred[v]` already has its true distance; step by step, the edges read have a total length `dist[v]`. The edges `pred[v] → v` form the **shortest-path tree**, rooted at `s`.

## Bellman-Ford: negative lengths

Negative lengths appear with gains or with constraints of the form `x_B − x_A ≤ C`. A **negative cycle**, of strictly negative total length, makes some distances equal to "minus infinity": one can loop around it forever.

The **Bellman-Ford** algorithm works in **rounds**: in each round, it relaxes **all** edges, in any order. Invariant: after `k` rounds, `dist[v]` is at most the length of any path from `s` to `v` with at most `k` edges. If a path with `k + 1` edges reaches `v` through `u → v`, its part up to `u` has `k` edges, so after `k` rounds `dist[u]` is at most its length, and relaxing `u → v` in the next round concludes.

Without a negative cycle, a shortest path never visits a vertex twice (removing a cycle does not make it longer), so it has at most `N − 1` edges: after `N − 1` rounds all distances are exact, and an `N`-th round changes nothing. Conversely, if a negative cycle is reachable from `s`, the values never stabilise: adding the inequalities `dist[b] ≤ dist[a] + l` along the cycle would give `0 ≤ length of the cycle`. Hence the test: **if there is still an improvement in round `N`, there is a negative cycle**.

```python
def bellman_ford(n, arcs, source):
    INFINI = 10 ** 18
    dist = [INFINI] * (n + 1)
    dist[source] = 0
    for tour in range(n):
        change = False
        for a, b, l in arcs:
            if dist[a] < INFINI and dist[a] + l < dist[b]:
                dist[b] = dist[a] + l
                change = True
        if not change:
            return dist  # plus rien ne bouge : distances exactes
    return None  # encore un changement au N-ième tour : cycle négatif


arcs = [(1, 2, 4), (1, 3, 5), (3, 2, -3), (2, 4, 2)]
print(*bellman_ford(4, arcs, 1)[1:])
arcs.append((4, 3, -4))
print("pas de cycle négatif" if bellman_ford(4, arcs, 1) else "cycle négatif")
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

const long long INFINI = (long long)1e18;

struct Arc {
    int a, b;
    long long l;
};

// renvoie false s'il y a un cycle négatif accessible depuis la source
bool bellmanFord(int n, const vector<Arc>& arcs, int source, vector<long long>& dist) {
    dist.assign(n + 1, INFINI);
    dist[source] = 0;
    for (int tour = 0; tour < n; tour++) {
        bool change = false;
        for (const Arc& e : arcs) {
            if (dist[e.a] < INFINI && dist[e.a] + e.l < dist[e.b]) {
                dist[e.b] = dist[e.a] + e.l;
                change = true;
            }
        }
        if (!change) return true;  // plus rien ne bouge : distances exactes
    }
    return false;  // encore un changement au N-ième tour : cycle négatif
}

int main() {
    vector<Arc> arcs = {{1, 2, 4}, {1, 3, 5}, {3, 2, -3}, {2, 4, 2}};
    vector<long long> dist;
    if (bellmanFord(4, arcs, 1, dist)) {
        for (int v = 1; v <= 4; v++) cout << dist[v] << " ";
        cout << "\n";
    }
    arcs.push_back({4, 3, -4});
    cout << (bellmanFord(4, arcs, 1, dist) ? "pas de cycle négatif" : "cycle négatif") << "\n";
    return 0;
}
```

The program prints `0 2 5 4`, then `cycle négatif` (negative cycle): the arc `4 → 3` of length −4 closes the cycle `3 → 2 → 4 → 3`, of length −3 + 2 − 4 = −5. The cost is **O(N × M)**: each round relaxes the `M` edges, and there are at most `N` rounds.

## Floyd-Warshall: all pairs

When we want the distances between **all** pairs of vertices of a small graph, the **Floyd-Warshall** algorithm fits in three loops. Start from a matrix `d`: `0` on the diagonal, the length of the arc `i → j` if it exists (the smallest if there are several), infinity otherwise. Then, for each `k` from `1` to `N`, allow `k` as an intermediate vertex: `d[i][j] = min(d[i][j], d[i][k] + d[k][j])`.

**Invariant.** After step `k`, `d[i][j]` is the length of a shortest path from `i` to `j` whose **intermediate** vertices are all among `1, …, k`. At step `k`, such an optimal path either does not use `k`, and its length was already `d[i][j]`, or goes through `k` once, and splits into a path from `i` to `k` and a path from `k` to `j` whose intermediate vertices are among `1, …, k − 1`. The values `d[i][k]` and `d[k][j]` do not change during step `k`, which allows working in place. At the end, all vertices are allowed: `d` holds the distances.

```python
INFINI = 10 ** 18
n = 4
d = [[0 if i == j else INFINI for j in range(n + 1)] for i in range(n + 1)]
for a, b, l in [(1, 2, 5), (2, 3, 2), (1, 3, 9), (3, 4, 1), (4, 1, 3)]:
    d[a][b] = min(d[a][b], l)

for k in range(1, n + 1):
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if d[i][k] + d[k][j] < d[i][j]:
                d[i][j] = d[i][k] + d[k][j]

for i in range(1, n + 1):
    print(*d[i][1:])
```

```cpp
#include <iostream>
using namespace std;

const long long INFINI = (long long)1e18;

int main() {
    int n = 4;
    long long d[5][5];
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++) d[i][j] = (i == j ? 0 : INFINI);
    int arcs[5][3] = {{1, 2, 5}, {2, 3, 2}, {1, 3, 9}, {3, 4, 1}, {4, 1, 3}};
    for (auto& e : arcs) d[e[0]][e[1]] = min(d[e[0]][e[1]], (long long)e[2]);

    for (int k = 1; k <= n; k++)
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++)
                if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) cout << d[i][j] << " ";
        cout << "\n";
    }
    return 0;
}
```

The first line prints `0 5 7 8`: from `1` to `3`, the path through `2` (5 + 2) beats the direct arc of length 9. The cost is **O(N³)** in time and O(N²) in memory. The algorithm accepts negative lengths; a negative cycle shows up as a final `d[i][i] < 0`. **The order of the loops matters**: `k` must be the outer loop.

## Choosing the right algorithm

Choose according to the lengths and the constraints:

| Situation | Algorithm | Cost |
| --- | --- | --- |
| all lengths equal | breadth-first search | O(N + M) |
| non-negative lengths | Dijkstra with a heap | O((N + M) log N) |
| lengths 0 or 1 | Dijkstra, or a double-ended queue | O(N + M) with the queue |
| negative lengths, one source | Bellman-Ford | O(N × M) |
| all pairs, N ≤ about 400 | Floyd-Warshall | O(N³) |

For lengths 0 or 1, Dijkstra works as is; a double-ended queue (`deque`) does better, pushing to the front the vertex reached by an arc of length 0 and to the back the other one. With **several sources**, put all sources in the heap with distance 0 at the start: you get, for each vertex, the distance to the closest source, as if a fictitious source were joined to each of them by an arc of length 0.

Vertices can also be **numbers**: if only the remainder modulo `K` of a quantity matters, the `K` remainders are the vertices and each operation becomes an arc, computed when the vertex is processed.

## Common mistakes

**The heap upside down.** `priority_queue<pair<long long, int>>` returns the **largest** element, and a pair `(vertex, distance)` brings out the smallest vertex number: Dijkstra becomes wrong or very slow. Forgetting the container in `priority_queue<pair<long long, int>, greater<pair<long long, int>>>` does not compile: `error: no type named 'value_type' in 'struct std::greater<std::pair<long long int, int> >'`. The container `vector<...>` is the second parameter.

**Forgetting the stale-entry test.** Without `if d > dist[u]`, distances remain correct, but a vertex can be processed as many times as it was improved, and the program exceeds the time limit on large graphs.

**Distances that are too large.** A path of 10⁵ edges of length 10⁹ measures 10¹⁴: `long long` is needed in C++. The "infinity" must exceed every possible distance without causing an overflow: with `LLONG_MAX`, the sum `d[i][k] + d[k][j]` in Floyd-Warshall overflows and becomes negative, and the algorithm invents paths. The value 10¹⁸ works: the sum of two infinities can still be represented.

**Vertex numbers.** With vertices from `1` to `N`, a list of size `N` causes `IndexError: list assignment index out of range`: create `N + 1` cells.

## A complete example

**Statement.** A network has `N` cities and `M` two-way roads, each with a toll. We have **one coupon** that makes a single road of the trip free. What is the minimum cost to go from city `1` to city `N`? (`N` up to 10⁵, `M` up to 2 × 10⁵, `-1` if it is impossible.)

**Idea.** The rest of the trip depends on the city and on the state of the coupon. So each city is doubled: vertex `(v, 0)` means "at `v`, coupon still available", vertex `(v, 1)` "at `v`, coupon used". A road `u – v` with toll `l` gives the arcs `(u, 0) → (v, 0)` and `(u, 1) → (v, 1)` of length `l`, and the arc `(u, 0) → (v, 1)` of length 0 (the coupon is used on this road). The answer is the smaller of the distances from `(1, 0)` to `(N, 0)` and to `(N, 1)`.

**Program.**

```python
import sys
import heapq

donnees = sys.stdin.read().split()
n, m = int(donnees[0]), int(donnees[1])
voisins = [[] for _ in range(n + 1)]
for i in range(m):
    a, b, l = int(donnees[2 + 3 * i]), int(donnees[3 + 3 * i]), int(donnees[4 + 3 * i])
    voisins[a].append((b, l))
    voisins[b].append((a, l))

INFINI = 10 ** 18
# dist[k][v] : coût minimal pour être en v, avec k = 1 si le coupon est déjà utilisé
dist = [[INFINI] * (n + 1) for _ in range(2)]
dist[0][1] = 0
tas = [(0, 0, 1)]
while tas:
    d, k, u = heapq.heappop(tas)
    if d > dist[k][u]:
        continue
    for v, l in voisins[u]:
        if d + l < dist[k][v]:            # payer l'arête
            dist[k][v] = d + l
            heapq.heappush(tas, (d + l, k, v))
        if k == 0 and d < dist[1][v]:      # ou utiliser le coupon
            dist[1][v] = d
            heapq.heappush(tas, (d, 1, v))

reponse = min(dist[0][n], dist[1][n])
print(reponse if reponse < INFINI else -1)
```

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <queue>
#include <tuple>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<pair<int, long long>>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        long long l;
        cin >> a >> b >> l;
        voisins[a].push_back({b, l});
        voisins[b].push_back({a, l});
    }

    const long long INFINI = (long long)1e18;
    // dist[k][v] : coût minimal pour être en v, avec k = 1 si le coupon est déjà utilisé
    vector<vector<long long>> dist(2, vector<long long>(n + 1, INFINI));
    priority_queue<tuple<long long, int, int>, vector<tuple<long long, int, int>>, greater<tuple<long long, int, int>>> tas;
    dist[0][1] = 0;
    tas.push({0, 0, 1});
    while (!tas.empty()) {
        auto [d, k, u] = tas.top();
        tas.pop();
        if (d > dist[k][u]) continue;
        for (auto [v, l] : voisins[u]) {
            if (d + l < dist[k][v]) {  // payer l'arête
                dist[k][v] = d + l;
                tas.push({d + l, k, v});
            }
            if (k == 0 && d < dist[1][v]) {  // ou utiliser le coupon
                dist[1][v] = d;
                tas.push({d, 1, v});
            }
        }
    }

    long long reponse = min(dist[0][n], dist[1][n]);
    cout << (reponse < INFINI ? reponse : -1) << "\n";
    return 0;
}
```

**Checking by hand.** With the input

```text
5 6
1 2 4
2 5 10
1 3 2
3 4 3
4 5 3
3 5 20
```

the best trip without a coupon is `1 → 3 → 4 → 5`, costing 8. With the coupon, take `1 → 3` (2) then road `3 – 5` for free: cost 2. The program prints `2`.

**Why it is correct.** A trip with at most one free road corresponds to a path of the same cost in the doubled graph: floor 0 until the free road, going up through the arc of length 0, then floor 1. Conversely, no arc goes down: a path of the doubled graph goes up at most once and describes such a trip. Lengths are non-negative: Dijkstra applies. **Cost**: `2N` vertices and at most `6M` arcs, so O((N + M) log N). Trying each road as the free one in turn would cost `M` runs of Dijkstra.

## Key takeaways

- Dijkstra computes distances from a source when lengths are non-negative, in O((N + M) log N), with a heap of pairs `(distance, vertex)` and lazy deletion of stale entries.
- Its proof relies on an invariant: a vertex that leaves the heap with an up-to-date distance has its true distance, because no detour can be shorter. A single negative length is enough to break it.
- To recover a path, store `pred[v]` at each improvement, then walk back from the destination.
- Bellman-Ford accepts negative lengths, in O(N × M): after `k` rounds, all paths with at most `k` edges are taken into account; an improvement in round `N` reveals a negative cycle.
- Floyd-Warshall gives all pairs in O(N³), with `k` as the outer loop; the invariant is about the allowed intermediate vertices.
- Many problems become shortest paths once the right vertices are chosen: several sources, states (place, information), remainders modulo `K`. Use `long long` and an infinity that does not overflow.
