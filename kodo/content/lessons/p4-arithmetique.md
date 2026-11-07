Combien 720 720 a-t-il de diviseurs ? Quel est le reste de 2^(10¹⁸) dans la division par 10⁹ + 7 ? Pour quels x le nombre 17 × x a-t-il pour reste 1 dans la division par 3 120 ? Ces questions reposent toutes sur quelques outils : les **nombres premiers**, qui sont les briques de tous les entiers, et le **calcul modulaire**, qui permet de manipuler des nombres gigantesques par leurs restes.

Le niveau 3 a présenté l'algorithme d'Euclide et l'exponentiation rapide, avec leurs preuves. Ce chapitre s'appuie dessus : crible d'Ératosthène, décomposition en facteurs premiers, nombre et somme des diviseurs, algorithme d'Euclide étendu, inverse modulaire et congruences, sans oublier les pièges de débordement propres au C++.

## Le crible d'Ératosthène

Un entier `n ≥ 2` est **premier** s'il n'a pas d'autre diviseur positif que 1 et lui-même ; 1 n'est pas premier. Pour trouver tous les premiers jusqu'à `n`, tester chaque nombre séparément est lent. Le **crible d'Ératosthène** procède à l'envers : on part d'un tableau où tous les nombres de 2 à `n` sont marqués « premiers », et pour chaque `p` encore marqué, on barre ses multiples.

```python
def crible(n):
    # premier[k] vaut True si et seulement si k est premier (0 <= k <= n)
    premier = [True] * (n + 1)
    premier[0] = premier[1] = False
    p = 2
    while p * p <= n:
        if premier[p]:
            for multiple in range(p * p, n + 1, p):
                premier[multiple] = False
        p += 1
    return premier

premier = crible(100)
liste = [k for k in range(101) if premier[k]]
print(len(liste), liste[-5:])
print(sum(crible(10**6)))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

// premier[k] vaut true si et seulement si k est premier (0 <= k <= n)
vector<bool> crible(int n) {
    vector<bool> premier(n + 1, true);
    premier[0] = premier[1] = false;
    for (long long p = 2; p * p <= n; p++) {
        if (premier[p]) {
            for (long long multiple = p * p; multiple <= n; multiple += p) {
                premier[multiple] = false;
            }
        }
    }
    return premier;
}

int main() {
    vector<bool> premier = crible(100);
    vector<int> liste;
    for (int k = 0; k <= 100; k++) {
        if (premier[k]) liste.push_back(k);
    }
    cout << liste.size() << " ";
    for (int i = liste.size() - 5; i < (int) liste.size(); i++) cout << liste[i] << " ";
    cout << "\n";
    vector<bool> grand = crible(1000000);
    int compte = 0;
    for (bool b : grand) compte += b;
    cout << compte << "\n";
    return 0;
}
```

Le programme affiche `25 [73, 79, 83, 89, 97]` : il y a 25 nombres premiers jusqu'à 100. Puis `78498`, le nombre de premiers jusqu'à un million, obtenu instantanément.

**Deux remarques rendent le crible juste et rapide.** D'abord, on barre les multiples de `p` à partir de `p²` : un multiple plus petit, `k × p` avec `k < p`, a un facteur premier plus petit que `p` et a déjà été barré. Ensuite, on s'arrête quand `p² > n`. C'est la propriété clé de tout ce chapitre : **un entier composé `m` a un facteur premier au plus égal à √m**. En effet, si `m = a × b` avec `1 < a ≤ b`, alors `a × a ≤ a × b = m`, donc `a ≤ √m`, et un facteur premier de `a` convient.

**Correction.** Un nombre barré est un multiple `k × p` avec `k ≥ p ≥ 2` : il est composé. Inversement, un composé `m ≤ n` a un facteur premier `p ≤ √m ≤ √n` ; quand la boucle arrive à `p`, il est encore marqué (un premier n'est jamais barré, puisqu'il n'est multiple d'aucun nombre plus petit que lui sauf 1), et `m`, multiple de `p` au moins égal à `p²`, est barré. À la fin, les nombres marqués sont exactement les premiers.

