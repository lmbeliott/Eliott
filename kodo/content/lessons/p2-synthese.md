Le niveau 2 a ajouté beaucoup d'outils : les nombres à virgule et les arrondis, les listes, les chaînes, les fonctions, les grilles, les dictionnaires et les ensembles. Chacun, pris seul, est simple. La difficulté d'un problème de synthèse est ailleurs : choisir les bons outils, les assembler proprement, et vérifier que le programme est juste dans tous les cas. Ce chapitre fait le point sur ces trois savoir-faire.

## Choisir la bonne structure

Avant d'écrire une boucle, on se demande quelles informations le programme doit **retenir**, et sous quelle forme. Le tableau suivant résume les choix du niveau.

| Besoin | Structure |
| --- | --- |
| Un total, un compteur, un maximum | une simple variable |
| Des valeurs dans l'ordre, accessibles par leur position | une liste |
| Un texte, lu ou construit lettre par lettre | une chaîne |
| Des cases repérées par une ligne et une colonne | une grille (liste de lignes) |
| Savoir si un élément a déjà été vu | un ensemble |
| Associer une information à un mot, un grand nombre ou un couple | un dictionnaire |
| Compter les apparitions de petits entiers (chiffres, lettres) | une liste de compteurs |
| Compter les apparitions de valeurs quelconques | un dictionnaire de fréquences |

Deux réflexes évitent la plupart des erreurs de choix. D'abord, dès qu'une boucle contient un test `x in liste`, on se demande si un **ensemble** ne serait pas plus adapté : sur de grandes entrées, la liste rend le programme des milliers de fois plus lent. Ensuite, on n'utilise pas de nombres à virgule quand un calcul en entiers suffit : une moyenne comparée à un seuil se teste avec `somme >= seuil × n`, et un arrondi au dixième se calcule avec des divisions entières.

## Découper un problème en fonctions

Un programme de cinquante lignes écrit d'un seul bloc est difficile à relire et à corriger. On le découpe en **fonctions**, chacune chargée d'une seule tâche. La méthode est toujours la même.

1. **Écrire le programme principal avec des noms de fonctions qui n'existent pas encore.** Pour une simulation sur une grille : lire la grille, appeler `K` fois `generation_suivante`, afficher. Le programme principal se lit alors comme un résumé de la solution.
2. **Écrire chaque fonction.** Elle reçoit ce dont elle a besoin en **paramètres** et renvoie son résultat avec `return`. Elle n'affiche rien et ne lit rien : c'est le programme principal qui s'occupe de l'entrée et de la sortie.
3. **Tester chaque fonction seule**, sur des valeurs choisies à la main, avant de l'utiliser dans le reste du programme.

Voici une fonction typique : le nombre de voisines d'une case qui contiennent un caractère donné, en ignorant les cases hors de la grille.

```python
def voisines(grille, i, j, car):
    total = 0
    for di in [-1, 0, 1]:
        for dj in [-1, 0, 1]:
            a = i + di
            b = j + dj
            if (di != 0 or dj != 0) and 0 <= a < len(grille) and 0 <= b < len(grille[0]):
                if grille[a][b] == car:
                    total = total + 1
    return total

g = ["#.#", "...", "##."]
print(voisines(g, 1, 1, "#"), voisines(g, 0, 0, "#"))
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int voisines(const vector<string>& grille, int i, int j, char car) {
    int total = 0;
    for (int di = -1; di <= 1; di++) {
        for (int dj = -1; dj <= 1; dj++) {
            int a = i + di;
            int b = j + dj;
            if ((di != 0 || dj != 0) && 0 <= a && a < (int)grille.size() && 0 <= b && b < (int)grille[0].size()) {
                if (grille[a][b] == car) {
                    total = total + 1;
                }
            }
        }
    }
    return total;
}

int main() {
    vector<string> g = {"#.#", "...", "##."};
    cout << voisines(g, 1, 1, '#') << " " << voisines(g, 0, 0, '#') << "\n";
    return 0;
}
```

