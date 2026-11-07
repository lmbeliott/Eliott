Un plateau d'échecs, un plan de ville découpé en carrés, une image faite de pixels, un tableau de températures relevées chaque jour à chaque heure : toutes ces données ont deux dimensions. Une valeur n'y est pas repérée par une seule position, mais par deux : un numéro de ligne et un numéro de colonne.

Pour les représenter, on utilise une **grille**, aussi appelée **tableau à deux dimensions** ou **matrice** : une liste dont chaque élément est lui-même une liste, qui représente une ligne. Ce chapitre montre comment créer et lire une grille, la parcourir, calculer des sommes sur ses lignes, ses colonnes et ses diagonales, examiner les **voisins** d'une case sans sortir de la grille, et faire évoluer une grille étape par étape.

## Une liste de listes

Voici une grille de 2 lignes et 3 colonnes :

```python
g = [[1, 2, 3],
     [4, 5, 6]]
print(g[1][2])
print(g[0])
print(len(g), len(g[0]))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<int>> g = {{1, 2, 3},
                             {4, 5, 6}};
    cout << g[1][2] << "\n";
    cout << g[0][0] << " " << g[0][1] << " " << g[0][2] << "\n";
    cout << g.size() << " " << g[0].size() << "\n";
    return 0;
}
```

Le programme Python affiche `6`, puis `[1, 2, 3]`, puis `2 3`.

`g` est une liste de deux éléments ; chacun est une **ligne**, c'est-à-dire une liste de trois nombres. `g[1]` désigne la deuxième ligne, `[4, 5, 6]`, et `g[1][2]` l'élément d'indice 2 de cette ligne : 6. On écrit toujours **la ligne d'abord, la colonne ensuite**. Une **case** est repérée par ses **coordonnées** `(i, j)` : `i` est le numéro de ligne, qui augmente vers le bas, et `j` le numéro de colonne, qui augmente vers la droite. Les deux commencent à 0, comme pour les listes.

Le nombre de lignes est `len(g)` ; le nombre de colonnes est la longueur d'une ligne, `len(g[0])`. Dans tout ce chapitre, `n` désigne le nombre de lignes et `m` le nombre de colonnes.

En C++, une grille d'entiers est un `vector<vector<int>>` : un tableau dont chaque élément est un `vector<int>`. L'accès s'écrit de la même façon, `g[i][j]`, et les tailles s'obtiennent avec `g.size()` et `g[0].size()`.

## Parcourir une grille

Pour visiter toutes les cases, on utilise deux boucles imbriquées : la boucle externe parcourt les lignes, la boucle interne les colonnes. C'est exactement le schéma des motifs du niveau 1, mais au lieu de calculer le contenu d'une case à partir de `i` et `j`, on le lit dans la grille.

```python
g = [[3, 0, 7],
     [1, 5, 2]]
n = len(g)
m = len(g[0])
total = 0
for i in range(n):
    for j in range(m):
        print(g[i][j], end=" ")
        total = total + g[i][j]
    print()
print(total)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<int>> g = {{3, 0, 7},
                             {1, 5, 2}};
    int n = g.size();
    int m = g[0].size();
    int total = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cout << g[i][j] << " ";
            total = total + g[i][j];
        }
        cout << "\n";
    }
    cout << total << "\n";
    return 0;
}
```

Le programme affiche la grille sur deux lignes, `3 0 7` puis `1 5 2`, puis la somme de toutes les cases, `18`. Le corps de la boucle interne s'exécute `n × m` fois, une fois par case.

## Lignes, colonnes et diagonales

Pour la somme d'une **ligne** `i`, on fixe `i` et on fait varier `j`. Pour la somme d'une **colonne** `j`, on fixe `j` et on fait varier `i`. Pour obtenir les sommes de toutes les colonnes, la boucle externe porte donc sur `j` et la boucle interne sur `i` : l'ordre des boucles change, mais l'accès reste `g[i][j]`.

Dans une grille carrée de taille `n`, la **diagonale principale** est formée des cases où `i == j`, de `(0, 0)` à `(n - 1, n - 1)`. L'autre diagonale, appelée **anti-diagonale**, est formée des cases où `i + j == n - 1`, c'est-à-dire `g[i][n - 1 - i]`. Une seule boucle suffit pour chacune.

