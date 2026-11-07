Un plan de ville, un plateau de jeu, une image faite de pixels : beaucoup de problèmes se passent sur une **grille**, c'est-à-dire un tableau à deux dimensions, avec des lignes et des colonnes.

## Lire une grille

Dans les problèmes, une grille est donnée sous la forme de `H` lignes de `W` caractères, par exemple `.` pour une case libre et `#` pour un mur :

```text
3 5
..#..
.##..
.....
```

On range chaque ligne dans une liste. La case de la ligne `i` et de la colonne `j` est alors `grille[i][j]` : d'abord la ligne, puis la colonne. Les numéros commencent à `0`, la ligne `0` est **en haut** et la colonne `0` **à gauche**.

```python
h, w = map(int, input().split())
grille = []
for _ in range(h):
    grille.append(input())
print(grille[0][2])   # # : ligne 0, colonne 2
```

```cpp
int h, w;
cin >> h >> w;
vector<string> grille(h);
for (int i = 0; i < h; i++) {
    cin >> grille[i];
}
cout << grille[0][2] << "\n";   // # : ligne 0, colonne 2
```

## Parcourir toutes les cases

Pour visiter chaque case, on imbrique deux boucles : une sur les lignes, une sur les colonnes. Ici, on compte les murs :

```python
murs = 0
for i in range(h):
    for j in range(w):
        if grille[i][j] == "#":
            murs += 1
print(murs)
```

```cpp
int murs = 0;
for (int i = 0; i < h; i++) {
    for (int j = 0; j < w; j++) {
        if (grille[i][j] == '#') {
            murs++;
        }
    }
}
cout << murs << "\n";
```

La même double boucle permet de **trouver une case** : quand `grille[i][j]` vaut le caractère cherché, on retient `i` et `j`.

## Une grille que l'on modifie

Souvent, on a besoin d'une deuxième grille pour noter des informations : les cases déjà visitées, un compteur par case… On la crée de la même taille, remplie d'une valeur de départ.

```python
vue = []
for i in range(h):
    vue.append([False] * w)
vue[1][3] = True
```

```cpp
vector<vector<bool>> vue(h, vector<bool>(w, false));
vue[1][3] = true;
```

En Python, éviter `[[False] * w] * h` : cela crée `h` fois **la même** ligne, et modifier une case modifierait toute la colonne. Autre détail : on ne peut pas changer un caractère d'une chaîne Python. Pour modifier la grille elle-même, on lit chaque ligne avec `list(input())`, ce qui donne une liste de caractères. En C++, un `vector<string>` se modifie directement, et on peut aussi utiliser un `vector<vector<char>>`.

## Les voisins d'une case

Les quatre voisines de la case `(i, j)` sont celle du dessus `(i - 1, j)`, du dessous `(i + 1, j)`, de gauche `(i, j - 1)` et de droite `(i, j + 1)`. Plutôt que d'écrire quatre fois le même code, on range les quatre **décalages** dans une liste et on boucle dessus.

Attention aux bords : une case du bord a des voisines qui sortent de la grille. Il faut **toujours** vérifier qu'une case est dans la grille avant de la lire. En Python, c'est d'autant plus traître que `grille[-1]` ne provoque pas d'erreur : c'est la dernière ligne.

```python
nb = 0   # nombre de murs voisins de la case (i, j)
for dl, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
    vl = i + dl
    vc = j + dc
    if 0 <= vl < h and 0 <= vc < w and grille[vl][vc] == "#":
        nb += 1
```

```cpp
int dl[4] = {-1, 1, 0, 0};
int dc[4] = {0, 0, -1, 1};
int nb = 0;   // nombre de murs voisins de la case (i, j)
for (int d = 0; d < 4; d++) {
    int vl = i + dl[d];
    int vc = j + dc[d];
    if (vl >= 0 && vl < h && vc >= 0 && vc < w && grille[vl][vc] == '#') {
        nb++;
    }
}
```

Le test des bornes est écrit **avant** la lecture de la case : avec `and` (ou `&&`), si une condition est fausse, les suivantes ne sont même pas évaluées.

Pour les huit voisines (diagonales comprises), on fait deux boucles sur `dl` et `dc` allant de `-1` à `1`, en sautant le cas `dl = dc = 0`, qui est la case elle-même.

## Se déplacer dans une grille

Pour faire avancer un robot ou un pion, on garde sa position `(l, c)` et sa direction sous la forme d'un décalage `(dl, dc)` : `(-1, 0)` pour monter, `(1, 0)` pour descendre, `(0, -1)` pour aller à gauche, `(0, 1)` pour aller à droite. Un pas, c'est `l += dl` et `c += dc`. Avant de bouger, on vérifie que la case d'arrivée est dans la grille et qu'elle est libre.

## À retenir

- `grille[i][j]` : la ligne `i` d'abord, puis la colonne `j`, en partant de `0` en haut à gauche.
- Deux boucles imbriquées parcourent toutes les cases.
- Avant de lire une case voisine, toujours vérifier qu'elle est dans la grille.
- Une liste de décalages `(dl, dc)` évite de recopier quatre fois le même code.
- Une deuxième grille (de booléens, de compteurs…) permet de noter ce qu'on a déjà vu.
