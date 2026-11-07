Une boucle répète des instructions. Mais ces instructions peuvent elles-mêmes contenir une boucle. Pour afficher un rectangle de 3 lignes et 5 colonnes, on répète 3 fois « afficher une ligne », et afficher une ligne consiste à répéter 5 fois « afficher un caractère ». Pour écrire une table de multiplication, on parcourt les lignes, et dans chaque ligne, les colonnes. Pour trouver toutes les façons de choisir deux nombres entre 1 et 100, on fixe le premier, puis on fait varier le second.

Une boucle placée dans le corps d'une autre boucle s'appelle une **boucle imbriquée**. Ce chapitre montre comment elle s'exécute, comment l'utiliser pour construire des motifs et parcourir des paires, et combien de tours elle fait au total.

## Afficher sans aller à la ligne

Pour construire une ligne caractère par caractère, il faut pouvoir afficher sans passer à la ligne suivante. En Python, `print` termine normalement par un **retour à la ligne** ; on le remplace par autre chose avec `end`. `print("#", end="")` affiche `#` et reste sur la même ligne, `print(x, end=" ")` affiche `x` suivi d'une espace, et `print()` seul passe à la ligne. En C++, `cout` ne va à la ligne que si on écrit `"\n"`.

```python
print("#", end="")
print("#", end="")
print("#")
print(1, end=" ")
print(2)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "#";
    cout << "#";
    cout << "#" << "\n";
    cout << 1 << " ";
    cout << 2 << "\n";
    return 0;
}
```

Ce programme affiche deux lignes : `###`, puis `1 2`.

## Une boucle dans une boucle

Voici le rectangle de 3 lignes et 5 colonnes :

```python
for i in range(3):
    for j in range(5):
        print("#", end="")
    print()
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 5; j++) {
            cout << "#";
        }
        cout << "\n";
    }
    return 0;
}
```

Il affiche :

```
#####
#####
#####
```

La boucle sur `i` est la **boucle externe** ; la boucle sur `j`, à l'intérieur, est la **boucle interne**. La règle d'exécution est la suivante : **à chaque tour de la boucle externe, la boucle interne fait tous ses tours**, du début à la fin. Ici, pour `i = 0`, `j` prend les valeurs 0, 1, 2, 3, 4 (cinq `#`), puis `print()` termine la ligne. Pour `i = 1`, la boucle interne repart de `j = 0` et refait ses cinq tours, et ainsi de suite.

Le `print()` est décalé au niveau de la boucle externe, pas de la boucle interne : il est exécuté une fois par ligne, après les cinq `#`. C'est l'**indentation** (le décalage du début de ligne) qui dit à quelle boucle appartient une instruction. En C++, ce sont les accolades.

Au total, l'instruction `print("#", end="")` est exécutée 3 × 5 = 15 fois. De manière générale, si la boucle externe fait `A` tours et la boucle interne `B` tours à chaque fois, le corps de la boucle interne est exécuté `A × B` fois.

## Une boucle interne qui dépend de la boucle externe

Le nombre de tours de la boucle interne peut dépendre de la variable de la boucle externe. Pour afficher un triangle dont la ligne numéro `i` (en partant de 1) contient `i` caractères, on écrit `range(i)` dans la boucle interne. Pour faire varier `i` de 1 à `n`, on utilise `range(1, n + 1)` : avec deux nombres, `range(a, b)` parcourt les entiers de `a` à `b - 1`.

```python
n = 4
for i in range(1, n + 1):
    for j in range(i):
        print("*", end="")
    print()
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 4;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            cout << "*";
        }
        cout << "\n";
    }
    return 0;
}
```

Ce programme affiche :

```
*
**
***
****
```

Au premier tour de la boucle externe, la boucle interne fait 1 tour ; au deuxième, 2 tours ; au dernier, `n` tours. Le nombre total d'étoiles est 1 + 2 + 3 + 4 = 10. Pour `n` lignes, c'est 1 + 2 + … + n = n × (n + 1) / 2, environ la moitié de n × n.

## Utiliser les deux variables

Dans le corps de la boucle interne, on dispose des deux variables à la fois : `i` (la ligne) et `j` (la colonne). On peut calculer avec elles, ou les tester avec un `if`. Voici la table de multiplication de 1 à 4 :

```python
for i in range(1, 5):
    for j in range(1, 5):
        print(i * j, end=" ")
    print()
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 4; i++) {
        for (int j = 1; j <= 4; j++) {
            cout << i * j << " ";
        }
        cout << "\n";
    }
    return 0;
}
```

```
1 2 3 4
2 4 6 8
3 6 9 12
4 8 12 16
```

La case de la ligne `i` et de la colonne `j` contient `i × j`. Avec un `if`, on choisit le caractère à afficher selon la position. Par exemple, pour dessiner la diagonale d'un carré, on affiche `#` quand `i == j` et `.` sinon :

