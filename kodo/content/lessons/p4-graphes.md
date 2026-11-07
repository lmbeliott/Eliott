Un réseau de métro relie des stations par des lignes ; un réseau social relie des personnes qui se connaissent ; un labyrinthe relie des salles par des couloirs. Dans les trois cas, les questions sont les mêmes : peut-on aller d'ici à là ? En combien d'étapes au minimum ? Combien y a-t-il de morceaux séparés ? Toutes ces situations se décrivent par un **graphe**, et deux algorithmes, le parcours en profondeur et le parcours en largeur, y répondent en un temps proportionnel à la taille du graphe. Ce chapitre les présente, avec leur preuve, leur coût et leurs applications.

## Vocabulaire

Un **graphe** est formé de **sommets** et d'**arêtes** ; chaque arête relie deux sommets, ses **extrémités**. On note `N` le nombre de sommets, numérotés de `1` à `N`, et `M` le nombre d'arêtes. Deux sommets reliés par une arête sont **voisins** (ou adjacents). Le **degré** d'un sommet est le nombre d'arêtes qui le touchent.

Le graphe est **non orienté** quand une arête se parcourt dans les deux sens (une route à double sens), et **orienté** quand chaque arête, alors appelée **arc**, va d'un sommet vers un autre (une rue à sens unique). Une **boucle** relie un sommet à lui-même ; deux arêtes qui relient les mêmes sommets sont des **arêtes multiples**.

Un **chemin** est une suite de sommets dont deux consécutifs sont voisins ; sa **longueur** est son nombre d'arêtes. Un **cycle** est un chemin d'au moins une arête qui revient à son point de départ sans réutiliser d'arête ni repasser par un autre sommet. Un graphe non orienté est **connexe** si un chemin relie n'importe quels deux sommets. Sinon, il se découpe en **composantes connexes** : deux sommets sont dans la même composante exactement quand un chemin les relie.

Le graphe d'exemple de tout le chapitre a 7 sommets et 6 arêtes, au format habituel des exercices (`N` et `M`, puis une arête par ligne) :

```text
7 6
1 2
1 5
2 3
2 5
3 4
6 7
```

Il a deux composantes, `{1, 2, 3, 4, 5}` et `{6, 7}`, et un cycle `1 → 2 → 5 → 1`. Le sommet 2 est de degré 3.

Une remarque utile : chaque arête ajoute 1 au degré de chacune de ses deux extrémités, donc **la somme des degrés vaut 2M**. On l'appelle le lemme des poignées de main. Ici, 2 + 3 + 2 + 1 + 2 + 1 + 1 = 12 = 2 × 6.

## Ranger un graphe en mémoire

La représentation la plus utilisée est la **liste d'adjacence** : pour chaque sommet, la liste de ses voisins. Comme les sommets sont numérotés à partir de 1, on crée `N + 1` listes et on n'utilise pas la case 0. Pour un graphe non orienté, chaque arête est ajoutée **dans les deux listes**.

```python
n, m = map(int, input().split())
voisins = [[] for _ in range(n + 1)]    # la case 0 ne sert pas
for _ in range(m):
    a, b = map(int, input().split())
    voisins[a].append(b)
    voisins[b].append(a)                # graphe non orienté : dans les deux sens
for v in range(1, n + 1):
    print(v, "degré", len(voisins[v]), ":", *voisins[v])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> voisins(n + 1);   // la case 0 ne sert pas
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        voisins[a].push_back(b);
        voisins[b].push_back(a);          // graphe non orienté : dans les deux sens
    }
    for (int v = 1; v <= n; v++) {
        cout << v << " degré " << voisins[v].size() << " :";
        for (int w : voisins[v]) cout << " " << w;
        cout << "\n";
    }
    return 0;
}
```

Sur le graphe d'exemple, le programme affiche :

```text
1 degré 2 : 2 5
2 degré 3 : 1 3 5
3 degré 2 : 2 4
4 degré 1 : 3
5 degré 2 : 1 2
6 degré 1 : 7
7 degré 1 : 6
```

Pour un graphe orienté, l'arc `a → b` n'est ajouté qu'à la liste de `a`.

