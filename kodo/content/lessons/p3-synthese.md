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
| N ≤ 10¹⁸ | O(log N) ou O(√N) | formule, récurrence qui divise N, découpage autour de √N |

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

## À retenir

- Les contraintes indiquent la complexité attendue : on estime le nombre d'opérations d'une idée avant de la programmer.
- Pour accélérer : trier, balayer avec deux pointeurs, utiliser des sommes préfixes, compter des contributions, changer de point de vue, parcourir les multiples.
- Un algorithme se justifie par un invariant, une récurrence et une quantité qui diminue ; un programme se vérifie sur les cas limites.
- Comparer le programme à une solution naïve sur de petites entrées aléatoires trouve la plupart des erreurs.
- Contre un temps dépassé, on recompte les opérations, coûts cachés compris, et on change d'algorithme plutôt que de grappiller.