```python
n = 4
for i in range(n):
    for j in range(n):
        if i == j:
            print("#", end="")
        else:
            print(".", end="")
    print()
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 4;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) {
                cout << "#";
            } else {
                cout << ".";
            }
        }
        cout << "\n";
    }
    return 0;
}
```

```
#...
.#..
..#.
...#
```

Pour trouver la bonne condition d'un motif, on écrit à côté de chaque case ses coordonnées `(i, j)` et on cherche ce que les cases `#` ont en commun : `i == j` pour une diagonale, `i + j == n - 1` pour l'autre diagonale, `i == 0` pour la première ligne, et ainsi de suite.

## Parcourir toutes les paires

Une **paire** est un choix de deux nombres. Avec deux boucles imbriquées de 1 à `n`, on parcourt tous les couples `(i, j)`, y compris `(2, 2)`, et à la fois `(1, 3)` et `(3, 1)`. Souvent, on veut chaque paire **une seule fois**, avec deux nombres différents. Il suffit alors d'imposer `i < j` : la boucle interne commence à `i + 1`.

```python
n = 5
nombre = 0
for i in range(1, n + 1):
    for j in range(i + 1, n + 1):
        if (i + j) % 2 == 0:
            nombre = nombre + 1
print(nombre)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 5;
    int nombre = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            if ((i + j) % 2 == 0) {
                nombre = nombre + 1;
            }
        }
    }
    cout << nombre << "\n";
    return 0;
}
```

Ce programme compte les paires `i < j` entre 1 et 5 dont la somme est paire. Il en trouve 4 : `(1, 3)`, `(1, 5)`, `(2, 4)` et `(3, 5)`. Il affiche `4`. Il y a en tout 10 paires `i < j` entre 1 et 5, et en général n × (n - 1) / 2 : c'est le nombre de tours de la boucle interne.

Ce schéma, **énumérer** toutes les possibilités et compter celles qui conviennent, est l'une des méthodes les plus utiles en algorithmique. On l'appelle la **recherche exhaustive**. Elle est simple et sûre, à condition que le nombre de possibilités reste raisonnable.

## Imbriquer while et for

Les boucles `while` s'imbriquent comme les boucles `for`. Un cas fréquent : pour chaque nombre de 1 à `n`, examiner ses chiffres. La boucle externe est un `for` (on connaît le nombre de tours), la boucle interne un `while` (on ne connaît pas le nombre de chiffres). Voici les nombres de 1 à 40 dont la somme des chiffres vaut 5 :

```python
for n in range(1, 41):
    m = n
    somme = 0
    while m > 0:
        somme = somme + m % 10
        m = m // 10
    if somme == 5:
        print(n)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int n = 1; n <= 40; n++) {
        int m = n;
        int somme = 0;
        while (m > 0) {
            somme = somme + m % 10;
            m = m / 10;
        }
        if (somme == 5) {
            cout << n << "\n";
        }
    }
    return 0;
}
```

Le programme affiche `5`, `14`, `23` et `32`, un par ligne. Deux points sont essentiels. D'abord, la boucle interne travaille sur une **copie** `m` de `n` : si elle détruisait `n` directement, la boucle externe serait perturbée et le `print(n)` afficherait 0. Ensuite, `somme` est remise à 0 **au début de chaque tour de la boucle externe**, juste avant la boucle interne : chaque nombre a sa propre somme.

## Combien de tours ?

Une boucle imbriquée fait vite beaucoup de tours. Deux boucles de 1 000 tours chacune exécutent un million de fois le corps de la boucle interne. Un ordinateur fait environ quelques centaines de millions d'opérations simples par seconde en C++, et Python est 10 à 50 fois plus lent. Un million de tours reste donc rapide dans les deux langages, mais deux boucles de 100 000 tours (dix milliards de passages) prennent beaucoup trop de temps. Avant d'écrire des boucles imbriquées, on estime le nombre total de tours avec les contraintes de l'énoncé.

## Les erreurs fréquentes

### Le compteur initialisé au mauvais niveau

```python
somme = 0
for n in range(1, 41):
    m = n
    while m > 0:
        somme = somme + m % 10
        m = m // 10
    if somme == 5:
        print(n)
```

```cpp
int somme = 0;
for (int n = 1; n <= 40; n++) {
    int m = n;
    while (m > 0) {
        somme = somme + m % 10;
        m = m / 10;
    }
    if (somme == 5) {
        cout << n << "\n";
    }
}
```

