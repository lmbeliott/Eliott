Un magasin veut connaître le stock de chacun de ses articles : 12 pommes, 30 poires, 0 kiwi. Avec une liste, il faudrait numéroter les articles (case 0 pour les pommes, case 1 pour les poires…), et retrouver le stock des kiwis demanderait de parcourir la liste des noms : c'est lent dès qu'il y a des milliers d'articles.

Ce chapitre présente deux structures qui règlent ce problème. Un **dictionnaire** range des valeurs non pas à des positions 0, 1, 2…, mais sous des noms choisis librement : des mots, de grands nombres, des points du plan. Un **ensemble** est une collection sans doublons qui répond très vite à la question « cet élément est-il présent ? ». Avec eux, on compte des occurrences, on détecte des répétitions et on fait des recherches en une seule étape, là où une liste demanderait de tout parcourir.

## Un dictionnaire associe des clés à des valeurs

Un dictionnaire est une collection de **paires clé-valeur**. La **clé** sert d'étiquette, la **valeur** est l'information rangée sous cette étiquette. En Python, on l'écrit entre accolades, chaque paire sous la forme `clé: valeur` :

```python
stock = {"pomme": 12, "poire": 30, "kiwi": 0}
print(stock["poire"])
print(len(stock))
```

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> stock;
    stock["pomme"] = 12;
    stock["poire"] = 30;
    stock["kiwi"] = 0;
    cout << stock["poire"] << "\n";
    cout << stock.size() << "\n";
    return 0;
}
```

Le programme affiche `30` puis `3`. L'expression `stock["poire"]` ressemble à l'accès à une case de liste, mais entre les crochets on met une clé, pas une position. La fonction `len` donne le nombre de paires du dictionnaire.

En C++, le type s'appelle `map` (il faut `#include <map>`). On écrit entre chevrons le type des clés puis celui des valeurs : `map<string, int>` associe des entiers à des chaînes. Le dictionnaire vide se crée en déclarant la variable, et `size()` joue le rôle de `len`.

Dans un dictionnaire, **chaque clé est unique**, mais plusieurs clés peuvent avoir la même valeur.

## Ajouter et modifier

L'affectation `d[cle] = valeur` fait deux choses différentes selon la situation : si la clé n'existe pas encore, elle **ajoute** une nouvelle paire ; si la clé existe déjà, elle **remplace** l'ancienne valeur.

```python
stock = {}
stock["pomme"] = 12
stock["pomme"] = stock["pomme"] - 5
stock["prune"] = 40
print(stock)
```

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> stock;
    stock["pomme"] = 12;
    stock["pomme"] = stock["pomme"] - 5;
    stock["prune"] = 40;
    cout << stock["pomme"] << " " << stock["prune"] << "\n";
    return 0;
}
```

En Python, `{}` crée un dictionnaire vide. Après les trois affectations, le programme affiche `{'pomme': 7, 'prune': 40}` : la deuxième ligne a modifié la valeur de `pomme`, la troisième a ajouté une clé. La version C++ affiche `7 40`.

Pour retirer une paire, on écrit `del stock["prune"]` en Python, et `stock.erase("prune")` en C++.

## Tester la présence d'une clé

Lire la valeur d'une clé absente est une erreur. En Python, le programme s'arrête :

```python
stock = {"pomme": 12}
print(stock["kiwi"])
```

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> stock;
    stock["pomme"] = 12;
    cout << stock["kiwi"] << "\n";
    cout << stock.size() << "\n";
    return 0;
}
```

Python affiche `KeyError: 'kiwi'` : la clé `'kiwi'` n'existe pas. Le C++ se comporte autrement, et c'est un piège : `stock["kiwi"]` ne provoque aucune erreur, mais **crée** silencieusement la clé `kiwi` avec la valeur 0. Le programme affiche `0`, puis `2`, car le dictionnaire contient maintenant deux clés.

