Jusqu'ici, les programmes faisaient toujours la même chose : ils affichaient les mêmes nombres à chaque exécution. Un programme utile travaille sur des **données** qu'il ne connaît pas à l'avance. Un programme qui calcule le prix total d'un panier doit pouvoir le faire pour n'importe quel panier, pas seulement pour celui que l'on avait en tête en l'écrivant.

Ce chapitre explique comment un programme **lit** des données. Voici le premier exemple : un programme qui lit deux nombres et affiche leur somme. Si on lui donne `3` et `4`, il affiche `7` ; si on lui donne `100` et `-1`, il affiche `99`. Le programme ne change pas, seules les données changent.

## L'entrée et la sortie

Un programme reçoit du texte et produit du texte. Le texte qu'il reçoit s'appelle l'**entrée** ; le texte qu'il affiche s'appelle la **sortie**. Sur ce site, chaque exercice est testé de la même façon : on donne une entrée au programme, puis on compare sa sortie à la sortie attendue.

L'entrée est découpée en **lignes**. Un énoncé décrit toujours son format avec précision, par exemple : « La première ligne contient un entier `N`. La deuxième ligne contient `N` entiers séparés par des espaces. » Le programme doit lire exactement ce qui est annoncé, dans cet ordre, ni plus ni moins.

## Lire une ligne avec `input()`

En Python, l'instruction `input()` lit **une ligne** de l'entrée. Elle donne le texte de cette ligne, sans le retour à la ligne final. On range ce texte dans une variable, comme n'importe quelle valeur.

```python
mot = input()
print(mot)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string mot;
    cin >> mot;
    cout << mot << "\n";
    return 0;
}
```

Si l'entrée contient la ligne `bonjour`, ce programme affiche `bonjour`. Le premier `input()` consomme la première ligne ; un deuxième `input()` lirait la ligne suivante, et ainsi de suite. On ne revient jamais en arrière : une ligne lue est consommée.

En C++, on lit avec `cin >>`, suivi de la variable qui reçoit la valeur. Pour lire un mot, la variable est de type `string` : il faut inclure `<string>` en haut du programme. Attention, `cin >>` ne lit pas une ligne entière mais un seul **mot** : il saute les espaces et les retours à la ligne, puis lit des caractères jusqu'au prochain espace ou au prochain retour à la ligne. Dans les exercices de ce niveau, les mots à lire ne contiennent jamais d'espace, donc les deux façons de faire donnent le même résultat.

## Le texte n'est pas un nombre : `int()`

Le texte donné par `input()` est une **chaîne de caractères** (en abrégé, une chaîne) : une suite de caractères, même s'ils ressemblent à des chiffres. La chaîne `"42"` est formée du caractère `4` suivi du caractère `2` ; ce n'est pas le nombre 42. On ne peut pas calculer avec elle.

Pour obtenir un nombre, on **convertit** la chaîne avec `int()`. Le mot vient de l'anglais *integer*, qui veut dire « entier ». `int("42")` vaut le nombre `42`. On écrit le plus souvent les deux opérations ensemble : `int(input())` lit une ligne, puis la convertit en entier.

```python
a = int(input())
b = int(input())
print(a + b)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << "\n";
    return 0;
}
```

Avec l'entrée suivante, sur deux lignes :

```text
3
4
```

le programme affiche `7`. Python lit la première ligne, la convertit, et range `3` dans `a` ; il fait de même avec la deuxième ligne pour `b` ; puis il affiche la somme.

En C++, la conversion est automatique : comme `a` est déclarée de type `int`, l'instruction `cin >> a` lit des chiffres et fabrique directement un entier. On peut enchaîner plusieurs lectures dans la même instruction : `cin >> a >> b` lit d'abord `a`, puis `b`. Quand les nombres peuvent dépasser deux milliards environ, on utilise le type `long long` au lieu de `int`.

## Plusieurs valeurs sur une ligne : `split()`

