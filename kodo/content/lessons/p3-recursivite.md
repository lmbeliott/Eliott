Une poupée russe contient une poupée plus petite, qui en contient une plus petite encore, jusqu'à la dernière, qui est pleine. Pour compter les poupées, il suffit de dire : « une, plus le nombre de poupées qu'il y a dedans ». La question est posée à nouveau, sur un objet plus petit, jusqu'à la poupée pleine, pour laquelle la réponse est immédiate.

Beaucoup de calculs se décrivent de cette façon : la factorielle de 5 est 5 fois celle de 4 ; le PGCD de 84 et 36 est celui de 36 et 12 ; une expression `(3 + 4) × 5` est formée d'expressions plus petites. Une fonction qui suit ces descriptions s'appelle elle-même. Ce chapitre montre comment l'écrire, ce qui se passe dans la machine, comment prouver qu'elle est juste, comment énumérer toutes les possibilités d'un petit problème, et pourquoi certaines fonctions récursives sont désastreusement lentes.

## Une fonction qui s'appelle elle-même

La **factorielle** d'un entier n ≥ 0, notée n!, est le produit 1 × 2 × … × n, avec 0! = 1. On remarque que n! = n × (n − 1)! dès que n ≥ 1. Cette remarque se traduit directement en programme :

```python
def factorielle(n):
    if n == 0:
        return 1                        # cas de base
    return n * factorielle(n - 1)       # cas récursif

print(factorielle(5))
print(factorielle(20))
```

```cpp
#include <iostream>
using namespace std;

long long factorielle(int n) {
    if (n == 0) {
        return 1;                         // cas de base
    }
    return n * factorielle(n - 1);        // cas récursif
}

int main() {
    cout << factorielle(5) << "\n";
    cout << factorielle(20) << "\n";
    return 0;
}
```

Le programme affiche `120`, puis `2432902008176640000`.

Une **fonction récursive** est une fonction qui s'appelle elle-même. Elle comporte toujours deux parties :

- le **cas de base** : une ou plusieurs situations simples où la réponse est donnée directement, sans nouvel appel (ici, n = 0) ;
- le **cas récursif** : la réponse est calculée à partir d'un ou plusieurs **appels récursifs** sur des données plus petites (ici, `factorielle(n - 1)`).

Le cas de base est indispensable : sans lui, la fonction s'appellerait indéfiniment. Les appels récursifs doivent aussi **se rapprocher** du cas de base : `factorielle(n - 1)` part de n et descend vers 0.

## La pile d'appels

Que se passe-t-il pendant `factorielle(3)` ? L'appel a besoin de `factorielle(2)`, qui a besoin de `factorielle(1)`, qui a besoin de `factorielle(0)`. Chaque appel est mis en attente pendant que le suivant travaille. Pour le voir, on ajoute un paramètre `prof` (la profondeur) qui sert à décaler l'affichage :

```python
def factorielle(n, prof):
    print("  " * prof + "debut", n)
    if n == 0:
        r = 1
    else:
        r = n * factorielle(n - 1, prof + 1)
    print("  " * prof + "fin", n, "->", r)
    return r

factorielle(3, 0)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

long long factorielle(int n, int prof) {
    cout << string(2 * prof, ' ') << "debut " << n << "\n";
    long long r;
    if (n == 0) {
        r = 1;
    } else {
        r = n * factorielle(n - 1, prof + 1);
    }
    cout << string(2 * prof, ' ') << "fin " << n << " -> " << r << "\n";
    return r;
}

int main() {
    factorielle(3, 0);
    return 0;
}
```

Le programme affiche :

```text
debut 3
  debut 2
    debut 1
      debut 0
      fin 0 -> 1
    fin 1 -> 1
  fin 2 -> 2
fin 3 -> 6
```

