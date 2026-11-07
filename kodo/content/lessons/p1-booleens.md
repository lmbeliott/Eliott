Dans le chapitre précédent, chaque décision reposait sur une seule comparaison. Mais beaucoup de questions en combinent plusieurs. Une température est agréable si elle est au moins de 15 degrés **et** au plus de 25 degrés. Un jour est chômé si c'est un samedi **ou** un dimanche. Une case d'un plateau est libre si elle n'est **pas** occupée.

On pourrait écrire ces tests avec des `if` imbriqués, mais le programme deviendrait vite long et difficile à lire. Ce chapitre présente les **booléens**, les valeurs vrai et faux, et les trois opérateurs qui permettent de les combiner : `and`, `or` et `not`. Il montre aussi comment garder une réponse vrai/faux dans une variable pendant la lecture d'une suite de valeurs.

## Les booléens

Une comparaison comme `x < 5` a une valeur, comme un calcul. Cette valeur n'est pas un nombre : c'est soit **vrai**, soit **faux**. On appelle **booléen** une valeur qui ne peut être que vraie ou fausse. En Python, ces deux valeurs s'écrivent `True` et `False`, avec une majuscule. En C++, elles s'écrivent `true` et `false`, et le type des variables booléennes est `bool`.

On peut donc ranger le résultat d'une comparaison dans une variable, puis l'utiliser plus tard comme condition :

```python
n = int(input())
est_pair = n % 2 == 0
print(est_pair)
if est_pair:
    print("PAIR")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    bool est_pair = n % 2 == 0;
    cout << est_pair << "\n";
    if (est_pair) {
        cout << "PAIR\n";
    }
    return 0;
}
```

Avec l'entrée `8`, la comparaison `n % 2 == 0` est vraie : la variable `est_pair` vaut `True`. Le programme Python affiche `True` puis `PAIR`. Le programme C++ affiche `1` puis `PAIR`, car `cout` écrit un booléen sous la forme `1` (vrai) ou `0` (faux). Avec l'entrée `7`, il affiche seulement `False` (ou `0` en C++).

On remarque qu'on écrit `if est_pair:` et non `if est_pair == True:`. Les deux fonctionnent, mais la première forme est plus simple : la condition d'un `if` est déjà un booléen. Un nom de variable bien choisi, comme `est_pair` ou `deja_vu`, rend la condition lisible comme une phrase.

Dans les exercices, on n'affiche presque jamais `True` ou `False` directement : la sortie attendue est en général un mot comme `OUI` ou `NON`. On utilise alors le booléen dans un `if`.

## « Et » : `and`

L'opérateur `and` (« et » en anglais) combine deux conditions. Le résultat est vrai seulement si **les deux** conditions sont vraies. En C++, il s'écrit `&&`. Le tableau suivant, appelé **table de vérité**, donne toutes les possibilités :

| `a` | `b` | `a and b` |
| --- | --- | --- |
| vrai | vrai | vrai |
| vrai | faux | faux |
| faux | vrai | faux |
| faux | faux | faux |

L'usage le plus courant est de tester qu'un nombre est dans un **intervalle**, c'est-à-dire entre deux bornes :

```python
t = int(input())
if t >= 15 and t <= 25:
    print("AGREABLE")
else:
    print("NON")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int t;
    cin >> t;
    if (t >= 15 && t <= 25) {
        cout << "AGREABLE\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
```

Avec `20`, les deux comparaisons sont vraies : le programme affiche `AGREABLE`. Avec `30`, la première est vraie mais pas la seconde : il affiche `NON`. Avec `15`, la première est vraie (15 ≥ 15) et la seconde aussi : `AGREABLE`, car les bornes sont comprises.

Python accepte aussi l'écriture raccourcie `15 <= t <= 25`, qui a le même sens. Ce raccourci n'existe pas en C++, comme on le verra dans les erreurs fréquentes.

## « Ou » : `or`

L'opérateur `or` (« ou ») est vrai si **au moins une** des deux conditions est vraie. Il n'est faux que si les deux sont fausses. En C++, il s'écrit `||` (deux barres verticales).

| `a` | `b` | `a or b` |
| --- | --- | --- |
| vrai | vrai | vrai |
| vrai | faux | vrai |
| faux | vrai | vrai |
| faux | faux | faux |

