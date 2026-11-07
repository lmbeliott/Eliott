Un éditeur de texte garde la liste des modifications : le bouton « Annuler » défait toujours la **dernière**. À un guichet, au contraire, c'est la personne arrivée **la première** qui est servie. Ces deux façons de ranger des éléments en attente reviennent sans cesse en algorithmique. La première s'appelle une **pile**, la seconde une **file**.

Ni l'une ni l'autre n'est un nouveau type de données compliqué : une pile est une liste dont on ne touche que la fin, une file une liste dont on retire le début et allonge la fin. Leur intérêt est ailleurs : quand on reconnaît qu'un problème se comporte comme une pile ou comme une file, l'algorithme devient simple, et chaque opération ne coûte que quelques instructions. Ce chapitre présente les deux structures, puis leurs usages classiques : vérifier des parenthèses, calculer une expression, simuler une file d'attente et trouver, pour chaque élément d'une liste, le prochain élément plus grand.

## La pile

Une **pile** est une collection où l'on ajoute et retire les éléments du même côté, appelé le **sommet**. **Empiler**, c'est ajouter au sommet ; **dépiler**, c'est retirer l'élément du sommet. Le dernier élément empilé est donc le premier dépilé : on dit qu'une pile est **LIFO**, pour *last in, first out*. L'image est celle d'une pile d'assiettes.

En Python, une liste fait une très bonne pile : `append` empile, `pop()` dépile et renvoie l'élément retiré, `p[-1]` lit le sommet sans le retirer, et `len(p) == 0` teste si la pile est vide. En C++, on peut utiliser un `vector` (`push_back`, `pop_back`, `back`, `empty`) ou le type `stack` de `<stack>` (`push`, `pop`, `top`, `empty`).

```python
p = []
p.append(1)
p.append(2)
p.append(3)
print(p.pop())
print(p[-1], len(p))
```

```cpp
#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<int> p;
    p.push(1);
    p.push(2);
    p.push(3);
    cout << p.top() << "\n";
    p.pop();
    cout << p.top() << " " << p.size() << "\n";
    return 0;
}
```

Le programme affiche `3`, puis `2 2` : le 3, empilé en dernier, sort le premier ; le sommet est ensuite le 2, et il reste deux éléments. En C++, `pop()` retire le sommet sans le renvoyer : on lit d'abord `top()`.

Ces opérations coûtent quelques instructions, quelle que soit la taille de la pile : on ne touche qu'à la fin de la liste, sans déplacer les autres éléments.

## Vérifier un parenthésage

Une chaîne de parenthèses `(`, `)`, `[`, `]` est **bien parenthésée** si chaque fermante referme l'ouvrante de même type la plus récente qui n'est pas encore refermée, et si toutes les ouvrantes sont refermées. Ainsi, `([]())` est bien parenthésée, mais pas `([)]` ni `(()`.

La règle « la plus récente pas encore refermée » est exactement celle d'une pile. On parcourt la chaîne : une ouvrante est empilée ; une fermante doit trouver au sommet l'ouvrante du même type, que l'on dépile. Si la pile est vide ou si le sommet ne correspond pas, la chaîne est incorrecte. À la fin, la pile doit être vide.

```python
s = input()
pile = []
correct = True
for c in s:
    if c == "(" or c == "[":
        pile.append(c)
    else:
        attendu = "(" if c == ")" else "["
        if len(pile) == 0 or pile[-1] != attendu:
            correct = False
            break
        pile.pop()
if correct and len(pile) == 0:
    print("OUI")
else:
    print("NON")
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string s;
    cin >> s;
    vector<char> pile;
    bool correct = true;
    for (char c : s) {
        if (c == '(' || c == '[') {
            pile.push_back(c);
        } else {
            char attendu = (c == ')') ? '(' : '[';
            if (pile.empty() || pile.back() != attendu) {
                correct = false;
                break;
            }
            pile.pop_back();
        }
    }
    if (correct && pile.empty()) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
```

En Python, `x if condition else y` vaut `x` si la condition est vraie et `y` sinon : c'est l'équivalent de `condition ? x : y` en C++. La ligne `attendu = ...` donne donc l'ouvrante qui correspond à la fermante `c`.

Avec `([]())`, la pile passe par `(`, `([`, `(`, `((`, `(` puis devient vide : le programme affiche `OUI`. Avec `([)]`, la fermante `)` trouve `[` au sommet : `NON`. Avec `(()`, une ouvrante reste dans la pile à la fin : `NON`.

