Le niveau 4 a réuni les grands outils de l'algorithmique classique : dichotomie, diviser pour régner, gloutons, arithmétique, parcours de graphes, graphes implicites, exploration exhaustive, arbres binaires de recherche, plus courts chemins, Union-Find et arbres couvrants. Dans un problème de synthèse, rien n'indique l'outil à employer, et souvent il en faut deux ou trois à la fois. Ce chapitre rassemble les réflexes qui permettent de les reconnaître, de modéliser un problème, de prouver la solution et d'éviter les erreurs classiques.

## Partir des contraintes

Comme au niveau 3, on lit d'abord les contraintes : environ 10⁸ opérations simples par seconde en C++, 10⁷ en Python.

| Contraintes | Complexité visée | Outils typiques du niveau 4 |
| --- | --- | --- |
| N ≤ 10 à 20 | O(N!) ou O(2^N) | exploration exhaustive, retour sur trace avec élagage |
| N ≤ 400 | O(N³) | Floyd-Warshall, trois boucles |
| N, M ≤ 2 × 10⁵ | O((N + M) log N) | tri, dichotomie, Dijkstra, Kruskal, Union-Find, parcours |
| valeurs ≤ 10⁷ | O(V log log V) | crible, parcours des multiples |
| N ≤ 10¹² | O(√N) | énumération des diviseurs, factorisation |
| N ≤ 10¹⁸ | O(log N) | Euclide, exponentiation rapide, dichotomie sur la réponse |

Le tableau se lit dans les deux sens : des valeurs jusqu'à 10¹⁸ interdisent tout tableau indexé par la valeur, et un `N` de 15 invite à tout essayer.

## Reconnaître la technique

Quelques formulations reviennent sans cesse.

- **« Le plus grand minimum », « le plus petit maximum », « la plus petite valeur telle que… ».** C'est souvent une **dichotomie sur la réponse** : on remplace la question d'optimisation par une question oui/non (« peut-on faire au moins `D` ? »), à condition qu'elle soit **monotone**. La question oui/non se résout alors par un glouton, un parcours ou un plus court chemin.
- **« Choisir au mieux, une décision à la fois ».** Un tri suivi d'un choix glouton suffit parfois ; il faut alors un argument d'échange. Si l'on ne trouve pas d'argument, c'est peut-être qu'il n'y en a pas : on cherche un contre-exemple sur une petite entrée.
- **Très peu d'objets.** Avec 8 éléments, 8! = 40 320 ordres ; avec 20, 2²⁰ ≈ 10⁶ sous-ensembles. L'exploration exhaustive est la bonne réponse, avec un élagage dès qu'une branche ne peut plus battre le meilleur résultat connu.
- **Des relations, des transformations, des états.** Dès que l'on passe d'une situation à une autre par des opérations, c'est un graphe : un parcours en largeur pour compter des étapes, Dijkstra pour des coûts positifs, Union-Find pour savoir qui est relié à qui quand les liens ne font que s'ajouter.
- **Des nombres très grands, mais une structure arithmétique.** Diviseurs, facteurs premiers, PGCD, restes : on cherche une propriété qui ramène le calcul à peu de cas (les diviseurs de `N`, les restes modulo `K`, les facteurs premiers distincts).

## Modéliser par un graphe

Choisir les **sommets** est la décision la plus importante. Ce peuvent être :

- des lieux, des cases d'une grille, des positions ;
- des **nombres** ou des **restes** : si seul compte le reste modulo `K`, il n'y a que `K` sommets, même pour des nombres gigantesques ;
- des **états** `(lieu, information)` : un coupon déjà utilisé ou non, des clés ramassées, un nombre de pas modulo 2 ;
- des **sommets auxiliaires** : un sommet par nombre premier, relié à tous ses multiples, remplace des millions d'arêtes entre nombres qui partagent ce facteur ; une source fictive reliée à plusieurs départs les traite tous en un seul parcours.

Les **arêtes** sont les opérations permises, avec leur coût. On vérifie alors une **correspondance** : chaque solution du problème donne un chemin de même coût, et chaque chemin donne une solution au plus aussi coûteuse. Cette vérification en deux sens est la preuve de la modélisation.

