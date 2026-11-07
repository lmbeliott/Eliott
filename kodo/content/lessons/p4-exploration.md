Pour placer des antennes, colorier une carte ou remplir une grille, on ne sait souvent pas faire mieux qu'essayer les possibilités. Mais « tout essayer » demande de la méthode : énumérer chaque possibilité **une fois et une seule**, abandonner au plus tôt celles qui ne peuvent pas aboutir, et estimer le nombre de cas avant d'écrire la moindre ligne.

Après les sous-ensembles et les permutations du chapitre « Récursivité », ce chapitre présente les sous-ensembles codés par des entiers, les combinaisons, puis le **retour sur trace** et ses deux outils : l'élagage et la suppression des symétries.

## Les sous-ensembles codés par des entiers

Le chapitre « Graphes implicites » a présenté les **masques** : un ensemble d'éléments numérotés de `0` à `n − 1` est codé par l'entier dont le bit `i` vaut 1 si l'élément `i` est dans l'ensemble ; `1 << i` est le masque de `{i}`, et `masque >> i & 1` dit si `i` est présent. Les `2^n` sous-ensembles d'une liste de `n` éléments correspondent donc exactement aux entiers de `0` à `2^n − 1`, et une simple boucle les énumère tous, sans récursion.

```python
t = [3, 5, 7, 9, 2]
n = len(t)
for masque in range(1 << n):              # de 0 à 2^n - 1
    choisis = [t[i] for i in range(n) if masque >> i & 1]
    if sum(choisis) == 12:
        print(masque, choisis)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {3, 5, 7, 9, 2};
    int n = t.size();
    for (int masque = 0; masque < (1 << n); masque++) {   // de 0 à 2^n - 1
        int somme = 0;
        for (int i = 0; i < n; i++)
            if ((masque >> i) & 1) somme += t[i];
        if (somme == 12) {
            cout << masque << " [";
            bool premier = true;
            for (int i = 0; i < n; i++)
                if ((masque >> i) & 1) {
                    cout << (premier ? "" : ", ") << t[i];
                    premier = false;
                }
            cout << "]\n";
        }
    }
    return 0;
}
```

Le programme affiche les trois sous-ensembles de somme 12 : `6 [5, 7]`, `9 [3, 9]` et `21 [3, 7, 2]` (21 s'écrit `10101` : les bits 0, 2 et 4 désignent 3, 7 et 2).

Les autres opérations sur les ensembles s'écrivent aussi en une instruction, la même en Python et en C++ sauf pour les deux dernières :
- `(1 << n) - 1` : l'ensemble de tous les éléments (`n` bits à 1) ; on peut aussi écrire un masque en binaire avec le préfixe `0b` : `0b1111110` vaut 126, l'ensemble `{1, 2, 3, 4, 5, 6}` ;
- `a | b` et `a & b` : la réunion et l'intersection (le « et » bit à bit met à 1 les bits qui valent 1 dans les deux nombres) ;
- `a & ~b` : les éléments de `a` qui ne sont pas dans `b`, car `~b` inverse tous les bits de `b` ; en particulier, `m & ~(1 << i)` retire `i` ;
- `m & (m - 1)` : `m` privé de son plus petit élément ;
- `m & -m` : le masque qui ne contient que le plus petit élément de `m` ;
- le nombre d'éléments : `bin(m).count("1")` en Python, `__builtin_popcount(m)` en C++ ;
- le numéro du plus petit élément, pour `m > 0` : `(m & -m).bit_length() - 1` en Python (`bit_length` donne le nombre de chiffres binaires), `__builtin_ctz(m)` en C++.

**Pourquoi ces deux astuces marchent.** Soustraire 1 à `m` transforme son dernier bit à 1 en 0 et les 0 qui le suivent en 1, sans toucher aux bits plus hauts : c'est la retenue de la soustraction posée, en binaire. Le « et » de `m` et de `m − 1` efface donc exactement ce bit : `12 = 1100`, `11 = 1011`, `12 & 11 = 1000 = 8`. Ensuite, `~x` vaut `−x − 1` (c'est sa définition, en Python comme en C++), donc `−m = ~(m − 1)` : au-dessus du plus petit bit à 1 de `m`, les bits de `−m` sont l'inverse de ceux de `m` ; à sa place, `−m` a un 1 ; en dessous, des 0. Le « et » ne garde que ce bit : `12 & −12 = 4`.

