Le niveau 3 a fait passer de la programmation à l'algorithmique. Les outils sont nombreux : chaînes et tableaux avancés, invariants, tris, piles et files, sommes préfixes et deux pointeurs, récursivité, et surtout l'estimation du temps d'exécution. Dans un problème de synthèse, aucun titre de chapitre n'indique l'outil à utiliser. Ce chapitre rassemble les réflexes qui permettent de le trouver, puis de rendre un programme juste et assez rapide.

## Partir des contraintes

La première ligne à lire dans un énoncé est celle des contraintes. Elle indique la complexité visée, en comptant de l'ordre de 10⁸ opérations simples par seconde en C++ et 10⁷ en Python.

| Taille des données | Complexité visée | Outils typiques du niveau |
| --- | --- | --- |
| N ≤ 10 | O(N!) | toutes les permutations (récursivité) |
| N ≤ 20 | O(2^N) | tous les sous-ensembles (récursivité) |
| N ≤ 2 000 | O(N²) | toutes les paires, tris simples |
| N ≤ 2 × 10⁵ | O(N log N) ou O(N) | tri, deux pointeurs, sommes préfixes, piles, tableaux de fréquences |
| valeurs ≤ 10⁶ | O(M log M) | parcours des multiples (série harmonique) |
| N ≤ 10¹² | O(√N) | découpage autour de √N |
| N ≤ 10¹⁸ | O(log N) ou O(1) | formule, récurrence qui divise N, chiffre par chiffre |

Le tableau se lit dans les deux sens. Si l'idée qu'on a est en O(N²) et que N vaut 10⁵, il est inutile de la programmer : il faut chercher autre chose. À l'inverse, N ≤ 15 suggère presque toujours une exploration exhaustive.

Quand l'idée directe est trop lente, quelques questions reviennent sans cesse :

- **L'ordre compte-t-il ?** Si la réponse ne dépend pas de l'ordre des éléments (compter des paires, des triangles), on trie, puis on balaie avec deux pointeurs.
- **Que se passe-t-il pour une portion ?** Une somme sur une portion est une différence de deux sommes préfixes ; une condition qui reste vraie quand on raccourcit la portion se traite avec une fenêtre glissante.
- **Peut-on compter les contributions ?** Plutôt que d'énumérer les objets, on compte combien de fois chaque élément participe au total (chaque nombre dans les sous-ensembles, chaque minimum dans les portions).
- **Peut-on échanger le point de vue ?** Partir des diviseurs pour atteindre leurs multiples, compter roue par roue plutôt que pas à pas, compter position par position.
- **Reste-t-il peu de cas ?** Les nombres de la forme 2ᵃ × 3ᵇ jusqu'à 10¹⁸ ne sont qu'un millier : on peut tous les fabriquer.

## Vérifier qu'un algorithme est juste

Un programme qui passe les exemples peut être faux. Avant de soumettre, on vérifie trois points, comme au chapitre sur la correction.

1. **Un invariant.** Pour chaque boucle importante, on formule ce qui reste vrai à chaque tour : « toutes les paires qui ne sont pas entièrement dans [g, d] ont été comptées », « la pile contient des hauteurs croissantes ». On vérifie qu'il est vrai au départ, qu'un tour le conserve, et qu'à la fin il donne la réponse.
2. **Une récurrence.** Pour une fonction récursive, on vérifie le cas de base, puis le cas récursif en supposant les appels plus petits justes.
3. **La terminaison.** Une quantité entière diminue strictement à chaque tour ou à chaque appel : un indice qui avance, un N qui est divisé par deux.

Viennent ensuite les **cas limites**, la source principale des erreurs à ce niveau :

- un seul élément, ou aucune paire possible : la réponse est souvent 0 ;
- tous les éléments égaux, ou des doublons là où l'on imaginait des valeurs distinctes ;
- la plus grande valeur permise, qui fait dépasser 2³¹ en C++ (un nombre de paires, une somme de produits) ;
- un bouclage : le dernier et le premier élément d'un cercle sont voisins ;
- une profondeur de récursion de plusieurs milliers d'appels, qui demande `sys.setrecursionlimit` en Python ;
- un reste négatif en C++ après une soustraction modulo m.

