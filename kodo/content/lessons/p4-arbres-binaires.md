La table des matières d'un livre ou les dossiers d'un ordinateur sont organisés en **arbre** : un élément de départ, qui se divise en sous-parties, qui se divisent à leur tour. Une expression comme `(3 + 4) × (10 − 2 × 3)` a aussi cette forme. Et en rangeant des nombres dans un arbre bien choisi, on peut chercher ou insérer un nombre en ne regardant qu'une petite partie des données.

Ce chapitre définit les arbres binaires, montre comment les ranger dans des tableaux, présente les quatre parcours classiques avec leurs preuves, puis les **arbres binaires de recherche** : leur invariant, leurs opérations, et pourquoi leur efficacité dépend de leur forme.

## Arbres enracinés et arbres binaires

Le chapitre sur les graphes a défini un **arbre** comme un graphe connexe sans cycle ; un arbre de `n` sommets a exactement `n − 1` arêtes. On l'**enracine** en choisissant un sommet, la **racine**. Chaque autre sommet, appelé **nœud**, a alors un unique **père** : le voisin par lequel passe le chemin vers la racine. Les autres voisins d'un nœud sont ses **fils** ; un nœud sans fils est une **feuille**. Les **ancêtres** d'un nœud sont les nœuds du chemin qui le relie à la racine, et ses **descendants** les nœuds dont il est l'ancêtre. Le **sous-arbre** d'un nœud est formé de ce nœud et de tous ses descendants.

La **profondeur** d'un nœud est le nombre d'arêtes entre lui et la racine (0 pour la racine). La **hauteur** d'un arbre est la plus grande profondeur d'un nœud : un arbre réduit à sa racine a pour hauteur 0, et l'on convient que l'arbre vide a pour hauteur −1.

Un **arbre binaire** est un arbre enraciné où chaque nœud a au plus deux fils, et où l'on distingue le **fils gauche** du **fils droit** : un nœud qui n'a qu'un fils, à gauche, n'est pas le même arbre que celui qui a ce fils à droite. On peut aussi le définir de façon récursive : un arbre binaire est soit **vide**, soit formé d'une racine, d'un sous-arbre gauche et d'un sous-arbre droit, qui sont eux-mêmes des arbres binaires. Cette définition guide toutes les fonctions et toutes les preuves de ce chapitre.

**Combien de nœuds ?** Au niveau de profondeur `k`, il y a au plus `2^k` nœuds, puisque chaque nœud a au plus deux fils. Un arbre de hauteur `h` a donc au plus `1 + 2 + … + 2^h = 2^(h+1) − 1` nœuds. Réciproquement, un arbre binaire de `n` nœuds a une hauteur comprise entre `log₂(n + 1) − 1` (arbre bien rempli) et `n − 1` (un chemin).

## Ranger un arbre binaire dans des tableaux

On numérote les nœuds de 1 à `n` et l'on range, pour chaque nœud, son fils gauche et son fils droit dans deux tableaux `gauche` et `droite`, avec `0` pour « pas de fils ». Les exercices donnent l'arbre sous cette forme. La racine n'est pas toujours le nœud 1 : c'est le seul nœud qui n'est le fils d'aucun autre, et une boucle sur les deux tableaux la trouve.

Pour un arbre enraciné quelconque, on donne souvent le **tableau des pères** (`pere[v]`, et `0` pour la racine), dont on déduit les listes de fils.

Enfin, un arbre binaire **complet** (niveaux pleins, sauf le dernier, rempli par la gauche) se range sans tableau de fils : la racine porte le numéro 1, les fils du nœud `k` sont `2k` et `2k + 1`, et son père `k // 2`.

## Les parcours en profondeur

**Parcourir** un arbre, c'est visiter chacun de ses nœuds une fois. Les trois parcours en profondeur suivent la définition récursive : on traite la racine et l'on parcourt les deux sous-arbres, le gauche avant le droit. Ils ne diffèrent que par le moment où l'on traite la racine :
- **préfixe** : la racine, puis le sous-arbre gauche, puis le sous-arbre droit ;
- **infixe** : le sous-arbre gauche, puis la racine, puis le sous-arbre droit ;
- **suffixe** : le sous-arbre gauche, puis le sous-arbre droit, puis la racine.

Le **parcours en largeur**, ou par niveaux, visite la racine, puis les nœuds de profondeur 1 de gauche à droite, puis ceux de profondeur 2, etc. : c'est le parcours en largeur du chapitre sur les graphes, avec une file, en enfilant le fils gauche avant le fils droit.