Le programme affiche `4 0`. Les deux appels sont de petits tests : la case du centre touche les quatre `#`, la case du coin n'en touche aucun. Si la fonction est juste sur ces exemples, y compris au bord, on peut s'en servir sans y repenser.

## Estimer le temps de calcul

Avant d'écrire un programme, on estime le nombre d'opérations qu'il fera, à partir des contraintes de l'énoncé. Un ordre de grandeur suffit : Python exécute de l'ordre de 10 millions d'opérations simples par seconde, le C++ de l'ordre de quelques centaines de millions. Avec `N ≤ 100 000`, une double boucle sur toutes les paires fait 5 milliards de tours : c'est impossible. Un seul passage avec un dictionnaire en fait 100 000 : c'est immédiat.

Quand le compte est trop grand, trois idées du niveau 2 reviennent souvent :

- **remplacer une recherche dans une liste par un ensemble ou un dictionnaire** : chaque test `in` devient presque instantané ;
- **chercher le partenaire au lieu d'essayer toutes les paires** : pour compter les paires de somme `K`, on se demande, pour chaque valeur `x`, combien de valeurs `K - x` ont déjà été lues, et un dictionnaire de fréquences répond aussitôt ;
- **retourner la question** : au lieu de chercher les diviseurs de chaque nombre, on part de chaque diviseur `d` et on visite ses multiples `2d`, `3d`… ; au lieu de traiter chaque requête séparément, on prépare une fois pour toutes l'ensemble de toutes les réponses possibles, puis chaque requête devient un simple test `in`.

## Détecter un cycle

Beaucoup de simulations répètent la même transformation : un nombre devient un autre nombre, un robot passe d'une case à la suivante. Ce qui décrit la situation à un instant donné s'appelle l'**état**. Quand il n'y a qu'un nombre fini d'états possibles, et que l'état suivant ne dépend que de l'état courant, la suite repasse forcément un jour par un état déjà vu. À partir de là, elle refait exactement le même trajet. Elle a donc la forme d'une **queue**, parcourue une seule fois, suivie d'un **cycle**, répété sans fin.

Pour repérer ce moment, on garde un dictionnaire qui associe à chaque état l'**instant** de sa première apparition. Dans l'exemple suivant, l'état est un entier, que l'on remplace à chaque étape par la somme des carrés de ses chiffres. Le programme lit la valeur de départ et un nombre d'étapes `K`, puis affiche l'instant où commence le cycle, la longueur du cycle, et la valeur obtenue après `K` étapes.

```python
def suivant(x):
    s = 0
    while x > 0:
        s = s + (x % 10) * (x % 10)
        x = x // 10
    return s

x, k = map(int, input().split())
suite = [x]          # suite[t] = valeur après t étapes
instant = {x: 0}     # valeur -> instant de sa première apparition
y = suivant(x)
while y not in instant:
    instant[y] = len(suite)
    suite.append(y)
    y = suivant(y)
debut = instant[y]
longueur = len(suite) - debut
if k < len(suite):
    valeur = suite[k]
else:
    valeur = suite[debut + (k - debut) % longueur]
print(debut, longueur, valeur)
```

```cpp
#include <iostream>
#include <map>
#include <vector>
using namespace std;

int suivant(int x) {
    int s = 0;
    while (x > 0) {
        s = s + (x % 10) * (x % 10);
        x = x / 10;
    }
    return s;
}

int main() {
    int x;
    long long k;
    cin >> x >> k;
    vector<int> suite = {x};      // suite[t] = valeur après t étapes
    map<int, int> instant;        // valeur -> instant de sa première apparition
    instant[x] = 0;
    int y = suivant(x);
    while (instant.count(y) == 0) {
        instant[y] = suite.size();
        suite.push_back(y);
        y = suivant(y);
    }
    long long debut = instant[y];
    long long longueur = suite.size() - debut;
    int valeur;
    if (k < (long long) suite.size()) {
        valeur = suite[k];
    } else {
        valeur = suite[debut + (k - debut) % longueur];
    }
    cout << debut << " " << longueur << " " << valeur << "\n";
    return 0;
}
```

