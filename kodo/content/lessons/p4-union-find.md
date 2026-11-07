Un réseau se construit liaison après liaison, et l'on veut savoir à chaque instant si deux sommets sont reliés. Relancer un parcours à chaque question coûte O(N + M) : bien trop pour des centaines de milliers de questions. La structure **Union-Find** répond en un temps presque constant, à condition que les liaisons ne fassent que s'ajouter. Elle est aussi le moteur de l'algorithme de Kruskal, qui construit un **arbre couvrant de poids minimal** : le réseau le moins cher qui relie tous les sommets.

## Ensembles disjoints

Des ensembles sont **disjoints** s'ils n'ont aucun élément commun. Une **partition** des éléments `1, …, N` est un découpage en ensembles disjoints qui les contiennent tous, par exemple les composantes connexes d'un graphe. Union-Find gère une partition avec deux opérations :

- `trouver(x)` renvoie le **représentant** de l'ensemble de `x`, un élément choisi dans cet ensemble. Deux éléments sont dans le même ensemble exactement quand ils ont le même représentant ;
- `unir(a, b)` fusionne l'ensemble de `a` et celui de `b`.

Au départ, chaque élément est seul dans son ensemble.

## Deux versions naïves

**Un tableau d'étiquettes.** On stocke `etiquette[x]`, le représentant de `x`. `trouver` coûte une opération, mais `unir` doit réétiqueter tout un ensemble : O(N). Avec `N − 1` unions, on peut arriver à N² / 2 opérations, par exemple en ajoutant toujours le gros ensemble au petit élément.

**Une forêt.** Chaque ensemble devient une **arborescence** : chaque élément pointe vers un `parent` de son ensemble, et le représentant est la **racine**, qui pointe vers elle-même. `trouver(x)` remonte les parents jusqu'à la racine ; `unir(a, b)` accroche la racine de l'un sous la racine de l'autre. L'union ne coûte plus rien, mais une recherche coûte la profondeur de `x`. Si l'on accroche toujours l'ancien arbre sous un élément isolé, on fabrique une chaîne de `N` éléments, et chaque recherche peut coûter `N`.

## Union par taille et compression des chemins

Deux idées simples rendent la forêt très efficace.

L'**union par taille** accroche toujours la racine de la plus **petite** arborescence sous celle de la plus grande ; on garde `taille[r]` pour chaque racine `r`. Alors la profondeur d'un élément ne dépasse jamais log₂ N. En effet, la profondeur de `x` n'augmente de 1 que lorsque la racine de son arborescence passe sous une autre, au moins aussi grande : la taille de l'arborescence de `x` est alors au moins doublée. Comme elle ne dépasse pas `N`, cela arrive au plus log₂ N fois.

La **compression des chemins** profite de chaque recherche : une fois la racine trouvée, on fait pointer directement vers elle tous les éléments rencontrés. Les recherches suivantes sur ces éléments coûtent une seule étape.

Avec les deux idées, une suite de `K` opérations coûte O(K × α(N)), où α est une fonction qui croît si lentement qu'elle vaut au plus 4 pour tout `N` réaliste. On admet ce résultat ; en pratique, chaque opération coûte un **temps quasi constant**. On écrit `trouver` avec deux boucles plutôt que par récursivité : en Python, une chaîne de quelques milliers d'éléments dépasserait la profondeur de récursion autorisée.

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

Le programme affiche `True True True False`, puis `True False 4` (en C++, `true` et `false`). Les trois premières unions fusionnent `{1, 2}`, `{3, 4}`, puis les deux ; la quatrième trouve `1` et `3` déjà ensemble et renvoie `False`. Ensuite, `4` et `1` ont le même représentant, `5` est seul, et l'ensemble de `3` contient 4 éléments.

## Connexité dynamique

Pour suivre les composantes d'un graphe auquel on **ajoute** des arêtes, on appelle `unir(a, b)` pour chaque nouvelle arête `a – b`. Invariant : deux sommets ont le même représentant exactement quand un chemin les relie. Une arête crée de nouveaux chemins seulement entre sa composante de `a` et celle de `b`, que l'union fusionne. On peut tenir à jour le nombre de composantes (il baisse de 1 à chaque union réussie) et la taille de la plus grande (le maximum des tailles après chaque fusion).

