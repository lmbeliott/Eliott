Combien de façons de monter un escalier de `N` marches, par pas de `1` ou `2` marches ? Une fonction récursive qui essaie tous les choix recalcule des milliards de fois les mêmes questions. La **programmation dynamique** (DP) calcule chaque sous-problème **une seule fois** et range son résultat dans un tableau.

## Les trois questions à se poser

1. **L'état** : quel sous-problème note-t-on `dp[i]` ? Par exemple « le nombre de façons d'arriver sur la marche `i` ».
2. **La transition** : comment `dp[i]` se déduit-il de sous-problèmes plus petits ? On regarde souvent la **dernière décision** : le dernier pas venait de la marche `i - 1` ou `i - 2`.
3. **Les cas de base et l'ordre** : `dp[0] = 1`, puis on remplit le tableau dans un ordre où chaque case ne dépend que de cases déjà calculées.

```python
MOD = 1_000_000_007
dp = [0] * (n + 1)
dp[0] = 1
for i in range(1, n + 1):
    dp[i] = dp[i - 1]
    if i >= 2:
        dp[i] = (dp[i] + dp[i - 2]) % MOD
```

```cpp
const long long MOD = 1000000007LL;
vector<long long> dp(n + 1, 0);
dp[0] = 1;
for (int i = 1; i <= n; i++) {
    dp[i] = dp[i - 1];
    if (i >= 2) dp[i] = (dp[i] + dp[i - 2]) % MOD;
}
```

Les nombres de façons grandissent très vite : on prend le modulo à chaque addition. Le coût est le nombre d'états multiplié par le coût d'une transition, ici O(N).

## Chemins dans une grille

On traverse une grille de `R × C` nombres en allant à droite ou en bas, et on veut la plus grande somme. L'état est la case : `best[i][j]` est la meilleure somme d'un chemin qui finit en `(i, j)`. On y arrive par la case du dessus ou celle de gauche.

```python
best = [[0] * c for _ in range(r)]
for i in range(r):
    for j in range(c):
        avant = []
        if i > 0: avant.append(best[i - 1][j])
        if j > 0: avant.append(best[i][j - 1])
        best[i][j] = grille[i][j] + (max(avant) if avant else 0)
```

```cpp
vector<vector<long long>> best(r, vector<long long>(c, 0));
for (int i = 0; i < r; i++) {
    for (int j = 0; j < c; j++) {
        long long avant = LLONG_MIN;
        if (i > 0) avant = max(avant, best[i - 1][j]);
        if (j > 0) avant = max(avant, best[i][j - 1]);
        best[i][j] = grille[i][j] + (avant == LLONG_MIN ? 0 : avant);
    }
}
```

Il y a énormément de chemins, mais seulement `R × C` états. Pour **compter** les chemins optimaux, on garde un deuxième tableau : le nombre de chemins qui atteignent le maximum, en n'additionnant que ceux des cases qui réalisent ce maximum.

## Le sac à dos

On a des objets de poids `p` et de valeur `v`, et un sac de capacité `W`. Chaque objet est pris au plus une fois. L'état est la **capacité utilisée** : `best[w]` est la meilleure valeur pour un poids total au plus `w`. On ajoute les objets un par un, en parcourant `w` **en décroissant** pour ne pas prendre deux fois le même.

```python
best = [0] * (W + 1)
for p, v in objets:
    for w in range(W, p - 1, -1):
        best[w] = max(best[w], best[w - p] + v)
```

```cpp
vector<long long> best(W + 1, 0);
for (auto [p, v] : objets) {
    for (int w = W; w >= p; w--) {
        best[w] = max(best[w], best[w - p] + v);
    }
}
```

Coût : O(N × W). L'initialisation choisit le sens de `best[w]` : avec des `0` partout, c'est « poids au plus `w` » ; avec `best[0] = 0` et une valeur « impossible » ailleurs, c'est « poids **exactement** `w` ». Dans ce cas, il ne faut jamais prolonger un état impossible : avec `-1` comme valeur impossible, `best[w - p] + v` donnerait une valeur à un poids inatteignable. Il faut le tester avant la mise à jour :

```python
IMPOSSIBLE = -1
best = [IMPOSSIBLE] * (W + 1)
best[0] = 0
for p, v in objets:
    for w in range(W, p - 1, -1):
        if best[w - p] != IMPOSSIBLE:
            best[w] = max(best[w], best[w - p] + v)
```

```cpp
const long long IMPOSSIBLE = -1;
vector<long long> best(W + 1, IMPOSSIBLE);
best[0] = 0;
for (auto [p, v] : objets) {
    for (int w = W; w >= p; w--) {
        if (best[w - p] != IMPOSSIBLE) {
            best[w] = max(best[w], best[w - p] + v);
        }
    }
}
```

## Plus longue sous-suite croissante

On cherche la plus longue sous-suite strictement croissante d'une suite `a` (pas forcément contiguë). La DP directe, « `lis[i]` = plus longue sous-suite finissant en `i` », compare `i` à tous les `j < i` : O(N²).

On fait mieux avec un tableau `fin` où `fin[k]` est la plus petite valeur finale possible d'une sous-suite croissante de longueur `k + 1`. Ce tableau reste trié : pour chaque valeur, une **dichotomie** trouve sa place.

```python
from bisect import bisect_left
fin = []
for x in a:
    k = bisect_left(fin, x)   # premier élément >= x
    if k == len(fin):
        fin.append(x)
    else:
        fin[k] = x
print(len(fin))
```

```cpp
vector<int> fin;
for (int x : a) {
    auto it = lower_bound(fin.begin(), fin.end(), x);   // premier élément >= x
    if (it == fin.end()) fin.push_back(x);
    else *it = x;
}
cout << fin.size() << "\n";
```

Coût : O(N log N). Avec `bisect_right` (`upper_bound`), on obtiendrait la plus longue sous-suite **croissante au sens large**.

## À retenir

- Définir précisément l'**état**, la **transition** (souvent : la dernière décision) et les **cas de base**.
- Remplir le tableau dans un ordre où chaque case ne dépend que de cases déjà calculées.
- Coût = nombre d'états × coût d'une transition.
- Sac à dos 0/1 : boucle sur le poids **décroissante** ; l'initialisation décide entre « au plus » et « exactement ».
- La plus longue sous-suite croissante se calcule en O(N log N) avec un tableau trié et une dichotomie.