## Tester contre une solution naïve

La meilleure façon de trouver une erreur est de comparer le programme à une **solution naïve** : lente, mais si simple qu'elle est sûrement juste. On les fait tourner toutes les deux sur des centaines de petites entrées aléatoires, et on s'arrête à la première différence. Voici ce test pour le comptage des paires de somme au plus S, par tri et deux pointeurs :

```python
import random

def naif(a, s):
    n = len(a)
    return sum(1 for i in range(n) for j in range(i + 1, n) if a[i] + a[j] <= s)

def rapide(a, s):
    a = sorted(a)
    g, d, total = 0, len(a) - 1, 0
    while g < d:
        if a[g] + a[d] <= s:
            total = total + (d - g)
            g = g + 1
        else:
            d = d - 1
    return total

random.seed(1)
for essai in range(1000):
    a = [random.randint(0, 10) for _ in range(random.randint(1, 8))]
    s = random.randint(0, 20)
    if naif(a, s) != rapide(a, s):
        print("Différence :", a, s, naif(a, s), rapide(a, s))
        break
else:
    print("1000 essais identiques")
```

```cpp
#include <algorithm>
#include <cstdlib>
#include <iostream>
#include <vector>
using namespace std;

long long naif(const vector<int> &a, int s) {
    long long total = 0;
    for (int i = 0; i < (int)a.size(); i++)
        for (int j = i + 1; j < (int)a.size(); j++)
            if (a[i] + a[j] <= s) total++;
    return total;
}

long long rapide(vector<int> a, int s) {
    sort(a.begin(), a.end());
    int g = 0, d = a.size() - 1;
    long long total = 0;
    while (g < d) {
        if (a[g] + a[d] <= s) {
            total += d - g;
            g++;
        } else {
            d--;
        }
    }
    return total;
}

int main() {
    srand(1);
    for (int essai = 0; essai < 1000; essai++) {
        vector<int> a(1 + rand() % 8);
        for (int &x : a) x = rand() % 11;
        int s = rand() % 21;
        if (naif(a, s) != rapide(a, s)) {
            cout << "Différence :";
            for (int x : a) cout << " " << x;
            cout << " / S = " << s << "\n";
            return 0;
        }
    }
    cout << "1000 essais identiques\n";
    return 0;
}
```

Le programme affiche `1000 essais identiques`. Si l'on remplace `total + (d - g)` par `total + (d - g + 1)`, il s'arrête dès le premier essai concerné et affiche une petite entrée fautive, facile à dérouler à la main. Les entrées doivent rester **petites** (quelques éléments, de petites valeurs) : les doublons et les cas limites y apparaissent souvent, et une différence se comprend vite.

## Déboguer un temps limite dépassé

Le verdict « temps limite dépassé » appelle une démarche précise :