Quelques transformations élargissent beaucoup le champ :

- **Remonter le temps.** Des suppressions connues à l'avance deviennent des ajouts quand on parcourt les événements à l'envers. Un problème « depuis la fin » (atteindre `N` en partant de `0`) se pense souvent mieux à partir de `N` : quelle a été la dernière opération ?
- **Trier les seuils.** Des questions « avec seulement les arêtes de poids au plus `S` » se traitent en ajoutant les arêtes par poids croissant, comme dans Kruskal.
- **Réduire les arêtes.** Une propriété de cycle, ou un raisonnement d'échange, montre souvent que seules quelques arêtes peuvent servir : entre voisins après un tri, ou vers le plus petit élément d'un groupe.

Enfin, on choisit l'algorithme d'après les poids : parcours en largeur si tout coûte 1, Dijkstra pour des coûts positifs ou nuls, Bellman-Ford s'il y a des coûts négatifs, Floyd-Warshall pour toutes les paires d'un petit graphe, Kruskal ou Prim pour un réseau de coût minimal.

## Prouver : une liste de contrôle

Une solution qui passe les exemples peut être fausse. Avant de soumettre, on se demande quel argument la justifie.

1. **Un invariant.** Pour une boucle : ce qui reste vrai à chaque tour (« les sommets traités ont leur vraie distance », « deux sommets ont la même racine exactement quand ils sont reliés »). On vérifie qu'il est vrai au départ, conservé par un tour, et qu'il donne la réponse à la fin.
2. **Un argument d'échange.** Pour un glouton : on part d'une solution optimale quelconque et on la modifie pas à pas vers celle du glouton sans l'aggraver. Souvent sous la forme « le `i`-ème choix du glouton est au moins aussi bon que le `i`-ème choix de n'importe quelle solution », prouvée par récurrence.
3. **La propriété de coupure ou de cycle.** Pour un arbre couvrant : l'arête la plus légère qui traverse une coupure est dans un arbre minimal ; l'arête la plus lourde d'un cycle peut être retirée.
4. **La monotonie.** Pour une dichotomie sur la réponse : si `D` convient, tout `D` plus facile convient aussi. Sans monotonie, la dichotomie donne n'importe quoi.
5. **La terminaison.** Une quantité entière qui diminue : un indice, la somme `P + Q` dans un algorithme d'Euclide, la valeur du sommet dans un graphe où les arcs vont vers des nombres plus petits.
6. **Le coût.** On recompte avec les valeurs maximales, sans oublier les coûts cachés : une recherche dans une liste, une copie, un tri dans une boucle.

## Les pièges du niveau

- **Les dépassements.** Une somme de 10⁵ longueurs de 10⁹, un produit de deux tailles de composantes, `K (K + 1) / 2` pour `K = 10⁹` : `long long` en C++. Avant de multiplier deux grands nombres, on compare plutôt avec une division (`a > limite / b`). L'« infini » doit dépasser toute vraie valeur sans déborder quand on l'additionne.
- **La profondeur de récursion.** Un parcours en profondeur récursif sur une chaîne de 10⁵ sommets, ou une recherche récursive dans Union-Find, provoque `RecursionError` en Python et peut faire planter un programme C++ : on écrit des versions itératives, avec une pile explicite ou des boucles.
- **Les indices.** Sommets numérotés de `1` à `N` : des tableaux de taille `N + 1`. Préfixes : la portion de `L` à `R` correspond aux préfixes `L − 1` et `R`.
- **Les cas dégénérés.** `N = 1`, un graphe sans arête, des boucles, des arêtes multiples, des valeurs égales, une réponse impossible (`-1`), le nombre `1` qui n'est pas premier.
- **Les bornes de dichotomie.** Quand on garde `bas = milieu` en cas de succès, le milieu se prend vers le haut, sinon la boucle ne s'arrête pas.
- **Les entrées périmées.** Dans Dijkstra et Prim avec suppression paresseuse, ignorer un sommet qui sort du tas déjà traité.

