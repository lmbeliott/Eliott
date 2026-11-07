Un professeur veut publier les notes d'un contrôle de la plus basse à la plus haute, trouver la note du milieu, repérer deux copies qui ont exactement la même note. Toutes ces tâches deviennent simples une fois les notes **triées** : la plus basse est au début, la note du milieu est au milieu, et deux notes égales sont côte à côte.

**Trier** une liste, c'est réordonner ses éléments pour qu'ils soient dans l'ordre croissant : `t[0] ≤ t[1] ≤ … ≤ t[n − 1]`. On ne change pas les valeurs, on change seulement leur place. Ce chapitre présente trois méthodes de tri que l'on écrit soi-même, le tri par sélection, le tri par insertion et le tri par comptage, avec pour chacune la preuve qu'elle trie bien et le nombre d'opérations qu'elle demande. Il présente ensuite les tris tout faits de Python et du C++, qui sont autorisés à partir de maintenant, et la façon d'utiliser un tri pour résoudre un problème.

## Le tri par sélection

L'idée est celle d'un joueur qui range ses cartes sur la table : il cherche la plus petite et la pose en premier, puis la plus petite des cartes restantes, et ainsi de suite. Sur une liste, on cherche à l'étape `i` la position `m` du plus petit élément parmi `t[i], t[i + 1], …, t[n − 1]`, puis on **échange** `t[i]` et `t[m]`.

```python
t = [5, 2, 4, 1, 3]
n = len(t)
for i in range(n - 1):
    m = i
    for j in range(i + 1, n):
        if t[j] < t[m]:
            m = j
    t[i], t[m] = t[m], t[i]
print(*t)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {5, 2, 4, 1, 3};
    int n = t.size();
    for (int i = 0; i < n - 1; i++) {
        int m = i;
        for (int j = i + 1; j < n; j++) {
            if (t[j] < t[m]) {
                m = j;
            }
        }
        swap(t[i], t[m]);
    }
    for (int x : t) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche `1 2 3 4 5`. Les états successifs sont `[1, 2, 4, 5, 3]` (le 1 échangé avec le 5), `[1, 2, 4, 5, 3]` (le 2 est déjà en place), `[1, 2, 3, 5, 4]`, puis `[1, 2, 3, 4, 5]`. La boucle s'arrête à `n − 2` : quand les `n − 1` premières places sont bonnes, la dernière l'est forcément.

**Pourquoi c'est juste.** On utilise un invariant, comme au chapitre précédent : *avant l'étape `i`, les cases `t[0]` à `t[i − 1]` contiennent les `i` plus petits éléments de la liste, dans l'ordre croissant*. Au départ (`i = 0`), il n'y a rien à vérifier. Si l'invariant est vrai avant l'étape `i`, l'étape place en `t[i]` le minimum des éléments restants : il est supérieur ou égal à tous ceux déjà placés, et inférieur ou égal à tous ceux qui restent. L'invariant est donc vrai avant l'étape `i + 1`. À la fin, il dit que toute la liste est triée. Les deux boucles sont des `for` : le programme s'arrête.

**Combien d'opérations.** L'étape `i` fait `n − 1 − i` comparaisons, quelle que soit la liste. Au total : `(n − 1) + (n − 2) + … + 1 = n × (n − 1) / 2` comparaisons, soit environ `n² / 2`. Il y a au plus `n − 1` échanges, un par étape. Le tri par sélection fait donc beaucoup de comparaisons, toujours le même nombre, mais très peu d'échanges.

## Le tri par insertion

C'est la méthode d'un joueur qui reçoit ses cartes une par une et insère chaque nouvelle carte à sa place dans sa main déjà rangée. Sur une liste, la partie `t[0..i − 1]` est déjà triée ; on prend `t[i]` et on le fait reculer, en l'échangeant avec son voisin de gauche, tant que ce voisin est plus grand.

```python
t = [5, 2, 4, 1, 3]
n = len(t)
for i in range(1, n):
    j = i
    while j > 0 and t[j - 1] > t[j]:
        t[j - 1], t[j] = t[j], t[j - 1]
        j = j - 1
