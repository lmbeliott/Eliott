Au niveau 2, un tableau servait surtout à garder des valeurs pour les relire : chercher un maximum, compter, retourner. Ce chapitre présente des **algorithmes** classiques sur les tableaux : faire tourner un tableau, le transformer sans en créer un second, fusionner deux tableaux triés, compter des paires avec un tableau de fréquences, faire deux passages pour éviter de tout recalculer, et trouver la portion de plus grande somme.

Chaque fois, la méthode évidente existe, mais elle est souvent trop lente : elle fait de l'ordre de `n²` opérations quand `n` est la taille du tableau. Pour `n = 100 000`, cela fait dix milliards, des minutes de calcul. Les méthodes de ce chapitre font de l'ordre de `n` opérations, et l'on verra chaque fois **pourquoi elles sont justes** et **combien elles coûtent**. Mais d'abord, deux instructions qui simplifient beaucoup de boucles.

## Sortir d'une boucle : break et continue

L'instruction **`break`** arrête immédiatement la boucle qui la contient : le programme reprend juste après cette boucle. L'instruction **`continue`** arrête seulement le **tour en cours** : la boucle passe directement au tour suivant (dans un `for`, la variable prend la valeur suivante ; dans un `while`, la condition est de nouveau testée). Les deux s'écrivent de la même façon en Python et en C++ (avec un point-virgule en C++), dans un `for` comme dans un `while`.

Au niveau 1, pour chercher la première valeur qui convient, on écrivait une boucle `while` dont la condition combinait la limite et le critère : `while i < n and t[i] >= 0`. Avec `break`, on écrit un parcours ordinaire et on sort dès qu'on a trouvé.

```python
t = [4, 8, -3, 5, -1]
pos = -1
for i in range(len(t)):
    if t[i] < 0:
        pos = i
        break
print(pos)

total = 0
for x in t:
    if x < 0:
        continue
    total = total + x
print(total)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {4, 8, -3, 5, -1};
    int pos = -1;
    for (int i = 0; i < (int) t.size(); i++) {
        if (t[i] < 0) {
            pos = i;
            break;
        }
    }
    cout << pos << "\n";

    int total = 0;
    for (int x : t) {
        if (x < 0) {
            continue;
        }
        total = total + x;
    }
    cout << total << "\n";
    return 0;
}
```

Le programme affiche `2`, puis `17`. La première boucle s'arrête au premier négatif, d'indice 2 : la valeur `-1`, plus loin, n'est jamais examinée. Si aucun négatif n'existait, la boucle irait jusqu'au bout et `pos` garderait la valeur `-1`. La seconde boucle saute les négatifs et additionne `4 + 8 + 5`.

Les deux écritures de la recherche sont équivalentes. La condition `while i < n and not trouve` rassemble toute la règle d'arrêt, ce qui facilite le raisonnement sur la boucle ; `break` est plus court quand l'arrêt se décide au milieu du corps. `continue` écarte tôt les cas sans intérêt, sans emboîter tout le reste du corps dans un `if`. Dans une fonction, `return` arrête à la fois la boucle et la fonction, ce qui est souvent plus clair encore.

## Décalages et rotations

**Faire tourner** un tableau de `k` crans vers la droite, c'est déplacer chaque valeur de `k` positions vers la droite, celles qui dépassent la fin revenant au début : `1 2 3 4 5` tourné de 2 crans donne `4 5 1 2 3`. La valeur d'indice `i` va à l'indice `(i + k) % n`. Après `n` crans, chaque valeur est revenue à sa place : seul compte `k % n`. Faire tourner un tableau d'un milliard de crans ne coûte donc pas plus cher que de quelques crans, à condition de ne pas les faire un par un.

```python
t = [1, 2, 3, 4, 5]
n = len(t)
k = 12 % n
r = [0] * n
for i in range(n):
    r[(i + k) % n] = t[i]
print(*r)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {1, 2, 3, 4, 5};
    int n = t.size();
    int k = 12 % n;
    vector<int> r(n);
    for (int i = 0; i < n; i++) {
        r[(i + k) % n] = t[i];
    }
    for (int x : r) cout << x << " ";
    cout << "\n";
    return 0;
}
```

