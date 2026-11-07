Pour rendre 87 centimes avec des pièces de 50, 20, 10, 5, 2 et 1, un commerçant prend la plus grosse pièce possible, 50, puis encore la plus grosse possible pour les 37 restants, 20, et ainsi de suite : 50 + 20 + 10 + 5 + 2. Il ne revient jamais sur un choix, et il obtient le plus petit nombre de pièces. C'est un **algorithme glouton** : il construit la solution pas à pas, en faisant à chaque étape le choix qui semble le meilleur sur le moment.

Les algorithmes gloutons sont simples et rapides, souvent un tri suivi d'un parcours. Leur difficulté est ailleurs : ils sont **souvent faux**. Avec des pièces de 1, 3 et 4, la même méthode rend 6 = 4 + 1 + 1, alors que 3 + 3 suffit. Ce chapitre apprend à **prouver** qu'un glouton est juste, avec l'**argument d'échange**, et à le réfuter, avec un **contre-exemple**. On l'applique à des problèmes de créneaux, d'ordonnancement de tâches, de rendu de monnaie et de fusions.

## Choix glouton et preuve

Un algorithme glouton prend des décisions une par une, selon une règle fixée (« la plus grosse pièce », « le créneau qui finit le plus tôt »), sans jamais les remettre en cause. Pour prouver qu'il donne une solution optimale, on montre en général deux choses :

- **le choix glouton est sûr** : il existe une solution optimale qui fait le même premier choix que le glouton ;
- **le reste est un problème du même type** : une fois ce choix fait, il reste à résoudre un problème plus petit de même nature, sur lequel on recommence (récurrence).

Pour montrer que le choix est sûr, on part d'une solution optimale **quelconque**, et on la **transforme** pour qu'elle fasse le choix glouton, en vérifiant qu'elle reste valable et qu'elle n'est pas moins bonne. C'est l'**argument d'échange**. La même idée s'applique à un ordre : si deux éléments voisins ne sont pas rangés selon la règle du glouton, on les échange, et on vérifie que la solution ne se dégrade pas.

## Le plus de créneaux

Une salle reçoit des demandes de réservation ; la demande i occupe la salle de l'instant `début` à l'instant `fin` (exclu). On veut accepter **le plus grand nombre** de demandes, sans que deux d'entre elles se chevauchent. Plusieurs règles semblent raisonnables : la demande la plus courte, celle qui commence le plus tôt, celle qui gêne le moins d'autres demandes. La bonne est : **celle qui finit le plus tôt**.

```python
def plus_de_creneaux(creneaux):
    # creneaux : liste de (début, fin) ; deux créneaux choisis ne se chevauchent pas
    choisis = 0
    fin_derniere = -1
    for debut, fin in sorted(creneaux, key=lambda c: c[1]):   # par fin croissante
        if debut >= fin_derniere:
            choisis += 1
            fin_derniere = fin
    return choisis

print(plus_de_creneaux([(1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10), (8, 11)]))
```

```cpp
#include <algorithm>
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

// creneaux : (début, fin) ; deux créneaux choisis ne se chevauchent pas
int plusDeCreneaux(vector<pair<int, int>> creneaux) {
    sort(creneaux.begin(), creneaux.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
        return a.second < b.second;                          // par fin croissante
    });
    int choisis = 0, finDerniere = -1;
    for (auto& c : creneaux) {
        if (c.first >= finDerniere) {
            choisis++;
            finDerniere = c.second;
        }
    }
    return choisis;
}

int main() {
    cout << plusDeCreneaux({{1, 4}, {3, 5}, {0, 6}, {5, 7}, {3, 9}, {5, 9}, {6, 10}, {8, 11}}) << "\n";
    return 0;
}
```

Le programme affiche `3` : il choisit (1, 4), puis (5, 7), puis (8, 11).

**Le choix est sûr.** Soit `c` le créneau qui finit le plus tôt, et une solution optimale quelconque. Son premier créneau `o` (celui qui finit le plus tôt parmi les siens) ne finit pas avant `c`. Remplaçons `o` par `c` : `c` finit au plus tard quand `o` finit, donc avant le début de tous les autres créneaux de la solution, qui commencent après la fin de `o`. La solution modifiée est valable et a le même nombre de créneaux : elle est optimale, et elle commence par le choix glouton.

