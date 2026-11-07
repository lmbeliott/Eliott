Un programme qui passe les exemples de l'énoncé peut encore être faux : il suffit d'un cas oublié, un tableau dont toutes les valeurs sont négatives, un nombre égal à 0, une boucle qui ne s'arrête pas pour une entrée particulière. Les tests rassurent, mais ils n'essaient qu'un petit nombre d'entrées. Ce chapitre montre comment **prouver** qu'un algorithme est juste pour **toutes** les entrées, avec deux outils simples : l'**invariant**, qui explique pourquoi le résultat est le bon, et le **variant**, qui explique pourquoi la boucle s'arrête.

Ces outils servent aussi à **trouver** des algorithmes. Beaucoup de problèmes d'olympiades se résolvent en remarquant une quantité qui ne change jamais, ou qui diminue toujours. On les appliquera à des algorithmes déjà rencontrés (maximum, PGCD), puis à deux nouveaux : l'exponentiation rapide et l'écriture en base 2.

## Ce qu'on veut prouver

Avant de prouver un programme, il faut dire précisément ce qu'il doit faire. La **précondition** décrit les entrées acceptées : « `t` est un tableau non vide », « `a ≥ 0` et `b ≥ 0` ». La **postcondition** décrit le résultat attendu : « `m` est le plus grand élément de `t` ». Un algorithme est **correct** si, pour toute entrée qui vérifie la précondition, il s'arrête et son résultat vérifie la postcondition. Il y a donc deux choses à montrer : la **terminaison** (il s'arrête) et la **correction** (le résultat est le bon).

## L'invariant de boucle

Un **invariant de boucle** est une propriété des variables qui est vraie au début de chaque tour de boucle, et encore vraie à la sortie. Pour l'établir, on vérifie trois points :

1. **Initialisation** : la propriété est vraie avant le premier tour ;
2. **Conservation** : si elle est vraie au début d'un tour, elle l'est encore à la fin de ce tour ;
3. **Conclusion** : à la sortie de la boucle, la propriété, jointe à la condition d'arrêt, donne la postcondition.

C'est le même raisonnement qu'une récurrence en mathématiques : vrai au départ, transmis d'un tour au suivant, donc vrai après n'importe quel nombre de tours. Voici le calcul du maximum, avec son invariant écrit en commentaire.

```python
def maximum(t):
    m = t[0]
    i = 1
    # invariant : m est le maximum de t[0], ..., t[i - 1]
    while i < len(t):
        if t[i] > m:
            m = t[i]
        i = i + 1
    return m

print(maximum([3, 8, 1, 8, 4]), maximum([-5, -2, -9]))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int maximum(const vector<int> &t) {
    int m = t[0];
    int i = 1;
    // invariant : m est le maximum de t[0], ..., t[i - 1]
    while (i < (int) t.size()) {
        if (t[i] > m) {
            m = t[i];
        }
        i = i + 1;
    }
    return m;
}

int main() {
    cout << maximum({3, 8, 1, 8, 4}) << " " << maximum({-5, -2, -9}) << "\n";
    return 0;
}
```

Le programme affiche `8 -2`. **Initialisation** : avant le premier tour, `i = 1` et `m = t[0]`, qui est bien le maximum de la seule case `t[0]`. **Conservation** : si `m` est le maximum de `t[0..i − 1]`, alors après le `if`, `m` est le plus grand entre cet ancien maximum et `t[i]`, donc le maximum de `t[0..i]` ; puis `i` augmente de 1, et la propriété est de nouveau vraie avec le nouvel `i`. **Conclusion** : la boucle s'arrête quand `i = n`, et l'invariant dit alors que `m` est le maximum de `t[0..n − 1]`, tout le tableau. On voit au passage pourquoi l'initialisation `m = 0` serait fausse : l'invariant ne serait pas vrai au départ, et le programme renverrait 0 pour `[-5, -2, -9]`.

Le bon invariant est rarement « le résultat est juste » : c'est une version **partielle** du résultat, qui parle de la partie déjà traitée.

## La terminaison et le variant

Une boucle `for i in range(n)` s'arrête toujours après `n` tours. Une boucle `while` demande un argument. On utilise un **variant** : une quantité **entière**, **positive ou nulle** tant que la boucle tourne, et qui **diminue strictement** à chaque tour. Une suite d'entiers positifs strictement décroissante ne peut pas être infinie : elle a au plus autant de termes que sa valeur de départ, plus un. La boucle s'arrête donc. Pour le maximum, `n − i` est un variant.

Sans variant, rien n'empêche une boucle infinie. Le PGCD par soustractions du niveau 2 en donne un exemple.

```python
def pgcd_soustractions(a, b):
    while a != b:
        if a > b:
            a = a - b
        else:
            b = b - a
    return a

print(pgcd_soustractions(12, 18))
```

```cpp
#include <iostream>
using namespace std;

long long pgcdSoustractions(long long a, long long b) {
    while (a != b) {
        if (a > b) {
            a = a - b;
        } else {
            b = b - a;
        }
    }
    return a;
}

int main() {
    cout << pgcdSoustractions(12, 18) << "\n";
    return 0;
}
```

Le programme affiche `6`. Avec `a ≥ 1` et `b ≥ 1`, la somme `a + b` est un variant : chaque tour retire un nombre au moins égal à 1, et les deux nombres restent positifs. Mais avec `pgcd_soustractions(0, 5)`, le tour fait `b = 5 − 0 = 5` : rien ne change, et la boucle tourne indéfiniment, sans aucun message. La précondition `a ≥ 1` et `b ≥ 1` était indispensable : c'est exactement elle qui garantit que le variant diminue.

## L'algorithme d'Euclide

L'algorithme d'Euclide calcule le PGCD de deux entiers `a ≥ 0` et `b ≥ 0` : tant que `b ≠ 0`, on remplace `(a, b)` par `(b, a mod b)`, et le résultat est la dernière valeur de `a`.

```python
def pgcd(a, b):
    # invariant : pgcd(a, b) est le PGCD des deux nombres de départ
    while b != 0:
        a, b = b, a % b
    return a

print(pgcd(252, 198), pgcd(17, 0), pgcd(0, 9))
```

```cpp
#include <iostream>
using namespace std;

long long pgcd(long long a, long long b) {
    // invariant : pgcd(a, b) est le PGCD des deux nombres de départ
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}

int main() {
    cout << pgcd(252, 198) << " " << pgcd(17, 0) << " " << pgcd(0, 9) << "\n";
    return 0;
}
```

Le programme affiche `18 17 9`. Les couples successifs pour `(252, 198)` sont `(198, 54)`, `(54, 36)`, `(36, 18)`, `(18, 0)`.

**Correction.** Écrivons `a = q × b + r` avec `r = a mod b`. Tout diviseur commun de `a` et `b` divise `r = a − q × b` ; inversement, tout diviseur commun de `b` et `r` divise `a = q × b + r`. Les couples `(a, b)` et `(b, r)` ont donc exactement les mêmes diviseurs communs, et le même PGCD : c'est l'invariant. À la sortie, `b = 0`, et le PGCD de `a` et 0 est `a`, puisque tout entier divise 0.

**Terminaison.** `b` est un variant : c'est un entier positif ou nul, et il est remplacé par `a mod b`, strictement plus petit que `b`.

**Coût.** Le variant ne dit pas seulement que la boucle s'arrête : il borne le nombre de tours par la valeur de `b`, ce qui est très pessimiste. On montre mieux : **en deux tours, le premier nombre est plus que divisé par deux**. Après le premier tour, on a toujours `a > b`, puisque le nouveau `b` est le reste d'une division par le nouveau `a`. Partons donc d'un couple `(a, b)` avec `a > b > 0` : deux tours plus tard, il est devenu `(r, r')` avec `r = a mod b`. Si `b ≤ a / 2`, alors `r < b ≤ a / 2`. Sinon, `a / 2 < b < a`, le quotient vaut 1, et `r = a − b < a / 2`. Dans les deux cas, `r < a / 2`. Un nombre inférieur à 10¹⁸ < 2⁶⁰ ne peut être divisé par deux que 60 fois avant d'atteindre 0 : il y a au plus 120 tours environ. Le nombre de tours est donc au plus proportionnel au **nombre de chiffres** des données, et non à leur valeur.

## L'exponentiation rapide

Pour calculer `x` à la puissance `n`, la méthode évidente fait `n − 1` multiplications : impossible pour `n = 10¹⁸`. L'**exponentiation rapide** utilise deux remarques : si `n` est pair, `xⁿ = (x²)^(n/2)` ; si `n` est impair, `xⁿ = x × xⁿ⁻¹`. On maintient trois variables `r`, `x` et `n` avec l'**invariant** `r × xⁿ = a^N`, où `a` et `N` sont les valeurs de départ.

```python
def puissance(a, N, m):
    r = 1
    x = a % m
    n = N
    # invariant : r × x^n ≡ a^N (mod m)
    while n > 0:
        if n % 2 == 1:
            r = r * x % m
            n = n - 1
        x = x * x % m
        n = n // 2
    return r