```python
g = [[2, 7, 6],
     [9, 5, 1],
     [4, 3, 8]]
n = len(g)
for j in range(n):
    s = 0
    for i in range(n):
        s = s + g[i][j]
    print("colonne", j, ":", s)
d1 = 0
d2 = 0
for i in range(n):
    d1 = d1 + g[i][i]
    d2 = d2 + g[i][n - 1 - i]
print(d1, d2)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<int>> g = {{2, 7, 6},
                             {9, 5, 1},
                             {4, 3, 8}};
    int n = g.size();
    for (int j = 0; j < n; j++) {
        int s = 0;
        for (int i = 0; i < n; i++) {
            s = s + g[i][j];
        }
        cout << "colonne " << j << " : " << s << "\n";
    }
    int d1 = 0, d2 = 0;
    for (int i = 0; i < n; i++) {
        d1 = d1 + g[i][i];
        d2 = d2 + g[i][n - 1 - i];
    }
    cout << d1 << " " << d2 << "\n";
    return 0;
}
```

Les trois colonnes ont pour somme 15, et le programme affiche enfin `15 15` : la diagonale principale contient 2, 5 et 8, l'anti-diagonale 6, 5 et 4. La somme `s` est remise à 0 au début de chaque colonne, comme toute variable qui concerne un seul tour de la boucle externe.

## Lire une grille

Une grille de nombres est en général donnée ainsi : une ligne avec `n` et `m`, puis `n` lignes de `m` nombres. En Python, on lit chaque ligne, on la transforme en liste d'entiers, et on l'ajoute à la grille avec `append`. En C++, `cin` lit les nombres un par un, quelle que soit leur disposition.

```python
n, m = map(int, input().split())
g = []
for i in range(n):
    g.append(list(map(int, input().split())))
```

```cpp
int n, m;
cin >> n >> m;
vector<vector<int>> g(n, vector<int>(m));
for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
        cin >> g[i][j];
    }
}
```

Une grille de **caractères**, comme un plan où `#` est un mur et `.` une case libre, est donnée ligne par ligne, sans espaces : `#..#`. En Python, une chaîne se lit déjà comme une liste de caractères : `g[i][j]` fonctionne sur une liste de chaînes. Mais une chaîne n'est pas modifiable. Si le programme doit changer des cases, on transforme chaque ligne en liste de caractères avec `list(input())`, et on la reconstitue pour l'afficher avec `"".join(ligne)`. En C++, on lit un `vector<string>` : les `string` du C++ sont modifiables, `g[i][j] = '#'` est permis.

```python
n, m = map(int, input().split())
g = []
for i in range(n):
    g.append(list(input()))
g[0][0] = "@"
for ligne in g:
    print("".join(ligne))
```

```cpp
int n, m;
cin >> n >> m;
vector<string> g(n);
for (int i = 0; i < n; i++) {
    cin >> g[i];
}
g[0][0] = '@';
for (int i = 0; i < n; i++) {
    cout << g[i] << "\n";
}
```

## Créer une grille vide

Pour créer une grille de `n` lignes et `m` colonnes remplie de zéros, on ajoute `n` fois une **nouvelle** ligne `[0] * m`. Python propose une écriture plus courte, qui fait exactement la même chose : `[[0] * m for i in range(n)]` construit une liste en évaluant `[0] * m` une fois pour chaque valeur de `i`, donc avec `n` lignes distinctes. Cette écriture, `[expression for x in ...]`, s'appelle une **liste en compréhension** : elle fabrique la liste des valeurs de l'expression, une pour chaque tour de la boucle. En C++, `vector<vector<int>> g(n, vector<int>(m, 0));` crée `n` copies d'une ligne de `m` zéros.

Pour une grille de caractères vide, on écrit de même `[["."] * m for i in range(n)]` en Python, et `vector<string> g(n, string(m, '.'));` en C++, où `string(m, '.')` est une chaîne de `m` points.

```python
n, m = 2, 3
g = []
for i in range(n):
    g.append([0] * m)
h = [[0] * m for i in range(n)]
g[0][1] = 5
h[1][2] = 7
print(g)
print(h)
```

```cpp
int n = 2, m = 3;
vector<vector<int>> g(n, vector<int>(m, 0));
g[0][1] = 5;
```

Le programme Python affiche `[[0, 5, 0], [0, 0, 0]]` puis `[[0, 0, 0], [0, 0, 7]]` : chaque modification ne touche qu'une case.

