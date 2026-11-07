Depuis le niveau 1, les programmes lisent et affichent du texte, mais sans jamais regarder à l'intérieur. Un mot y était un bloc qu'on pouvait seulement recopier. Or beaucoup de questions portent sur les lettres elles-mêmes : un mot se lit-il de la même façon dans les deux sens ? Combien de fois la lettre `e` apparaît-elle dans une phrase ? Ce nombre de cent chiffres est-il divisible par 3 ?

Ce chapitre montre qu'une **chaîne de caractères** se manipule presque comme un tableau : on accède à chaque caractère par son indice, on la parcourt, on la compare, on en construit de nouvelles. On verra aussi que chaque caractère a un numéro, ce qui permet de calculer avec les lettres.

## Une chaîne est une suite de caractères

Une **chaîne** est une suite de **caractères** : des lettres, des chiffres, des espaces, des signes de ponctuation. Comme pour un tableau, chaque caractère a un indice, à partir de 0, et `len(s)` donne la longueur. En C++, le type `string` (dans `<string>`) joue ce rôle, et la longueur s'écrit `s.size()`.

```python
s = "bonjour"
print(len(s))
print(s[0], s[3], s[len(s) - 1])
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "bonjour";
    cout << s.size() << "\n";
    cout << s[0] << " " << s[3] << " " << s[s.size() - 1] << "\n";
    return 0;
}
```

Le programme affiche `7`, puis `b j r`. Comme pour les listes, Python accepte `s[-1]` pour le dernier caractère.

Une différence entre les deux langages mérite d'être notée tout de suite. En C++, un caractère seul a son propre type, `char`, et s'écrit entre **apostrophes** : `'b'`. Les **guillemets** `"b"` désignent une chaîne, même si elle ne contient qu'un caractère. `s[0]` est un `char`. En Python, il n'y a pas de type caractère : `s[0]` est une chaîne de longueur 1, et `'b'` et `"b"` sont la même chose.

## Parcourir une chaîne

On parcourt une chaîne exactement comme un tableau : par valeur avec `for c in s:`, qui donne les caractères un par un, ou par indice avec `for i in range(len(s)):`. Le programme suivant compte les `e` d'un mot.

```python
mot = input()
nb = 0
for c in mot:
    if c == "e":
        nb = nb + 1
print(nb)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string mot;
    cin >> mot;
    int nb = 0;
    for (char c : mot) {
        if (c == 'e') {
            nb = nb + 1;
        }
    }
    cout << nb << "\n";
    return 0;
}
```

Avec l'entrée `entreprise`, le programme affiche `3`. Le parcours par indice sert quand on compare un caractère à son voisin, ou à celui qui lui correspond à l'autre bout du mot : `s[i]` et `s[len(s) - 1 - i]`.

## Construire une chaîne

