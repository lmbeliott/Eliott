Sur une carte routière, chaque route a une longueur, et l'on cherche le trajet le plus court entre deux villes. Le parcours en largeur ne suffit plus : il minimise le **nombre** de routes empruntées, pas la longueur totale. Deux routes de 2 km valent mieux qu'une seule de 10 km. Ce chapitre présente les trois algorithmes classiques, Dijkstra, Bellman-Ford et Floyd-Warshall, avec leur preuve et leur coût. Les sommets ne seront pas toujours des lieux : ce peuvent être des restes modulo `K` ou des couples (lieu, information).

## Graphes pondérés et distances

Un **graphe pondéré** associe à chaque arête un nombre, son **poids** ou sa **longueur**. La **longueur d'un chemin** est la somme des longueurs de ses arêtes. La **distance** `d(s, v)` est la plus petite longueur d'un chemin de `s` à `v` ; elle est infinie s'il n'y a aucun chemin. Un **plus court chemin** est un chemin dont la longueur est égale à la distance.

On représente le graphe par des listes d'adjacence dont chaque élément est un couple `(v, l)` : le voisin et la longueur de l'arête.

Une remarque guide tout le chapitre : si `u` est sur un plus court chemin de `s` à `v`, la partie de `s` à `u` est elle-même un plus court chemin (sinon, on la remplacerait et le chemin vers `v` raccourcirait). Les plus courts chemins se construisent donc de proche en proche.

L'opération de base s'appelle le **relâchement** d'une arête `u → v` de longueur `l` : si `dist[u] + l < dist[v]`, on remplace `dist[v]` par `dist[u] + l`. Le tableau `dist` contient toujours des longueurs de chemins réels, donc des valeurs au moins égales aux vraies distances. Les trois algorithmes diffèrent par l'ordre des relâchements.

## La file de priorité

Une **file de priorité** reçoit des éléments dans n'importe quel ordre et rend toujours le plus petit. Elle est réalisée par un **tas**, une structure qui fait chaque ajout et chaque retrait en O(log n) opérations pour n éléments présents.

En Python, le module `heapq` transforme une liste en tas : `heappush(tas, x)` ajoute, `heappop(tas)` retire et renvoie le plus petit. En C++, `priority_queue` de `<queue>` renvoie par défaut le plus **grand** ; pour obtenir le plus petit, on donne trois paramètres : le type, le conteneur `vector`, et le comparateur `greater<>` de `<functional>`. Les couples se comparent d'abord sur leur premier élément, puis sur le second en cas d'égalité.

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

Le programme affiche `2 a`, `2 b`, `5 a` puis `8 c` : les couples sortent dans l'ordre croissant, et à égalité de premier élément, `a` passe avant `b`. On mettra donc toujours la **distance en premier** dans les couples.

## L'algorithme de Dijkstra

L'algorithme de Dijkstra calcule les distances depuis une source `s` quand toutes les longueurs sont **positives ou nulles**. On part de `dist[s] = 0` et de l'infini pour les autres sommets. Le tas contient des couples `(distance, sommet)`. À chaque étape, on retire le couple `(d, u)` de plus petite distance. Si `d > dist[u]`, ce couple est une **entrée périmée** : `u` a déjà été amélioré depuis qu'on l'a ajouté, et l'on passe. Sinon, on **traite** `u` : on relâche toutes ses arêtes, et chaque amélioration ajoute un nouveau couple au tas.

Comme `heapq` et `priority_queue` ne savent pas modifier un couple déjà présent, on en ajoute un nouveau et l'on ignore l'ancien quand il sort : c'est la **suppression paresseuse**.

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

Le programme affiche `0 5 2 6 8`. Le sommet `3` sort avec 2 et améliore `2` de 7 à 5 ; `2` sort avec 5 et améliore `4` à 6, qui améliore `5` à 8. Les couples `(7, 2)`, `(10, 4)` et `(12, 5)`, restés dans le tas, sortent plus tard et sont ignorés.

