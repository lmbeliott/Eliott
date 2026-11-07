Les sommes préfixes donnent la somme de `a[l..r]` en O(1)… tant que le tableau ne change pas : une modification oblige à tout recalculer, en O(N). Les structures de ce chapitre font les deux opérations, modifier et interroger, en **O(log N)**. Elles reposent sur l'écriture binaire : commençons par là.

## Les opérations sur les bits

Les opérateurs `&` (et), `|` (ou), `^` (ou exclusif), `<<` et `>>` (décalages) agissent bit par bit, en Python comme en C++.

- `1 << p` vaut 2ᵖ : seul le bit `p` est à `1`.
- `(x >> p) & 1` lit le bit `p` de `x`.
- `x | (1 << p)` met le bit `p` à `1` ; `x ^ (1 << p)` l'inverse.
- `x & -x` isole le bit à `1` le plus faible : `12 & -12 = 4`, car `12 = 1100` en binaire.

Un entier peut coder un **ensemble** d'éléments numérotés de `0` à `k - 1` : l'élément `p` est présent si le bit `p` vaut `1`. On l'appelle un **masque**. Alors `a & b` est l'intersection, `a | b` la réunion, et `(a & b) == a` teste si `a` est inclus dans `b`. Garde les parenthèses : en C++, `==` est prioritaire sur `&`, `|` et `^`, et `a & b == a` se lit `a & (b == a)`. Parcourir tous les ensembles revient à parcourir les entiers de `0` à `2ᵏ - 1`.

```python
k = 3
for m in range(1 << k):
    elements = [p for p in range(k) if (m >> p) & 1]
    print(m, elements)
```

```cpp
int k = 3;
for (int m = 0; m < (1 << k); m++) {
    cout << m << " :";
    for (int p = 0; p < k; p++)
        if ((m >> p) & 1) cout << " " << p;
    cout << "\n";
}
```

Pour parcourir les **sous-ensembles** d'un masque `b`, pars de `a = b` et fais `a = (a - 1) & b` jusqu'à `0`, sans oublier `0` lui-même. Pour obtenir, pour **chaque** masque `m`, la somme d'une valeur `c[a]` sur tous les `a` inclus dans `m`, il y a plus rapide que d'énumérer : la **somme sur les sous-ensembles** traite les bits un par un, en O(k × 2ᵏ).

```python
S = c[:]                         # c[a] : valeur du masque a
for b in range(k):
    for m in range(1 << k):
        if m & (1 << b):
            S[m] += S[m ^ (1 << b)]
# S[m] = somme des c[a] pour a inclus dans m
```

```cpp
vector<long long> S = c;         // c[a] : valeur du masque a
for (int b = 0; b < k; b++)
    for (int m = 0; m < (1 << k); m++)
        if (m & (1 << b)) S[m] += S[m ^ (1 << b)];
// S[m] = somme des c[a] pour a inclus dans m
```

## L'arbre de Fenwick

L'arbre de Fenwick stocke, dans la case `i` (numérotée à partir de `1`), la somme des `i & -i` dernières valeurs jusqu'à `i`. Pour une somme de préfixe, on enlève le bit le plus faible de `i` jusqu'à arriver à `0` ; pour une modification, on l'ajoute jusqu'à dépasser `N`. Chaque boucle fait au plus log₂ N tours.

```python
arbre = [0] * (n + 1)

def ajoute(i, x):        # a[i] += x
    while i <= n:
        arbre[i] += x
        i += i & -i

def somme(i):            # a[1] + ... + a[i]
    s = 0
    while i > 0:
        s += arbre[i]
        i -= i & -i
    return s
```

```cpp
vector<long long> arbre(n + 1, 0);

void ajoute(int i, long long x) {   // a[i] += x
    for (; i <= n; i += i & -i) arbre[i] += x;
}

long long somme(int i) {            // a[1] + ... + a[i]
    long long s = 0;
    for (; i > 0; i -= i & -i) s += arbre[i];
    return s;
}
```

La somme de `a[l..r]` vaut `somme(r) - somme(l - 1)`. Un Fenwick sur les **valeurs** (case `v` = nombre de `v` déjà vus) compte vite les éléments déjà vus plus petits que `v`.

## L'arbre de segments

Le Fenwick sait faire des sommes, mais pas un **maximum** avec des modifications quelconques. L'arbre de segments, lui, accepte toute opération associative (somme, minimum, maximum…). On prend une taille `T`, puissance de deux au moins égale à `N`. Les feuilles sont aux indices `T` à `2T - 1`, le nœud `k` a pour fils `2k` et `2k + 1`, et contient le maximum de leurs deux valeurs. La racine est le nœud `1`.

```python
T = 1
while T < n:
    T *= 2
arbre = [0] * (2 * T)       # arbre[T + i] = a[i], i à partir de 0
for i in range(n):
    arbre[T + i] = a[i]
for k in range(T - 1, 0, -1):   # construction, des feuilles vers la racine
    arbre[k] = max(arbre[2 * k], arbre[2 * k + 1])

def modifie(i, v):
    k = T + i
    arbre[k] = v
    while k > 1:
        k //= 2
        arbre[k] = max(arbre[2 * k], arbre[2 * k + 1])

def maximum(l, r):          # max de a[l..r-1], valeurs ≥ 0
    res = 0
    l, r = l + T, r + T
    while l < r:
        if l % 2 == 1:
            res = max(res, arbre[l])
            l += 1
        if r % 2 == 1:
            r -= 1
            res = max(res, arbre[r])
        l, r = l // 2, r // 2
    return res
```

```cpp
int T = 1;
vector<int> arbre;

void construit(const vector<int>& a) {   // arbre[T + i] = a[i], i à partir de 0
    int n = a.size();
    while (T < n) T *= 2;
    arbre.assign(2 * T, 0);
    for (int i = 0; i < n; i++) arbre[T + i] = a[i];
    for (int k = T - 1; k >= 1; k--) arbre[k] = max(arbre[2 * k], arbre[2 * k + 1]);
}

void modifie(int i, int v) {
    int k = T + i;
    arbre[k] = v;
    for (k /= 2; k >= 1; k /= 2) arbre[k] = max(arbre[2 * k], arbre[2 * k + 1]);
}

int maximum(int l, int r) {   // max de a[l..r-1], valeurs ≥ 0
    int res = 0;
    for (l += T, r += T; l < r; l /= 2, r /= 2) {
        if (l % 2 == 1) res = max(res, arbre[l++]);
        if (r % 2 == 1) res = max(res, arbre[--r]);
    }
    return res;
}
```

La requête utilise au plus deux nœuds par niveau. Le maximum d'un nœud sert aussi à **éliminer** un bloc entier d'un coup, ce qui permet de chercher le premier élément assez grand en descendant dans l'arbre.

## À retenir

- `1 << p`, `(x >> p) & 1` et `x & -x` sont les gestes de base sur les bits ; un masque code un ensemble. En C++, mets des parenthèses : `(a & b) == a`.
- La somme sur les sous-ensembles calcule, pour tous les masques à la fois, une somme sur leurs sous-ensembles en O(k × 2ᵏ).
- Fenwick : modification et somme de préfixe en O(log N), en ajoutant ou retirant `i & -i`.
- Arbre de segments : toute opération associative, modification et requête en O(log N).
