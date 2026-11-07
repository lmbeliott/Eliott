Jusqu'ici, les programmes affichaient des valeurs écrites à l'avance, éventuellement avec l'aide d'une boucle. Pour aller plus loin, un programme doit savoir **calculer** et **se souvenir** de résultats intermédiaires. Par exemple, pour trouver la somme des entiers de 1 à 1 000, il faut additionner les nombres un par un en gardant le total en mémoire. Ce chapitre présente les opérations sur les entiers, puis les **variables**, qui permettent de stocker une valeur, de la modifier et de la réutiliser.

```python
somme = 0
for i in range(1, 1001):
    somme = somme + i
print(somme)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int somme = 0;
    for (int i = 1; i <= 1000; i++) {
        somme = somme + i;
    }
    cout << somme << "\n";
    return 0;
}
```

Ce programme affiche `500500`. À la fin du chapitre, chacune de ses lignes sera claire.

## Calculer avec des entiers

On peut écrire un calcul directement là où une valeur est attendue, par exemple dans un affichage :

```python
print(7 + 5)
print(7 - 5)
print(7 * 5)
print(2 + 3 * 4)
print((2 + 3) * 4)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << 7 + 5 << "\n";
    cout << 7 - 5 << "\n";
    cout << 7 * 5 << "\n";
    cout << 2 + 3 * 4 << "\n";
    cout << (2 + 3) * 4 << "\n";
    return 0;
}
```

Ce programme affiche 12, 2, 35, 14 et 20. Un calcul comme `2 + 3 * 4` s'appelle une **expression** ; les symboles `+`, `-` et `*` (la multiplication) sont des **opérateurs**. L'ordinateur **évalue** l'expression, c'est-à-dire qu'il calcule sa valeur, puis l'utilise. Les règles de priorité sont celles des mathématiques : la multiplication passe avant l'addition, donc `2 + 3 * 4` vaut 2 + 12 = 14. Les parenthèses imposent un autre ordre : `(2 + 3) * 4` vaut 5 × 4 = 20.

Attention à ne pas confondre `print(7 + 5)`, qui affiche `12`, et `print("7 + 5")`, qui affiche le texte `7 + 5` tel quel : entre guillemets, rien n'est calculé.

Une expression peut contenir la variable de boucle. Par exemple, `print(i * i)` dans une boucle `for i in range(1, 6)` affiche les carrés 1, 4, 9, 16 et 25 : à chaque tour, l'expression est évaluée avec la valeur actuelle de `i`.

## Division entière et reste

Sur les entiers, la division se fait en deux morceaux. On l'écrit comme à l'école primaire : 17 divisé par 5 donne 3, et il reste 2, car 17 = 5 × 3 + 2. Le nombre 3 est le **quotient** de la **division entière**, le nombre 2 est le **reste**.

```python
print(17 // 5)
print(17 % 5)
print(20 % 5)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << 17 / 5 << "\n";
    cout << 17 % 5 << "\n";
    cout << 20 % 5 << "\n";
    return 0;
}
```

Ce programme affiche 3, 2 et 0. En Python, le quotient s'écrit `//` (deux barres) ; en C++, il s'écrit `/`, et le résultat est entier dès que les deux nombres sont des entiers. Dans les deux langages, le reste s'écrit `%` (on dit « modulo »). Le reste de la division par `b` est toujours compris entre 0 et b − 1, et il vaut 0 exactement quand le nombre est un multiple de `b`.

Ces deux opérations servent sans cesse :

- `n % 10` donne le dernier chiffre de `n`, et `n // 10` enlève ce dernier chiffre : avec n = 2026, on obtient 6 et 202 ;
- une durée de 135 minutes fait `135 // 60` = 2 heures et `135 % 60` = 15 minutes ;
- `n % 2` vaut 0 si `n` est pair et 1 s'il est impair.

En Python, l'opérateur `/` (une seule barre) existe aussi, mais il donne un nombre à virgule : `17 / 5` vaut `3.4`, et même `10 / 2` vaut `5.0`. Dans ce chapitre, on n'utilise que `//` en Python.

## Les variables

Une **variable** est une case de la mémoire de l'ordinateur, désignée par un nom, qui contient une valeur. On range une valeur dans une variable avec le signe `=` : c'est une **affectation**.

```python
largeur = 7
hauteur = 4
print(largeur * hauteur)
print(largeur, hauteur)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int largeur = 7;
    int hauteur = 4;
    cout << largeur * hauteur << "\n";
    cout << largeur << " " << hauteur << "\n";
    return 0;
}
```

Ce programme affiche `28`, puis `7 4`. La ligne `largeur = 7` se lit « largeur reçoit 7 ». Ensuite, partout où le nom `largeur` apparaît dans une expression, il est remplacé par la valeur contenue dans la variable. On affiche le contenu d'une variable en écrivant son nom sans guillemets : `print(largeur)` affiche `7`, alors que `print("largeur")` affiche le mot `largeur`.

En C++, une variable doit être **déclarée** avant d'être utilisée : on écrit son **type** devant son nom, la première fois. Le type `int` désigne un entier. Ensuite, on utilise la variable sans répéter le type.