Le programme affiche `4 5 1 2 3` : 12 crans font deux tours complets, plus 2 crans. Cette méthode utilise un second tableau. On peut aussi tourner **en place**, avec trois retournements : retourner les `n − k` premières valeurs, puis les `k` dernières, puis tout le tableau. Sur l'exemple : `3 2 1 5 4`, puis `4 5 1 2 3`. Pourquoi c'est juste : notons `A` le bloc des `n − k` premières valeurs et `B` celui des `k` dernières. Le tableau est `A` suivi de `B`, et l'on veut `B` suivi de `A`. Retourner un tableau formé d'un bloc `X` suivi d'un bloc `Y` donne `Y` retourné suivi de `X` retourné : la dernière valeur passe en tête, et ainsi de suite. Après les deux premiers retournements, le tableau est `A` retourné suivi de `B` retourné ; le dernier retournement donne donc `B` retourné deux fois, c'est-à-dire `B`, suivi de `A`. Chaque retournement se fait par échanges, comme au niveau 2, et chaque valeur est déplacée deux fois au plus : le coût est proportionnel à `n` dans les deux méthodes.

## Transformer en place

Transformer un tableau **en place**, c'est le modifier sans en créer un second. Exemple typique : retirer d'un tableau toutes les valeurs nulles, en gardant l'ordre des autres. La méthode naïve, `t.remove(0)` répété, est lente : chaque `remove` cherche la valeur depuis le début puis décale tout ce qui suit d'une case. Avec beaucoup de zéros, cela fait de l'ordre de `n²` déplacements.

La bonne méthode utilise deux indices. L'indice de **lecture** `i` parcourt tout le tableau ; l'indice d'**écriture** `w` indique où ranger la prochaine valeur gardée.

```python
t = [3, 0, 0, 7, 0, 2]
w = 0
for i in range(len(t)):
    if t[i] != 0:
        t[w] = t[i]
        w = w + 1
print(t[:w], w)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {3, 0, 0, 7, 0, 2};
    int w = 0;
    for (int i = 0; i < (int) t.size(); i++) {
        if (t[i] != 0) {
            t[w] = t[i];
            w = w + 1;
        }
    }
    t.resize(w);
    for (int x : t) cout << x << " ";
    cout << w << "\n";
    return 0;
}
```

Python affiche `[3, 7, 2] 3` (le C++ affiche `3 7 2 3`). Pourquoi c'est juste : avant chaque tour, les cases `t[0]` à `t[w − 1]` contiennent exactement les valeurs non nulles parmi `t[0]` à `t[i − 1]`, dans l'ordre. Un tour conserve cette propriété : si `t[i]` est gardé, on le range en `t[w]`. On n'écrase jamais une valeur pas encore lue, car `w ≤ i`. À la fin, `i` vaut `n`, et les `w` premières cases sont le résultat. Le coût est d'un passage. En C++, `t.resize(w)` raccourcit le tableau à ses `w` premières cases ; en Python, la tranche `t[:w]` en donne une copie, ou `del t[w:]` coupe la fin.

## Fusionner deux tableaux triés

Deux tableaux `a` et `b` sont triés dans l'ordre croissant. Les **fusionner**, c'est produire un seul tableau trié qui contient toutes leurs valeurs. On avance dans les deux en même temps, avec un indice `i` dans `a` et un indice `j` dans `b` : à chaque étape, on prend la plus petite des deux valeurs `a[i]` et `b[j]`, et on avance l'indice correspondant. Quand l'un des tableaux est épuisé, on recopie la fin de l'autre.

```python
a = [1, 4, 4, 9]
b = [2, 4, 10]
r = []
i = 0
j = 0
while i < len(a) or j < len(b):
    if j == len(b) or (i < len(a) and a[i] <= b[j]):
        r.append(a[i])
        i = i + 1
    else:
        r.append(b[j])
        j = j + 1
print(*r)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> a = {1, 4, 4, 9}, b = {2, 4, 10}, r;
    int i = 0, j = 0;
    int n = a.size(), m = b.size();
    while (i < n || j < m) {
        if (j == m || (i < n && a[i] <= b[j])) {
            r.push_back(a[i]);
            i = i + 1;
        } else {
            r.push_back(b[j]);
            j = j + 1;
        }
    }
    for (int x : r) cout << x << " ";
    cout << "\n";
    return 0;
}
```

