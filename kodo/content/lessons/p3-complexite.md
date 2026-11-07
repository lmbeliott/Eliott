Deux programmes peuvent donner la même réponse et ne pas avoir la même valeur. Pour compter les paires de valeurs égales dans une liste de 100 000 nombres, comparer chaque paire demande environ 5 milliards de comparaisons : plusieurs minutes en Python. Trier la liste, puis compter les blocs de valeurs égales, demande quelques millions d'opérations : une fraction de seconde. Sur un site d'exercices comme en concours, le premier programme reçoit le verdict « temps limite dépassé », même s'il est juste.

Ce chapitre apprend à **prévoir** le temps d'un programme avant de l'écrire : compter ses opérations, les résumer avec la notation O, comparer ce résultat aux contraintes de l'énoncé, et choisir en conséquence l'algorithme à programmer.

## Compter les opérations

On ne mesure pas le temps d'un programme en secondes, car il dépend de la machine et du langage. On compte plutôt ses **opérations élémentaires** : une affectation, une comparaison, une opération arithmétique, l'accès à une case d'une liste. Chacune prend un temps à peu près constant. Ce qui compte est la façon dont leur nombre grandit avec la taille n des données.

```python
n = 1000
t = [i % 7 for i in range(n)]
comparaisons = 0
paires = 0
for i in range(n):
    for j in range(i + 1, n):
        comparaisons = comparaisons + 1
        if t[i] == t[j]:
            paires = paires + 1
print(comparaisons, paires)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n = 1000;
    vector<int> t(n);
    for (int i = 0; i < n; i++) t[i] = i % 7;
    long long comparaisons = 0, paires = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            comparaisons++;
            if (t[i] == t[j]) paires++;
        }
    }
    cout << comparaisons << " " << paires << "\n";
    return 0;
}
```

Le programme affiche `499500 70929`. Pour i fixé, la boucle intérieure fait n − 1 − i tours ; le total vaut (n − 1) + (n − 2) + … + 1 + 0 = n(n − 1)/2. Si n est multiplié par 10, ce nombre est multiplié par 100 environ. C'est cette **croissance** qu'on cherche à décrire.

## La notation O

Le nombre exact d'opérations est souvent compliqué, et dépend de détails sans importance (une affectation de plus ou de moins). On le résume par son ordre de grandeur.

**Définition.** Soient f et g deux fonctions de l'entier n, à valeurs positives. On dit que f(n) est un **O de g(n)**, et on écrit f(n) = O(g(n)), s'il existe une constante c > 0 et un entier n₀ tels que f(n) ≤ c × g(n) pour tout n ≥ n₀. Autrement dit, à partir d'une certaine taille, f ne grandit pas plus vite que g, à un facteur constant près.

Quelques exemples :

- 3n + 5 = O(n) : pour n ≥ 5, 3n + 5 ≤ 3n + n = 4n. On prend c = 4 et n₀ = 5.
- n(n − 1)/2 = O(n²) : pour tout n ≥ 1, n(n − 1)/2 ≤ n²/2. On prend c = 1/2.
- 2n² + 100n + 7 = O(n²) : pour n ≥ 100, 100n ≤ n² et 7 ≤ n², donc le tout est au plus 4n².
- 1 000 = O(1) : une quantité bornée par une constante est un O(1).

En pratique, on garde le terme qui grandit le plus vite et on oublie les constantes multiplicatives. On dit d'un algorithme qu'il est **en O(n²)**, ou qu'il a une **complexité** en O(n²), si son nombre d'opérations est un O(n²). La notation donne une borne supérieure : il est vrai que n = O(n²), mais c'est imprécis ; on cherche toujours la borne la plus petite possible.

Deux règles suffisent la plupart du temps. Des étapes **à la suite** s'additionnent, et la plus coûteuse l'emporte : O(n) puis O(n²) donne O(n²). Des boucles **imbriquées** se multiplient : n tours contenant chacun un travail en O(n) donnent O(n²).

## Les classes courantes

| Complexité | Nom | Exemple |
| --- | --- | --- |
| O(1) | constante | formule n(n + 1)/2, accès à `t[i]` |
| O(log n) | logarithmique | nombre de chiffres de n, algorithme d'Euclide |
| O(n) | linéaire | somme, maximum, sommes préfixes |
| O(n log n) | quasi linéaire | trier une liste |
| O(n²) | quadratique | examiner toutes les paires, tris simples |
| O(2^n) | exponentielle | examiner tous les sous-ensembles |