La boucle précédente coûte `2^n × n` opérations, car chaque somme est recalculée depuis le début. On peut réutiliser un résultat déjà calculé : la somme de `m` est celle de `m & (m − 1)`, un entier plus petit, donc déjà traité, plus le plus petit élément de `m`. On remplit ainsi un tableau des `2^n` sommes en O(2^n).

```python
t = [3, 5, 7, 9, 2]
n = len(t)
somme = [0] * (1 << n)
for m in range(1, 1 << n):
    i = (m & -m).bit_length() - 1          # numéro du plus petit élément de m
    somme[m] = somme[m & (m - 1)] + t[i]   # m privé de cet élément : déjà calculé
print(somme[21], sum(1 for m in range(1 << n) if somme[m] == 12))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {3, 5, 7, 9, 2};
    int n = t.size();
    vector<int> somme(1 << n, 0);
    for (int m = 1; m < (1 << n); m++) {
        int i = __builtin_ctz(m);                  // numéro du plus petit élément de m
        somme[m] = somme[m & (m - 1)] + t[i];      // m privé de cet élément : déjà calculé
    }
    int nb = 0;
    for (int m = 0; m < (1 << n); m++)
        if (somme[m] == 12) nb++;
    cout << somme[21] << " " << nb << "\n";
    return 0;
}
```

Le programme affiche `12 3` : le masque 21 code `{3, 7, 2}`, et trois masques ont une somme de 12. En Python, un entier peut avoir autant de bits qu'on veut ; en C++, un `int` en a 32 et un `long long` 64 : au-delà de 30 éléments, on écrit `1LL << i`, `__builtin_popcountll` et `__builtin_ctzll`.

En pratique, `2^20 ≈ 10⁶` sous-ensembles s'énumèrent sans difficulté, `2^25 ≈ 3 × 10⁷` déjà difficilement en Python, et `2^40` jamais.

## Les combinaisons

Une **combinaison** de `k` éléments parmi `n` est un sous-ensemble de taille `k` ; il y en a `C(n, k) = n! / (k! (n − k)!)`. Pour les énumérer sans passer par les `2^n` sous-ensembles, on choisit les éléments dans l'ordre croissant : après avoir choisi `x`, le suivant est au moins `x + 1`. Imposer un ordre garantit que chaque ensemble n'est produit qu'une fois, au lieu de `k!` fois (une par ordre de ses éléments).

```python
def combinaisons(debut, choisis):
    if len(choisis) == k:
        resultat.append("".join(map(str, choisis)))
        return
    # il faut encore k - len(choisis) éléments : inutile de commencer trop tard
    for x in range(debut, n - (k - len(choisis)) + 2):
        choisis.append(x)
        combinaisons(x + 1, choisis)
        choisis.pop()

n, k = 5, 3
resultat = []
combinaisons(1, [])
print(len(resultat), *resultat)
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int n = 5, k = 3;
vector<int> choisis;
vector<string> resultat;

void combinaisons(int debut) {
    if ((int)choisis.size() == k) {
        string s;
        for (int x : choisis) s += to_string(x);
        resultat.push_back(s);
        return;
    }
    // il faut encore k - choisis.size() éléments : inutile de commencer trop tard
    for (int x = debut; x <= n - (k - (int)choisis.size()) + 1; x++) {
        choisis.push_back(x);
        combinaisons(x + 1);
        choisis.pop_back();
    }
}

int main() {
    combinaisons(1);
    cout << resultat.size();
    for (const string &s : resultat) cout << " " << s;
    cout << "\n";
    return 0;
}
```

Le programme affiche `10`, puis les dix combinaisons de 3 éléments parmi `1 2 3 4 5`, de `123` à `345`. La borne de la boucle est un premier exemple d'**élagage** : s'il faut encore choisir `r` éléments, le prochain ne peut pas dépasser `n − r + 1`, sinon il n'en resterait pas assez après lui. Sans cette borne, le programme serait juste, mais il explorerait des branches mortes.

