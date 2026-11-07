Un magasin a noté sa recette de chaque jour pendant un an, et l'on veut répondre à mille questions du type « combien a-t-il gagné du jour 40 au jour 200 ? ». Additionner les jours concernés pour chaque question demande jusqu'à 365 additions par question. Un seul passage préparatoire sur les données suffit pourtant à répondre ensuite à chaque question avec **une seule soustraction**.

Ce chapitre présente des techniques de **balayage** : on parcourt les données une fois, dans l'ordre, en tenant à jour quelques informations bien choisies. Les sommes préfixes et le tableau des différences préparent un tableau qui répond ensuite instantanément. Les deux pointeurs et la fenêtre glissante font avancer deux indices dans le même sens, sans jamais revenir en arrière. Dans chaque cas, on remplace un travail de l'ordre de `n²` opérations par un travail de l'ordre de `n`, et l'on justifie à la fois que le résultat est juste et que le nombre d'opérations est bien celui annoncé.

## Les sommes préfixes

Soit un tableau `t` de `n` nombres, numérotés de 0 à `n − 1`. Son tableau des **sommes préfixes** `P` a `n + 1` cases : `P[0] = 0`, et `P[i]` est la somme des `i` premiers éléments, `t[0] + … + t[i − 1]`. On le remplit en un passage, puisque `P[i + 1] = P[i] + t[i]`.

La somme d'une **portion** `t[a], t[a + 1], …, t[b]` (des cases consécutives) vaut alors `P[b + 1] − P[a]` : dans `P[b + 1] = t[0] + … + t[b]`, on retire les `a` premiers termes, dont la somme est `P[a]`.

```python
t = [3, -1, 4, 1, 5, 9, 2, 6]
n = len(t)
p = [0] * (n + 1)
for i in range(n):
    p[i + 1] = p[i] + t[i]
print(p)
print(p[6] - p[2])
print(p[1] - p[0])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<long long> t = {3, -1, 4, 1, 5, 9, 2, 6};
    int n = t.size();
    vector<long long> p(n + 1, 0);
    for (int i = 0; i < n; i++) {
        p[i + 1] = p[i] + t[i];
    }
    for (long long x : p) {
        cout << x << " ";
    }
    cout << "\n";
    cout << p[6] - p[2] << "\n";
    cout << p[1] - p[0] << "\n";
    return 0;
}
```

Le programme affiche `[0, 3, 2, 6, 7, 12, 21, 23, 29]`, puis `19`, la somme de `t[2]` à `t[5]` (4 + 1 + 5 + 9), puis `3`, la portion réduite à `t[0]`. La case `P[0] = 0` évite un cas particulier pour les portions qui commencent au début.

**Coût.** La préparation fait `n` additions, puis chaque question coûte une soustraction. Pour `q` questions, on fait environ `n + q` opérations, au lieu de `n × q` dans le pire cas en additionnant à chaque fois. Pour `n = q = 100 000`, c'est 200 000 opérations au lieu de 10 milliards.

La même idée sert à **compter**. Si `C[i]` est le nombre d'éléments parmi les `i` premiers qui ont une propriété (être pair, être un multiple de 7, valoir 0…), le nombre d'éléments de la portion `[a, b]` qui l'ont vaut `C[b + 1] − C[a]`. Une égalité de sommes préfixes a aussi un sens : `P[b + 1] = P[a]` signifie que la portion `[a, b]` a une somme nulle. Beaucoup de problèmes sur les portions se ramènent ainsi à des questions sur des paires de sommes préfixes.

## Les sommes préfixes en deux dimensions

Pour une grille `g` de `n` lignes et `m` colonnes, on note `S[i][j]` la somme du rectangle formé des lignes `0` à `i − 1` et des colonnes `0` à `j − 1`, avec une ligne et une colonne de zéros (`S[0][j] = S[i][0] = 0`). Le rectangle `S[i][j]` se découpe en celui du dessus, `S[i − 1][j]`, et celui de gauche, `S[i][j − 1]`, qui se chevauchent sur `S[i − 1][j − 1]`, plus la case `g[i − 1][j − 1]`. D'où :

`S[i][j] = S[i − 1][j] + S[i][j − 1] − S[i − 1][j − 1] + g[i − 1][j − 1]`.

Le même raisonnement, appelé **inclusion-exclusion**, donne la somme du rectangle des lignes `a` à `b` et des colonnes `c` à `d` (inclus) : `S[b + 1][d + 1] − S[a][d + 1] − S[b + 1][c] + S[a][c]`. On retire les deux bandes du dessus et de gauche, et l'on rajoute leur coin commun, retiré deux fois.

