Au niveau 1, les valeurs lues étaient traitées au fur et à mesure, puis oubliées. Cette méthode a une limite. Supposons qu'on veuille afficher les températures d'une semaine qui dépassent la moyenne de la semaine. La moyenne n'est connue qu'après avoir lu toutes les valeurs, mais à ce moment-là, les premières valeurs sont perdues. Il faudrait les avoir gardées.

Un **tableau** permet exactement cela : ranger une suite de valeurs sous un seul nom, puis y revenir autant de fois qu'on veut, dans l'ordre qu'on veut. Ce chapitre explique comment créer un tableau, accéder à ses cases, le parcourir, le construire et le modifier. Avec lui, de nombreux problèmes nouveaux deviennent possibles : comparer chaque valeur à toutes les autres, compter les répétitions, retourner une suite.

## Créer un tableau

Un tableau est une suite de valeurs rangées dans un ordre précis. Chaque valeur est un **élément** du tableau. En Python, on parle de **liste**, et on l'écrit entre crochets, éléments séparés par des virgules. En C++, on utilise un `vector`, qui demande d'inclure `<vector>` et de préciser le type des éléments entre chevrons : `vector<int>` est un tableau d'entiers.

```python
t = [12, 15, 9, 20]
print(t)
print(len(t))
vide = []
print(len(vide))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {12, 15, 9, 20};
    cout << t.size() << "\n";
    vector<int> vide;
    cout << vide.size() << "\n";
    return 0;
}
```

Le programme Python affiche `[12, 15, 9, 20]`, puis `4`, puis `0`. La fonction `len` donne la **longueur** du tableau, c'est-à-dire son nombre d'éléments ; en C++, c'est `t.size()`. Un tableau peut être **vide** : il ne contient alors aucun élément et sa longueur vaut 0. Le C++ ne sait pas afficher un `vector` d'un seul coup avec `cout` : il faut une boucle, comme on le verra plus loin.

On a souvent besoin d'un tableau de `n` cases qui valent toutes 0. En Python, on écrit `[0] * n` ; en C++, `vector<int> t(n, 0)`, ou simplement `vector<int> t(n)`, car les cases d'un `vector` d'entiers valent 0 par défaut.

## Accéder à une case : l'indice

Chaque élément occupe une case numérotée. Ce numéro s'appelle l'**indice** (ou la position) de l'élément. Attention : les indices commencent à **0**. Dans un tableau de longueur `n`, le premier élément a l'indice 0 et le dernier l'indice `n − 1`. On accède à l'élément d'indice `i` en écrivant `t[i]`, et on peut le modifier comme une variable.

```python
t = [12, 15, 9, 20]
print(t[0], t[2])
t[1] = 7
t[3] = t[3] + 1
print(t)
print(t[len(t) - 1])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {12, 15, 9, 20};
    cout << t[0] << " " << t[2] << "\n";
    t[1] = 7;
    t[3] = t[3] + 1;
    cout << t[0] << " " << t[1] << " " << t[2] << " " << t[3] << "\n";
    cout << t[t.size() - 1] << "\n";
    return 0;
}
```

Le programme affiche `12 9`, puis le tableau modifié `[12, 7, 9, 21]`, puis `21`, le dernier élément. En Python, on peut aussi compter depuis la fin avec des indices négatifs : `t[-1]` est le dernier élément, `t[-2]` l'avant-dernier. Cette écriture n'existe pas en C++.

## Lire un tableau

Le plus souvent, l'entrée donne `N`, puis les `N` valeurs sur une ligne. En Python, une seule instruction suffit : `list(map(int, input().split()))`. On reconnaît la lecture du niveau 1 : `split()` découpe la ligne en morceaux, `map(int, ...)` convertit chaque morceau, et `list(...)` range le tout dans une liste. En C++, on crée un `vector` de `n` cases, puis on remplit chaque case avec `cin`.

```python
n = int(input())
t = list(map(int, input().split()))
print(t[0] + t[n - 1])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    cout << t[0] + t[n - 1] << "\n";
    return 0;
}
```

Avec l'entrée `5` puis `3 8 1 6 4`, ce programme affiche `7`, la somme du premier et du dernier élément. Si les valeurs sont une par ligne, on part d'une liste vide et on ajoute chaque valeur lue, comme on va le voir.