En Python, une chaîne **ne se modifie pas** : `s[0] = "B"` provoque `TypeError: 'str' object does not support item assignment`. On dit qu'elle est **immuable**. Pour obtenir une chaîne différente, on en construit une nouvelle. L'opérateur `+` colle deux chaînes bout à bout (c'est la **concaténation**, vue au niveau 1), et `*` répète une chaîne : `"ab" * 3` vaut `"ababab"`. On part souvent de la **chaîne vide** `""` et on ajoute des caractères un par un.

En C++, une `string` se modifie : `s[0] = 'B';` est permis. On peut aussi ajouter un caractère ou une chaîne à la fin avec `+=`.

```python
mot = "radar"
sans_a = ""
envers = ""
for c in mot:
    if c != "a":
        sans_a = sans_a + c
    envers = c + envers
print(sans_a, envers)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string mot = "radar";
    string sans_a = "";
    string envers = "";
    for (char c : mot) {
        if (c != 'a') {
            sans_a += c;
        }
        envers = c + envers;
    }
    cout << sans_a << " " << envers << "\n";
    return 0;
}
```

Le programme affiche `rdr radar`. La ligne `envers = c + envers` place chaque nouveau caractère **devant** ceux déjà rangés : le mot est donc construit à l'envers. Ici, « radar » se lit pareil dans les deux sens : c'est un **palindrome**.

## Extraire un morceau : les tranches

On a souvent besoin d'un morceau d'une chaîne : la fin d'un mot, ses trois premières lettres, un nombre sans son signe. En Python, ce morceau s'appelle une **tranche** : `s[a:b]` est la nouvelle chaîne formée des caractères d'indices `a` à `b − 1`. Comme pour `range`, le premier indice est inclus et le second exclu, donc la tranche contient `b − a` caractères. Si on omet `a`, la tranche part du début ; si on omet `b`, elle va jusqu'à la fin.

En C++, on écrit `s.substr(debut, longueur)`. Attention, le second nombre est une **longueur**, et non un indice de fin : `s[a:b]` s'écrit `s.substr(a, b - a)`. Avec un seul nombre, `s.substr(debut)` va jusqu'à la fin.

```python
s = "bonjour"
print(s[0:3], s[3:7], s[3:], s[:3])
print(s[1:4], len(s[1:4]))
print(s[5:100], s[3:] + s[:3])
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "bonjour";
    cout << s.substr(0, 3) << " " << s.substr(3, 4) << " " << s.substr(3) << " " << s.substr(0, 3) << "\n";
    cout << s.substr(1, 3) << " " << s.substr(1, 3).size() << "\n";
    cout << s.substr(5, 100) << " " << s.substr(3) + s.substr(0, 3) << "\n";
    return 0;
}
```

Les deux programmes affichent `bon jour jour bon`, puis `onj 3`, puis `ur jourbon`. Dans le détail : `s[1:4]` prend les indices 1, 2 et 3, soit `onj`, de longueur 4 − 1 = 3. Une tranche qui dépasse la fin s'arrête simplement à la fin, sans erreur : `s[5:100]` vaut `ur`, et `s[4:2]` est la chaîne vide. Enfin, `s[3:] + s[:3]` recolle la fin et le début : on obtient `jourbon`, le mot « tourné » de 3 lettres.

En C++, `substr` tolère aussi une longueur trop grande, mais pas un début au-delà de la fin : `s.substr(8)` sur une chaîne de 7 caractères arrête le programme avec `terminate called after throwing an instance of 'std::out_of_range'`. Un début égal à la longueur est permis et donne la chaîne vide. Une tranche est une **copie** : la construire coûte autant d'opérations qu'elle a de caractères. Sur les tableaux de Python, les tranches marchent de la même façon : `t[1:]` est la liste sans son premier élément.

## Comparer des chaînes

Deux chaînes sont égales (`==`) quand elles ont la même longueur et les mêmes caractères aux mêmes places. Elles se comparent aussi avec `<` et `>`, selon l'**ordre lexicographique**, celui du dictionnaire : on compare les premiers caractères ; s'ils sont égaux, on passe aux deuxièmes, et ainsi de suite. Le premier caractère différent décide. Si une chaîne est le début de l'autre, la plus courte est la plus petite.

```python
print("chat" < "chien")
print("chat" < "chaton")
print("Zebre" < "arbre")
print("10" < "9")
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string a = "chat", b = "chien", c = "chaton", d = "Zebre", e = "arbre";
    cout << (a < b) << " " << (a < c) << " " << (d < e) << " " << (string("10") < string("9")) << "\n";
    return 0;
}
```

Python affiche `True` quatre fois (le C++ affiche `1 1 1 1`). Les deux premiers résultats sont ceux du dictionnaire : `a` vient avant `i`, et « chat » est le début de « chaton ». Les deux derniers surprennent. Toutes les majuscules passent **avant** toutes les minuscules, donc « Zebre » est plus petit que « arbre ». Et la chaîne `"10"` est plus petite que `"9"`, car le caractère `1` vient avant le caractère `9` : comparer des nombres écrits sous forme de chaînes ne donne pas l'ordre des nombres.

## Les codes des caractères : ord et chr

Ces surprises s'expliquent. Dans l'ordinateur, chaque caractère est représenté par un nombre, son **code**. Les codes des caractères usuels suivent la table **ASCII** : `A` vaut 65, `B` 66, …, `Z` 90 ; `a` vaut 97, …, `z` 122 ; le chiffre `0` vaut 48, …, `9` 57 ; l'espace vaut 32. Comparer deux caractères, c'est comparer leurs codes. Il suffit de retenir que les lettres minuscules ont des codes consécutifs, de même que les majuscules et les chiffres.

En Python, `ord(c)` donne le code du caractère `c`, et `chr(n)` le caractère de code `n`. En C++, un `char` est déjà un petit entier : on calcule directement avec lui, et `(char)` reconvertit un nombre en caractère.

```python
c = "d"
print(ord(c), ord(c) - ord("a"))
print(chr(ord(c) + 1))
print(ord("7") - ord("0"))
```

```cpp
#include <iostream>
using namespace std;

int main() {
    char c = 'd';
    cout << (int) c << " " << c - 'a' << "\n";
    cout << (char) (c + 1) << "\n";
    cout << '7' - '0' << "\n";
    return 0;
}
```

Le programme affiche `100 3`, puis `e`, puis `7`. Trois calculs reviennent sans cesse :

- `ord(c) - ord("a")` (en C++, `c - 'a'`) donne le **rang** d'une lettre minuscule dans l'alphabet, de 0 pour `a` à 25 pour `z`. Ce rang peut servir d'indice dans un tableau de comptage de 26 cases ;
- `chr(ord("a") + k)` (en C++, `(char) ('a' + k)`) fait l'inverse : il donne la lettre de rang `k` ;
- `ord(c) - ord("0")` (en C++, `c - '0'`) donne la valeur d'un chiffre. En Python, `int(c)` donne le même résultat.

Pour tester qu'un caractère est une lettre minuscule, on vérifie que `"a" <= c <= "z"` (en C++, `c >= 'a' && c <= 'z'`), ce qui marche justement parce que les codes sont consécutifs.

## Des nombres trop grands : travailler chiffre par chiffre

Un nombre lu comme une chaîne peut être traité chiffre par chiffre, avec `ord(c) - ord("0")`. Pour retrouver sa valeur, on lit les chiffres de gauche à droite : ajouter un chiffre `d` à droite d'un nombre `x` donne `10 × x + d`.

```python
s = input()
valeur = 0
somme = 0
for c in s:
    d = ord(c) - ord("0")       # valeur du chiffre
    valeur = 10 * valeur + d    # on ajoute d à droite de valeur
    somme = somme + d
print(valeur, somme)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    long long valeur = 0;
    int somme = 0;
    for (char c : s) {
        int d = c - '0';            // valeur du chiffre
        valeur = 10 * valeur + d;   // on ajoute d à droite de valeur
        somme = somme + d;
    }
    cout << valeur << " " << somme << "\n";
    return 0;
}
```

Avec l'entrée `2026`, le programme affiche `2026 10` : `valeur` passe par 0, 2, 20, 202 puis 2026, et `somme` est la somme des chiffres.

Pourquoi ne pas simplement écrire `int(s)` ? Pour un nombre de taille raisonnable, c'est la bonne méthode. Mais certains exercices donnent des nombres de plusieurs milliers de chiffres. En C++, aucun type entier ne peut les contenir : un `long long` s'arrête vers 9,2 × 10¹⁸, soit 19 chiffres. En Python, les entiers n'ont pas de limite, mais `int()` refuse, par sécurité, de convertir une chaîne de plus de 4 300 chiffres : `ValueError: Exceeds the limit (4300 digits) for integer string conversion`. Il faut alors raisonner directement sur les chiffres. Par exemple, un nombre est divisible par 3 exactement quand la somme de ses chiffres l'est : la question de l'introduction se règle sans jamais calculer le nombre lui-même.

## Majuscules, minuscules et autres outils

Python fournit des **méthodes**, c'est-à-dire des opérations qu'on écrit après la chaîne et un point. `s.upper()` donne une copie de `s` en majuscules, `s.lower()` en minuscules ; les caractères qui ne sont pas des lettres ne changent pas. `c.isdigit()` dit si `c` est un chiffre, `c.isalpha()` si c'est une lettre. Enfin, `s.count("e")` compte les apparitions de `"e"` dans `s` : c'est le programme écrit plus haut, en une ligne.

En C++, les fonctions `toupper(c)`, `tolower(c)`, `isdigit(c)` et `isalpha(c)`, de `<cctype>`, travaillent sur un seul caractère. Pour mettre toute une chaîne en majuscules, on fait une boucle : `for (int i = 0; i < (int) s.size(); i++) s[i] = toupper(s[i]);`.

## Découper et recoller : split et join

On connaît déjà `split()`, qui découpe une ligne en mots. Le résultat est une **liste de chaînes**, qu'on peut ranger dans une variable, indexer et parcourir comme tout tableau. En C++, un tableau de chaînes s'écrit `vector<string>`. Avec un argument, `split` coupe à un autre séparateur : `"12:30:05".split(":")` donne `["12", "30", "05"]`.

L'opération inverse est `join`. On l'écrit après la chaîne qui sert de **séparateur** : `", ".join(mots)` colle les chaînes de la liste `mots` en les séparant par une virgule et une espace. Les éléments doivent être des chaînes ; pour des nombres, on les convertit d'abord avec `str`, qui fait l'inverse de `int` : `str(42)` vaut `"42"`.

```python
mots = input().split()
print(len(mots))
print("-".join(mots))
print(str(len(mots)) + " mots")
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    string resultat = "";
    for (int i = 0; i < n; i++) {
        string mot;
        cin >> mot;
        if (i > 0) {
            resultat += "-";
        }
        resultat += mot;
    }
    cout << n << "\n" << resultat << "\n";
    cout << to_string(n) + " mots" << "\n";
    return 0;
}
```

Avec l'entrée `le petit chat`, le programme Python affiche `3`, puis `le-petit-chat`, puis `3 mots`. Le C++ n'a ni `split` ni `join` : on lit les mots un par un avec `cin >>`, qui s'arrête à chaque espace. C'est pourquoi le programme C++ lit d'abord leur nombre (ici, l'entrée serait `3 le petit chat`). On recolle à la main avec `+=`, en ajoutant le séparateur avant chaque mot sauf le premier. `to_string(n)` convertit un nombre en chaîne, et `stoi(s)` une chaîne en entier. Pour lire une ligne entière, espaces compris, on utilise `getline(cin, s)`.

