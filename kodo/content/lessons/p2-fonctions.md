Plusieurs exercices des chapitres précédents demandaient de tester si un nombre est premier. Le test tient en quelques lignes : essayer les diviseurs un par un. Mais si un programme doit faire ce test à trois endroits, sur trois nombres différents, il faut recopier ces lignes trois fois en changeant les noms des variables. Le programme s'allonge, devient difficile à relire, et une erreur corrigée à un endroit reste présente aux deux autres.

Une **fonction** règle ce problème : on écrit un calcul une seule fois, on lui donne un nom, puis on l'utilise autant de fois qu'on veut. Ce chapitre montre comment définir une fonction, ce qui se passe quand on l'utilise, quelles variables elle peut voir, comment elle travaille avec des listes, et surtout comment s'en servir pour découper un problème en petits morceaux faciles à vérifier.

## Définir et appeler une fonction

Voici une fonction qui calcule la somme des chiffres d'un entier positif, puis deux utilisations.

```python
def somme_chiffres(n):
    s = 0
    while n > 0:
        s = s + n % 10
        n = n // 10
    return s

print(somme_chiffres(2026))
print(somme_chiffres(7) + somme_chiffres(95))
```

```cpp
#include <iostream>
using namespace std;

int somme_chiffres(int n) {
    int s = 0;
    while (n > 0) {
        s = s + n % 10;
        n = n / 10;
    }
    return s;
}

int main() {
    cout << somme_chiffres(2026) << "\n";
    cout << somme_chiffres(7) + somme_chiffres(95) << "\n";
    return 0;
}
```

Ce programme affiche `10`, puis `21`.

La ligne `def somme_chiffres(n):` est l'**en-tête** de la fonction : le mot-clé `def`, le nom choisi, puis, entre parenthèses, les **paramètres**, c'est-à-dire les variables qui recevront les données. Le bloc décalé en dessous est le **corps** de la fonction. Écrire cette définition n'exécute rien : elle indique seulement à Python ce que signifie le nom `somme_chiffres`.

Le calcul a lieu lors d'un **appel** : `somme_chiffres(2026)`. La valeur entre parenthèses, appelée **argument**, est placée dans le paramètre `n`. Le corps s'exécute avec `n = 2026`. L'instruction `return s` termine la fonction et renvoie la valeur de `s` : c'est la **valeur de retour**. Dans l'expression qui contenait l'appel, celui-ci est remplacé par cette valeur, comme si on avait écrit `print(10)`. À la deuxième ligne, il y a deux appels : le premier renvoie 7, le second 9 + 5 = 14, et la somme vaut 21.

En C++, l'en-tête précise des **types** : celui de la valeur de retour avant le nom (`int`), et celui de chaque paramètre (`int n`). La fonction doit être écrite **avant** `main`, car le compilateur lit le fichier de haut en bas et doit connaître une fonction avant son premier appel. D'ailleurs, `main` est elle-même une fonction, qui renvoie un `int` : c'est la raison du `return 0` final.

## Plusieurs paramètres : le PGCD

Une fonction peut avoir plusieurs paramètres, séparés par des virgules. Les arguments sont placés dans les paramètres **dans l'ordre**. Le **plus grand commun diviseur** de deux entiers, ou **PGCD**, est le plus grand entier qui les divise tous les deux. Une première méthode repose sur une remarque simple : si `a > b`, tout diviseur commun de `a` et `b` divise aussi `a - b`, et réciproquement. Donc le PGCD de `a` et `b` est aussi celui de `a - b` et `b`. On soustrait le plus petit du plus grand jusqu'à ce que les deux nombres soient égaux.

```python
def pgcd(a, b):
    while a != b:
        if a > b:
            a = a - b
        else:
            b = b - a
    return a

print(pgcd(12, 18))
```

```cpp
#include <iostream>
using namespace std;

int pgcd(int a, int b) {
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
    cout << pgcd(12, 18) << "\n";
    return 0;
}
```