## Parcourir un tableau

**Parcourir** un tableau, c'est examiner ses éléments un par un. Il y a deux façons de faire.

Le **parcours par valeur** donne directement les éléments : `for x in t:` fait un tour par élément, avec `x` égal à `t[0]`, puis `t[1]`, et ainsi de suite. En C++, on écrit `for (int x : t)`. C'est la forme la plus simple, quand on n'a pas besoin de la position.

Le **parcours par indice** fait varier un indice `i` de 0 à `n − 1` : `for i in range(len(t)):`, et on utilise `t[i]` dans la boucle. On le choisit quand la position compte, ou quand on veut regarder les voisins d'un élément, `t[i - 1]` et `t[i + 1]`.

```python
t = [4, -2, 7, 0, 5]
total = 0
for x in t:
    total = total + x
print(total)
for i in range(len(t)):
    if t[i] > 0:
        print(i, end=" ")
print()
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {4, -2, 7, 0, 5};
    int total = 0;
    for (int x : t) {
        total = total + x;
    }
    cout << total << "\n";
    for (int i = 0; i < (int) t.size(); i++) {
        if (t[i] > 0) {
            cout << i << " ";
        }
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche `14`, puis les indices des éléments strictement positifs : `0 2 4`. En C++, on écrit `(int) t.size()`, car `size()` donne un entier d'un type particulier, sans signe ; la conversion évite des avertissements et des surprises quand on fait des soustractions.

## Construire un tableau

Un tableau peut grandir. En Python, `t.append(x)` ajoute `x` à la fin de `t`, et sa longueur augmente de 1. En C++, c'est `t.push_back(x)`. On part souvent d'un tableau vide et on y ajoute les éléments un par un.

Pour afficher tous les éléments d'un tableau sur une ligne, séparés par des espaces, Python offre une écriture courte : `print(*t)`. L'étoile « déplie » le tableau, comme si on avait écrit `print(t[0], t[1], ...)`. En C++, on fait une boucle.

```python
n = int(input())
carres = []
for i in range(1, n + 1):
    carres.append(i * i)
print(len(carres))
print(*carres)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> carres;
    for (int i = 1; i <= n; i++) {
        carres.push_back(i * i);
    }
    cout << carres.size() << "\n";
    for (int x : carres) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

Avec l'entrée `5`, le programme affiche `5`, puis `1 4 9 16 25`.

## Deux passages sur les données

Revenons au problème de l'introduction : afficher les valeurs qui dépassent la moyenne. Avec un tableau, on fait **deux passages**. Le premier calcule la somme ; le second, une fois la moyenne connue, compare chaque valeur à cette moyenne. Pour éviter les flottants, on remarque que `x > somme / n` équivaut à `x × n > somme`, puisque `n` est positif.

```python
n = int(input())
t = list(map(int, input().split()))
somme = 0
for x in t:
    somme = somme + x
for x in t:
    if x * n > somme:
        print(x, end=" ")
print()
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    int somme = 0;
    for (int x : t) {
        somme = somme + x;
    }
    for (int x : t) {
        if (x * n > somme) {
            cout << x << " ";
        }
    }
    cout << "\n";
    return 0;
}
```

Avec `5` et `3 8 1 6 4`, la somme vaut 22 et la moyenne 4,4 : le programme affiche `8 6`.

## Maximum, minimum, somme

Trouver le plus grand élément est un geste de base. On part du premier élément, puis on parcourt le tableau : chaque fois qu'un élément est plus grand que le maximum provisoire, il le remplace.

```python
t = [3, 8, 1, 8, 4]
m = t[0]
pos = 0
for i in range(len(t)):
    if t[i] > m:
        m = t[i]
        pos = i
print(m, pos)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {3, 8, 1, 8, 4};
    int m = t[0];
    int pos = 0;
    for (int i = 0; i < (int) t.size(); i++) {
        if (t[i] > m) {
            m = t[i];
            pos = i;
        }
    }
    cout << m << " " << pos << "\n";
    return 0;
}
```

