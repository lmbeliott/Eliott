Dans un labyrinthe dessiné sur une grille, personne ne donne la liste des arêtes : on sait seulement que l'on peut passer d'une case à sa voisine si ce n'est pas un mur. Dans un casse-tête, on ne donne pas non plus de graphe : on donne une position de départ et des règles de déplacement. Pourtant, dans les deux cas, il y a bien un graphe caché : les sommets sont les situations possibles, et les arêtes relient deux situations quand une règle permet de passer de l'une à l'autre.

Un tel graphe s'appelle un **graphe implicite** : on ne le construit jamais, on calcule les voisins d'un sommet au moment où on en a besoin. Les parcours du chapitre précédent s'appliquent tels quels, avec les mêmes preuves. Ce chapitre montre comment les écrire sur des grilles, puis sur des espaces d'états plus abstraits, et comment estimer leur coût.

## Une grille est un graphe

Dans une grille de `R` lignes et `C` colonnes, chaque case `(i, j)` non murée est un sommet. Ses voisines sont les cases `(i + di, j + dj)` pour les décalages `(di, dj)` d'une liste fixée : avec les **4 voisins** (haut, bas, gauche, droite), la liste est `(-1, 0), (1, 0), (0, -1), (0, 1)`. Avant de regarder une voisine, on vérifie qu'elle est dans la grille et que ce n'est pas un mur.

Le programme suivant calcule, par un parcours en largeur depuis la case `S` en haut à gauche, la distance de chaque case, puis affiche la distance de la case `T` en bas à droite et le nombre de cases atteintes.

```python
from collections import deque

grille = ["S.#....",
          ".##.##.",
          "...#...",
          ".#...#.",
          "...#..T"]
r, c = len(grille), len(grille[0])
directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

dist = [[-1] * c for _ in range(r)]
dist[0][0] = 0                       # S est en haut à gauche
file = deque([(0, 0)])
while file:
    i, j = file.popleft()
    for di, dj in directions:
        ni, nj = i + di, j + dj
        if 0 <= ni < r and 0 <= nj < c and grille[ni][nj] != "#" and dist[ni][nj] == -1:
            dist[ni][nj] = dist[i][j] + 1
            file.append((ni, nj))

atteintes = sum(1 for i in range(r) for j in range(c) if dist[i][j] != -1)
print(dist[r - 1][c - 1], atteintes)
```

```cpp
#include <iostream>
#include <queue>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    vector<string> grille = {"S.#....",
                             ".##.##.",
                             "...#...",
                             ".#...#.",
                             "...#..T"};
    int r = grille.size(), c = grille[0].size();
    int di[4] = {-1, 1, 0, 0}, dj[4] = {0, 0, -1, 1};
    vector<vector<int>> dist(r, vector<int>(c, -1));
    dist[0][0] = 0;                      // S est en haut à gauche
    queue<pair<int, int>> file;
    file.push({0, 0});
    while (!file.empty()) {
        auto [i, j] = file.front();
        file.pop();
        for (int d = 0; d < 4; d++) {
            int ni = i + di[d], nj = j + dj[d];
            if (ni >= 0 && ni < r && nj >= 0 && nj < c && grille[ni][nj] != '#' && dist[ni][nj] == -1) {
                dist[ni][nj] = dist[i][j] + 1;
                file.push({ni, nj});
            }
        }
    }
    int atteintes = 0;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (dist[i][j] != -1) atteintes++;
    cout << dist[r - 1][c - 1] << " " << atteintes << "\n";
    return 0;
}
```

Le programme affiche `10 26` : `T` est à 10 déplacements de `S`, et les 26 cases libres sont toutes atteintes. Le sommet est ici le couple `(i, j)`, et le tableau de distances est un tableau à deux dimensions. On peut aussi coder la case par un seul entier `i × C + j`, compris entre `0` et `R × C − 1` : c'est utile pour ranger les cases dans un tableau à une dimension ou dans un dictionnaire.

**Coût.** Il y a au plus `R × C` sommets, et chacun a au plus 4 voisins : le parcours coûte O(R × C). Le même code donne les **8 voisins** (diagonales comprises) en ajoutant les décalages `(±1, ±1)`, ou les déplacements d'un cavalier avec les décalages `(±1, ±2)` et `(±2, ±1)`.