print(puissance(3, 13, 1000), puissance(2, 10**18, 1000000007))
```

```cpp
#include <iostream>
using namespace std;

long long puissance(long long a, long long N, long long m) {
    long long r = 1;
    long long x = a % m;
    long long n = N;
    // invariant : r × x^n ≡ a^N (mod m)
    while (n > 0) {
        if (n % 2 == 1) {
            r = r * x % m;
            n = n - 1;
        }
        x = x * x % m;
        n = n / 2;
    }
    return r;
}

int main() {
    cout << puissance(3, 13, 1000) << " " << puissance(2, 1000000000000000000LL, 1000000007) << "\n";
    return 0;
}
```

Le programme affiche `323 719476260`. En effet, 3¹³ = 1 594 323, dont les trois derniers chiffres sont 323. On calcule modulo `m` pour garder des nombres petits : en C++, un produit de deux nombres inférieurs à 10⁹ + 7 tient dans un `long long`, alors que 2 à la puissance 10¹⁸ n'aurait aucune chance d'y tenir.

**Correction.** Tous les calculs sont faits modulo `m` (avec `m ≥ 2`), ce qui ne change pas le reste d'un produit. Au départ, `r = 1`, `x = a mod m` et `n = N` : `r × xⁿ ≡ a^N`. Si `n` est impair, remplacer `r` par `r × x` et `n` par `n − 1` ne change pas `r × xⁿ`, puisque `x × xⁿ⁻¹ = xⁿ`. Ensuite `n` est pair, et remplacer `x` par `x²` et `n` par `n / 2` ne change pas `xⁿ`. À la sortie, `n = 0`, donc `x⁰ = 1` et `r ≡ a^N (mod m)` ; comme `r` est compris entre 0 et `m − 1`, c'est exactement le reste de `a^N` par `m`. **Terminaison** : `n` est un variant, qui est au moins divisé par deux à chaque tour. **Coût** : au plus 60 tours pour `n ≤ 10¹⁸`, et au plus deux multiplications par tour. La même idée, avec le même invariant, permet de composer très vite une fonction avec elle-même, ou de multiplier sans débordement.

## L'écriture en base 2

Les chiffres de `N` en base 2 s'obtiennent comme ceux de la base 10 au niveau 1 : le dernier chiffre est `N % 2`, et les autres sont ceux de `N // 2`.

