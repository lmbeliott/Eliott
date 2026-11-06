Des villes reliées par des routes, des pages web reliées par des liens, des cases voisines dans une grille : tout cela forme un **graphe**. Les éléments sont les **sommets** (numérotés de `1` à `N`) et les liaisons sont les **arêtes**.

## Les listes d'adjacence

Pour chaque sommet, on garde la liste de ses voisins. Dans un graphe non orienté, une arête entre `a` et `b` se parcourt dans les deux sens : on l'ajoute dans les deux listes.

```python
import sys
donnees = sys.stdin.buffer.read().split()
n, m = int(donnees[0]), int(donnees[1])
voisins = [[] for _ in range(n + 1)]
for i in range(m):
    a, b = int(donnees[2 + 2 * i]), int(donnees[3 + 2 * i])
    voisins[a].append(b)
    voisins[b].append(a)
```

```cpp
int n, m;
cin >> n >> m;
vector<vector<int>> voisins(n + 1);
for (int i = 0; i < m; i++) {
    int a, b;
    cin >> a >> b;
    voisins[a].push_back(b);
    voisins[b].push_back(a);
}
```

Pour les grosses entrées : `sys.stdin.buffer` en Python, `ios::sync_with_stdio(false);` en C++.

## Le parcours en largeur

Le **parcours en largeur** (BFS) part d'un sommet et visite les sommets par distance croissante : d'abord les voisins, puis les voisins des voisins… On utilise une **file** : on retire le premier sommet, et chacun de ses voisins pas encore vus reçoit sa distance plus un et entre au bout de la file.

```python
from collections import deque
dist = [-1] * (n + 1)   # -1 : pas encore atteint
dist[1] = 0
file = deque([1])
while file:
    u = file.popleft()
    for v in voisins[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            file.append(v)
```

```cpp
vector<int> dist(n + 1, -1);   // -1 : pas encore atteint
queue<int> file;
dist[1] = 0;
file.push(1);
while (!file.empty()) {
    int u = file.front();
    file.pop();
    for (int v : voisins[u]) {
        if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            file.push(v);
        }
    }
}
```

À la fin, `dist[v]` est le nombre minimal d'arêtes pour aller de `1` à `v`, ou `-1` si `v` est inaccessible. Chaque sommet entre une seule fois dans la file et chaque arête est regardée deux fois : le parcours coûte **O(N + M)**. Marque un sommet **au moment où tu l'ajoutes** à la file, sinon il peut y entrer plusieurs fois.

## Le parcours en profondeur et les composantes

Le **parcours en profondeur** (DFS) s'enfonce le plus loin possible avant de revenir en arrière. Écrit récursivement, il dépasse la limite de récursion de Python (1 000 appels) sur une longue chaîne : utilise une **pile** explicite.

Une **composante connexe** est un groupe de sommets reliés entre eux. Pour les compter, on lance un parcours depuis chaque sommet pas encore visité : chaque parcours lancé découvre une nouvelle composante, en entier.

```python
vu = [False] * (n + 1)
composantes = 0
for depart in range(1, n + 1):
    if not vu[depart]:
        composantes += 1
        vu[depart] = True
        pile = [depart]
        while pile:
            u = pile.pop()
            for v in voisins[u]:
                if not vu[v]:
                    vu[v] = True
                    pile.append(v)
```

```cpp
vector<bool> vu(n + 1, false);
int composantes = 0;
for (int depart = 1; depart <= n; depart++) {
    if (vu[depart]) continue;
    composantes++;
    vu[depart] = true;
    vector<int> pile = {depart};
    while (!pile.empty()) {
        int u = pile.back();
        pile.pop_back();
        for (int v : voisins[u]) {
            if (!vu[v]) {
                vu[v] = true;
                pile.push_back(v);
            }
        }
    }
}
```

Pour les composantes, BFS et DFS conviennent tous les deux ; pour une **distance**, seul le BFS convient.

## Plus court chemin sur une grille

Une grille est un graphe implicite : chaque case libre est un sommet relié à ses quatre voisines libres, que l'on calcule à la volée. Un BFS depuis la case de départ donne la distance de chaque case.

```python
dist = [[-1] * c for _ in range(r)]
dist[si][sj] = 0
file = deque([(si, sj)])
while file:
    i, j = file.popleft()
    for ni, nj in ((i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)):
        if 0 <= ni < r and 0 <= nj < c and grille[ni][nj] != '#' and dist[ni][nj] == -1:
            dist[ni][nj] = dist[i][j] + 1
            file.append((ni, nj))
```

```cpp
vector<vector<int>> dist(r, vector<int>(c, -1));
queue<pair<int, int>> file;
dist[si][sj] = 0;
file.push({si, sj});
int di[4] = {1, -1, 0, 0}, dj[4] = {0, 0, 1, -1};
while (!file.empty()) {
    auto [i, j] = file.front();
    file.pop();
    for (int d = 0; d < 4; d++) {
        int ni = i + di[d], nj = j + dj[d];
        if (ni >= 0 && ni < r && nj >= 0 && nj < c && grille[ni][nj] != '#' && dist[ni][nj] == -1) {
            dist[ni][nj] = dist[i][j] + 1;
            file.push({ni, nj});
        }
    }
}
```

Pour la distance de chaque case à la **plus proche** de plusieurs sources, mets toutes les sources dans la file au départ, à distance `0`, puis fais un seul BFS : c'est le **BFS à sources multiples**.

## À retenir

- Un graphe se range en **listes d'adjacence** : O(N + M) en mémoire.
- Le **BFS** (avec une file) donne les plus courtes distances en nombre d'arêtes, en O(N + M).
- Le **DFS** (avec une pile) et le BFS trouvent les **composantes connexes** : un parcours par sommet non visité.
- Sur une grille, les voisines se calculent à la volée ; plusieurs sources se traitent en un seul BFS.
- Marque les sommets dès leur ajout, et évite la récursion profonde en Python.