L'autre représentation est la **matrice d'adjacence** : un tableau `N × N` de booléens, où `adj[a][b]` dit si `a` et `b` sont voisins.

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

Le programme affiche `True False` : 2 et 5 sont voisins, 3 et 5 ne le sont pas. Les deux représentations ont des coûts différents.

| | Listes d'adjacence | Matrice d'adjacence |
| --- | --- | --- |
| Mémoire | N + 2M cases | N² cases |
| `a` et `b` sont-ils voisins ? | parcourir la liste de `a` | une case : O(1) |
| Énumérer les voisins de `a` | O(degré de `a`) | O(N) |

Avec `N = 100 000`, une matrice compte 10¹⁰ cases : bien trop pour la mémoire. On la réserve aux petits graphes, et on utilise les listes partout ailleurs.

## Le parcours en profondeur

Le **parcours en profondeur** (en anglais *depth-first search*, DFS) explore le graphe comme on explore un labyrinthe avec une craie : on avance tant qu'on trouve un couloir menant à une salle pas encore marquée, et on revient sur ses pas quand toutes les salles voisines sont marquées. Un tableau `vu` retient les sommets déjà visités. La version récursive est la plus courte :

```python
import sys
sys.setrecursionlimit(10000)

def profondeur(u):
    vu[u] = True
    ordre.append(u)
    for v in voisins[u]:
        if not vu[v]:
            profondeur(v)

n, m = map(int, input().split())
voisins = [[] for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    voisins[a].append(b)
    voisins[b].append(a)
vu = [False] * (n + 1)
ordre = []
profondeur(1)
print(*ordre)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> voisins;
vector<bool> vu;
vector<int> ordre;

void profondeur(int u) {
    vu[u] = true;
    ordre.push_back(u);
    for (int v : voisins[u]) {
        if (!vu[v]) profondeur(v);
    }
}

int main() {
    int n, m;
    cin >> n >> m;
    voisins.assign(n + 1, {});
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        voisins[a].push_back(b);
        voisins[b].push_back(a);
    }
    vu.assign(n + 1, false);
    profondeur(1);
    for (int v : ordre) cout << v << " ";
    cout << "\n";
    return 0;
}
```

Le programme affiche `1 2 3 4 5`. Depuis 1, on va en 2, puis en 3 (premier voisin non marqué de 2), puis en 4. Le sommet 4 n'a plus de voisin libre : on revient à 3, puis à 2, dont le voisin 5 est encore libre. Les sommets 6 et 7 ne sont jamais atteints.

**Correction.** Le parcours lancé depuis `s` marque exactement les sommets accessibles depuis `s`.
- Tout sommet marqué est accessible : on ne marque `v` qu'en venant d'un voisin `u` déjà marqué, donc, de proche en proche, un chemin mène de `s` à `v`.
- Tout sommet accessible est marqué. Sinon, prenons un chemin de `s` à un sommet accessible non marqué, et sur ce chemin le premier sommet `w` non marqué. Son prédécesseur `p` sur le chemin est marqué ; or l'appel sur `p` a examiné tous ses voisins, dont `w`, et l'aurait marqué. Contradiction.

**Complexité.** Chaque sommet est marqué au plus une fois, donc l'appel sur un sommet a lieu au plus une fois, et sa liste de voisins n'est parcourue qu'à ce moment-là. D'après le lemme des poignées de main, le total des longueurs des listes vaut `2M` : le parcours coûte O(N + M). Avec une matrice, énumérer les voisins d'un sommet coûte `N`, et le parcours coûte O(N²).

## Profondeur de récursion et pile explicite

La profondeur de la récursion peut atteindre le nombre de sommets : sur un chemin `1 – 2 – … – 100 000`, l'appel sur 1 appelle 2, qui appelle 3, etc. Le programme précédent s'arrête alors avec `RecursionError: maximum recursion depth exceeded`. Relever encore la limite n'est pas sûr : la pile de la machine a une taille fixe, petite dans un navigateur. En C++, le même programme s'arrête avec `Segmentation fault` sur un chemin d'un million de sommets, et bien plus tôt dans le navigateur, où la pile est plus petite.

Le remède consiste à gérer soi-même la pile, avec une liste. On empile le départ ; tant que la pile n'est pas vide, on dépile un sommet ; s'il est déjà marqué, on l'ignore, sinon on le marque et on empile ses voisins non marqués.

