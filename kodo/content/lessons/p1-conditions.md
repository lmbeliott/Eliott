Jusqu'ici, un programme exécutait toutes ses instructions, toujours dans le même ordre. Il ne pouvait pas réagir aux données : il calculait une somme, mais il ne pouvait pas dire si cette somme était positive, ni choisir entre deux réponses.

Ce chapitre apprend à un programme à **décider**. Un exemple : un programme lit la température du jour et affiche `GEL` si elle est en dessous de zéro, `OK` sinon. Selon la valeur lue, ce n'est pas la même instruction d'affichage qui est exécutée. Cette idée, faire ou ne pas faire quelque chose selon les données, est au cœur de presque tous les algorithmes.

## Comparer deux valeurs

Une **comparaison** pose une question sur deux valeurs, à laquelle la réponse est vraie ou fausse. Il existe six **opérateurs de comparaison**, les mêmes en Python et en C++ :

| Opérateur | Signification | Exemple vrai |
| --- | --- | --- |
| `<` | strictement inférieur | `3 < 5` |
| `>` | strictement supérieur | `5 > 3` |
| `<=` | inférieur ou égal | `4 <= 4` |
| `>=` | supérieur ou égal | `7 >= 2` |
| `==` | égal | `6 == 6` |
| `!=` | différent | `6 != 7` |

On remarque que le test d'égalité s'écrit avec **deux** signes égal. Un seul `=` sert à l'affectation, c'est-à-dire à ranger une valeur dans une variable. C'est la source d'une erreur très fréquente, présentée plus bas.

Les comparaisons s'appliquent à des expressions quelconques : `a + b > 10` compare la somme `a + b` à 10, et `n % 2 == 0` teste si le reste de `n` par 2 est nul, c'est-à-dire si `n` est pair. On peut aussi comparer deux mots : `mot == "oui"` est vrai si la variable `mot` contient exactement le texte `oui`.

## L'instruction `if`

L'instruction `if` (« si » en anglais) exécute un groupe d'instructions **seulement si** une condition est vraie. La **condition** est l'expression placée après le `if` ; le groupe d'instructions qu'elle contrôle s'appelle un **bloc**.

```python
t = int(input())
if t < 0:
    print("GEL")
print("FIN")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int t;
    cin >> t;
    if (t < 0) {
        cout << "GEL\n";
    }
    cout << "FIN\n";
    return 0;
}
```

Avec l'entrée `-3`, la condition `t < 0` est vraie : le programme affiche `GEL` puis `FIN`. Avec l'entrée `12`, la condition est fausse : le bloc est sauté, et le programme affiche seulement `FIN`. La dernière instruction ne fait pas partie du bloc, elle est donc toujours exécutée.

En Python, la ligne du `if` se termine par deux-points `:`, et le bloc est formé des lignes **indentées** qui suivent, c'est-à-dire décalées vers la droite (on utilise 4 espaces). Le bloc s'arrête à la première ligne qui revient au niveau du `if`. En C++, la condition est entre parenthèses et le bloc entre accolades `{ }` ; l'indentation n'y est qu'une aide à la lecture, mais on la respecte toujours.

## `else` : sinon

Souvent, on veut faire une chose si la condition est vraie, et une autre si elle est fausse. On ajoute alors un bloc `else` (« sinon »), qui n'a pas de condition : il est exécuté exactement quand la condition du `if` est fausse.

```python
n = int(input())
if n % 2 == 0:
    print("PAIR")
else:
    print("IMPAIR")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n % 2 == 0) {
        cout << "PAIR\n";
    } else {
        cout << "IMPAIR\n";
    }
    return 0;
}
```

Avec `14`, le reste de la division par 2 est 0 : le programme affiche `PAIR`. Avec `7`, le reste est 1, la condition est fausse, et le programme affiche `IMPAIR`. Dans tous les cas, **un seul** des deux blocs est exécuté, jamais les deux, jamais aucun.