Les appels commencent du plus grand au plus petit, et se terminent dans l'ordre inverse : le dernier commencé est le premier terminé. Chaque appel possède ses **propres** variables locales : il y a, au même moment, quatre variables `n` différentes, qui valent 3, 2, 1 et 0. La machine les range dans la **pile d'appels** : à chaque appel, elle empile un **cadre** qui contient les paramètres, les variables locales et l'endroit où reprendre le calcul ; au `return`, elle dépile ce cadre et reprend l'appel précédent là où il s'était arrêté. On retrouve exactement la pile du chapitre « Piles et files ».

Le nombre maximal de cadres présents en même temps s'appelle la **profondeur** de la récursion. Pour `factorielle(n)`, elle vaut n + 1.

## Prouver une fonction récursive

Pour se convaincre qu'une fonction récursive est juste, on ne déroule pas tous les appels : on raisonne par **récurrence**, comme en mathématiques.

1. On vérifie que le résultat est juste dans le cas de base.
2. On suppose que les appels récursifs, faits sur des données plus petites, renvoient le bon résultat (c'est l'**hypothèse de récurrence**), et on vérifie qu'alors le cas récursif renvoie lui aussi le bon résultat.

Pour `factorielle` : `factorielle(0)` renvoie 1 = 0!. Si `factorielle(n − 1)` renvoie (n − 1)!, alors `factorielle(n)` renvoie n × (n − 1)! = n!. Par récurrence, `factorielle(n)` est juste pour tout n ≥ 0.

Il faut aussi prouver la **terminaison** : on exhibe une quantité entière, positive ou nulle, qui diminue strictement à chaque appel récursif. Elle ne peut pas diminuer indéfiniment, donc on finit par atteindre un cas de base. Pour `factorielle`, cette quantité est n lui-même. Attention : `factorielle(-1)` appelle `factorielle(-2)`, puis `factorielle(-3)`… et ne s'arrête jamais. La preuve ne vaut que pour n ≥ 0, qui est la condition d'utilisation de la fonction.

## Récursivité sur les nombres

Le PGCD se calcule par l'algorithme d'Euclide, vu au niveau 2 : pgcd(a, 0) = a, et pgcd(a, b) = pgcd(b, a mod b) si b > 0. La version récursive recopie ces deux égalités. La somme des chiffres et la puissance s'écrivent de la même façon.

```python
def pgcd(a, b):
    if b == 0:
        return a
    return pgcd(b, a % b)

def somme_chiffres(n):
    if n < 10:
        return n
    return n % 10 + somme_chiffres(n // 10)

def puissance(a, n):
    if n == 0:
        return 1
    return a * puissance(a, n - 1)

print(pgcd(84, 36), somme_chiffres(2026), puissance(3, 4))
```

```cpp
#include <iostream>
using namespace std;

long long pgcd(long long a, long long b) {
    if (b == 0) {
        return a;
    }
    return pgcd(b, a % b);
}

int somme_chiffres(long long n) {
    if (n < 10) {
        return n;
    }
    return n % 10 + somme_chiffres(n / 10);
}

long long puissance(long long a, int n) {
    if (n == 0) {
        return 1;
    }
    return a * puissance(a, n - 1);
}

int main() {
    cout << pgcd(84, 36) << " " << somme_chiffres(2026) << " " << puissance(3, 4) << "\n";
    return 0;
}
```

Le programme affiche `12 10 81`. Pour `pgcd(84, 36)`, les appels successifs sont `pgcd(36, 12)`, puis `pgcd(12, 0)`, qui renvoie 12. La terminaison vient de ce que le second paramètre diminue strictement, puisque a mod b < b.

La fonction `puissance` fait n appels. Une idée simple réduit beaucoup ce nombre : si n est pair, a^n = (a^(n/2))², et sinon a^n = a × a^(n−1). En au plus deux appels, n est au moins divisé par deux : le nombre d'appels est au plus de l'ordre de 2 × log₂(n), soit une centaine pour n = 10¹⁸. C'est l'**exponentiation rapide** du chapitre « Correction, invariants et terminaison », écrite cette fois sous forme récursive ; la preuve par récurrence est immédiate, puisqu'elle recopie les deux égalités.

## Récursivité sur les listes et les chaînes

