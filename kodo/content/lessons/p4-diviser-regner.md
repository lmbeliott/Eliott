Les tris du niveau 3 font de l'ordre de n²/2 comparaisons : pour un million de nombres, 5 × 10¹¹ comparaisons : plusieurs minutes en C++, des heures en Python. Le tri fourni par les langages trie ce million en une fraction de seconde. Ce chapitre explique comment, avec une méthode qui dépasse largement le tri : **diviser pour régner**. On découpe le problème en morceaux plus petits du même type, on les résout récursivement, puis on **combine** leurs solutions.

On étudie le tri fusion, avec sa preuve et son coût, puis le tri rapide et son pire cas, la sélection rapide, une application aux portions d'un tableau, et une méthode pour estimer le coût de n'importe quel algorithme de ce type. Le comptage des inversions servira d'exemple complet : c'est l'exemple typique d'un calcul qui « profite » d'un tri.

## Le principe

Un algorithme **diviser pour régner** suit trois étapes :

1. **Diviser** : découper l'entrée en sous-problèmes plus petits, du même type ;
2. **Régner** : résoudre chaque sous-problème par un appel récursif (ou directement s'il est assez petit : c'est le **cas de base**) ;
3. **Combiner** : construire la solution du problème à partir de celles des sous-problèmes.

La recherche dichotomique du chapitre précédent en est un cas très simple : un seul sous-problème, la moitié utile, et rien à combiner. L'exponentiation rapide aussi : pour calculer `x^n`, on calcule `x^(n/2)` une seule fois et on l'élève au carré. Le tri fusion, lui, résout **deux** sous-problèmes et fait un vrai travail pour les combiner.

## La fusion

La **fusion** de deux listes triées `g` et `d` produit une seule liste triée qui contient leurs éléments. On compare les premiers éléments restants des deux listes, on place le plus petit, et on recommence ; quand une liste est vide, on recopie le reste de l'autre.

```python
def fusion(g, d):
    # g et d sont triées ; renvoie leur fusion triée
    res = []
    i = j = 0
    # invariant : res contient g[:i] et d[:j], triés, tous <= g[i] et d[j]
    while i < len(g) and j < len(d):
        if g[i] <= d[j]:
            res.append(g[i])
            i += 1
        else:
            res.append(d[j])
            j += 1
    res.extend(g[i:])
    res.extend(d[j:])
    return res

def tri_fusion(t):
    if len(t) <= 1:
        return t
    m = len(t) // 2
    return fusion(tri_fusion(t[:m]), tri_fusion(t[m:]))

print(fusion([1, 4, 9], [2, 3, 10, 12]))
print(tri_fusion([5, 2, 9, 1, 5, 6]))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

// g et d sont triés ; renvoie leur fusion triée
vector<int> fusion(const vector<int>& g, const vector<int>& d) {
    vector<int> res;
    size_t i = 0, j = 0;
    // invariant : res contient g[0..i[ et d[0..j[, triés, tous <= g[i] et d[j]
    while (i < g.size() && j < d.size()) {
        if (g[i] <= d[j]) {
            res.push_back(g[i++]);
        } else {
            res.push_back(d[j++]);
        }
    }
    while (i < g.size()) res.push_back(g[i++]);
    while (j < d.size()) res.push_back(d[j++]);
    return res;
}

vector<int> triFusion(const vector<int>& t) {
    if (t.size() <= 1) {
        return t;
    }
    size_t m = t.size() / 2;
    vector<int> g(t.begin(), t.begin() + m), d(t.begin() + m, t.end());
    return fusion(triFusion(g), triFusion(d));
}

void affiche(const vector<int>& t) {
    for (int x : t) cout << x << " ";
    cout << "\n";
}

int main() {
    affiche(fusion({1, 4, 9}, {2, 3, 10, 12}));
    affiche(triFusion({5, 2, 9, 1, 5, 6}));
    return 0;
}
```