Le programme suivant applique les quatre parcours à un arbre de 7 nœuds, puis calcule sa taille et sa hauteur avec deux fonctions récursives écrites sur le même modèle.

```python
from collections import deque

#         1
#       /   \
#      2     3
#     / \     \
#    4   5     6
#       /
#      7
gauche = [0, 2, 4, 0, 0, 7, 0, 0]       # 0 : pas de fils
droite = [0, 3, 5, 6, 0, 0, 0, 0]

def prefixe(v, res):
    if v != 0:
        res.append(v)
        prefixe(gauche[v], res)
        prefixe(droite[v], res)

def infixe(v, res):
    if v != 0:
        infixe(gauche[v], res)
        res.append(v)
        infixe(droite[v], res)

def suffixe(v, res):
    if v != 0:
        suffixe(gauche[v], res)
        suffixe(droite[v], res)
        res.append(v)

def taille(v):
    if v == 0:
        return 0
    return 1 + taille(gauche[v]) + taille(droite[v])

def hauteur(v):
    if v == 0:
        return -1                        # l'arbre vide
    return 1 + max(hauteur(gauche[v]), hauteur(droite[v]))

for parcours in (prefixe, infixe, suffixe):
    res = []
    parcours(1, res)
    print(*res)

niveaux = []
file = deque([1])
while file:
    v = file.popleft()
    niveaux.append(v)
    for f in (gauche[v], droite[v]):
        if f != 0:
            file.append(f)
print(*niveaux)
print(taille(1), hauteur(1))
```

```cpp
#include <algorithm>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

//         1
//       /   \
//      2     3
//     / \     \
//    4   5     6
//       /
//      7
vector<int> gauche = {0, 2, 4, 0, 0, 7, 0, 0};   // 0 : pas de fils
vector<int> droite = {0, 3, 5, 6, 0, 0, 0, 0};

void prefixe(int v, vector<int> &res) {
    if (v == 0) return;
    res.push_back(v);
    prefixe(gauche[v], res);
    prefixe(droite[v], res);
}

void infixe(int v, vector<int> &res) {
    if (v == 0) return;
    infixe(gauche[v], res);
    res.push_back(v);
    infixe(droite[v], res);
}

void suffixe(int v, vector<int> &res) {
    if (v == 0) return;
    suffixe(gauche[v], res);
    suffixe(droite[v], res);
    res.push_back(v);
}

int taille(int v) {
    if (v == 0) return 0;
    return 1 + taille(gauche[v]) + taille(droite[v]);
}

int hauteur(int v) {
    if (v == 0) return -1;                         // l'arbre vide
    return 1 + max(hauteur(gauche[v]), hauteur(droite[v]));
}

void afficher(const vector<int> &res) {
    for (int i = 0; i < (int)res.size(); i++) cout << res[i] << (i + 1 == (int)res.size() ? "\n" : " ");
}

int main() {
    vector<int> a, b, c;
    prefixe(1, a);
    infixe(1, b);
    suffixe(1, c);
    afficher(a);
    afficher(b);
    afficher(c);
    vector<int> niveaux;
    queue<int> file;
    file.push(1);
    while (!file.empty()) {
        int v = file.front();
        file.pop();
        niveaux.push_back(v);
        for (int f : {gauche[v], droite[v]})
            if (f != 0) file.push(f);
    }
    afficher(niveaux);
    cout << taille(1) << " " << hauteur(1) << "\n";
    return 0;
}
```

Le programme affiche :

```text
1 2 4 5 7 3 6
4 2 7 5 1 3 6
4 7 5 2 6 3 1
1 2 3 4 5 6 7
7 3
```

Ce sont les ordres préfixe, infixe, suffixe et par niveaux, puis la taille 7 et la hauteur 3 (le chemin 1, 2, 5, 7).

**Correction.** Par récurrence sur la taille de l'arbre. Pour l'arbre vide, chaque fonction ne fait rien (ou renvoie 0, ou −1), ce qui est juste. Pour un arbre non vide, si les appels sur les deux sous-arbres, plus petits, produisent leurs parcours, la fonction produit la racine suivie du parcours gauche puis du parcours droit, ce qui est exactement la définition du parcours préfixe ; de même pour les autres. La taille vaut `1 + taille(gauche) + taille(droite)`, et la hauteur `1 + max(hauteur(gauche), hauteur(droite))`, car le nœud le plus profond est dans l'un des sous-arbres, un niveau plus bas que dans ce sous-arbre ; la convention « vide = −1 » donne bien 0 pour une feuille.