```python
g = [[1, 2, 0, 3],
     [4, 0, 1, 1],
     [2, 5, 2, 0]]
n, m = 3, 4
s = []
for i in range(n + 1):
    s.append([0] * (m + 1))
for i in range(1, n + 1):
    for j in range(1, m + 1):
        s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + g[i - 1][j - 1]
# lignes 1 à 2, colonnes 0 à 2
print(s[3][3] - s[1][3] - s[3][0] + s[1][0])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<vector<int>> g = {{1, 2, 0, 3}, {4, 0, 1, 1}, {2, 5, 2, 0}};
    int n = 3, m = 4;
    vector<vector<int>> s(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + g[i - 1][j - 1];
        }
    }
    // lignes 1 à 2, colonnes 0 à 2
    cout << s[3][3] - s[1][3] - s[3][0] + s[1][0] << "\n";
    return 0;
}
```

Le programme affiche `14` : 4 + 0 + 1 + 2 + 5 + 2. La préparation coûte `n × m` opérations, puis chaque rectangle se calcule avec quatre lectures, quelle que soit sa taille.

## Le tableau des différences

C'est le problème inverse : on doit **ajouter** une valeur `v` à toutes les cases d'une portion `[a, b]`, de nombreuses fois, puis lire le tableau final. Au lieu de modifier toutes les cases, on note seulement le début et la fin de chaque ajout dans un **tableau des différences** `D` de taille `n + 1` : `D[a] += v` et `D[b + 1] −= v`. À la fin, la valeur de la case `i` est la somme préfixe `D[0] + D[1] + … + D[i]`.

```python
n = 8
d = [0] * (n + 1)
ajouts = [(1, 4, 5), (3, 7, 2), (0, 0, 10)]
for a, b, v in ajouts:
    d[a] = d[a] + v
    d[b + 1] = d[b + 1] - v
t = []
c = 0
for i in range(n):
    c = c + d[i]
    t.append(c)
print(*t)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n = 8;
    vector<long long> d(n + 1, 0);
    int ajouts[3][3] = {{1, 4, 5}, {3, 7, 2}, {0, 0, 10}};
    for (int k = 0; k < 3; k++) {
        int a = ajouts[k][0], b = ajouts[k][1], v = ajouts[k][2];
        d[a] += v;
        d[b + 1] -= v;
    }
    long long c = 0;
    for (int i = 0; i < n; i++) {
        c += d[i];
        cout << c << " ";
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche `10 5 5 7 7 2 2 2`. **Pourquoi** : dans la somme `D[0] + … + D[i]`, un ajout `(a, b, v)` apporte `+v` si `a ≤ i`, et `−v` si `b + 1 ≤ i`. Il reste `+v` exactement quand `a ≤ i ≤ b`, c'est-à-dire quand la case `i` est dans la portion. **Coût** : deux opérations par ajout, puis un passage : environ `m + n` opérations pour `m` ajouts, au lieu de `m × n`.

Les deux techniques sont inverses l'une de l'autre : le tableau des différences de `P` est `t`, et le tableau des sommes préfixes de `D` est le tableau final. C'est l'analogue discret de la dérivée et de l'intégrale.

## Deux pointeurs sur un tableau trié

Dans un tableau **trié** `t[0] ≤ t[1] ≤ … ≤ t[n − 1]`, on cherche deux positions `g < d` telles que `t[g] + t[d] = S`. Tester toutes les paires coûte `n² / 2` opérations. On place plutôt un indice `g` au début et un indice `d` à la fin, et on les rapproche :

- si `t[g] + t[d] < S`, la case `g` ne peut faire partie d'aucune solution avec un `d' ≤ d`, puisque `t[g] + t[d'] ≤ t[g] + t[d] < S` : on avance `g` ;
- si `t[g] + t[d] > S`, de même la case `d` est inutile : on recule `d` ;
- sinon, on a trouvé.

```python
t = [1, 3, 4, 6, 8, 11, 15]
S = 14
g = 0
d = len(t) - 1
trouve = False
while g < d and not trouve:
    if t[g] + t[d] < S:
        g = g + 1
    elif t[g] + t[d] > S:
        d = d - 1
    else:
        trouve = True
if trouve:
    print(t[g], t[d])