Souvent, plusieurs valeurs sont écrites sur la même ligne, séparées par des espaces, par exemple `3 4`. Un seul `input()` donne alors la chaîne `"3 4"`, qu'on ne peut pas convertir d'un coup : `int("3 4")` provoque une erreur, car `"3 4"` n'est pas l'écriture d'un entier.

La méthode `split()` découpe une chaîne en **morceaux**, en coupant à chaque espace. `"3 4".split()` donne les deux morceaux `"3"` et `"4"`. Plusieurs espaces à la suite comptent comme une seule coupure, et les espaces au début ou à la fin de la ligne sont ignorés : `"  3   4 ".split()` donne aussi `"3"` et `"4"`. Quand on connaît le nombre de morceaux, on les range dans autant de variables, séparées par des virgules :

```python
a, b = input().split()
a = int(a)
b = int(b)
print(a * b)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a * b << "\n";
    return 0;
}
```

Avec l'entrée `3 4`, ce programme affiche `12`. La première ligne range `"3"` dans `a` et `"4"` dans `b` ; les deux lignes suivantes les convertissent en entiers.

Pour éviter de convertir chaque variable à la main, Python offre un raccourci : `map(int, ...)` applique `int` à chaque morceau. La ligne suivante lit une ligne, la découpe et convertit chaque morceau. C'est l'écriture qu'on utilisera le plus souvent.

```python
a, b, c = map(int, input().split())
print(a + b + c)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << a + b + c << "\n";
    return 0;
}
```

En C++, rien ne change : `cin >>` saute les espaces comme les retours à la ligne. Que les trois nombres soient sur une ligne ou sur trois lignes, `cin >> a >> b >> c` les lit de la même manière. En Python, au contraire, il faut savoir précisément ce qui se trouve sur chaque ligne : un `input()` par ligne, et un `split()` dès qu'une ligne contient plusieurs valeurs.

Une ligne peut aussi mélanger un mot et un nombre. Dans ce cas, on ne peut pas utiliser `map(int, ...)`, car le mot n'est pas un entier : on découpe la ligne, puis on convertit seulement le morceau qui doit être un nombre. En C++, il suffit de déclarer une variable de chaque type.

```python
mot, n = input().split()
n = int(n)
for i in range(n):
    print(mot)
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string mot;
    int n;
    cin >> mot >> n;
    for (int i = 0; i < n; i++) {
        cout << mot << "\n";
    }
    return 0;
}
```

Avec l'entrée `ha 3`, ce programme affiche trois lignes `ha`. Si on oubliait `n = int(n)`, `range(n)` recevrait la chaîne `"3"` et Python s'arrêterait avec `TypeError: 'str' object cannot be interpreted as an integer`.

## Lire N valeurs

Dans la plupart des exercices, la première ligne annonce combien de valeurs vont suivre. On lit d'abord ce nombre `N`, puis on utilise une boucle `for` qui fait `N` tours et lit une valeur à chaque tour. Les valeurs sont traitées **au fur et à mesure** de leur lecture : à chaque tour, on lit une valeur, on l'utilise, puis on passe à la suivante. On n'a pas besoin de les garder toutes.

Premier cas : une valeur par ligne. Chaque tour de boucle fait un `input()`.

```python
n = int(input())
total = 0
for i in range(n):
    x = int(input())
    total = total + x
print(total)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int total = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        total = total + x;
    }
    cout << total << "\n";
    return 0;
}
```

Avec l'entrée ci-dessous, le programme lit `n = 3`, puis fait trois tours : `total` vaut successivement `5`, `3` puis `13`. Il affiche `13`.

```text
3
5
-2
10
```

Deuxième cas : les `N` valeurs sont toutes sur une même ligne, par exemple `5 -2 10`. En Python, on ne peut plus faire un `input()` par valeur, puisqu'il n'y a qu'une ligne. On lit cette ligne une seule fois, on la découpe avec `split()`, et on **parcourt** ses morceaux avec une boucle `for`. La boucle `for morceau in input().split():` fait un tour par morceau : au premier tour, la variable `morceau` vaut `"5"`, au deuxième `"-2"`, au troisième `"10"`. Il reste à convertir chaque morceau avec `int()`.