print(*t)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {5, 2, 4, 1, 3};
    int n = t.size();
    for (int i = 1; i < n; i++) {
        int j = i;
        while (j > 0 && t[j - 1] > t[j]) {
            swap(t[j - 1], t[j]);
            j--;
        }
    }
    for (int x : t) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche `1 2 3 4 5`. Les états après chaque insertion sont `[2, 5, 4, 1, 3]`, `[2, 4, 5, 1, 3]`, `[1, 2, 4, 5, 3]` (le 1 a reculé de trois cases) et `[1, 2, 3, 4, 5]`. L'ordre des deux conditions du `while` compte : on teste `j > 0` d'abord, pour ne jamais lire `t[-1]`.

**Pourquoi c'est juste.** Invariant : *avant l'étape `i`, les cases `t[0]` à `t[i − 1]` contiennent les mêmes éléments qu'au départ, dans l'ordre croissant*. L'étape `i` fait reculer `t[i]` jusqu'à ce que son voisin de gauche soit inférieur ou égal, ou qu'il atteigne la case 0 ; les éléments qu'il dépasse sont tous plus grands que lui et restent triés entre eux. La partie `t[0..i]` est donc triée. La boucle `while` s'arrête, car `j` diminue de 1 à chaque tour et ne descend pas sous 0.

**Combien d'opérations.** Tout dépend de la liste. Une **inversion** est une paire de positions `i < j` telle que `t[i] > t[j]`. Chaque échange du tri par insertion porte sur deux voisins dans le mauvais ordre : il supprime exactement une inversion et ne change pas les autres paires. Le nombre d'échanges est donc égal au nombre d'inversions de la liste de départ. Une liste déjà triée n'en a aucune : le tri fait seulement `n − 1` comparaisons. Une liste strictement décroissante en a `n × (n − 1) / 2`, le maximum. Le tri par insertion est donc très rapide sur une liste **presque triée**, et aussi lent que la sélection dans le pire cas.

## Le tri par comptage

Quand les valeurs sont des entiers compris entre 0 et une petite borne `V − 1`, on peut trier sans aucune comparaison. On compte combien de fois apparaît chaque valeur dans un **tableau de comptage**, puis on réécrit les valeurs dans l'ordre croissant, chacune autant de fois qu'elle a été comptée.

```python
t = [3, 0, 2, 3, 1, 0, 3]
V = 4
cpt = [0] * V
for x in t:
    cpt[x] = cpt[x] + 1
resultat = []
for v in range(V):
    for _ in range(cpt[v]):
        resultat.append(v)
print(*resultat)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {3, 0, 2, 3, 1, 0, 3};
    int V = 4;
    vector<int> cpt(V, 0);
    for (int x : t) {
        cpt[x]++;
    }
    vector<int> resultat;
    for (int v = 0; v < V; v++) {
        for (int k = 0; k < cpt[v]; k++) {
            resultat.push_back(v);
        }
    }
    for (int x : resultat) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche `0 0 1 2 3 3 3`. Le résultat est juste : chaque valeur est écrite exactement autant de fois qu'elle apparaît, et les valeurs sortent dans l'ordre croissant puisqu'on les parcourt dans cet ordre. Le coût est d'environ `n` opérations pour compter et `n + V` pour réécrire. Pour 100 000 notes sur 20, c'est quelques centaines de milliers d'opérations, au lieu de 5 milliards de comparaisons pour la sélection. La limite est la mémoire : avec des valeurs jusqu'à 10⁹, il faudrait un tableau d'un milliard de cases.

## La stabilité

On trie souvent des éléments selon une partie d'eux-mêmes seulement : des élèves selon leur note, des mots selon leur longueur. Cette partie s'appelle la **clé** du tri. Deux éléments différents peuvent alors avoir la même clé. Un tri est **stable** s'il laisse les éléments de même clé dans leur ordre de départ.

Le tri par insertion est stable : un élément ne recule que devant un voisin **strictement** plus grand, il ne dépasse jamais un élément de même clé. Avec `>=` à la place de `>`, il ne le serait plus. Le tri par sélection, lui, n'est pas stable : avec les élèves `(12, ana)`, `(12, bob)`, `(8, eva)` triés par note, la première étape échange `(12, ana)` avec `(8, eva)`, et l'on obtient `(8, eva)`, `(12, bob)`, `(12, ana)` : `bob` est passé devant `ana`.

Le tri par comptage peut être rendu stable : au lieu de compter les éléments, on les range dans une liste par valeur de la clé, dans l'ordre de lecture, puis on recolle les listes. C'est ce que fait le programme suivant, qui trie des mots par longueur.

```python
mots = ["chat", "a", "bus", "ours", "le"]
paquets = []
for _ in range(5):
    paquets.append([])