else:
    print("AUCUNE")
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {1, 3, 4, 6, 8, 11, 15};
    int S = 14;
    int g = 0, d = t.size() - 1;
    bool trouve = false;
    while (g < d && !trouve) {
        if (t[g] + t[d] < S) {
            g++;
        } else if (t[g] + t[d] > S) {
            d--;
        } else {
            trouve = true;
        }
    }
    if (trouve) {
        cout << t[g] << " " << t[d] << "\n";
    } else {
        cout << "AUCUNE\n";
    }
    return 0;
}
```

Le programme affiche `3 11`. Les paires examinées sont `(1, 15)` : trop grand ; `(1, 11)` : trop petit ; `(3, 11)` : trouvé.

**Pourquoi c'est juste.** Invariant : *si une solution existe, il en existe une avec ses deux positions entre `g` et `d`*. Il est vrai au départ, et chaque déplacement n'écarte qu'une case dont on a montré qu'elle n'appartient à aucune solution restante. Si la boucle s'arrête avec `g = d`, il ne reste aucune paire, donc il n'y avait pas de solution. **Coût** : `d − g` diminue de 1 à chaque tour, donc au plus `n − 1` tours. Tout repose sur le tri : sur un tableau quelconque, écarter une case n'est plus justifié.

## La fenêtre glissante

Une **fenêtre** est une portion `[g, d]` dont on fait avancer les deux bords vers la droite, sans jamais les faire reculer. On l'utilise quand la propriété cherchée est **monotone** : si une portion convient, toutes les portions qu'elle contient conviennent aussi (ou l'inverse). Exemple : dans un tableau de nombres **strictement positifs**, trouver la plus courte portion de somme au moins `S`.

On avance `d` d'une case à la fois en ajoutant `t[d]` à la somme de la fenêtre. Tant que cette somme atteint `S`, la fenêtre `[g, d]` convient : on note sa longueur, puis on retire `t[g]` et on avance `g` pour essayer plus court.

```python
t = [2, 1, 5, 2, 3, 2]
S = 7
g = 0
somme = 0
meilleure = len(t) + 1
for d in range(len(t)):
    somme = somme + t[d]
    while somme >= S:
        meilleure = min(meilleure, d - g + 1)
        somme = somme - t[g]
        g = g + 1
if meilleure == len(t) + 1:
    print("AUCUNE")