## Erreurs fréquentes

**Sortir de la chaîne.** `s[len(s)]` provoque `IndexError: string index out of range`. Le dernier caractère a l'indice `len(s) - 1`. En C++, comme pour les `vector`, il n'y a aucun message, seulement un résultat faux.

**Modifier une chaîne en Python.** `s[i] = "x"` provoque `TypeError: 'str' object does not support item assignment`. On construit une nouvelle chaîne, ou on passe par une liste de caractères : `t = list(s)`, on modifie `t`, puis `s = "".join(t)`.

**Mélanger chaînes et nombres.** `"total : " + 5` provoque `TypeError: can only concatenate str (not "int") to str`. On écrit `"total : " + str(5)`, ou on utilise une f-chaîne. Dans l'autre sens, `"7" + "5"` vaut `"75"` : il faut `int` pour additionner.

**Confondre apostrophes et guillemets en C++.** `if (c == "a")` avec un `char c` ne compile pas : le compilateur signale `ISO C++ forbids comparison between pointer and integer`. Un caractère s'écrit `'a'`.

**Comparer des nombres sous forme de chaînes.** `"10" < "9"` est vrai. Pour comparer des valeurs, on les convertit en entiers, ou, pour de très grands nombres, on compare d'abord les longueurs.

**Mélanger `cin >>` et `getline` en C++.** Après `cin >> n`, le retour à la ligne reste à lire : un `getline` juste après lit une ligne vide. On ajoute un `getline` supplémentaire pour consommer ce reste de ligne, ou on lit tout avec `cin >>`.