Avant de lire une clé dont on n'est pas sûr, on teste donc sa présence. En Python, l'opérateur `in` répond à la question « cette clé est-elle dans le dictionnaire ? », et `not in` à la question contraire. En C++, `d.count(cle)` vaut 1 si la clé est présente et 0 sinon, sans rien créer.

Python offre aussi un raccourci très utile : `d.get(cle, defaut)` renvoie la valeur de la clé si elle existe, et la **valeur par défaut** sinon. Le C++ n'a pas d'équivalent direct ; on écrit le test à la main.

```python
stock = {"pomme": 12}
if "kiwi" in stock:
    print("kiwi :", stock["kiwi"])
else:
    print("pas de kiwi")
print(stock.get("pomme", 0), stock.get("kiwi", 0))
```

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> stock;
    stock["pomme"] = 12;
    if (stock.count("kiwi") > 0) {
        cout << "kiwi : " << stock["kiwi"] << "\n";
    } else {
        cout << "pas de kiwi\n";
    }
    int kiwis = 0;
    if (stock.count("kiwi") > 0) {
        kiwis = stock["kiwi"];
    }
    cout << stock["pomme"] << " " << kiwis << "\n";
    return 0;
}
```

Le programme affiche `pas de kiwi`, puis `12 0`. La valeur par défaut 0 a été renvoyée pour `kiwi`, mais le dictionnaire n'a pas été modifié : `get` ne crée pas de clé.

## Compter des occurrences

L'usage le plus fréquent d'un dictionnaire est de **compter** combien de fois chaque élément apparaît. On l'appelle souvent un **dictionnaire de fréquences**. Pour chaque élément lu, on augmente de 1 le compteur qui lui est associé. Le premier passage sur un élément pose problème, car sa clé n'existe pas encore : `get` avec la valeur par défaut 0 règle la question.

```python
mots = "le chat et le chien et le rat".split()
compte = {}
for m in mots:
    compte[m] = compte.get(m, 0) + 1
print(compte["le"], compte["et"], compte["rat"])
```

```cpp
#include <iostream>
#include <map>
#include <string>
#include <vector>
using namespace std;

int main() {
    vector<string> mots = {"le", "chat", "et", "le", "chien", "et", "le", "rat"};
    map<string, int> compte;
    for (string m : mots) {
        compte[m]++;
    }
    cout << compte["le"] << " " << compte["et"] << " " << compte["rat"] << "\n";
    return 0;
}
```

Le programme affiche `3 2 1`. À la première rencontre de `le`, `compte.get("le", 0)` vaut 0, et la clé est créée avec la valeur 1 ; aux rencontres suivantes, elle passe à 2 puis 3. En C++, `compte[m]++` suffit : ici, la création automatique d'une clé à 0 est exactement ce qu'on veut.

Pour compter de petits entiers consécutifs (des chiffres, des notes de 0 à 20), une liste de compteurs fait aussi bien. Le dictionnaire devient indispensable pour des mots, de très grands nombres, ou des valeurs dont on ne connaît pas l'étendue.

## Parcourir un dictionnaire

Une boucle `for` sur un dictionnaire parcourt ses **clés**. Pour avoir à la fois la clé et la valeur, on parcourt `d.items()`, qui donne les paires une par une. Enfin, `d.values()` donne seulement les valeurs, ce qui permet par exemple d'écrire `max(d.values())`.

```python
notes = {"lea": 14, "tom": 9, "ali": 17}
for nom in notes:
    print(nom)
for nom, note in notes.items():
    if note >= 10:
        print(nom, note)
print(max(notes.values()))
```

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    map<string, int> notes;
    notes["lea"] = 14;
    notes["tom"] = 9;
    notes["ali"] = 17;
    for (auto [nom, note] : notes) {
        cout << nom << "\n";
    }
    for (auto [nom, note] : notes) {
        if (note >= 10) {
            cout << nom << " " << note << "\n";
        }
    }
    return 0;
}
```

