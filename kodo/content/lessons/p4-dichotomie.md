Pour trouver un mot dans un dictionnaire papier, personne ne lit les pages une par une : on ouvre au milieu, on regarde si le mot cherché est avant ou après, et on recommence dans la moitié qui reste. Après une vingtaine d'essais, il ne reste qu'une page, même dans un dictionnaire d'un million de mots. C'est la **recherche dichotomique** (du grec *dikhotomia*, « couper en deux »).

Ce chapitre l'étudie avec précision, car elle est aussi simple à expliquer que facile à rater d'une unité. On verra d'abord la recherche dans un tableau trié, avec son invariant, sa terminaison et son coût ; puis les fonctions toutes prêtes de Python et du C++ ; puis l'idée la plus féconde du chapitre : **chercher la réponse** d'un problème par dichotomie, sur des entiers jusqu'à 10¹⁸ ou sur des nombres réels.

## Chercher dans un tableau trié

On dispose d'un tableau `t` de `n` entiers triés dans l'ordre croissant, et d'une valeur `x`. Parcourir le tableau coûte `n` comparaisons. Si on compare `x` à la case du milieu, une seule comparaison élimine la moitié du tableau : si `t[mid] < x`, toutes les cases jusqu'à `mid` sont trop petites, puisque le tableau est trié ; sinon, toutes les cases à partir de `mid` sont au moins égales à `x`.

Plutôt que de chercher « une case qui vaut `x` », question qui a zéro, une ou plusieurs réponses, on cherche **le premier indice `i` tel que `t[i] ≥ x`**. Cette question a toujours une réponse unique, éventuellement `n` si toutes les valeurs sont plus petites que `x`. On garde deux indices `lo` et `hi` avec l'**invariant** :

- toutes les cases d'indice au plus `lo` sont **strictement plus petites** que `x` ;
- toutes les cases d'indice au moins `hi` sont **au moins égales** à `x`.

Au départ, `lo = −1` et `hi = n` : ces deux indices sont hors du tableau, et l'invariant ne parle d'aucune case, il est donc vrai. On peut imaginer `t[−1] = −∞` et `t[n] = +∞`, mais le programme ne lit jamais ces cases.

```python
def premier_au_moins(t, x):
    # t est trié ; plus petit indice i tel que t[i] >= x, ou len(t) s'il n'y en a pas
    lo, hi = -1, len(t)
    # invariant : t[i] < x pour i <= lo, et t[i] >= x pour i >= hi
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if t[mid] < x:
            lo = mid
        else:
            hi = mid
    return hi

t = [2, 3, 5, 5, 5, 8, 13, 21]
print(premier_au_moins(t, 5), premier_au_moins(t, 6), premier_au_moins(t, 1), premier_au_moins(t, 30))
i = premier_au_moins(t, 8)
print(i < len(t) and t[i] == 8)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

// t est trié ; plus petit indice i tel que t[i] >= x, ou t.size() s'il n'y en a pas
int premierAuMoins(const vector<int>& t, int x) {
    int lo = -1, hi = t.size();
    // invariant : t[i] < x pour i <= lo, et t[i] >= x pour i >= hi
    while (hi - lo > 1) {
        int mid = lo + (hi - lo) / 2;
        if (t[mid] < x) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return hi;
}

int main() {
    vector<int> t = {2, 3, 5, 5, 5, 8, 13, 21};
    cout << premierAuMoins(t, 5) << " " << premierAuMoins(t, 6) << " "
         << premierAuMoins(t, 1) << " " << premierAuMoins(t, 30) << "\n";
    int i = premierAuMoins(t, 8);
    cout << (i < (int) t.size() && t[i] == 8 ? "True" : "False") << "\n";
    return 0;
}
```

Le programme affiche `2 5 0 8`, puis `True`. Le premier 5 est à l'indice 2 ; la première valeur au moins égale à 6 est le 8, à l'indice 5 ; toutes les valeurs sont au moins égales à 1, d'où 0 ; aucune n'atteint 30, d'où 8, la longueur du tableau. Pour savoir si `x` est **présent**, on vérifie ensuite que `i < n` et `t[i] == x`.