L'écriture `[[0] * m] * n`, qui semble naturelle, est un **piège**. Elle crée **une seule** ligne et une liste qui contient `n` fois cette même ligne. Les lignes ne sont pas des copies : ce sont `n` noms pour la même liste. On parle d'**alias**.

```python
g = [[0] * 3] * 2
g[0][1] = 5
print(g)
```

```cpp
// Pas d'équivalent en C++ : vector<vector<int>> g(2, vector<int>(3, 0));
// fabrique toujours des lignes distinctes.
```

Ce programme affiche `[[0, 5, 0], [0, 5, 0]]` : en modifiant la ligne 0, on a aussi « modifié » la ligne 1, puisque c'est la même. Aucun message d'erreur n'apparaît, et le programme donne simplement des résultats faux. La règle : une ligne par tour de boucle, avec `append` ou avec `for i in range(n)`.

## Les voisins d'une case

Beaucoup de problèmes sur les grilles demandent d'examiner les **voisins** d'une case. Les **4 voisins** de `(i, j)` sont la case du dessus `(i - 1, j)`, celle du dessous `(i + 1, j)`, celle de gauche `(i, j - 1)` et celle de droite `(i, j + 1)`. Plutôt que d'écrire quatre fois le même code, on range les **déplacements** dans deux listes : `di` pour la variation de ligne, `dj` pour la variation de colonne. Le voisin numéro `d` est `(i + di[d], j + dj[d])`.

Une case du bord a moins de voisins : la case `(0, 0)` n'a ni voisin du dessus ni voisin de gauche. Avant de lire `g[ni][nj]`, il faut donc vérifier que le voisin est **dans la grille** : `0 <= ni < n` et `0 <= nj < m`. Python accepte cette double comparaison ; en C++, on écrit `0 <= ni && ni < n`.

Le programme suivant affiche, pour chaque case d'une grille de 3 lignes et 4 colonnes, son nombre de voisins :

```python
n, m = 3, 4
di = [-1, 1, 0, 0]
dj = [0, 0, -1, 1]
for i in range(n):
    for j in range(m):
        k = 0
        for d in range(4):
            ni = i + di[d]
            nj = j + dj[d]
            if 0 <= ni < n and 0 <= nj < m:
                k = k + 1
        print(k, end="")
    print()
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 3, m = 4;
    int di[4] = {-1, 1, 0, 0};
    int dj[4] = {0, 0, -1, 1};
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            int k = 0;
            for (int d = 0; d < 4; d++) {
                int ni = i + di[d];
                int nj = j + dj[d];
                if (0 <= ni && ni < n && 0 <= nj && nj < m) {
                    k = k + 1;
                }
            }
            cout << k;
        }
        cout << "\n";
    }
    return 0;
}
```

Il affiche :

```
2332
3443
2332
```

Les coins ont 2 voisins, les autres cases du bord 3, les cases intérieures 4.

Les **8 voisins** ajoutent les quatre cases en diagonale : les déplacements sont toutes les combinaisons de `-1`, `0` et `1` pour la ligne et pour la colonne, sauf `(0, 0)`, qui est la case elle-même. On peut écrire deux listes de 8 éléments, `di = [-1, -1, -1, 0, 0, 1, 1, 1]` et `dj = [-1, 0, 1, -1, 1, -1, 0, 1]`, ou deux boucles `for a in range(-1, 2)` et `for b in range(-1, 2)`, en ne traitant le déplacement que si `a != 0 or b != 0`.

Les mêmes déplacements servent à **avancer en ligne droite** : à partir d'une case, on ajoute le déplacement `(a, b)` encore et encore, tant que la case reste dans la grille. C'est ainsi qu'on parcourt toutes les cases qu'une tour ou une dame d'échecs peut atteindre. La fonction suivante compte les cases libres `.` traversées depuis `(i, j)` dans la direction `(a, b)`, jusqu'au bord ou au premier obstacle :