## Remplir une zone

Compter les îles d'une carte, les pièces d'un plan ou les régions d'une image revient à compter les **composantes connexes** du graphe de la grille. Cette opération s'appelle le **remplissage** (en anglais *flood fill*) : depuis une case pas encore vue, on « remplit » toute sa zone, et l'on compte combien de remplissages ont été nécessaires.

```python
def compter_iles(grille, directions):
    r, c = len(grille), len(grille[0])
    vu = [[False] * c for _ in range(r)]
    iles = 0
    for i in range(r):
        for j in range(c):
            if grille[i][j] == "#" and not vu[i][j]:
                iles += 1                    # nouvelle île : on la remplit
                vu[i][j] = True
                pile = [(i, j)]
                while pile:
                    x, y = pile.pop()
                    for dx, dy in directions:
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < r and 0 <= ny < c and grille[nx][ny] == "#" and not vu[nx][ny]:
                            vu[nx][ny] = True
                            pile.append((nx, ny))
    return iles

carte = ["##..#",
         "#..##",
         "..#..",
         ".#..#"]
quatre = [(-1, 0), (1, 0), (0, -1), (0, 1)]
huit = quatre + [(-1, -1), (-1, 1), (1, -1), (1, 1)]
print(compter_iles(carte, quatre), compter_iles(carte, huit))
```

```cpp
#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int compter_iles(const vector<string> &grille, const vector<pair<int, int>> &directions) {
    int r = grille.size(), c = grille[0].size();
    vector<vector<bool>> vu(r, vector<bool>(c, false));
    int iles = 0;
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (grille[i][j] != '#' || vu[i][j]) continue;
            iles++;                              // nouvelle île : on la remplit
            vu[i][j] = true;
            vector<pair<int, int>> pile = {{i, j}};
            while (!pile.empty()) {
                auto [x, y] = pile.back();
                pile.pop_back();
                for (auto [dx, dy] : directions) {
                    int nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < r && ny >= 0 && ny < c && grille[nx][ny] == '#' && !vu[nx][ny]) {
                        vu[nx][ny] = true;
                        pile.push_back({nx, ny});
                    }
                }
            }
        }
    }
    return iles;
}

int main() {
    vector<string> carte = {"##..#",
                            "#..##",
                            "..#..",
                            ".#..#"};
    vector<pair<int, int>> quatre = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    vector<pair<int, int>> huit = quatre;
    huit.insert(huit.end(), {{-1, -1}, {-1, 1}, {1, -1}, {1, 1}});
    cout << compter_iles(carte, quatre) << " " << compter_iles(carte, huit) << "\n";
    return 0;
}
```

Le programme affiche `5 3`. Avec 4 voisins, les cases `#` forment 5 îles ; avec 8 voisins, la case du milieu touche en diagonale celle d'en haut à droite et celle d'en bas à gauche, et trois îles se rejoignent. L'énoncé doit toujours préciser quel voisinage compte.

On utilise une pile explicite et non une fonction récursive « je marque la case, puis je m'appelle sur ses voisines » : sur une grille de 300 × 300 entièrement libre, cette récursion descendrait jusqu'à 90 000 appels imbriqués.

## Partir de plusieurs sources à la fois

Pour calculer, pour chaque case, la distance à la **plus proche** de plusieurs sources (le feu le plus proche, la sortie la plus proche), on ne lance pas un parcours par source : on met **toutes les sources dans la file au départ**, à distance 0, puis on fait un parcours en largeur ordinaire. C'est le **parcours à sources multiples**.

```python
from collections import deque

grille = ["F....",
          ".##..",
          "...#F",
          "#...."]
r, c = len(grille), len(grille[0])
dist = [[-1] * c for _ in range(r)]
file = deque()
for i in range(r):
    for j in range(c):
        if grille[i][j] == "F":          # toutes les sources, à distance 0
            dist[i][j] = 0
            file.append((i, j))
while file:
    i, j = file.popleft()
    for ni, nj in ((i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)):
        if 0 <= ni < r and 0 <= nj < c and grille[ni][nj] != "#" and dist[ni][nj] == -1:
            dist[ni][nj] = dist[i][j] + 1
            file.append((ni, nj))
for i in range(r):
    print("".join("#" if grille[i][j] == "#" else str(dist[i][j]) for j in range(c)))
```