Ce test fonctionne aussi pour les nombres négatifs, en Python comme en C++ : `-6 % 2` vaut 0 dans les deux langages. En revanche, `-7 % 2` vaut `1` en Python et `-1` en C++. C'est pourquoi on teste `n % 2 == 0` (pair) plutôt que `n % 2 == 1` (impair), qui serait faux en C++ pour un nombre négatif. Pour tester qu'un nombre est impair, on écrit `n % 2 != 0`, qui est juste dans les deux langages.

## `elif` : plusieurs cas

Quand il y a plus de deux cas, on les enchaîne avec `elif` en Python (contraction de *else if*, « sinon, si ») et `else if` en C++. Les conditions sont testées **dans l'ordre**, de haut en bas. Dès qu'une condition est vraie, son bloc est exécuté et tous les cas suivants sont ignorés. Le `else` final, facultatif, traite tout ce qui reste.

```python
n = int(input())
if n > 0:
    print("POSITIF")
elif n < 0:
    print("NEGATIF")
else:
    print("NUL")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    if (n > 0) {
        cout << "POSITIF\n";
    } else if (n < 0) {
        cout << "NEGATIF\n";
    } else {
        cout << "NUL\n";
    }
    return 0;
}
```

Avec `5`, la première condition est vraie : le programme affiche `POSITIF` et ne regarde pas la suite. Avec `-2`, la première est fausse, la deuxième vraie : il affiche `NEGATIF`. Avec `0`, les deux sont fausses : c'est le `else` qui s'exécute.

Le fait que les conditions soient testées dans l'ordre est très utile : quand on arrive à un `elif`, on sait que toutes les conditions précédentes étaient fausses. Dans l'exemple suivant, qui donne une mention à une note sur 20, la deuxième condition n'a pas besoin de vérifier que la note est inférieure à 16 : si elle était supérieure ou égale à 16, le premier cas l'aurait déjà traitée.

```python
note = int(input())
if note >= 16:
    print("TRES BIEN")
elif note >= 14:
    print("BIEN")
elif note >= 10:
    print("PASSABLE")
else:
    print("INSUFFISANT")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int note;
    cin >> note;
    if (note >= 16) {
        cout << "TRES BIEN\n";
    } else if (note >= 14) {
        cout << "BIEN\n";
    } else if (note >= 10) {
        cout << "PASSABLE\n";
    } else {
        cout << "INSUFFISANT\n";
    }
    return 0;
}
```

Avec `15`, la première condition est fausse et la deuxième vraie : le programme affiche `BIEN`. Avec `9`, aucune des trois conditions n'est vraie : il affiche `INSUFFISANT`.

## Conditions imbriquées

Un bloc peut contenir n'importe quelles instructions, y compris un autre `if`. On parle de conditions **imbriquées**. Le `if` intérieur n'est examiné que si la condition extérieure est vraie.

```python
age = int(input())
taille = int(input())
if age >= 12:
    if taille >= 140:
        print("ACCES")
    else:
        print("TROP PETIT")
else:
    print("TROP JEUNE")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int age, taille;
    cin >> age >> taille;
    if (age >= 12) {
        if (taille >= 140) {
            cout << "ACCES\n";
        } else {
            cout << "TROP PETIT\n";
        }
    } else {
        cout << "TROP JEUNE\n";
    }
    return 0;
}
```

Avec `14` puis `150`, les deux conditions sont vraies : `ACCES`. Avec `14` puis `130`, la première est vraie mais pas la seconde : `TROP PETIT`. Avec `10` puis `150`, la première condition est fausse : le `if` intérieur n'est même pas examiné, et le programme affiche `TROP JEUNE`, quelle que soit la taille. La taille est tout de même lue, puisque sa lecture est placée avant le `if`. En Python, c'est l'indentation qui indique à quel `if` appartient chaque `else` ; il faut donc la soigner.

## Décider dans une boucle : maximum courant et compteur