**Pourquoi c'est juste.** On montre l'invariant suivant : quand un sommet `u` est traité, `dist[u] = d(s, u)`. Supposons le contraire, et prenons le premier sommet `u` traité avec `dist[u] > d(s, u)`. Sur un plus court chemin de `s` à `u`, soit `y` le premier sommet pas encore traité (il existe, car `u` lui-même ne l'est pas encore), et `x` le sommet qui le précède, déjà traité. Quand `x` a été traité, avec sa vraie distance, l'arête `x → y` a été relâchée : `dist[y] ≤ d(s, x) + l = d(s, y)`. Les longueurs étant positives, la suite du chemin de `y` à `u` ne raccourcit rien : `d(s, y) ≤ d(s, u) < dist[u]`. Le couple de `y` était donc dans le tas avec une distance strictement plus petite que celle de `u`, et aurait dû sortir avant : contradiction.

**Pourquoi les longueurs négatives cassent tout.** L'argument utilise `d(s, y) ≤ d(s, u)` : la fin du chemin ne peut pas faire diminuer la longueur. Avec les arcs `1 → 2` de longueur 4, `1 → 3` de longueur 5 et `3 → 2` de longueur −3, le sommet `2` sort du tas avec 4 alors que sa vraie distance est 2. Dijkstra rend alors une réponse fausse (si l'on interdit de traiter deux fois un sommet), ou retraite des sommets un nombre de fois qui peut devenir exponentiel.

**Complexité.** Chaque sommet est traité une fois, donc chaque arête est relâchée une fois par extrémité, et chaque relâchement ajoute au plus un couple au tas. Le tas reçoit au plus `M + 1` couples (`2M + 1` pour un graphe non orienté), et chaque opération coûte O(log M) = O(log N), puisque `M ≤ N²`. Au total : **O((N + M) log N)**. Sans tas, chercher le minimum parmi tous les sommets coûte O(N²) : trop lent pour `N = 10⁵`.

## Retrouver un plus court chemin

Les distances ne disent pas par où passer. Il suffit de retenir, à chaque amélioration de `dist[v]` par l'arête `u → v`, le **prédécesseur** `pred[v] = u`. À la fin, on part de la destination et l'on suit `pred` jusqu'à la source ; la liste obtenue est le chemin à l'envers.

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

Le programme affiche `8 : 1 3 2 4 5`. La remontée est juste : quand `v` est traité, `dist[v] = dist[pred[v]] + l` et `pred[v]` a déjà sa vraie distance ; de proche en proche, les arêtes lues ont une longueur totale `dist[v]`. Les arêtes `pred[v] → v` forment l'**arbre des plus courts chemins**, enraciné en `s`.

## Bellman-Ford : longueurs négatives

Des longueurs négatives apparaissent avec des gains ou des contraintes de la forme `x_B − x_A ≤ C`. Un **cycle négatif**, un cycle de longueur totale strictement négative, rend la distance de certains sommets égale à « moins l'infini » : on peut tourner autant de fois qu'on veut pour diminuer la longueur.

L'algorithme de **Bellman-Ford** fait des **tours** : à chaque tour, il relâche **toutes** les arêtes, dans un ordre quelconque. Invariant : après `k` tours, `dist[v]` est au plus la longueur de n'importe quel chemin de `s` à `v` ayant au plus `k` arêtes. Si un chemin de `k + 1` arêtes arrive en `v` par `u → v`, sa partie jusqu'à `u` a `k` arêtes, donc après `k` tours `dist[u]` est au plus sa longueur, et le relâchement de `u → v` au tour suivant conclut.