```cpp
#include <iostream>
#include <queue>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int main() {
    vector<string> grille = {"F....",
                             ".##..",
                             "...#F",
                             "#...."};
    int r = grille.size(), c = grille[0].size();
    vector<vector<int>> dist(r, vector<int>(c, -1));
    queue<pair<int, int>> file;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (grille[i][j] == 'F') {           // toutes les sources, à distance 0
                dist[i][j] = 0;
                file.push({i, j});
            }
    int di[4] = {-1, 1, 0, 0}, dj[4] = {0, 0, -1, 1};
    while (!file.empty()) {
        auto [i, j] = file.front();
        file.pop();
        for (int d = 0; d < 4; d++) {
            int ni = i + di[d], nj = j + dj[d];
            if (ni >= 0 && ni < r && nj >= 0 && nj < c && grille[ni][nj] != '#' && dist[ni][nj] == -1) {
                dist[ni][nj] = dist[i][j] + 1;
                file.push({ni, nj});
            }
        }
    }
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (grille[i][j] == '#') cout << '#';
            else cout << dist[i][j];
        }
        cout << "\n";
    }
    return 0;
}
```

Le programme affiche :

```text
01232
1##21
234#0
#4321
```

**Pourquoi c'est juste.** On imagine un sommet fictif, relié à toutes les sources. Un parcours en largeur depuis ce sommet met toutes les sources à distance 1 dans la file, puis continue exactement comme notre programme. Sa distance à une case vaut 1 de plus que la distance de la case à la source la plus proche : la preuve du chapitre précédent s'applique donc telle quelle. Le coût reste O(R × C), quel que soit le nombre de sources, au lieu d'un parcours complet par source.

## Les espaces d'états

Dans beaucoup de problèmes, le sommet n'est pas une case, mais une **situation** complète. On appelle **état** la description de tout ce qui compte à un instant donné, et **espace d'états** l'ensemble des états possibles ; les **transitions** (les coups permis) sont les arêtes. La question « combien de coups au minimum ? » devient une distance, et se résout par un parcours en largeur.

Exemple : une calculatrice n'a que deux touches, `×2` et `−3`. On part de `1` et l'on veut afficher `5` en appuyant le moins de fois possible, sans jamais sortir de l'intervalle de 1 à 1 000. L'état est le nombre affiché ; ses deux voisins sont `2x` et `x − 3`. Un dictionnaire `parent` sert à la fois de marquage et de mémoire du chemin.

```python
from collections import deque

LIMITE = 1000
cible = 5
parent = {1: None}                   # dictionnaire : état -> état précédent
file = deque([1])
while file:
    x = file.popleft()
    if x == cible:
        break
    for y in (2 * x, x - 3):
        if 1 <= y <= LIMITE and y not in parent:
            parent[y] = x
            file.append(y)

chemin = [cible]
while parent[chemin[-1]] is not None:
    chemin.append(parent[chemin[-1]])
chemin.reverse()
print(len(chemin) - 1, chemin)
```

```cpp
#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    const int LIMITE = 1000;
    int cible = 5;
    vector<int> parent(LIMITE + 1, -1);   // -1 : pas encore atteint
    parent[1] = 0;                         // 0 : pas de précédent
    queue<int> file;
    file.push(1);
    while (!file.empty()) {
        int x = file.front();
        file.pop();
        if (x == cible) break;
        for (int y : {2 * x, x - 3}) {
            if (y >= 1 && y <= LIMITE && parent[y] == -1) {
                parent[y] = x;
                file.push(y);
            }
        }
    }
    vector<int> chemin = {cible};
    while (parent[chemin.back()] != 0) chemin.push_back(parent[chemin.back()]);
    reverse(chemin.begin(), chemin.end());
    cout << chemin.size() - 1 << " [";
    for (int i = 0; i < (int)chemin.size(); i++) cout << (i ? ", " : "") << chemin[i];
    cout << "]\n";
    return 0;
}
```