Le **logarithme** mérite une explication. log₂(n) est, à peu près, le nombre de fois qu'on peut diviser n par 2 avant d'atteindre 1. Il grandit extrêmement lentement : log₂(1 000) ≈ 10, log₂(10⁶) ≈ 20, log₂(10¹⁸) ≈ 60. Une boucle qui divise sa variable par 2 (ou par 10) à chaque tour est en O(log n). La base du logarithme ne compte pas dans un O, car on passe d'une base à l'autre en multipliant par une constante.

```python
n = 1000000
etapes = 0
while n > 1:
    n = n // 2
    etapes = etapes + 1
print(etapes)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    long long n = 1000000;
    int etapes = 0;
    while (n > 1) {
        n = n / 2;
        etapes++;
    }
    cout << etapes << "\n";
    return 0;
}
```

Le programme affiche `19`, car 2¹⁹ = 524 288 ≤ 10⁶ < 2²⁰.

Le tri prédéfini (`sort` en Python et en C++) est en O(n log n). Les tris simples, par sélection ou par insertion, sont en O(n²) ; la différence se voit vite : pour n = 10⁵, n log₂ n ≈ 1,7 × 10⁶, alors que n² = 10¹⁰.

## Estimer le temps d'exécution

Pour passer d'un nombre d'opérations à un temps, on retient un ordre de grandeur : un programme C++ fait de l'ordre de **10⁸ opérations simples par seconde** (entre 10⁷ et 10⁹ selon les opérations), et Python **environ 10⁷**, soit 10 à 50 fois moins. Python exécuté dans un navigateur est encore 2 à 3 fois plus lent. On en déduit la taille maximale de données traitable en une seconde environ :

| Complexité | n maximal en C++ | n maximal en Python |
| --- | --- | --- |
| O(log n) ou O(1) | sans limite pratique | sans limite pratique |
| O(n) | 10⁸ | 10⁷ |
| O(n log n) | 5 × 10⁶ | 5 × 10⁵ |
| O(n²) | 10⁴ | 3 × 10³ |
| O(n³) | 500 | 200 |
| O(2^n) | 25 | 20 |
| O(n!) | 11 | 9 |

Ce tableau se lit aussi dans l'autre sens, et c'est le plus utile : **les contraintes de l'énoncé indiquent la complexité attendue**. Si N ≤ 20, une exploration de tous les sous-ensembles est probablement la solution. Si N ≤ 2 000, un algorithme en O(N²) passe. Si N ≤ 200 000, il faut du O(N log N) ou du O(N). Si N ≤ 10¹², il faut un O(√N), un O(log N), ou une formule. Avant d'écrire une ligne, on estime le nombre d'opérations de l'idée qu'on a, en remplaçant N par sa valeur maximale.

## Pire cas et cas moyen

Le nombre d'opérations dépend parfois des données elles-mêmes, pas seulement de leur taille. Chercher une valeur dans une liste en la parcourant s'arrête dès qu'on la trouve : une seule comparaison si elle est en tête (le **meilleur cas**), n si elle est absente (le **pire cas**), et environ n/2 en moyenne si elle est présente à une position quelconque (le **cas moyen**). Le tri par insertion fait environ n²/2 décalages sur une liste triée à l'envers, mais aucun sur une liste déjà triée.

Sauf mention contraire, la complexité d'un algorithme désigne son **pire cas**. C'est la seule garantie utile : les tests d'un exercice contiennent toujours les données les plus défavorables, construites exprès. Une exception notable : le test `x in ensemble` (et l'accès à un dictionnaire) est en O(1) **en moyenne**, grâce au hachage, alors que `x in liste` est en O(n). C'est pourquoi remplacer une liste par un ensemble change souvent tout.

## Coût amorti

Une boucle à l'intérieur d'une autre n'est pas toujours en O(n²). Voici la recherche de la plus longue portion de somme au plus S dans une liste de nombres positifs, par la méthode de la fenêtre glissante :