1. **Recompter** les opérations avec les valeurs maximales de l'énoncé, en n'oubliant pas les coûts cachés : `x in liste`, `liste.pop(0)`, une tranche `t[a:b]`, un `sum` ou un `min` dans une boucle, une chaîne reconstruite à chaque tour.
2. **Mesurer** sur une entrée de taille maximale, fabriquée par un petit programme : une liste de 2 × 10⁵ nombres aléatoires, mais aussi des cas défavorables (tout égal, déjà trié, trié à l'envers).
3. **Changer d'algorithme** si le compte dépasse nettement la limite. Les petites optimisations (lecture rapide avec `sys.stdin`, `ios::sync_with_stdio(false)`) gagnent un facteur 2 ou 3, jamais un facteur 1 000.
4. **Vérifier la récursion** : une fonction récursive sans mémoïsation qui recalcule les mêmes valeurs explose, et une récursion trop profonde provoque `RecursionError` ou `Segmentation fault` au lieu d'un temps dépassé.

## Exemple complet : la somme des minimums

**Énoncé.** Le programme lit N (1 ≤ N ≤ 2 × 10⁵), puis N entiers a₀, …, a_{N−1} compris entre 1 et 10⁶. Il affiche la somme des minimums de toutes les portions a_l, …, a_r, pour 0 ≤ l ≤ r < N. Avec `3 1 2 1`, les quatre portions d'un élément ont pour minimums 3, 1, 2 et 1, et les six autres ont toutes pour minimum 1 : la réponse est 13.

**Partir des contraintes.** Il y a N(N + 1)/2 portions, soit 2 × 10¹⁰ pour N = 2 × 10⁵. Les parcourir toutes, même en tenant à jour le minimum quand la portion s'allonge, coûte O(N²) : trop lent dans les deux langages. Il faut du O(N) ou du O(N log N). Trier ne sert à rien, puisque l'ordre des éléments compte ; restent les piles et le comptage des contributions. La réponse peut atteindre 2 × 10¹⁰ × 10⁶ = 2 × 10¹⁶ : `long long` en C++.

**L'idée : compter des contributions.** Au lieu de calculer le minimum de chaque portion, on cherche, pour chaque position i, le nombre de portions dont a_i est le minimum. Les valeurs égales demandent une règle précise : dans la portion `1 2 1`, le minimum est atteint deux fois, et la portion ne doit compter qu'une fois. On l'attribue à la position **la plus à gauche** de son minimum. La portion [l, r] est alors attribuée à i exactement quand l ≤ i ≤ r, que a_l, …, a_{i−1} sont **strictement** plus grands que a_i, et que a_{i+1}, …, a_r sont **au moins** égaux à a_i. Notons g(i) la dernière position avant i de valeur ≤ a_i (−1 s'il n'y en a pas), et d(i) la première position après i de valeur < a_i (N s'il n'y en a pas). Les portions attribuées à i sont celles avec g(i) < l ≤ i et i ≤ r < d(i) : il y en a (i − g(i)) × (d(i) − i). La réponse est donc la somme des a_i × (i − g(i)) × (d(i) − i). Sur l'exemple : 3 × 1 × 1 + 1 × 2 × 3 + 2 × 1 × 1 + 1 × 2 × 1 = 13.

**Calculer g et d.** C'est la pile monotone du chapitre « Piles et files ». Pour g, on parcourt les positions de gauche à droite ; avant d'empiler i, on dépile tant que le sommet a une valeur > a_i, et le sommet restant, s'il existe, est g(i). Pour d, on fait de même de droite à gauche, en dépilant tant que le sommet a une valeur ≥ a_i.

```python
import sys

donnees = sys.stdin.read().split()
n = int(donnees[0])
a = [int(x) for x in donnees[1:n + 1]]

# g[i] = dernière position avant i de valeur <= a[i] (-1 s'il n'y en a pas)
g = [-1] * n
pile = []
for i in range(n):
    while pile and a[pile[-1]] > a[i]:
        pile.pop()
    if pile:
        g[i] = pile[-1]
    pile.append(i)

# d[i] = première position après i de valeur < a[i] (n s'il n'y en a pas)
d = [n] * n
pile = []
for i in range(n - 1, -1, -1):
    while pile and a[pile[-1]] >= a[i]:
        pile.pop()
    if pile:
        d[i] = pile[-1]
    pile.append(i)

total = 0
for i in range(n):
    total = total + a[i] * (i - g[i]) * (d[i] - i)
print(total)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    // g[i] = dernière position avant i de valeur <= a[i] (-1 s'il n'y en a pas)
    vector<int> g(n, -1), pile_g;
    for (int i = 0; i < n; i++) {
        while (!pile_g.empty() && a[pile_g.back()] > a[i]) {
            pile_g.pop_back();
        }
        if (!pile_g.empty()) {
            g[i] = pile_g.back();
        }
        pile_g.push_back(i);
    }

    // d[i] = première position après i de valeur < a[i] (n s'il n'y en a pas)
    vector<int> d(n, n), pile_d;
    for (int i = n - 1; i >= 0; i--) {
        while (!pile_d.empty() && a[pile_d.back()] >= a[i]) {
            pile_d.pop_back();
        }
        if (!pile_d.empty()) {
            d[i] = pile_d.back();
        }
        pile_d.push_back(i);
    }

    long long total = 0;
    for (int i = 0; i < n; i++) {
        total += a[i] * (i - g[i]) * (d[i] - i);
    }
    cout << total << "\n";
    return 0;
}
```

**Correction.** Chaque portion a une seule position la plus à gauche de son minimum : elle est comptée une fois, avec la bonne valeur. Reste à vérifier que les piles donnent g et d. Soit j la dernière position avant i de valeur ≤ a_i. Une position p n'est dépilée que par une position k > p de valeur a_k < a_p ; si j avait été dépilée avant i, ce serait par un k entre j et i avec a_k < a_j ≤ a_i, ce qui contredit le choix de j. Donc j est dans la pile quand on traite i. Les positions empilées au-dessus de j sont entre j et i, donc de valeur > a_i : elles sont dépilées, puis la boucle s'arrête sur j. S'il n'y a pas de tel j, la pile se vide et g(i) = −1. Le raisonnement est le même pour d.

**Coût.** Dans chaque parcours, chaque position est empilée une fois et dépilée au plus une fois : O(N) en coût amorti, environ un million d'opérations au lieu de 2 × 10¹⁰.

**Tester contre la solution naïve.** La solution en O(N²) tient en quelques lignes :

```python
def naif(a):
    total = 0
    for i in range(len(a)):
        m = a[i]                     # minimum de a[i..j]
        for j in range(i, len(a)):
            m = min(m, a[j])
            total = total + m
    return total
```

```cpp
long long naif(const vector<long long> &a) {
    long long total = 0;
    for (int i = 0; i < (int)a.size(); i++) {
        long long m = a[i];          // minimum de a[i..j]
        for (int j = i; j < (int)a.size(); j++) {
            m = min(m, a[j]);
            total += m;
        }
    }
    return total;
}
```

On place le calcul rapide dans une fonction `rapide(a)`, et on reprend la boucle de test de la section précédente, avec des listes de 1 à 8 valeurs entre 1 et 3 : les valeurs égales y sont fréquentes, et c'est là que se cachent les erreurs. Le programme ci-dessus passe les 1 000 essais. Si l'on écrit `>=` au lieu de `>` dans la première boucle, g(i) devient la dernière position de valeur **strictement** plus petite, et une portion dont le minimum apparaît deux fois est attribuée à ses deux positions. En Python, le test s'arrête dès le deuxième essai, sur la liste `2 2` : la solution naïve trouve 6 (2 + 2 + 2), la version fautive 8, car la portion entière est comptée deux fois. Une liste de deux éléments se déroule à la main, et l'erreur saute aux yeux.

## À retenir

- Les contraintes indiquent la complexité attendue : on estime le nombre d'opérations d'une idée avant de la programmer.
- Pour accélérer : trier, balayer avec deux pointeurs, utiliser des sommes préfixes, compter des contributions, changer de point de vue, parcourir les multiples.
- Un algorithme se justifie par un invariant, une récurrence et une quantité qui diminue ; un programme se vérifie sur les cas limites.
- Comparer le programme à une solution naïve sur de petites entrées aléatoires trouve la plupart des erreurs.
- Quand on compte des contributions, chaque objet doit être attribué à un seul élément : avec des valeurs égales, on fixe une règle (la position la plus à gauche, par exemple) et on la vérifie par un test aléatoire.
- Contre un temps dépassé, on recompte les opérations, coûts cachés compris, et on change d'algorithme plutôt que de grappiller.