**Le reste.** Une fois `c` choisi, les créneaux encore possibles sont ceux qui commencent après la fin de `c`, et on cherche le plus grand nombre de créneaux compatibles parmi eux : le même problème, plus petit. Par récurrence, le glouton est optimal. **Coût** : O(n log n) pour le tri, puis un passage.

Les autres règles échouent, et chacune se réfute par un petit exemple. Le plus court d'abord : avec (0, 5), (4, 7) et (6, 11), le plus court (4, 7) empêche les deux autres. Le premier qui commence : (0, 100) empêche tout le reste. Un contre-exemple de trois créneaux suffit à écarter une règle ; aucun nombre d'exemples réussis ne suffit à la valider.

## Ordonner des tâches

Une machine doit effectuer `n` tâches, une à la fois, sans pause, à partir de l'instant 0. La tâche i dure `pᵢ`. L'ordre détermine l'instant de fin `Cᵢ` de chaque tâche, et le problème est de choisir le meilleur ordre. Il y a `n!` ordres : on ne peut pas tous les essayer. L'argument d'échange sur deux tâches **voisines** est l'outil naturel. Si la tâche `a` est juste avant `b`, et que `t` est l'instant où `a` commence, échanger `a` et `b` ne change que leurs deux instants de fin : `a` finissait en `t + p_a`, et finit maintenant en `t + p_a + p_b` ; `b` finissait en `t + p_a + p_b`, et finit maintenant en `t + p_b`. Les autres tâches ne bougent pas.

**Minimiser la somme des instants de fin.** Si des personnes attendent chaque tâche, la somme des `Cᵢ` est l'attente totale. Avant l'échange, `a` et `b` contribuent `(t + p_a) + (t + p_a + p_b)` ; après, `(t + p_b) + (t + p_a + p_b)`. L'échange fait gagner `p_a − p_b` : il est avantageux dès que `p_a > p_b`. La règle est donc : **la plus courte d'abord**. Partant d'un ordre optimal, on échange deux voisines mal rangées tant qu'il y en a, comme dans le tri à bulles : la somme ne peut pas augmenter, et on arrive à l'ordre trié, qui est donc optimal.

**Minimiser le plus grand retard.** Si la tâche i devrait être finie à l'instant `dᵢ`, son **retard** vaut `Cᵢ − dᵢ` s'il est positif, 0 sinon. On veut que le plus grand retard soit le plus petit possible. La règle est : **la date limite la plus proche d'abord**. Si `a` est juste avant `b` avec `d_a > d_b`, après l'échange `b` finit plus tôt, et `a` finit à l'instant où finissait `b`, mais avec une date limite plus tardive : son nouveau retard est au plus l'ancien retard de `b`. Le plus grand retard ne peut pas augmenter. Une conséquence utile : un ensemble de tâches peut être fini entièrement à l'heure si et seulement s'il l'est dans l'ordre des dates limites.

## Trier avec une règle d'échange

L'échange de deux voisines donne souvent une **règle de comparaison** plutôt qu'une clé. Par exemple, si chaque tâche a une durée `p` et un poids `w`, et qu'on minimise la somme des `w × C`, l'échange de `a` et `b` montre que `a` doit passer avant `b` si `p_a × w_b < p_b × w_a`. En C++, on donne cette règle à `sort`, comme au niveau 3. En Python, `sort` attend une clé ; la fonction `cmp_to_key` du module `functools` transforme une fonction de comparaison, qui renvoie un nombre négatif si `a` doit passer avant `b`, positif si c'est l'inverse, et 0 en cas d'égalité, en une clé.

```python
from functools import cmp_to_key

def compare(a, b):
    # a = (durée, poids) passe avant b si durée_a × poids_b < durée_b × poids_a
    gauche = a[0] * b[1]
    droite = b[0] * a[1]
    if gauche < droite:
        return -1
    if gauche > droite:
        return 1
    return 0

taches = [(3, 1), (1, 2), (4, 4), (2, 1)]
print(sorted(taches, key=cmp_to_key(compare)))
```

```cpp
#include <algorithm>
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

// a = (durée, poids) passe strictement avant b si durée_a × poids_b < durée_b × poids_a
bool avant(const pair<long long, long long>& a, const pair<long long, long long>& b) {
    return a.first * b.second < b.first * a.second;
}

int main() {
    vector<pair<long long, long long>> taches = {{3, 1}, {1, 2}, {4, 4}, {2, 1}};
    sort(taches.begin(), taches.end(), avant);
    for (auto& t : taches) {
        cout << "(" << t.first << ", " << t.second << ") ";
    }
    cout << "\n";
    return 0;
}
```

