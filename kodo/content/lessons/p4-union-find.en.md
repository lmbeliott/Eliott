A network is built link after link, and we want to know at any moment whether two vertices are connected. Running a traversal for each question costs O(N + M): far too much for hundreds of thousands of questions. The **Union-Find** structure answers in almost constant time, provided links are only added. It is also the engine of Kruskal's algorithm, which builds a **minimum spanning tree**: the cheapest network that connects all vertices.

## Disjoint sets

Sets are **disjoint** if they have no element in common. A **partition** of the elements `1, …, N` is a division into disjoint sets that contain all of them, for example the connected components of a graph. Union-Find manages a partition with two operations:

- `trouver(x)` (find) returns the **representative** of the set of `x`, an element chosen in that set. Two elements are in the same set exactly when they have the same representative;
- `unir(a, b)` (union) merges the set of `a` and the set of `b`.

At first, each element is alone in its set.

## Two naive versions

**An array of labels.** Store `etiquette[x]`, the representative of `x`. `trouver` costs one operation, but `unir` must relabel a whole set: O(N). With `N − 1` unions, this can reach N² / 2 operations, for example by always adding the big set to the single element.

**A forest.** Each set becomes a **rooted tree**: each element points to a `parent` in its set, and the representative is the **root**, which points to itself. `trouver(x)` climbs the parents up to the root; `unir(a, b)` hangs the root of one under the root of the other. The union costs nothing any more, but a search costs the depth of `x`. If the old tree is always hung under an isolated element, we build a chain of `N` elements, and each search can cost `N`.

## Union by size and path compression

Two simple ideas make the forest very efficient.

**Union by size** always hangs the root of the **smaller** tree under that of the larger one; keep `taille[r]` (size) for each root `r`. Then the depth of an element never exceeds log₂ N. Indeed, the depth of `x` increases by 1 only when the root of its tree goes under another one, at least as large: the size of the tree of `x` at least doubles. Since it never exceeds `N`, this happens at most log₂ N times.

**Path compression** takes advantage of each search: once the root is found, make all elements met on the way point directly to it. Later searches on these elements cost a single step.

With both ideas, a sequence of `K` operations costs O(K × α(N)), where α is a function growing so slowly that it is at most 4 for any realistic `N`. We admit this result; in practice, each operation takes **nearly constant time**. Write `trouver` with two loops rather than recursively. With union by size, the recursion would stay short; but if roots are attached without comparing sizes, chains of thousands of elements appear, and a recursive search exceeds the allowed recursion depth in Python. Loops work in every case.

```python
n = 6
parent = list(range(n + 1))  # au départ, chaque élément est seul : sa propre racine
taille = [1] * (n + 1)


def trouver(x):
    racine = x
    while parent[racine] != racine:  # on monte jusqu'à la racine
        racine = parent[racine]
    while parent[x] != racine:       # compression : tout le chemin pointe vers la racine
        parent[x], x = racine, parent[x]
    return racine


def unir(a, b):
    a, b = trouver(a), trouver(b)
    if a == b:
        return False                 # déjà dans le même ensemble
    if taille[a] < taille[b]:
        a, b = b, a
    parent[b] = a                    # la plus petite arborescence passe sous la plus grande
    taille[a] += taille[b]
    return True


print(unir(1, 2), unir(3, 4), unir(2, 4), unir(1, 3))
print(trouver(4) == trouver(1), trouver(5) == trouver(1), taille[trouver(3)])
```

