La programmation dynamique repose toujours sur la même question : **que faut-il savoir du passé pour décider de la suite ?** Ce chapitre présente quatre formes d'état qui reviennent sans cesse en concours : un ensemble codé en bits, un intervalle, un sommet d'arbre et un préfixe de chiffres.

## Sur les sous-ensembles : un masque de bits

Quand `N` est petit (jusqu'à 20 environ), un ensemble d'objets se code par un entier `m` dont le bit `j` vaut `1` si l'objet `j` est dedans. On remplace alors `N!` ordres par `2ᴺ` ensembles, en remarquant que la suite ne dépend que de **l'ensemble** des objets déjà traités, pas de leur ordre.

Exemple : `N` élèves et `N` places, `c[i][j]` est le coût de mettre l'élève `j` à la place `i`. On remplit les places dans l'ordre. Si `m` est l'ensemble des élèves placés, la dernière place remplie est la place `popcount(m) - 1`.

```python
INF = float("inf")
dp = [INF] * (1 << n)
dp[0] = 0
for m in range(1, 1 << n):
    i = bin(m).count("1") - 1          # place remplie en dernier
    for j in range(n):
        if m >> j & 1:
            dp[m] = min(dp[m], dp[m ^ (1 << j)] + c[i][j])
print(dp[(1 << n) - 1])
```

```cpp
vector<long long> dp(1 << n, LLONG_MAX);
dp[0] = 0;
for (int m = 1; m < (1 << n); m++) {
    int i = __builtin_popcount(m) - 1;  // place remplie en dernier
    for (int j = 0; j < n; j++)
        if ((m >> j) & 1) dp[m] = min(dp[m], dp[m ^ (1 << j)] + c[i][j]);
}
cout << dp[(1 << n) - 1] << "\n";
```

Les masques `m ^ (1 << j)` sont plus petits que `m` : parcourir `m` dans l'ordre croissant suffit. Coût : O(2ᴺ × N), soit environ 20 millions d'opérations pour N = 20.

## Sur les intervalles

Quand le problème porte sur une suite et qu'un choix **coupe** la suite en morceaux indépendants, on calcule `f[l][r]` pour chaque intervalle. Une valeur dépend d'intervalles plus courts : on parcourt `l` de droite à gauche, puis `r` de gauche à droite. Exemple : la plus longue sous-suite palindrome de `s`.

```python
f = [[0] * n for _ in range(n)]
for l in range(n - 1, -1, -1):
    f[l][l] = 1
    for r in range(l + 1, n):
        if s[l] == s[r]:
            f[l][r] = f[l + 1][r - 1] + 2
        else:
            f[l][r] = max(f[l + 1][r], f[l][r - 1])
```

```cpp
vector<vector<int>> f(n, vector<int>(n, 0));
for (int l = n - 1; l >= 0; l--) {
    f[l][l] = 1;
    for (int r = l + 1; r < n; r++) {
        if (s[l] == s[r]) f[l][r] = f[l + 1][r - 1] + 2;
        else f[l][r] = max(f[l + 1][r], f[l][r - 1]);
    }
}
```

Il y a O(N²) intervalles. Si chacun essaie O(N) points de coupe, le total est O(N³) : N ≤ 400 environ.

## Sur les arbres

On enracine l'arbre et on calcule, pour chaque sommet, quelques valeurs qui résument son sous-arbre. Elles se combinent à partir de celles des enfants. Il faut choisir ces **états** pour que le parent ait toute l'information utile, et rien de plus : chaque état en trop multiplie le travail. Exemple classique : l'ensemble indépendant de poids maximal (pas deux voisins choisis), avec `pris[v]` et `pas_pris[v]`.

Quand chaque sommet `i ≥ 2` a un parent `p[i] < i`, parcourir `i` de `N` à `1` traite les enfants avant leur parent, sans récursion :

```python
pris = w[:]                 # w[v] : poids du sommet v
pas_pris = [0] * (n + 1)
for v in range(n, 1, -1):
    pris[p[v]] += pas_pris[v]
    pas_pris[p[v]] += max(pris[v], pas_pris[v])
print(max(pris[1], pas_pris[1]))
```

```cpp
vector<long long> pris(w), pasPris(n + 1, 0);   // w[v] : poids du sommet v
for (int v = n; v >= 2; v--) {
    pris[p[v]] += pasPris[v];
    pasPris[p[v]] += max(pris[v], pasPris[v]);
}
cout << max(pris[1], pasPris[1]) << "\n";
```

Si la contrainte porte sur une distance plus grande, il faut plus d'états : par exemple, savoir si un **enfant** du sommet est choisi.

## Sur les chiffres

Pour compter les entiers de `[A, B]` qui ont une propriété liée à leurs chiffres, on calcule `compte(X)` sur `[0, X]`, puis `compte(B) - compte(A - 1)`. On parcourt les chiffres de `X` de gauche à droite. Tant qu'on recopie `X`, on reste « collé » à la borne. Dès qu'on met un chiffre plus petit, les chiffres suivants sont **libres**. Le nombre de suites libres ne dépend pas de `X` : on le calcule une seule fois.

Exemple : compter les entiers de `[0, X]` dont la somme des chiffres est multiple de `K`. `libre[L][r]` compte les suites de `L` chiffres de somme `≡ r` modulo `K`.

```python
libre = [[0] * K for _ in range(20)]
libre[0][0] = 1
for L in range(1, 20):
    for r in range(K):
        libre[L][r] = sum(libre[L - 1][(r - c) % K] for c in range(10))

def compte(x):              # entiers de [0, x]
    ch = list(map(int, str(x)))
    total, somme = 0, 0
    for i, d in enumerate(ch):
        for c in range(d):  # chiffre plus petit : la suite est libre
            total += libre[len(ch) - 1 - i][(-(somme + c)) % K]
        somme += d
    return total + (somme % K == 0)   # x lui-même
```

```cpp
long long libre[20][100];   // K ≤ 100
// libre[0][0] = 1 ; libre[L][r] = somme sur c de libre[L-1][(r - c) mod K]
long long compte(long long x) {   // entiers de [0, x]
    string ch = to_string(x);
    int k = ch.size();
    long long total = 0;
    int somme = 0;
    for (int i = 0; i < k; i++) {
        int d = ch[i] - '0';
        for (int c = 0; c < d; c++)   // chiffre plus petit : la suite est libre
            total += libre[k - 1 - i][((-(somme + c)) % K + K) % K];
        somme += d;
    }
    return total + (somme % K == 0);   // x lui-même
}
```

Ici, les zéros de tête sont sans effet. Quand ils comptent, comme pour une règle sur deux chiffres voisins, on traite à part les nombres plus courts que `X`.

## À retenir

- Masque de bits : quand l'ordre passé n'importe pas, `2ᴺ` ensembles remplacent `N!` ordres. O(2ᴺ × N) pour N ≤ 20.
- Intervalles : un choix qui coupe la suite en morceaux indépendants donne `f[l][r]`, calculé par longueurs croissantes ou `l` décroissant.
- Arbres : quelques états par sommet, combinés depuis les enfants. Avec `p[i] < i`, une simple boucle de `N` à `1`.
- Chiffres : borne collée, puis suites libres. La partie libre ne dépend pas de la borne : précalcule-la une fois.