Le programme affiche `1 2 4 4 4 9 10`. La condition se lit ainsi : on prend dans `a` si `b` est épuisé, ou si `a` ne l'est pas et que `a[i] ≤ b[j]`. L'ordre des tests compte : `b[j]` n'est jamais lu quand `j == len(b)`, car `or` s'arrête dès que sa première partie est vraie.

**Pourquoi c'est juste.** Invariant : au début de chaque tour, `r` contient `a[0..i − 1]` et `b[0..j − 1]`, dans l'ordre croissant, et chaque valeur de `r` est inférieure ou égale à toutes les valeurs restantes (`a[i..]` et `b[j..]`). C'est vrai au départ, où `r` est vide. Comme `a` est trié, les valeurs restantes de `a` sont toutes au moins égales à `a[i]` ; de même pour `b`. La valeur prise est donc la plus petite de toutes les valeurs restantes : elle est au moins égale à la dernière valeur de `r` (invariant), donc `r` reste trié, et elle est inférieure ou égale à tout ce qui reste. L'invariant est conservé. À la sortie, `i = n` et `j = m` : `r` contient toutes les valeurs, triées. **Coût.** Chaque étape avance un indice : exactement `n + m` étapes. La même idée de deux indices qui avancent ensemble sert à calculer l'intersection de deux tableaux triés, ou le plus petit écart entre leurs valeurs.

## Compter avec un tableau de fréquences

Le **tableau de fréquences** (ou de comptage) du niveau 2, où `f[v]` est le nombre d'apparitions de la valeur `v`, résume tout un tableau quand les valeurs sont de petits entiers. On s'en sert pour compter des **paires** sans les énumérer. Combien de paires de positions `i < j` portent-elles la même valeur ? Une valeur qui apparaît `c` fois forme `c × (c − 1) / 2` paires : on choisit deux positions parmi `c`. On peut aussi compter en un seul passage : au moment où l'on lit une valeur `x`, elle forme une paire avec chacune des `f[x]` apparitions déjà lues.

```python
t = [3, 1, 3, 3, 1, 2]
f = [0] * 4
paires = 0
for x in t:
    paires = paires + f[x]
    f[x] = f[x] + 1
print(paires)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {3, 1, 3, 3, 1, 2};
    vector<long long> f(4, 0);
    long long paires = 0;
    for (int x : t) {
        paires = paires + f[x];
        f[x] = f[x] + 1;
    }
    cout << paires << "\n";
    return 0;
}
```

Le programme affiche `4` : trois paires de `3` et une paire de `1`. Chaque paire est comptée une fois, quand on lit sa seconde valeur. L'ordre des deux instructions est essentiel : en augmentant `f[x]` d'abord, chaque valeur formerait une paire avec elle-même. La même technique compte les paires dont la somme vaut `K`, ou dont la somme est un multiple de `K` : on remplace « la même valeur » par « la valeur partenaire ». Le coût est d'un passage, plus la taille du tableau `f` ; essayer toutes les paires coûterait `n × (n − 1) / 2` comparaisons.

## Deux passages plutôt qu'un calcul par case

Beaucoup de problèmes demandent une information **pour chaque case** qui dépend de tout le tableau. Par exemple : pour chaque valeur, le plus grand des **autres** éléments. Recalculer un maximum pour chaque case coûte `n` opérations par case, donc `n²` en tout. Il vaut mieux un premier passage qui calcule une fois pour toutes ce dont on a besoin, puis un second qui répond pour chaque case.

Ici, le premier passage calcule le maximum `m1` et le **deuxième maximum** `m2` (le plus grand une fois une occurrence de `m1` retirée). Pour une case qui vaut `m1`, le plus grand des autres est `m2` ; pour toute autre case, c'est `m1`. Cela reste juste quand le maximum apparaît deux fois : `m2` vaut alors aussi `m1`. Le tableau doit avoir au moins deux cases. Invariant du premier passage : après avoir examiné `t[0..i]`, `m1` et `m2` sont les deux plus grandes valeurs de `t[0..i]` (`m1 ≥ m2`, en comptant les répétitions). Une nouvelle valeur `x` plus grande que `m1` devient le maximum et l'ancien maximum devient le second ; sinon, elle ne remplace que `m2`, si elle le dépasse.