Le « ou » de la programmation est **inclusif** : quand les deux conditions sont vraies, le résultat est vrai. Ce n'est pas le « ou » du menu « fromage ou dessert », qui interdit de prendre les deux.

```python
jour = int(input())
if jour == 6 or jour == 7:
    print("WEEK-END")
else:
    print("SEMAINE")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int jour;
    cin >> jour;
    if (jour == 6 || jour == 7) {
        cout << "WEEK-END\n";
    } else {
        cout << "SEMAINE\n";
    }
    return 0;
}
```

Les jours sont numérotés de 1 (lundi) à 7 (dimanche). Avec `6`, la première comparaison est vraie : `WEEK-END`. Avec `7`, c'est la seconde : `WEEK-END` aussi. Avec `3`, les deux sont fausses : `SEMAINE`.

## « Non » : `not`

L'opérateur `not` (« non ») s'applique à une seule condition et donne son contraire : `not a` est vrai quand `a` est faux, et faux quand `a` est vrai. En C++, il s'écrit `!`, placé devant la condition.

```python
n = int(input())
multiple_de_3 = n % 3 == 0
if not multiple_de_3:
    print("PAS MULTIPLE DE 3")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    bool multiple_de_3 = n % 3 == 0;
    if (!multiple_de_3) {
        cout << "PAS MULTIPLE DE 3\n";
    }
    return 0;
}
```

Avec `10`, la variable `multiple_de_3` vaut faux, donc `not multiple_de_3` est vrai : le programme affiche `PAS MULTIPLE DE 3`. Avec `9`, il n'affiche rien.

Sur une comparaison, `not` est rarement utile, car il existe toujours une comparaison contraire : `not (x < 5)` s'écrit plus simplement `x >= 5`, et `not (a == b)` s'écrit `a != b`. Il sert surtout devant une variable booléenne.

## Combiner plusieurs opérateurs

On peut combiner autant de conditions qu'on veut. Comme pour `*` et `+` en arithmétique, il existe des **priorités** : `not` s'applique en premier, puis `and`, puis `or`. Ainsi `a or b and c` se lit `a or (b and c)`. Pour éviter toute hésitation, on met des **parenthèses** dès qu'on mélange `and` et `or`.

L'exemple classique est la règle des années bissextiles : une année est bissextile si elle est divisible par 4 mais pas par 100, ou si elle est divisible par 400.

```python
a = int(input())
bissextile = (a % 4 == 0 and a % 100 != 0) or a % 400 == 0
if bissextile:
    print("OUI")
else:
    print("NON")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a;
    cin >> a;
    bool bissextile = (a % 4 == 0 && a % 100 != 0) || a % 400 == 0;
    if (bissextile) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
```

Pour 2024, la parenthèse est vraie (divisible par 4, pas par 100) : `OUI`. Pour 1900, la parenthèse est fausse (divisible par 100) et 1900 n'est pas divisible par 400 : `NON`. Pour 2000, la parenthèse est fausse, mais la seconde partie est vraie : `OUI`. Une seule ligne remplace la chaîne de quatre cas du chapitre précédent.

Deux règles, appelées **lois de De Morgan**, permettent de transformer la négation d'une combinaison :
- `not (a and b)` est équivalent à `(not a) or (not b)` ;
- `not (a or b)` est équivalent à `(not a) and (not b)`.

Par exemple, « `t` n'est pas entre 15 et 25 », c'est-à-dire `not (t >= 15 and t <= 25)`, s'écrit aussi `t < 15 or t > 25`. Le `and` devient un `or` en passant la négation à l'intérieur.

Il arrive qu'on veuille « l'un ou l'autre, mais pas les deux » : c'est le **ou exclusif**. Il n'a pas d'opérateur à lui dans ce chapitre, mais il s'écrit avec les trois autres : `(a or b) and not (a and b)`, « au moins un des deux, et pas les deux ». Il existe une écriture plus courte. Deux booléens dont exactement un est vrai sont deux booléens **différents** : on peut les comparer avec `!=`, exactement comme deux nombres. Le programme suivant lit deux entiers et affiche `OUI` si exactement un des deux est pair.

