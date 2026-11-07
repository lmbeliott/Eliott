Level 4 brought together the main tools of classic algorithms: binary search, divide and conquer, greedy algorithms, arithmetic, graph traversals, implicit graphs, exhaustive search, binary search trees, shortest paths, Union-Find and spanning trees. In a review problem, nothing says which tool to use, and two or three are often needed at once. This chapter gathers the reflexes that help recognise them, model a problem, prove the solution and avoid the classic mistakes.

## Start from the constraints

As in level 3, read the constraints first: about 10⁸ simple operations per second in C++, 10⁷ in Python.

| Constraints | Target complexity | Typical level 4 tools |
| --- | --- | --- |
| N ≤ 10 to 20 | O(N!) or O(2^N) | exhaustive search, backtracking with pruning |
| N ≤ 400 | O(N³) | Floyd-Warshall, three loops |
| N, M ≤ 2 × 10⁵ | O((N + M) log N) | sorting, binary search, Dijkstra, Kruskal, Union-Find, traversals |
| values ≤ 10⁷ | O(V log log V) | sieve, going through multiples |
| N ≤ 10¹² | O(√N) | enumerating divisors, factorisation |
| N ≤ 10¹⁸ | O(log N) | Euclid, fast exponentiation, binary search on the answer |

The table reads both ways: values up to 10¹⁸ forbid any array indexed by value, and an `N` of 15 invites trying everything.

## Recognising the technique

Some phrasings come back again and again.

- **"The largest minimum", "the smallest maximum", "the smallest value such that…".** This is often a **binary search on the answer**: replace the optimisation question with a yes/no question ("can we achieve at least `D`?"), provided it is **monotone**. The yes/no question is then solved by a greedy algorithm, a traversal or a shortest path.
- **"Choose as well as possible, one decision at a time".** Sorting followed by a greedy choice is sometimes enough; it then needs an exchange argument. If no argument can be found, maybe there is none: look for a counterexample on a small input.
- **Very few objects.** With 8 elements, 8! = 40,320 orders; with 20, 2²⁰ ≈ 10⁶ subsets. Exhaustive search is the right answer, with pruning as soon as a branch can no longer beat the best known result.
- **Relations, transformations, states.** As soon as one moves from one situation to another through operations, it is a graph: breadth-first search to count steps, Dijkstra for positive costs, Union-Find to know who is connected to whom when links are only added.
- **Very large numbers, but an arithmetic structure.** Divisors, prime factors, GCD, remainders: look for a property that reduces the computation to few cases (the divisors of `N`, the remainders modulo `K`, the distinct prime factors).

## Modelling with a graph

Choosing the **vertices** is the most important decision. They can be:

- places, grid cells, positions;
- **numbers** or **remainders**: if only the remainder modulo `K` matters, there are only `K` vertices, even for huge numbers;
- **states** `(place, information)`: a coupon already used or not, keys picked up, a number of steps modulo 2;
- **auxiliary vertices**: one vertex per prime, joined to all its multiples, replaces millions of edges between numbers sharing this factor; a fictitious source joined to several starts handles them all in a single traversal.

The **edges** are the allowed operations, with their cost. Then check a **correspondence**: each solution of the problem gives a path of the same cost, and each path gives a solution at most as expensive. This two-way check is the proof of the model.

A few transformations widen the field a lot:

- **Going back in time.** Deletions known in advance become additions when events are processed backwards. A problem "from the end" (reach `N` starting from `0`) is often easier to think about from `N`: what was the last operation?
- **Sorting thresholds.** Questions "with only the edges of weight at most `S`" are handled by adding edges by increasing weight, as in Kruskal.
- **Reducing edges.** A cycle property, or an exchange argument, often shows that only a few edges can be useful: between neighbours after sorting, or towards the smallest element of a group.

Finally, choose the algorithm according to the weights: breadth-first search if everything costs 1, Dijkstra for non-negative costs, Bellman-Ford if there are negative costs, Floyd-Warshall for all pairs of a small graph, Kruskal or Prim for a minimum-cost network.

## Proving: a checklist

A solution that passes the samples can be wrong. Before submitting, ask which argument justifies it.

1. **An invariant.** For a loop: what remains true at each iteration ("processed vertices have their true distance", "two vertices have the same root exactly when they are connected"). Check that it holds at the start, is preserved by one iteration, and gives the answer at the end.
2. **An exchange argument.** For a greedy algorithm: start from any optimal solution and modify it step by step towards the greedy one without making it worse. Often in the form "the `i`-th greedy choice is at least as good as the `i`-th choice of any solution", proved by induction.
3. **The cut or cycle property.** For a spanning tree: the lightest edge crossing a cut is in a minimum tree; the heaviest edge of a cycle can be removed.
4. **Monotonicity.** For a binary search on the answer: if `D` works, every easier `D` works too. Without monotonicity, binary search gives anything.
5. **Termination.** An integer quantity that decreases: an index, the sum `P + Q` in a Euclid-like algorithm, the value of the vertex in a graph whose arcs go to smaller numbers.
6. **The cost.** Recount with the maximum values, without forgetting hidden costs: a search in a list, a copy, a sort inside a loop.

## The pitfalls of the level

