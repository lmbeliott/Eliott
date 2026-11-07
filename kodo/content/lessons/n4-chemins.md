Quand chaque arête a une longueur différente, le chemin avec le moins d'arêtes n'est plus forcément le plus court : le parcours en largeur ne suffit plus. Ce cours présente deux outils : l'**algorithme de Dijkstra**, pour les plus courts chemins dans un graphe pondéré, et l'**union-find**, pour regrouper des sommets au fur et à mesure qu'on ajoute des arêtes.

## L'algorithme de Dijkstra

On range le graphe en listes d'adjacence de couples `(voisin, longueur)`. On garde `dist[v]`, la meilleure distance connue pour atteindre `v`, et un **tas** (file de priorité) qui donne toujours le sommet de plus petite distance.

À chaque étape, on retire du tas le sommet `u` le plus proche. Comme toutes les longueurs sont positives, aucun autre chemin ne pourra l'améliorer : sa distance est **définitive**. On essaie alors d'améliorer chaque voisin : si `dist[u] + t < dist[v]`, on met à jour `dist[v]` et on ajoute `(dist[v], v)` au tas.

```python
import heapq
INFINI = 10 ** 18
dist = [INFINI] * (n + 1)
dist[depart] = 0
tas = [(0, depart)]
while tas:
    d, u = heapq.heappop(tas)
    if d > dist[u]:
        continue   # entrée périmée
    for v, t in voisins[u]:
        if d + t < dist[v]:
            dist[v] = d + t
            heapq.heappush(tas, (dist[v], v))
```

```cpp
const long long INFINI = (long long)4e18;
vector<long long> dist(n + 1, INFINI);
priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
dist[depart] = 0;
tas.push({0, depart});
while (!tas.empty()) {
    auto [d, u] = tas.top();
    tas.pop();
    if (d > dist[u]) continue;   // entrée périmée
    for (auto [v, t] : voisins[u]) {
        if (d + t < dist[v]) {
            dist[v] = d + t;
            tas.push({dist[v], v});
        }
    }
}
```

Un sommet peut être dans le tas plusieurs fois avec des distances différentes : seule la plus petite compte, les autres sont **périmées** et on les ignore. La complexité est **O((N + M) log M)**. En C++, `priority_queue` donne le plus **grand** élément : `greater` le transforme en tas du plus petit. Dijkstra exige des poids **positifs ou nuls**.

## Modéliser avant de calculer

Beaucoup de problèmes se ramènent à Dijkstra après une transformation.

- Un **coût sur les sommets** (un prix à payer pour chaque sommet traversé) se reporte sur les arêtes qui y entrent.
- Une **ressource limitée** (un nombre maximal d'arêtes spéciales, de jokers…) s'ajoute à l'état : un sommet du nouveau graphe est un couple `(sommet, ressource utilisée)`. Le graphe d'états a plus de sommets, mais l'algorithme reste le même, et ses arcs se calculent à la volée.

## L'union-find

L'**union-find** gère des groupes disjoints avec deux opérations : `trouve(x)` renvoie le représentant du groupe de `x`, et `unit(a, b)` fusionne les groupes de `a` et `b`. Chaque élément a un parent ; le représentant est la racine, l'élément qui est son propre parent. Deux éléments sont dans le même groupe si et seulement s'ils ont la même racine.

Deux améliorations rendent les opérations quasi instantanées : la **compression des chemins** (après une recherche, tout le chemin pointe directement vers la racine) et l'**union par taille** (le petit groupe rejoint le grand).

```python
parent = list(range(n + 1))
taille = [1] * (n + 1)

def trouve(x):
    racine = x
    while parent[racine] != racine:
        racine = parent[racine]
    while parent[x] != racine:   # compression des chemins
        suivant = parent[x]
        parent[x] = racine
        x = suivant
    return racine

def unit(a, b):
    a, b = trouve(a), trouve(b)
    if a != b:
        if taille[a] < taille[b]:
            a, b = b, a
        parent[b] = a
        taille[a] += taille[b]
```

```cpp
vector<int> parent, taille;   // parent[i] = i et taille[i] = 1 au départ

int trouve(int x) {
    int racine = x;
    while (parent[racine] != racine) racine = parent[racine];
    while (parent[x] != racine) {   // compression des chemins
        int suivant = parent[x];
        parent[x] = racine;
        x = suivant;
    }
    return racine;
}

void unit(int a, int b) {
    a = trouve(a);
    b = trouve(b);
    if (a == b) return;
    if (taille[a] < taille[b]) swap(a, b);
    parent[b] = a;
    taille[a] += taille[b];
}
```

## Ajouter les arêtes dans le bon ordre

L'union-find sait **ajouter** des arêtes, pas en retirer. L'astuce est souvent de traiter les événements dans un ordre choisi : on trie les arêtes (par exemple par poids) et on les ajoute une à une. C'est l'idée de l'**algorithme de Kruskal** : en ajoutant les arêtes de la moins chère à la plus chère, et seulement celles qui relient deux groupes différents, on obtient le réseau le moins cher qui relie tout.

Si des questions dépendent d'un seuil (« avec les arêtes de poids au plus `S`… »), on peut aussi les trier par seuil et y répondre **hors ligne**, en ajoutant les arêtes au fur et à mesure. Il faut alors garder l'indice de chaque question pour afficher les réponses dans l'ordre de l'entrée.

## À retenir

- Dijkstra : un tas, des distances définitives à la sortie du tas, les entrées périmées ignorées ; poids positifs obligatoires.
- Complexité O((N + M) log M), bien meilleure que O(N × M), et que O(N²) quand le graphe a peu d'arêtes (M bien plus petit que N²).
- Un coût sur les sommets ou une ressource limitée se modélise en changeant les arêtes ou l'état.
- Union-find : `trouve` et `unit`, avec compression des chemins et union par taille.
- Trier arêtes et questions permet de tout traiter en n'ajoutant que des arêtes.