## Un exemple complet

**Énoncé.** On lit `N`, puis `N` mots en minuscules sur une ligne. Afficher, en majuscules et séparés par des virgules, les mots qui commencent et finissent par la même lettre, dans l'ordre de l'entrée. S'il n'y en a aucun, afficher `AUCUN`.

**Idée.** Pour chaque mot, on compare son premier caractère `m[0]` et son dernier `m[len(m) - 1]`. Un mot d'une seule lettre convient, puisque cette lettre est à la fois la première et la dernière. Les mots retenus, convertis en majuscules, sont ajoutés à une liste, qu'on recolle à la fin avec `",".join`. En C++, on construit directement la chaîne résultat, en plaçant une virgule avant chaque mot sauf le premier.

**Programme.**

```python
n = int(input())
retenus = []
for m in input().split():
    if m[0] == m[len(m) - 1]:
        retenus.append(m.upper())
if len(retenus) == 0:
    print("AUCUN")
else:
    print(",".join(retenus))
```

```cpp
#include <cctype>
#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;
    string resultat = "";
    int nb = 0;
    for (int i = 0; i < n; i++) {
        string m;
        cin >> m;
        if (m[0] == m[m.size() - 1]) {
            for (int j = 0; j < (int) m.size(); j++) {
                m[j] = toupper(m[j]);
            }
            if (nb > 0) {
                resultat += ",";
            }
            resultat += m;
            nb = nb + 1;
        }
    }
    if (nb == 0) {
        cout << "AUCUN\n";
    } else {
        cout << resultat << "\n";
    }
    return 0;
}
```