Un nom de variable est formé de lettres, de chiffres et du caractère `_`, sans espace, sans accent et sans commencer par un chiffre : `somme`, `nb_pieces`, `x2` conviennent. Les majuscules comptent : `Somme` et `somme` sont deux variables différentes. On choisit des noms qui décrivent le contenu ; cela rend le programme beaucoup plus facile à relire.

## Modifier une variable

Une variable peut changer de valeur au cours du programme : une nouvelle affectation remplace l'ancienne valeur, qui est perdue.

```python
x = 5
print(x)
x = 8
print(x)
x = x + 1
print(x)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 5;
    cout << x << "\n";
    x = 8;
    cout << x << "\n";
    x = x + 1;
    cout << x << "\n";
    return 0;
}
```

Ce programme affiche 5, 8 puis 9. La ligne `x = x + 1` n'est pas une équation (qui serait toujours fausse) : le signe `=` n'est pas une égalité, c'est un ordre. L'ordinateur exécute une affectation en deux temps :

1. il évalue l'expression à droite du `=`, avec les valeurs **actuelles** des variables : `x + 1` vaut 8 + 1 = 9 ;
2. il range le résultat dans la variable à gauche : `x` vaut maintenant 9.

Augmenter une variable de 1 s'appelle l'**incrémenter**. C'est si fréquent qu'il existe des écritures courtes : `x += 1` en Python et en C++, ou `x++` en C++. De même, `x -= 3` diminue `x` de 3 et `x *= 2` double `x`. On reconnaît la mise à jour `i++` ou `i += 10` des boucles `for` du C++ : la variable de boucle est une variable comme une autre.

Pour comprendre un programme qui modifie des variables, on fait une **trace d'exécution** : un tableau qui donne, après chaque instruction, la valeur de chaque variable. C'est l'outil le plus utile pour trouver une erreur.

## Accumuler dans une boucle

Revenons au programme d'introduction. La variable `somme` sert d'**accumulateur** : elle part de 0, et à chaque tour de boucle, on lui ajoute la valeur de `i`. Voici la trace pour une boucle plus courte, `for i in range(1, 5)` :

| moment | i | somme |
| --- | --- | --- |
| avant la boucle | – | 0 |
| après le tour 1 | 1 | 1 |
| après le tour 2 | 2 | 3 |
| après le tour 3 | 3 | 6 |
| après le tour 4 | 4 | 10 |

Après la boucle, `somme` vaut 10 = 1 + 2 + 3 + 4. Le schéma est toujours le même :

1. **initialiser** l'accumulateur avant la boucle, avec la valeur qui convient pour un total vide (0 pour une somme) ;
2. le mettre à jour dans le corps de la boucle ;
3. l'utiliser après la boucle.

Pour un produit, on initialise à 1 et non à 0, sinon le résultat resterait toujours 0 :

```python
produit = 1
for i in range(1, 6):
    produit = produit * i
print(produit)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int produit = 1;
    for (int i = 1; i <= 5; i++) {
        produit = produit * i;
    }
    cout << produit << "\n";
    return 0;
}
```

Ce programme affiche 120 = 1 × 2 × 3 × 4 × 5.

Une variable mise à jour à chaque tour n'est pas forcément un total. Elle peut suivre une quantité qui évolue : une population qui double, un compte qui reçoit des intérêts, une heure qui avance. Dans ce cas, on affiche souvent la valeur à chaque tour, et l'ordre des instructions dans le corps compte : afficher puis mettre à jour donne la valeur de départ en premier, mettre à jour puis afficher donne d'abord la valeur après un tour.

## Mettre à jour plusieurs variables

Quand deux variables doivent changer en même temps, il faut faire attention à l'ordre des affectations. Par exemple, pour **échanger** les valeurs de `a` et `b`, le code suivant est faux :

```python
a = 3
b = 9
a = b
b = a
print(a, b)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 3;
    int b = 9;
    a = b;
    b = a;
    cout << a << " " << b << "\n";
    return 0;
}
```

Il affiche `9 9` : après `a = b`, l'ancienne valeur de `a` est perdue, et `b = a` recopie 9. La solution consiste à sauvegarder l'ancienne valeur dans une **variable temporaire** :

```python
a = 3
b = 9
t = a
a = b
b = t
print(a, b)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 3;
    int b = 9;
    int t = a;
    a = b;
    b = t;
    cout << a << " " << b << "\n";
    return 0;
}
```

Ce programme affiche bien `9 3`. La même idée sert chaque fois qu'une nouvelle valeur se calcule à partir de plusieurs anciennes valeurs : on calcule d'abord tout ce qui dépend des anciennes valeurs, puis on fait les affectations.

## La taille des entiers en C++

En Python, un entier peut être aussi grand qu'on veut. En C++, une variable de type `int` ne peut contenir que des valeurs entre environ −2,1 × 10⁹ et 2,1 × 10⁹ (exactement 2 147 483 647 au maximum). Si un calcul dépasse cette limite, il se produit un **dépassement de capacité** : le résultat est faux, sans aucun message d'erreur. Par exemple, `int x = 100000; cout << x * x;` n'affiche pas 10 000 000 000 mais un nombre absurde.

