Le niveau 2 a montré qu'une chaîne se manipule comme un tableau de caractères : on la parcourt, on la découpe, on la recolle. Ce chapitre passe aux **algorithmes** sur les chaînes. Est-ce que la phrase « Esope reste ici et se repose » se lit pareil dans les deux sens ? À quelles positions le mot `ana` apparaît-il dans un texte de cent mille lettres ? Combien de morceaux d'un mot commencent par `a` et finissent par `b` ?

Ces questions ont des solutions évidentes, pas toujours rapides. À partir de ce niveau, chaque algorithme est accompagné de deux justifications : pourquoi il donne la bonne réponse (sa **correction**), et combien d'opérations il fait (son **coût**). Le coût se compte en fonction de la longueur des chaînes, notée `n` : un algorithme qui fait environ `n` opérations reste instantané pour `n = 100 000`, alors qu'un algorithme qui en fait environ `n²`, soit dix milliards, ne termine pas à temps.

## Codes et classes de caractères

Chaque caractère a un **code**, un entier : `ord(c)` le donne en Python, et en C++ un `char` est déjà un petit entier. Les lettres minuscules ont des codes consécutifs (97 pour `a`, …, 122 pour `z`), de même que les majuscules (65 à 90) et les chiffres (48 à 57). On appelle **classe** de caractères un ensemble de caractères qu'on traite de la même façon : les minuscules, les majuscules, les chiffres, les autres. Grâce aux codes consécutifs, chaque classe se teste par un encadrement : `"a" <= c <= "z"` en Python, `c >= 'a' && c <= 'z'` en C++.

Les codes permettent de calculer avec les lettres. Le **rang** d'une minuscule, `ord(c) - ord("a")`, va de 0 à 25. Pour décaler une lettre de `k` crans en revenant à `a` après `z`, on calcule le nouveau rang `(rang + k) % 26`, puis la lettre de ce rang. C'est un **décalage circulaire** : le reste de la division par 26 fait « tourner » l'alphabet.

```python
def decaler(c, k):
    if "a" <= c <= "z":
        return chr(ord("a") + (ord(c) - ord("a") + k) % 26)
    if "A" <= c <= "Z":
        return chr(ord("A") + (ord(c) - ord("A") + k) % 26)
    return c

print(decaler("y", 3), decaler("B", -3), decaler("!", 5))
```

```cpp
#include <iostream>
using namespace std;

char decaler(char c, int k) {
    k = ((k % 26) + 26) % 26;   // un décalage entre 0 et 25, même si k < 0
    if (c >= 'a' && c <= 'z') {
        return 'a' + (c - 'a' + k) % 26;
    }
    if (c >= 'A' && c <= 'Z') {
        return 'A' + (c - 'A' + k) % 26;
    }
    return c;
}

int main() {
    cout << decaler('y', 3) << " " << decaler('B', -3) << " " << decaler('!', 5) << "\n";
    return 0;
}
```

Le programme affiche `b Y !`. Le rang de `y` est 24, et `(24 + 3) % 26` vaut 1 : on obtient `b`. Pour `B`, le rang 1 et le décalage −3 donnent `(1 − 3) % 26`. En Python, ce reste vaut 24, car le reste a toujours le signe du diviseur : on obtient `Y`. En C++, `-2 % 26` vaut `-2`, ce qui donnerait un caractère qui n'est pas une lettre. C'est pourquoi la version C++ ramène d'abord `k` entre 0 et 25 avec `((k % 26) + 26) % 26`.

Le même calcul sert pour les chiffres, avec `"0"` et 10 à la place de `"a"` et 26. Décaler de `k` crans ou de `k % 26` crans donne la même lettre : un décalage de 10⁹ crans coûte une seule opération.

## Palindromes

Un **palindrome** est une chaîne qui se lit de la même façon de gauche à droite et de droite à gauche : `radar`, `elle`, `a`, et même la chaîne vide. Autrement dit, `s` est un palindrome quand `s[i] == s[n - 1 - i]` pour tout indice `i`, où `n` est la longueur de `s`.