Une liste ou une chaîne se découpe aussi en morceaux plus petits. Une chaîne est un **palindrome** si elle a au plus une lettre, ou si sa première et sa dernière lettre sont égales et que ce qui reste entre les deux est un palindrome. Plutôt que de fabriquer la chaîne du milieu, on passe en paramètres les indices `i` et `j` de la portion étudiée. De même, le maximum de `t[0..i]` est le plus grand de `t[i]` et du maximum de `t[0..i−1]`.

```python
def est_palindrome(s, i, j):
    # la portion s[i..j] est-elle un palindrome ?
    if i >= j:
        return True
    if s[i] != s[j]:
        return False
    return est_palindrome(s, i + 1, j - 1)

def maximum(t, i):
    # plus grande valeur parmi t[0], ..., t[i]
    if i == 0:
        return t[0]
    return max(t[i], maximum(t, i - 1))

mot = "ressasser"
print(est_palindrome(mot, 0, len(mot) - 1))
print(maximum([4, 9, 2, 7], 3))
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// la portion s[i..j] est-elle un palindrome ?
bool est_palindrome(const string &s, int i, int j) {
    if (i >= j) {
        return true;
    }
    if (s[i] != s[j]) {
        return false;
    }
    return est_palindrome(s, i + 1, j - 1);
}

// plus grande valeur parmi t[0], ..., t[i]
int maximum(const vector<int> &t, int i) {
    if (i == 0) {
        return t[0];
    }
    return max(t[i], maximum(t, i - 1));
}

int main() {
    string mot = "ressasser";
    cout << (est_palindrome(mot, 0, mot.size() - 1) ? "True" : "False") << "\n";
    cout << maximum({4, 9, 2, 7}, 3) << "\n";
    return 0;
}
```

Le programme affiche `True`, puis `9`. La preuve se fait par récurrence sur la longueur j − i + 1 de la portion, qui diminue de 2 à chaque appel de `est_palindrome` et de 1 à chaque appel de `maximum`. Passer des indices plutôt que des tranches comme `s[1:-1]` compte : une tranche **copie** la portion, et une suite de copies de longueurs n, n − 2, n − 4… représente environ n²/4 opérations, au lieu de n/2 appels.

Ces deux fonctions s'écrivent tout aussi bien avec une boucle. La récursivité devient vraiment utile quand une donnée se découpe en **plusieurs** morceaux, ou quand il faut essayer plusieurs choix à chaque étape.

## Engendrer toutes les possibilités

Pour trouver les **sous-ensembles** de {1, 2, 3} dont la somme vaut 3, on peut les essayer tous. Pour chaque élément, il y a deux choix : le prendre ou non. Une fonction récursive prend ces décisions une par une : `explorer(i)` décide pour les éléments à partir du numéro `i`, les éléments déjà pris étant rangés dans la liste `choisis`.

```python
def explorer(i):
    if i == len(t):                 # toutes les décisions sont prises
        if sum(choisis) == 3:
            print(choisis)
        return
    explorer(i + 1)                 # sans t[i]
    choisis.append(t[i])
    explorer(i + 1)                 # avec t[i]
    choisis.pop()                   # on remet la liste dans son état

t = [1, 2, 3]
choisis = []
explorer(0)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> t = {1, 2, 3};
vector<int> choisis;

void explorer(int i) {
    if (i == (int)t.size()) {          // toutes les décisions sont prises
        int s = 0;
        for (int x : choisis) s += x;
        if (s == 3) {
            for (int x : choisis) cout << x << " ";
            cout << "\n";
        }
        return;
    }
    explorer(i + 1);                    // sans t[i]
    choisis.push_back(t[i]);
    explorer(i + 1);                    // avec t[i]
    choisis.pop_back();                 // on remet la liste dans son état
}

int main() {
    explorer(0);
    return 0;
}
```

Le programme affiche `[3]`, puis `[1, 2]` (en C++ : `3`, puis `1 2`). Par récurrence sur n − i, l'appel `explorer(i)` passe une fois et une seule par chacune des 2^(n−i) façons de décider pour les éléments restants, et rend la liste `choisis` dans l'état où il l'a trouvée. L'appel `explorer(0)` voit donc les 2^n sous-ensembles. Le `pop` est essentiel : l'oublier laisse dans `choisis` des éléments d'une branche déjà terminée.