```python
a, b = map(int, input().split())
a_pair = a % 2 == 0
b_pair = b % 2 == 0
if a_pair != b_pair:
    print("OUI")
else:
    print("NON")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    bool a_pair = a % 2 == 0;
    bool b_pair = b % 2 == 0;
    if (a_pair != b_pair) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
```

Avec `3 8`, seul `b_pair` est vrai : les deux booléens sont différents, le programme affiche `OUI`. Avec `4 8`, les deux sont vrais, et avec `3 5`, les deux sont faux : dans les deux cas, ils sont égaux et le programme affiche `NON`.

Enfin, Python et C++ évaluent une combinaison de gauche à droite et s'arrêtent dès que le résultat est connu : c'est l'**évaluation en court-circuit**. Dans `a and b`, si `a` est faux, `b` n'est même pas calculé, puisque le résultat sera faux de toute façon. C'est utile pour se protéger : `d != 0 and n % d == 0` ne calcule jamais `n % 0`, qui provoquerait une erreur (`ZeroDivisionError` en Python, un arrêt brutal du programme en C++).

## Les drapeaux et les compteurs

Une variable booléenne peut servir de **drapeau** : elle retient une information pendant la lecture d'une suite de valeurs. Pour vérifier que **toutes** les valeurs ont une propriété, on part de `True`, et on passe le drapeau à `False` dès qu'une valeur ne l'a pas. Une fois baissé, le drapeau ne remonte jamais. Pour vérifier qu'**au moins une** valeur a la propriété, on fait l'inverse : on part de `False` et on passe à `True` dès qu'une valeur la vérifie.

Pour savoir **combien** de valeurs ont une propriété, on utilise un **compteur** : il part de 0, et on l'augmente de 1 à chaque valeur qui vérifie la condition. La condition peut être aussi complexe que nécessaire.

```python
n = int(input())
tous_positifs = True
dans_intervalle = 0
for i in range(n):
    x = int(input())
    if x < 0:
        tous_positifs = False
    if x >= 10 and x <= 20:
        dans_intervalle = dans_intervalle + 1
if tous_positifs:
    print("OUI")
else:
    print("NON")
print(dans_intervalle)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    bool tous_positifs = true;
    int dans_intervalle = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x < 0) {
            tous_positifs = false;
        }
        if (x >= 10 && x <= 20) {
            dans_intervalle = dans_intervalle + 1;
        }
    }
    if (tous_positifs) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    cout << dans_intervalle << "\n";
    return 0;
}
```

Avec `N = 4` et les valeurs `12`, `-3`, `20`, `7` : le drapeau est baissé à la deuxième valeur, et deux valeurs (12 et 20) sont entre 10 et 20. Le programme affiche `NON` puis `2`.

## Erreurs fréquentes

**Écrire `x == 1 or 2`.** On veut tester si `x` vaut 1 ou 2. Mais Python lit `(x == 1) or 2`, et le nombre `2`, utilisé comme condition, compte comme vrai (tout nombre non nul est considéré comme vrai). La condition est donc **toujours** vraie, sans aucun message d'erreur. Il faut répéter la comparaison : `x == 1 or x == 2`. En C++, `x == 1 || 2` pose exactement le même problème.

**Enchaîner les comparaisons en C++.** En C++, `15 <= t <= 25` est accepté par le compilateur, mais ne fait pas ce qu'on croit. Il calcule d'abord `15 <= t`, qui vaut `0` ou `1`, puis compare ce `0` ou ce `1` à 25 : le résultat est toujours vrai. Avec `t = 100`, le programme affiche `AGREABLE`. Il faut écrire `t >= 15 && t <= 25`.

**Oublier un morceau de la comparaison.** `if x > 5 and < 10:` est refusé par Python avec `SyntaxError: invalid syntax`. Chaque côté d'un `and` doit être une condition complète : `x > 5 and x < 10`.

**Se tromper en niant une combinaison.** La négation de « `t` entre 15 et 25 » n'est pas `t < 15 and t > 25`, qui est toujours faux (aucun nombre n'est à la fois plus petit que 15 et plus grand que 25). D'après les lois de De Morgan, c'est `t < 15 or t > 25`.