```cpp
#include <iostream>
#include <numeric>
#include <vector>
using namespace std;

vector<int> parent, taille;

int trouver(int x) {
    int racine = x;
    while (parent[racine] != racine) racine = parent[racine];  // on monte jusqu'à la racine
    while (parent[x] != racine) {  // compression : tout le chemin pointe vers la racine
        int suivant = parent[x];
        parent[x] = racine;
        x = suivant;
    }
    return racine;
}

bool unir(int a, int b) {
    a = trouver(a);
    b = trouver(b);
    if (a == b) return false;  // déjà dans le même ensemble
    if (taille[a] < taille[b]) swap(a, b);
    parent[b] = a;  // la plus petite arborescence passe sous la plus grande
    taille[a] += taille[b];
    return true;
}

int main() {
    int n = 6;
    parent.resize(n + 1);
    iota(parent.begin(), parent.end(), 0);  // au départ, chaque élément est seul : sa propre racine
    taille.assign(n + 1, 1);
    cout << boolalpha;
    cout << unir(1, 2) << " " << unir(3, 4) << " " << unir(2, 4) << " " << unir(1, 3) << "\n";
    cout << (trouver(4) == trouver(1)) << " " << (trouver(5) == trouver(1)) << " " << taille[trouver(3)] << "\n";
    return 0;
}
```

The program prints `True True True False`, then `True False 4` (in C++, `true` and `false`). The first three unions merge `{1, 2}`, `{3, 4}`, then both; the fourth finds `1` and `3` already together and returns `False`. Then `4` and `1` have the same representative, `5` is alone, and the set of `3` contains 4 elements.

## Dynamic connectivity

To follow the components of a graph to which edges are **added**, call `unir(a, b)` for each new edge `a – b`. Invariant: two vertices have the same representative exactly when a path joins them. An edge creates new paths only between the component of `a` and that of `b`, which the union merges. The number of components (it drops by 1 at each successful union) and the size of the largest one (the maximum of the sizes after each merge) can be kept up to date.

**Deleting edges.** Union-Find cannot undo a union. But if all deletions are known in advance, the problem is solved **offline**, backwards: start from the final graph, without all deleted edges, then go back in time; each deletion becomes an addition. Record the answers during this walk back and print them in normal order.

The same principle applies to any question depending on a threshold: sorting the thresholds often turns the problem into a sequence of additions.

## Minimum spanning trees

A **spanning tree** of a connected graph with `N` vertices is a set of `N − 1` edges connecting all vertices without forming a cycle. Its **weight** is the sum of the weights of its edges. We look for a **minimum spanning tree**, abbreviated MST: the cheapest network that connects everything.

A **cut** is a division of the vertices into two non-empty groups; an edge **crosses** it if its endpoints are in different groups.

**Cut property.** For any cut, if `e` is an edge of minimum weight among those crossing it, there is an MST containing `e`. *Proof.* Let `T` be an MST not containing `e`. Adding `e` to `T` creates a cycle; going around it, we move from one group to the other through `e`, and must come back: another edge `f` of the cycle crosses the cut. By the choice of `e`, weight(`f`) ≥ weight(`e`). Removing `f` gives a spanning tree of weight at most that of `T`, hence minimum, containing `e`.

**Cycle property.** An edge `e` strictly heavier than all other edges of a cycle `C` belongs to no MST. *Proof.* Let `T` be a spanning tree containing `e`. Removing `e` from `T` splits the vertices into two groups, and `e` is the only edge of `T` joining them. The rest of the cycle `C` goes from one end of `e` to the other: one of its edges, `f`, joins the two groups, and `f` is not in `T`. Replacing `e` by `f` gives a strictly lighter spanning tree: `T` was not minimal. If `e` is only **at least as heavy** as the other edges of the cycle, the same exchange does not increase the weight: there is an MST without `e`, and `e` can be removed from the graph without changing the minimum weight. This removal can be repeated as long as some edge is the heaviest of a cycle still present.

## Kruskal's algorithm

Sort the edges by increasing weight, then go through them with a Union-Find: keep an edge if it joins two different components, otherwise ignore it since it would close a cycle.