## Le retour sur trace

Le **retour sur trace** (*backtracking*) construit une solution pas à pas. À chaque étape, il essaie chacun des choix possibles, s'appelle récursivement pour la suite, puis **défait** ce choix avant d'essayer le suivant. L'ensemble des appels forme l'**arbre de recherche** : la racine est la situation de départ, chaque nœud est une solution partielle, et les feuilles sont les solutions complètes ou les impasses.

Exemple classique : placer `n` dames sur un échiquier `n × n` sans que deux se menacent (même ligne, même colonne ou même diagonale). Il y a exactement une dame par ligne : on les place ligne par ligne, en choisissant la colonne. Trois tableaux de booléens disent si une colonne et les deux diagonales sont déjà occupées : sur une diagonale, `ligne + colonne` est constant ; sur l'autre, `ligne − colonne` est constant (on ajoute `n` pour avoir un indice positif).

```python
def placer(ligne):
    global solutions, noeuds
    noeuds += 1
    if ligne == n:
        solutions += 1
        return
    for col in range(n):
        if not colonne[col] and not diag1[ligne + col] and not diag2[ligne - col + n]:
            colonne[col] = diag1[ligne + col] = diag2[ligne - col + n] = True
            placer(ligne + 1)
            colonne[col] = diag1[ligne + col] = diag2[ligne - col + n] = False

for n in range(4, 9):
    colonne = [False] * n
    diag1 = [False] * (2 * n)          # ligne + col constant sur une diagonale
    diag2 = [False] * (2 * n + 1)      # ligne - col constant sur l'autre
    solutions = noeuds = 0
    placer(0)
    print(n, solutions, noeuds)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int n;
long long solutions, noeuds;
vector<bool> colonne, diag1, diag2;

void placer(int ligne) {
    noeuds++;
    if (ligne == n) {
        solutions++;
        return;
    }
    for (int col = 0; col < n; col++) {
        if (!colonne[col] && !diag1[ligne + col] && !diag2[ligne - col + n]) {
            colonne[col] = diag1[ligne + col] = diag2[ligne - col + n] = true;
            placer(ligne + 1);
            colonne[col] = diag1[ligne + col] = diag2[ligne - col + n] = false;
        }
    }
}

int main() {
    for (n = 4; n <= 8; n++) {
        colonne.assign(n, false);
        diag1.assign(2 * n, false);          // ligne + col constant sur une diagonale
        diag2.assign(2 * n + 1, false);      // ligne - col constant sur l'autre
        solutions = noeuds = 0;
        placer(0);
        cout << n << " " << solutions << " " << noeuds << "\n";
    }
    return 0;
}
```

Le programme affiche, pour `n` de 4 à 8, le nombre de solutions et le nombre de nœuds visités : `4 2 17`, `5 10 54`, `6 4 153`, `7 40 552` et `8 92 2057`.

**Correction.** Invariant : quand on appelle `placer(ligne)`, les dames des lignes `0` à `ligne − 1` ne se menacent pas deux à deux, et les trois tableaux décrivent exactement les colonnes et diagonales qu'elles occupent. On ne place une dame que sur une case non menacée, et l'on remet les tableaux dans leur état en revenant : l'invariant est conservé. Toute solution est trouvée exactement une fois, car son placement est la suite de choix qui y mène, et deux branches différentes diffèrent par la colonne d'une même ligne.

**Coût.** Énumérer les `8^8 ≈ 1,7 × 10⁷` façons de placer une dame par ligne, puis les vérifier, serait bien plus long : le retour sur trace ne visite que 2 057 nœuds, car chaque branche est coupée dès que la nouvelle dame est menacée. C'est tout l'intérêt de **vérifier les contraintes le plus tôt possible**.

## Élaguer avec une borne

Pour un problème d'**optimisation** (trouver la meilleure solution), on peut couper une branche même si elle contient des solutions valables : il suffit de prouver qu'aucune ne battra le meilleur résultat déjà trouvé. On calcule pour cela une **borne** : une estimation optimiste de ce que la branche peut donner au mieux.