```python
n = int(input())
total = 0
for morceau in input().split():
    x = int(morceau)
    total = total + x
print(total)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int total = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        total = total + x;
    }
    cout << total << "\n";
    return 0;
}
```

Avec l'entrée `3` puis `5 -2 10`, ce programme affiche aussi `13`. Le programme C++ est exactement le même que dans le premier cas : c'est un des avantages de `cin`. En Python, il faut faire attention : la ligne `for morceau in input().split():` lit la ligne **une seule fois**, avant le premier tour, et non à chaque tour.

On remarque que le programme Python n'utilise pas la valeur de `n` : le nombre de tours est donné par le nombre de morceaux. Il faut quand même lire la première ligne, sinon le `input()` suivant lirait `3` au lieu de la ligne des valeurs.

Troisième cas : chacune des `N` lignes contient plusieurs valeurs. On combine les deux techniques : une boucle de `N` tours, et à chaque tour un `input()` découpé avec `split()`. Le programme suivant lit `N` lignes de deux entiers et affiche, pour chaque ligne, la somme des deux.

```python
n = int(input())
for i in range(n):
    a, b = map(int, input().split())
    print(a + b)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        cout << a + b << "\n";
    }
    return 0;
}
```

Avec l'entrée ci-dessous, le programme affiche `3`, `6` et `0`, sur trois lignes.

```text
3
1 2
10 -4
0 0
```

Le programme affiche un résultat avant d'avoir lu toute l'entrée. Ce n'est pas un problème : l'entrée et la sortie sont deux textes séparés. Seule compte la sortie complète, comparée à la sortie attendue une fois le programme terminé.

## Se souvenir de la valeur précédente

Traiter les valeurs au fur et à mesure a une conséquence : quand on lit une valeur, les précédentes sont perdues. Si le calcul a besoin de la valeur lue juste avant, il faut la garder dans une variable, souvent appelée `precedent`. On lit la première valeur **avant** la boucle, puis la boucle lit les `N − 1` valeurs restantes. À la fin de chaque tour, la valeur qu'on vient de lire devient la précédente du tour suivant.

Le programme suivant lit `N` entiers, un par ligne, et affiche la différence entre chaque valeur et la précédente.

```python
n = int(input())
precedent = int(input())
for i in range(n - 1):
    x = int(input())
    print(x - precedent)
    precedent = x
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n, precedent;
    cin >> n >> precedent;
    for (int i = 0; i < n - 1; i++) {
        int x;
        cin >> x;
        cout << x - precedent << "\n";
        precedent = x;
    }
    return 0;
}
```

Avec `N = 4` et les valeurs `10`, `13`, `13`, `7`, le programme affiche `3`, `0` puis `-6`. Il y a `N − 1` différences pour `N` valeurs. L'ordre des deux dernières instructions du corps compte : si on écrivait `precedent = x` avant l'affichage, on calculerait `x - x`, et le programme n'afficherait que des `0`.

## Erreurs fréquentes

**Oublier `int()`.** Sans conversion, Python garde des chaînes. Le symbole `+` entre deux chaînes les colle bout à bout : c'est la **concaténation**. Le programme suivant, avec l'entrée `3` puis `4`, affiche `34` au lieu de `7`.