```python
n, m = map(int, input().split())
voisins = [[] for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    voisins[a].append(b)
    voisins[b].append(a)

vu = [False] * (n + 1)
ordre = []
pile = [1]
while pile:
    u = pile.pop()
    if vu[u]:
        continue                     # déjà visité par un autre chemin
    vu[u] = True
    ordre.append(u)
    for v in reversed(voisins[u]):   # à l'envers : le premier voisin sort en premier
        if not vu[v]:
            pile.append(v)
print(*ordre)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        voisins[a].push_back(b);
        voisins[b].push_back(a);
    }
    vector<bool> vu(n + 1, false);
    vector<int> pile = {1};
    while (!pile.empty()) {
        int u = pile.back();
        pile.pop_back();
        if (vu[u]) continue;                       // déjà visité par un autre chemin
        vu[u] = true;
        cout << u << " ";
        for (int i = (int)voisins[u].size() - 1; i >= 0; i--) {   // à l'envers
            int v = voisins[u][i];
            if (!vu[v]) pile.push_back(v);
        }
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche lui aussi `1 2 3 4 5` : empiler les voisins à l'envers fait sortir le premier voisin en premier, comme dans la version récursive. Un sommet peut être empilé plusieurs fois (le 5 l'est par 1 et par 2), d'où le test au dépilement ; mais chaque empilement correspond à une case d'une liste de voisins, donc la pile reçoit au plus `2M + 1` éléments et le coût reste O(N + M).

## Composantes connexes

On lance un parcours depuis chaque sommet pas encore atteint : chaque nouveau parcours découvre une nouvelle composante, dont on note le numéro dans un tableau `comp`. Quand l'ordre de visite importe peu, on marque un sommet **au moment où on l'empile** : il n'entre alors qu'une fois dans la pile.

```python
n, m = map(int, input().split())
voisins = [[] for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    voisins[a].append(b)
    voisins[b].append(a)

comp = [0] * (n + 1)          # 0 : pas encore visité
nb = 0
for depart in range(1, n + 1):
    if comp[depart] != 0:
        continue
    nb += 1                   # nouvelle composante
    comp[depart] = nb
    pile = [depart]
    while pile:
        u = pile.pop()
        for v in voisins[u]:
            if comp[v] == 0:
                comp[v] = nb
                pile.append(v)
print(nb)
print(*comp[1:])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        voisins[a].push_back(b);
        voisins[b].push_back(a);
    }
    vector<int> comp(n + 1, 0);   // 0 : pas encore visité
    int nb = 0;
    for (int depart = 1; depart <= n; depart++) {
        if (comp[depart] != 0) continue;
        nb++;                     // nouvelle composante
        comp[depart] = nb;
        vector<int> pile = {depart};
        while (!pile.empty()) {
            int u = pile.back();
            pile.pop_back();
            for (int v : voisins[u]) {
                if (comp[v] == 0) {
                    comp[v] = nb;
                    pile.push_back(v);
                }
            }
        }
    }
    cout << nb << "\n";
    for (int v = 1; v <= n; v++) cout << comp[v] << " ";
    cout << "\n";
    return 0;
}
```

Le programme affiche `2`, puis `1 1 1 1 1 2 2`. Chaque parcours marque exactement la composante de son départ, d'après la preuve précédente. Le coût total reste O(N + M) et non O(N × (N + M)) : chaque sommet n'est visité que par un seul parcours, celui de sa composante.

## Le parcours en largeur et les plus courts chemins

Le **parcours en largeur** (*breadth-first search*, BFS) remplace la pile par une **file** : on visite d'abord le départ, puis tous ses voisins, puis tous les voisins de ceux-ci, et ainsi de suite, comme une onde qui s'étend. Il calcule la **distance** de chaque sommet au départ, c'est-à-dire la longueur d'un plus court chemin. Le tableau `dist` sert aussi de marquage : `-1` signifie « pas encore découvert ». On retient en plus le `parent` de chaque sommet, celui qui l'a découvert.

```python
from collections import deque