Sans cycle négatif, un plus court chemin ne repasse jamais par un sommet (enlever un cycle ne l'allonge pas), donc il a au plus `N − 1` arêtes : après `N − 1` tours, toutes les distances sont exactes, et un `N`-ième tour ne change rien. Réciproquement, s'il y a un cycle négatif accessible depuis `s`, les valeurs ne se stabilisent jamais : en additionnant les inégalités `dist[b] ≤ dist[a] + l` le long du cycle, on trouverait `0 ≤ longueur du cycle`. D'où le test : **s'il y a encore une amélioration au `N`-ième tour, il existe un cycle négatif**.

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

Le programme affiche `0 2 5 4`, puis `cycle négatif` : l'arc `4 → 3` de longueur −4 ferme le cycle `3 → 2 → 4 → 3`, de longueur −3 + 2 − 4 = −5. Le coût est **O(N × M)** : chaque tour relâche les `M` arêtes, et il y a au plus `N` tours.

## Floyd-Warshall : toutes les paires

Quand on veut les distances entre **toutes** les paires de sommets d'un petit graphe, l'algorithme de **Floyd-Warshall** tient en trois boucles. On part d'une matrice `d` : `0` sur la diagonale, la longueur de l'arc `i → j` s'il existe (la plus petite s'il y en a plusieurs), l'infini sinon. Puis, pour chaque `k` de `1` à `N`, on autorise `k` comme sommet intermédiaire : `d[i][j] = min(d[i][j], d[i][k] + d[k][j])`.

**Invariant.** Après l'étape `k`, `d[i][j]` est la longueur d'un plus court chemin de `i` à `j` dont tous les sommets **intermédiaires** sont parmi `1, …, k`. À l'étape `k`, un tel chemin optimal ou bien n'utilise pas `k`, et sa longueur était déjà `d[i][j]`, ou bien passe une seule fois par `k`, et se coupe en un chemin de `i` à `k` puis un chemin de `k` à `j` dont les intermédiaires sont parmi `1, …, k − 1`. Les valeurs `d[i][k]` et `d[k][j]` ne changent pas pendant l'étape `k`, ce qui permet de travailler sur place. À la fin, tous les sommets sont permis : `d` contient les distances.

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

La première ligne affiche `0 5 7 8` : de `1` à `3`, le chemin par `2` (5 + 2) bat l'arc direct de longueur 9. Le coût est **O(N³)** en temps et O(N²) en mémoire. L'algorithme accepte les longueurs négatives ; un cycle négatif se voit à un `d[i][i] < 0` final. **L'ordre des boucles compte** : `k` doit être la boucle extérieure.

## Choisir le bon algorithme

On choisit d'après les longueurs et les contraintes :

| Situation | Algorithme | Coût |
| --- | --- | --- |
| toutes les longueurs égales | parcours en largeur | O(N + M) |
| longueurs positives ou nulles | Dijkstra avec un tas | O((N + M) log N) |
| longueurs 0 ou 1 | Dijkstra, ou une file à double entrée | O(N + M) avec la file |
| longueurs négatives, une source | Bellman-Ford | O(N × M) |
| toutes les paires, N ≤ 400 environ | Floyd-Warshall | O(N³) |

Pour les longueurs 0 ou 1, Dijkstra marche tel quel ; une file à double entrée (`deque`) fait mieux, en ajoutant devant le sommet atteint par un arc de longueur 0 et derrière l'autre. Avec **plusieurs sources**, on met toutes les sources dans le tas avec la distance 0 au départ : on obtient, pour chaque sommet, la distance à la source la plus proche, comme si une source fictive était reliée à chacune par un arc de longueur 0.

Les sommets peuvent aussi être des **nombres** : si seul compte le reste modulo `K` d'une quantité, les `K` restes forment les sommets et chaque opération devient un arc, calculé au moment de traiter le sommet.

## Erreurs fréquentes

**Le tas à l'envers.** `priority_queue<pair<long long, int>>` renvoie le plus **grand** élément, et un couple `(sommet, distance)` fait sortir le plus petit numéro : Dijkstra devient faux ou très lent. Oublier le conteneur dans `priority_queue<pair<long long, int>, greater<pair<long long, int>>>` ne compile pas : `error: no type named 'value_type' in 'struct std::greater<std::pair<long long int, int> >'`. Le conteneur `vector<...>` est le deuxième paramètre.

**Oublier le test des entrées périmées.** Sans `if d > dist[u]`, les distances restent justes, mais un sommet peut être traité autant de fois qu'il a été amélioré, et le programme dépasse la limite de temps sur les grands graphes.

