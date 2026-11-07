Les problèmes de finale ne demandent presque jamais un algorithme nouveau. Ils en **combinent** deux ou trois que tu connais déjà, et toute la difficulté est de voir comment les assembler. Ce chapitre rassemble les combinaisons qui reviennent le plus souvent, et quelques outils qui manquent encore.

## Chercher la réponse, puis vérifier

Quand on demande « la plus grande valeur telle que… », demande-toi si la question **inverse** est plus simple : « cette valeur `x` convient-elle ? ». Si la réponse est monotone (vraie jusqu'à un seuil, fausse ensuite), une dichotomie sur `x` la trouve avec environ 30 vérifications. La vérification est souvent un parcours en largeur, un glouton ou une programmation dynamique. Quand la réponse est forcément une des valeurs de l'entrée, fais la dichotomie sur la liste triée de ces valeurs.

## Hors ligne : changer l'ordre des questions

Si toutes les questions sont connues dès le début, rien n'oblige à y répondre dans l'ordre. On les **trie** selon le paramètre qui rend le problème croissant, puis on remet les réponses dans l'ordre de l'entrée.

- Questions « avec les arêtes de poids ≤ t » : par `t` croissant, les arêtes ne font que s'ajouter, et union-find suffit.
- Questions sur des intervalles `[l, r]` : par `r` croissant, on fait avancer un **balayage** et un arbre de Fenwick garde l'information utile pour chaque `l`.

Pour ajouter une valeur sur tout un intervalle `[x, y]` et lire un seul point, on travaille sur les **différences** : `+v` en `x`, `-v` en `y + 1`. La valeur en `l` est alors une somme de préfixe.

Quand union-find doit aussi fusionner des ensembles (des couleurs, des valeurs…), verse toujours le **plus petit dans le plus grand**. Un élément déplacé arrive dans un ensemble au moins deux fois plus grand, donc il ne bouge que `log₂ N` fois.

```python
def fusionne(a, b):            # a et b sont des racines différentes
    if len(ens[a]) < len(ens[b]):
        a, b = b, a
    ens[a] |= ens[b]            # on verse le petit dans le grand
    ens[b] = None
    parent[b] = a
```

```cpp
void fusionne(int a, int b) {  // a et b sont des racines différentes
    if (ens[a].size() < ens[b].size()) swap(a, b);
    for (int x : ens[b]) ens[a].insert(x);   // on verse le petit dans le grand
    set<int>().swap(ens[b]);
    parent[b] = a;
}
```

## Compter modulo un nombre premier

Pour compter des chemins ou des choix, on a besoin de coefficients binomiaux `C(n, k)` modulo `p = 10⁹ + 7`. On précalcule les factorielles, puis l'inverse de la dernière par le petit théorème de Fermat (`x^(p-2)` est l'inverse de `x`), et les autres en reculant.

```python
P = 10**9 + 7
fact = [1] * (m + 1)
for i in range(1, m + 1):
    fact[i] = fact[i - 1] * i % P
inv = [1] * (m + 1)
inv[m] = pow(fact[m], P - 2, P)
for i in range(m, 0, -1):
    inv[i - 1] = inv[i] * i % P

def binom(n, k):
    return fact[n] * inv[k] % P * inv[n - k] % P if 0 <= k <= n else 0
```

```cpp
const long long P = 1000000007LL;
long long puissance(long long a, long long e) {
    long long r = 1;
    for (a %= P; e > 0; e >>= 1, a = a * a % P)
        if (e & 1) r = r * a % P;
    return r;
}
// fact[i] = fact[i-1] * i % P ; inv[m] = puissance(fact[m], P - 2) ; inv[i-1] = inv[i] * i % P
long long binom(int n, int k) {
    if (k < 0 || k > n) return 0;
    return fact[n] * inv[k] % P * inv[n - k] % P;
}
```

Pour éviter des cases interdites, trie-les et compte, pour chacune, les chemins qui l'atteignent **sans** passer par une autre avant. On retire alors, pour chaque case `j` plus tôt, les chemins dont la *première* case interdite est `j`. Penser au **complémentaire** (« au moins un » = tout − « aucun ») simplifie souvent le reste.

## Jeux : Sprague-Grundy

Dans un jeu à deux joueurs où celui qui ne peut plus jouer perd, chaque position a un **nombre de Grundy** : le plus petit entier positif ou nul (le *mex*) qui n'est pas la valeur d'une position atteignable en un coup. Une position vaut `0` exactement quand le joueur qui doit jouer perd. Le théorème clé : si le jeu est fait de plusieurs jeux **indépendants** et qu'on joue dans un seul à chaque coup, la valeur de l'ensemble est le **XOR** des valeurs. C'est la règle du jeu de Nim.

```python
def mex(valeurs):
    vus = set(valeurs)
    m = 0
    while m in vus:
        m += 1
    return m
```

```cpp
int mex(const vector<int>& valeurs) {
    set<int> vus(valeurs.begin(), valeurs.end());
    int m = 0;
    while (vus.count(m)) m++;
    return m;
}
```

Pour **compter les coups gagnants**, cherche les coups qui ramènent le XOR total à `0`.

## Les grandes entrées générées

Pour garder des fichiers de test petits, certains énoncés décrivent un générateur pseudo-aléatoire. Recopie-le exactement, dans l'ordre des appels. Le calcul modulo 2⁶⁴ est automatique en C++ avec `unsigned long long`. En Python, il faut prendre le reste (`% 2**64`) à chaque étape.

## À retenir

- Dichotomie sur la réponse : transforme « trouver le meilleur » en « vérifier une valeur ».
- Hors ligne : trie les questions pour que les données ne fassent que s'ajouter (union-find, balayage + Fenwick).
- Union-find avec ensembles : toujours le petit dans le grand, O(N log N).
- Combinatoire modulo p : factorielles, inverse par Fermat, complémentaire et « première case interdite ».
- Jeux : mex, XOR des jeux indépendants, et un coup gagnant ramène le XOR à `0`.