Pour les **permutations** (les ordres possibles des n éléments), on choisit d'abord l'élément placé en premier, parmi tous, puis le deuxième, parmi ceux qui restent, et ainsi de suite. Une liste de booléens `utilise` indique les éléments déjà placés.

```python
def permuter(ordre):
    if len(ordre) == len(t):
        print(*ordre)
        return
    for i in range(len(t)):
        if not utilise[i]:
            utilise[i] = True
            ordre.append(t[i])
            permuter(ordre)
            ordre.pop()
            utilise[i] = False

t = [1, 2, 3]
utilise = [False] * len(t)
permuter([])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> t = {1, 2, 3};
vector<bool> utilise(3, false);
vector<int> ordre;

void permuter() {
    if (ordre.size() == t.size()) {
        for (int x : ordre) cout << x << " ";
        cout << "\n";
        return;
    }
    for (int i = 0; i < (int)t.size(); i++) {
        if (!utilise[i]) {
            utilise[i] = true;
            ordre.push_back(t[i]);
            permuter();
            ordre.pop_back();
            utilise[i] = false;
        }
    }
}

int main() {
    permuter();
    return 0;
}
```

Le programme affiche les six ordres `1 2 3`, `1 3 2`, `2 1 3`, `2 3 1`, `3 1 2`, `3 2 1`, dans cet ordre. Il y a n choix pour le premier élément, n − 1 pour le deuxième, etc. : n! permutations en tout.

Ces nombres grandissent très vite : 2^20 ≈ un million, et 10! ≈ 3,6 millions. On n'énumère tout que pour de petits n, environ 20 pour les sous-ensembles et 10 pour les permutations.

## Profondeur de récursion

Chaque cadre occupe de la mémoire, et la pile a une taille limitée. Pour le voir, on calcule la suite définie par u(0) = 0 et u(n) = (2 × u(n − 1) + n) mod 1 000 003 :

```python
def u(n):
    if n == 0:
        return 0
    return (2 * u(n - 1) + n) % 1000003

print(u(500))
print(u(100000))
```

```cpp
#include <iostream>
using namespace std;

long long u(int n) {
    if (n == 0) {
        return 0;
    }
    return (2 * u(n - 1) + n) % 1000003;
}

int main() {
    cout << u(10000000) << "\n";   // dix millions d'appels imbriqués
    return 0;
}
```

Python affiche `93168`, puis s'arrête avec `RecursionError: maximum recursion depth exceeded` : par défaut, la profondeur est limitée à 1 000 appels environ. Quand la profondeur est connue et raisonnable, quelques milliers, on relève la limite au début du programme :

```python
import sys
sys.setrecursionlimit(10000)
```

```cpp
// Pas d'équivalent en C++ : on garde une profondeur raisonnable,
// ou on remplace la récursion par une boucle.
```

En C++, la limite vient de la taille de la pile, souvent 8 Mo. Dix millions de cadres ne tiennent pas : le programme s'arrête brutalement, sans message clair, avec `Segmentation fault (core dumped)` sur un ordinateur, ou un message comme `Maximum call stack size exceeded` dans un navigateur. Un juge en ligne l'affiche comme une erreur d'exécution. Dans les deux langages, une récursion de profondeur 10⁵ ou plus est risquée. Si chaque appel ne fait qu'un seul appel récursif, comme ici, une boucle fait le même travail sans ce risque. (Le compilateur C++ transforme parfois de lui-même une récursion très simple, comme `factorielle`, en boucle ; on ne peut pas compter dessus.)

## Le coût d'une récursion naïve

Les **nombres de Fibonacci** sont définis par F(0) = 0, F(1) = 1 et F(n) = F(n − 1) + F(n − 2). La traduction directe est juste, mais elle est très lente. Comptons les appels :

```python
appels = 0

def fib(n):
    global appels
    appels = appels + 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(25), appels)
```