```python
t = [5, 9, 2, 9, 4]
m1 = max(t[0], t[1])
m2 = min(t[0], t[1])
for x in t[2:]:
    if x > m1:
        m2 = m1
        m1 = x
    elif x > m2:
        m2 = x
for x in t:
    if x == m1:
        print(m2, end=" ")
    else:
        print(m1, end=" ")
print()
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {5, 9, 2, 9, 4};
    int m1 = max(t[0], t[1]);
    int m2 = min(t[0], t[1]);
    for (int i = 2; i < (int) t.size(); i++) {
        if (t[i] > m1) {
            m2 = m1;
            m1 = t[i];
        } else if (t[i] > m2) {
            m2 = t[i];
        }
    }
    for (int x : t) {
        cout << (x == m1 ? m2 : m1) << " ";
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche `9 9 9 9 9` : le maximum 9 apparaît deux fois, donc chaque case voit un autre 9. Avec `t = [5, 9, 2, 4]`, il afficherait `9 5 9 9`. Le même schéma sert pour « la plus haute valeur à gauche de chaque case » : un passage de gauche à droite tient à jour le maximum déjà vu et le range dans un tableau. Un passage de droite à gauche donne de même la plus haute valeur à droite. (En C++, `cond ? a : b` vaut `a` si la condition est vraie, `b` sinon.)

## La portion de plus grande somme

Une **portion** d'un tableau est une suite de cases consécutives, `t[g]` à `t[d]` avec `g ≤ d`. On cherche la portion dont la somme est la plus grande. Il y a `n × (n + 1) / 2` portions : les essayer toutes, même en mettant à jour la somme au fur et à mesure, fait de l'ordre de `n²` additions.

Un seul passage suffit. Notons `fin[i]` la plus grande somme d'une portion qui **se termine** à l'indice `i`. Une telle portion est soit la case `i` seule, de somme `t[i]`, soit une portion qui se termine en `i − 1`, prolongée de `t[i]`, de somme au plus `fin[i − 1] + t[i]`, valeur atteinte en prolongeant la meilleure. Donc `fin[i] = max(t[i], fin[i − 1] + t[i]) = t[i] + max(fin[i − 1], 0)` : on prolonge si la meilleure somme précédente est positive ou nulle, et on repart de zéro sinon. Comme toute portion se termine à un certain indice, la réponse est le plus grand des `fin[i]`.

```python
t = [2, -5, 3, -1, 4, -7, 2]
courant = t[0]
meilleur = t[0]
for i in range(1, len(t)):
    if courant >= 0:
        courant = courant + t[i]
    else:
        courant = t[i]
    meilleur = max(meilleur, courant)