Le programme affiche les tâches dans l'ordre `(1, 2)`, `(4, 4)`, `(2, 1)`, `(3, 1)` : les rapports durée / poids valent 0,5, 1, 2 et 3. Avant de trier avec une règle, il faut vérifier qu'elle est **transitive** : si `a` passe avant `b` et `b` avant `c`, alors `a` doit passer avant `c`. Sinon le tri n'a pas de sens, et le C++ peut même planter. Ici, la règle revient à comparer les rapports `p / w`, et c'est transitif. On compare des produits plutôt que des quotients pour rester en nombres entiers. Le tri fait toujours O(n log n) comparaisons, mais chacune est un appel de `compare` : c'est un peu plus lent qu'avec une clé, qu'on préfère quand elle existe.

## Quand le glouton échoue

Revenons aux pièces. Le glouton est optimal pour 1, 2, 5, 10, 20, 50 ; il l'est aussi dès que chaque valeur divise la suivante : une solution optimale utilise alors moins de `c_{i+1} / c_i` pièces de valeur `cᵢ` (sinon, on en remplace `c_{i+1} / c_i` par une seule pièce de valeur `c_{i+1}`), et cette contrainte ne laisse qu'une façon de former le montant, celle du glouton. Mais il ne l'est pas pour 1, 3, 4. Pour trouver un contre-exemple, on compare le glouton à un calcul **exact**. Le plus petit nombre de pièces `opt(s)` pour former `s` se calcule dans l'ordre croissant des montants : la dernière pièce ajoutée a une certaine valeur `c ≤ s`, et le reste `s − c` doit être formé au mieux, donc `opt(s) = 1 + min(opt(s − c))` sur les pièces `c ≤ s`, avec `opt(0) = 0`.

```python
pieces = [1, 3, 4]
limite = 20
opt = [0] * limite          # opt[s] : plus petit nombre de pièces pour former s
for s in range(1, limite):
    opt[s] = 1 + min(opt[s - c] for c in pieces if c <= s)

def glouton(s):
    nb = 0
    for c in reversed(pieces):
        nb += s // c
        s = s % c
    return nb

for s in range(1, limite):
    if glouton(s) > opt[s]:
        print(s, glouton(s), opt[s])
        break
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

vector<int> pieces = {1, 3, 4};

int glouton(int s) {
    int nb = 0;
    for (int i = pieces.size() - 1; i >= 0; i--) {
        nb += s / pieces[i];
        s = s % pieces[i];
    }
    return nb;
}

int main() {
    int limite = 20;
    vector<int> opt(limite, 0);   // opt[s] : plus petit nombre de pièces pour former s
    for (int s = 1; s < limite; s++) {
        opt[s] = s;
        for (int c : pieces) {
            if (c <= s) opt[s] = min(opt[s], 1 + opt[s - c]);
        }
    }
    for (int s = 1; s < limite; s++) {
        if (glouton(s) > opt[s]) {
            cout << s << " " << glouton(s) << " " << opt[s] << "\n";
            break;
        }
    }
    return 0;
}
```

Le programme affiche `6 3 2` : pour 6, le glouton utilise 3 pièces et l'optimum 2. Cette méthode est la bonne habitude face à n'importe quel glouton : écrire une solution exacte, lente mais sûre, et comparer les deux sur tous les petits cas. Un désaccord donne un contre-exemple ; l'absence de désaccord ne prouve rien, mais elle rend une preuve plausible et aide à la trouver.

## Fusionner au moindre coût

On a des tas de jetons, de tailles `4, 3, 6, 2`. Fusionner deux tas coûte le nombre total de jetons du nouveau tas, et on fusionne jusqu'à n'avoir qu'un seul tas. La règle gloutonne est : **fusionner les deux plus petits tas**. Pour la justifier, on dessine l'arbre des fusions : chaque tas de départ est une feuille, et son nombre de jetons est compté une fois par fusion qui le concerne, c'est-à-dire autant de fois que sa profondeur dans l'arbre. Dans un arbre optimal, chaque fusion a deux enfants : la feuille la plus profonde a donc une sœur, elle aussi une feuille. On échange ces deux feuilles sœurs avec les deux plus petits tas ; un tas plus petit placé plus profond ne coûte pas plus, donc le coût n'augmente pas : il existe un arbre optimal où les deux plus petits tas sont fusionnés ensemble. On les remplace par leur somme, et on recommence sur un problème plus petit. C'est l'**algorithme de Huffman**, qui sert aussi à compresser des fichiers.