La question de l'**ordre de parcours** demande de l'attention, car il dépend du langage et de la structure :

- un dictionnaire Python est parcouru dans l'**ordre d'insertion** des clés : ici `lea`, `tom`, `ali`. Le programme affiche les trois noms, puis `lea 14` et `ali 17`, puis `17` ;
- un `map` du C++ est parcouru dans l'**ordre croissant des clés** : ici `ali`, `lea`, `tom`. La syntaxe `auto [nom, note]` (C++17) donne un nom à la clé et à la valeur de chaque paire, et `auto` laisse le compilateur trouver leurs types ;
- le C++ propose aussi `unordered_map` (avec `#include <unordered_map>`), qui s'utilise exactement comme `map` et qui est en général plus rapide, mais dont l'ordre de parcours est quelconque.

Quand un problème impose un ordre d'affichage, on ne compte donc pas sur l'ordre du dictionnaire : on parcourt plutôt une autre séquence dans l'ordre voulu, par exemple la liste des données lues, ou les lettres de `a` à `z`. Pour afficher les clés dans l'ordre croissant, Python fournit aussi `sorted(d)`, qui renvoie la liste triée des clés. On s'en sert ici comme d'un outil tout prêt ; la façon dont on trie une liste sera étudiée au niveau 3.

## Des couples comme clés

Une clé peut être un entier, une chaîne, mais aussi un **couple** de valeurs, écrit entre parenthèses : `(3, 5)`. En Python, un tel groupe de valeurs s'appelle un **tuple**. On s'en sert pour repérer un point du plan ou une case de grille par ses deux coordonnées.

```python
cases = {}
cases[(2, 3)] = "mur"
cases[(0, 0)] = "depart"
x, y = 2, 3
print(cases.get((x, y), "vide"), cases.get((3, 2), "vide"))
```

```cpp
#include <iostream>
#include <map>
#include <string>
#include <utility>
using namespace std;

int main() {
    map<pair<int, int>, string> cases;
    cases[{2, 3}] = "mur";
    cases[{0, 0}] = "depart";
    int x = 2, y = 3;
    string a = "vide", b = "vide";
    if (cases.count({x, y}) > 0) {
        a = cases[{x, y}];
    }
    if (cases.count({3, 2}) > 0) {
        b = cases[{3, 2}];
    }
    cout << a << " " << b << "\n";
    return 0;
}
```

Le programme affiche `mur vide` : la case `(3, 2)` n'est pas la case `(2, 3)`. En C++, le couple s'écrit avec le type `pair<int, int>` et les valeurs entre accolades.

Un tuple se défait comme dans une affectation multiple : si `p = (2, 3)`, alors `x, y = p` range 2 dans `x` et 3 dans `y`. Une liste de couples se parcourt donc avec `for x, y in points:`. On peut aussi lire `p[0]` et `p[1]`, comme dans une liste. En C++, les deux valeurs d'une `pair` `p` s'appellent `p.first` et `p.second`, et on ajoute un couple à un `vector<pair<int, int>>` avec `points.push_back({x, y})`. Attention : `unordered_map` et `unordered_set` n'acceptent pas directement des `pair` comme clés ; on utilise `map` et `set`.

En revanche, une **liste** ne peut pas servir de clé en Python. Écrire `d[[2, 3]] = 1` arrête le programme avec `TypeError: unhashable type: 'list'`. La raison : une liste peut être modifiée après coup, et sa place dans le dictionnaire deviendrait fausse. Un tuple, lui, ne peut pas être modifié. On convertit donc la liste en tuple, ou on utilise directement un tuple.

## Les ensembles

Un **ensemble** est une collection d'éléments **sans doublons** et **sans ordre**. On peut le voir comme un dictionnaire qui n'aurait que des clés. Il sert à se souvenir d'éléments déjà vus et à tester très vite leur présence.