Le programme affiche `8 1` : le maximum vaut 8, et sa première position est 1. Avec `>=` au lieu de `>`, on obtiendrait la dernière position, 3. On initialise avec `t[0]` et non avec 0 : si tous les éléments étaient négatifs, un maximum initialisé à 0 serait faux.

Maintenant que ces calculs ont été écrits à la main, on peut utiliser les raccourcis de Python : `max(t)`, `min(t)` et `sum(t)` donnent le maximum, le minimum et la somme d'une liste. En C++, `max(a, b)` et `min(a, b)` donnent le plus grand et le plus petit de deux valeurs ; pour un tableau entier, on garde la boucle, ou on écrit `*max_element(t.begin(), t.end())` en incluant `<algorithm>`.

## Le tableau de comptage

Quand les valeurs sont de petits entiers positifs, on peut se servir d'un tableau pour **compter** combien de fois chacune apparaît. L'idée est d'utiliser la valeur comme indice : la case `cpt[v]` contient le nombre d'apparitions de la valeur `v`. Un tel tableau s'appelle un **tableau de comptage** (ou tableau d'occurrences). Pour des notes entre 0 et 20, il faut 21 cases, d'indices 0 à 20.

```python
notes = [12, 15, 12, 20, 9, 12, 15]
cpt = [0] * 21
for x in notes:
    cpt[x] = cpt[x] + 1
for v in range(21):
    if cpt[v] > 0:
        print(v, cpt[v])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> notes = {12, 15, 12, 20, 9, 12, 15};
    vector<int> cpt(21, 0);
    for (int x : notes) {
        cpt[x] = cpt[x] + 1;
    }
    for (int v = 0; v <= 20; v++) {
        if (cpt[v] > 0) {
            cout << v << " " << cpt[v] << "\n";
        }
    }
    return 0;
}
```

Le programme affiche `9 1`, `12 3`, `15 2` et `20 1`. On remarque que les valeurs sortent dans l'ordre croissant, puisque la deuxième boucle parcourt les indices dans l'ordre. Ce tableau ne fonctionne que si les valeurs sont des entiers assez petits pour servir d'indices : avec des valeurs jusqu'à 10⁹, il faudrait un milliard de cases.

## Échanger et retourner

**Échanger** deux éléments, c'est mettre chacun à la place de l'autre. On ne peut pas écrire `t[i] = t[j]` puis `t[j] = t[i]` : après la première instruction, l'ancienne valeur de `t[i]` est perdue, et les deux cases contiennent `t[j]`. En Python, on écrit `t[i], t[j] = t[j], t[i]`, qui calcule d'abord les deux valeurs de droite, puis les range. En C++, on écrit `swap(t[i], t[j])`.

Pour **retourner** un tableau, c'est-à-dire inverser l'ordre de ses éléments, on échange le premier avec le dernier, le deuxième avec l'avant-dernier, et ainsi de suite. L'élément d'indice `i` s'échange avec celui d'indice `n − 1 − i`. On s'arrête au milieu, après `n // 2` échanges : en allant jusqu'au bout, on échangerait chaque paire deux fois, et le tableau reviendrait à son état de départ.