## Correction, terminaison et coût

**Conservation.** Tant que `hi − lo > 1`, l'indice `mid` est strictement entre `lo` et `hi`, donc c'est une vraie case du tableau. Si `t[mid] < x`, toutes les cases d'indice au plus `mid` sont au plus `t[mid]`, puisque le tableau est trié, donc strictement plus petites que `x` : on peut poser `lo = mid` sans casser l'invariant. Sinon, `t[mid] ≥ x`, et toutes les cases suivantes aussi : on pose `hi = mid`.

**Conclusion.** À la sortie, `hi = lo + 1`. Toutes les cases avant `hi` sont plus petites que `x`, et `t[hi] ≥ x` si `hi < n` : `hi` est bien le premier indice où `t[i] ≥ x`.

**Terminaison.** La quantité `hi − lo` est un variant : c'est un entier, et comme `lo < mid < hi`, chaque tour la fait diminuer strictement.

**Coût.** Chaque tour remplace l'intervalle par une de ses deux moitiés, de longueur au plus `⌈(hi − lo) / 2⌉`. Partant de `n + 1`, il faut environ `log₂(n)` tours pour arriver à 1 : 20 tours pour un million de cases, 60 pour 10¹⁸. La recherche dichotomique est en **O(log n)**, contre O(n) pour un parcours. Attention : il faut que le tableau soit **trié**. Trier coûte O(n log n) ; cela vaut la peine dès qu'on fait beaucoup de recherches dans le même tableau.

## Les pièges d'une unité

La dichotomie est célèbre pour ses erreurs. Le programme ci-dessous cherche la dernière case au plus égale à `x`, avec une autre convention : `lo` et `hi` sont tous deux des cases possibles, et la boucle tourne tant que `lo < hi`.

```python
def dernier_au_plus(t, x):
    lo, hi = 0, len(t) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if t[mid] <= x:
            lo = mid           # erreur : quand hi = lo + 1, mid = lo et rien ne change
        else:
            hi = mid - 1
    return lo

print(dernier_au_plus([2, 3, 5, 8], 5))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int dernierAuPlus(const vector<int>& t, int x) {
    int lo = 0, hi = t.size() - 1;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (t[mid] <= x) {
            lo = mid;          // erreur : quand hi = lo + 1, mid = lo et rien ne change
        } else {
            hi = mid - 1;
        }
    }
    return lo;
}

int main() {
    cout << dernierAuPlus({2, 3, 5, 8}, 5) << "\n";
    return 0;
}
```