En plaçant un `if` dans une boucle, on peut prendre une décision pour chaque valeur lue. L'exemple le plus important est la recherche du **maximum** d'une suite de valeurs, lues une par une. On garde dans une variable `meilleur` la plus grande valeur vue **jusqu'ici** : c'est le **maximum courant**. À chaque nouvelle valeur `x`, une seule question se pose : `x` est-elle plus grande que `meilleur` ? Si oui, `x` devient le nouveau maximum courant.

Reste à choisir la valeur de départ de `meilleur`. Le plus sûr est de partir de la première valeur lue : elle est, à elle seule, le maximum de ce qu'on a vu.

```python
n = int(input())
meilleur = int(input())
for i in range(n - 1):
    x = int(input())
    if x > meilleur:
        meilleur = x
print(meilleur)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n, meilleur;
    cin >> n >> meilleur;
    for (int i = 0; i < n - 1; i++) {
        int x;
        cin >> x;
        if (x > meilleur) {
            meilleur = x;
        }
    }
    cout << meilleur << "\n";
    return 0;
}
```

Avec `N = 4` et les valeurs `-5`, `-2`, `-9`, `-3` : `meilleur` vaut d'abord `-5`. Puis `-2 > -5`, donc `meilleur` devient `-2`. Ensuite `-9` et `-3` ne sont pas plus grands que `-2`, rien ne change. Le programme affiche `-2`. Le minimum se trouve de la même façon, en remplaçant `>` par `<`.

Le même schéma permet de **compter**. Un **compteur** est une variable qui part de 0, et qu'un `if` placé dans la boucle augmente de 1 chaque fois que la valeur lue vérifie la condition voulue. Le programme suivant compte les valeurs paires parmi `N` entiers écrits sur une même ligne.

```python
n = int(input())
pairs = 0
for morceau in input().split():
    x = int(morceau)
    if x % 2 == 0:
        pairs = pairs + 1
print(pairs)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int pairs = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x % 2 == 0) {
            pairs = pairs + 1;
        }
    }
    cout << pairs << "\n";
    return 0;
}
```

Avec `N = 5` et la ligne `3 8 -4 7 0`, le compteur augmente pour `8`, `-4` et `0` : le programme affiche `3`. Ce test reste juste avec des nombres négatifs, en Python comme en C++, alors qu'un calcul qui additionnerait les restes `x % 2` serait faux en C++ dès qu'une valeur est négative et impaire (son reste vaut `-1`).

## Erreurs fréquentes

**Confondre `=` et `==`.** En Python, `if x = 0:` est refusé avant même l'exécution : `SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?`. La correction est `if x == 0:`. En C++, c'est plus dangereux : `if (x = 0)` est accepté par le compilateur, au mieux avec un simple avertissement. Cette instruction range 0 dans `x`, puis considère la condition comme fausse. Le programme tourne mais donne un résultat faux, et `x` a perdu sa valeur. Il faut écrire `if (x == 0)`.

**Oublier les deux-points ou l'indentation.** `if x > 0` sans `:` donne `SyntaxError: expected ':'`. Un bloc non indenté donne `IndentationError: expected an indented block after 'if' statement on line …`, avec le numéro de la ligne du `if`. En C++, l'oubli des accolades est silencieux : sans elles, seule la première instruction après le `if` est contrôlée par la condition, les suivantes sont toujours exécutées. On met donc toujours les accolades.

**Des cas qui se recouvrent, dans le mauvais ordre.** Avec `elif`, seul le premier cas vrai compte. Dans le programme ci-dessous, une note de 17 vérifie la première condition et affiche `PASSABLE` : le cas `note >= 16` n'est jamais atteint.

```python
note = int(input())
if note >= 10:
    print("PASSABLE")
elif note >= 16:
    print("TRES BIEN")   # jamais exécuté
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int note;
    cin >> note;
    if (note >= 10) {
        cout << "PASSABLE\n";
    } else if (note >= 16) {
        cout << "TRES BIEN\n";   // jamais exécuté
    }
    return 0;
}
```