```cpp
#include <iostream>
using namespace std;

long long appels = 0;

long long fib(int n) {
    appels++;
    if (n < 2) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

int main() {
    long long f = fib(25);
    cout << f << " " << appels << "\n";
    return 0;
}
```

Le programme affiche `75025 242785` : près de 250 000 appels pour un résultat qu'une boucle obtient en 25 additions. (Le mot-clé `global` permet ici de modifier une variable globale depuis la fonction ; on ne l'utilise que pour ce genre de mesure.) La raison : `fib(25)` appelle `fib(24)` et `fib(23)`, mais `fib(24)` appelle à nouveau `fib(23)`. Les mêmes valeurs sont recalculées un nombre énorme de fois. Si A(n) est le nombre d'appels, A(n) = 1 + A(n − 1) + A(n − 2) ≥ 2 A(n − 2) : le nombre d'appels double au moins tous les deux rangs. On montre même que A(n) = 2 F(n + 1) − 1. Pour n = 50, c'est environ 4 × 10¹⁰ appels : plusieurs heures en Python.

Le remède s'appelle la **mémoïsation** : on range chaque résultat calculé dans un dictionnaire, et on le consulte avant de calculer.

```python
memo = {}

def fib(n):
    if n < 2:
        return n
    if n in memo:
        return memo[n]
    r = fib(n - 1) + fib(n - 2)
    memo[n] = r
    return r

print(fib(90))
```

```cpp
#include <iostream>
#include <map>
using namespace std;

map<int, long long> memo;

long long fib(int n) {
    if (n < 2) {
        return n;
    }
    if (memo.count(n)) {
        return memo[n];
    }
    long long r = fib(n - 1) + fib(n - 2);
    memo[n] = r;
    return r;
}

int main() {
    cout << fib(90) << "\n";
    return 0;
}
```

Le programme affiche `2880067194370816120` instantanément. Chaque valeur de 2 à n n'est calculée qu'une fois ; ensuite, chaque appel qui la demande la trouve dans le dictionnaire. Il y a donc environ 2n appels en tout. La mémoïsation ne change pas la preuve de correction : une valeur lue dans le dictionnaire est une valeur calculée plus tôt par la même fonction. Elle est utile dès que les mêmes sous-problèmes reviennent ; c'est le point de départ de la programmation dynamique, étudiée plus tard.

## Les erreurs fréquentes

**Oublier le cas de base**, ou écrire un cas de base jamais atteint : `factorielle(-1)`, ou une fonction qui teste `n == 0` alors que n diminue de 2 à partir d'un nombre impair. Résultat : `RecursionError` en Python, débordement de la pile (`Segmentation fault`) en C++.

**Oublier le `return` devant l'appel récursif.** Écrire `pgcd(b, a % b)` au lieu de `return pgcd(b, a % b)` calcule le résultat puis le jette : la fonction renvoie `None`, et un calcul comme `pgcd(84, 36) + 1` provoque `TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'`.

**Oublier d'annuler un choix.** Dans `explorer` ou `permuter`, chaque `append` doit être suivi d'un `pop`, et chaque `utilise[i] = True` d'un retour à `False`, sinon les branches suivantes partent d'un état faux.

**Recalculer sans fin.** Une fonction qui fait deux appels récursifs ou plus sur des données qui se recoupent, comme `fib`, peut avoir un nombre d'appels exponentiel. Si le programme est lent sur des données moyennes, on compte les appels, et on mémoïse.

## Exemple complet : décomposer un entier

**Énoncé.** Afficher toutes les façons d'écrire un entier N (1 ≤ N ≤ 20) comme somme d'entiers strictement positifs, chaque somme étant écrite avec des termes décroissants (ainsi 2 + 1 + 1 et 1 + 2 + 1 comptent pour une seule écriture). Les sommes sont affichées une par ligne, de la plus grande à la plus petite dans l'ordre du dictionnaire, puis leur nombre.

**Idée.** On choisit les termes un par un. Après avoir écrit des termes dont le dernier vaut m, il reste à écrire `reste`, avec des termes au plus égaux à m. Le prochain terme k va de `min(reste, m)` jusqu'à 1 ; pour chaque k, on écrit k, puis on décompose `reste − k` avec des termes au plus égaux à k. Quand `reste` vaut 0, la somme est terminée.

**Programme.**

```python
def decomposer(reste, m, termes):
    # écrit toutes les fins possibles : somme 'reste', termes <= m
    # et renvoie leur nombre
    if reste == 0:
        print(" + ".join(map(str, termes)))
        return 1
    total = 0
    for k in range(min(reste, m), 0, -1):
        termes.append(k)
        total = total + decomposer(reste - k, k, termes)
        termes.pop()
    return total