Pour les grandes valeurs, on utilise le type `long long`, qui va jusqu'à environ 9,2 × 10¹⁸ : `long long x = 100000;` puis `x * x` donne bien 10000000000. Dès qu'un résultat peut dépasser deux milliards, on déclare les variables en `long long`.

## Erreurs fréquentes

**Utiliser une variable avant de lui donner une valeur.** Si `total = total + i` apparaît sans que `total` ait été initialisé :

```
NameError: name 'total' is not defined
```

En C++, une variable non déclarée provoque `error: 'total' was not declared in this scope`. Plus traître : une variable déclarée sans valeur (`int total;`) contient une valeur quelconque, et le résultat est faux sans message. On écrit toujours `int total = 0;`.

**Initialiser l'accumulateur dans la boucle.** Si `somme = 0` est indenté dans le corps, la somme est remise à zéro à chaque tour, et on obtient à la fin seulement le dernier terme. L'initialisation se place **avant** la boucle.

**Afficher dans la boucle au lieu d'après.** Si `print(somme)` est indenté, le programme affiche toutes les sommes intermédiaires au lieu du seul résultat final. Il faut se demander, pour chaque ligne, si elle doit s'exécuter à chaque tour ou une seule fois.

**Une faute de frappe dans un nom.** En Python, `somme = some + i` provoque une erreur, mais `some = somme + i` crée silencieusement une nouvelle variable `some`, et `somme` ne change jamais. Si un résultat reste bloqué à sa valeur initiale, il faut vérifier l'orthographe des noms.

**Utiliser `/` en Python.** `print(7 / 2)` affiche `3.5`, et `print(8 / 2)` affiche `4.0` : la réponse n'est plus un entier et le correcteur la refuse. Pour un quotient entier, on écrit `//`.

**Oublier le dépassement en C++.** Un programme C++ qui affiche un nombre négatif là où on attend un grand nombre positif a presque toujours subi un dépassement de capacité. La correction est de passer les variables concernées en `long long`.

## Un exemple complet

**Énoncé.** Le n-ième **nombre triangulaire** est le nombre de billes nécessaires pour former un triangle de n rangées, avec 1 bille sur la première rangée, 2 sur la deuxième, et ainsi de suite jusqu'à n billes sur la dernière. Afficher les 10 premiers nombres triangulaires, un par ligne, chacun précédé de son rang.

**Idée.** Le n-ième nombre triangulaire vaut 1 + 2 + … + n. On pourrait recalculer cette somme pour chaque n, mais c'est inutile : en passant d'un triangle de n − 1 rangées à un triangle de n rangées, on ajoute simplement une rangée de n billes. On garde donc un accumulateur `billes`, initialisé à 0 (le triangle vide), et à chaque tour, pour n allant de 1 à 10, on lui ajoute n puis on l'affiche. Ici, l'affichage se fait dans la boucle, car on veut toutes les valeurs intermédiaires.

**Programme.**

```python
billes = 0
for n in range(1, 11):
    # On ajoute la rangée numéro n, qui contient n billes.
    billes = billes + n
    print(n, billes)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int billes = 0;
    for (int n = 1; n <= 10; n++) {
        // On ajoute la rangée numéro n, qui contient n billes.
        billes = billes + n;
        cout << n << " " << billes << "\n";
    }
    return 0;
}
```

**Vérification à la main.** On fait la trace des premiers tours. Au tour 1, `billes` passe de 0 à 1, et le programme affiche `1 1`. Au tour 2, `billes` passe de 1 à 3 : `2 3`. Au tour 3, de 3 à 6 : `3 6`. Au tour 4, de 6 à 10 : `4 10`. On reconnaît bien 1, 1 + 2, 1 + 2 + 3 et 1 + 2 + 3 + 4. Pour le dernier tour, on peut contrôler avec la formule connue n × (n + 1) / 2, qui donne 10 × 11 / 2 = 55 : la dernière ligne affichée doit être `10 55`. Si l'on avait inversé l'affichage et la mise à jour, la première ligne serait `1 0`, ce qui est faux.

## À retenir

- Les opérateurs sur les entiers sont `+`, `-`, `*`, le quotient `//` (Python) ou `/` (C++), et le reste `%`. La multiplication passe avant l'addition ; les parenthèses imposent un ordre.
- Une **variable** stocke une valeur sous un nom. `x = expression` évalue d'abord l'expression avec les valeurs actuelles, puis range le résultat dans `x`. En C++, on déclare la variable avec son type (`int`, `long long`).
- `x = x + 1` met à jour une variable à partir de son ancienne valeur ; pour plusieurs variables liées, on passe par une variable temporaire.
- Un **accumulateur** s'initialise avant la boucle (0 pour une somme, 1 pour un produit), se met à jour dans la boucle, et s'utilise après.
- En C++, un `int` ne dépasse pas environ 2 × 10⁹ : au-delà, on utilise `long long`.
- En cas de doute, on fait une trace d'exécution : la valeur de chaque variable après chaque instruction.