Le programme affiche `4 [1, 2, 4, 8, 5]` : il faut passer par 8 pour redescendre à 5. On s'arrête dès que la cible sort de la file, puisque les états sortent par distances croissantes.

La borne `LIMITE` est indispensable : sans elle, la touche `×2` produit des nombres de plus en plus grands, l'espace d'états est infini, et un parcours qui ne trouve pas la cible ne s'arrête jamais. Quand on borne l'espace, il faut justifier que la borne ne fait pas perdre de solution, ou qu'elle fait partie de l'énoncé.

**Coder un état.** Un état formé de plusieurs nombres se range dans un **tuple** (Python) ou une `pair`, un `array` (C++), qui peut servir de clé de dictionnaire. Quand les composantes sont petites, on préfère le coder par un seul entier, qui indexe un simple tableau de marquage, bien plus rapide qu'un dictionnaire. Un cadenas à 3 molettes est l'entier de 0 à 999 qu'il affiche. Une case `(i, j)` et un nombre `k` de `0` à `K − 1` deviennent `(k × R + i) × C + j`, un entier de `0` à `K × R × C − 1` ; deux états différents ont des codes différents, car on retrouve `j = code % C`, `i = code // C % R` et `k = code // (R × C)`.

**Choisir un état complet.** L'état doit contenir tout ce qui influence la suite. Dans un labyrinthe avec des portes et des clés, la position ne suffit pas : revenir sur une case après avoir ramassé une clé est un vrai progrès. L'état est alors le couple (position, ensemble des clés ramassées). Pour un dé qui roule sur une grille, c'est (position, orientation du dé). Un état incomplet donne des réponses fausses ; un état trop riche rend l'espace trop grand.

## Un ensemble codé par un entier