Le programme affiche `6`. L'appel place 12 dans `a` et 18 dans `b`. Les couples successifs sont (12, 18), (12, 6), (6, 6) : les deux nombres sont égaux, le PGCD vaut 6. Cette méthode suppose `a ≥ 1` et `b ≥ 1`, et elle peut être lente : pour `pgcd(1000000, 1)`, il faut un million de soustractions.

L'**algorithme d'Euclide** va beaucoup plus vite. Soustraire `b` de `a` autant de fois que possible revient à remplacer `a` par le reste `a % b`. On utilise donc la propriété : le PGCD de `a` et `b` est celui de `b` et `a % b`, et le PGCD de `a` et 0 vaut `a`.

```python
def pgcd(a, b):
    while b != 0:
        r = a % b
        a = b
        b = r
    return a
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
```

Pour `pgcd(12, 18)`, les couples sont (12, 18), (18, 12), (12, 6), (6, 0), et la fonction renvoie 6. Le nombre de tours reste très petit : moins d'une centaine, même pour des nombres proches de 10¹⁸.

## `return` arrête la fonction

L'instruction `return` termine la fonction **immédiatement**, même au milieu d'une boucle. C'est très pratique pour une fonction qui répond par oui ou par non, appelée **fonction booléenne** : elle renvoie `True` ou `False`. On lui donne en général un nom qui se lit comme une question, par exemple `est_premier`.

```python
def est_premier(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d = d + 1
    return True

for n in range(1, 20):
    if est_premier(n):
        print(n, end=" ")
print()
```

```cpp
#include <iostream>
using namespace std;

bool est_premier(int n) {
    if (n < 2) {
        return false;
    }
    for (int d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            return false;
        }
    }
    return true;
}

int main() {
    for (int n = 1; n < 20; n++) {
        if (est_premier(n)) {
            cout << n << " ";
        }
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche `2 3 5 7 11 13 17 19`. Dès qu'un diviseur est trouvé, `return False` quitte la fonction : inutile de continuer. Si la boucle se termine sans rien trouver, on arrive à `return True`. La boucle s'arrête quand `d * d` dépasse `n` : si `n = d × e` avec `d ≤ e`, alors `d × d ≤ n`, donc un nombre qui n'a aucun diviseur jusqu'à sa racine carrée n'en a aucun du tout. Pour `n` proche d'un milliard, on fait environ 31 600 essais au lieu d'un milliard.

Une fonction booléenne s'utilise directement comme condition : on écrit `if est_premier(n):`, et non `if est_premier(n) == True:`.

Une fonction peut aussi ne rien renvoyer : elle affiche quelque chose ou modifie une liste. En C++, son type de retour est `void`. En Python, une fonction qui se termine sans `return` renvoie une valeur spéciale, `None`, qui signifie « rien ».

## Variables locales et globales

Une variable créée dans une fonction est **locale** : elle n'existe que pendant l'appel et elle est invisible ailleurs. Les paramètres sont aussi des variables locales. Une variable créée en dehors de toute fonction est dite **globale**.

```python
def double(x):
    y = 2 * x
    return y

y = 5
print(double(10))
print(y)
```

```cpp
#include <iostream>
using namespace std;

int double_de(int x) {
    int y = 2 * x;
    return y;
}

int main() {
    int y = 5;
    cout << double_de(10) << "\n";
    cout << y << "\n";
    return 0;
}
```

Le programme affiche `20`, puis `5`. Le `y` de la fonction et le `y` du programme principal sont deux variables différentes qui portent le même nom ; modifier l'une ne touche pas l'autre. (En C++, `double` est un mot réservé, d'où le nom `double_de`.)

De même, quand l'argument est un nombre, le paramètre reçoit une **copie** de sa valeur : on parle de **passage par valeur**. Dans `somme_chiffres`, le paramètre `n` finit à 0, mais si on a appelé `somme_chiffres(x)`, la variable `x` du programme principal n'a pas changé.

Une fonction Python peut **lire** une variable globale, mais dès qu'elle lui **affecte** une valeur, Python considère que c'est une variable locale, dans toute la fonction :

```python
compteur = 0