**Complexité.** Chaque fonction est appelée une fois par nœud et une fois par fils absent (il y en a `n + 1`) : O(n). La profondeur de la récursion est la hauteur plus 1 : sur un chemin de 100 000 nœuds, `RecursionError` en Python, `Segmentation fault` en C++. On utilise alors le parcours en largeur, et l'on remarque que l'ordre de la file place chaque père avant ses fils : parcouru **à l'envers**, il place chaque nœud **après** ses fils, ce qui permet de calculer tailles et hauteurs sans récursion.

## Reconstruire un arbre à partir de deux parcours

Un seul parcours ne suffit pas à retrouver un arbre : les chemins `1 → 2 → 3` vers la gauche et vers la droite ont le même ordre préfixe. Mais l'ordre préfixe **et** l'ordre infixe le déterminent entièrement, si les nœuds sont tous différents.

Prenons l'arbre ci-dessus : préfixe `1 2 4 5 7 3 6`, infixe `4 2 7 5 1 3 6`. La racine est le premier nœud de l'ordre préfixe : 1. Dans l'ordre infixe, ce qui est avant 1, `4 2 7 5`, forme le sous-arbre gauche, et ce qui est après, `3 6`, le sous-arbre droit. Le sous-arbre gauche a 4 nœuds : ce sont aussi les 4 nœuds qui suivent la racine dans l'ordre préfixe, `2 4 5 7`, et les 2 derniers, `3 6`, forment le sous-arbre droit. On recommence : le sous-arbre gauche (préfixe `2 4 5 7`, infixe `4 2 7 5`) a pour racine 2, avec `4` à gauche et `7 5` à droite, etc.

À chaque étape, la racine et la taille des deux sous-arbres sont imposées : l'arbre est **unique**. Si la racine d'une portion ne se trouve pas dans la portion infixe correspondante, aucun arbre n'a ces deux parcours. En rangeant la position de chaque nœud dans l'ordre infixe dans un tableau, la reconstruction coûte O(n). L'ordre préfixe et l'ordre suffixe, eux, ne suffisent pas : un nœud qui n'a qu'un fils donne les mêmes parcours, que ce fils soit à gauche ou à droite.

## Les arbres binaires de recherche

Un **arbre binaire de recherche** (ABR) est un arbre binaire dont chaque nœud porte une **clé**, avec l'invariant suivant : pour chaque nœud `v`, toutes les clés du sous-arbre gauche de `v` sont plus petites que celle de `v`, et toutes celles du sous-arbre droit sont plus grandes. Attention : la condition porte sur **tous** les nœuds des sous-arbres, pas seulement sur les fils.

**Propriété fondamentale : le parcours infixe d'un ABR donne les clés dans l'ordre croissant.** Par récurrence : le parcours infixe d'un ABR non vide écrit les clés du sous-arbre gauche (dans l'ordre croissant, par hypothèse de récurrence, et toutes plus petites que la racine), puis la racine, puis les clés du sous-arbre droit (croissantes, toutes plus grandes). Réciproquement, un arbre dont le parcours infixe est croissant est un ABR.

L'invariant guide toutes les opérations : en comparant la clé cherchée à celle du nœud courant, on sait de quel côté elle se trouve, et l'on ne descend que d'un côté.

- **Chercher** `x` : on part de la racine ; si `x` est plus petit que la clé du nœud, on descend à gauche, s'il est plus grand, à droite, jusqu'à trouver `x` ou tomber sur un fils absent.
- **Insérer** `x` : on descend comme pour chercher, et l'on accroche un nouveau nœud à l'endroit où l'on est tombé sur un fils absent. L'invariant est conservé, car `x` est du bon côté de chacun des nœuds traversés, qui sont exactement ses ancêtres.
- **Minimum** : on descend toujours à gauche ; le dernier nœud a la plus petite clé, puisque tout autre nœud est à droite d'un de ses ancêtres ou dans son sous-arbre droit.
- **Successeur** de `x` (la plus petite clé strictement plus grande que `x`) : on descend comme pour chercher `x`. Chaque fois que la clé du nœud est plus grande que `x`, c'est un candidat, et l'on continue à gauche pour en chercher un plus petit ; sinon, on continue à droite.