```python
n = 5
aretes = [(1, 2, 4), (1, 3, 1), (2, 3, 3), (2, 4, 2), (3, 4, 5), (4, 5, 7), (3, 5, 6)]
parent = list(range(n + 1))
taille = [1] * (n + 1)


def trouver(x):
    racine = x
    while parent[racine] != racine:
        racine = parent[racine]
    while parent[x] != racine:
        parent[x], x = racine, parent[x]
    return racine


poids, choisies = 0, []
for a, b, w in sorted(aretes, key=lambda e: e[2]):  # par poids croissant
    ra, rb = trouver(a), trouver(b)
    if ra != rb:                                      # relie deux composantes : on la garde
        if taille[ra] < taille[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        taille[ra] += taille[rb]
        poids += w
        choisies.append((a, b))
print(*choisies)
print(poids)
```

```cpp
#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>
using namespace std;

vector<int> parent, taille;

int trouver(int x) {
    int racine = x;
    while (parent[racine] != racine) racine = parent[racine];
    while (parent[x] != racine) {
        int suivant = parent[x];
        parent[x] = racine;
        x = suivant;
    }
    return racine;
}

struct Arete {
    int a, b, w;
};

int main() {
    int n = 5;
    vector<Arete> aretes = {{1, 2, 4}, {1, 3, 1}, {2, 3, 3}, {2, 4, 2}, {3, 4, 5}, {4, 5, 7}, {3, 5, 6}};
    parent.resize(n + 1);
    iota(parent.begin(), parent.end(), 0);
    taille.assign(n + 1, 1);

    sort(aretes.begin(), aretes.end(), [](const Arete& e, const Arete& f) { return e.w < f.w; });  // par poids croissant
    long long poids = 0;
    for (const Arete& e : aretes) {
        int ra = trouver(e.a), rb = trouver(e.b);
        if (ra != rb) {  // relie deux composantes : on la garde
            if (taille[ra] < taille[rb]) swap(ra, rb);
            parent[rb] = ra;
            taille[ra] += taille[rb];
            poids += e.w;
            cout << "(" << e.a << ", " << e.b << ") ";
        }
    }
    cout << "\n" << poids << "\n";
    return 0;
}
```

The program keeps `(1, 3)`, `(2, 4)`, `(2, 3)` and `(3, 5)`, for a weight of 12. Edges `1 – 2` (weight 4) and `3 – 4` (weight 5) come when their endpoints are already connected.

**Why it is correct.** Invariant: the kept edges are contained in an MST. When Kruskal keeps `e = u – v`, consider the cut between the component `C` of `u` (formed by the kept edges) and the rest. No kept edge crosses it. An edge lighter than `e` crossing it was examined before `e`; at that time, its ends were already in different components (components only merge), so it was kept, and its ends would now be in the same component: impossible. So `e` has minimum weight among the edges crossing the cut. The exchange of the previous proof removes an edge `f` crossing the cut, hence not a kept edge: the MST obtained contains all kept edges and `e`. At the end, we have `N − 1` edges (if the graph is connected) contained in an MST: it is that MST.

**Complexity.** O(M log M) for sorting, plus `M` Union-Find operations in nearly constant time. If the graph is not connected, fewer than `N − 1` edges are obtained: a minimum **spanning forest**.

**Equal weights.** Sorting does not say in which order to put edges of equal weight, and the proof never assumed distinct weights: every order gives an MST, but not always the same one. If all weights are distinct, the MST is **unique**. Indeed, if `T` and `T'` were two different MSTs, let `e` be the lightest edge belonging to one but not to the other, say to `T`. Adding `e` to `T'` creates a cycle, which contains an edge `f` missing from `T` (otherwise `T` would contain a cycle). Since `f` is in `T'` but not in `T`, it is heavier than `e`: `T'` without `f` and with `e` would be a spanning tree lighter than `T'`.

## Prim's algorithm

Prim grows a single tree from a vertex. At each step, it adds the lightest edge joining the tree to an outside vertex: this is the cut property, applied to the cut (tree, rest). Keep in a heap the pairs `(weight, vertex)` of candidate edges, with the same lazy deletion as in Dijkstra: a vertex that leaves the heap while already in the tree is ignored.