Exemple : choisir des nombres d'une liste dont la somme est la plus grande possible sans dépasser `S`. On trie la liste par ordre décroissant et l'on précalcule `reste[i]`, la somme des éléments à partir de l'indice `i`. Dans une branche où la somme actuelle vaut `somme`, on ne peut pas dépasser `somme + reste[i]` : si cette valeur ne dépasse pas le meilleur résultat connu, on abandonne la branche.

```python
t = [30, 42, 58, 26, 54, 58, 96, 92, 24, 84, 62, 64, 34, 82, 28, 94, 2, 88, 40, 96]
S = 501
t.sort(reverse=True)
n = len(t)
reste = [0] * (n + 1)                  # reste[i] = t[i] + t[i + 1] + ... + t[n - 1]
for i in range(n - 1, -1, -1):
    reste[i] = reste[i + 1] + t[i]

meilleur = 0
noeuds = 0

def explorer(i, somme):
    global meilleur, noeuds
    noeuds += 1
    meilleur = max(meilleur, somme)
    if i == n or meilleur == S:
        return
    if somme + reste[i] <= meilleur:   # même en prenant tout le reste, pas mieux
        return
    if somme + t[i] <= S:              # on ne dépasse jamais S
        explorer(i + 1, somme + t[i])
    explorer(i + 1, somme)

explorer(0, 0)
print(meilleur, noeuds)
```

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <vector>
using namespace std;

vector<int> t = {30, 42, 58, 26, 54, 58, 96, 92, 24, 84, 62, 64, 34, 82, 28, 94, 2, 88, 40, 96};
int S = 501, n, meilleur = 0;
long long noeuds = 0;
vector<int> reste;

void explorer(int i, int somme) {
    noeuds++;
    meilleur = max(meilleur, somme);
    if (i == n || meilleur == S) return;
    if (somme + reste[i] <= meilleur) return;     // même en prenant tout le reste, pas mieux
    if (somme + t[i] <= S) explorer(i + 1, somme + t[i]);   // on ne dépasse jamais S
    explorer(i + 1, somme);
}