```python
def binaire(N):
    q = N
    chiffres = []
    # invariant : N = q × 2^k + (valeur des k chiffres déjà obtenus)
    while q > 0:
        chiffres.append(str(q % 2))
        q = q // 2
    if len(chiffres) == 0:
        return "0"
    return "".join(chiffres[::-1])

print(binaire(13), binaire(0), binaire(1024))
```

```cpp
#include <iostream>
#include <string>
using namespace std;

string binaire(long long N) {
    long long q = N;
    string envers = "";
    // invariant : N = q × 2^k + (valeur des k chiffres déjà obtenus)
    while (q > 0) {
        envers += (char) ('0' + q % 2);
        q = q / 2;
    }
    if (envers.size() == 0) {
        return "0";
    }
    string s = "";
    for (int i = (int) envers.size() - 1; i >= 0; i--) {
        s += envers[i];
    }
    return s;
}

int main() {
    cout << binaire(13) << " " << binaire(0) << " " << binaire(1024) << "\n";
    return 0;
}
```

Le programme affiche `1101 0 10000000000`. Pour 13, les restes successifs sont 1, 0, 1, 1, lus à l'envers. **Correction** : au départ, `k = 0` et `N = q` ; un tour remplace `q` par `q // 2` en rangeant le chiffre `q % 2` au rang `k`, puis augmente `k` de 1, et l'égalité `q × 2^k = (q // 2) × 2^(k+1) + (q % 2) × 2^k` montre que l'invariant est conservé. À la sortie, `q = 0`, et `N` est la valeur des chiffres obtenus. Le dernier chiffre rangé, celui de tête, vient de `q = 1` : il vaut 1, et l'écriture n'a pas de zéro de tête. **Terminaison** : `q` diminue strictement tant qu'il est positif. **Coût** : un tour par chiffre binaire, environ 60 pour 10¹⁸.