**Des distances trop grandes.** Un chemin de 10⁵ arêtes de longueur 10⁹ mesure 10¹⁴ : il faut des `long long` en C++. L'« infini » doit dépasser toute distance possible sans provoquer de dépassement : avec `LLONG_MAX`, la somme `d[i][k] + d[k][j]` de Floyd-Warshall déborde et devient négative, et l'algorithme invente des chemins. La valeur 10¹⁸ convient : la somme de deux infinis reste représentable.

**Les numéros de sommets.** Avec des sommets de `1` à `N`, une liste de taille `N` provoque `IndexError: list assignment index out of range` : on crée `N + 1` cases.

## Un exemple complet

**Énoncé.** Un réseau a `N` villes et `M` routes à double sens, chacune avec un péage. On dispose d'**un coupon** qui rend gratuite une seule route du trajet. Quel est le coût minimal pour aller de la ville `1` à la ville `N` ? (`N` jusqu'à 10⁵, `M` jusqu'à 2 × 10⁵, `-1` si c'est impossible.)

**Idée.** La suite du trajet dépend de la ville et de l'état du coupon. On dédouble donc chaque ville : le sommet `(v, 0)` signifie « en `v`, coupon encore disponible », le sommet `(v, 1)` « en `v`, coupon utilisé ». Une route `u – v` de péage `l` donne les arcs `(u, 0) → (v, 0)` et `(u, 1) → (v, 1)` de longueur `l`, et l'arc `(u, 0) → (v, 1)` de longueur 0 (on utilise le coupon sur cette route). La réponse est la plus petite des distances de `(1, 0)` à `(N, 0)` et à `(N, 1)`.

**Programme.**

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

**Vérification à la main.** Avec l'entrée

```text
5 6
1 2 4
2 5 10
1 3 2
3 4 3
4 5 3
3 5 20
```

le meilleur trajet sans coupon est `1 → 3 → 4 → 5`, de coût 8. Avec le coupon, on peut prendre `1 → 3` (2) puis la route `3 – 5` gratuitement : coût 2. Le programme affiche `2` : la route la plus chère devient la meilleure.

**Pourquoi c'est juste.** Un trajet de `1` à `N` avec, au plus, une route gratuite correspond à un chemin de même coût dans le graphe dédoublé : on reste à l'étage 0 jusqu'à la route gratuite, on monte à l'étage 1 par l'arc de longueur 0, puis on reste à l'étage 1. Réciproquement, un chemin du graphe dédoublé ne monte qu'une fois, puisqu'aucun arc ne redescend : il décrit un trajet avec au plus une route gratuite. Les longueurs sont positives ou nulles : Dijkstra s'applique. **Coût** : `2N` sommets et au plus `6M` arcs, donc O((N + M) log N). Essayer chaque route gratuite à tour de rôle coûterait `M` exécutions de Dijkstra.

## À retenir

- Dijkstra calcule les distances depuis une source quand les longueurs sont positives ou nulles, en O((N + M) log N), avec un tas de couples `(distance, sommet)` et la suppression paresseuse des entrées périmées.
- Sa preuve repose sur un invariant : un sommet qui sort du tas avec sa distance à jour a sa vraie distance, parce qu'aucun détour ne peut raccourcir. Une seule longueur négative suffit à la casser.
- Pour retrouver un chemin, on retient `pred[v]` à chaque amélioration, puis on remonte depuis la destination.
- Bellman-Ford accepte les longueurs négatives, en O(N × M) : après `k` tours, tous les chemins d'au plus `k` arêtes sont pris en compte ; une amélioration au `N`-ième tour révèle un cycle négatif.
- Floyd-Warshall donne toutes les paires en O(N³), avec `k` en boucle extérieure ; l'invariant porte sur les sommets intermédiaires autorisés.
- Beaucoup de problèmes deviennent des plus courts chemins une fois les bons sommets choisis : plusieurs sources, des états (lieu, information), des restes modulo `K`. Des `long long` et un infini qui ne déborde pas.