**Pourquoi c'est juste.** Invariant : avant chaque caractère, la pile contient, dans l'ordre, les ouvrantes déjà lues et pas encore refermées ; la plus récente est au sommet. Une fermante doit refermer justement celle du sommet. **Coût** : chaque caractère est empilé au plus une fois et dépilé au plus une fois, donc au plus `2n` opérations de pile pour une chaîne de longueur `n`.

## Évaluer une expression postfixée

Dans la **notation postfixée**, on écrit chaque opérateur après ses deux opérandes : `3 4 +` signifie `3 + 4`, et `5 1 2 + 4 * + 3 -` signifie `5 + (1 + 2) × 4 − 3`. Cette notation n'a jamais besoin de parenthèses, et elle se calcule avec une pile : un nombre est empilé ; un opérateur dépile deux valeurs, calcule, et empile le résultat. Attention à l'ordre : le sommet est le **second** opérande.

```python
elements = "5 1 2 + 4 * + 3 -".split()
pile = []
for e in elements:
    if e == "+" or e == "-" or e == "*":
        b = pile.pop()
        a = pile.pop()
        if e == "+":
            pile.append(a + b)
        elif e == "-":
            pile.append(a - b)
        else:
            pile.append(a * b)
    else:
        pile.append(int(e))
print(pile[0])
```

```cpp
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

int main() {
    istringstream entree("5 1 2 + 4 * + 3 -");
    vector<long long> pile;
    string e;
    while (entree >> e) {
        if (e == "+" || e == "-" || e == "*") {
            long long b = pile.back();
            pile.pop_back();
            long long a = pile.back();
            pile.pop_back();
            if (e == "+") {
                pile.push_back(a + b);
            } else if (e == "-") {
                pile.push_back(a - b);
            } else {
                pile.push_back(a * b);
            }
        } else {
            pile.push_back(stoll(e));
        }
    }
    cout << pile[0] << "\n";
    return 0;
}
```

Le programme affiche `14`. La pile passe par `[5]`, `[5, 1]`, `[5, 1, 2]`, `[5, 3]`, `[5, 3, 4]`, `[5, 12]`, `[17]`, `[17, 3]` et `[14]`. Les deux opérandes d'un opérateur sont toujours les deux valeurs les plus récentes pas encore utilisées : c'est l'invariant qui justifie l'algorithme. Une expression est mal formée si un opérateur trouve moins de deux valeurs, ou s'il ne reste pas exactement une valeur à la fin. (En C++, `istringstream` de `<sstream>` permet ici de lire les mots d'une chaîne comme on lirait l'entrée.)

## La file

Une **file** est une collection où l'on ajoute les éléments d'un côté, la **fin**, et où on les retire de l'autre, la **tête**. **Enfiler**, c'est ajouter à la fin ; **défiler**, c'est retirer l'élément de tête. Le premier entré est le premier sorti : une file est **FIFO**, pour *first in, first out*.

Une liste Python n'est **pas** une bonne file. L'appel `t.pop(0)` retire bien le premier élément, mais il doit ensuite décaler tous les autres d'une case vers la gauche : pour une liste de `n` éléments, cela fait `n − 1` déplacements. Le module `collections` fournit le type `deque`, conçu pour cela : `append` enfile, `popleft()` défile, `f[0]` lit la tête, et chacune de ces opérations coûte quelques instructions. En C++, le type `queue` de `<queue>` propose `push`, `pop`, `front`, `empty` et `size`.

```python
from collections import deque

f = deque()
f.append("a")
f.append("b")
f.append("c")
print(f.popleft())
print(f[0], len(f))
```

```cpp
#include <iostream>
#include <queue>
#include <string>
using namespace std;

int main() {
    queue<string> f;
    f.push("a");
    f.push("b");
    f.push("c");
    cout << f.front() << "\n";
    f.pop();
    cout << f.front() << " " << f.size() << "\n";
    return 0;
}
```

Le programme affiche `a`, puis `b 2` : le premier arrivé est le premier sorti. Un `deque` (une **file à double entrée**) sait aussi ajouter en tête avec `appendleft` et retirer à la fin avec `pop` ; en C++, le type `deque` de `<deque>` offre `push_front`, `push_back`, `pop_front` et `pop_back`.

## Simuler avec une file

Beaucoup de processus se simulent avec une file : des clients qui attendent, des tâches qui passent chacune leur tour, des cartes que l'on remet sous un paquet. Exemple : un paquet contient les cartes 1 à `n`, la carte 1 sur le dessus. On répète : on pose la carte du dessus sur la table, puis on glisse la carte suivante sous le paquet. On veut l'ordre dans lequel les cartes sont posées.