n, m = map(int, input().split())
voisins = [[] for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    voisins[a].append(b)
    voisins[b].append(a)

dist = [-1] * (n + 1)         # -1 : pas encore découvert
parent = [0] * (n + 1)
dist[1] = 0
file = deque([1])
while file:
    u = file.popleft()
    for v in voisins[u]:
        if dist[v] == -1:     # on marque à l'entrée dans la file
            dist[v] = dist[u] + 1
            parent[v] = u
            file.append(v)
print(*dist[1:])

chemin = [4]                  # on remonte les parents depuis 4
while chemin[-1] != 1:
    chemin.append(parent[chemin[-1]])
print(*reversed(chemin))
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
    vector<vector<int>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        voisins[a].push_back(b);
        voisins[b].push_back(a);
    }
    vector<int> dist(n + 1, -1), parent(n + 1, 0);   // -1 : pas encore découvert
    dist[1] = 0;
    queue<int> file;
    file.push(1);
    while (!file.empty()) {
        int u = file.front();
        file.pop();
        for (int v : voisins[u]) {
            if (dist[v] == -1) {                     // on marque à l'entrée dans la file
                dist[v] = dist[u] + 1;
                parent[v] = u;
                file.push(v);
            }
        }
    }
    for (int v = 1; v <= n; v++) cout << dist[v] << " ";
    cout << "\n";
    vector<int> chemin = {4};                        // on remonte les parents depuis 4
    while (chemin.back() != 1) chemin.push_back(parent[chemin.back()]);
    reverse(chemin.begin(), chemin.end());
    for (int v : chemin) cout << v << " ";
    cout << "\n";
    return 0;
}
```

Le programme affiche `0 1 2 3 1 -1 -1`, puis `1 2 3 4`. La file contient successivement `[1]`, `[2, 5]`, `[5, 3]`, `[3]`, `[4]`. Les liens vers les parents forment l'**arbre du parcours** ; en remontant de 4 vers 1, on lit un plus court chemin à l'envers.

**Pourquoi les distances sont justes.** Notons δ(v) la vraie distance de 1 à `v`.
1. `dist[v] ≥ δ(v)` : `dist[v]` est la longueur du chemin formé par les parents, et aucun chemin n'est plus court que δ(v).
2. **Invariant de la file** : à tout moment, les valeurs `dist` des sommets de la file, de la tête vers la fin, sont croissantes et prennent au plus deux valeurs consécutives `d` et `d + 1`. C'est vrai au départ ; défiler un sommet de valeur `d` et enfiler des sommets de valeur `d + 1` à la fin le préserve. Conséquence : les sommets sortent de la file par valeurs de `dist` croissantes.
3. `dist[v] ≤ δ(v)`, par récurrence sur k = δ(v). Pour k = 0, v est le départ. Si k ≥ 1, soit `u` le sommet qui précède `v` sur un plus court chemin : δ(u) = k − 1, donc `dist[u] = k − 1` par hypothèse de récurrence. Quand `u` est défilé, soit `v` n'est pas encore découvert et reçoit `k`, soit il a été découvert par un sommet `w` défilé avant `u`, donc avec `dist[w] ≤ dist[u]` d'après l'invariant, et `dist[v] = dist[w] + 1 ≤ k`.

Un parcours en profondeur ne donne pas les distances : il atteint 5 en passant par 2, alors que 5 est voisin de 1.

**Complexité.** Chaque sommet entre au plus une fois dans la file, car il est marqué en y entrant : O(N + M), à condition d'utiliser une vraie file (`deque` en Python, `queue` en C++).

## Cycles et coloriage en deux couleurs

Dans un graphe non orienté connexe de `s` sommets, l'arbre d'un parcours contient `s − 1` arêtes, une par sommet découvert. Le graphe a donc au moins `s − 1` arêtes. S'il en a exactement `s − 1`, ce sont toutes des arêtes de l'arbre, et il n'a pas de cycle : dans un cycle formé d'arêtes de l'arbre, le sommet découvert en dernier aurait deux voisins sur le cycle découverts avant lui, et un seul peut être son parent. S'il en a plus, une arête `u – v` hors de l'arbre ferme un cycle avec les chemins de l'arbre qui mènent de `u` et de `v` à leur dernier ancêtre commun. Un graphe connexe sans cycle s'appelle un **arbre**, et l'on retient : **une composante de `s` sommets contient un cycle si et seulement si elle a au moins `s` arêtes**. Pour détecter un cycle, il suffit de compter les sommets et les arêtes de chaque composante.

Un graphe est **biparti** si l'on peut colorier ses sommets en deux couleurs de sorte que chaque arête relie deux couleurs différentes (répartir des élèves dans deux salles en séparant ceux qui sont reliés). Dans une composante, la couleur du départ impose celle de ses voisins, puis de leurs voisins : un parcours colorie tout, et l'on vérifie qu'aucune arête ne relie deux sommets de même couleur.

```python
from collections import deque