**Relever le drapeau au mauvais endroit.** Si on écrit `tous_positifs = True` à l'intérieur de la boucle, le drapeau est remis à vrai à chaque tour, et seule la dernière valeur compte. L'initialisation se fait **avant** la boucle. De même, il ne faut pas écrire `else: tous_positifs = True` : une valeur positive ne doit pas effacer une valeur négative vue plus tôt.

**Afficher le booléen au lieu du mot attendu.** `print(x > 0)` affiche `True` ou `False` en Python, et `1` ou `0` en C++. Si l'énoncé attend `OUI` ou `NON`, la sortie est fausse : il faut passer par un `if`.

## Un exemple complet

**Énoncé.** Lire `N` entiers, un par ligne. Afficher `OUI` si la suite est strictement croissante (chaque valeur est strictement plus grande que la précédente), `NON` sinon. Afficher ensuite, sur une deuxième ligne, le nombre de valeurs paires et positives (strictement).

**Idée.** Pour la croissance, on compare chaque valeur à la précédente, qu'on garde dans une variable. Il suffit d'un seul couple de valeurs dans le mauvais ordre pour que la réponse soit `NON` : c'est un travail de drapeau. On part de `croissante = True`, et on la passe à `False` dès qu'une valeur n'est pas plus grande que la précédente. Pour la deuxième question, un compteur avec une condition `and`. Attention : la première valeur doit aussi être comptée, car elle est lue avant la boucle.

**Programme.**

```python
n = int(input())
precedent = int(input())
croissante = True
compteur = 0
if precedent % 2 == 0 and precedent > 0:
    compteur = 1
for i in range(n - 1):
    x = int(input())
    if x <= precedent:
        croissante = False
    if x % 2 == 0 and x > 0:
        compteur = compteur + 1
    precedent = x
if croissante:
    print("OUI")
else:
    print("NON")
print(compteur)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n, precedent;
    cin >> n >> precedent;
    bool croissante = true;
    int compteur = 0;
    if (precedent % 2 == 0 && precedent > 0) {
        compteur = 1;
    }
    for (int i = 0; i < n - 1; i++) {
        int x;
        cin >> x;
        if (x <= precedent) {
            croissante = false;
        }
        if (x % 2 == 0 && x > 0) {
            compteur = compteur + 1;
        }
        precedent = x;
    }
    if (croissante) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    cout << compteur << "\n";
    return 0;
}
```

**Vérification à la main.** Avec `N = 5` et les valeurs `-4`, `2`, `6`, `6`, `9`. La première valeur, `-4`, est paire mais pas positive : le compteur reste à 0. Puis `2 > -4`, le drapeau ne bouge pas, et 2 est pair et positif : compteur à 1. Ensuite `6 > 2`, et 6 est compté : compteur à 2. Puis `6 <= 6` : la suite n'est pas strictement croissante, le drapeau passe à faux ; ce 6 est compté : compteur à 3. Enfin `9 > 6`, mais le drapeau reste baissé ; 9 est impair. Le programme affiche `NON` puis `3`.

Le test `x <= precedent` est la négation exacte de « `x` est strictement plus grand que `precedent` ». Écrire `x < precedent` serait une erreur : deux valeurs égales ne doivent pas être acceptées. Avec `N = 1`, la boucle ne fait aucun tour et le programme répond `OUI` : une suite d'une seule valeur est bien strictement croissante.

## À retenir

- Un booléen vaut vrai ou faux (`True`/`False` en Python, `true`/`false` en C++). Une comparaison est un booléen, qu'on peut ranger dans une variable.
- `and` (`&&`) est vrai si les deux conditions sont vraies ; `or` (`||`) si au moins une l'est ; `not` (`!`) donne le contraire.
- On met des parenthèses dès qu'on mélange `and` et `or`. Pour nier une combinaison, `and` et `or` s'échangent (lois de De Morgan). « Exactement un des deux » s'écrit `a != b`.
- Chaque côté d'un `and` ou d'un `or` est une comparaison complète : `x == 1 or x == 2`, et en C++ `a <= x && x <= b`.
- Un drapeau initialisé avant la boucle vérifie « toutes les valeurs » ou « au moins une valeur » ; un compteur dit combien de valeurs vérifient une condition.