Le programme affiche `[1, 2, 3, 4, 9, 10, 12]` puis `[1, 2, 5, 5, 6, 9]` (en C++, les mêmes nombres séparés par des espaces).

**Correction de la fusion.** L'invariant écrit en commentaire est vrai au départ (`res` est vide). À chaque tour, l'élément ajouté est le plus petit des deux premiers restants ; comme `g` et `d` sont triées, il est plus petit que tous les éléments restants, donc `res` reste triée et ses éléments restent au plus égaux à ceux qui restent. À la sortie de la boucle, une des deux listes est épuisée, et le reste de l'autre, trié et au moins égal à tout `res`, se recopie à la fin. **Coût** : chaque tour place un élément, donc au plus `a + b` tours pour des listes de longueurs `a` et `b`, et au plus `a + b − 1` comparaisons.

## Le tri fusion

Le **tri fusion** coupe la liste en deux moitiés, trie chacune récursivement, puis les fusionne. Une liste de 0 ou 1 élément est déjà triée : c'est le cas de base.

**Correction**, par récurrence forte sur la longueur `n`. Pour `n ≤ 1`, la liste est renvoyée telle quelle, et elle est triée. Pour `n ≥ 2`, les deux moitiés ont des longueurs `⌊n/2⌋` et `⌈n/2⌉`, toutes deux strictement inférieures à `n` : par hypothèse de récurrence, les appels récursifs les trient. La fusion de deux listes triées est triée et contient tous les éléments : le résultat est juste. La même remarque prouve la **terminaison** : chaque appel porte sur une liste strictement plus courte.

**Coût.** Dessinons l'**arbre des appels** : la racine trie `n` éléments, ses deux enfants `n/2` chacun, ses quatre petits-enfants `n/4`, et ainsi de suite jusqu'aux feuilles, de taille 1. Au niveau `k`, il y a `2^k` appels qui portent chacun sur `n / 2^k` éléments : leurs fusions coûtent en tout de l'ordre de `n` opérations. Le découpage s'arrête quand `n / 2^k` atteint 1, donc après `log₂ n` niveaux. Le coût total est de l'ordre de **n log₂ n** : O(n log n). Pour `n = 10⁶`, cela fait environ 2 × 10⁷ opérations, au lieu de 5 × 10¹¹.

La **profondeur** de la récursion est elle aussi `log₂ n`, environ 20 pour un million d'éléments : aucun risque de dépasser la limite de 1 000 appels imbriqués de Python. Enfin, la fusion prend l'élément de gauche en cas d'égalité (`<=`) : deux éléments égaux gardent leur ordre de départ, et le tri fusion est **stable**.

## Le tri rapide

Le **tri rapide** divise autrement : on choisit un élément, le **pivot**, et on répartit les autres en deux listes, les plus petits que le pivot et les autres. On trie chacune récursivement, et il suffit de les mettre bout à bout, avec le pivot au milieu : il n'y a rien à fusionner. Tout le travail est dans le découpage.

```python
def tri_rapide(t):
    if len(t) <= 1:
        return t
    p = t[0]                                    # le pivot
    petits = [x for x in t[1:] if x < p]
    grands = [x for x in t[1:] if x >= p]
    return tri_rapide(petits) + [p] + tri_rapide(grands)

print(tri_rapide([5, 2, 9, 1, 5, 6]))
print(len(tri_rapide(list(range(5000)))))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> triRapide(const vector<int>& t) {
    if (t.size() <= 1) {
        return t;
    }
    int p = t[0];                               // le pivot
    vector<int> petits, grands;
    for (size_t i = 1; i < t.size(); i++) {
        if (t[i] < p) {
            petits.push_back(t[i]);
        } else {
            grands.push_back(t[i]);
        }
    }
    vector<int> res = triRapide(petits);
    res.push_back(p);
    for (int x : triRapide(grands)) res.push_back(x);
    return res;
}

int main() {
    for (int x : triRapide({5, 2, 9, 1, 5, 6})) cout << x << " ";
    cout << "\n";
    vector<int> t;
    for (int i = 0; i < 5000; i++) t.push_back(i);
    cout << triRapide(t).size() << "\n";
    return 0;
}
```