- **Overflow.** A sum of 10⁵ lengths of 10⁹, a product of two component sizes, `K (K + 1) / 2` for `K = 10⁹`: `long long` in C++. Before multiplying two large numbers, compare with a division instead (`a > limit / b`). The "infinity" must exceed every real value without overflowing when added.
- **Recursion depth.** A recursive depth-first search on a chain of 10⁵ vertices, or a recursive find in Union-Find, causes `RecursionError` in Python and can crash a C++ program: write iterative versions, with an explicit stack or loops.
- **Indices.** Vertices numbered from `1` to `N`: arrays of size `N + 1`. Prefixes: the segment from `L` to `R` corresponds to prefixes `L − 1` and `R`.
- **Degenerate cases.** `N = 1`, a graph without edges, loops, multiple edges, equal values, an impossible answer (`-1`), the number `1`, which is not prime.
- **Binary search bounds.** When keeping `low = middle` on success, take the middle upwards, otherwise the loop never stops.
- **Stale entries.** In Dijkstra and Prim with lazy deletion, ignore a vertex that leaves the heap already processed.

## Testing against a naive solution

The level 3 method remains the best weapon: compare the program with a **naive** solution, slow but obvious, on hundreds of small random inputs. In level 4, naive solutions are often a different kind of algorithm: Bellman-Ford or Floyd-Warshall to check Dijkstra, trying all subsets of edges to check Kruskal, trying all values to check a binary search, full enumeration to check a greedy algorithm.

```python
import heapq
import random

INFINI = 10 ** 18


def rapide(n, aretes):  # Dijkstra depuis le sommet 1
    voisins = [[] for _ in range(n + 1)]
    for a, b, l in aretes:
        voisins[a].append((b, l))
        voisins[b].append((a, l))
    dist = [INFINI] * (n + 1)
    dist[1] = 0
    tas = [(0, 1)]
    while tas:
        d, u = heapq.heappop(tas)
        if d > dist[u]:
            continue
        for v, l in voisins[u]:
            if d + l < dist[v]:
                dist[v] = d + l
                heapq.heappush(tas, (dist[v], v))
    return dist


def naif(n, aretes):  # Bellman-Ford, sans finesse : N tours complets
    dist = [INFINI] * (n + 1)
    dist[1] = 0
    for _ in range(n):
        for a, b, l in aretes:
            dist[b] = min(dist[b], dist[a] + l)
            dist[a] = min(dist[a], dist[b] + l)
    return dist


random.seed(1)
for essai in range(1000):
    n = random.randint(1, 6)
    aretes = [(random.randint(1, n), random.randint(1, n), random.randint(1, 9)) for _ in range(random.randint(0, 8))]
    if rapide(n, aretes) != naif(n, aretes):
        print("Différence :", n, aretes)
        break
else:
    print("1000 essais identiques")
```

```cpp
#include <algorithm>
#include <cstdlib>
#include <functional>
#include <iostream>
#include <queue>
#include <tuple>
#include <utility>
#include <vector>
using namespace std;

const long long INFINI = (long long)1e18;
typedef vector<tuple<int, int, long long>> Aretes;

vector<long long> rapide(int n, const Aretes& aretes) {  // Dijkstra depuis le sommet 1
    vector<vector<pair<int, long long>>> voisins(n + 1);
    for (auto [a, b, l] : aretes) {
        voisins[a].push_back({b, l});
        voisins[b].push_back({a, l});
    }
    vector<long long> dist(n + 1, INFINI);
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
                tas.push({dist[v], v});
            }
        }
    }
    return dist;
}

vector<long long> naif(int n, const Aretes& aretes) {  // Bellman-Ford, sans finesse : N tours complets
    vector<long long> dist(n + 1, INFINI);
    dist[1] = 0;
    for (int tour = 0; tour < n; tour++) {
        for (auto [a, b, l] : aretes) {
            dist[b] = min(dist[b], dist[a] + l);
            dist[a] = min(dist[a], dist[b] + l);
        }
    }
    return dist;
}

int main() {
    srand(1);
    for (int essai = 0; essai < 1000; essai++) {
        int n = 1 + rand() % 6;
        Aretes aretes(rand() % 9);
        for (auto& [a, b, l] : aretes) {
            a = 1 + rand() % n;
            b = 1 + rand() % n;
            l = 1 + rand() % 9;
        }
        if (rapide(n, aretes) != naif(n, aretes)) {
            cout << "Différence avec N = " << n << " :";
            for (auto [a, b, l] : aretes) cout << " (" << a << ", " << b << ", " << l << ")";
            cout << "\n";
            return 0;
        }
    }
    cout << "1000 essais identiques\n";
    return 0;
}
```

The program prints `1000 essais identiques` (1,000 identical trials). If you forget to add each edge to both neighbour lists, it stops as soon as an example fails and prints `Différence : 2 [(2, 1, 8)]` in Python: with the single edge `2 – 1`, Dijkstra no longer finds vertex `2`. Such a small input can be traced by hand in a minute.

For the test to be useful, inputs must stay **small** (a few vertices, small weights, loops and multiple edges allowed): edge cases show up often. And the naive solution must really be different: copying the same algorithm does not detect a reasoning error.

## Key takeaways

- Read the constraints first: they indicate the target complexity, and hence the family of tools.
- "Largest minimum" or "smallest maximum": binary search on the answer, with a monotone yes/no test, often greedy or shortest-path based.
- Modelling means choosing the vertices (places, numbers, remainders, states, auxiliary vertices) and checking the correspondence between solutions and paths both ways.
- Every solution relies on a named argument: invariant, exchange, cut or cycle, monotonicity, termination, and an operation count.
- The pitfalls come back: overflow, too deep recursion, shifted indices, degenerate cases. A test against a naive solution on small inputs reveals almost all of them.