**Supprimer des arêtes.** Union-Find ne sait pas défaire une union. Mais si toutes les suppressions sont connues à l'avance, on traite le problème **hors ligne**, à l'envers : on part du graphe final, privé de toutes les arêtes supprimées, puis on remonte le temps ; chaque suppression devient un ajout. On note les réponses pendant cette remontée et on les affiche dans l'ordre normal.

Le même principe s'applique à toute question qui dépend d'un seuil : trier les seuils transforme souvent le problème en une suite d'ajouts.

## Arbres couvrants de poids minimal

Un **arbre couvrant** d'un graphe connexe à `N` sommets est un ensemble de `N − 1` arêtes qui relie tous les sommets sans former de cycle. Son **poids** est la somme des poids de ses arêtes. On cherche un **arbre couvrant de poids minimal**, que l'on abrège en ACM : le réseau le moins cher qui relie tout.

Une **coupure** est un partage des sommets en deux groupes non vides ; une arête la **traverse** si ses extrémités sont dans des groupes différents.

**Propriété de coupure.** Pour toute coupure, si `e` est une arête de poids minimal parmi celles qui la traversent, il existe un ACM qui contient `e`. *Preuve.* Soit `T` un ACM qui ne contient pas `e`. Ajouter `e` à `T` crée un cycle ; en le parcourant, on passe d'un groupe à l'autre par `e`, et il faut revenir : une autre arête `f` du cycle traverse la coupure. Par choix de `e`, poids(`f`) ≥ poids(`e`). En retirant `f`, on obtient un arbre couvrant de poids au plus celui de `T`, donc minimal, qui contient `e`.

On en déduit la **propriété de cycle** : une arête strictement plus lourde que toutes les autres arêtes d'un cycle n'appartient à aucun ACM. Avec des égalités, on peut toujours la retirer sans changer le poids minimal.

## L'algorithme de Kruskal

On trie les arêtes par poids croissant, puis on les parcourt avec un Union-Find : on garde une arête si elle relie deux composantes différentes, sinon on l'ignore car elle fermerait un cycle.

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

Le programme garde `(1, 3)`, `(2, 4)`, `(2, 3)` et `(3, 5)`, pour un poids de 12. Les arêtes `1 – 2` (poids 4) et `3 – 4` (poids 5) arrivent quand leurs extrémités sont déjà reliées.

**Pourquoi c'est juste.** Invariant : les arêtes gardées sont contenues dans un ACM. Quand Kruskal garde `e = u – v`, on considère la coupure entre la composante `C` de `u` (formée par les arêtes gardées) et le reste. Aucune arête gardée ne la traverse. Une arête plus légère que `e` qui la traverserait aurait été examinée avant, alors qu'elle reliait `C` à une autre composante : elle aurait été gardée, et `C` ne serait pas une composante. Donc `e` est de poids minimal parmi les arêtes qui traversent la coupure. L'échange de la preuve précédente retire une arête `f` qui traverse la coupure, donc pas une arête gardée : l'ACM obtenu contient toutes les arêtes gardées et `e`. À la fin, on a `N − 1` arêtes (si le graphe est connexe) contenues dans un ACM : c'est cet ACM.

**Complexité.** O(M log M) pour le tri, plus `M` opérations Union-Find en temps quasi constant. Si le graphe n'est pas connexe, on obtient moins de `N − 1` arêtes : une **forêt couvrante** minimale.

## L'algorithme de Prim

Prim fait grandir un seul arbre depuis un sommet. À chaque étape, il ajoute l'arête la plus légère qui relie l'arbre à un sommet extérieur : c'est la propriété de coupure, appliquée à la coupure (arbre, reste). On garde dans un tas les couples `(poids, sommet)` des arêtes candidates, avec la même suppression paresseuse que dans Dijkstra : un sommet qui sort du tas alors qu'il est déjà dans l'arbre est ignoré.

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

Le programme affiche `12`, comme Kruskal. Chaque arête entre au plus deux fois dans le tas : O(M log M). La seule différence avec Dijkstra est la clé : le poids de la dernière arête, pas la distance depuis le départ.

## Chemins de goulet minimal