Ici, `somme` est mise à 0 une seule fois, avant la boucle externe : elle accumule les chiffres de **tous** les nombres. Elle vaut 1 après le nombre 1, puis 3, puis 6, et ne fait qu'augmenter : elle ne vaut jamais exactement 5, et le programme n'affiche rien du tout. La règle : une variable qui concerne un seul tour de la boucle externe s'initialise au début de ce tour ; une variable qui concerne tout le calcul (comme le nombre total de paires) s'initialise avant la boucle externe.

### La même variable pour les deux boucles

```python
for i in range(1, 4):
    for i in range(1, 4):
        print(i * i, end=" ")
    print()
```

```cpp
for (int i = 1; i <= 3; i++) {
    for (int i = 1; i <= 3; i++) {
        cout << i * i << " ";
    }
    cout << "\n";
}
```

On voulait la table de multiplication, et on obtient trois fois la ligne `1 4 9` : dans la boucle interne, `i` désigne la variable de la boucle interne, et la ligne est perdue. Chaque boucle doit avoir sa propre variable : `i` pour les lignes, `j` pour les colonnes.

### Le retour à la ligne mal placé

Si `print()` est décalé dans la boucle interne, il s'exécute après chaque caractère : on obtient un seul `#` par ligne, sur 15 lignes. S'il est oublié, tout s'affiche sur une seule ligne. On vérifie toujours l'indentation : un seul retour à la ligne par tour de la boucle externe.

### Une boucle while interne qui ne repart pas de zéro

```python
i = 0
j = 0
while i < 3:
    while j < 5:
        print("#", end="")
        j = j + 1
    print()
    i = i + 1
```

```cpp
int i = 0;
int j = 0;
while (i < 3) {
    while (j < 5) {
        cout << "#";
        j = j + 1;
    }
    cout << "\n";
    i = i + 1;
}
```

Ce programme affiche une ligne de cinq `#`, puis deux lignes vides. Après la première ligne, `j` vaut 5 et n'est jamais remis à 0 : la boucle interne ne fait plus aucun tour. Avec `while`, l'initialisation `j = 0` doit se placer **dans** la boucle externe, juste avant la boucle interne.

## Exemple complet : les nombres parfaits

**Énoncé.** Un nombre est **parfait** s'il est égal à la somme de ses diviseurs autres que lui-même. Par exemple, 6 est parfait, car ses diviseurs autres que 6 sont 1, 2 et 3, et 1 + 2 + 3 = 6. Le programme lit un entier `N` (1 ≤ N ≤ 1 000) et affiche tous les nombres parfaits entre 1 et `N`, un par ligne.

**Idée.** On ne sait pas encore reconnaître directement un nombre parfait : on teste chaque candidat. La boucle externe parcourt les nombres `n` de 1 à `N`. Pour chacun, la boucle interne parcourt les diviseurs possibles `d` de 1 à `n - 1`, et ajoute `d` à une somme quand `n % d == 0`. Après la boucle interne, on compare la somme à `n`. La somme est remise à 0 au début de chaque tour externe. Le nombre de tours est au plus 1 000 × 1 000 / 2, soit un demi-million : c'est rapide.

**Programme.**

```python
N = int(input())
for n in range(1, N + 1):
    somme = 0
    for d in range(1, n):
        if n % d == 0:
            somme = somme + d
    if somme == n:
        print(n)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int N;
    cin >> N;
    for (int n = 1; n <= N; n++) {
        int somme = 0;
        for (int d = 1; d < n; d++) {
            if (n % d == 0) {
                somme = somme + d;
            }
        }
        if (somme == n) {
            cout << n << "\n";
        }
    }
    return 0;
}
```

**Vérification à la main** avec `N = 6`. Pour `n = 1`, la boucle interne ne fait aucun tour : la somme vaut 0, différente de 1. Pour `n = 4`, les diviseurs testés sont 1, 2, 3 ; seuls 1 et 2 divisent 4, la somme vaut 3. Pour `n = 6`, les diviseurs sont 1, 2 et 3, la somme vaut 6 : le programme affiche `6`. Les autres nombres (2, 3, 5) donnent une somme de 1, et 4 donne 3. Avec `N = 1000`, le programme affiche `6`, `28` et `496`.

## À retenir

- Dans une boucle imbriquée, la boucle interne fait tous ses tours à chaque tour de la boucle externe. Le corps interne s'exécute (tours externes) × (tours internes) fois.
- L'indentation (ou les accolades) dit à quelle boucle appartient chaque instruction : un seul retour à la ligne par tour externe pour un motif.
- La boucle interne peut dépendre de la variable externe : `range(i)` pour un triangle, `range(i + 1, n + 1)` pour les paires `i < j`.
- Énumérer toutes les possibilités et compter celles qui conviennent (recherche exhaustive) marche tant que le nombre total de tours reste de l'ordre de quelques millions.
- Chaque boucle a sa propre variable ; ce qui concerne un seul tour externe (somme, compteur, `j = 0` d'un `while`) s'initialise au début de ce tour.