Il faut trouver à chaque étape les deux plus petits tas, alors que de nouveaux tas apparaissent. Trier ne suffit pas, et chercher le minimum dans une liste coûte O(n) à chaque fois. Une **file de priorité** fait mieux : elle range des éléments, ajoute un élément ou retire le plus petit en O(log n), et lit le plus petit sans le retirer en O(1). En Python, le module `heapq` travaille sur une liste ordinaire : `heappush(t, x)` ajoute `x`, `heappop(t)` retire et renvoie le plus petit, `t[0]` est le plus petit, et `heapify(t)` transforme une liste quelconque en file de priorité, en O(n). En C++, `priority_queue` (dans `<queue>`) donne le **plus grand** ; avec `greater`, elle donne le plus petit. Ses méthodes sont `push`, `top` (lire), `pop` (retirer, sans rien renvoyer) et `size`.

```python
import heapq

file = []                        # le plus petit d'abord
for x in [5, 1, 8, 3]:
    heapq.heappush(file, x)
print(file[0], len(file))        # le plus petit, sans le retirer
print(heapq.heappop(file), heapq.heappop(file), len(file))

grands = []                      # le plus grand d'abord : on range -x
for x in [5, 1, 8, 3]:
    heapq.heappush(grands, -x)
print(-heapq.heappop(grands))
```

```cpp
#include <functional>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    priority_queue<int, vector<int>, greater<int>> file;   // le plus petit d'abord
    for (int x : {5, 1, 8, 3}) file.push(x);
    cout << file.top() << " " << file.size() << "\n";      // le plus petit, sans le retirer
    int a = file.top(); file.pop();
    int b = file.top(); file.pop();
    cout << a << " " << b << " " << file.size() << "\n";

    priority_queue<int> grands;                            // le plus grand d'abord
    for (int x : {5, 1, 8, 3}) grands.push(x);
    cout << grands.top() << "\n";
    return 0;
}
```

Le programme affiche `1 4`, puis `1 3 2`, puis `8`. La liste de `heapq` n'est **pas** triée : seul `t[0]` est garanti être le plus petit, et on ne lit jamais `t[1]` ou `t[-1]` en espérant le deuxième ou le plus grand. Les éléments peuvent être des couples, comparés dans l'ordre lexicographique, ce qui permet de ranger une valeur avec son indice. Retirer d'une file vide est une erreur : `IndexError: index out of range` en Python, un comportement imprévisible en C++ ; on teste la taille avant.

Avec une file de priorité, l'algorithme de Huffman s'écrit en quelques lignes.

```python
import heapq

def cout_des_fusions(tas):
    file = list(tas)
    heapq.heapify(file)                 # file de priorité : le minimum d'abord
    total = 0
    while len(file) > 1:
        a = heapq.heappop(file)         # les deux plus petits tas
        b = heapq.heappop(file)
        total += a + b
        heapq.heappush(file, a + b)
    return total

print(cout_des_fusions([4, 3, 6, 2]))
```

```cpp
#include <functional>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

long long coutDesFusions(const vector<long long>& tas) {
    // file de priorité qui donne le minimum d'abord
    priority_queue<long long, vector<long long>, greater<long long>> file(tas.begin(), tas.end());
    long long total = 0;
    while (file.size() > 1) {
        long long a = file.top(); file.pop();   // les deux plus petits tas
        long long b = file.top(); file.pop();
        total += a + b;
        file.push(a + b);
    }
    return total;
}

int main() {
    cout << coutDesFusions({4, 3, 6, 2}) << "\n";
    return 0;
}
```

Le programme affiche `29` : on fusionne 2 et 3 (coût 5), puis 4 et 5 (coût 9), puis 6 et 9 (coût 15). Fusionner dans l'ordre donné, 4 + 3, puis 7 + 6, puis 13 + 2, coûterait 7 + 13 + 15 = 35. **Coût** : `n − 1` fusions, chacune en O(log n), soit O(n log n).