```python
cle = [0]          # le nœud i a la clé cle[i] ; l'indice 0 représente « pas de nœud »
gauche = [0]
droite = [0]
racine = 0

def inserer(x):
    global racine
    cle.append(x)
    gauche.append(0)
    droite.append(0)
    nouveau = len(cle) - 1
    if racine == 0:
        racine = nouveau
        return
    v = racine
    while True:
        if x < cle[v]:
            if gauche[v] == 0:
                gauche[v] = nouveau
                return
            v = gauche[v]
        else:
            if droite[v] == 0:
                droite[v] = nouveau
                return
            v = droite[v]

def chercher(x):
    v = racine
    while v != 0 and cle[v] != x:
        v = gauche[v] if x < cle[v] else droite[v]
    return v != 0

def minimum(v):
    while gauche[v] != 0:
        v = gauche[v]
    return cle[v]

def successeur(x):
    # plus petite clé strictement plus grande que x, ou None
    v = racine
    meilleur = None
    while v != 0:
        if cle[v] > x:
            meilleur = cle[v]          # candidat ; on cherche plus petit à gauche
            v = gauche[v]
        else:
            v = droite[v]
    return meilleur

for x in [50, 30, 70, 20, 40, 60, 80, 35, 45, 65]:
    inserer(x)
print(chercher(45), chercher(55), minimum(racine))
print(successeur(45), successeur(65), successeur(80))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> cle = {0}, gauche = {0}, droite = {0};   // l'indice 0 représente « pas de nœud »
int racine = 0;

void inserer(int x) {
    cle.push_back(x);
    gauche.push_back(0);
    droite.push_back(0);
    int nouveau = cle.size() - 1;
    if (racine == 0) {
        racine = nouveau;
        return;
    }
    int v = racine;
    while (true) {
        if (x < cle[v]) {
            if (gauche[v] == 0) { gauche[v] = nouveau; return; }
            v = gauche[v];
        } else {
            if (droite[v] == 0) { droite[v] = nouveau; return; }
            v = droite[v];
        }
    }
}

bool chercher(int x) {
    int v = racine;
    while (v != 0 && cle[v] != x) v = (x < cle[v]) ? gauche[v] : droite[v];
    return v != 0;
}

int minimum(int v) {
    while (gauche[v] != 0) v = gauche[v];
    return cle[v];
}

// plus petite clé strictement plus grande que x, ou -1 s'il n'y en a pas
int successeur(int x) {
    int v = racine, meilleur = -1;
    while (v != 0) {
        if (cle[v] > x) {
            meilleur = cle[v];             // candidat ; on cherche plus petit à gauche
            v = gauche[v];
        } else {
            v = droite[v];
        }
    }
    return meilleur;
}

int main() {
    for (int x : {50, 30, 70, 20, 40, 60, 80, 35, 45, 65}) inserer(x);
    cout << (chercher(45) ? "True" : "False") << " " << (chercher(55) ? "True" : "False") << " " << minimum(racine) << "\n";
    cout << successeur(45) << " " << successeur(65) << " " << successeur(80) << "\n";
    return 0;
}
```

Le programme affiche `True False 20`, puis `50 70 None` (`-1` dans la version C++) : 45 est présent, 55 non, le minimum est 20 ; le successeur de 45 est 50, celui de 65 est 70, et 80 n'en a pas.

**Pourquoi le successeur est juste.** Les candidats sont des clés plus grandes que `x`. Soit `y > x` une clé de l'arbre : au dernier nœud commun aux chemins de recherche de `x` et de `y`, on part à gauche vers `x` en notant ce nœud, dont la clé est au plus `y`. Chaque candidat noté ensuite est plus petit que le précédent (on est dans son sous-arbre gauche) : le dernier est au plus égal à toute clé plus grande que `x`.

## Le coût dépend de la forme

Chercher, insérer, trouver le minimum ou le successeur suivent un seul chemin depuis la racine : chaque opération coûte O(h), où `h` est la hauteur de l'arbre. Tout dépend donc de la forme de l'arbre, c'est-à-dire de l'**ordre d'insertion**.

