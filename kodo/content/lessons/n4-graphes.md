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

Ce parcours avec pile marque les sommets dès l'empilement : il visite bien toute la composante, mais pas exactement dans l'ordre d'un vrai DFS récursif. C'est sans importance pour compter les composantes.

Pour les composantes, BFS et DFS conviennent tous les deux ; pour une **distance**, seul le BFS convient.

## Colorier en deux couleurs

On veut parfois donner à chaque sommet une étiquette `0` ou `1`, de sorte que les deux extrémités de chaque arête aient des étiquettes différentes. Un BFS s'en charge : le départ reçoit `0`, et chaque nouveau voisin reçoit l'étiquette opposée à celle du sommet d'où l'on vient. Si un voisin déjà étiqueté porte **la même** étiquette que le sommet courant, le graphe contient un cycle de longueur impaire : c'est impossible.

```python
coul = [-1] * (n + 1)   # -1 : pas encore étiqueté
possible = True
coul[depart] = 0
file = deque([depart])
while file:
    u = file.popleft()
    for v in voisins[u]:
        if coul[v] == -1:
            coul[v] = 1 - coul[u]
            file.append(v)
        elif coul[v] == coul[u]:
            possible = False   # deux voisins de même étiquette
```

```cpp
vector<int> coul(n + 1, -1);   // -1 : pas encore étiqueté
bool possible = true;
coul[depart] = 0;
queue<int> file;
file.push(depart);
while (!file.empty()) {
    int u = file.front();
    file.pop();
    for (int v : voisins[u]) {
        if (coul[v] == -1) {
            coul[v] = 1 - coul[u];
            file.push(v);
        } else if (coul[v] == coul[u]) {
            possible = false;   // deux voisins de même étiquette
        }
    }
}
```

L'étiquette du départ ne décide que de sa propre composante : comme pour les compter, lance un parcours depuis chaque sommet pas encore étiqueté, et traite chaque composante séparément.

## Plus court chemin sur une grille

Une grille est un graphe implicite : chaque case libre est un sommet relié à ses quatre voisines libres, que l'on calcule à la volée. Un BFS depuis la case de départ donne la distance de chaque case.

Attention en Python : avec `sys.stdin.buffer`, chaque ligne lue est un objet `bytes`, et `ligne[j]` est un **nombre**, pas un caractère. Le test `ligne[j] != '#'` serait alors toujours vrai. Décode les lignes avec `.decode()`, comme ci-dessous, ou compare avec `ord('#')`.

```python
r, c = int(donnees[0]), int(donnees[1])
grille = [ligne.decode() for ligne in donnees[2:2 + r]]
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
vector<string> grille(r);
for (string& ligne : grille) cin >> ligne;
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

On peut aussi enchaîner deux BFS. Si quelque chose se répand dans la grille pendant que tu te déplaces, un premier BFS (souvent à sources multiples) calcule la minute `t[x]` où cela atteint chaque case. Le second BFS, depuis ta position, n'entre dans une case à la minute `d` que si `d < t[x]` : tu y arrives avant.

## À retenir

- Un graphe se range en **listes d'adjacence** : O(N + M) en mémoire.
- Le **BFS** (avec une file) donne les plus courtes distances en nombre d'arêtes, en O(N + M) ; marque les sommets dès leur ajout.
- Le **DFS** (avec une pile, sans récursion profonde en Python) et le BFS trouvent les **composantes connexes** : un parcours par sommet non visité.
- **Deux couleurs** : étiquettes `0`/`1` alternées pendant le parcours ; deux voisins de même étiquette rendent la chose impossible. Chaque composante se traite à part.
- Sur une grille, les voisines se calculent à la volée ; plusieurs sources se traitent en un seul BFS, et deux BFS à la suite permettent de devancer une propagation.
