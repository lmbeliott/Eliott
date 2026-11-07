Les problèmes d'arithmétique cachent souvent de très grands nombres : 10¹², 10¹⁸. Impossible alors de tout essayer un par un. Quelques outils classiques permettent de calculer vite, sans jamais parcourir ces nombres.

## Le PGCD avec l'algorithme d'Euclide

Le PGCD (plus grand commun diviseur) de a et b est le plus grand entier qui divise les deux. L'algorithme d'Euclide repose sur une remarque : les diviseurs communs de a et b sont les mêmes que ceux de b et de `a mod b`. On remplace donc (a, b) par (b, a mod b) jusqu'à ce que b vaille 0.

```python
def pgcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

print(pgcd(84, 36))   # 12
```

```cpp
long long pgcd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}
// pgcd(84, 36) vaut 12
```

C'est très rapide : O(log(min(a, b))), une centaine d'étapes au plus même pour 10¹⁸. Le PPCM (plus petit commun multiple) s'en déduit : `ppcm(a, b) = a / pgcd(a, b) × b`. Divise **avant** de multiplier, pour éviter un dépassement en C++.

## Le crible d'Ératosthène

Pour connaître tous les nombres premiers jusqu'à N, on écrit tous les nombres, puis pour chaque nombre p encore présent (il est premier), on raye ses multiples. On commence à p × p : les multiples plus petits ont un diviseur premier plus petit que p, ils sont déjà rayés. Et il suffit de s'arrêter à p ≤ √N.

```python
n = 50
est_premier = [True] * (n + 1)
est_premier[0] = est_premier[1] = False
p = 2
while p * p <= n:
    if est_premier[p]:
        for m in range(p * p, n + 1, p):
            est_premier[m] = False
    p += 1
print([x for x in range(n + 1) if est_premier[x]])   # 2, 3, 5, ..., 47
```

```cpp
int n = 50;
vector<bool> est_premier(n + 1, true);
est_premier[0] = est_premier[1] = false;
for (int p = 2; p * p <= n; p++) {
    if (est_premier[p]) {
        for (int m = p * p; m <= n; m += p) est_premier[m] = false;
    }
}
// les x tels que est_premier[x] : 2, 3, 5, ..., 47
```

Le crible coûte O(N log log N), presque O(N). La même idée marche sur un intervalle [L, R] loin de 0 : il suffit de rayer les multiples des nombres premiers jusqu'à √R.

## Compter les diviseurs

Les diviseurs de n vont par paires : si d divise n, alors n / d aussi, et l'un des deux est au plus √n. Pour trouver tous les diviseurs, il suffit donc d'essayer d de 1 à √n : O(√n) au lieu de O(n).

```python
def nombre_de_diviseurs(n):
    total = 0
    d = 1
    while d * d <= n:
        if n % d == 0:
            total += 1 if d * d == n else 2   # d et n / d
        d += 1
    return total

print(nombre_de_diviseurs(36))   # 9
```

```cpp
int nombre_de_diviseurs(long long n) {
    int total = 0;
    for (long long d = 1; d * d <= n; d++) {
        if (n % d == 0) total += (d * d == n) ? 1 : 2;   // d et n / d
    }
    return total;
}
// nombre_de_diviseurs(36) vaut 9
```

Autre astuce utile : parmi les nombres de 1 à n, exactement `n // d` sont des multiples de d. Pour compter des diviseurs sur beaucoup de nombres à la fois, on peut donc raisonner diviseur par diviseur.

## Calculer modulo M

Quand un résultat est énorme, on demande souvent son reste modulo M. Les restes se calculent au fur et à mesure : `(a + b) mod M` et `(a × b) mod M` ne dépendent que de `a mod M` et `b mod M`. On réduit donc après **chaque** opération, et les nombres restent petits. Pour une soustraction, ajoute M avant de réduire, pour ne pas obtenir de reste négatif en C++. Attention : la **division** ne marche pas comme ça ; `(a / b) mod M` ne se calcule pas à partir des restes.

## La puissance rapide

Calculer A^N mod M avec N multiplications est trop lent pour N = 10¹⁸. On utilise A^N = (A^(N/2))² quand N est pair, et A^N = A^(N−1) × A quand N est impair : N est au moins divisé par deux tous les deux appels.

```python
def puissance(a, n, m):
    if n == 0:
        return 1 % m
    if n % 2 == 0:
        moitie = puissance(a, n // 2, m)
        return moitie * moitie % m
    return puissance(a, n - 1, m) * a % m

print(puissance(3, 10**18, 1000))
```

```cpp
long long puissance(long long a, long long n, long long m) {
    if (n == 0) return 1 % m;
    if (n % 2 == 0) {
        long long moitie = puissance(a, n / 2, m);
        return moitie * moitie % m;
    }
    return puissance(a, n - 1, m) * (a % m) % m;
}
```

C'est O(log N). En C++, si M ≤ 10⁹, le produit de deux restes est inférieur à 10¹⁸ et tient dans un `long long`. Cette façon de couper en deux se réutilise pour d'autres sommes et produits répétés.

## À retenir

- L'algorithme d'Euclide calcule le PGCD en O(log n) ; le PPCM vaut `a / pgcd(a, b) × b`.
- Le crible raye les multiples de chaque nombre premier p à partir de p × p ; il suffit d'aller jusqu'à √N.
- Les diviseurs vont par paires (d, n / d) : on les trouve tous en O(√n).
- Modulo M, réduis après chaque addition et chaque multiplication ; ne divise jamais.
- La puissance rapide calcule A^N mod M en O(log N) en coupant N en deux.