Avec l'entrée `2 1000000`, la suite vaut 2, 4, 16, 37, 58, 89, 145, 42, 20, puis `suivant(20)` redonne 4, déjà vu à l'instant 1. La queue ne contient que 2, le cycle commence à l'instant `debut = 1` et contient `longueur = 9 - 1 = 8` valeurs. Après l'instant `debut`, la suite revient au même endroit toutes les 8 étapes : la valeur à l'instant `K` est donc celle de l'instant `debut + (K - debut) % longueur`, ici 1 + 999 999 % 8 = 8. Le programme affiche `1 8 20` sans simuler un million d'étapes.

La boucle s'arrête, car les états sont en nombre fini : un nombre d'au plus 10 chiffres a une somme des carrés de ses chiffres d'au plus 10 × 81 = 810. Elle fait au plus autant de tours qu'il y a d'états, même si `K` vaut 10¹⁸. Le nombre de valeurs différentes rencontrées est `len(suite)`. Le dictionnaire est indispensable : avec un test `in` sur la liste `suite`, chaque étape reparcourrait tout le chemin déjà fait.

## Tester les cas limites

Un programme qui donne la bonne réponse sur l'exemple n'est pas forcément juste. Avant de soumettre, on construit de petites entrées pour les **cas limites** du niveau 2, et on calcule la réponse attendue à la main :

- **les tailles extrêmes** : une liste d'un seul élément, un mot d'une lettre, une grille d'une seule ligne ou d'une seule colonne, et la taille maximale autorisée ;
- **les bords d'une grille** : une case de coin n'a que trois voisines ;
- **les doublons** : deux fois la même valeur, la même clé, le même mot ; et toutes les valeurs égales ;
- **les égalités** : quand deux candidats ont le même score, l'énoncé dit lequel choisir, et le programme doit le respecter (premier vu, plus petit…) ;
- **les arrondis** : une valeur qui tombe exactement au milieu, comme `12,25` à arrondir au dixième ;
- **les restes négatifs** : en Python `-1 % 26` vaut `25`, en C++ il vaut `-1` ;
- **les grands nombres** : en C++, tout ce qui peut dépasser 2 × 10⁹ se stocke dans un `long long` ;
- **les nombres d'étapes immenses** : si `K` peut valoir 10¹⁸, on ne simule pas `K` étapes, on cherche un cycle.

## Lire les messages d'erreur

Quand le programme s'arrête, Python affiche la ligne fautive et un message. Les plus fréquents au niveau 2 :

- `IndexError: list index out of range` (ou `string index out of range`) : un indice dépasse la taille. On cherche une boucle qui va un tour trop loin, ou une case voisine prise hors de la grille. Attention, un indice `-1` ne provoque pas d'erreur : il lit silencieusement le dernier élément ;
- `KeyError: 'kiwi'` : lecture d'une clé absente d'un dictionnaire. On teste avec `in` ou on utilise `get` ;
- `TypeError: unhashable type: 'list'` : une liste utilisée comme clé ou mise dans un ensemble. On utilise un tuple ;
- `RuntimeError: dictionary changed size during iteration` : des clés ajoutées ou supprimées pendant le parcours du dictionnaire ;
- `ValueError: invalid literal for int() with base 10` : un `int()` appliqué à une ligne qui contient plusieurs nombres ou un mot ; il manquait un `split()` ;
- `ZeroDivisionError: division by zero` : une moyenne calculée sur zéro valeur, cas limite oublié.

En C++, la plupart de ces erreurs ne produisent **aucun message** : un indice hors du tableau lit une valeur au hasard ou fait planter le programme, et `d[cle]` crée la clé au lieu de signaler son absence. Un verdict « mauvaise réponse » sans raison apparente doit faire penser à ces deux causes.