En Python, `set()` crée un ensemble vide, `add` ajoute un élément, `in` teste la présence et `len` donne le nombre d'éléments. `set(liste)` construit l'ensemble des éléments d'une liste (ou des caractères d'une chaîne), ce qui supprime les doublons. En C++, on utilise `set` (avec `#include <set>`) : `insert` ajoute, `count` teste, `size` compte.

```python
vus = set()
for x in [4, 8, 4, 1, 8, 4]:
    vus.add(x)
print(len(vus), 8 in vus, 5 in vus)
print(len(set("abracadabra")))
```

```cpp
#include <iostream>
#include <set>
#include <string>
#include <vector>
using namespace std;

int main() {
    vector<int> valeurs = {4, 8, 4, 1, 8, 4};
    set<int> vus;
    for (int x : valeurs) {
        vus.insert(x);
    }
    cout << vus.size() << " " << vus.count(8) << " " << vus.count(5) << "\n";
    string mot = "abracadabra";
    set<char> lettres;
    for (char c : mot) {
        lettres.insert(c);
    }
    cout << lettres.size() << "\n";
    return 0;
}
```

Le programme Python affiche `3 True False`, puis `5`. Les six ajouts n'ont laissé que trois éléments, 4, 8 et 1, car ajouter un élément déjà présent ne change rien. Le mot `abracadabra` contient cinq lettres différentes : a, b, r, c, d. La version C++ affiche `3 1 0`, car `count` renvoie un nombre.

Python fournit aussi les opérations des mathématiques sur les ensembles :

- l'**union** `a | b` contient les éléments présents dans `a` ou dans `b` ;
- l'**intersection** `a & b` contient les éléments présents à la fois dans `a` et dans `b` ;
- la **différence** `a - b` contient les éléments de `a` qui ne sont pas dans `b`.

```python
a = {1, 2, 3, 4}
b = {3, 4, 5}
print(len(a | b), len(a & b), len(a - b))
print(3 in (a & b))
```

```cpp
#include <iostream>
#include <set>
using namespace std;

int main() {
    set<int> a = {1, 2, 3, 4};
    set<int> b = {3, 4, 5};
    set<int> inter;
    for (int x : a) {
        if (b.count(x) > 0) {
            inter.insert(x);
        }
    }
    cout << inter.size() << " " << inter.count(3) << "\n";
    return 0;
}
```

Le programme Python affiche `5 2 2`, puis `True`. Les accolades avec des éléments seuls, sans `:`, créent un ensemble. En C++, il n'y a pas d'opérateur pour l'intersection : on la construit avec une boucle, en gardant les éléments de `a` présents dans `b`, comme dans l'exemple. La version C++ affiche `2 1`.

Comme pour les dictionnaires, le C++ propose `unordered_set`, plus rapide et sans ordre, alors qu'un `set` est parcouru dans l'ordre croissant. En Python, l'ordre d'un ensemble n'est **jamais** garanti : `print({30, 2, 17})` peut afficher les éléments dans un ordre surprenant. Pour un affichage dans un ordre précis, on parcourt les valeurs possibles dans cet ordre, ou on utilise `sorted`.

## Pourquoi un ensemble est plus rapide qu'une liste

L'opérateur `in` fonctionne aussi sur une liste : `8 in [4, 8, 1]` vaut `True`, et `x not in t` vaut `True` quand `x` n'apparaît nulle part dans la liste `t`. Sur une chaîne, `c in s` teste si le caractère `c` apparaît dans `s`. Le C++ n'a pas d'équivalent pour un `vector` : on écrit une boucle qui compare chaque élément, avec un booléen. Ce test a un coût caché.