```python
def construire(cles):
    # insère les clés dans l'ordre ; renvoie (hauteur, nombre total de comparaisons)
    gauche = [0] * (len(cles) + 1)
    droite = [0] * (len(cles) + 1)
    hauteur = comparaisons = 0
    for i in range(2, len(cles) + 1):    # le nœud i porte la clé cles[i - 1] ; 1 est la racine
        v, profondeur = 1, 0
        while True:
            comparaisons += 1
            profondeur += 1
            cote = gauche if cles[i - 1] < cles[v - 1] else droite
            if cote[v] == 0:
                cote[v] = i
                break
            v = cote[v]
        hauteur = max(hauteur, profondeur)
    return hauteur, comparaisons

n = 2000
melangees = []
x = 1
for _ in range(n):
    x = (x * 1103515245 + 12345) % 2147483648   # suite pseudo-aléatoire
    melangees.append(x)
print(*construire(list(range(1, n + 1))))
print(*construire(melangees))
```

```cpp
#include <algorithm>
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

// insère les clés dans l'ordre ; renvoie (hauteur, nombre total de comparaisons)
pair<long long, long long> construire(const vector<long long> &cles) {
    int n = cles.size();
    vector<int> gauche(n + 1, 0), droite(n + 1, 0);
    long long hauteur = 0, comparaisons = 0;
    for (int i = 2; i <= n; i++) {        // le nœud i porte la clé cles[i - 1] ; 1 est la racine
        int v = 1;
        long long profondeur = 0;
        while (true) {
            comparaisons++;
            profondeur++;
            vector<int> &cote = (cles[i - 1] < cles[v - 1]) ? gauche : droite;
            if (cote[v] == 0) {
                cote[v] = i;
                break;
            }
            v = cote[v];
        }
        hauteur = max(hauteur, profondeur);
    }
    return {hauteur, comparaisons};
}

int main() {
    int n = 2000;
    vector<long long> triees, melangees;
    long long x = 1;
    for (int i = 1; i <= n; i++) {
        triees.push_back(i);
        x = (x * 1103515245 + 12345) % 2147483648LL;   // suite pseudo-aléatoire
        melangees.push_back(x);
    }
    auto [h1, c1] = construire(triees);
    auto [h2, c2] = construire(melangees);
    cout << h1 << " " << c1 << "\n" << h2 << " " << c2 << "\n";
    return 0;
}
```

Le programme affiche `1999 1999000`, puis `23 24390`. En insérant les nombres de 1 à 2 000 dans l'ordre croissant, chaque nouvelle clé va tout en bas à droite : l'arbre est un chemin de hauteur 1 999, on dit qu'il est **dégénéré**, et la construction fait près de deux millions de comparaisons, `n²/2`. Avec les mêmes quantités insérées dans un ordre mélangé, la hauteur n'est que de 23 et les comparaisons sont 80 fois moins nombreuses. On montre qu'en moyenne, pour un ordre d'insertion aléatoire, la hauteur est de l'ordre de `log n`.

Pour **garantir** une hauteur en O(log n) quel que soit l'ordre, il existe des **arbres équilibrés** (arbres AVL, arbres rouge-noir) qui se réorganisent après chaque insertion. On ne les programme pas ici ; il suffit de savoir qu'ils existent, et que les ensembles ordonnés `set` et `map` de C++ en sont. Python n'en propose pas : on utilise un dictionnaire, ou une liste triée avec une recherche dichotomique.

## Les erreurs fréquentes

**Oublier l'arbre vide.** Une fonction récursive doit traiter le cas `v = 0` (ou `None`) en premier ; sinon elle lit `gauche[0]` et tourne en rond, ou provoque `TypeError: 'NoneType' object is not subscriptable` avec une représentation par objets.

**Vérifier l'invariant seulement entre père et fils.** L'arbre de racine 5, avec 3 à gauche et 6 comme fils droit de 3, respecte la condition entre chaque père et ses fils, mais n'est pas un ABR : 6 est dans le sous-arbre gauche de 5. On vérifie avec des intervalles transmis de père en fils, ou avec le parcours infixe.

**Les clés égales.** On choisit une convention (refuser les doublons, ou les envoyer à droite) et l'on s'y tient partout.

**La récursion sur un arbre dégénéré.** Un ABR construit à partir de données triées est un chemin : une fonction récursive atteint la profondeur `n`. On préfère des boucles (`while`) pour chercher et insérer, et un parcours avec file ou pile pour le reste.

## Exemple complet : l'arbre d'une expression

**Énoncé.** Une expression arithmétique est donnée sous forme d'arbre binaire : chaque feuille porte un entier, chaque autre nœud une opération `+`, `-` ou `*` et a exactement deux fils. La racine est le nœud 1. Afficher l'expression entièrement parenthésée, puis sa valeur. Chaque ligne de l'entrée donne l'étiquette d'un nœud et ses deux fils (`0 0` pour une feuille).