Python offre une écriture courte pour retourner une chaîne. Les tranches du niveau 2 acceptent un troisième nombre, le **pas** : `s[a:b:p]` prend un caractère tous les `p`. Avec un pas de −1 et sans bornes, `s[::-1]` parcourt toute la chaîne à l'envers. Le test `s == s[::-1]` est donc correct, mais il fabrique d'abord une copie complète de `s`, puis compare tout, même quand les deux premiers caractères diffèrent déjà.

L'algorithme des **deux indices** évite ces deux défauts. Un indice `i` part du début, un indice `j` part de la fin, et ils se rapprochent tant que `i < j` et que les caractères en face sont égaux.

```python
def est_palindrome(s):
    i = 0
    j = len(s) - 1
    while i < j and s[i] == s[j]:
        i = i + 1
        j = j - 1
    return i >= j

print(est_palindrome("radar"), est_palindrome("rotor"), est_palindrome("route"))
```

```cpp
#include <iostream>
#include <string>
using namespace std;

bool estPalindrome(const string &s) {
    int i = 0;
    int j = (int) s.size() - 1;
    while (i < j && s[i] == s[j]) {
        i = i + 1;
        j = j - 1;
    }
    return i >= j;
}

int main() {
    cout << estPalindrome("radar") << " " << estPalindrome("rotor") << " " << estPalindrome("route") << "\n";
    return 0;
}
```

Python affiche `True True False` (le C++ affiche `1 1 0`). Pour `route`, la boucle s'arrête dès la première comparaison, `r` contre `e`, avec `i = 0 < j = 4` : la fonction renvoie faux.