int main() {
    sort(t.begin(), t.end(), greater<int>());
    n = t.size();
    reste.assign(n + 1, 0);                       // reste[i] = t[i] + t[i + 1] + ... + t[n - 1]
    for (int i = n - 1; i >= 0; i--) reste[i] = reste[i + 1] + t[i];
    explorer(0, 0);
    cout << meilleur << " " << noeuds << "\n";
    return 0;
}
```

Le programme affiche `500 104218` : la meilleure somme est 500 (tous les nombres sont pairs, 501 est impossible), et la recherche a visité 104 218 nœuds. Sans la borne, elle en visiterait 669 640, et sans aucune coupure, les 2 097 151 nœuds de l'arbre complet. Trier par ordre décroissant donne vite une bonne solution, qui rend la borne efficace.

Une borne doit être **optimiste** : elle ne doit jamais sous-estimer ce que la branche peut atteindre, sinon on couperait une branche qui contient la meilleure solution. Ici, `somme + reste[i]` est bien supérieure ou égale à toute somme atteignable dans la branche.

## Compter ou trouver

Trois questions se distinguent. **Existe-t-il** une solution ? Chaque appel renvoie `True` dès qu'un appel récursif a réussi : on s'arrête à la première solution. **Combien** y en a-t-il ? Chaque appel renvoie la somme des résultats de ses branches, et l'on parcourt tout l'arbre. **Quelle est la meilleure** ? On garde la meilleure valeur, ce qui permet d'élaguer avec une borne. La première question est souvent la plus rapide, sauf quand la réponse est « non » : il faut alors parcourir tout l'arbre pour en être sûr.

## Estimer la taille de l'arbre

Avant de programmer, on estime le nombre de nœuds : au pire, le produit des nombres de choix à chaque niveau. Sous-ensembles : `2^n` feuilles. Permutations : `n!`. Placer une dame par ligne : `n^n`, mais `n!` si l'on interdit d'emblée les colonnes déjà prises. Une boucle Python fait quelques millions d'opérations par seconde, un programme C++ quelques centaines de millions : `10!` ≈ 3,6 millions est raisonnable, `15!` ≈ 1,3 × 10¹² ne l'est jamais.

L'élagage rend l'estimation plus délicate, mais on peut souvent la justifier par une **récurrence**. Supposons qu'à chaque nœud, on choisisse un élément et que l'une des deux branches en retire au moins 3 (l'élément et deux voisins, par exemple). Le nombre de feuilles vérifie `T(n) ≤ T(n − 1) + T(n − 3)`, d'où, par récurrence, `T(n) ≤ 1,47ⁿ`, car 1,47³ ≈ 3,18 dépasse 1,47² + 1 ≈ 3,16 : environ 200 000 pour `n = 32`, contre 4 milliards pour `2ⁿ`. Pour une mesure concrète, on ajoute un compteur d'appels, comme dans les exemples ci-dessus, et l'on teste les cas les plus défavorables.

## Briser les symétries

Quand plusieurs solutions sont « les mêmes » à une transformation près, on évite de les explorer toutes : on impose une règle qui ne garde qu'un représentant de chaque famille. C'est la **suppression des symétries**, et elle peut diviser la taille de l'arbre par un grand facteur.

- **L'ordre ne compte pas** : on impose des éléments croissants, comme pour les combinaisons. Un ensemble de `k` éléments n'est alors produit qu'une fois au lieu de `k!`.
- **Rotations d'un cercle** : on fixe le premier élément à la première place ; chaque disposition circulaire de `n` éléments n'est produite qu'une fois au lieu de `n`.
- **Objets interchangeables** : si des paquets, des couleurs ou des machines sont identiques, mettre un objet dans le premier paquet vide ou dans le deuxième donne des situations équivalentes. On n'essaie qu'**un seul** paquet vide.
- **Valeurs égales** : dans une liste avec des doublons, choisir le premier 5 ou le second donne la même chose ; on trie la liste et l'on saute une valeur égale à celle qu'on vient d'essayer au même niveau.

Il faut prouver que la règle ne perd aucune solution : chaque famille doit garder **au moins un** représentant, et, si l'on compte, **exactement un**.

## Les erreurs fréquentes

**Oublier de défaire un choix.** Après l'appel récursif, l'état doit redevenir exactement ce qu'il était : retirer l'élément ajouté, libérer la colonne, soustraire l'objet du paquet. Sinon, les branches suivantes partent d'un état faux, et les résultats sont faux sans aucun message d'erreur.

**Copier l'état à chaque appel.** Passer `liste + [x]` ou une copie de la grille est juste, mais coûte O(n) par nœud : on modifie un seul état, puis on le restaure.

**Une coupure trop agressive.** Une borne pessimiste ou une règle de symétrie mal justifiée coupe des branches qui contenaient la solution : le programme répond vite, mais faux. On vérifie toujours sur de petits cas avec une énumération sans aucune coupure.

**Vérifier trop tard.** Ne tester les contraintes qu'une fois la solution complète construite revient à énumérer tout l'espace : on vérifie chaque contrainte dès que ses éléments sont placés.

## Exemple complet : des paquets de même somme

**Énoncé.** Peut-on répartir une liste d'entiers positifs en `K` paquets de même somme, chaque nombre allant dans un seul paquet ? La première ligne donne les nombres, la deuxième `K` ; afficher `OUI` ou `NON`.

**Idée.** La somme de chaque paquet doit valoir `total / K` : si `K` ne divise pas le total, ou si un nombre dépasse cette cible, la réponse est `NON`. Sinon, on place les nombres un par un, chacun dans un paquet où il tient encore. Pour réduire l'arbre, on trie les nombres par ordre décroissant (les gros sont les plus contraints), on s'arrête à la première répartition trouvée, et l'on n'essaie qu'un seul paquet vide, car ils sont interchangeables.

```python
def remplir(i):
    # place les objets i, i + 1, ... dans les paquets ; vrai si c'est possible
    if i == len(t):
        return True
    for p in range(k):
        if paquets[p] + t[i] <= cible:
            paquets[p] += t[i]
            if remplir(i + 1):
                return True
            paquets[p] -= t[i]
        if paquets[p] == 0:
            break          # les paquets vides sont interchangeables : un seul essai
    return False