print(meilleur)
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {2, -5, 3, -1, 4, -7, 2};
    long long courant = t[0], meilleur = t[0];
    for (int i = 1; i < (int) t.size(); i++) {
        if (courant >= 0) {
            courant = courant + t[i];
        } else {
            courant = t[i];
        }
        meilleur = max(meilleur, courant);
    }
    cout << meilleur << "\n";
    return 0;
}
```

Le programme affiche `6`, la somme de `3 -1 4`. Les valeurs successives de `courant` sont 2, −3, 3, 2, 6, −1, 2 : après le −5, la somme −3 est négative, et l'on repart de la case suivante. Invariant : à la fin du tour `i`, `courant` vaut `fin[i]` et `meilleur` le plus grand des `fin[0..i]` ; à la sortie, `meilleur` est donc la plus grande somme d'une portion. On initialise avec `t[0]` et non avec 0 : si toutes les valeurs sont négatives, la réponse est la plus grande d'entre elles. Le coût est d'un passage.

## Erreurs fréquentes

**Supprimer pendant un parcours.** Retirer des éléments d'une liste qu'on parcourt avec `for x in t` fait sauter des éléments, sans message d'erreur. On utilise la méthode lecture-écriture, ou on construit une nouvelle liste.

**Lire après la fin dans une fusion.** Avec la condition `a[i] <= b[j]` seule, la boucle lit `b[j]` alors que `j == len(b)` : `IndexError: list index out of range` en Python, une valeur quelconque en C++. On teste d'abord si un tableau est épuisé.

**Oublier le reste pour une rotation.** Avec `k = 10¹⁸`, `(i + k) % n` fonctionne en Python. En C++, 10¹⁸ ne tient pas dans un `int` : on lit `k` dans un `long long`, puis on calcule d'abord `((k % n) + n) % n`, qui ramène aussi un `k` négatif entre 0 et `n − 1` (sinon, `(i + k) % n` peut être négatif).

**Un tableau de fréquences trop grand.** `[0] * (10**9 + 1)` provoque `MemoryError`. Le tableau de fréquences ne convient que pour de petites valeurs ; sinon, on utilise un dictionnaire.

**Croire que `break` sort de toutes les boucles.** Dans deux boucles imbriquées, `break` ne sort que de la boucle intérieure. Pour tout arrêter, on place les boucles dans une fonction et on utilise `return`.

## Un exemple complet

**Énoncé.** On lit `N` entiers. Afficher la première position `p` (à partir de 1) telle que la somme des valeurs avant `p` soit égale à la somme des valeurs après `p`, ou `-1` s'il n'y en a pas. La valeur en position `p` ne compte d'aucun côté.

**Idée.** Calculer les deux sommes pour chaque position coûterait `N` opérations par position, soit `N²`. On fait plutôt deux passages. Le premier calcule le total `S`. Le second parcourt les positions en tenant à jour `gauche`, la somme des valeurs déjà dépassées ; la somme à droite vaut alors `S − gauche − t[i]`, sans rien recalculer. Dès que les deux sont égales, on a trouvé : `break`.

**Programme.**

```python
n = int(input())
t = list(map(int, input().split()))
total = sum(t)
gauche = 0
reponse = -1
for i in range(n):
    if gauche == total - gauche - t[i]:
        reponse = i + 1
        break
    gauche = gauche + t[i]
print(reponse)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> t(n);
    long long total = 0;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
        total = total + t[i];
    }
    long long gauche = 0;
    int reponse = -1;
    for (int i = 0; i < n; i++) {
        if (gauche == total - gauche - t[i]) {
            reponse = i + 1;
            break;
        }
        gauche = gauche + t[i];
    }
    cout << reponse << "\n";
    return 0;
}
```

**Vérification à la main.** Avec `6` et `1 7 3 6 5 6`, le total vaut 28. En position 1 : gauche 0, droite `28 − 0 − 1 = 27`. Position 2 : gauche 1, droite 20. Position 3 : gauche 8, droite 17. Position 4 : gauche 11, droite `28 − 11 − 6 = 11` : égalité, le programme affiche `4` et sort de la boucle. Avec `2` et `1 2`, on trouve gauche 0 contre droite 2, puis gauche 1 contre droite 0 : la boucle se termine sans `break` et le programme affiche `-1`. Avec `1` et `5`, les deux côtés sont vides : la réponse est `1`.

**Pourquoi c'est juste.** Invariant : au début du tour `i`, `gauche` est la somme de `t[0]` à `t[i − 1]`. C'est vrai au départ (somme vide, 0), et la dernière instruction du tour ajoute `t[i]`. La somme à droite est alors `total − gauche − t[i]`, puisque les trois parties forment tout le tableau. On examine les positions dans l'ordre et on s'arrête à la première qui convient : c'est bien la première. **Coût** : deux passages, donc de l'ordre de `N` opérations.

## À retenir

- `break` sort de la boucle la plus intérieure, `continue` passe au tour suivant ; ils remplacent la condition `while ... and not trouve` quand l'arrêt se décide au milieu du corps.
- Une rotation de `k` crans envoie l'indice `i` en `(i + k) % n` ; seul compte `k % n`. Trois retournements la font en place.
- Les transformations en place utilisent un indice de lecture et un indice d'écriture : un passage, au lieu de `n²` pour des suppressions répétées.
- La fusion de deux tableaux triés prend à chaque étape la plus petite des deux têtes : `n + m` étapes, et le résultat est trié.
- Un tableau de fréquences compte des paires en un passage : on ajoute d'abord les partenaires déjà vus, puis on compte la valeur.
- Deux passages (un pour préparer, un pour répondre) évitent de recalculer pour chaque case ; la portion de plus grande somme se trouve en un passage avec `fin[i] = t[i] + max(fin[i − 1], 0)`.