## Une quantité invariante

Un invariant ne sert pas qu'à prouver une boucle. Face à un processus où l'on choisit librement les opérations et leur ordre, on cherche une quantité que **toutes** les opérations conservent. Elle répond souvent à deux questions : quels états sont impossibles à atteindre, et pourquoi le résultat ne dépend pas des choix.

Exemple : les nombres 1, 2, …, 10 sont écrits au tableau. Une opération efface deux nombres `a` et `b` et écrit `|a − b|` à leur place. Après neuf opérations, il reste un seul nombre. Peut-il valoir 0 ? Essayer toutes les suites de choix serait très long. Mais une opération remplace `a + b` par `|a − b|` dans la somme des nombres écrits, et ces deux valeurs diffèrent de `2 × min(a, b)`, un nombre pair : **la parité de la somme ne change jamais**. Au départ, la somme vaut 55, qui est impaire. Le dernier nombre est donc impair, quels que soient les choix : il ne vaut jamais 0. Le programme suivant fait un choix particulier, combiner à chaque fois le résultat courant avec le nombre suivant.

```python
x = 1
for v in range(2, 11):
    x = abs(x - v)
print(x, x % 2)
```

```cpp
#include <cstdlib>
#include <iostream>
using namespace std;

int main() {
    int x = 1;
    for (int v = 2; v <= 10; v++) {
        x = abs(x - v);
    }
    cout << x << " " << x % 2 << "\n";
    return 0;
}
```

Le programme affiche `5 1` : un nombre impair, comme prévu. Un autre ordre donnerait peut-être un autre nombre, mais jamais un nombre pair. Les quantités invariantes se cherchent parmi les sommes (éventuellement avec des poids), les différences, les parités et les restes modulo un petit entier : on écrit l'effet d'une opération sur chaque compteur, puis on cherche une combinaison que cet effet ne modifie pas. Le variant joue le rôle symétrique : une quantité entière positive qui diminue à chaque opération prouve que le processus s'arrête, quels que soient les choix.

## Les assertions

Une **assertion** est une condition que le programmeur affirme vraie à un endroit du programme. En Python, `assert condition, "message"` ne fait rien si la condition est vraie, et arrête le programme avec `AssertionError: message` sinon. En C++, `assert(condition);`, avec `#include <cassert>`, arrête le programme avec un message du type ``Assertion `b > 0' failed.``

```python
def division_euclidienne(a, b):
    assert b > 0, "le diviseur doit être positif"
    q, r = a // b, a % b
    assert a == q * b + r and 0 <= r < b
    return q, r

print(division_euclidienne(17, 5))
print(division_euclidienne(-17, 5))
```

```cpp
#include <cassert>
#include <iostream>
using namespace std;

int main() {
    long long a = -17, b = 5;
    assert(b > 0);
    long long q = a / b, r = a % b;
    assert(a == q * b + r && 0 <= r && r < b);
    cout << q << " " << r << "\n";
    return 0;
}
```

Python affiche `(3, 2)`, puis `(-4, 3)`. Le programme C++, lui, n'affiche rien : en C++, `q` vaut −3 et le reste de −17 par 5 vaut −2, qui n'est pas entre 0 et 4. La seconde assertion échoue, et le programme s'arrête avec ``Assertion `a == q * b + r && 0 <= r && r < b' failed.`` L'assertion a signalé exactement l'endroit où l'hypothèse « le reste est positif » est fausse. Placer en assertion l'invariant d'une boucle, pendant la mise au point, détecte très tôt une erreur de raisonnement. On les enlève, ou on les garde peu coûteuses, dans la version finale.

## Tester ou prouver

Un test montre qu'un programme est juste sur **une** entrée. Mille tests ne prouvent rien sur la mille-et-unième : ils peuvent révéler une erreur, jamais garantir son absence. Une preuve, au contraire, couvre toutes les entrées, mais elle peut contenir une faute de raisonnement, ou ne pas correspondre exactement au code écrit. Les deux se complètent. La méthode la plus efficace pour tester consiste à écrire une **solution naïve**, lente mais évidemment juste, et à comparer les deux programmes sur des centaines de petites entrées tirées au hasard. Au premier désaccord, on obtient un petit exemple à étudier à la main.