## Tester contre une solution naïve

La méthode du niveau 3 reste la meilleure arme : comparer le programme à une solution **naïve**, lente mais évidente, sur des centaines de petites entrées aléatoires. Au niveau 4, les solutions naïves sont souvent d'un autre type d'algorithme : Bellman-Ford ou Floyd-Warshall pour vérifier Dijkstra, l'essai de tous les sous-ensembles d'arêtes pour vérifier Kruskal, l'essai de toutes les valeurs pour vérifier une dichotomie, l'énumération complète pour vérifier un glouton.

```python
import heapq
import random

INFINI = 10 ** 18


def rapide(n, aretes):  # Dijkstra depuis le sommet 1
    voisins = [[] for _ in range(n + 1)]
    for a, b, l in aretes:
        voisins[a].append((b, l))
        voisins[b].append((a, l))
    dist = [INFINI] * (n + 1)
    dist[1] = 0
    tas = [(0, 1)]
    while tas:
        d, u = heapq.heappop(tas)
        if d > dist[u]:
            continue
        for v, l in voisins[u]:
            if d + l < dist[v]:
                dist[v] = d + l
                heapq.heappush(tas, (dist[v], v))
    return dist


def naif(n, aretes):  # Bellman-Ford, sans finesse : N tours complets
    dist = [INFINI] * (n + 1)
    dist[1] = 0
    for _ in range(n):
        for a, b, l in aretes:
            dist[b] = min(dist[b], dist[a] + l)
            dist[a] = min(dist[a], dist[b] + l)
    return dist


random.seed(1)
for essai in range(1000):
    n = random.randint(1, 6)
    aretes = [(random.randint(1, n), random.randint(1, n), random.randint(1, 9)) for _ in range(random.randint(0, 8))]
    if rapide(n, aretes) != naif(n, aretes):
        print("Différence :", n, aretes)
        break
else:
    print("1000 essais identiques")
```

```cpp
#include <algorithm>
#include <cstdlib>
#include <functional>
#include <iostream>
#include <queue>
#include <tuple>
#include <utility>
#include <vector>
using namespace std;

const long long INFINI = (long long)1e18;
typedef vector<tuple<int, int, long long>> Aretes;

vector<long long> rapide(int n, const Aretes& aretes) {  // Dijkstra depuis le sommet 1
    vector<vector<pair<int, long long>>> voisins(n + 1);
    for (auto [a, b, l] : aretes) {
        voisins[a].push_back({b, l});
        voisins[b].push_back({a, l});
    }
    vector<long long> dist(n + 1, INFINI);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> tas;
    dist[1] = 0;
    tas.push({0, 1});
    while (!tas.empty()) {
        auto [d, u] = tas.top();
        tas.pop();
        if (d > dist[u]) continue;
        for (auto [v, l] : voisins[u]) {
            if (d + l < dist[v]) {
                dist[v] = d + l;
                tas.push({dist[v], v});
            }
        }
    }
    return dist;
}

vector<long long> naif(int n, const Aretes& aretes) {  // Bellman-Ford, sans finesse : N tours complets
    vector<long long> dist(n + 1, INFINI);
    dist[1] = 0;
    for (int tour = 0; tour < n; tour++) {
        for (auto [a, b, l] : aretes) {
            dist[b] = min(dist[b], dist[a] + l);
            dist[a] = min(dist[a], dist[b] + l);
        }
    }
    return dist;
}

int main() {
    srand(1);
    for (int essai = 0; essai < 1000; essai++) {
        int n = 1 + rand() % 6;
        Aretes aretes(rand() % 9);
        for (auto& [a, b, l] : aretes) {
            a = 1 + rand() % n;
            b = 1 + rand() % n;
            l = 1 + rand() % 9;
        }
        if (rapide(n, aretes) != naif(n, aretes)) {
            cout << "Différence avec N = " << n << " :";
            for (auto [a, b, l] : aretes) cout << " (" << a << ", " << b << ", " << l << ")";
            cout << "\n";
            return 0;
        }
    }
    cout << "1000 essais identiques\n";
    return 0;
}
```