```python
a = input()
b = input()
print(a + b)   # affiche 34
```

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string a, b;
    cin >> a >> b;
    cout << a + b << "\n";   // affiche 34 : a et b sont des textes
    return 0;
}
```

Si on ajoute une chaîne et un nombre, par exemple `input() + 1`, Python s'arrête avec le message `TypeError: can only concatenate str (not "int") to str`. La correction est la même dans les deux cas : écrire `int(input())`. En C++, l'erreur correspondante est de déclarer une variable `string` là où on attend un nombre.

**Convertir une ligne qui contient plusieurs valeurs.** Si la ligne est `3 4` et qu'on écrit `a = int(input())`, Python affiche `ValueError: invalid literal for int() with base 10: '3 4'`. Le message cite le texte qu'il n'a pas su convertir : on y voit l'espace. La correction consiste à découper la ligne avec `split()`.

**Ne pas avoir le bon nombre de variables.** `a, b = map(int, input().split())` exige exactement deux morceaux. Avec trois nombres sur la ligne, on obtient `ValueError: too many values to unpack (expected 2)` ; avec un seul, `ValueError: not enough values to unpack (expected 2, got 1)`. Il faut relire le format de l'entrée dans l'énoncé.

**Lire trop de lignes.** Si on fait un `input()` de trop, il n'y a plus rien à lire et Python affiche `EOFError: EOF when reading a line` (*EOF* signifie « fin du fichier »). C'est souvent le signe qu'on lit les valeurs une par ligne alors qu'elles sont toutes sur une seule ligne, ou que la boucle fait un tour de trop. En C++, il n'y a pas de message : la lecture échoue en silence et la variable garde une valeur sans rapport avec l'entrée. Le résultat est faux, sans explication.

**Afficher un message d'invite.** On voit parfois `input("Entrez un nombre : ")`. Le texte entre parenthèses est **affiché** sur la sortie avant la lecture. Pour un humain devant son clavier, c'est pratique ; pour les tests, ce texte s'ajoute à la sortie, qui ne correspond plus à la sortie attendue. Dans les exercices, on écrit toujours `input()` sans rien entre les parenthèses, et on n'affiche que ce que demande l'énoncé.

## Un exemple complet

**Énoncé.** La première ligne contient un entier `N`. La deuxième ligne contient `N` entiers séparés par des espaces. Afficher, sur deux lignes, la somme de ces entiers, puis la somme de leurs carrés (le carré de `x` est `x × x`).

**Idée.** On ne garde pas les valeurs : on les traite au fur et à mesure. Il suffit de deux **accumulateurs**, c'est-à-dire deux variables qui partent de `0` et qu'on augmente à chaque valeur lue : `somme` reçoit `x`, et `carres` reçoit `x * x`. Les valeurs sont sur une seule ligne, donc en Python on parcourt les morceaux de cette ligne.

**Programme.**

```python
n = int(input())
somme = 0
carres = 0
for morceau in input().split():
    x = int(morceau)
    somme = somme + x
    carres = carres + x * x
print(somme)
print(carres)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int somme = 0;
    int carres = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        somme = somme + x;
        carres = carres + x * x;
    }
    cout << somme << "\n";
    cout << carres << "\n";
    return 0;
}
```

**Vérification à la main.** Prenons l'entrée `3` puis `2 -1 4`. Au départ, `somme = 0` et `carres = 0`. Premier tour : `x = 2`, donc `somme = 2` et `carres = 4`. Deuxième tour : `x = -1`, donc `somme = 1` et `carres = 5`, car le carré de `-1` est `1`. Troisième tour : `x = 4`, donc `somme = 5` et `carres = 21`. Le programme affiche `5` puis `21`. On vérifie directement : 2 − 1 + 4 = 5, et 4 + 1 + 16 = 21.

Il est utile de tester aussi un cas limite : avec `N = 1` et la seule valeur `0`, le programme affiche `0` et `0`, ce qui est juste.

## À retenir

- `input()` lit une ligne entière et donne une chaîne ; `int()` la convertit en entier. En C++, `cin >> x` lit directement une valeur du type de `x`.
- Plusieurs valeurs sur une ligne : `a, b = map(int, input().split())` en Python, `cin >> a >> b` en C++.
- Pour lire `N` valeurs, on lit `N`, puis une boucle lit et traite une valeur à chaque tour. En Python, un `input()` par tour si les valeurs sont une par ligne, `for morceau in input().split():` si elles sont toutes sur une ligne.
- Pour utiliser la valeur lue juste avant, on la garde dans une variable `precedent` : la première valeur est lue avant la boucle, et `precedent = x` termine chaque tour.
- On lit exactement ce que décrit l'énoncé, dans l'ordre : ni ligne en trop, ni ligne oubliée.
- On n'affiche que ce qui est demandé : pas de message dans `input()`.
