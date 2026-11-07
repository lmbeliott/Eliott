Un **arbre** est un graphe connexe sans cycle : `N` sommets, `N - 1` arêtes, et un seul chemin entre deux sommets. Quand on choisit une **racine**, chaque autre sommet a un **parent** (le voisin du côté de la racine) et des **enfants**. Le **sous-arbre** de `v` est formé de `v` et de tous ses descendants.

## Représenter un arbre enraciné

Les problèmes de ce chapitre donnent souvent l'arbre par le parent de chaque sommet `2, 3, …, N`, la racine étant `1`. On en déduit les listes d'enfants. Attention : les numéros ne suivent pas la hiérarchie, un enfant peut avoir un numéro plus petit que son parent.

## Parcourir sans récursion

Un parcours en largeur depuis la racine produit une liste `ordre` où chaque sommet apparaît **après son parent**. On en profite pour calculer les profondeurs. Lue **à l'envers**, la même liste traite chaque sommet **après tous ses enfants** : c'est le bon sens pour remonter une information des feuilles vers la racine, comme la taille des sous-arbres.

```python
enfants = [[] for _ in range(n + 1)]
for v in range(2, n + 1):
    enfants[parent[v]].append(v)
ordre = [1]
profondeur = [0] * (n + 1)
for u in ordre:                  # la liste grandit pendant qu'on la parcourt
    for v in enfants[u]:
        profondeur[v] = profondeur[u] + 1
        ordre.append(v)
taille = [1] * (n + 1)
for v in reversed(ordre):        # chaque sommet après ses enfants
    if v != 1:
        taille[parent[v]] += taille[v]
```

```cpp
vector<vector<int>> enfants(n + 1);
for (int v = 2; v <= n; v++) enfants[parent[v]].push_back(v);
vector<int> ordre = {1}, profondeur(n + 1, 0);
for (size_t i = 0; i < ordre.size(); i++)
    for (int v : enfants[ordre[i]]) {
        profondeur[v] = profondeur[ordre[i]] + 1;
        ordre.push_back(v);
    }
vector<int> taille(n + 1, 1);
for (int i = n - 1; i >= 1; i--)   // chaque sommet après ses enfants
    taille[parent[ordre[i]]] += taille[ordre[i]];
```

Pourquoi pas une fonction récursive ? Sur un arbre en forme de chemin, la profondeur atteint `N`, et Python s'arrête vers 1 000 appels imbriqués. Le parcours avec une liste n'a pas ce problème.

## Le diamètre

Le **diamètre** est le plus long chemin de l'arbre. Deux parcours en largeur suffisent : le sommet `a` le plus éloigné d'un sommet quelconque est une extrémité d'un plus long chemin, et le sommet `b` le plus éloigné de `a` est l'autre. Le milieu du chemin de `a` à `b` est le **centre** : un sommet si le diamètre est pair, deux voisins s'il est impair. Tous les plus longs chemins passent par lui.

Cette astuce ne vaut que pour des longueurs positives : avec des arêtes de poids négatif, il faut une programmation dynamique sur les sous-arbres.

## Changer de racine

Beaucoup de questions demandent une valeur **pour chaque sommet pris comme racine** : la somme des distances aux autres sommets, la plus grande distance… Recommencer un parcours depuis chaque sommet coûte O(N²). L'idée du **changement de racine** : calculer la valeur pour la racine `1`, puis la faire glisser le long de chaque arête en O(1).

Pour la somme des distances `S(v)`, quand on passe d'un sommet `p` à son enfant `v`, les `taille[v]` sommets du sous-arbre de `v` se rapprochent de `1`, les `N - taille[v]` autres s'éloignent de `1` :

```python
S = [0] * (n + 1)
S[1] = sum(profondeur)
for v in ordre:                  # de la racine vers les feuilles
    if v != 1:
        S[v] = S[parent[v]] + n - 2 * taille[v]
```

```cpp
vector<long long> S(n + 1, 0);
for (int v = 1; v <= n; v++) S[1] += profondeur[v];
for (int v : ordre)              // de la racine vers les feuilles
    if (v != 1) S[v] = S[parent[v]] + n - 2 * taille[v];
```

## L'ancêtre commun et la remontée binaire

Le chemin entre `u` et `v` monte jusqu'à leur **plus proche ancêtre commun** (LCA), puis redescend ; sa longueur est `profondeur[u] + profondeur[v] - 2 × profondeur[lca]`. Pour le trouver vite, on précalcule `haut[j][v]`, l'ancêtre situé `2ʲ` niveaux au-dessus de `v` (ou `0`) : monter de `2ʲ`, c'est monter deux fois de `2ʲ⁻¹`. Pour monter de `k` niveaux, on suit les bits de `k`.

```python
haut = [parent]                  # parent[1] = 0
for j in range(1, LOG):
    haut.append([haut[j - 1][haut[j - 1][v]] for v in range(n + 1)])

def lca(u, v):
    if profondeur[u] < profondeur[v]:
        u, v = v, u
    k, j = profondeur[u] - profondeur[v], 0
    while k:                     # u monte au niveau de v
        if k & 1:
            u = haut[j][u]
        k, j = k >> 1, j + 1
    if u == v:
        return u
    for j in range(LOG - 1, -1, -1):
        if haut[j][u] != haut[j][v]:
            u, v = haut[j][u], haut[j][v]
    return parent[u]
```

```cpp
// haut[0] = parent, avec parent[1] = 0
for (int j = 1; j < LOG; j++)
    for (int v = 0; v <= n; v++) haut[j][v] = haut[j - 1][haut[j - 1][v]];

int lca(int u, int v) {
    if (profondeur[u] < profondeur[v]) swap(u, v);
    for (int k = profondeur[u] - profondeur[v], j = 0; k > 0; k >>= 1, j++)
        if (k & 1) u = haut[j][u];   // u monte au niveau de v
    if (u == v) return u;
    for (int j = LOG - 1; j >= 0; j--)
        if (haut[j][u] != haut[j][v]) u = haut[j][u], v = haut[j][v];
    return haut[0][u];
}
```

Une fois les deux sommets au même niveau, on les fait monter ensemble par sauts décroissants, tant qu'ils ne se rejoignent pas : ils s'arrêtent juste sous l'ancêtre commun. Avec `LOG` tel que `2^LOG > N`, la table coûte O(N log N), et chaque question O(log N).

## À retenir

- Un parcours en largeur depuis la racine donne un ordre où chaque sommet suit son parent ; à l'envers, il suit ses enfants. Pas besoin de récursion.
- Tailles et sommes de sous-arbres se remontent des feuilles vers la racine, en O(N).
- Le diamètre se trouve avec deux parcours en largeur ; tous les plus longs chemins passent par son centre.
- Le **changement de racine** calcule une valeur pour chaque racine possible en O(N) : une formule pour passer du parent à l'enfant.
- La **remontée binaire** donne en O(log N) l'ancêtre à distance `k` et le plus proche ancêtre commun.