Le programme affiche `1000 essais identiques`. Si l'on oublie d'ajouter chaque arête dans les deux listes de voisins, il s'arrête dès qu'un exemple est fautif et affiche `Différence : 2 [(2, 1, 8)]` en Python : avec la seule arête `2 – 1`, Dijkstra ne trouve plus le sommet `2`. Une si petite entrée se déroule à la main en une minute.

Pour que le test soit utile, les entrées doivent rester **petites** (quelques sommets, de petits poids, des boucles et des arêtes multiples possibles) : les cas limites y apparaissent souvent. Et la solution naïve doit vraiment être différente : recopier le même algorithme ne détecte pas l'erreur de raisonnement.

## Un exemple complet

**Énoncé.** Un graphe non orienté a `N` sommets et `M` arêtes ; chaque arête a un poids. Pour chacune des `Q` questions `U V S`, afficher `OUI` si l'on peut aller de `U` à `V` en n'empruntant que des arêtes de poids au plus `S`, et `NON` sinon. `N`, `M` et `Q` vont jusqu'à 2 × 10⁵.

**Idée.** On part des contraintes : un parcours par question coûterait `Q × (N + M)`, soit 8 × 10¹⁰ opérations. Il faut donc partager le travail entre les questions. Une question ne dépend que des arêtes de poids au plus `S`, et quand `S` augmente, on ne fait qu'**ajouter** des arêtes : c'est la transformation « trier les seuils ». On lit toutes les questions avant de répondre (traitement **hors ligne**), on trie les arêtes par poids et les questions par seuil, puis on balaie les questions dans l'ordre : avant de répondre à une question de seuil `S`, on ajoute dans un Union-Find toutes les arêtes de poids au plus `S` qui ne le sont pas encore. La réponse est `OUI` exactement quand `U` et `V` ont la même racine. Chaque réponse est rangée à la place d'origine de sa question.

**Programme.**

```python
import sys

donnees = sys.stdin.read().split()
n, m, q = int(donnees[0]), int(donnees[1]), int(donnees[2])
pos = 3
aretes = []
for _ in range(m):
    a, b, w = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
    pos += 3
    aretes.append((w, a, b))
questions = []
for i in range(q):
    u, v, s = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
    pos += 3
    questions.append((s, u, v, i))  # i : place de la question dans l'entrée
aretes.sort()
questions.sort()

parent = list(range(n + 1))
taille = [1] * (n + 1)


def trouver(x):
    racine = x
    while parent[racine] != racine:
        racine = parent[racine]
    while parent[x] != racine:
        parent[x], x = racine, parent[x]
    return racine


reponses = [""] * q
k = 0  # nombre d'arêtes déjà ajoutées
for s, u, v, i in questions:  # par seuil croissant
    while k < m and aretes[k][0] <= s:  # on ajoute les arêtes de poids au plus s
        w, a, b = aretes[k]
        ra, rb = trouver(a), trouver(b)
        if ra != rb:
            if taille[ra] < taille[rb]:
                ra, rb = rb, ra
            parent[rb] = ra
            taille[ra] += taille[rb]
        k += 1
    reponses[i] = "OUI" if trouver(u) == trouver(v) else "NON"
print("\n".join(reponses))
```