```python
from collections import deque

n = 6
paquet = deque(range(1, n + 1))
posees = []
while len(paquet) > 0:
    posees.append(paquet.popleft())
    if len(paquet) > 0:
        paquet.append(paquet.popleft())
print(*posees)
```

```cpp
#include <iostream>
#include <queue>
using namespace std;

int main() {
    int n = 6;
    queue<int> paquet;
    for (int i = 1; i <= n; i++) {
        paquet.push(i);
    }
    while (!paquet.empty()) {
        cout << paquet.front() << " ";
        paquet.pop();
        if (!paquet.empty()) {
            paquet.push(paquet.front());
            paquet.pop();
        }
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche `1 3 5 2 6 4`. La simulation s'arrête, car chaque tour pose une carte : le paquet perd un élément par tour. Elle fait `n` tours d'au plus trois opérations de file. Avec une liste et `pop(0)`, chaque tour décalerait tout le paquet : environ `n² / 2` déplacements, soit des milliards pour `n = 100 000`.

## Pile monotone : le prochain élément plus grand

Pour chaque élément d'une liste, on cherche le **prochain élément plus grand** : la première valeur strictement plus grande placée à sa droite, ou `-1` s'il n'y en a pas. Pour `2 7 3 1 5 8`, les réponses sont `7 8 5 5 8 -1`. Chercher vers la droite à partir de chaque position coûte jusqu'à `n² / 2` comparaisons, par exemple sur une liste décroissante.

L'idée est de garder une pile des positions **en attente**, celles dont on n'a pas encore trouvé la réponse. Quand une valeur `x` arrive, elle est la réponse de toutes les positions en attente dont la valeur est plus petite que `x` : on les dépile en leur donnant la réponse `x`. Puis on empile la position de `x`, qui attend à son tour.

```python
t = [2, 7, 3, 1, 5, 8]
n = len(t)
reponse = [-1] * n
pile = []
for i in range(n):
    while len(pile) > 0 and t[pile[-1]] < t[i]:
        reponse[pile.pop()] = t[i]
    pile.append(i)
print(*reponse)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {2, 7, 3, 1, 5, 8};
    int n = t.size();
    vector<int> reponse(n, -1);
    vector<int> pile;
    for (int i = 0; i < n; i++) {
        while (!pile.empty() && t[pile.back()] < t[i]) {
            reponse[pile.back()] = t[i];
            pile.pop_back();
        }
        pile.push_back(i);
    }
    for (int x : reponse) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche `7 8 5 5 8 -1`. Quand le 5 arrive, la pile contient les positions des valeurs `7 3 1` ; le 1 puis le 3 sont dépilés avec la réponse 5, et le 7 reste.

**Pourquoi c'est juste.** Invariant : avant de traiter la position `i`, la pile contient exactement les positions **en attente**, c'est-à-dire les `j < i` telles qu'aucune des valeurs `t[j + 1], …, t[i − 1]` n'est plus grande que `t[j]`, rangées de bas en haut par position croissante ; et leurs valeurs **décroissent** (au sens large) du bas vers le haut. On parle de **pile monotone**. Au départ, la pile est vide et aucune position n'est en attente.

Quand `t[i]` arrive, les positions en attente de valeur plus petite que `t[i]` sont toutes en haut de la pile, puisque les valeurs décroissent vers le haut : la boucle `while` les dépile toutes, et s'arrête sur la première valeur supérieure ou égale (ou sur une pile vide). Pour chaque position `j` dépilée, `t[i]` est bien la première valeur plus grande à droite de `j` : les valeurs entre les deux ne dépassaient pas `t[j]`, sinon `j` ne serait plus en attente. Les positions qui restent ne sont pas dépassées par `t[i]` et restent en attente ; on empile enfin `i`, de valeur au plus égale à celle du sommet. L'invariant est donc vrai avant `i + 1`. À la fin, les positions encore dans la pile n'ont jamais été dépassées : elles gardent `-1`.

**Combien d'opérations.** Un seul passage peut dépiler beaucoup d'éléments, et l'on pourrait craindre `n²` opérations. Il faut compter globalement : chaque position est empilée une fois et dépilée au plus une fois. Sur tout le programme, il y a donc au plus `n` dépilements, et la boucle `while` fait au plus `2n` tests au total. L'algorithme fait de l'ordre de `n` opérations, au lieu de `n² / 2`.