La correction consiste à tester le cas le plus exigeant en premier, comme dans l'exemple des mentions plus haut.

**Écrire des `if` séparés au lieu d'un `elif`.** Des `if` qui se suivent sont tous examinés, indépendamment les uns des autres. Si on remplace les `elif` du programme des mentions par des `if`, une note de 17 vérifie trois conditions et affiche trois lignes. Quand les cas s'excluent, on utilise `elif` (ou `else if`).

**Initialiser le maximum à 0.** Si on écrit `meilleur = 0` avant la boucle et que toutes les valeurs sont négatives, aucune n'est plus grande que 0 : le programme affiche `0`, une valeur qui n'est même pas dans l'entrée. On part de la première valeur lue.

**Oublier un cas.** Pour comparer deux nombres `a` et `b`, il y a trois possibilités : `a < b`, `a > b` et `a == b`. Un programme qui ne prévoit que les deux premières se trompe sur les égalités. Il faut toujours se demander ce qui se passe quand deux valeurs sont égales.

## Un exemple complet

**Énoncé.** On relève la température pendant `N` jours (une valeur par ligne). Afficher la plus forte hausse d'un jour au lendemain, c'est-à-dire la plus grande valeur de « température du jour moins température de la veille ». Si la température n'a jamais augmenté, afficher `0`.

**Idée.** On combine deux techniques. Pour calculer une hausse, il faut connaître la température de la veille : on la garde dans une variable `veille`, mise à jour à chaque tour. Pour chaque nouveau jour, la hausse vaut `t - veille`. On garde la plus grande hausse dans une variable `record`, comme un maximum courant. Puisque la réponse doit être `0` quand il n'y a aucune hausse, on peut cette fois partir de `record = 0` : une baisse, négative, ne remplacera jamais 0.

**Programme.**

```python
n = int(input())
veille = int(input())
record = 0
for i in range(n - 1):
    t = int(input())
    if t - veille > record:
        record = t - veille
    veille = t
print(record)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n, veille;
    cin >> n >> veille;
    int record = 0;
    for (int i = 0; i < n - 1; i++) {
        int t;
        cin >> t;
        if (t - veille > record) {
            record = t - veille;
        }
        veille = t;
    }
    cout << record << "\n";
    return 0;
}
```

**Vérification à la main.** Avec `N = 5` et les températures `3`, `7`, `5`, `11`, `10`. Au départ, `veille = 3` et `record = 0`. Jour 2 : hausse 7 − 3 = 4, plus grande que 0, donc `record = 4` ; `veille = 7`. Jour 3 : hausse 5 − 7 = −2, rien ne change ; `veille = 5`. Jour 4 : hausse 11 − 5 = 6 > 4, donc `record = 6` ; `veille = 11`. Jour 5 : hausse −1, rien ne change. Le programme affiche `6`, la hausse du jour 3 au jour 4.

Un cas limite : avec des températures toujours décroissantes, comme `9`, `4`, `1`, aucune hausse ne dépasse 0 et le programme affiche bien `0`. Il faut aussi remarquer que `veille = t` est placée **après** le `if`, en dehors de son bloc : la veille doit être mise à jour à chaque tour, qu'il y ait eu un record ou non.

## À retenir

- Une comparaison (`<`, `>`, `<=`, `>=`, `==`, `!=`) est vraie ou fausse. L'égalité s'écrit `==` ; un seul `=` est une affectation.
- `if` exécute un bloc seulement si sa condition est vraie ; `else` traite le cas contraire. Un seul des deux blocs est exécuté.
- Avec `elif` (`else if` en C++), les cas sont testés dans l'ordre et seul le premier cas vrai est exécuté : on place les cas les plus exigeants en premier.
- Un `if` dans une boucle permet de traiter chaque valeur lue : maximum courant, minimum, compteur qui part de 0 et augmente de 1 quand la condition est vraie.
- Un maximum courant part de la première valeur lue, pas de 0.
- Il faut toujours penser aux égalités et aux cas limites.