**Idée.** La valeur d'un nœud s'obtient à partir des valeurs de ses deux fils : c'est un **parcours suffixe**. L'écriture de l'expression place l'opération entre ses deux opérandes : c'est un **parcours infixe**, avec des parenthèses autour de chaque opération.

```python
import sys
sys.setrecursionlimit(10000)

def valeur(v):
    # parcours suffixe : les deux fils d'abord, puis l'opération
    if gauche[v] == 0:
        return int(etiquette[v])
    a = valeur(gauche[v])
    b = valeur(droite[v])
    if etiquette[v] == "+":
        return a + b
    if etiquette[v] == "-":
        return a - b
    return a * b

def ecrire(v):
    # parcours infixe, avec des parenthèses autour de chaque opération
    if gauche[v] == 0:
        return etiquette[v]
    return "(" + ecrire(gauche[v]) + " " + etiquette[v] + " " + ecrire(droite[v]) + ")"

n = int(input())
etiquette = [""] * (n + 1)
gauche = [0] * (n + 1)
droite = [0] * (n + 1)
for i in range(1, n + 1):
    e, g, d = input().split()
    etiquette[i], gauche[i], droite[i] = e, int(g), int(d)
print(ecrire(1))
print(valeur(1))
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

vector<string> etiquette;
vector<int> gauche, droite;

// parcours suffixe : les deux fils d'abord, puis l'opération
long long valeur(int v) {
    if (gauche[v] == 0) return stoll(etiquette[v]);
    long long a = valeur(gauche[v]);
    long long b = valeur(droite[v]);
    if (etiquette[v] == "+") return a + b;
    if (etiquette[v] == "-") return a - b;
    return a * b;
}

// parcours infixe, avec des parenthèses autour de chaque opération
string ecrire(int v) {
    if (gauche[v] == 0) return etiquette[v];
    return "(" + ecrire(gauche[v]) + " " + etiquette[v] + " " + ecrire(droite[v]) + ")";
}

int main() {
    int n;
    cin >> n;
    etiquette.assign(n + 1, "");
    gauche.assign(n + 1, 0);
    droite.assign(n + 1, 0);
    for (int i = 1; i <= n; i++) cin >> etiquette[i] >> gauche[i] >> droite[i];
    cout << ecrire(1) << "\n";
    cout << valeur(1) << "\n";
    return 0;
}
```

**Vérification à la main.** Avec l'entrée suivante :

```text
9
* 2 3
+ 4 5
- 6 7
3 0 0
4 0 0
10 0 0
* 8 9
2 0 0
3 0 0
```

le nœud 2 vaut 3 + 4 = 7, le nœud 7 vaut 2 × 3 = 6, le nœud 3 vaut 10 − 6 = 4, et la racine 7 × 4 = 28. Le programme affiche `((3 + 4) * (10 - (2 * 3)))`, puis `28`.

**Correction et coût.** Par récurrence sur la taille du sous-arbre : `valeur(v)` renvoie la valeur de la sous-expression de racine `v`, et `ecrire(v)` son écriture parenthésée. Chaque nœud est visité une fois par fonction : O(n), en dehors de la construction des chaînes.

## À retenir

- Un **arbre binaire** est vide, ou une racine avec un sous-arbre gauche et un sous-arbre droit ; on le range dans deux tableaux `gauche` et `droite` (0 pour « pas de fils »), et la racine est le seul nœud qui n'est le fils de personne.
- Les parcours **préfixe**, **infixe** et **suffixe** suivent la définition récursive et coûtent O(n) ; le parcours **par niveaux** utilise une file. Les preuves se font par récurrence sur la taille.
- La **hauteur** vaut `1 + max(hauteur(gauche), hauteur(droite))`, avec −1 pour l'arbre vide ; un arbre de hauteur `h` a au plus `2^(h+1) − 1` nœuds.
- L'ordre préfixe et l'ordre infixe déterminent un arbre de manière **unique** ; on le reconstruit récursivement en O(n).
- Dans un **arbre binaire de recherche**, tout le sous-arbre gauche est plus petit et tout le sous-arbre droit plus grand ; le parcours infixe est trié ; chercher, insérer, le minimum et le successeur coûtent O(h).
- Sans équilibrage, un ABR peut **dégénérer** en chemin (données triées) : `h = n − 1` et `n` insertions coûtent O(n²). Les arbres équilibrés garantissent O(log n).