## Erreurs fréquentes

**Dépiler une pile vide.** `p.pop()` sur une liste vide provoque `IndexError: pop from empty list`, et `p[-1]` provoque `IndexError: list index out of range`. En C++, `top()` ou `pop()` sur une pile vide ne donnent aucun message clair : le programme lit n'importe quoi ou s'arrête avec `Segmentation fault`. On teste toujours `len(p) > 0` ou `!p.empty()` avant, comme dans les boucles ci-dessus, où ce test est écrit en premier.

**Récupérer la valeur de `pop` en C++.** `int x = p.pop();` ne compile pas : `error: void value not ignored as it ought to be`. La méthode `pop` ne renvoie rien ; on écrit `int x = p.top(); p.pop();`.

**Oublier l'import.** Utiliser `deque` sans `from collections import deque` provoque `NameError: name 'deque' is not defined`.

**Une file faite avec une liste.** Aucun message d'erreur, mais `pop(0)` décale toute la liste à chaque appel : le programme dépasse la limite de temps dès que la file est longue.

**Inverser les opérandes.** Dans une expression postfixée, `8 3 -` vaut `5`. Le premier élément dépilé est le second opérande : en écrivant `pile.pop() - pile.pop()`, on calcule `3 − 8`.

## Un exemple complet

**Énoncé.** On relève la température de `N` jours consécutifs. Pour chaque jour, afficher le nombre de jours à attendre avant une température strictement plus élevée, ou `0` si cela n'arrive jamais. `N` peut atteindre 100 000.

**Idée.** C'est le prochain élément plus grand, mais on veut une distance plutôt qu'une valeur. On garde la même pile de positions en attente : quand le jour `i` dépile le jour `j`, la réponse de `j` est `i − j`.

**Programme.**

```python
n = int(input())
t = list(map(int, input().split()))
attente = [0] * n
pile = []
for i in range(n):
    while len(pile) > 0 and t[pile[-1]] < t[i]:
        j = pile.pop()
        attente[j] = i - j
    pile.append(i)
print(*attente)
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
    vector<int> attente(n, 0);
    vector<int> pile;
    for (int i = 0; i < n; i++) {
        while (!pile.empty() && t[pile.back()] < t[i]) {
            int j = pile.back();
            pile.pop_back();
            attente[j] = i - j;
        }
        pile.push_back(i);
    }
    for (int x : attente) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
```

**Vérification à la main.** Avec `7` puis `13 12 15 11 9 12 16`, les jours sont numérotés de 0 à 6. Le jour 2 (15) dépile les jours 1 et 0 : attentes `1` et `2`. Le jour 5 (12) dépile les jours 4 (9) et 3 (11) : attentes `1` et `2`. Le jour 6 (16) dépile les jours 5 et 2 : attentes `1` et `4`. Le jour 6 reste dans la pile. Le programme affiche `2 1 4 2 1 1 0`, et l'on vérifie directement que, par exemple, après le jour 2 (15), la première température plus élevée est 16, quatre jours plus tard.

**Pourquoi c'est juste.** L'invariant est celui de la pile monotone : un jour est dépilé exactement par le premier jour qui le dépasse, donc `i − j` est bien la première attente possible. Un jour jamais dépilé n'est jamais dépassé et garde `0`. Chaque jour est empilé une fois et dépilé au plus une fois : au plus `2N` opérations de pile, soit quelques centaines de milliers pour `N = 100 000`, au lieu de 5 milliards de comparaisons pour la méthode directe sur des températures décroissantes.

## À retenir

- Une pile (LIFO) ajoute et retire au sommet : `append`, `pop`, `p[-1]` en Python ; `push_back`, `pop_back`, `back` ou `stack` en C++. Chaque opération coûte quelques instructions.
- Une file (FIFO) ajoute à la fin et retire en tête : `deque` avec `append` et `popleft` en Python, `queue` en C++. Jamais `pop(0)` sur une liste longue.
- Parenthésage et expressions postfixées se traitent avec une pile : on dépile ce qui est « le plus récent pas encore utilisé ».
- Une simulation de file d'attente, de tourniquet ou de jeu de cartes se programme directement avec une file ; on justifie qu'elle s'arrête en trouvant une quantité qui diminue à chaque tour.
- Une pile monotone donne pour chaque élément le prochain plus grand (ou plus petit) en un passage ; le coût se compte globalement : chaque élément est empilé une fois et dépilé au plus une fois.
- Avant chaque `pop`, `top` ou `popleft`, vérifier que la structure n'est pas vide.