```python
t = [2, 1, 3, 2, 4, 1, 1, 1]
S = 6
gauche = 0
somme = 0
meilleur = 0
deplacements = 0
for droite in range(len(t)):
    somme = somme + t[droite]
    while somme > S:
        somme = somme - t[gauche]
        gauche = gauche + 1
        deplacements = deplacements + 1
    meilleur = max(meilleur, droite - gauche + 1)
print(meilleur, deplacements)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> t = {2, 1, 3, 2, 4, 1, 1, 1};
    int S = 6;
    int gauche = 0, somme = 0, meilleur = 0, deplacements = 0;
    for (int droite = 0; droite < (int)t.size(); droite++) {
        somme += t[droite];
        while (somme > S) {
            somme -= t[gauche];
            gauche++;
            deplacements++;
        }
        meilleur = max(meilleur, droite - gauche + 1);
    }
    cout << meilleur << " " << deplacements << "\n";
    return 0;
}
```

Le programme affiche `3 5`. Un tour de la boucle `while` peut avancer `gauche` de plusieurs cases, mais `gauche` ne recule jamais et ne dépasse pas n : sur **toute** l'exécution, la boucle intérieure fait au plus n tours en tout. Le programme est en O(n). On parle de **coût amorti** : une étape isolée peut être chère, mais le total, réparti sur les n étapes, reste petit. Le même raisonnement s'applique à une pile où chaque élément est empilé une fois et dépilé au plus une fois, ou à `append` sur une liste Python, qui recopie parfois toute la liste pour l'agrandir mais dont le coût amorti reste O(1) par ajout : sur une suite de n ajouts, le total des recopies est O(n).

## Les erreurs fréquentes

**Le temps limite dépassé.** Le verdict « temps limite dépassé » (en anglais *Time Limit Exceeded*, TLE) ne signale pas une erreur de programmation : le programme est trop lent sur les plus grands tests. Il ne sert à rien d'accélérer quelques lignes ; il faut changer d'algorithme, après avoir recalculé le nombre d'opérations avec les valeurs maximales.

**Les coûts cachés.** Certaines instructions d'une ligne cachent une boucle. En Python : `x in liste`, `liste.index(x)`, `liste.count(x)`, `min(liste)`, `sum(liste)`, une tranche `t[a:b]`, `liste.insert(0, x)` et `liste.pop(0)` coûtent O(n). Écrites dans une boucle de n tours, elles donnent du O(n²). En C++, passer un `vector` à une fonction sans `&` le copie entièrement à chaque appel. Pour une file, on utilise `deque`, et pour des tests d'appartenance, un ensemble.

**Les entrées lentes.** Lire 10⁵ lignes avec `input()` reste correct, mais pour plusieurs centaines de milliers de nombres, `sys.stdin.read().split()` est nettement plus rapide. En C++, on ajoute `ios::sync_with_stdio(false);` et `cin.tie(nullptr);` au début du `main`.

**Oublier les dépassements.** Un algorithme rapide manipule souvent de grands totaux : compter des paires parmi 10⁵ éléments donne jusqu'à 5 × 10⁹, au-delà de la limite d'un `int` (environ 2,1 × 10⁹). En C++, le résultat devient faux sans aucun message. On utilise `long long`.

## Exemple complet : la somme des sommes de diviseurs

**Énoncé.** On note σ(m) la somme de tous les diviseurs de m ; par exemple σ(6) = 1 + 2 + 3 + 6 = 12. Le programme lit N (1 ≤ N ≤ 10⁶) et affiche σ(1) + σ(2) + … + σ(N).

**Première idée : chaque nombre séparément.** Pour chaque m, on cherche ses diviseurs en essayant les d jusqu'à √m, en ajoutant d et m/d quand d divise m (une seule fois si d × d = m). C'est O(√m) par nombre, donc O(N√N) en tout : environ 10⁹ opérations pour N = 10⁶. Trop lent, même en C++.