```python
def portee(g, i, j, a, b):
    n = len(g)
    m = len(g[0])
    k = 0
    x = i + a
    y = j + b
    while 0 <= x < n and 0 <= y < m and g[x][y] == ".":
        k = k + 1
        x = x + a
        y = y + b
    return k

g = [".....",
     ".#...",
     "....."]
print(portee(g, 0, 0, 0, 1), portee(g, 0, 0, 1, 0), portee(g, 0, 0, 1, 1), portee(g, 2, 4, -1, -1))
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int portee(const vector<string> &g, int i, int j, int a, int b) {
    int n = g.size();
    int m = g[0].size();
    int k = 0;
    int x = i + a;
    int y = j + b;
    while (0 <= x && x < n && 0 <= y && y < m && g[x][y] == '.') {
        k = k + 1;
        x = x + a;
        y = y + b;
    }
    return k;
}

int main() {
    vector<string> g = {".....",
                        ".#...",
                        "....."};
    cout << portee(g, 0, 0, 0, 1) << " " << portee(g, 0, 0, 1, 0) << " "
         << portee(g, 0, 0, 1, 1) << " " << portee(g, 2, 4, -1, -1) << "\n";
    return 0;
}
```

Le programme affiche `4 2 0 2`. Depuis le coin `(0, 0)`, vers la droite, les 4 autres cases de la ligne 0 sont libres ; vers le bas, la colonne 0 en compte 2 ; en diagonale, la première case, `(1, 1)`, est un mur. Depuis `(2, 4)` vers le haut à gauche, on traverse `(1, 3)` et `(0, 2)`, puis on sort de la grille. L'ordre des conditions du `while` compte : les bornes d'abord, la case ensuite, pour ne jamais lire une case qui n'existe pas.

## Simuler une étape

Dans une **simulation**, la grille évolue par étapes, et le nouvel état de chaque case dépend de l'ancien état de ses voisins. Il faut alors construire la nouvelle grille dans une **autre** grille. Si on modifiait la grille sur place, les cases examinées plus tard verraient des voisins déjà mis à jour, et non leur état au début de l'étape.

Pour partir d'une copie de la grille actuelle, attention : `h = g` ne copie rien. Comme pour les listes passées à une fonction, `h` devient un second nom pour la même grille. Même `list(g)` ne suffit pas : la nouvelle liste contient les mêmes lignes. Il faut copier **chaque ligne** : `h = [list(ligne) for ligne in g]`, une liste en compréhension qui fabrique une copie `list(ligne)` pour chaque ligne de `g`. En C++, au contraire, `vector<vector<int>> h = g;` fabrique une vraie copie complète, lignes comprises.

Une fois la nouvelle grille remplie, on remplace l'ancienne : `g = h`. Écrire une fonction `etape(g)` qui renvoie la nouvelle grille rend le programme très lisible : la boucle principale devient `for t in range(k): g = etape(g)`.

## Les erreurs fréquentes

**Sortir de la grille.** Lire `g[i + 1][j]` sur la dernière ligne provoque `IndexError: list index out of range`. On teste toujours `0 <= ni < n and 0 <= nj < m` **avant** de lire la case ; l'ordre compte, car `and` s'arrête dès que la première condition est fausse.

**L'indice -1.** Lire `g[i - 1][j]` sur la ligne 0 ne provoque **aucune** erreur en Python : l'indice -1 désigne le dernier élément. Le programme lit la dernière ligne de la grille comme si elle était au-dessus de la première, et donne une réponse fausse sans prévenir. C'est pour cela que la vérification `0 <= ni` est indispensable.

**En C++, aucune vérification.** `g[ni][nj]` hors de la grille ne produit pas de message clair : le programme lit une valeur quelconque ou s'arrête avec `Segmentation fault`. La vérification des bornes est encore plus importante.

**Échanger `n` et `m`, ou `i` et `j`.** Un programme qui écrit `range(n)` au lieu de `range(m)` pour les colonnes fonctionne sur une grille carrée et échoue sur une grille rectangulaire. On le teste toujours sur une grille avec `n ≠ m`.

**Modifier une chaîne.** Avec `g[i] = input()`, l'instruction `g[i][j] = "#"` provoque `TypeError: 'str' object does not support item assignment`. On lit les lignes avec `list(input())`.

**Les alias.** `[[0] * m] * n` et `h = g` ne créent pas de lignes indépendantes : une modification apparaît à plusieurs endroits à la fois.

## Exemple complet : un feu de forêt

**Énoncé.** Une forêt est une grille de `N` lignes et `M` colonnes. Chaque case contient un arbre `T`, un arbre en feu `F` ou une case vide `.`. Chaque minute, en même temps : un arbre qui a au moins un voisin en feu parmi ses 4 voisins prend feu, et un arbre en feu devient une case vide. Le programme lit `N`, `M` et `K` puis la grille, et affiche la forêt après `K` minutes.