def biparti(n, aretes):
    voisins = [[] for _ in range(n + 1)]
    for a, b in aretes:
        voisins[a].append(b)
        voisins[b].append(a)
    couleur = [-1] * (n + 1)
    for depart in range(1, n + 1):
        if couleur[depart] != -1:
            continue
        couleur[depart] = 0
        file = deque([depart])
        while file:
            u = file.popleft()
            for v in voisins[u]:
                if couleur[v] == -1:
                    couleur[v] = 1 - couleur[u]
                    file.append(v)
                elif couleur[v] == couleur[u]:
                    return False      # deux voisins de même couleur
    return True

print(biparti(7, [(1, 2), (1, 5), (2, 3), (2, 5), (3, 4), (6, 7)]))
print(biparti(6, [(1, 2), (2, 3), (3, 4), (4, 1), (5, 6)]))
```

```cpp
#include <iostream>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

bool biparti(int n, const vector<pair<int, int>> &aretes) {
    vector<vector<int>> voisins(n + 1);
    for (auto [a, b] : aretes) {
        voisins[a].push_back(b);
        voisins[b].push_back(a);
    }
    vector<int> couleur(n + 1, -1);
    for (int depart = 1; depart <= n; depart++) {
        if (couleur[depart] != -1) continue;
        couleur[depart] = 0;
        queue<int> file;
        file.push(depart);
        while (!file.empty()) {
            int u = file.front();
            file.pop();
            for (int v : voisins[u]) {
                if (couleur[v] == -1) {
                    couleur[v] = 1 - couleur[u];
                    file.push(v);
                } else if (couleur[v] == couleur[u]) {
                    return false;      // deux voisins de même couleur
                }
            }
        }
    }
    return true;
}

int main() {
    cout << (biparti(7, {{1, 2}, {1, 5}, {2, 3}, {2, 5}, {3, 4}, {6, 7}}) ? "True" : "False") << "\n";
    cout << (biparti(6, {{1, 2}, {2, 3}, {3, 4}, {4, 1}, {5, 6}}) ? "True" : "False") << "\n";
    return 0;
}
```

Le programme affiche `False` (le triangle 1, 2, 5 ne peut pas être colorié), puis `True` (le carré 1, 2, 3, 4 alterne les couleurs).

**Pourquoi c'est juste.** Avec un parcours en largeur, la couleur d'un sommet est la parité de sa distance au départ. Si le programme répond `True`, toutes les arêtes relient deux couleurs différentes : le coloriage convient. S'il répond `False`, il a trouvé une arête `u – v` avec `dist[u]` et `dist[v]` de même parité. Les chemins de l'arbre de `u` et de `v` jusqu'à leur dernier ancêtre commun `w`, plus l'arête `u – v`, forment un cycle de longueur `(dist[u] − dist[w]) + (dist[v] − dist[w]) + 1`, un nombre impair. Or un cycle impair ne peut pas être colorié en alternant deux couleurs. On a démontré le théorème : **un graphe est biparti si et seulement s'il n'a aucun cycle de longueur impaire.**

## Les erreurs fréquentes

**Oublier de marquer.** Sans tableau `vu`, un parcours tourne indéfiniment dès qu'il y a un cycle : 1 empile 2, qui empile 1, qui empile 2… La pile ou la file grossit jusqu'à `MemoryError`, ou le programme dépasse le temps limite.

**Marquer trop tard dans un parcours en largeur.** Si l'on marque un sommet quand il sort de la file au lieu de quand il y entre, il peut y entrer plusieurs fois, et sa distance peut être écrasée par une valeur plus grande.

**Oublier une direction.** Dans un graphe non orienté, oublier `voisins[b].append(a)` rend des sommets inaccessibles ; dans un graphe orienté, l'ajouter change le graphe.

**Se tromper de taille.** Avec des sommets numérotés de 1 à `N`, une liste de taille `N` provoque `IndexError: list index out of range` ; en C++, le programme écrit hors du tableau, sans message.

**Utiliser une liste comme file.** `file.pop(0)` décale toute la liste : le parcours devient quadratique.

**Récursion trop profonde.** `RecursionError` en Python, `Segmentation fault` en C++ : utiliser une pile explicite dès que le graphe peut avoir des milliers de sommets.

## Exemple complet : le trajet le plus court

**Énoncé.** Un réseau compte `N` stations et `M` liaisons à double sens. Afficher le nombre minimal de liaisons pour aller de la station `S` à la station `T`, puis un trajet qui réalise ce minimum ; afficher `-1` si `T` est inaccessible.

**Idée.** Un parcours en largeur depuis `S` donne `dist[T]` ; les parents permettent de remonter de `T` à `S`.

```python
from collections import deque