**Deuxième idée : partir des diviseurs.** Plutôt que de chercher les diviseurs de chaque nombre, on part de chaque d et on l'ajoute à tous ses multiples : `s[d] += d`, `s[2d] += d`, `s[3d] += d`… Pour un d donné, il y a ⌊N/d⌋ multiples, donc le nombre total d'additions vaut N/1 + N/2 + … + N/N = N × (1 + 1/2 + … + 1/N). La somme H(N) = 1 + 1/2 + … + 1/N s'appelle la **série harmonique**. On la majore en regroupant ses termes par paquets : 1/2 + 1/3 ≤ 2 × 1/2 = 1, puis 1/4 + 1/5 + 1/6 + 1/7 ≤ 4 × 1/4 = 1, puis les huit termes de 1/8 à 1/15, au plus 1/8 chacun, etc. Chaque paquet vaut au plus 1, et il y a au plus log₂(N) paquets après le premier terme : H(N) ≤ 1 + log₂(N). Plus précisément, H(N) est proche de ln(N) + 0,58, soit environ 14,4 pour N = 10⁶. Cette méthode coûte donc O(N log N), soit 1,4 × 10⁷ additions : très bien en C++, mais plusieurs secondes en Python.

**Troisième idée : échanger l'ordre de la somme.** On n'a pas besoin de chaque σ(m), seulement de leur total. Or la deuxième idée montre que le diviseur d est ajouté exactement ⌊N/d⌋ fois. La réponse vaut donc d × ⌊N/d⌋, sommé pour d de 1 à N : une seule boucle, en O(N).

```python
n = int(input())
total = 0
for d in range(1, n + 1):
    total = total + d * (n // d)    # d divise exactement n // d entiers entre 1 et n
print(total)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    long long total = 0;
    for (long long d = 1; d <= n; d++) {
        total += d * (n / d);    // d divise exactement n / d entiers entre 1 et n
    }
    cout << total << "\n";
    return 0;
}
```

**Vérification à la main.** Pour N = 4 : σ(1) + σ(2) + σ(3) + σ(4) = 1 + 3 + 4 + 7 = 15. La formule donne 1 × 4 + 2 × 2 + 3 × 1 + 4 × 1 = 4 + 4 + 3 + 4 = 15. Avec l'entrée `1000000`, le programme affiche `822468118437`.

**Correction.** Le total σ(1) + … + σ(N) est la somme de d, sur tous les couples (d, m) tels que d divise m et 1 ≤ m ≤ N. En regroupant ces couples par d au lieu de les regrouper par m, on compte, pour chaque d, ses multiples entre 1 et N : il y en a ⌊N/d⌋. Les deux regroupements additionnent les mêmes termes, donc donnent le même total.

**Complexité.** N tours de boucle, O(N) : 10⁶ tours, instantané en C++ et rapide en Python. Le total dépasse 2³¹ dès N ≈ 51 000 : `long long` en C++. On est passé de O(N√N) à O(N log N), puis à O(N), sans rien changer au problème, seulement à la manière de compter. C'est la démarche de tout le chapitre : estimer le coût d'une idée avec les contraintes, et chercher une meilleure façon de compter tant qu'il est trop élevé.

**Et si N valait 10¹² ?** Même O(N) serait trop lent. Une dernière remarque sert souvent dans ce genre de somme : si d × q ≤ N, le plus petit des deux nombres d et q est au plus √N, sinon leur produit dépasserait N. En séparant les termes selon que d ou q est petit, on obtient des boucles de √N tours seulement, soit 10⁶ pour N = 10¹². Ce **découpage autour de √N** revient dans les exercices.

## À retenir

- On mesure l'efficacité d'un algorithme par le nombre d'opérations élémentaires en fonction de la taille n des données, dans le **pire cas**.
- f(n) = O(g(n)) s'il existe c > 0 et n₀ tels que f(n) ≤ c × g(n) pour n ≥ n₀ : on garde le terme dominant et on oublie les constantes. Étapes successives : on garde la plus coûteuse ; boucles imbriquées : on multiplie.
- Classes courantes, de la plus rapide à la plus lente : O(1), O(log n), O(n), O(n log n), O(n²), O(2^n).
- Ordre de grandeur : 10⁸ opérations simples par seconde en C++, 10⁷ en Python. Les contraintes de l'énoncé indiquent la complexité attendue : N ≤ 20 pour O(2^N), N ≤ 10⁴ pour O(N²), N ≤ 10⁶ pour O(N log N).
- Une boucle intérieure n'est pas forcément un facteur n : si un indice ne fait qu'avancer, le coût **amorti** est linéaire.
- Pour accélérer, on change de façon de compter : partir de chaque diviseur pour atteindre ses multiples, compter la contribution de chaque élément, échanger l'ordre d'une somme ; parcourir les multiples de chaque d coûte O(N log N) (série harmonique), et le découpage autour de √N donne O(√N).