**Coût.** Pour chaque premier `p ≤ √n`, on fait environ `n / p` opérations. Le total vaut `n × (1/2 + 1/3 + 1/5 + 1/7 + …)`, une somme sur les seuls nombres premiers. Le niveau 3 a montré que la somme des `1/k` pour tous les `k` jusqu'à `n` vaut environ `ln n` ; restreinte aux premiers, elle ne vaut qu'environ `ln(ln n)` (on admet ce résultat), soit environ 3 pour `n = 10⁹`. Le crible est en **O(n log log n)** : presque linéaire.

## Le plus petit facteur premier

Une variante du crible range, pour chaque `x`, son **plus petit facteur premier** `pf[x]`. On procède de la même façon, mais au lieu de barrer un multiple, on y écrit `p` s'il n'a pas encore de facteur. Ensuite, décomposer n'importe quel `x ≤ n` est immédiat : on divise par `pf[x]`, puis on recommence avec le quotient.

```python
N = 1000
pf = [0] * (N + 1)          # pf[x] : plus petit facteur premier de x (0 si x est premier)
p = 2
while p * p <= N:
    if pf[p] == 0:
        for m in range(p * p, N + 1, p):
            if pf[m] == 0:
                pf[m] = p
    p += 1

def facteurs(x):
    res = []
    while x > 1:
        q = pf[x] if pf[x] != 0 else x
        res.append(q)
        x //= q
    return res

print(facteurs(360), facteurs(997), facteurs(1000))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

const int N = 1000;
vector<int> pf(N + 1, 0);   // pf[x] : plus petit facteur premier de x (0 si x est premier)

vector<int> facteurs(int x) {
    vector<int> res;
    while (x > 1) {
        int q = (pf[x] != 0) ? pf[x] : x;
        res.push_back(q);
        x /= q;
    }
    return res;
}

int main() {
    for (int p = 2; p * p <= N; p++) {
        if (pf[p] == 0) {
            for (int m = p * p; m <= N; m += p) {
                if (pf[m] == 0) pf[m] = p;
            }
        }
    }
    for (int x : {360, 997, 1000}) {
        for (int q : facteurs(x)) cout << q << " ";
        cout << "| ";
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche les facteurs `2 2 2 3 3 5` pour 360, `997` (premier) et `2 2 2 5 5 5` pour 1000. Le premier `p` qui écrit dans `pf[m]` est le plus petit facteur premier de `m`, car les `p` sont traités dans l'ordre croissant. Chaque division divise `x` au moins par 2, donc une décomposition coûte au plus `log₂ x` étapes. C'est l'outil idéal pour décomposer **beaucoup** de nombres pas trop grands.

## Décomposer par divisions successives

Pour un seul nombre trop grand pour un crible, par exemple `n ≤ 10¹²`, on essaie les diviseurs `d = 2, 3, 4, …` tant que `d × d ≤ n`, en divisant `n` par `d` autant de fois que possible.

```python
def decomposition(n):
    # liste des couples (premier, exposant)
    res = []
    d = 2
    while d * d <= n:
        if n % d == 0:
            e = 0
            while n % d == 0:
                n //= d
                e += 1
            res.append((d, e))
        d += 1
    if n > 1:                   # ce qui reste est premier
        res.append((n, 1))
    return res

print(decomposition(360))
print(decomposition(600851475143))
```

```cpp
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

// liste des couples (premier, exposant)
vector<pair<long long, int>> decomposition(long long n) {
    vector<pair<long long, int>> res;
    for (long long d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            int e = 0;
            while (n % d == 0) {
                n /= d;
                e++;
            }
            res.push_back({d, e});
        }
    }
    if (n > 1) {                // ce qui reste est premier
        res.push_back({n, 1});
    }
    return res;
}