**Idée.** C'est une simulation : chaque minute, on construit une nouvelle grille à partir de l'ancienne. Modifier sur place serait faux. Si on éteignait d'abord un feu en `(0, 0)`, son voisin `(0, 1)`, examiné juste après, ne le verrait plus et ne prendrait pas feu. Si au contraire on allumait `(0, 1)` dès qu'on le voit, la case `(0, 2)`, examinée ensuite, verrait ce nouveau feu et s'allumerait aussi : le feu traverserait toute la ligne en une minute. La fonction `etape` lit uniquement l'ancienne grille `g` et écrit uniquement dans la nouvelle `h`.

**Programme.**

```python
di = [-1, 1, 0, 0]
dj = [0, 0, -1, 1]

def etape(g):
    n = len(g)
    m = len(g[0])
    h = [list(ligne) for ligne in g]
    for i in range(n):
        for j in range(m):
            if g[i][j] == "F":
                h[i][j] = "."
            elif g[i][j] == "T":
                for d in range(4):
                    ni = i + di[d]
                    nj = j + dj[d]
                    if 0 <= ni < n and 0 <= nj < m and g[ni][nj] == "F":
                        h[i][j] = "F"
    return h

n, m, k = map(int, input().split())
g = []
for i in range(n):
    g.append(list(input()))
for t in range(k):
    g = etape(g)
for ligne in g:
    print("".join(ligne))
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int di[4] = {-1, 1, 0, 0};
int dj[4] = {0, 0, -1, 1};

vector<string> etape(const vector<string> &g) {
    int n = g.size();
    int m = g[0].size();
    vector<string> h = g;   // vraie copie en C++
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (g[i][j] == 'F') {
                h[i][j] = '.';
            } else if (g[i][j] == 'T') {
                for (int d = 0; d < 4; d++) {
                    int ni = i + di[d];
                    int nj = j + dj[d];
                    if (0 <= ni && ni < n && 0 <= nj && nj < m && g[ni][nj] == 'F') {
                        h[i][j] = 'F';
                    }
                }
            }
        }
    }
    return h;
}

int main() {
    int n, m, k;
    cin >> n >> m >> k;
    vector<string> g(n);
    for (int i = 0; i < n; i++) {
        cin >> g[i];
    }
    for (int t = 0; t < k; t++) {
        g = etape(g);
    }
    for (int i = 0; i < n; i++) {
        cout << g[i] << "\n";
    }
    return 0;
}
```

**Vérification à la main.** Avec `N = 3`, `M = 3` et la forêt ci-dessous à gauche, voici l'état après une minute, puis après deux minutes :

```
TTT      TFT      F.F
TFT      F.F      ...
TTT      TFT      F.F
```

Pendant la première minute, le feu central s'éteint, et ses quatre voisins directs prennent feu. Les coins ne touchent pas le centre par un côté : ils restent des arbres. Pendant la deuxième minute, chaque coin a deux voisins en feu et s'allume, tandis que les quatre feux s'éteignent. Avec `K = 3`, tout serait vide. Les diagonales ne comptent pas : c'est la définition des 4 voisins. Grâce à la vérification des bornes, le coin `(0, 0)` n'examine que ses deux voisins `(1, 0)` et `(0, 1)`.

## À retenir

- Une grille est une liste de lignes : `g[i][j]` est la case de la ligne `i` et de la colonne `j`. On a `n = len(g)` lignes et `m = len(g[0])` colonnes ; en C++, `vector<vector<int>>` ou `vector<string>`.
- Somme d'une ligne : `i` fixé, `j` varie. Somme d'une colonne : `j` fixé, `i` varie. Diagonales d'un carré : `g[i][i]` et `g[i][n - 1 - i]`.
- On crée une grille avec une nouvelle ligne par tour de boucle (`[[0] * m for i in range(n)]`), jamais avec `[[0] * m] * n`.
- Les voisins se parcourent avec deux listes de déplacements `di` et `dj` (4 ou 8 directions), et on vérifie `0 <= ni < n` et `0 <= nj < m` avant de lire la case.
- Pour simuler une étape, on lit l'ancienne grille et on écrit dans une nouvelle. En Python, on copie ligne par ligne (`[list(ligne) for ligne in g]`) ; en C++, `h = g` copie tout.