```python
import heapq

n = 5
aretes = [(1, 2, 4), (1, 3, 1), (2, 3, 3), (2, 4, 2), (3, 4, 5), (4, 5, 7), (3, 5, 6)]
voisins = [[] for _ in range(n + 1)]
for a, b, w in aretes:
    voisins[a].append((b, w))
    voisins[b].append((a, w))

dans_arbre = [False] * (n + 1)
poids = 0
tas = [(0, 1)]  # (poids de l'arête qui rattache le sommet, sommet)
while tas:
    w, u = heapq.heappop(tas)
    if dans_arbre[u]:
        continue  # entrée périmée : u est déjà rattaché
    dans_arbre[u] = True
    poids += w
    for v, wv in voisins[u]:
        if not dans_arbre[v]:
            heapq.heappush(tas, (wv, v))
print(poids)
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
    int aretes[7][3] = {{1, 2, 4}, {1, 3, 1}, {2, 3, 3}, {2, 4, 2}, {3, 4, 5}, {4, 5, 7}, {3, 5, 6}};
    vector<vector<pair<int, int>>> voisins(n + 1);
    for (auto& e : aretes) {
        voisins[e[0]].push_back({e[1], e[2]});
        voisins[e[1]].push_back({e[0], e[2]});
    }

    vector<bool> dansArbre(n + 1, false);
    long long poids = 0;
    // (poids de l'arête qui rattache le sommet, sommet)
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> tas;
    tas.push({0, 1});
    while (!tas.empty()) {
        auto [w, u] = tas.top();
        tas.pop();
        if (dansArbre[u]) continue;  // entrée périmée : u est déjà rattaché
        dansArbre[u] = true;
        poids += w;
        for (auto [v, wv] : voisins[u])
            if (!dansArbre[v]) tas.push({wv, v});
    }
    cout << poids << "\n";
    return 0;
}
```

The program prints `12`, as Kruskal does. Each edge enters the heap at most twice: O(M log M). The only difference with Dijkstra is the key: the weight of the last edge, not the distance from the start.

## Minimum bottleneck paths

The **bottleneck** of a path is the weight of its heaviest edge. Between two vertices `u` and `v`, the path in an MST has the smallest possible bottleneck. Indeed, if Kruskal connects `u` and `v` for the first time with an edge of weight `w`, all lighter edges were already examined without connecting them: every path from `u` to `v` contains an edge of weight at least `w`, and the path in the tree only uses edges of weight at most `w`. So "can we go from `u` to `v` without an edge heavier than `S`?" is answered by adding edges by increasing weight, while sorting the questions by threshold.

## Common mistakes

**A recursive search in Python.** The version `parent[x] = trouver(parent[x])` is elegant, but without union by size a chain of 5,000 elements can form, and the search then causes `RecursionError: maximum recursion depth exceeded`. Use the two loops, and union by size.

**Uniting without finding the roots.** Writing `parent[a] = b` joins `a` to `b` but detaches `a` from its former set: the other elements of that set are lost. No message, the answer is wrong. Always hang a root under another root.

**Comparing parents instead of roots.** `parent[a] == parent[b]` can be false while `a` and `b` are in the same set. You need `trouver(a) == trouver(b)`.

**Sorting edges on the wrong key.** `sorted(aretes)` sorts the triples `(a, b, w)` by `a`: Kruskal becomes wrong. Put the weight first, or give a key.

**Forgetting disconnected graphs.** Kruskal reports nothing: count the kept edges (or the components) to know whether everything is connected.

## A complete example

**Statement.** We want to split `N` cities into `K` non-empty groups (`K ≥ 2`). The `M` links have lengths, and the graph is connected. The **spacing** of a split is the smallest length of a link between two cities of different groups. What is the largest possible spacing?

**Idea.** Short links should stay inside groups. Run Kruskal, which first merges the closest cities, and stop when `K` components remain: these are the groups. The spacing is the length of the next edge Kruskal would have kept.

**Program.**