else:
    print(meilleure)
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {2, 1, 5, 2, 3, 2};
    int S = 7;
    int n = t.size();
    int g = 0, somme = 0, meilleure = n + 1;
    for (int d = 0; d < n; d++) {
        somme += t[d];
        while (somme >= S) {
            meilleure = min(meilleure, d - g + 1);
            somme -= t[g];
            g++;
        }
    }
    if (meilleure == n + 1) {
        cout << "AUCUNE\n";
    } else {
        cout << meilleure << "\n";
    }
    return 0;
}
```

Le programme affiche `2` : la portion `5 2`.

**Pourquoi c'est juste.** Les valeurs étant positives, raccourcir une portion diminue sa somme. Quand `d` est fixé, la boucle `while` avance `g` tant que `[g, d]` convient : elle examine toutes les portions valides qui finissent en `d` et dont le début est au moins `g`. Une portion `[g', d]` avec `g' < g` n'a pas besoin d'être examinée : `g` a dépassé `g'` à un moment où `[g', d']` convenait, pour un `d' ≤ d`, et cette portion, au moins aussi courte, a déjà été notée. **Coût** : `d` avance `n` fois et `g` avance au plus `n` fois au total, car il ne recule jamais : au plus `2n` étapes, même si un seul tour de `for` peut faire avancer `g` de beaucoup. Avec des valeurs négatives, la propriété n'est plus monotone et la méthode donne des réponses fausses.

## Erreurs fréquentes

**Le décalage d'indice.** Avec `P[0] = 0`, la somme de `t[a..b]` est `P[b + 1] − P[a]`. Écrire `P[b] − P[a]` oublie `t[b]`, sans aucun message d'erreur. Il faut vérifier la formule sur une portion d'une seule case.

**Un tableau des différences trop court.** Pour un ajout qui va jusqu'à la dernière case, on écrit en `D[n]`. Avec un tableau de taille `n`, Python affiche `IndexError: list index out of range` ; en C++, le programme écrit hors du tableau sans prévenir.

**Le coin oublié en deux dimensions.** Sans le terme `+ S[a][c]`, le coin commun est retiré deux fois : le résultat est faux, sans message.

**Le dépassement de capacité en C++.** Une somme préfixe de 100 000 valeurs jusqu'à 10⁹ atteint 10¹⁴ : un `int` déborde et donne des nombres absurdes, parfois négatifs. On utilise `long long` pour `P`.

**Une fenêtre sur des valeurs négatives.** Avec `t = [5, -10, 6]` et `S = 6`, la fenêtre `[0, 2]` a pour somme 1, qui n'atteint jamais `S` : le début n'avance pas, et le programme affiche `AUCUNE` alors que la portion `6` seule convient. La fenêtre glissante exige une propriété monotone ; sinon, on passe par les sommes préfixes.

**Deux pointeurs sur un tableau non trié.** Le raisonnement qui écarte une case suppose le tri : on trie d'abord.

## Un exemple complet

**Énoncé.** `N` arbres sont plantés le long d'un chemin, aux positions `X₁, …, X_N` (des entiers, dans le désordre). Compter les paires d'arbres distants d'au plus `D` mètres. `N` peut atteindre 100 000.

**Idée.** Tester les paires coûte 5 milliards d'opérations. On trie les positions. Pour chaque arbre `d`, les arbres placés avant lui et à distance au plus `D` forment un bloc `g, g + 1, …, d − 1` qui finit juste avant lui : on maintient le début `g` de ce bloc, qui ne recule jamais quand `d` avance.

**Programme.**

```python
n, dist = map(int, input().split())
x = list(map(int, input().split()))
x.sort()
paires = 0
g = 0
for d in range(n):
    while x[d] - x[g] > dist:
        g = g + 1
    paires = paires + (d - g)
print(paires)
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    long long dist;
    cin >> n >> dist;
    vector<long long> x(n);
    for (int i = 0; i < n; i++) {
        cin >> x[i];
    }
    sort(x.begin(), x.end());
    long long paires = 0;
    int g = 0;
    for (int d = 0; d < n; d++) {
        while (x[d] - x[g] > dist) {
            g++;
        }
        paires += d - g;
    }
    cout << paires << "\n";
    return 0;
}
```

**Vérification à la main.** Avec `6 3` puis `10 1 4 12 2 8`, les positions triées sont `1 2 4 8 10 12`. Pour `d = 0` (1), aucune paire. Pour 2 : `g = 0`, une paire. Pour 4 : `4 − 1 = 3 ≤ 3`, donc `g = 0` et deux paires. Pour 8 : `g` avance jusqu'à la position de 8, aucune paire. Pour 10 : `g` s'arrête sur 8, une paire. Pour 12 : `12 − 8 = 4 > 3`, `g` passe sur 10, une paire. Le programme affiche `5` : les paires `(1, 2)`, `(1, 4)`, `(2, 4)`, `(8, 10)` et `(10, 12)`.

**Pourquoi c'est juste.** Invariant : après la boucle `while`, `g` est la plus petite position telle que `x[d] − x[g] ≤ D`. Comme le tableau est trié, les arbres `g` à `d − 1` sont exactement ceux qui sont avant `d` et à distance au plus `D`, et il y en a `d − g`. Quand `d` avance, `x[d]` augmente : un arbre trop loin de l'ancien `x[d]` est encore plus loin du nouveau, donc `g` n'a jamais à reculer. Chaque paire est comptée une fois, quand `d` est son arbre le plus à droite. **Coût** : le tri, puis `d` et `g` avancent chacun au plus `N` fois, soit au plus `2N` étapes. Le nombre de paires peut atteindre 5 × 10⁹ : `long long` en C++.

## À retenir

- Sommes préfixes : `P[0] = 0`, `P[i + 1] = P[i] + t[i]`, et la somme de `t[a..b]` vaut `P[b + 1] − P[a]`. En deux dimensions, quatre termes par inclusion-exclusion.
- Tableau des différences : `D[a] += v`, `D[b + 1] −= v`, puis sommes préfixes de `D`. C'est l'opération inverse des sommes préfixes.
- Deux pointeurs sur un tableau trié : chaque pas écarte une case qui ne peut plus servir, en le justifiant par le tri ; au plus `n` pas.
- Fenêtre glissante : quand la propriété est monotone, le début ne recule jamais ; chaque bord avance au plus `n` fois, donc au plus `2n` étapes au total.
- Pour chaque technique, on prouve la correction par un invariant et l'on compte les opérations globalement : environ `n` au lieu de `n²`.
- Pièges : décalages d'indice, case `n` du tableau des différences, `long long` en C++, et fenêtre glissante interdite sans monotonie.