Ce programme n'affiche rien et ne s'arrête jamais. Après deux tours, `lo = 2` et `hi = 3` ; alors `mid = 2`, `t[2] = 5 ≤ 5`, et on repose `lo = 2` : le variant `hi − lo` ne diminue plus. Le remède n'est pas d'essayer `mid + 1` au hasard, mais de choisir une convention et de la prouver. Avec celle de ce chapitre (`lo` et `hi` de part et d'autre de la frontière, boucle tant que `hi − lo > 1`), `mid` est toujours strictement entre les deux, et la terminaison est garantie.

Deux autres pièges classiques :

- **Le débordement du milieu.** En C++, avec des `int` proches de 2³¹, la somme `lo + hi` dépasse la capacité. On écrit `lo + (hi − lo) / 2`, qui donne le même résultat sans dépasser. Python n'a pas ce problème.
- **Les bornes de départ.** L'invariant doit être vrai au départ. Si on part de `hi = n − 1` au lieu de `n`, on affirme que la dernière case est au moins égale à `x`, ce qui peut être faux : le programme renvoie alors `n − 1` pour une valeur plus grande que toutes les autres.

## Les fonctions de Python et du C++

Les deux langages fournissent ces recherches. En Python, le module `bisect` contient `bisect_left(t, x)`, le premier indice `i` tel que `t[i] ≥ x`, et `bisect_right(t, x)`, le premier indice tel que `t[i] > x`. En C++, `lower_bound` et `upper_bound` (dans `<algorithm>`) font la même chose et renvoient un itérateur, dont on retire `t.begin()` pour obtenir l'indice.

```python
from bisect import bisect_left, bisect_right

t = [2, 3, 5, 5, 5, 8, 13, 21]
print(bisect_left(t, 5), bisect_right(t, 5))
print(bisect_right(t, 5) - bisect_left(t, 5))     # occurrences de 5
print(bisect_right(t, 13) - bisect_left(t, 4))    # valeurs entre 4 et 13
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {2, 3, 5, 5, 5, 8, 13, 21};
    int g = lower_bound(t.begin(), t.end(), 5) - t.begin();
    int d = upper_bound(t.begin(), t.end(), 5) - t.begin();
    cout << g << " " << d << "\n";
    cout << d - g << "\n";                                     // occurrences de 5
    cout << (upper_bound(t.begin(), t.end(), 13) - lower_bound(t.begin(), t.end(), 4)) << "\n";
    return 0;
}
```

Le programme affiche `2 5`, puis `3`, puis `5`. Les occurrences de 5 occupent les indices 2, 3 et 4 : de `bisect_left` inclus à `bisect_right` exclu. De même, le nombre de valeurs comprises entre `a` et `b` (inclus) est `bisect_right(t, b) − bisect_left(t, a)` : ici 5, 5, 5, 8 et 13. Chaque requête coûte O(log n) : après un tri, on répond à des milliers de questions « combien de valeurs dans cet intervalle ? » presque gratuitement.

## Chercher la réponse

La dichotomie ne sert pas qu'à chercher dans un tableau. Un **prédicat** est une propriété `P(x)` d'un entier `x`, vraie ou fausse. Il est **monotone** s'il est faux jusqu'à une certaine valeur, puis vrai ensuite (ou l'inverse) : dès que `P(x)` est vrai, `P(x + 1)` l'est aussi. Le tableau trié de la section précédente en est un cas particulier, avec `P(i)` : « `t[i] ≥ x` ».

Pour un prédicat monotone, on trouve la **frontière** exactement comme dans un tableau : on choisit `lo` tel que `P(lo)` est faux et `hi` tel que `P(hi)` est vrai, et on garde cet invariant en testant le milieu. Après environ `log₂(hi − lo)` tests, `hi` est la plus petite valeur où `P` est vrai. Il n'y a aucun tableau : le « tableau » est la suite des réponses de `P`, qu'on ne calcule qu'aux points testés.

Beaucoup de problèmes d'optimisation se résolvent ainsi. « Quelle est la plus petite longueur… », « le plus grand nombre… » : au lieu de calculer directement l'optimum, on se demande « est-ce que la valeur `x` est **possible** ? ». Cette question est souvent bien plus facile, et si la possibilité est monotone en `x`, une dichotomie trouve l'optimum en ajoutant seulement un facteur `log` au coût du test. C'est la technique dite de **recherche de la réponse**. Avant de l'appliquer, il faut **prouver la monotonie**, et choisir des bornes dont on est sûr : une valeur certainement impossible et une valeur certainement possible.

## Les entiers jusqu'à 10¹⁸

L'intervalle de recherche peut être immense : 60 tests suffisent pour 10¹⁸ valeurs. Le danger est ailleurs, dans le calcul du prédicat. Prenons la **racine carrée entière** de `n`, le plus grand entier `r` tel que `r² ≤ n`. Le prédicat « `r² ≤ n` » est vrai puis faux, et la réponse est au plus 10⁹ pour `n ≤ 10¹⁸`.

```python
from math import sqrt

def racine_carree(n):
    lo, hi = 0, 10**9 + 1          # invariant : lo × lo <= n < hi × hi
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if mid * mid <= n:
            lo = mid
        else:
            hi = mid
    return lo

n = 10**18 - 1
print(racine_carree(n), int(sqrt(n)))
```

```cpp
#include <cmath>
#include <iostream>
using namespace std;

long long racineCarree(long long n) {
    long long lo = 0, hi = 1000000001;   // invariant : lo × lo <= n < hi × hi
    while (hi - lo > 1) {
        long long mid = lo + (hi - lo) / 2;
        if (mid <= n / mid) {            // mid × mid <= n, sans calculer mid × mid
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return lo;
}

int main() {
    long long n = 999999999999999999LL;
    cout << racineCarree(n) << " " << (long long) sqrt((double) n) << "\n";
    return 0;
}
```

Le programme affiche `999999999 1000000000`. La dichotomie donne la bonne réponse ; la fonction `sqrt` se trompe d'une unité, car un nombre à virgule n'a que 53 bits de précision, environ 16 chiffres, et 10¹⁸ − 1 est arrondi à 10¹⁸ avant même le calcul. Pour les entiers, on ne fait pas confiance aux flottants.

En C++, le test `mid × mid <= n` déborderait pour `mid` proche de 10⁹ + 1 si `n` était plus grand ; le test équivalent `mid <= n / mid` (pour `mid ≥ 1`) ne dépasse jamais. Pour une racine cubique ou K-ième, on calcule la puissance facteur par facteur et on s'arrête dès qu'elle dépasse `n`, en vérifiant **avant** chaque multiplication que `p ≤ n / mid`.

## Sur les nombres réels

Le même principe trouve une solution approchée d'une équation `f(x) = c` quand `f` est croissante. Cherchons le réel `x` tel que `x³ + x = 5`. La fonction est croissante, vaut 0 en 0 et 130 en 5 : la solution est entre 0 et 5.

```python
lo, hi = 0.0, 5.0                  # f(lo) < 5 <= f(hi), avec f(x) = x³ + x
for _ in range(100):
    mid = (lo + hi) / 2
    if mid ** 3 + mid < 5:
        lo = mid
    else:
        hi = mid
print(f"{lo:.6f}")
```

```cpp
#include <cstdio>

int main() {
    double lo = 0.0, hi = 5.0;     // f(lo) < 5 <= f(hi), avec f(x) = x³ + x
    for (int i = 0; i < 100; i++) {
        double mid = (lo + hi) / 2;
        if (mid * mid * mid + mid < 5) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    printf("%.6f\n", lo);
    return 0;
}
```

Le programme affiche `1.515980`. Après `k` tours, la solution est dans un intervalle de longueur `5 / 2^k` : 100 tours donnent une précision bien meilleure que celle des flottants eux-mêmes. On fixe le **nombre de tours** plutôt que d'écrire `while hi - lo > 1e-9`. Avec des valeurs proches de 10⁹, deux flottants voisins sont espacés d'environ 10⁻⁷ : l'écart `hi − lo` ne peut plus descendre sous 10⁻⁹, le milieu calculé retombe sur `lo` ou `hi`, et la boucle tourne indéfiniment sans rien afficher.

## Erreurs fréquentes

**Une boucle infinie.** Le milieu retombe sur une borne qui ne bouge pas, comme dans `dernier_au_plus`. On garde la convention `while hi - lo > 1` avec `lo = mid` ou `hi = mid`, qui fait toujours diminuer `hi − lo`.

**Un prédicat qui n'est pas monotone.** La dichotomie trouve alors « une » frontière, pas forcément la bonne, et le programme se trompe sans message. On prouve la monotonie avant de coder, et on compare à une solution naïve sur de petits cas.

**Une borne qui ne vérifie pas l'invariant.** Si `hi` n'est pas certainement possible, la réponse renvoyée peut être `hi` alors qu'aucune valeur ne convient. On choisit des bornes larges et sûres : chercher entre 0 et 2 × 10¹⁸ ne coûte que quelques tours de plus.

**Le débordement.** `(lo + hi) / 2` avec des `int`, `mid * mid` ou une somme de N valeurs dans un `int` : en C++, le résultat devient faux ou négatif, sans erreur. On utilise des `long long`, on teste avant de multiplier, et on arrête une somme dès qu'elle dépasse le seuil.

**Un tableau non trié.** `bisect_left` sur une liste non triée renvoie un indice sans signification. On trie d'abord.

## Un exemple complet

**Énoncé.** On a N sacs de bonbons ; le sac i en contient aᵢ. On veut donner **le même nombre** x de bonbons à chacun de K enfants, chaque enfant recevant tous ses bonbons d'un même sac (un sac peut servir plusieurs enfants, et il peut rester des bonbons). Quelle est la plus grande valeur possible de x ? On affiche 0 si c'est impossible.

**Idée.** Pour un x donné, le sac i peut servir ⌊aᵢ / x⌋ enfants, donc x est possible si et seulement si la somme des ⌊aᵢ / x⌋ est au moins K. Quand x augmente, chaque ⌊aᵢ / x⌋ diminue ou reste égal : si x est possible, toute valeur plus petite l'est aussi. On cherche la dernière valeur possible, avec `lo` possible et `hi` impossible. On convient que 0 est possible (c'est la réponse « impossible ») ; max(aᵢ) + 1 est impossible, car aucun sac ne peut alors servir un enfant.

```python
n, k = map(int, input().split())
sacs = list(map(int, input().split()))

def possible(x):
    # peut-on servir k enfants avec x bonbons chacun ?
    enfants = 0
    for a in sacs:
        enfants += a // x
    return enfants >= k

lo, hi = 0, max(sacs) + 1          # invariant : lo possible (0 par convention), hi impossible
while hi - lo > 1:
    mid = (lo + hi) // 2
    if possible(mid):
        lo = mid
    else:
        hi = mid
print(lo)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int n;
long long k;
vector<long long> sacs;

// peut-on servir k enfants avec x bonbons chacun ?
bool possible(long long x) {
    long long enfants = 0;
    for (long long a : sacs) {
        enfants += a / x;
    }
    return enfants >= k;
}

int main() {
    cin >> n >> k;
    sacs.resize(n);
    long long hi = 0;
    for (int i = 0; i < n; i++) {
        cin >> sacs[i];
        if (sacs[i] + 1 > hi) {
            hi = sacs[i] + 1;
        }
    }
    long long lo = 0;              // invariant : lo possible (0 par convention), hi impossible
    while (hi - lo > 1) {
        long long mid = lo + (hi - lo) / 2;
        if (possible(mid)) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    cout << lo << "\n";
    return 0;
}
```

**Vérification à la main.** Avec les sacs `10 6 15` et K = 7. Pour x = 4 : 2 + 1 + 3 = 6 enfants, pas assez. Pour x = 3 : 3 + 2 + 5 = 10 enfants, c'est possible. La réponse est 3, et le programme affiche `3`. Avec K = 40, même x = 1 ne sert que 31 enfants : `lo` reste à 0 et le programme affiche `0`.

**Coût.** Chaque test parcourt les N sacs, et la dichotomie fait environ log₂(max aᵢ) tests : O(N log(max aᵢ)), soit 30 × N opérations pour des sacs de 10⁹ bonbons. Essayer toutes les valeurs de x une par une coûterait jusqu'à 10⁹ × N opérations.

## À retenir

- La recherche dichotomique garde deux indices `lo` et `hi` de part et d'autre d'une frontière (invariant), teste le milieu et déplace une borne : `while hi - lo > 1`, puis `lo = mid` ou `hi = mid`. Elle termine car `hi − lo` diminue strictement, en O(log n) tours.
- On cherche une frontière (« premier indice où `t[i] ≥ x` »), pas une valeur : la question a toujours une réponse, et les doublons ne posent aucun problème.
- `bisect_left`/`bisect_right` en Python, `lower_bound`/`upper_bound` en C++ ; leur différence compte les occurrences, et `bisect_right(t, b) − bisect_left(t, a)` compte les valeurs entre `a` et `b`.
- Chercher la réponse : si « la valeur x est possible » est monotone en x, une dichotomie trouve l'optimum ; il faut prouver la monotonie et choisir des bornes sûres.
- Sur de grands entiers, pas de flottants, et pas de produit qui déborde : on teste `p > n / mid` avant de multiplier. Sur les réels, on fixe le nombre de tours (100 suffisent).