Le **goulet** d'un chemin est le poids de sa plus lourde arête. Entre deux sommets `u` et `v`, le chemin dans un ACM a le plus petit goulet possible. En effet, si Kruskal relie `u` et `v` pour la première fois avec une arête de poids `w`, toutes les arêtes plus légères étaient déjà examinées sans les relier : tout chemin de `u` à `v` contient une arête de poids au moins `w`, et le chemin dans l'arbre n'utilise que des arêtes de poids au plus `w`. Ainsi, « peut-on aller de `u` à `v` sans arête de poids plus grand que `S` ? » se règle en ajoutant les arêtes par poids croissant, en même temps que l'on trie les questions par seuil.

Autre idée utile : le meilleur arbre couvrant **différent** d'un ACM s'obtient en ajoutant une arête hors de l'arbre et en retirant l'arête la plus lourde du cycle ainsi formé.

## Erreurs fréquentes

**Une recherche récursive en Python.** La version `parent[x] = trouver(parent[x])` est élégante, mais sur une chaîne de 5 000 éléments elle provoque `RecursionError: maximum recursion depth exceeded`. On utilise les deux boucles, et l'union par taille.

**Unir sans chercher les racines.** Écrire `parent[a] = b` relie `a` à `b` mais détache `a` de son ancien ensemble : les autres éléments de cet ensemble sont perdus. Aucun message, la réponse est fausse. On accroche toujours une racine sous une autre racine.

**Comparer les parents au lieu des racines.** `parent[a] == parent[b]` peut être faux alors que `a` et `b` sont dans le même ensemble. Il faut `trouver(a) == trouver(b)`.

**Trier les arêtes sur la mauvaise clé.** `sorted(aretes)` trie les triplets `(a, b, w)` par `a` : Kruskal devient faux. On met le poids en premier, ou l'on donne une clé.

**Oublier les graphes non connexes.** Kruskal ne signale rien : il faut compter les arêtes gardées (ou les composantes) pour savoir si tout est relié.

## Un exemple complet

**Énoncé.** On veut partager `N` villes en `K` groupes non vides (`K ≥ 2`). Les `M` liaisons ont des longueurs, et le graphe est connexe. L'**écart** d'un partage est la plus petite longueur d'une liaison entre deux villes de groupes différents. Quel est le plus grand écart possible ?

**Idée.** On veut que les liaisons courtes restent à l'intérieur des groupes. On lance Kruskal, qui fusionne d'abord les villes les plus proches, et l'on s'arrête quand il reste `K` composantes : ce sont les groupes. L'écart est la longueur de la prochaine arête que Kruskal aurait gardée.

**Programme.**

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

**Vérification à la main.** Avec l'entrée

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

Kruskal garde `1 – 2`, `5 – 6`, `2 – 3` et `4 – 5` : il reste les groupes `{1, 2, 3}` et `{4, 5, 6}`. L'arête `1 – 3` (4) est interne ; la suivante, `3 – 4` (7), relie les deux groupes : le programme affiche `7`. Avec `K = 3`, il s'arrête après `2 – 3` et affiche `2`.

**Pourquoi c'est juste.** Soit `d` la réponse affichée. *Le partage obtenu a un écart `d`* : les arêtes plus courtes ont été examinées et sont internes, et l'arête de longueur `d` relie deux groupes. *Aucun partage ne fait mieux* : si chaque composante de Kruskal tenait entière dans un groupe, les `K` groupes non vides seraient des réunions des `K` composantes, donc exactement ces composantes. Un autre partage coupe donc une composante `C` entre deux groupes. Les arêtes gardées relient `C` : l'une d'elles relie deux groupes différents, et sa longueur est au plus `d`, puisqu'elle a été examinée avant. L'écart de ce partage est au plus `d`. **Coût** : O(M log M).

## À retenir

- Union-Find gère une partition avec `trouver` et `unir` ; avec l'union par taille et la compression des chemins, chaque opération coûte un temps quasi constant. La recherche s'écrit avec des boucles en Python.
- L'union par taille garantit une profondeur au plus log₂ N : un élément ne descend que si la taille de son ensemble double.
- Union-Find suit la connexité quand on ajoute des arêtes ; des suppressions connues à l'avance se traitent à l'envers, comme des ajouts.
- Propriété de coupure : l'arête la plus légère qui traverse une coupure appartient à un arbre couvrant minimal. Elle prouve Kruskal (tri puis Union-Find, O(M log M)) et Prim (tas, O(M log M)).
- Dans un arbre couvrant minimal, le chemin entre deux sommets minimise la plus lourde arête : les questions de seuil se traitent en ajoutant les arêtes par poids croissant.