## Erreurs fréquentes

**Un glouton sans preuve.** C'est l'erreur la plus fréquente : le programme passe les exemples, puis échoue sur un test caché. Avant de coder, on cherche un contre-exemple à la règle sur trois ou quatre éléments, et on compare à une solution exhaustive sur de petits cas.

**La mauvaise clé de tri.** Trier les créneaux par début au lieu de fin, les tâches par durée au lieu de date limite : le programme tourne, donne des réponses plausibles et fausses. La preuve indique exactement la clé.

**Une règle non transitive.** Une fonction de comparaison doit définir un vrai ordre, et répondre « strictement avant » en C++. Une règle incohérente peut faire planter `sort` avec `Segmentation fault`.

**Le dépassement.** Les sommes d'instants de fin ou de coûts de fusion dépassent vite 2³¹ ; les produits d'une règle d'échange aussi. En C++, on utilise des `long long`.

**Oublier le signe moins avec `heapq`.** `heapq` donne toujours le plus petit élément ; pour retirer le plus grand, on range `-x` et on prend l'opposé à la sortie.

## Un exemple complet

**Énoncé.** Un guichet doit servir `N` personnes ; l'opération de la personne i dure `dᵢ` minutes. Chaque personne attend depuis l'instant 0 jusqu'à la fin de sa propre opération. Dans quel ordre servir pour que la somme des attentes soit la plus petite ? Afficher cette somme. Par exemple, avec les durées `5 2 8 1`.

**Idée.** L'attente de la personne servie en position k vaut la somme des durées des k premières opérations : c'est la somme des instants de fin, minimisée par la règle « la plus courte d'abord » (section « Ordonner des tâches »). On trie, puis on cumule.

```python
n = int(input())
durees = sorted(map(int, input().split()))   # la plus courte d'abord

instant = 0
attente = 0
for d in durees:
    instant += d                # fin de cette opération
    attente += instant
print(attente)
```

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> durees(n);
    for (int i = 0; i < n; i++) {
        cin >> durees[i];
    }
    sort(durees.begin(), durees.end());       // la plus courte d'abord
    long long instant = 0, attente = 0;
    for (long long d : durees) {
        instant += d;                         // fin de cette opération
        attente += instant;
    }
    cout << attente << "\n";
    return 0;
}
```

**Vérification à la main.** Dans l'ordre 1, 2, 5, 8, les opérations finissent aux instants 1, 3, 8 et 16 : la somme vaut 28, et le programme affiche `28`. Dans l'ordre de l'énoncé, 5, 2, 8, 1, elles finiraient à 5, 7, 15 et 16, pour une somme de 43.

**Une autre preuve.** On peut aussi compter autrement : la durée servie en position k est comptée dans l'attente de toutes les personnes servies à partir de k, soit `N − k + 1` fois. La somme vaut donc `Σ (N − k + 1) × d_(k)`, et pour la minimiser il faut associer les plus grands coefficients aux plus petites durées : c'est l'**inégalité de réarrangement**, qui redonne le même ordre.

**Coût.** O(N log N) pour le tri. Essayer tous les ordres coûterait N!, déjà 3,6 millions pour N = 10.

## À retenir

- Un algorithme glouton fait à chaque étape le choix qui semble le meilleur, sans revenir en arrière. Il est rapide (souvent un tri puis un parcours), mais il faut **prouver** qu'il est juste.
- L'argument d'échange : partir d'une solution optimale quelconque, la modifier pour qu'elle fasse le choix glouton sans la dégrader, puis recommencer sur le problème restant. Pour un ordre, échanger deux voisines mal rangées.
- Créneaux : le plus de créneaux s'obtient en prenant celui qui finit le plus tôt. Tâches : la plus courte d'abord minimise la somme des fins, la date limite la plus proche d'abord minimise le plus grand retard.
- Une règle de comparaison issue d'un échange se donne à `sort` en C++, et à `sorted` via `functools.cmp_to_key` en Python ; elle doit être transitive.
- Un seul contre-exemple réfute un glouton (pièces 1, 3, 4 : 6 = 3 + 3). On les trouve en comparant à un calcul exact sur les petits cas.
- Une file de priorité (`heapq`, `priority_queue`) donne le minimum en O(log n) : elle sert quand le glouton doit choisir parmi des éléments qui changent, comme les fusions de Huffman.