n, m, s, t = map(int, input().split())
voisins = [[] for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    voisins[a].append(b)
    voisins[b].append(a)

dist = [-1] * (n + 1)
parent = [0] * (n + 1)
dist[s] = 0
file = deque([s])
while file:
    u = file.popleft()
    for v in voisins[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            parent[v] = u
            file.append(v)

if dist[t] == -1:
    print(-1)
else:
    print(dist[t])
    trajet = [t]
    while trajet[-1] != s:
        trajet.append(parent[trajet[-1]])
    trajet.reverse()
    print(*trajet)
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
    vector<vector<int>> voisins(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        voisins[a].push_back(b);
        voisins[b].push_back(a);
    }
    vector<int> dist(n + 1, -1), parent(n + 1, 0);
    dist[s] = 0;
    queue<int> file;
    file.push(s);
    while (!file.empty()) {
        int u = file.front();
        file.pop();
        for (int v : voisins[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                parent[v] = u;
                file.push(v);
            }
        }
    }
    if (dist[t] == -1) {
        cout << -1 << "\n";
    } else {
        cout << dist[t] << "\n";
        vector<int> trajet = {t};
        while (trajet.back() != s) trajet.push_back(parent[trajet.back()]);
        reverse(trajet.begin(), trajet.end());
        for (int v : trajet) cout << v << " ";
        cout << "\n";
    }
    return 0;
}
```

**Vérification à la main.** Avec l'entrée suivante (6 stations, de 1 à 6) :

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

la file contient `[1]`, puis `[2, 3]`, puis `[3, 4]`, puis `[4, 6]` : en défilant 3, on découvre 6 avec `dist[6] = 2` et `parent[6] = 3`. Le programme affiche `2`, puis `1 3 6`. Sans la liaison `3 6`, il afficherait `4`, puis `1 2 4 5 6`.

**Correction et coût.** Les distances sont justes d'après la preuve ci-dessus, et le trajet reconstruit a exactement `dist[t]` liaisons, puisque chaque parent est à distance un de moins. Le coût est O(N + M).

## À retenir

- Un graphe se range en **listes d'adjacence** (`N + 1` listes, chaque arête non orientée ajoutée dans les deux sens) : mémoire N + 2M, contre N² pour une matrice.
- Un **parcours** marque chaque sommet une seule fois et coûte **O(N + M)** ; il atteint exactement les sommets accessibles depuis le départ.
- Le **parcours en profondeur** s'écrit récursivement, mais sur un grand graphe on utilise une **pile explicite** pour éviter `RecursionError` ou `Segmentation fault`.
- Le **parcours en largeur**, avec une file et un marquage à l'entrée dans la file, calcule les **plus courtes distances** dans un graphe sans poids ; les parents donnent un plus court chemin.
- Un parcours lancé depuis chaque sommet non visité découvre les **composantes connexes** ; une composante de `s` sommets a un cycle si et seulement si elle a au moins `s` arêtes.
- Un graphe est **biparti** si et seulement s'il n'a pas de cycle impair ; un parcours qui alterne deux couleurs le vérifie.