n = int(input())
print(decomposer(n, n, []))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> termes;

// écrit toutes les fins possibles : somme 'reste', termes <= m
// et renvoie leur nombre
int decomposer(int reste, int m) {
    if (reste == 0) {
        for (int i = 0; i < (int)termes.size(); i++) {
            if (i > 0) cout << " + ";
            cout << termes[i];
        }
        cout << "\n";
        return 1;
    }
    int total = 0;
    for (int k = min(reste, m); k >= 1; k--) {
        termes.push_back(k);
        total += decomposer(reste - k, k);
        termes.pop_back();
    }
    return total;
}

int main() {
    int n;
    cin >> n;
    int total = decomposer(n, n);
    cout << total << "\n";
    return 0;
}
```

**Vérification à la main.** Avec N = 4, l'appel `decomposer(4, 4, [])` essaie d'abord k = 4, et `decomposer(0, 4, [4])` affiche `4`. Puis k = 3 : il reste 1, et le seul terme possible est 1, d'où `3 + 1`. Puis k = 2 : il reste 2 avec des termes au plus 2, ce qui donne `2 + 2` puis `2 + 1 + 1`. Enfin k = 1 donne `1 + 1 + 1 + 1`. Le programme affiche ces cinq lignes, puis `5`, la valeur renvoyée par le premier appel.

**Correction.** Par récurrence sur `reste` : `decomposer(reste, m, termes)` affiche une fois chaque suite décroissante de termes au plus égaux à m dont la somme vaut `reste`, précédée des termes déjà choisis. Une telle suite commence par un terme k compris entre 1 et `min(reste, m)`, et se termine par une suite décroissante de somme `reste − k` aux termes au plus égaux à k : c'est exactement ce que fournit l'appel récursif. Comme k décroît dans la boucle, les sommes sortent de la plus grande à la plus petite. **Terminaison** : `reste` diminue d'au moins 1 à chaque appel.

**Coût.** La profondeur ne dépasse pas N + 1. Le nombre de lignes affichées croît vite, 627 pour N = 20, mais chaque appel produit au moins une ligne ou prolonge une somme qui en produira une : le travail reste proportionnel à la taille de ce qui est affiché.

## À retenir

- Une fonction récursive a un **cas de base**, traité sans appel, et un **cas récursif**, qui s'appelle sur des données plus petites, de sorte qu'on atteigne toujours le cas de base.
- Chaque appel a ses propres variables, rangées dans un cadre de la **pile d'appels** ; le dernier appel commencé est le premier terminé.
- On prouve une fonction récursive **par récurrence** : cas de base juste, et cas récursif juste si les appels plus petits le sont ; la terminaison se prouve par une quantité entière qui diminue strictement.
- Pour énumérer sous-ensembles et permutations, on prend les décisions une par une, et on **annule** chaque choix après l'appel (`pop`, `utilise[i] = False`). Il y a 2^n sous-ensembles et n! permutations.
- La profondeur est limitée : `RecursionError` en Python au-delà d'environ 1 000 appels, à relever avec `sys.setrecursionlimit` ; `Segmentation fault` en C++ quand la pile déborde.
- Une récursion qui recalcule les mêmes valeurs, comme Fibonacci, peut faire un nombre exponentiel d'appels : la **mémoïsation** dans un dictionnaire ramène le calcul à un appel par valeur différente.