```python
t = [1, 2, 3, 4, 5]
n = len(t)
for i in range(n // 2):
    t[i], t[n - 1 - i] = t[n - 1 - i], t[i]
print(*t)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {1, 2, 3, 4, 5};
    int n = t.size();
    for (int i = 0; i < n / 2; i++) {
        swap(t[i], t[n - 1 - i]);
    }
    for (int x : t) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche `5 4 3 2 1`. Avec 5 éléments, il fait 2 échanges ; l'élément du milieu ne bouge pas.

## Erreurs fréquentes

**Sortir du tableau.** Dans un tableau de longueur 4, `t[4]` n'existe pas. Python s'arrête avec `IndexError: list index out of range`. C'est presque toujours une erreur d'une unité (on dit une erreur de **décalage d'un**) : une boucle `for i in range(1, n + 1)` qui utilise `t[i]`, ou un accès à `t[i + 1]` quand `i` atteint `n − 1`. En C++, c'est plus grave : **aucun message**, le programme lit une case de mémoire qui ne lui appartient pas, affiche une valeur absurde ou s'arrête brutalement. Il faut vérifier les bornes de chaque boucle : pour regarder `t[i + 1]`, la boucle s'arrête à `n − 2`.

**Écrire dans une case qui n'existe pas.** Après `t = []`, l'instruction `t[0] = 5` provoque `IndexError: list assignment index out of range`. Un tableau vide n'a pas de case 0. On utilise `t.append(5)`, ou on crée le tableau avec `[0] * n` dès le départ.

**Croire qu'on a fait une copie.** En Python, `b = t` ne copie pas la liste : `b` et `t` sont deux noms pour la **même** liste, et modifier `b[0]` modifie aussi `t[0]`. Pour une vraie copie, on écrit `b = list(t)`. En C++, au contraire, `vector<int> b = t;` fait une copie.

**Modifier la variable de parcours.** Dans `for x in t: x = 0`, on change la variable `x`, pas le tableau, qui reste intact. Pour modifier les éléments, on parcourt par indice : `for i in range(len(t)): t[i] = 0`.

**Prendre le maximum d'un tableau vide.** `max([])` provoque `ValueError: max() arg is an empty sequence`, et `t[0]` provoque une `IndexError`. Si le tableau peut être vide, il faut traiter ce cas à part.

## Un exemple complet

**Énoncé.** On lit `N` entiers compris entre 0 et 1 000. Afficher, dans l'ordre de l'entrée, ceux qui n'apparaissent qu'une seule fois. S'il n'y en a aucun, afficher `AUCUN`.

**Idée.** En lisant une valeur, on ne sait pas encore si elle reviendra plus loin. Il faut donc deux passages. Le premier remplit un tableau de comptage de 1 001 cases. Le second reparcourt les valeurs dans l'ordre et affiche celles dont le compteur vaut 1. Un booléen retient si on a affiché quelque chose.

**Programme.**

```python
n = int(input())
t = list(map(int, input().split()))
cpt = [0] * 1001
for x in t:
    cpt[x] = cpt[x] + 1
trouve = False
for x in t:
    if cpt[x] == 1:
        print(x, end=" ")
        trouve = True
if trouve:
    print()
else:
    print("AUCUN")
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    vector<int> cpt(1001, 0);
    for (int x : t) {
        cpt[x] = cpt[x] + 1;
    }
    bool trouve = false;
    for (int x : t) {
        if (cpt[x] == 1) {
            cout << x << " ";
            trouve = true;
        }
    }
    if (trouve) {
        cout << "\n";
    } else {
        cout << "AUCUN\n";
    }
    return 0;
}
```

**Vérification à la main.** Avec `6` puis `4 7 4 1 9 7`, le premier passage donne `cpt[4] = 2`, `cpt[7] = 2`, `cpt[1] = 1` et `cpt[9] = 1`. Le second passage examine 4 (compteur 2, ignoré), 7 (ignoré), 4 (ignoré), 1 (affiché), 9 (affiché), 7 (ignoré). Le programme affiche `1 9`. Avec `2` puis `5 5`, rien n'est affiché dans la boucle, et le programme affiche `AUCUN`. Le programme fait deux parcours de `N` éléments et un tableau de 1 001 cases : il reste rapide même pour `N = 100 000`, alors que comparer chaque valeur à toutes les autres demanderait des milliards d'opérations.

## À retenir

- Un tableau (`list` en Python, `vector` en C++) range des éléments numérotés à partir de 0 : `t[0]` est le premier, `t[n - 1]` le dernier, et `len(t)` ou `t.size()` donne la longueur.
- Lecture : `t = list(map(int, input().split()))` en Python ; en C++, `vector<int> t(n)` puis `cin >> t[i]` dans une boucle.
- On parcourt par valeur (`for x in t`) quand seule la valeur compte, par indice (`for i in range(len(t))`) quand la position ou les voisins comptent. `append` / `push_back` ajoute à la fin.
- Garder les valeurs permet plusieurs passages : un premier pour calculer (somme, maximum, comptage), un second pour utiliser le résultat.
- Un tableau de comptage `cpt[v]` compte les apparitions de petites valeurs entières ; `t[i], t[j] = t[j], t[i]` (ou `swap`) échange deux éléments.
- Chaque accès doit rester entre 0 et `n − 1` : Python signale `IndexError`, le C++ ne signale rien et donne des résultats faux.