**Pourquoi c'est juste.** Au début de chaque tour, tous les caractères situés avant `i` sont égaux à leurs symétriques, situés après `j`. C'est vrai au départ (il n'y en a aucun), et chaque tour ne fait avancer les indices qu'après avoir vérifié `s[i] == s[j]`. Une propriété qui reste vraie à chaque tour s'appelle un **invariant** ; on l'étudiera en détail deux chapitres plus loin. Si la boucle s'arrête parce que `i >= j`, toutes les paires ont été vérifiées : c'est un palindrome. Si elle s'arrête sur un désaccord, ce n'est pas un palindrome.

**Coût.** Au plus `n / 2` comparaisons, et aucune copie. La boucle s'arrête au premier désaccord.

Pour une phrase, on ne garde souvent que les lettres, sans tenir compte des majuscules. On extrait d'abord ces lettres, en minuscules, dans une nouvelle chaîne, puis on applique la même fonction.

## Recherche naïve d'un motif

Chercher un **motif** `p` (une chaîne de longueur `m`) dans un **texte** `t` (de longueur `n`), c'est trouver les indices `i` tels que `t[i:i + m] == p`. Chacun de ces indices est une **occurrence** du motif. Dans `banana`, le motif `ana` a deux occurrences, aux indices 1 et 3, qui se **chevauchent** : elles partagent le `a` d'indice 3.

La **recherche naïve** essaie chaque indice de départ possible, de 0 à `n − m`, et compare le motif au texte caractère par caractère, jusqu'au premier désaccord.

```python
t = "banana"
p = "ana"
n = len(t)
m = len(p)
for i in range(n - m + 1):
    j = 0
    while j < m and t[i + j] == p[j]:
        j = j + 1
    if j == m:
        print(i)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string t = "banana", p = "ana";
    int n = t.size(), m = p.size();
    for (int i = 0; i + m <= n; i++) {
        int j = 0;
        while (j < m && t[i + j] == p[j]) {
            j = j + 1;
        }
        if (j == m) {
            cout << i << "\n";
        }
    }
    return 0;
}
```

Le programme affiche `1` puis `3`. La boucle intérieure maintient la propriété « les `j` premiers caractères du motif correspondent au texte à partir de `i` ». Quand elle s'arrête avec `j == m`, tout le motif correspond : c'est une occurrence. Comme tous les indices de départ sont essayés, aucune occurrence n'est oubliée. La dernière position essayée est `n − m` : au-delà, le motif dépasserait la fin du texte. Si `m > n`, `range(n - m + 1)` est vide, et la boucle ne fait aucun tour.

**Coût.** Chaque indice de départ demande au plus `m` comparaisons, donc la recherche en fait au plus `(n − m + 1) × m`. Le pire cas est atteint par un texte comme `aaaa…a` et le motif `aa…ab` : chaque essai compare presque tout le motif avant d'échouer sur le `b`. Avec `n = 100 000` et `m = 50 000`, c'est plus d'un milliard de comparaisons. Sur un texte ordinaire, en revanche, la plupart des essais échouent dès le premier ou le deuxième caractère, et la recherche fait à peine plus de `n` comparaisons. La recherche naïve convient donc quand le motif est court ; le niveau 5 présentera des algorithmes qui font toujours de l'ordre de `n + m` opérations.

Python fournit des outils tout faits : `p in t` dit si le motif apparaît, `t.find(p)` donne l'indice de la première occurrence (ou `-1`), et `t.count(p)` compte les occurrences **sans chevauchement** : `"aaaa".count("aa")` vaut 2, pas 3. En C++, `t.find(p)` renvoie l'indice de la première occurrence, ou la valeur spéciale `string::npos` s'il n'y en a pas, et `t.find(p, d)` cherche à partir de l'indice `d`. Ces outils font eux aussi des comparaisons : un appel à `find` dans une boucle n'est pas gratuit.

## Compter des sous-chaînes

Une **sous-chaîne** de `s` est un morceau de caractères consécutifs, `s[i:j]` avec `i < j`. Une chaîne de longueur `n` a `n` sous-chaînes de longueur 1, `n − 1` de longueur 2, …, une seule de longueur `n` : en tout, `n + (n − 1) + … + 1 = n × (n + 1) / 2` sous-chaînes. Pour `n = 100 000`, cela fait cinq milliards. Les examiner une par une est donc hors de question ; il faut les **compter sans les énumérer**.

L'idée la plus utile consiste à regrouper les sous-chaînes selon leur **dernière position**. Comptons, par exemple, les sous-chaînes qui commencent par `a` et finissent par `b`. Une telle sous-chaîne finit sur un `b` d'indice `j`, et commence sur un `a` d'indice `i < j`. Au moment où le parcours atteint un `b`, chaque `a` déjà rencontré fournit exactement une sous-chaîne. Il suffit donc de tenir à jour le nombre de `a` déjà vus.

```python
s = "abcab"
nb_a = 0
total = 0
for c in s:
    if c == "b":
        total = total + nb_a
    if c == "a":
        nb_a = nb_a + 1
print(total)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "abcab";
    long long nbA = 0, total = 0;
    for (char c : s) {
        if (c == 'b') {
            total = total + nbA;
        }
        if (c == 'a') {
            nbA = nbA + 1;
        }
    }
    cout << total << "\n";
    return 0;
}
```

Le programme affiche `3` : les sous-chaînes `ab` (indices 0 et 1), `abcab` (0 à 4) et `ab` (3 et 4). Chaque sous-chaîne qui convient est comptée une fois et une seule, au moment où le parcours atteint son dernier caractère. Le programme fait un nombre constant d'opérations par caractère : son coût est proportionnel à `n`, au lieu de `n²` pour l'essai de tous les couples `(i, j)`. Le total peut dépasser 2³¹ : en C++, on utilise un `long long`.

## Construire une chaîne efficacement

En Python, une chaîne est immuable. L'instruction `s = s + c` ne modifie pas `s` : elle fabrique une nouvelle chaîne, en **recopiant** tous les caractères de `s` puis `c`. Construire ainsi une chaîne de `n` caractères recopie `1 + 2 + … + n`, soit environ `n² / 2` caractères. Python évite parfois cette recopie pour `s = s + c` quand rien d'autre n'utilise `s`, mais c'est une optimisation, pas une garantie. Pour `s = c + s`, qui ajoute au début, la recopie a toujours lieu : retourner un texte de 100 000 caractères de cette façon recopie cinq milliards de caractères.

La bonne méthode consiste à ranger les morceaux dans une **liste**, où `append` coûte une seule opération, puis à les recoller une fois à la fin avec `"".join(morceaux)`, qui recopie chaque caractère une seule fois.

```python
mots = ["un", "deux", "trois"]
morceaux = []
for m in mots:
    morceaux.append(m.upper())
    morceaux.append(str(len(m)))
print("".join(morceaux))
print("-".join(morceaux))
```

```cpp
#include <cctype>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    vector<string> mots = {"un", "deux", "trois"};
    string resultat = "", avecTirets = "";
    for (string m : mots) {
        for (char &c : m) {
            c = toupper(c);
        }
        string longueur = to_string(m.size());
        resultat += m;
        resultat += longueur;
        if (avecTirets != "") {
            avecTirets += "-";
        }
        avecTirets += m;
        avecTirets += "-";
        avecTirets += longueur;
    }
    cout << resultat << "\n" << avecTirets << "\n";
    return 0;
}
```

Le programme affiche `UN2DEUX4TROIS5`, puis `UN-2-DEUX-4-TROIS-5`. Le C++ n'a pas de `join` : on y ajoute le séparateur à la main, entre deux morceaux. Une `string` du C++ se modifie : `resultat += m` ajoute à la fin sans recopier ce qui précède, la plupart du temps. En revanche, `resultat = resultat + m` fabrique une nouvelle chaîne et recopie tout : la différence entre ces deux écritures, qui semblent équivalentes, peut transformer un programme instantané en programme trop lent. Pour construire une chaîne à l'envers, on la construit à l'endroit puis on la retourne une fois, ou on la remplit depuis la fin.

## Erreurs fréquentes

**Oublier la dernière position.** `for i in range(n - m):` n'essaie pas l'indice `n − m`. Avec `t = "abc"` et `p = "bc"`, l'occurrence d'indice 1 est oubliée. La borne correcte est `range(n - m + 1)`.

**Sortir du texte.** Sans la borne `n − m`, la comparaison `t[i + j]` dépasse la fin et Python s'arrête avec `IndexError: string index out of range`. En C++, il n'y a pas de message : le programme lit n'importe quoi.

**Compter avec `count` des occurrences qui se chevauchent.** `"aaa".count("aa")` vaut 1. Si l'énoncé compte les chevauchements, il faut la recherche naïve, ou des appels à `find` qui repartent juste après le début de la dernière occurrence trouvée (son indice plus un).

**Recoller des nombres.** `" ".join([1, 2, 3])` provoque `TypeError: sequence item 0: expected str instance, int found`. On convertit chaque élément avec `str` avant de l'ajouter à la liste.

**Comparer le résultat de `find` en C++.** `t.find(p)` renvoie un entier sans signe ; s'il n'y a pas d'occurrence, c'est `string::npos`, un nombre immense. On écrit `if (t.find(p) != string::npos)`, et non `if (t.find(p) >= 0)`, qui est toujours vrai.

**Le reste négatif en C++.** `(c - 'a' + k) % 26` est négatif si `k` l'est assez : on ramène `k` entre 0 et 25 avant le calcul.

## Un exemple complet

**Énoncé.** On lit un mot de `N` lettres minuscules, avec `N ≤ 2 000`. Afficher la longueur de sa plus longue sous-chaîne palindrome.

**Idée.** Tester les `N × (N + 1) / 2` sous-chaînes, à `N / 2` comparaisons chacune, ferait de l'ordre d'un milliard d'opérations. On utilise plutôt le **centre** d'un palindrome. Un palindrome de longueur impaire a pour centre son caractère du milieu ; un palindrome de longueur paire a pour centre l'espace entre ses deux caractères du milieu. Un mot de `N` lettres a donc `2N − 1` centres possibles. Autour d'un centre fixé, on part du plus petit palindrome (une lettre, ou rien) et on l'**étend** d'un caractère de chaque côté, tant que les deux nouveaux caractères sont égaux.

**Programme.**

```python
# étend le palindrome s[i+1:j] tant que s[i] == s[j] ; renvoie sa longueur
def plus_long_autour(s, i, j):
    while i >= 0 and j < len(s) and s[i] == s[j]:
        i = i - 1
        j = j + 1
    return j - i - 1

n = int(input())
s = input()
meilleur = 0
for c in range(n):
    meilleur = max(meilleur, plus_long_autour(s, c, c))       # centre sur la lettre c
    meilleur = max(meilleur, plus_long_autour(s, c, c + 1))   # centre entre c et c + 1
print(meilleur)
```

```cpp
#include <algorithm>
#include <iostream>
#include <string>
using namespace std;

// étend le palindrome s[i+1..j-1] tant que s[i] == s[j] ; renvoie sa longueur
int plusLongAutour(const string &s, int i, int j) {
    while (i >= 0 && j < (int) s.size() && s[i] == s[j]) {
        i = i - 1;
        j = j + 1;
    }
    return j - i - 1;
}

int main() {
    int n;
    string s;
    cin >> n >> s;
    int meilleur = 0;
    for (int c = 0; c < n; c++) {
        meilleur = max(meilleur, plusLongAutour(s, c, c));       // centre sur la lettre c
        meilleur = max(meilleur, plusLongAutour(s, c, c + 1));   // centre entre c et c + 1
    }
    cout << meilleur << "\n";
    return 0;
}
```

**Vérification à la main.** Avec `7` et `abacabb`. Le centre sur la lettre d'indice 3 (`c`) s'étend : `a` = `a` (indices 2 et 4), puis `b` = `b` (1 et 5), puis `a` contre `b` (0 et 6) : on s'arrête avec `i = 0` et `j = 6`, et la longueur vaut `6 − 0 − 1 = 5`, celle de `bacab`. Le centre entre les indices 5 et 6 donne `bb`, de longueur 2. Aucun autre centre ne fait mieux, et le programme affiche `5`. Avec le centre entre les indices 0 et 1 (`a` contre `b`), la boucle ne fait aucun tour et la fonction renvoie `1 − 0 − 1 = 0`, la longueur du palindrome vide.

**Pourquoi c'est juste.** Si `s[i..j]` est un palindrome, en retirant ses deux extrémités on obtient encore un palindrome, de même centre. Inversement, en partant du centre, chaque extension conserve la propriété « `s[i+1..j-1]` est un palindrome », puisqu'on n'étend que si les deux nouveaux caractères sont égaux. L'extension s'arrête donc exactement sur le plus long palindrome de ce centre : au-delà, les deux caractères diffèrent ou l'on sort du mot, et aucun palindrome plus long de même centre n'existe. Tout palindrome a un centre, et le programme essaie tous les centres : il trouve donc le plus long.

**Coût.** Chaque extension autour d'un centre fait au plus `N / 2` tours, et il y a `2N − 1` centres : au plus environ `N²` comparaisons, soit quatre millions pour `N = 2 000`. C'est bien moins que le milliard d'opérations de l'essai de toutes les sous-chaînes.

## À retenir

- Les classes de caractères se testent par encadrement de codes ; un décalage circulaire se calcule sur le rang avec `% 26` (ou `% 10`), en ramenant d'abord le décalage entre 0 et 25 en C++.
- Un palindrome se teste avec deux indices qui se rapprochent : au plus `n / 2` comparaisons, sans copie. `s[::-1]` retourne une chaîne en Python.
- La recherche naïve d'un motif essaie les `n − m + 1` positions de départ et fait au plus `(n − m + 1) × m` comparaisons : rapide pour un motif court, lente dans le pire cas. `count` ignore les occurrences qui se chevauchent.
- Une chaîne a `n × (n + 1) / 2` sous-chaînes : on les compte sans les énumérer, en les regroupant par dernière position et en tenant à jour des compteurs.
- Pour construire une longue chaîne, on accumule les morceaux dans une liste, puis `"".join(...)` ; en C++, `+=` et non `s = s + ...`.
- Chaque algorithme se justifie : pourquoi il est juste (ce qui reste vrai à chaque tour de boucle) et combien d'opérations il fait en fonction de `n`.