```cpp
#include <algorithm>
#include <iostream>
#include <numeric>
#include <string>
#include <tuple>
#include <vector>
using namespace std;

vector<int> parent, taille;

int trouver(int x) {
    int racine = x;
    while (parent[racine] != racine) racine = parent[racine];
    while (parent[x] != racine) {
        int suivant = parent[x];
        parent[x] = racine;
        x = suivant;
    }
    return racine;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, q;
    cin >> n >> m >> q;
    vector<tuple<int, int, int>> aretes(m);  // (poids, a, b)
    for (auto& [w, a, b] : aretes) cin >> a >> b >> w;
    vector<tuple<int, int, int, int>> questions(q);  // (seuil, u, v, place dans l'entrée)
    for (int i = 0; i < q; i++) {
        auto& [s, u, v, place] = questions[i];
        cin >> u >> v >> s;
        place = i;
    }
    sort(aretes.begin(), aretes.end());
    sort(questions.begin(), questions.end());
    parent.resize(n + 1);
    iota(parent.begin(), parent.end(), 0);
    taille.assign(n + 1, 1);

    vector<string> reponses(q);
    int k = 0;  // nombre d'arêtes déjà ajoutées
    for (auto [s, u, v, place] : questions) {  // par seuil croissant
        while (k < m && get<0>(aretes[k]) <= s) {  // on ajoute les arêtes de poids au plus s
            auto [w, a, b] = aretes[k];
            int ra = trouver(a), rb = trouver(b);
            if (ra != rb) {
                if (taille[ra] < taille[rb]) swap(ra, rb);
                parent[rb] = ra;
                taille[ra] += taille[rb];
            }
            k++;
        }
        reponses[place] = (trouver(u) == trouver(v) ? "OUI" : "NON");
    }
    for (const string& r : reponses) cout << r << "\n";
    return 0;
}
```

**Vérification à la main.** Avec l'entrée

```text
5 4 4
1 2 3
2 3 5
3 4 2
4 5 8
1 3 4
1 3 5
3 5 7
4 4 1
```

les questions sont traitées dans l'ordre des seuils 1, 4, 5, 7. Au seuil 1, aucune arête n'est ajoutée, mais `4` est relié à lui-même : `OUI`. Au seuil 4, on ajoute `3 – 4` (2) et `1 – 2` (3) : `1` et `3` restent séparés, `NON`. Au seuil 5, on ajoute `2 – 3` : `1 – 2 – 3` les relie, `OUI`. Au seuil 7, rien de neuf, et `5` n'est atteint que par l'arête de poids 8 : `NON`. Remises dans l'ordre de l'entrée, les réponses sont `NON`, `OUI`, `NON`, `OUI`, ce que le programme affiche.

**Pourquoi c'est juste.** Invariant : au moment de répondre à une question de seuil `S`, l'Union-Find contient exactement les arêtes de poids au plus `S`. En effet, les arêtes ajoutées sont prises dans l'ordre croissant des poids, et la boucle `while` s'arrête à la première de poids plus grand que `S` ; comme les seuils sont croissants, aucune arête ajoutée pour une question précédente ne dépasse `S`. Par l'invariant de la connexité dynamique, `U` et `V` ont la même racine exactement quand un chemin d'arêtes de poids au plus `S` les relie.

**Coût.** Les deux tris coûtent O(M log M + Q log Q), puis chaque arête est ajoutée une fois et chaque question fait deux recherches : `M + 2Q` opérations Union-Find en temps quasi constant. Pour se convaincre du programme, on le compare à la solution naïve (un parcours en largeur par question, restreint aux arêtes de poids au plus `S`) sur des centaines de petites entrées. Répondre aux questions dans l'ordre de l'entrée, sans les trier, obligerait à retirer des arêtes quand le seuil baisse : c'est le tri hors ligne qui transforme le problème en une suite d'ajouts.

## À retenir

- On lit d'abord les contraintes : elles indiquent la complexité visée, et donc la famille d'outils.
- « Plus grand minimum » ou « plus petit maximum » : dichotomie sur la réponse, avec un test oui/non monotone, souvent glouton ou de type plus court chemin.
- Modéliser, c'est choisir les sommets (lieux, nombres, restes, états, sommets auxiliaires) et vérifier la correspondance entre solutions et chemins dans les deux sens.
- Chaque solution s'appuie sur un argument nommé : invariant, échange, coupure ou cycle, monotonie, terminaison, et un compte d'opérations.
- Des questions qui dépendent d'un seuil, ou des suppressions connues à l'avance, se traitent hors ligne : on trie les seuils ou l'on remonte le temps pour n'avoir que des ajouts, que Union-Find gère.
- Les pièges reviennent : dépassements, récursion trop profonde, indices décalés, cas dégénérés. Un test contre une solution naïve sur de petites entrées les révèle presque tous.