Un test `x in liste` compare `x` aux éléments de la liste un par un, depuis le début. Si `x` est absent, il fait autant de comparaisons qu'il y a d'éléments. Un test `x in ensemble` ne parcourt rien : à partir de la valeur de `x`, Python calcule directement l'endroit de sa mémoire où `x` serait rangé, et regarde s'il y est. Ce calcul s'appelle le **hachage**, et la structure qui l'utilise une **table de hachage**. Les dictionnaires fonctionnent de la même façon pour leurs clés. Le résultat : un test d'appartenance à un ensemble prend presque le même temps, que l'ensemble contienne dix éléments ou un million.

La différence devient énorme quand les tests sont nombreux. Pour savoir si 100 000 valeurs sont toutes différentes, on range chaque valeur après avoir vérifié qu'elle n'est pas déjà rangée. Avec une liste, la dernière vérification compare à 99 999 éléments, l'avant-dernière à 99 998, et ainsi de suite : en tout, environ 100 000 × 100 000 / 2, soit 5 milliards de comparaisons, ce qui prend plusieurs dizaines de secondes en Python. Avec un ensemble, il faut 100 000 tests rapides : une fraction de seconde.

En C++, `unordered_set` et `unordered_map` sont des tables de hachage. Les `set` et `map` utilisent une autre organisation, qui garde les éléments triés : chaque test y demande quelques dizaines de comparaisons, ce qui reste très rapide. On choisit `set` ou `map` quand l'ordre croissant est utile, ou quand les clés sont des `pair`.

## Liste, dictionnaire ou ensemble ?

Les trois structures répondent à des besoins différents :

- une **liste** range des valeurs dans un ordre, aux positions 0, 1, 2… On la choisit quand l'ordre compte, quand on accède par position, ou quand les « clés » sont de petits entiers consécutifs ;
- un **ensemble** retient des éléments sans doublons. On le choisit pour la question « l'ai-je déjà vu ? » ou « est-il autorisé ? », et pour enlever des doublons ;
- un **dictionnaire** associe une information à chaque clé. On le choisit quand on doit retrouver une valeur à partir d'un mot, d'un grand nombre ou d'un couple : un prix à partir d'un nom, un nombre d'apparitions à partir d'une valeur, une position à partir d'un état déjà rencontré.

## Les erreurs fréquentes

### Lire une clé absente

`compte[m] = compte[m] + 1` sur une clé `m` encore absente provoque `KeyError`. On écrit `compte.get(m, 0) + 1`, ou on teste `m in compte` avant. En C++, l'erreur inverse guette : `d[cle]` crée la clé, ce qui fausse `size()` et les parcours. Pour un simple test, on utilise toujours `count`.

### Modifier un dictionnaire pendant qu'on le parcourt

```python
stock = {"pomme": 12, "kiwi": 0, "poire": 30}
for nom in stock:
    if stock[nom] == 0:
        del stock[nom]
```

```cpp
// En C++, effacer une clé du map pendant une boucle for (auto [nom, n] : stock)
// est interdit : le programme peut planter ou donner n'importe quoi.
```

Python s'arrête avec `RuntimeError: dictionary changed size during iteration`. On ne peut pas ajouter ni supprimer de clés pendant un parcours. On parcourt plutôt une copie de la liste des clés, `for nom in list(stock):`, ou on construit un nouveau dictionnaire avec les paires à garder. Modifier la **valeur** d'une clé existante pendant le parcours, en revanche, est permis.

### Créer un ensemble vide avec `{}`

`vus = {}` crée un dictionnaire vide, pas un ensemble. L'instruction `vus.add(3)` provoque alors `AttributeError: 'dict' object has no attribute 'add'`. L'ensemble vide s'écrit `set()`.

### Utiliser une liste là où il faut un ensemble

Le programme est juste, mais beaucoup trop lent : un test `in` sur une liste, répété à chaque tour d'une boucle, fait des milliards de comparaisons sur de grandes entrées. Dès qu'une boucle contient un `if x in ...`, on se demande si un ensemble ne serait pas plus adapté.

## Exemple complet : les mots miroirs