def compter():
    compteur = compteur + 1

compter()
```

```cpp
// En C++, une variable globale est déclarée hors de toute fonction
// et peut être modifiée partout : ce piège n'existe pas, mais le conseil
// qui suit reste valable.
int compteur = 0;

void compter() {
    compteur = compteur + 1;
}
```

Python s'arrête avec `UnboundLocalError: cannot access local variable 'compteur' where it is not associated with a value` (les versions anciennes écrivent `local variable 'compteur' referenced before assignment`). Le `compteur` de droite est cherché dans la fonction, où il n'a pas encore de valeur. La bonne pratique, dans les deux langages : donner à la fonction tout ce dont elle a besoin par ses **paramètres**, et récupérer le résultat par son **`return`** : `compteur = ajouter_un(compteur)`. Une fonction qui ne dépend que de ses paramètres se teste et se réutilise facilement.

## Découper un problème

Une fonction peut en appeler une autre. On construit ainsi un programme comme un assemblage de petites briques. Pour compter les nombres premiers **palindromes** (qui se lisent pareil dans les deux sens, comme 131) entre `a` et `b`, on écrit une fonction pour renverser un nombre, une autre pour reconnaître un palindrome, et on réutilise `est_premier`.

```python
def renverser(n):
    r = 0
    while n > 0:
        r = r * 10 + n % 10
        n = n // 10
    return r

def est_palindrome(n):
    return renverser(n) == n

def compter(a, b):
    total = 0
    for n in range(a, b + 1):
        if est_palindrome(n) and est_premier(n):
            total = total + 1
    return total

print(compter(1, 200))
```

```cpp
int renverser(int n) {
    int r = 0;
    while (n > 0) {
        r = r * 10 + n % 10;
        n = n / 10;
    }
    return r;
}

bool est_palindrome(int n) {
    return renverser(n) == n;
}

int compter(int a, int b) {
    int total = 0;
    for (int n = a; n <= b; n++) {
        if (est_palindrome(n) && est_premier(n)) {
            total = total + 1;
        }
    }
    return total;
}
// dans main : cout << compter(1, 200) << "\n";
```

Le programme affiche `10` : les nombres 2, 3, 5, 7, 11, 101, 131, 151, 181 et 191. La fonction `est_palindrome` renvoie directement la valeur de la comparaison, qui est déjà un booléen.

Chaque brique est courte et se vérifie seule : `print(renverser(1230))` doit afficher `321`. Cette manière de travailler s'appelle la **décomposition** : on écrit d'abord le programme principal comme si les fonctions existaient déjà (« pour chaque nombre, s'il est palindrome et premier… »), puis on écrit chaque fonction, et on la teste avant de passer à la suivante.

## Renvoyer plusieurs valeurs

Pour simplifier une fraction `p/q`, il faut renvoyer deux nombres. En Python, on écrit `return a, b`, et on récupère les deux valeurs avec une affectation multiple, comme pour `a, b = map(int, input().split())`.

En C++, une fonction ne renvoie qu'une valeur. On utilise alors le **passage par référence** : un paramètre déclaré avec `&`, comme `int &a`, n'est pas une copie mais un **autre nom** pour la variable passée en argument. Ce que la fonction écrit dans `a` est écrit directement dans la variable de l'appelant.

```python
def simplifier(p, q):
    d = pgcd(p, q)
    return p // d, q // d

a, b = simplifier(12, 18)
print(a, b)
```

```cpp
void simplifier(long long p, long long q, long long &a, long long &b) {
    long long d = pgcd(p, q);
    a = p / d;
    b = q / d;
}