t = list(map(int, input().split()))
k = int(input())
total = sum(t)
t.sort(reverse=True)       # les gros objets d'abord : les échecs arrivent plus tôt
if total % k != 0 or t[0] > total // k:
    print("NON")
else:
    cible = total // k
    paquets = [0] * k
    print("OUI" if remplir(0) else "NON")
```

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

vector<int> t, paquets;
int k, cible;

// place les objets i, i + 1, ... dans les paquets ; vrai si c'est possible
bool remplir(int i) {
    if (i == (int)t.size()) return true;
    for (int p = 0; p < k; p++) {
        if (paquets[p] + t[i] <= cible) {
            paquets[p] += t[i];
            if (remplir(i + 1)) return true;
            paquets[p] -= t[i];
        }
        if (paquets[p] == 0) break;   // les paquets vides sont interchangeables : un seul essai
    }
    return false;
}

int main() {
    string ligne;
    getline(cin, ligne);
    istringstream entree(ligne);
    int x, total = 0;
    while (entree >> x) {
        t.push_back(x);
        total += x;
    }
    cin >> k;
    sort(t.begin(), t.end(), greater<int>());   // les gros objets d'abord : les échecs arrivent plus tôt
    if (total % k != 0 || t[0] > total / k) {
        cout << "NON\n";
    } else {
        cible = total / k;
        paquets.assign(k, 0);
        cout << (remplir(0) ? "OUI" : "NON") << "\n";
    }
    return 0;
}
```

**Vérification à la main.** Avec `4 3 2 3 5 2 1` et `K = 4`, la cible vaut 20 / 4 = 5. Les nombres triés sont `5 4 3 3 2 2 1` : le 5, le 4 et les deux 3 occupent chacun un paquet, les deux 2 complètent les paquets des 3, et le 1 celui du 4. Le programme affiche `OUI` sans jamais revenir en arrière. Avec `2 2 2 2 3 4 5` et `K = 4`, la cible est encore 5, mais le 4 ne peut être complété que par un 1, qui n'existe pas : le programme explore toutes les branches et affiche `NON`.

**Correction.** Sans la règle des paquets vides, la fonction essaie toutes les façons de placer chaque nombre dans un paquet où il tient : elle trouve une répartition s'il en existe une. La règle ne perd rien : si une répartition met le nombre courant dans un paquet vide autre que le premier, on y échange les rôles de ce paquet et du premier paquet vide. Comme les deux sont vides à ce moment-là, la répartition obtenue est encore valable, et elle place le nombre dans le premier paquet vide.

**Coût.** Au pire, `Kⁿ` placements. La règle des paquets vides divise ce nombre par environ `K!`, et la limite `paquet + nombre ≤ cible` coupe très tôt les mauvaises branches ; pour une vingtaine de nombres, la recherche reste rapide en pratique.

## À retenir

- Un sous-ensemble se code par un **masque** de `n` bits : une boucle de `0` à `2^n − 1` énumère tous les sous-ensembles ; `|`, `&`, `~`, `m & (m − 1)` et `m & −m` manipulent les ensembles, et l'on réutilise le résultat de `m & (m − 1)`, déjà calculé.
- Le **retour sur trace** fait un choix, s'appelle, puis **défait** ce choix ; on vérifie les contraintes **dès que possible** pour couper les branches mortes.
- Pour optimiser, une **borne optimiste** (« au mieux, cette branche donne… ») permet d'abandonner les branches qui ne battront pas le meilleur résultat connu.
- **Trouver** une solution s'arrête au premier succès ; **compter** ou prouver qu'il n'y en a pas oblige à parcourir tout l'arbre.
- On **estime la taille de l'arbre** avant de programmer (`2^n`, `n!`, récurrence comme `T(n) ≤ T(n − 1) + T(n − 3)`), et l'on mesure avec un compteur d'appels.
- **Briser les symétries** (ordre croissant, premier élément fixé, un seul paquet vide, doublons sautés) divise l'arbre sans perdre de solution, à condition de le justifier.