## Erreurs fréquentes

**Un invariant faux au départ.** Initialiser un maximum à 0, un minimum à 0, un produit à 0 : l'invariant n'est pas vrai avant le premier tour, et la preuve s'effondre. On initialise avec une vraie valeur du tableau, ou avec l'élément neutre (0 pour une somme, 1 pour un produit).

**Un variant qui ne diminue pas.** Oublier `i = i + 1` dans un `while`, ou soustraire 0 comme dans `pgcd_soustractions(0, 5)` : le programme ne s'arrête pas et n'affiche rien. Si un programme « ne répond plus », on cherche la boucle dont le variant ne diminue pas.

**Une conclusion décalée d'un cran.** Avec la condition `while i < n - 1`, la boucle s'arrête à `i = n − 1`, et l'invariant ne parle que de `t[0..n − 2]` : la dernière case est oubliée. Écrire l'invariant oblige à vérifier la condition d'arrêt.

**Le débordement en C++.** Dans l'exponentiation rapide, `x * x` dépasse 2⁶³ si `x` dépasse environ 3 × 10⁹ : il faut réduire modulo `m` avant chaque produit, et garder `m` assez petit.

## Un exemple complet

**Énoncé.** On part d'un entier `N ≥ 1`. Tant que `N > 0`, on le divise par 2 s'il est pair, et on lui retire 1 sinon. Combien d'étapes faut-il pour atteindre 0, pour `N ≤ 10¹⁸` ?

**Idée.** On simule le processus. Il faut d'abord s'assurer qu'il s'arrête, et vite : 10¹⁸ étapes seraient impossibles à simuler.

**Programme.**

```python
n = int(input())
etapes = 0
while n > 0:
    if n % 2 == 0:
        n = n // 2
    else:
        n = n - 1
    etapes = etapes + 1
print(etapes)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    int etapes = 0;
    while (n > 0) {
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = n - 1;
        }
        etapes = etapes + 1;
    }
    cout << etapes << "\n";
    return 0;
}
```

**Vérification à la main.** Avec `13` : 13 → 12 → 6 → 3 → 2 → 1 → 0, soit 6 étapes, et le programme affiche `6`.

**Terminaison.** `n` est un variant : c'est un entier positif tant que la boucle tourne, et chaque étape le fait diminuer strictement (diviser par 2 un entier `n ≥ 2`, ou retirer 1).

**Nombre d'étapes.** Raisonnons sur l'écriture binaire de `n`. Retirer 1 à un nombre impair transforme son dernier chiffre 1 en 0. Diviser par 2 un nombre pair efface son dernier chiffre, qui est un 0. Chaque chiffre 1 coûte donc deux étapes (le transformer en 0, puis l'effacer), sauf le premier, qui disparaît avec l'étape 1 → 0 ; chaque chiffre 0 coûte une étape. Avec `L` chiffres dont `u` valent 1, il faut `L + u − 1` étapes. Pour 13 = `1101`, on trouve `4 + 3 − 1 = 6`, comme à la main. Le nombre d'étapes est donc au plus `2L − 1`, soit moins de 120 pour `N ≤ 10¹⁸` : la simulation est instantanée. La formule est aussi un très bon test : on peut comparer les deux méthodes sur des milliers de valeurs.

## À retenir

- Prouver un algorithme, c'est montrer qu'il s'arrête (terminaison) et que son résultat vérifie la postcondition pour toute entrée qui vérifie la précondition (correction).
- Un invariant de boucle se prouve en trois points : initialisation, conservation, conclusion à la sortie. C'est en général une version partielle du résultat.
- Un variant est un entier positif ou nul qui diminue strictement à chaque tour : il garantit la terminaison, et sa vitesse de décroissance borne le nombre de tours.
- Euclide conserve le PGCD et divise le premier nombre par deux au moins tous les deux tours ; l'exponentiation rapide conserve `r × xⁿ` et divise `n` par deux à chaque tour : de l'ordre du nombre de chiffres, pas de la valeur.
- Une quantité invariante (une somme, une parité, un reste) permet souvent de dire qu'un état est inatteignable, ou que le résultat ne dépend pas des choix.
- Les assertions vérifient un invariant pendant l'exécution ; les tests comparés à une solution naïve trouvent des erreurs ; seule une preuve garantit qu'il n'y en a pas.