for m in mots:
    paquets[len(m)].append(m)
resultat = []
for longueur in range(5):
    for m in paquets[longueur]:
        resultat.append(m)
print(*resultat)
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    vector<string> mots = {"chat", "a", "bus", "ours", "le"};
    vector<vector<string>> paquets(5);
    for (const string& m : mots) {
        paquets[m.size()].push_back(m);
    }
    for (int longueur = 0; longueur < 5; longueur++) {
        for (const string& m : paquets[longueur]) {
            cout << m << " ";
        }
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche `a le bus chat ours` : `chat` reste devant `ours`, car il a été lu avant.

## Les tris de Python et du C++

Les tris écrits à la main font environ `n² / 2` comparaisons dans le pire cas : 5 milliards pour `n = 100 000`, beaucoup trop. Les langages fournissent un tri bien plus rapide, qui fait de l'ordre de `n × log₂(n)` comparaisons, soit environ 1,7 million pour `n = 100 000`. Le niveau 4 expliquera comment ; à partir de maintenant, on a le droit de s'en servir.

En Python, `t.sort()` trie la liste `t` sur place, et `sorted(t)` renvoie une **nouvelle** liste triée sans modifier `t`. Le paramètre `reverse=True` trie dans l'ordre décroissant. Le paramètre `key` donne une fonction qui calcule la clé de chaque élément : `sorted(mots, key=len)` trie des mots par longueur. Le tri de Python est stable.

Les tuples se comparent comme les mots du dictionnaire : d'abord le premier élément, puis le deuxième en cas d'égalité, et ainsi de suite. Pour trier des élèves par note décroissante, puis par nom à note égale, on utilise donc la clé `(-note, nom)`.

```python
eleves = [("bob", 12), ("eva", 15), ("ana", 12)]

def cle(e):
    return (-e[1], e[0])

print(sorted(eleves, key=cle))
print(sorted([5, 1, 4], reverse=True))
```

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

bool avant(const pair<string, int>& a, const pair<string, int>& b) {
    if (a.second != b.second) {
        return a.second > b.second;   // note décroissante
    }
    return a.first < b.first;         // puis nom croissant
}

int main() {
    vector<pair<string, int>> eleves = {{"bob", 12}, {"eva", 15}, {"ana", 12}};
    sort(eleves.begin(), eleves.end(), avant);
    for (auto& e : eleves) {
        cout << e.first << " " << e.second << "\n";
    }
    vector<int> t = {5, 1, 4};
    sort(t.begin(), t.end(), greater<int>());
    cout << t[0] << " " << t[1] << " " << t[2] << "\n";
    return 0;
}
```

Python affiche `[('eva', 15), ('ana', 12), ('bob', 12)]` puis `[5, 4, 1]`. En C++, `sort(t.begin(), t.end())` trie un `vector` dans l'ordre croissant (il faut `#include <algorithm>`), et `greater<int>()` donne l'ordre décroissant. Les `pair` et les `tuple` se comparent eux aussi élément par élément. Pour un autre ordre, on écrit une fonction de comparaison qui répond à la question « `a` doit-il passer **strictement** avant `b` ? ». Attention : `sort` n'est pas stable ; quand la stabilité compte, on utilise `stable_sort`, qui s'emploie de la même façon. Python accepte aussi une fonction écrite directement dans l'appel : `key=lambda e: (-e[1], e[0])` est un raccourci pour la fonction `cle` ci-dessus.

## Trier pour résoudre un problème

Beaucoup de problèmes deviennent simples sur une liste triée, parce que les éléments proches en valeur y sont proches en position. Trois exemples :

- **Doublons.** Deux valeurs égales sont voisines après le tri : il suffit de comparer chaque élément au suivant.
- **Médiane.** L'élément du milieu de la liste triée.
- **Plus petit écart.** Si `a ≤ b ≤ c`, alors `c − a = (c − b) + (b − a)` est au moins aussi grand que `b − a` : le plus petit écart entre deux valeurs est atteint par deux voisines de la liste triée.

Dans chaque cas, on paie le tri une fois, puis un seul passage suffit, au lieu de comparer toutes les paires.

## Erreurs fréquentes

**Écrire `t = t.sort()`.** La méthode `sort` trie sur place et renvoie `None`. Après cette ligne, `t` vaut `None`, et `t[0]` provoque `TypeError: 'NoneType' object is not subscriptable`. On écrit `t.sort()` seul, ou `t = sorted(t)`.

**Trier des nombres lus comme du texte.** `sorted(["10", "9", "100"])` donne `['10', '100', '9']` : les chaînes se comparent caractère par caractère, et `"1"` vient avant `"9"`. On convertit avec `int` avant de trier.

**Une comparaison avec `<=` en C++.** La fonction donnée à `sort` doit répondre « strictement avant ». Avec `return a <= b;`, deux éléments égaux passent chacun avant l'autre ; le résultat peut être faux et le programme peut même s'arrêter avec `Segmentation fault`. On écrit `<`.

**Perdre les positions de départ.** Après un tri, on ne sait plus où était chaque élément. Si l'énoncé demande des positions, on trie des couples `(valeur, position)`.

**Oublier la stabilité.** Un tri par sélection écrit à la main, ou `sort` en C++, peut inverser deux éléments de même clé. Si l'ordre de départ doit être gardé à clé égale, on utilise `sorted` en Python, `stable_sort` en C++, ou une clé qui départage tout le monde.

## Un exemple complet

**Énoncé.** On lit `N` entiers distincts. Afficher le plus petit écart `|a − b|` entre deux d'entre eux, puis le nombre de paires qui ont cet écart. Avec `N` jusqu'à 100 000.

**Idée.** Comparer toutes les paires coûte `N² / 2`, 5 milliards d'opérations. On trie la liste ; le plus petit écart est alors atteint entre deux voisines. On calcule tous les écarts entre voisines, leur minimum `d`, et on compte les voisines à distance `d`.

**Programme.**

```python
n = int(input())
t = list(map(int, input().split()))
t.sort()
d = t[1] - t[0]
for i in range(1, n - 1):
    d = min(d, t[i + 1] - t[i])
nb = 0
for i in range(n - 1):
    if t[i + 1] - t[i] == d:
        nb = nb + 1
print(d, nb)
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    sort(t.begin(), t.end());
    long long d = t[1] - t[0];
    for (int i = 1; i < n - 1; i++) {
        d = min(d, t[i + 1] - t[i]);
    }
    int nb = 0;
    for (int i = 0; i < n - 1; i++) {
        if (t[i + 1] - t[i] == d) {
            nb++;
        }
    }
    cout << d << " " << nb << "\n";
    return 0;
}
```

**Vérification à la main.** Avec `6` puis `14 3 9 20 6 17`, la liste triée est `3 6 9 14 17 20`. Les écarts entre voisines sont `3 3 5 3 3`. Le minimum vaut 3, atteint 4 fois : le programme affiche `3 4`. En comparant toutes les paires, on trouve bien les quatre paires `(3, 6)`, `(6, 9)`, `(14, 17)` et `(17, 20)`, et aucune autre paire à distance 3.

**Pourquoi c'est juste.** Après le tri, `t[0] < t[1] < … < t[n − 1]`, puisque les valeurs sont distinctes. Pour une paire non voisine `i < j` avec `j ≥ i + 2`, l'écart `t[j] − t[i]` est la somme des écarts entre voisines de `i` à `j`, donc au moins `2d`, qui est strictement plus grand que `d` car `d > 0`. Le minimum est donc atteint seulement par des voisines, et les compter suffit. Le programme fait un tri, puis deux passages de `N` étapes : quelques millions d'opérations au plus, au lieu de 5 milliards. Si les valeurs pouvaient se répéter, `d` vaudrait 0 et trois valeurs égales formeraient trois paires dont une non voisine : il faudrait compter autrement.

## À retenir

- Le tri par sélection place à chaque étape le minimum des éléments restants : environ `n² / 2` comparaisons toujours, au plus `n − 1` échanges ; il n'est pas stable.
- Le tri par insertion fait reculer chaque élément dans la partie déjà triée : un échange par inversion, donc très rapide sur une liste presque triée et lent dans le pire cas ; il est stable.
- Le tri par comptage trie de petits entiers sans comparaison, en environ `2n + V` opérations ; rangé par paquets, il est stable.
- La correction d'un tri se prouve par un invariant sur la partie déjà traitée ; son coût se mesure en comparaisons et en échanges.
- `sorted`, `sort`, `key=` et les tuples en Python, `sort`, `stable_sort` et les fonctions de comparaison strictes en C++ trient en environ `n × log₂(n)` comparaisons : ce sont les outils à utiliser désormais.
- Trier d'abord rend voisins les éléments proches : doublons, médiane et plus petit écart se trouvent alors en un seul passage.