**Énoncé.** On lit `N` mots distincts, un par ligne. Deux mots sont **miroirs** si l'un s'écrit comme l'autre à l'envers, comme `rac` et `car`. Afficher le nombre de paires de mots miroirs. Un palindrome comme `ici` ne forme pas de paire avec lui-même.

**Idée.** Essayer toutes les paires de mots demanderait N² / 2 comparaisons. À la place, on lit les mots un par un, en rangeant ceux déjà lus dans un ensemble. Quand on lit un mot `m`, il forme une paire avec un mot déjà lu exactement quand son envers est dans l'ensemble. En Python, la tranche `m[::-1]` donne la chaîne `m` à l'envers : c'est une tranche `m[a:b]` comme au chapitre sur les chaînes, mais sans bornes et avec un **pas** de -1, qui parcourt la chaîne de la fin vers le début. En C++, on la construit en parcourant `m` de la dernière lettre à la première. Chaque paire est ainsi comptée une seule fois, au moment où l'on lit son second mot. Pour un palindrome, l'envers est le mot lui-même : comme on teste **avant** d'ajouter `m`, et que les mots sont distincts, il n'est jamais compté.

**Programme.**

```python
n = int(input())
vus = set()
paires = 0
for i in range(n):
    m = input()
    if m[::-1] in vus:
        paires = paires + 1
    vus.add(m)
print(paires)
```

```cpp
#include <iostream>
#include <string>
#include <unordered_set>
using namespace std;

int main() {
    int n;
    cin >> n;
    unordered_set<string> vus;
    int paires = 0;
    for (int i = 0; i < n; i++) {
        string m;
        cin >> m;
        string envers = "";
        for (int k = m.size() - 1; k >= 0; k--) {
            envers += m[k];
        }
        if (vus.count(envers) > 0) {
            paires = paires + 1;
        }
        vus.insert(m);
    }
    cout << paires << "\n";
    return 0;
}
```

**Vérification à la main** avec les mots `rac`, `ici`, `elle`, `car`, `sel`, `les` :

| Mot lu | Envers | Envers déjà vu ? | `paires` |
| --- | --- | --- | --- |
| `rac` | `car` | non | 0 |
| `ici` | `ici` | non | 0 |
| `elle` | `elle` | non | 0 |
| `car` | `rac` | oui | 1 |
| `sel` | `les` | non | 1 |
| `les` | `sel` | oui | 2 |

Le programme affiche `2`. Les palindromes `ici` et `elle` ne sont pas comptés, car leur envers n'est pas encore dans l'ensemble au moment du test. Avec 100 000 mots, le programme fait 100 000 tests d'appartenance rapides, au lieu des 5 milliards de comparaisons de la double boucle.

## À retenir

- Un dictionnaire associe des valeurs à des clés uniques : `d[cle] = valeur` ajoute ou remplace, `d[cle]` lit. En C++ : `map` ou `unordered_map`.
- Lire une clé absente provoque `KeyError` en Python et crée la clé en C++ : on teste avec `in` (Python) ou `count` (C++), ou on utilise `d.get(cle, defaut)`.
- Pour compter des occurrences : `compte[x] = compte.get(x, 0) + 1` en Python, `compte[x]++` en C++.
- Un ensemble garde des éléments sans doublons et sans ordre : `add`, `in`, `len`, et `|`, `&`, `-` pour l'union, l'intersection et la différence. En C++ : `set` ou `unordered_set`.
- Le test d'appartenance à un ensemble ou à un dictionnaire est presque instantané, alors que `x in liste` parcourt toute la liste : sur de grandes entrées, c'est la différence entre une fraction de seconde et plusieurs dizaines de secondes.
- On ne modifie pas les clés d'un dictionnaire pendant qu'on le parcourt, et on ne compte pas sur l'ordre d'un ensemble ou d'un `unordered_map` pour l'affichage.