int main() {
    for (long long n : {360LL, 600851475143LL}) {
        for (auto& pe : decomposition(n)) cout << pe.first << "^" << pe.second << " ";
        cout << "\n";
    }
    return 0;
}
```

Le programme trouve 360 = 2³ × 3² × 5 et 600 851 475 143 = 71 × 839 × 1 471 × 6 857. **Correction.** Invariant : à chaque tour, le `n` courant n'a aucun facteur premier strictement inférieur à `d`. Un `d` qui divise `n` est donc premier (sinon un de ses facteurs premiers, plus petit, diviserait `n`). À la sortie, `d × d > n` : si `n > 1`, il n'a aucun facteur premier au plus √n, il est donc premier. **Coût** : au plus √n tours, soit 10⁶ pour `n = 10¹²` ; on divise ce nombre par deux en ne testant que 2 puis les impairs.

## Nombre et somme des diviseurs

Tout entier `n ≥ 2` s'écrit de façon **unique** comme produit de nombres premiers : `n = p₁^e₁ × p₂^e₂ × … × p_k^e_k`. Un diviseur de `n` a alors la forme `p₁^f₁ × … × p_k^f_k` avec `0 ≤ fᵢ ≤ eᵢ`, et deux choix différents d'exposants donnent deux diviseurs différents. On en déduit :

- le **nombre de diviseurs** : `d(n) = (e₁ + 1) × (e₂ + 1) × … × (e_k + 1)`, puisqu'on choisit chaque exposant parmi `eᵢ + 1` valeurs ;
- la **somme des diviseurs** : `σ(n) = (1 + p₁ + … + p₁^e₁) × … × (1 + p_k + … + p_k^e_k)`, car en développant ce produit on obtient chaque diviseur exactement une fois.

Pour 360 = 2³ × 3² × 5, on trouve `d = 4 × 3 × 2 = 24` diviseurs, de somme `σ = 15 × 13 × 6 = 1170`. La somme `1 + p + … + p^e` vaut aussi `(p^(e+1) − 1) / (p − 1)`. Ces formules transforment une énumération impossible (10¹² candidats) en une décomposition.

## L'algorithme d'Euclide étendu

**Théorème de Bézout.** Pour tous entiers `a, b ≥ 0` non tous deux nuls, il existe des entiers `u` et `v` (positifs ou négatifs) tels que `a × u + b × v = PGCD(a, b)`. L'algorithme d'Euclide les calcule au passage. Si `b = 0`, `PGCD(a, 0) = a = a × 1 + 0 × 0`. Sinon, on calcule récursivement `u'` et `v'` tels que `b × u' + (a mod b) × v' = g`, puis on remplace `a mod b` par `a − ⌊a/b⌋ × b` : `a × v' + b × (u' − ⌊a/b⌋ × v') = g`. Il suffit donc de prendre `u = v'` et `v = u' − ⌊a/b⌋ × v'`.

```python
def euclide_etendu(a, b):
    # renvoie (g, u, v) avec a × u + b × v = g = PGCD(a, b)
    if b == 0:
        return a, 1, 0
    g, u, v = euclide_etendu(b, a % b)
    return g, v, u - (a // b) * v

print(euclide_etendu(240, 46))
g, u, v = euclide_etendu(17, 3120)
print(g, u, u % 3120)
```

```cpp
#include <iostream>
using namespace std;

// renvoie g = PGCD(a, b) et remplit u, v avec a × u + b × v = g
long long euclideEtendu(long long a, long long b, long long& u, long long& v) {
    if (b == 0) {
        u = 1;
        v = 0;
        return a;
    }
    long long u1, v1;
    long long g = euclideEtendu(b, a % b, u1, v1);
    u = v1;
    v = u1 - (a / b) * v1;
    return g;
}

int main() {
    long long u, v;
    long long g = euclideEtendu(240, 46, u, v);
    cout << g << " " << u << " " << v << "\n";
    g = euclideEtendu(17, 3120, u, v);
    cout << g << " " << u << " " << ((u % 3120) + 3120) % 3120 << "\n";
    return 0;
}
```

Le programme affiche `(2, -9, 47)` : en effet 240 × (−9) + 46 × 47 = −2 160 + 2 162 = 2. Puis `1 -367 2753` : 17 × (−367) + 3 120 × v = 1, et 17 × 2 753 = 46 801 = 15 × 3 120 + 1. La correction se prouve par récurrence, comme le calcul ci-dessus ; la récursion a la profondeur d'Euclide, quelques dizaines d'appels.

## Calculer modulo M

On écrit `a ≡ b (mod M)` quand `a` et `b` ont le même reste dans la division par `M`, c'est-à-dire quand `M` divise `a − b`. Les restes sont compatibles avec les opérations : `(a + b) mod M`, `(a − b) mod M` et `(a × b) mod M` ne dépendent que de `a mod M` et `b mod M`. On peut donc réduire à chaque étape d'un calcul, et garder des nombres petits. Il n'en va pas de même pour la division : `6 ≡ 16 (mod 10)`, mais `6/2 = 3` et `16/2 = 8` n'ont pas le même reste.

```python
print(-7 % 3, (-7) // 3)
m = 1000000007
print(pow(3, m - 2, m), 3 * pow(3, m - 2, m) % m)
```

```cpp
#include <iostream>
using namespace std;

long long puissance(long long a, long long n, long long m) {
    long long r = 1;
    a = a % m;
    while (n > 0) {
        if (n % 2 == 1) r = r * a % m;
        a = a * a % m;
        n = n / 2;
    }
    return r;
}

int main() {
    cout << -7 % 3 << " " << (-7) / 3 << "\n";
    cout << ((-7 % 3) + 3) % 3 << "\n";
    long long m = 1000000007;
    long long inv = puissance(3, m - 2, m);
    cout << inv << " " << 3 * inv % m << "\n";
    return 0;
}
```

Python affiche `2 -3` : son reste est toujours entre 0 et `M − 1`. Le C++ affiche `-1 -2` : sa division tronque vers zéro, et le reste d'un nombre négatif est négatif. Après une soustraction, on écrit donc `((x % M) + M) % M` en C++ : la deuxième ligne affiche `2`, comme Python. Enfin, en C++, un produit de deux restes inférieurs à 10⁹ + 7 vaut au plus 10¹⁸ environ et tient dans un `long long` : on réduit **avant** chaque multiplication.

## L'inverse modulaire

Un **inverse** de `a` modulo `M` est un entier `u` tel que `a × u ≡ 1 (mod M)`. Il remplace la division : diviser par `a` modulo `M`, c'est multiplier par `u`. **Il existe si et seulement si `PGCD(a, M) = 1`.** Si `a × u + M × v = 1` (Bézout), alors `a × u ≡ 1` ; réciproquement, si `a × u ≡ 1`, alors `a × u − 1` est un multiple de `M`, et tout diviseur commun de `a` et `M` divise 1. L'algorithme d'Euclide étendu calcule donc l'inverse, ramené entre 0 et `M − 1` : l'inverse de 17 modulo 3 120 est 2 753.

Quand `M = p` est **premier**, il y a plus simple. **Petit théorème de Fermat** : si `p` ne divise pas `a`, alors `a^(p−1) ≡ 1 (mod p)`. Preuve : les nombres `a, 2a, …, (p − 1)a` ont des restes non nuls et deux à deux différents (si `ia ≡ ja`, alors `p` divise `(i − j)a`, donc `i − j`, puisque `p` est premier et ne divise pas `a`). Ce sont donc les restes `1, 2, …, p − 1` dans un autre ordre, et leur produit donne `a^(p−1) × (p − 1)! ≡ (p − 1)! (mod p)`. Comme `(p − 1)!` est premier avec `p`, on peut simplifier. Conséquence : `a^(p−2)` est l'inverse de `a`, calculé par exponentiation rapide. Autre conséquence : si `p` ne divise pas `a`, on peut réduire un exposant modulo `p − 1`, car pour `n = q × (p − 1) + r`, `a^n = (a^(p−1))^q × a^r ≡ a^r (mod p)`. Le programme précédent affiche `333333336 1` : 333 333 336 est l'inverse de 3 modulo 10⁹ + 7, car 3 × 333 333 336 = 10⁹ + 8. Attention : Fermat ne s'applique que si `p` est premier et ne divise pas `a`.

## Congruences linéaires et PPCM

Pour résoudre `a × x ≡ b (mod M)`, on pose `g = PGCD(a, M)`. Si `g` ne divise pas `b`, il n'y a pas de solution, puisque `a × x − b` devrait être un multiple de `M`, donc de `g`. Sinon, on divise tout par `g` : `a/g` est premier avec `M/g`, il a un inverse `u` modulo `M/g`, et les solutions sont les `x ≡ u × (b/g) (mod M/g)` ; il y en a `g` entre 0 et `M − 1`. Un système de deux congruences `x ≡ a₁ (mod m₁)`, `x ≡ a₂ (mod m₂)` se ramène à une telle équation en écrivant `x = a₁ + m₁ × k` : la seconde condition devient `m₁ × k ≡ a₂ − a₁ (mod m₂)`. Elle détermine `k` modulo `m₂ / g`, avec `g = PGCD(m₁, m₂)`, donc `x` modulo `m₁ × m₂ / g = PPCM(m₁, m₂)` : quand il y a des solutions, elles forment une seule classe modulo le PPCM. C'est le **théorème chinois des restes**.

De même, l'équation `a × x + b × y = c`, d'inconnues entières `x` et `y`, a des solutions si et seulement si `g = PGCD(a, b)` divise `c` : Euclide étendu donne `a × u + b × v = g`, qu'on multiplie par `c / g`. Si `(x₀, y₀)` est une solution, les autres sont les `(x₀ + k × b/g, y₀ − k × a/g)` pour `k` entier. En effet, `(a/g) × (x − x₀) = (b/g) × (y₀ − y)`, et comme `a/g` est inversible modulo `b/g`, `b/g` divise `x − x₀`.

Le **PPCM** de `a` et `b` vérifie `PGCD(a, b) × PPCM(a, b) = a × b` : dans les décompositions, le PGCD prend le plus petit exposant de chaque premier, le PPCM le plus grand. On calcule `a / PGCD(a, b) × b`, en divisant **d'abord**. Même ainsi, le résultat peut dépasser 2⁶³ − 1 : pour `a = 10¹²` et `b = 10¹² − 1`, premiers entre eux, le PPCM vaut environ 10²⁴. En C++, le produit déborde et donne un nombre faux, sans aucun message. Pour savoir si `q × b` dépasse une limite `L`, on teste `q > L / b` avant de multiplier.

## Erreurs fréquentes

**Considérer 1 comme premier**, ou oublier de mettre `premier[0]` et `premier[1]` à faux. Un crible faux se voit en vérifiant qu'il y a 25 premiers jusqu'à 100.

**Oublier le dernier facteur.** Dans la décomposition par divisions, le reste final `n > 1` est un facteur premier ; sans le test `if n > 1`, 14 = 2 × 7 devient 2.

**Un crible trop grand.** Un tableau de 10⁹ cases dépasse la mémoire : au-delà de quelques 10⁷, on décompose par divisions successives, ou on cible un intervalle.

**Le reste négatif en C++.** `(a - b) % M` peut être négatif ; un indice de tableau négatif fait planter le programme. On ajoute `M`.

**Le débordement.** `a * b % M` avec `a` et `b` non réduits, `a * b / pgcd` pour un PPCM : on réduit avant de multiplier, et on teste avant de dépasser.

**Fermat à mauvais escient.** `pow(a, M - 2, M)` n'est l'inverse que si `M` est premier et ne divise pas `a` ; sinon on utilise Euclide étendu, et on vérifie que le PGCD vaut 1.

## Un exemple complet

**Énoncé.** Calculer la somme `1 + 1/2 + 1/3 + … + 1/N` modulo `P = 10⁹ + 7`, pour `N ≤ 10⁵`. Cette somme est une fraction `a / b` ; « modulo `P` », elle désigne `a × b⁻¹ mod P`, où `b⁻¹` est l'inverse de `b`.

**Idée.** Le numérateur et le dénominateur exacts ont des dizaines de milliers de chiffres. Mais l'inverse est compatible avec les opérations : la somme des fractions correspond à la somme des inverses `i⁻¹ mod P`. Comme `P` est premier et `i < P`, Fermat donne `i⁻¹ = i^(P−2) mod P`.

```python
M = 1000000007
n = int(input())
somme = 0
for i in range(1, n + 1):
    somme = (somme + pow(i, M - 2, M)) % M    # 1/i modulo M (Fermat)
print(somme)
```

```cpp
#include <iostream>
using namespace std;

const long long M = 1000000007;

long long puissance(long long a, long long n) {
    long long r = 1;
    a = a % M;
    while (n > 0) {
        if (n % 2 == 1) r = r * a % M;
        a = a * a % M;
        n = n / 2;
    }
    return r;
}

int main() {
    int n;
    cin >> n;
    long long somme = 0;
    for (int i = 1; i <= n; i++) {
        somme = (somme + puissance(i, M - 2)) % M;   // 1/i modulo M (Fermat)
    }
    cout << somme << "\n";
    return 0;
}
```

**Vérification à la main.** Pour `N = 3`, `1 + 1/2 + 1/3 = 11/6`. Le programme affiche `833333341`, et en effet 6 × 833 333 341 = 5 000 000 046 = 5 × (10⁹ + 7) + 11 : ce nombre multiplié par 6 donne bien 11 modulo `P`.

**Correction et coût.** Si `x ≡ a/b` et `y ≡ c/d` au sens précédent, alors `x × b ≡ a` et `y × d ≡ c`, donc `(x + y) × b × d ≡ a × d + c × b`, et `x + y` représente bien `(ad + bc)/(bd)`. Chaque inverse coûte une exponentiation rapide, une trentaine de multiplications : O(N log P) en tout.

## À retenir

- Un entier composé `m` a un facteur premier au plus √m : c'est ce qui justifie le crible (on s'arrête à √n, on part de p²) et la décomposition par divisions jusqu'à √n.
- Le crible d'Ératosthène est en O(n log log n) ; sa variante « plus petit facteur premier » décompose ensuite tout `x ≤ n` en O(log x).
- Si `n = p₁^e₁ × … × p_k^e_k`, alors `d(n) = Π (eᵢ + 1)` et `σ(n) = Π (1 + pᵢ + … + pᵢ^eᵢ)`.
- Euclide étendu donne `u, v` avec `a × u + b × v = PGCD(a, b)` (Bézout) ; `a` est inversible modulo `M` si et seulement si `PGCD(a, M) = 1`. Si `M` est premier, Fermat donne l'inverse `a^(M−2)`.
- `a × x ≡ b (mod M)` a des solutions si et seulement si `g = PGCD(a, M)` divise `b`, et il y en a `g` entre 0 et `M − 1`. Un système de deux congruences résoluble a une seule solution modulo le PPCM des modules.
- En C++ : réduire avant de multiplier, ajouter `M` après une soustraction, calculer un PPCM en divisant d'abord et en testant le dépassement avant de multiplier.