La première ligne affichée est `[1, 2, 5, 5, 6, 9]`. Pour la seconde, Python s'arrête avec `RecursionError: maximum recursion depth exceeded`. La liste `0, 1, …, 4999` est déjà triée : le pivot est toujours le plus petit élément, la liste des petits est vide, et celle des grands n'a qu'un élément de moins. La récursion descend à une profondeur de 5 000, et le nombre total de comparaisons vaut 4 999 + 4 998 + … + 1, environ n²/2. Le C++ affiche bien `5000`, mais pour un million d'éléments triés, il ferait 5 × 10¹¹ comparaisons et dépasserait probablement la taille de la pile.

C'est le **pire cas** du tri rapide : O(n²). Dans le meilleur cas, le pivot coupe la liste en deux moitiés, et l'arbre des appels ressemble à celui du tri fusion : O(n log n). Si on choisit le pivot **au hasard** (`random.choice(t)`), on montre (on l'admettra) que le nombre moyen de comparaisons est environ 1,39 n log₂ n, quelle que soit l'entrée : aucune entrée particulière ne peut piéger l'algorithme, sauf malchance extrême. Les tris de Python et du C++ utilisent des variantes plus sûres encore, et garantissent O(n log n).

**Correction.** Par récurrence forte : `petits` et `grands` sont strictement plus courtes que `t` (le pivot n'y est pas), donc triées par les appels récursifs ; tout élément de `petits` est inférieur à `p`, tout élément de `grands` lui est au moins égal, et la concaténation est triée.

## La sélection rapide

Pour trouver le k-ième plus petit élément d'une liste, par exemple la médiane, on pourrait trier, en O(n log n). La **sélection rapide** fait mieux : comme le tri rapide, elle répartit les éléments autour d'un pivot, mais elle ne continue que dans **la** partie qui contient la réponse, puisqu'on sait combien d'éléments contient chaque partie.

```python
import random

def selection(t, k):
    # k-ième plus petit élément de t (k commence à 1)
    p = random.choice(t)
    petits = [x for x in t if x < p]
    egaux = [x for x in t if x == p]
    if k <= len(petits):
        return selection(petits, k)
    if k <= len(petits) + len(egaux):
        return p
    grands = [x for x in t if x > p]
    return selection(grands, k - len(petits) - len(egaux))

t = [7, 1, 8, 3, 3, 9, 2]
print(selection(t, 1), selection(t, 4), selection(t, 7))
```

```cpp
#include <cstdlib>
#include <iostream>
#include <vector>
using namespace std;

// k-ième plus petit élément de t (k commence à 1)
int selection(const vector<int>& t, int k) {
    int p = t[rand() % t.size()];
    vector<int> petits, grands;
    int egaux = 0;
    for (int x : t) {
        if (x < p) petits.push_back(x);
        else if (x > p) grands.push_back(x);
        else egaux++;
    }
    if (k <= (int) petits.size()) {
        return selection(petits, k);
    }
    if (k <= (int) petits.size() + egaux) {
        return p;
    }
    return selection(grands, k - petits.size() - egaux);
}

int main() {
    vector<int> t = {7, 1, 8, 3, 3, 9, 2};
    cout << selection(t, 1) << " " << selection(t, 4) << " " << selection(t, 7) << "\n";
    return 0;
}
```

Le programme affiche `1 3 9`, quel que soit le hasard : dans l'ordre, la liste est `1 2 3 3 7 8 9`.

**Coût moyen.** Disons qu'un pivot est **bon** s'il n'est ni parmi le quart des plus petits éléments, ni parmi le quart des plus grands. Un pivot tiré au hasard est bon avec une probabilité d'environ 1/2, et après un bon pivot, la partie où l'on continue a au plus 3n/4 éléments. Comme il faut en moyenne deux lancers pour obtenir « pile », il faut en moyenne deux tirages pour obtenir un bon pivot, et chacun coûte au plus de l'ordre de n opérations. La taille passe donc sous 3n/4 pour un coût moyen d'au plus 2n, puis sous (3/4)² n pour un coût moyen d'au plus 2 × (3/4) n, et ainsi de suite : en tout, au plus 2n × (1 + 3/4 + (3/4)² + …) = 8n. La sélection rapide est donc en O(n) en moyenne, mais en O(n²) dans le pire cas, si chaque pivot tombe sur le plus petit élément. En C++, `nth_element(t.begin(), t.begin() + k - 1, t.end())` fait ce travail sur place.

## Diviser pour régner sur un tableau

La méthode s'applique à bien d'autres calculs que le tri. Cherchons la plus grande somme d'une **portion** (cases consécutives, au moins une) d'un tableau. On coupe le tableau en deux : la meilleure portion est entièrement à gauche, entièrement à droite, ou **à cheval** sur la coupure. Les deux premiers cas sont des appels récursifs. Une portion à cheval est formée d'un suffixe de la moitié gauche et d'un préfixe de la moitié droite, qu'on peut choisir indépendamment : la meilleure est le meilleur suffixe plus le meilleur préfixe, trouvés par deux boucles.

```python
def meilleure(t, debut, fin):
    # plus grande somme d'une portion non vide de t[debut:fin]
    if fin - debut == 1:
        return t[debut]
    m = (debut + fin) // 2
    gauche = meilleure(t, debut, m)
    droite = meilleure(t, m, fin)
    # portion à cheval : meilleur suffixe de la gauche + meilleur préfixe de la droite
    s, suffixe = 0, t[m - 1]
    for i in range(m - 1, debut - 1, -1):
        s += t[i]
        suffixe = max(suffixe, s)
    s, prefixe = 0, t[m]
    for i in range(m, fin):
        s += t[i]
        prefixe = max(prefixe, s)
    return max(gauche, droite, suffixe + prefixe)

t = [2, -5, 3, -1, 4, -2, -8, 5]
print(meilleure(t, 0, len(t)))
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

// plus grande somme d'une portion non vide de t[debut..fin[
long long meilleure(const vector<long long>& t, int debut, int fin) {
    if (fin - debut == 1) {
        return t[debut];
    }
    int m = (debut + fin) / 2;
    long long gauche = meilleure(t, debut, m);
    long long droite = meilleure(t, m, fin);
    // portion à cheval : meilleur suffixe de la gauche + meilleur préfixe de la droite
    long long s = 0, suffixe = t[m - 1];
    for (int i = m - 1; i >= debut; i--) {
        s += t[i];
        suffixe = max(suffixe, s);
    }
    long long prefixe = t[m];
    s = 0;
    for (int i = m; i < fin; i++) {
        s += t[i];
        prefixe = max(prefixe, s);
    }
    return max({gauche, droite, suffixe + prefixe});
}

int main() {
    vector<long long> t = {2, -5, 3, -1, 4, -2, -8, 5};
    cout << meilleure(t, 0, t.size()) << "\n";
    return 0;
}
```

Le programme affiche `6` : la portion `3 −1 4` est à cheval sur la coupure, entre l'indice 2 et l'indice 4 ; la meilleure portion à gauche vaut 3, à droite 5. Chaque niveau coûte O(n) et il y a `log₂ n` niveaux : O(n log n). Le niveau 3 a montré un balayage en O(n) pour ce problème ; l'intérêt de la version récursive est son schéma « gauche, droite, à cheval », qui resservira pour des questions où aucun balayage simple n'existe.

## Le coût d'une récurrence

Le coût `T(n)` d'un algorithme diviser pour régner vérifie une **récurrence** : il fait `a` appels sur des entrées de taille `n/b`, plus un travail `f(n)` pour diviser et combiner. Pour l'estimer, on additionne le travail de chaque niveau de l'arbre des appels. Trois situations se présentent :

- **Le travail est le même à chaque niveau.** Tri fusion : `T(n) = 2 T(n/2) + n`. Au niveau `k`, `2^k` appels font chacun `n / 2^k` : `n` par niveau, sur `log₂ n` niveaux, donc O(n log n). Recherche dichotomique : `T(n) = T(n/2) + 1`, un travail constant par niveau, donc O(log n).
- **Le travail diminue en descendant.** Sélection rapide (cas favorable) : `T(n) = T(n/2) + n`. La somme `n + n/2 + n/4 + …` est dominée par la racine : O(n).
- **Le travail augmente en descendant.** `T(n) = 3 T(n/2) + n` : les niveaux font `n`, `3n/2`, `9n/4`… La somme est dominée par les feuilles, au nombre de `3^(log₂ n) = n^(log₂ 3) ≈ n^1,58`.

En résumé, on compare le nombre d'appels `a` au facteur `b^c` dont grossit le travail `f(n) = n^c` quand la taille est multipliée par `b`. Ce résultat porte le nom de **théorème maître** ; il suffit ici de savoir dessiner l'arbre et sommer niveau par niveau. Un découpage déséquilibré change tout : le tri rapide dans son pire cas vérifie `T(n) = T(n − 1) + n`, avec `n` niveaux, d'où O(n²).

## Erreurs fréquentes

**Un découpage qui ne diminue pas.** Si une moitié peut être vide et l'autre égale à toute l'entrée, la fonction se rappelle sur la même entrée : `RecursionError` en Python, `Segmentation fault` en C++. Avec `m = len(t) // 2` et `len(t) ≥ 2`, les deux moitiés sont non vides et strictement plus courtes. Pour une portion `t[debut:fin]`, le cas de base doit être `fin − debut == 1`, et `m` strictement entre `debut` et `fin`.

**Le pire cas du tri rapide.** Un pivot fixe (le premier élément) sur une entrée triée donne O(n²) et une récursion de profondeur `n`. Les tests d'un exercice contiennent toujours ce cas. On choisit le pivot au hasard, ou on utilise le tri du langage.

**`<` au lieu de `<=` dans la fusion.** Le tri reste juste, mais il n'est plus stable, et un comptage d'inversions compte alors aussi les paires d'éléments égaux.

**Le débordement.** Le nombre d'inversions d'une liste de 10⁵ éléments atteint 5 × 10⁹ : en C++, un `int` déborde ; on utilise un `long long`.

**Des copies trop nombreuses.** En Python, `t[:m]` copie la moitié de la liste. Ce n'est pas grave (O(n) par niveau, ce que coûte déjà la fusion), mais copier toute la liste à chaque appel d'une récursion de profondeur `n` coûterait O(n²).

## Un exemple complet

**Énoncé.** On lit `N` entiers. Une **inversion** est une paire de positions `i < j` telle que `t[i] > t[j]`. Compter les inversions, pour `N` jusqu'à 10⁵. Le nombre d'inversions mesure le désordre d'une liste : il vaut 0 pour une liste triée, `N(N − 1)/2` pour une liste triée à l'envers, et c'est exactement le nombre d'échanges de voisins que fait le tri à bulles.

**Idée.** Comparer toutes les paires coûte `N²/2 = 5 × 10⁹` comparaisons : trop lent. On coupe la liste en deux. Une inversion a ses deux positions à gauche, ou toutes deux à droite (appels récursifs), ou bien `i` à gauche et `j` à droite. Pour ces dernières, la position exacte dans chaque moitié ne compte plus : on peut trier les moitiés. On profite donc du tri fusion. Pendant la fusion, quand on place un élément `d[j]` de droite parce qu'il est strictement plus petit que `g[i]`, il est aussi plus petit que `g[i + 1]`, …, jusqu'à la fin de `g`, puisque `g` est triée : il forme une inversion avec chacun des `len(g) − i` éléments restants à gauche.

```python
def tri_et_inversions(t):
    # renvoie (t trié, nombre d'inversions de t)
    if len(t) <= 1:
        return t, 0
    m = len(t) // 2
    g, inv_g = tri_et_inversions(t[:m])
    d, inv_d = tri_et_inversions(t[m:])
    res = []
    inv = inv_g + inv_d
    i = j = 0
    while i < len(g) and j < len(d):
        if g[i] <= d[j]:
            res.append(g[i])
            i += 1
        else:
            res.append(d[j])
            j += 1
            inv += len(g) - i       # d[j] forme une inversion avec g[i], ..., g[fin]
    res.extend(g[i:])
    res.extend(d[j:])
    return res, inv

n = int(input())
t = list(map(int, input().split()))
print(tri_et_inversions(t)[1])
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<long long> t, tmp;

// trie t[debut..fin[ et renvoie son nombre d'inversions
long long triEtInversions(int debut, int fin) {
    if (fin - debut <= 1) {
        return 0;
    }
    int m = (debut + fin) / 2;
    long long inv = triEtInversions(debut, m) + triEtInversions(m, fin);
    int i = debut, j = m, k = debut;
    while (i < m && j < fin) {
        if (t[i] <= t[j]) {
            tmp[k++] = t[i++];
        } else {
            tmp[k++] = t[j++];
            inv += m - i;           // t[j] forme une inversion avec t[i], ..., t[m - 1]
        }
    }
    while (i < m) tmp[k++] = t[i++];
    while (j < fin) tmp[k++] = t[j++];
    for (int p = debut; p < fin; p++) {
        t[p] = tmp[p];
    }
    return inv;
}

int main() {
    int n;
    cin >> n;
    t.resize(n);
    tmp.resize(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    cout << triEtInversions(0, n) << "\n";
    return 0;
}
```

La version C++ trie sur place, dans le tableau `t`, avec un tableau auxiliaire `tmp` : on évite ainsi de créer des vecteurs à chaque appel.

**Correction.** Chaque inversion « à cheval » `(i, j)` est comptée exactement une fois : au moment où `t[j]` est placé, `t[i]` est encore à gauche (il est plus grand, il n'a pas pu être placé avant), et il fait partie des `len(g) − i` éléments comptés. Une paire d'éléments égaux n'est jamais comptée, car à égalité on place d'abord l'élément de gauche.

**Vérification à la main.** Avec `3 1 4 1 2` : les inversions sont (3, 1), (3, 1), (3, 2), (4, 1) et (4, 2), soit 5, et le programme affiche `5`. Dans le détail, la moitié gauche `3 1` contient 1 inversion, la moitié droite `4 1 2` en contient 2, et la fusion de `1 3` avec `1 2 4` en ajoute 2 : le 1 et le 2 de droite passent chacun avant le 3.

**Coût.** Le même que le tri fusion, O(N log N) : environ 1,7 million d'opérations pour N = 10⁵.

## À retenir

- Diviser pour régner : découper en sous-problèmes du même type, les résoudre récursivement, combiner. La correction se prouve par récurrence forte sur la taille, et la terminaison vient de ce que chaque appel porte sur une entrée strictement plus petite.
- Le tri fusion coupe en deux, trie récursivement et fusionne en temps linéaire : O(n log n) dans tous les cas, avec une profondeur de récursion log₂ n. La fusion avec `<=` le rend stable.
- Le tri rapide répartit autour d'un pivot : O(n log n) en moyenne avec un pivot au hasard, mais O(n²) et une profondeur `n` sur une entrée triée avec un pivot fixe.
- La sélection rapide ne poursuit que dans la partie utile : le k-ième plus petit élément en O(n) en moyenne.
- Pour compter des paires (inversions, écarts, sommes de portions), on compte celles de chaque moitié récursivement, puis celles « à cheval », en profitant de moitiés triées.
- Pour estimer le coût, on dessine l'arbre des appels et on additionne le travail niveau par niveau : `2T(n/2) + n` donne O(n log n), `T(n/2) + n` donne O(n), `T(n − 1) + n` donne O(n²).