Enfin, le verdict « temps limite dépassé » vient presque toujours d'une boucle `while` qui ne s'arrête pas, ou d'un test `in` sur une liste là où il fallait un ensemble ou un dictionnaire.

## Exemple complet : la ligne la plus variée

**Énoncé.** On lit une grille de `R` lignes de `C` lettres. Afficher le plus grand nombre de lettres différentes que l'on trouve dans une ligne ou dans une colonne.

**Choix des structures.** La grille est une liste de chaînes. Pour compter les lettres différentes d'une suite de lettres, l'ensemble est l'outil exact : sa taille est le nombre d'éléments distincts.

**Découpage.** Deux fonctions : `distinctes(lettres)` renvoie le nombre de lettres différentes d'une chaîne, et `colonne(grille, j)` construit la chaîne formée par la colonne `j`. Le programme principal applique `distinctes` à chaque ligne et à chaque colonne et garde le maximum.

```python
def distinctes(lettres):
    return len(set(lettres))

def colonne(grille, j):
    c = ""
    for ligne in grille:
        c = c + ligne[j]
    return c

r, c = map(int, input().split())
grille = []
for i in range(r):
    grille.append(input())

meilleur = 0
for ligne in grille:
    meilleur = max(meilleur, distinctes(ligne))
for j in range(c):
    meilleur = max(meilleur, distinctes(colonne(grille, j)))
print(meilleur)
```

```cpp
#include <algorithm>
#include <iostream>
#include <set>
#include <string>
#include <vector>
using namespace std;

int distinctes(const string& lettres) {
    set<char> vues;
    for (char x : lettres) {
        vues.insert(x);
    }
    return vues.size();
}

string colonne(const vector<string>& grille, int j) {
    string c = "";
    for (string ligne : grille) {
        c += ligne[j];
    }
    return c;
}

int main() {
    int r, c;
    cin >> r >> c;
    vector<string> grille(r);
    for (int i = 0; i < r; i++) {
        cin >> grille[i];
    }
    int meilleur = 0;
    for (string ligne : grille) {
        meilleur = max(meilleur, distinctes(ligne));
    }
    for (int j = 0; j < c; j++) {
        meilleur = max(meilleur, distinctes(colonne(grille, j)));
    }
    cout << meilleur << "\n";
    return 0;
}
```

**Vérification.** Avec la grille `aab` / `bcd` / `aae`, les lignes ont 2, 3 et 2 lettres différentes ; les colonnes `aba`, `aca` et `bde` en ont 2, 2 et 3. Le programme affiche `3`. Cas limites : une grille d'une seule case donne 1 ; une grille où toutes les lettres sont égales donne 1 ; une grille d'une seule ligne `abc` donne 3, par la ligne, alors que chaque colonne n'a qu'une lettre. Chaque fonction se teste aussi seule : `distinctes("abracadabra")` doit valoir 5, et `colonne(["ab", "cd"], 1)` doit valoir `"bd"`.

## À retenir

- Avant de coder, choisir la structure de chaque information : variable, liste, chaîne, grille, ensemble ou dictionnaire. Un test `in` répété se fait sur un ensemble, pas sur une liste.
- Rester en nombres entiers tant que c'est possible ; les arrondis se calculent avec des divisions entières.
- Découper en fonctions qui reçoivent des paramètres et renvoient un résultat, sans lire ni afficher, et tester chacune seule sur de petits exemples.
- Estimer le nombre d'opérations à partir des contraintes. Une simulation sur un nombre fini d'états finit par boucler : un dictionnaire « état → instant de première apparition » repère le cycle et permet de sauter directement à l'étape `K`.
- Tester les cas limites : taille 1, bords de grille, doublons, égalités, valeurs au milieu d'un arrondi, restes négatifs, grands nombres.
- Lire les messages d'erreur (`IndexError`, `KeyError`, `TypeError`, `ValueError`…) ; en C++, une mauvaise réponse sans message fait penser à un indice hors du tableau ou à une clé créée par `[]`.