**Vérification à la main.** Avec `5` puis `rotor chat elle a pomme`, le premier mot commence et finit par `r` : il est retenu. « chat » commence par `c` et finit par `t` : il est ignoré. « elle » est retenu, « a » aussi (une seule lettre), et « pomme » est ignoré (`p` et `e`). Le programme affiche `ROTOR,ELLE,A`. Avec `2` puis `bon jour`, aucun mot ne convient et le programme affiche `AUCUN`.

## À retenir

- Une chaîne se lit comme un tableau : `s[i]` pour i de 0 à `len(s) - 1` (`s.size()` en C++), parcours par `for c in s` ou par indice.
- En Python, une chaîne est immuable : on en construit une nouvelle avec `+`, à partir de `""`. En C++, une `string` se modifie, et `+=` ajoute à la fin. Un `char` s'écrit entre apostrophes.
- Les chaînes se comparent dans l'ordre lexicographique, qui suit les codes des caractères : majuscules avant minuscules, et `"10" < "9"`.
- `ord` et `chr` passent d'un caractère à son code : `ord(c) - ord("a")` donne le rang d'une lettre, `ord(c) - ord("0")` la valeur d'un chiffre. En C++, on calcule directement sur les `char`.
- Une tranche `s[a:b]` (en C++, `s.substr(a, b - a)`) copie les caractères d'indices `a` à `b − 1`. Un nombre trop grand pour `int()` (plus de 4 300 chiffres) ou pour un `long long` se traite chiffre par chiffre : `x` devient `10 × x + d`.
- `upper`, `lower`, `split` et `join` (en C++ : `toupper`, `tolower`, lecture mot à mot et `+=`) transforment, découpent et recollent les chaînes ; `str` et `int` convertissent entre nombres et chaînes.