```python
import sys

donnees = sys.stdin.read().split()
n, m, k = int(donnees[0]), int(donnees[1]), int(donnees[2])
aretes = []
for i in range(m):
    a, b, w = int(donnees[3 + 3 * i]), int(donnees[4 + 3 * i]), int(donnees[5 + 3 * i])
    aretes.append((w, a, b))
aretes.sort()

parent = list(range(n + 1))
taille = [1] * (n + 1)


def trouver(x):
    racine = x
    while parent[racine] != racine:
        racine = parent[racine]
    while parent[x] != racine:
        parent[x], x = racine, parent[x]
    return racine


groupes = n
for w, a, b in aretes:
    ra, rb = trouver(a), trouver(b)
    if ra == rb:
        continue
    if groupes == k:     # première arête entre deux groupes différents : c'est l'écart
        print(w)
        break
    if taille[ra] < taille[rb]:
        ra, rb = rb, ra
    parent[rb] = ra
    taille[ra] += taille[rb]
    groupes -= 1
```

```cpp
#include <algorithm>
#include <iostream>
#include <numeric>
#include <tuple>
#include <vector>
using namespace std;

vector<int> parent, taille;

int trouver(int x) {
    int racine = x;
    while (parent[racine] != racine) racine = parent[racine];
    while (parent[x] != racine) {
        int suivant = parent[x];
        parent[x] = racine;
        x = suivant;
    }
    return racine;
}

int main() {
    int n, m, k;
    cin >> n >> m >> k;
    vector<tuple<int, int, int>> aretes(m);
    for (auto& [w, a, b] : aretes) cin >> a >> b >> w;
    sort(aretes.begin(), aretes.end());
    parent.resize(n + 1);
    iota(parent.begin(), parent.end(), 0);
    taille.assign(n + 1, 1);

    int groupes = n;
    for (auto [w, a, b] : aretes) {
        int ra = trouver(a), rb = trouver(b);
        if (ra == rb) continue;
        if (groupes == k) {  // première arête entre deux groupes différents : c'est l'écart
            cout << w << "\n";
            break;
        }
        if (taille[ra] < taille[rb]) swap(ra, rb);
        parent[rb] = ra;
        taille[ra] += taille[rb];
        groupes--;
    }
    return 0;
}
```

**Checking by hand.** With the input

```text
6 8 2
1 2 1
2 3 2
4 5 2
5 6 1
3 4 7
1 6 9
2 5 8
1 3 4
```

Kruskal keeps `1 – 2`, `5 – 6`, `2 – 3` and `4 – 5`: the groups `{1, 2, 3}` and `{4, 5, 6}` remain. Edge `1 – 3` (4) is internal; the next one, `3 – 4` (7), joins both groups: the program prints `7`. With `K = 3`, it stops after `2 – 3` and prints `2`.

**Why it is correct.** Let `d` be the answer printed. *The split obtained has spacing `d`*: shorter edges were examined and are internal, and the edge of length `d` joins two groups. *No split does better*: if each Kruskal component fitted entirely in one group, the `K` non-empty groups would be unions of the `K` components, hence exactly these components. So another split cuts some component `C` between two groups. The kept edges connect `C`: one of them joins two different groups, and its length is at most `d`, since it was examined before. The spacing of that split is at most `d`. **Cost**: O(M log M).

## Key takeaways

- Union-Find manages a partition with `trouver` and `unir`; with union by size and path compression, each operation takes nearly constant time. Write the search with loops in Python.
- Union by size guarantees a depth of at most log₂ N: an element only goes down when the size of its set doubles.
- Union-Find follows connectivity when edges are added; deletions known in advance are processed backwards, as additions.
- Cut property: the lightest edge crossing a cut belongs to a minimum spanning tree; cycle property: the heaviest edge of a cycle can be removed. The first proves Kruskal (sort then Union-Find, O(M log M)) and Prim (heap, O(M log M)).
- In a minimum spanning tree, the path between two vertices minimises the heaviest edge: threshold questions are handled by adding edges by increasing weight.