Pour les clés, il reste à coder un **ensemble** par un nombre. On numérote les éléments possibles de `0` à `n − 1` (la clé `a` est 0, la clé `b` est 1…) et l'on écrit l'ensemble en binaire, sur `n` chiffres : le chiffre de rang `k`, appelé **bit** `k`, vaut 1 si l'élément `k` est dans l'ensemble. L'entier obtenu s'appelle un **masque**. Par exemple, l'ensemble `{0, 2, 3}` s'écrit `1101` en binaire, soit 2⁰ + 2² + 2³ = 13. Les `2^n` ensembles possibles correspondent exactement aux entiers de `0` (l'ensemble vide) à `2^n − 1` (tous les éléments) : avec 6 clés, un masque va de 0 à 63.

Trois opérations, qui s'écrivent de la même façon en Python et en C++, suffisent :
- `1 << k` (décalage à gauche de `k` rangs) vaut 2^k : c'est le masque de l'ensemble `{k}` ;
- `m >> k & 1` vaut le bit `k` de `m` : `m >> k` est le quotient de `m` par 2^k, ce qui efface les `k` derniers bits, et `& 1` garde le dernier bit, comme `% 2` ;
- `m | (1 << k)` ajoute `k` à l'ensemble : le « ou » bit à bit `|` met à 1 chaque bit qui vaut 1 dans l'un des deux nombres. Si `k` était déjà dans l'ensemble, `m` ne change pas.

```python
m = 0                          # ensemble vide
for k in (3, 0, 2, 3):         # on ajoute 3, 0, 2, puis 3 une deuxième fois
    m = m | (1 << k)
print(m, [k for k in range(6) if m >> k & 1])
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int m = 0;                              // ensemble vide
    for (int k : {3, 0, 2, 3})              // on ajoute 3, 0, 2, puis 3 une deuxième fois
        m = m | (1 << k);
    cout << m << " [";
    bool premier = true;
    for (int k = 0; k < 6; k++) {
        if (m >> k & 1) {
            cout << (premier ? "" : ", ") << k;
            premier = false;
        }
    }
    cout << "]\n";
    return 0;
}
```

Le programme affiche `13 [0, 2, 3]`. Dans un labyrinthe à clés, l'état `(i, j, clés)` est codé par `(clés × R + i) × C + j` et indexe un tableau de `64 × R × C` cases. Ramasser la clé `k` donne l'ensemble `clés | (1 << k)` ; une porte de la lettre `k` s'ouvre si `clés >> k & 1` vaut 1.

## La taille de l'espace d'états

Un parcours visite chaque état au plus une fois et examine toutes ses transitions : son coût est **le nombre d'états multiplié par le nombre de transitions par état**. Avant de programmer, on estime donc ce nombre :

- un cadenas à `K` molettes a `10^K` états et `2K` transitions par état : 8 × 10⁴ examens pour `K = 4`, mais 1,6 × 10⁹ pour `K = 8` ;
- les ordres possibles de `N` objets forment `N!` états : 40 320 pour `N = 8`, mais plus de 3,6 millions pour `N = 10` ;
- une grille de 40 × 40 avec 6 clés possibles donne 40 × 40 × 2⁶ = 102 400 états.

En Python, quelques millions d'examens prennent déjà plusieurs secondes : au-delà, il faut une meilleure idée. Souvent, une propriété du problème réduit l'espace **réellement atteint**. Avec deux récipients de 50 000 litres qu'on remplit, vide et transvase, il y a 2,5 × 10⁹ couples de contenus possibles, mais après chaque opération l'un des récipients est vide ou plein : au plus 200 000 états sont atteints, ceux du bord du rectangle des contenus. On range alors les états atteints dans un dictionnaire ou un ensemble, au lieu d'un tableau qui couvrirait tout l'espace.

Une dernière remarque est souvent décisive. Si chaque transition peut être défaite (tourner une molette dans l'autre sens, retourner à nouveau les mêmes crêpes), le graphe est non orienté : la distance de `A` à `B` est celle de `B` à `A`. Pour répondre à beaucoup de questions « combien de coups de `X` jusqu'à la position finale ? », un **seul** parcours depuis la position finale suffit.

## Les erreurs fréquentes

**Les indices négatifs de Python.** `grille[i - 1][j]` avec `i = 0` ne provoque **aucune** erreur en Python : l'indice `-1` désigne la dernière ligne. Le parcours passe alors à travers le bord de la grille et donne une réponse fausse sans message. Il faut tester `0 <= ni < r` **avant** de lire la case. En C++, lire hors du tableau donne une valeur quelconque ou un `Segmentation fault`.

**Marquer trop tard.** Comme dans tout parcours en largeur, on marque un état quand il entre dans la file. Sinon, un même état peut y entrer des milliers de fois, et le programme dépasse le temps limite.

**Un ensemble de visités dans une liste.** Tester `etat in visites` sur une liste Python parcourt toute la liste : le parcours devient quadratique. On utilise un `set`, un dictionnaire, ou mieux, un tableau indexé par le code entier de l'état.

**Les priorités des opérateurs de bits.** En C++, le test « `k` n'est pas dans `m` » écrit `if (m >> k & 1 == 0)` se lit `if (m >> k & (1 == 0))`, car la comparaison passe avant le `&` : il est toujours faux. On écrit `if ((m >> k & 1) == 0)`. En C++ encore, `1 << k` est un `int` : pour `k ≥ 31`, il faut `1LL << k`.

**Un espace infini ou trop grand.** Sans borne sur les valeurs, le parcours ne s'arrête pas et finit par `MemoryError`. Avec un état trop riche, il est correct mais trop lent : on recompte les états avant de programmer.

**Le remplissage récursif.** Sur une grande zone, il dépasse la profondeur de récursion : `RecursionError` en Python, `Segmentation fault` en C++. On utilise une file ou une pile.

## Exemple complet : le cadenas

**Énoncé.** Un cadenas a 3 molettes, chacune affichant un chiffre de 0 à 9 ; il affiche donc un code de `000` à `999`, et il montre `000` au départ. Un coup consiste à tourner une molette d'un cran, vers le haut ou vers le bas (après 9 vient 0, et avant 0 vient 9). Certains codes sont interdits : le cadenas se bloque s'il les affiche. Calculer le nombre minimal de coups pour afficher le code cible, ou `-1`. L'entrée donne la cible, puis le nombre `K` de codes interdits, puis ces codes.

**Idée.** Un état est le code affiché, vu comme un entier de 0 à 999. Ses 6 voisins s'obtiennent en changeant un chiffre : le chiffre de poids `p` (1, 10 ou 100) vaut `x // p % 10`, et le remplacer par `n` donne `x + (n − chiffre) × p`. Un parcours en largeur depuis 0, qui refuse les codes interdits, donne la réponse.

```python
from collections import deque

cible = int(input())
k = int(input())
interdits = set(map(int, input().split())) if k > 0 else set()

def voisins(x):
    # tourner une des 3 molettes d'un cran, dans un sens ou dans l'autre
    res = []
    for p in (1, 10, 100):
        chiffre = x // p % 10
        for nouveau in ((chiffre + 1) % 10, (chiffre + 9) % 10):
            res.append(x + (nouveau - chiffre) * p)
    return res

dist = [-1] * 1000
if 0 not in interdits:
    dist[0] = 0
    file = deque([0])
    while file:
        x = file.popleft()
        for y in voisins(x):
            if dist[y] == -1 and y not in interdits:
                dist[y] = dist[x] + 1
                file.append(y)
print(dist[cible])
```

```cpp
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int cible, k;
    cin >> cible >> k;
    vector<bool> interdit(1000, false);
    for (int i = 0; i < k; i++) {
        int x;
        cin >> x;
        interdit[x] = true;
    }
    vector<int> dist(1000, -1);
    if (!interdit[0]) {
        dist[0] = 0;
        queue<int> file;
        file.push(0);
        while (!file.empty()) {
            int x = file.front();
            file.pop();
            // tourner une des 3 molettes d'un cran, dans un sens ou dans l'autre
            for (int p : {1, 10, 100}) {
                int chiffre = x / p % 10;
                for (int nouveau : {(chiffre + 1) % 10, (chiffre + 9) % 10}) {
                    int y = x + (nouveau - chiffre) * p;
                    if (dist[y] == -1 && !interdit[y]) {
                        dist[y] = dist[x] + 1;
                        file.push(y);
                    }
                }
            }
        }
    }
    cout << dist[cible] << "\n";
    return 0;
}
```

**Vérification à la main.** Avec la cible `008` et le seul code interdit `009`, on aimerait descendre directement : `000 → 009 → 008`, mais `009` est interdit. Monter jusqu'à 8 coûte 8 coups. Le parcours trouve mieux : `000 → 010 → 019 → 018 → 008`, en 4 coups, en passant par une autre molette pour contourner l'interdit. Le programme affiche `4`. Avec la cible `123` et les interdits `100`, `010` et `001`, tout premier coup vers le haut est bloqué ; le programme affiche `8`, deux de plus que les 6 coups habituels.

**Correction et coût.** Le graphe implicite a 1 000 sommets ; deux codes sont reliés s'ils diffèrent d'un cran sur une molette. Le parcours en largeur calcule les distances exactes d'après la preuve du chapitre précédent. Il examine au plus 1 000 × 6 transitions.

## À retenir

- Un **graphe implicite** n'est jamais construit : on calcule les voisins d'un sommet au moment de le traiter. Les parcours et leurs preuves s'appliquent sans changement.
- Sur une grille, les voisins s'obtiennent avec une liste de **décalages** (4 voisins, 8 voisins, cavalier) ; on vérifie les **bords avant** de lire la case, surtout en Python où l'indice `-1` est valide.
- Le **remplissage** compte les zones d'une grille ; on l'écrit avec une pile ou une file, pas en récursif.
- Le **parcours à sources multiples** met toutes les sources dans la file au départ : un seul parcours donne la distance à la source la plus proche.
- Un **état** décrit tout ce qui compte (position, clés, orientation…) ; on le code par un tuple ou, mieux, par un **entier** qui indexe un tableau de marquage. Un ensemble devient un **masque** : `1 << k`, `m >> k & 1`, `m | (1 << k)`.
- Le coût d'un parcours est **nombre d'états × transitions par état** : on l'estime avant de programmer, on borne l'espace, et l'on ne stocke que les états atteints quand l'espace est immense.