int main() {
    long long a, b;
    simplifier(12, 18, a, b);
    cout << a << " " << b << "\n";
    return 0;
}
```

Le programme affiche `2 3`. Sans les `&`, la fonction C++ modifierait des copies, et `a` et `b` garderaient des valeurs quelconques.

## Fonctions et listes

Une liste passée à une fonction Python n'est **pas copiée** : le paramètre est un autre nom pour la même liste. Tout ce que la fonction modifie dans la liste (`t[i] = …`, `t.append(…)`) est visible après l'appel. Voici une fonction qui renverse la portion d'une liste entre les positions `i` et `j`, en échangeant les extrémités et en se rapprochant du milieu :

```python
def inverser(t, i, j):
    while i < j:
        x = t[i]
        t[i] = t[j]
        t[j] = x
        i = i + 1
        j = j - 1

t = [1, 2, 3, 4, 5, 6]
inverser(t, 1, 4)
print(t)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

void inverser(vector<int> &t, int i, int j) {
    while (i < j) {
        int x = t[i];
        t[i] = t[j];
        t[j] = x;
        i = i + 1;
        j = j - 1;
    }
}

int main() {
    vector<int> t = {1, 2, 3, 4, 5, 6};
    inverser(t, 1, 4);
    for (int x : t) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche `[1, 5, 4, 3, 2, 6]` en Python et `1 5 4 3 2 6` en C++. La fonction ne renvoie rien : son effet est la modification de la liste.

Attention : **affecter** une nouvelle liste au paramètre ne change rien pour l'appelant. Si la fonction écrit `t = t + [0]`, le nom local `t` désigne désormais une autre liste, et la liste de départ est intacte. Pour fabriquer une nouvelle liste, on la renvoie avec `return`. À l'inverse, si l'appelant veut garder sa liste intacte, il passe une copie, obtenue avec `list(t)`.

En C++, c'est le contraire : un paramètre `vector<int> t` est une **copie**. Les modifications sont perdues à la fin de l'appel, et copier un grand tableau à chaque appel coûte du temps. On écrit `vector<int> &t` pour modifier le tableau de l'appelant, et `const vector<int> &t` pour le lire sans le copier (`const` interdit de le modifier). Une fonction peut aussi renvoyer un tableau : `vector<int> carres(int n)`.

## Les erreurs fréquentes

**Oublier le `return`.** Une fonction qui calcule le bon résultat sans le renvoyer renvoie `None`. `print(somme_chiffres(2026))` affiche alors `None`, et `somme_chiffres(7) + 1` provoque `TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'`. En C++, le programme compile mais le résultat est n'importe quoi ; l'option `-Wall` affiche `warning: control reaches end of non-void function`. Un `print` dans la fonction ne remplace pas un `return` : il affiche, mais ne transmet rien au programme.

**Renvoyer trop tôt.** Dans `est_premier`, écrire `else: return True` dans la boucle donnerait la réponse après le premier diviseur testé : 9 serait déclaré premier, car 2 ne le divise pas. On ne peut conclure « premier » qu'**après** la boucle.

**Oublier les parenthèses.** `if est_premier:` teste la fonction elle-même, toujours considérée comme vraie, et `print(est_premier)` affiche `<function est_premier at 0x7f…>`. Un appel s'écrit toujours avec des parenthèses : `est_premier(n)`.

**Un mauvais nombre d'arguments.** `pgcd(12)` provoque `TypeError: pgcd() missing 1 required positional argument: 'b'` ; en C++, `error: too few arguments to function`.

**Appeler une fonction avant de la définir.** Python exécute le fichier de haut en bas : un appel placé avant le `def` donne `NameError: name 'pgcd' is not defined`. En C++, l'erreur est `error: 'pgcd' was not declared in this scope`. On écrit toutes les fonctions en haut du fichier.

**Masquer un nom.** Une variable qui porte le nom d'une fonction la remplace. Après `max = 0`, l'appel `max(a, b)` provoque `TypeError: 'int' object is not callable`. On évite d'appeler ses variables `max`, `min`, `sum`, `len`, `list` ou du même nom qu'une de ses fonctions.

## Exemple complet : les nombres narcissiques

**Énoncé.** Un entier de `k` chiffres est **narcissique** s'il est égal à la somme des puissances `k`-ièmes de ses chiffres. Par exemple, 153 a trois chiffres et 1³ + 5³ + 3³ = 1 + 125 + 27 = 153. Le programme lit deux entiers `A` et `B` (1 ≤ A ≤ B ≤ 100 000) et affiche, un par ligne, les nombres narcissiques compris entre `A` et `B`.

**Idée.** On découpe le problème. Il faut savoir compter les chiffres d'un nombre (`nombre_chiffres`), calculer une puissance (`puissance`), puis tester un nombre (`est_narcissique`), qui utilise les deux premières. Le programme principal se contente de parcourir les nombres de `A` à `B`. Il y a au plus 100 000 nombres, de 6 chiffres au plus, et chaque puissance demande au plus 6 multiplications : quelques millions d'opérations, ce qui reste raisonnable.

**Programme.**

```python
def nombre_chiffres(n):
    k = 0
    while n > 0:
        k = k + 1
        n = n // 10
    return k

def puissance(a, k):
    resultat = 1
    for i in range(k):
        resultat = resultat * a
    return resultat

def est_narcissique(n):
    k = nombre_chiffres(n)
    s = 0
    m = n
    while m > 0:
        s = s + puissance(m % 10, k)
        m = m // 10
    return s == n

a, b = map(int, input().split())
for n in range(a, b + 1):
    if est_narcissique(n):
        print(n)
```

```cpp
#include <iostream>
using namespace std;

int nombre_chiffres(int n) {
    int k = 0;
    while (n > 0) {
        k = k + 1;
        n = n / 10;
    }
    return k;
}

int puissance(int a, int k) {
    int resultat = 1;
    for (int i = 0; i < k; i++) {
        resultat = resultat * a;
    }
    return resultat;
}

bool est_narcissique(int n) {
    int k = nombre_chiffres(n);
    int s = 0;
    int m = n;
    while (m > 0) {
        s = s + puissance(m % 10, k);
        m = m / 10;
    }
    return s == n;
}

int main() {
    int a, b;
    cin >> a >> b;
    for (int n = a; n <= b; n++) {
        if (est_narcissique(n)) {
            cout << n << "\n";
        }
    }
    return 0;
}
```

**Vérification à la main.** Avec l'entrée `150 410`. Pour `n = 153`, `nombre_chiffres` renvoie 3 ; la boucle ajoute `puissance(3, 3) = 27`, puis `puissance(5, 3) = 125`, puis `puissance(1, 3) = 1` : la somme vaut 153, égale à `n`, et le programme affiche `153`. Pour `n = 154`, la somme vaut 64 + 125 + 1 = 190 : rien n'est affiché. Le programme affiche finalement `153`, `370`, `371` et `407`. On remarque que `est_narcissique` travaille sur une copie `m` de `n` : sans elle, `n` vaudrait 0 au moment de la comparaison finale. Chaque fonction peut d'ailleurs être testée séparément : `puissance(2, 10)` doit valoir 1024, `nombre_chiffres(100000)` doit valoir 6.

## À retenir

- `def nom(paramètres):` définit une fonction ; un appel `nom(arguments)` place les arguments dans les paramètres, dans l'ordre, exécute le corps, et `return` renvoie le résultat en arrêtant la fonction aussitôt.
- En C++, on précise le type de retour (`int`, `bool`, `void`…) et le type de chaque paramètre, et on écrit les fonctions avant `main`.
- Les variables d'une fonction sont locales. On passe les données par les paramètres et on récupère le résultat par `return`, plutôt que de modifier des variables globales.
- Pour un nombre, le paramètre est une copie. Une liste Python n'est pas copiée : la fonction peut la modifier. En C++, `&` donne accès à la variable de l'appelant (`int &x`, `vector<int> &t`).
- Une fonction booléenne (`est_premier`, `est_palindrome`) s'utilise directement dans un `if` ; on ne conclut « vrai » qu'après avoir tout vérifié.
- Découper un problème en petites fonctions, testées une par une, rend un programme plus court, plus lisible et plus sûr.
