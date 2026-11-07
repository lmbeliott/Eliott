Jusqu'ici, tous les calculs portaient sur des entiers. Beaucoup de questions simples mènent pourtant à des nombres qui ne tombent pas juste. Sept personnes se partagent 100 € : chacune reçoit 14,285714… €. Une moyenne de trois notes, 12, 15 et 14, vaut 13,666… Et 250 personnes qui montent dans des cars de 60 places ont besoin de 5 cars, pas de 4,17.

Ces trois exemples demandent trois traitements différents : un montant affiché avec deux décimales, une valeur approchée, et un **entier** obtenu en arrondissant vers le haut. Ce chapitre présente les nombres à virgule, la façon de les afficher et de les arrondir, mais aussi leur défaut : ils sont **approchés**. Un bon programme les évite donc souvent, en raisonnant avec des entiers, toujours exacts.

## Les nombres à virgule

Un **nombre à virgule flottante** (on dit souvent un **flottant**) est un nombre qui peut avoir une partie décimale. En Python, son type s'appelle `float`. On l'écrit avec un point, et non une virgule : `3.5`, `-0.25`, `100.0`. L'opérateur `/` (une seule barre) est la **division décimale** : son résultat est toujours un flottant, même quand la division tombe juste.

```python
print(7 / 2)
print(10 / 2)
print(10 // 2)
x = 1.5
print(x * 4)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << 7.0 / 2 << "\n";
    cout << 10.0 / 2 << "\n";
    cout << 10 / 2 << "\n";
    double x = 1.5;
    cout << x * 4 << "\n";
    return 0;
}
```

Le programme Python affiche `3.5`, `5.0`, `5` et `6.0`. Le point de `5.0` montre que `10 / 2` est un flottant, alors que `10 // 2` est un entier. Dès qu'un calcul mélange un entier et un flottant, le résultat est un flottant : `1.5 * 4` vaut `6.0`.

En C++, le type des nombres à virgule s'appelle `double`. Attention, l'opérateur `/` du C++ dépend du type de ses deux opérandes : si les deux sont entiers, c'est la division **entière**, comme le `//` de Python. `7 / 2` vaut `3`, et non `3.5`. Pour obtenir une division décimale, il faut qu'au moins un des deux nombres soit un `double` : on écrit `7.0 / 2`, ou, avec des variables entières `a` et `b`, `(double) a / b`. Ce `(double)` est une **conversion** : il transforme la valeur entière de `a` en flottant avant la division. Enfin, `cout` affiche `5` pour le flottant `5.0` : en C++, l'affichage ne montre pas la différence entre un entier et un flottant. Plus gênant, `cout` n'affiche que 6 chiffres significatifs d'un `double` : `cout << 1234567.0` affiche `1.23457e+06`. On fixe donc le nombre de décimales avec `printf` (voir plus bas), ou on convertit d'abord en entier.

Pour lire un nombre à virgule, on remplace `int` par `float` en Python : `x = float(input())`. En C++, il suffit de déclarer la variable de type `double` avant `cin >> x`.

Deux outils de calcul servent souvent avec les flottants. La **puissance** s'écrit `**` en Python : `2 ** 10` vaut `1024`. Entre deux entiers, avec un exposant positif ou nul, le résultat est un entier exact : `2 ** 100` vaut `1267650600228229401496703205376`. Avec un exposant à virgule, le résultat est un flottant : `x ** 0.5` donne la **racine carrée** de `x`. En C++, on inclut `<cmath>` et on écrit `pow(2, 10)` et `sqrt(x)`. Ces deux fonctions renvoient toujours un `double`, donc une valeur approchée dès que le résultat est grand : `(long long) pow(3, 39)` donne 4052555153018976256 au lieu de 4052555153018976267. Pour une puissance entière exacte en C++, on multiplie dans une boucle, avec un `long long`. La **valeur absolue**, qui enlève le signe d'un nombre, s'écrit `abs(x)` dans les deux langages (en C++, avec `<cmath>`) : `abs(-3.5)` vaut `3.5`.

## Revenir à un entier : tronquer ou arrondir

Pour transformer un flottant en entier, il y a plusieurs façons de faire, qui ne donnent pas le même résultat.

`int(x)` **tronque** : il supprime la partie décimale, sans arrondir. `int(3.7)` vaut `3`, et `int(-3.7)` vaut `-3`. La troncature va donc toujours vers zéro. En C++, la conversion `(int) x` ou `(long long) x` fait exactement la même chose.

`round(x)` **arrondit** à l'entier le plus proche : `round(3.7)` vaut `4` et `round(3.2)` vaut `3`. Le cas d'une **moitié exacte**, comme 2,5, est délicat. Python l'arrondit vers l'entier **pair** le plus proche : `round(2.5)` vaut `2` et `round(3.5)` vaut `4`. Le `round` du C++ (dans `<cmath>`) arrondit les moitiés en s'éloignant de zéro : `round(2.5)` vaut `3`.

Enfin, l'**arrondi inférieur** (on dit aussi **partie entière**) donne le plus grand entier inférieur ou égal au nombre, et l'**arrondi supérieur** le plus petit entier supérieur ou égal. Pour 3,2, ce sont 3 et 4 ; pour −3,2, ce sont −4 et −3. Python les fournit avec `math.floor(x)` et `math.ceil(x)`, après avoir écrit `import math` en haut du programme ; le C++ avec `floor(x)` et `ceil(x)` de `<cmath>`.

```python
import math
x = -3.2
print(int(x), round(x), math.floor(x), math.ceil(x))
```

```cpp
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double x = -3.2;
    cout << (int) x << " " << round(x) << " " << floor(x) << " " << ceil(x) << "\n";
    return 0;
}
```

Les deux programmes affichent `-3 -3 -4 -3`. La troncature et l'arrondi inférieur ne diffèrent que pour un nombre négatif non entier.

## Arrondir sans quitter les entiers

Quand on divise deux entiers et qu'on veut un résultat entier arrondi, il vaut mieux ne pas passer par les flottants. On peut tout faire avec `//`, pour des entiers `a ≥ 0` et `b > 0` :

- l'arrondi **inférieur** de a/b est simplement `a // b` (en C++, `a / b`) ;
- l'arrondi **supérieur** de a/b vaut `(a + b - 1) // b` ;
- l'arrondi **au plus proche**, une moitié exacte étant arrondie vers le haut, vaut `(2 * a + b) // (2 * b)`.

Pour l'arrondi supérieur : si `a` est un multiple de `b`, ajouter `b − 1` ne suffit pas à atteindre le multiple suivant, et le quotient ne change pas. Sinon, le reste de `a` par `b` vaut au moins 1, et ajouter `b − 1` fait franchir exactement le multiple suivant : le quotient augmente de 1. Pour l'arrondi au plus proche, on ajoute un demi avant de prendre l'arrondi inférieur : a/b + 1/2 = (2a + b)/(2b).

```python
a = 250
b = 60
print(a // b, (a + b - 1) // b, (2 * a + b) // (2 * b))
```

```cpp
#include <iostream>
using namespace std;

int main() {
    long long a = 250, b = 60;
    cout << a / b << " " << (a + b - 1) / b << " " << (2 * a + b) / (2 * b) << "\n";
    return 0;
}
```

Le programme affiche `4 5 4`. En effet, 250/60 ≈ 4,17 : on remplit 4 cars complets, il en faut 5 pour tout le monde, et l'entier le plus proche est 4. Avec `a = 240`, il affiche `4 4 4`, car la division tombe juste.

Pourquoi ne pas écrire simplement `math.ceil(a / b)` ? Parce qu'un flottant ne garde qu'environ 16 chiffres significatifs. Au-delà de 2⁵³, soit environ 9 × 10¹⁵, tous les entiers ne sont plus représentables. Par exemple, `int((10**17 + 1) / 1)` vaut `100000000000000000` : le `+ 1` a été perdu. Avec des entiers jusqu'à 10¹⁸, fréquents dans les exercices, seules les formules entières sont sûres.

La racine carrée a le même défaut. Pour N = 10¹⁸ − 1, `int(N ** 0.5)` (en C++, `(long long) sqrt(N)`) vaut `1000000000`, alors que 10⁹ × 10⁹ = 10¹⁸ dépasse N : le plus grand entier dont le carré ne dépasse pas N est 999 999 999. En devenant un flottant, N a été arrondi à 10¹⁸. La valeur approchée reste un bon point de départ, à condition de la **vérifier**, puis de la corriger, avec des calculs entiers comme `r * r <= n`, qui sont exacts.

## Afficher un nombre précis de décimales

`print(13 / 3)` affiche `4.333333333333333`. Le plus souvent, un énoncé demande un nombre fixé de décimales, par exemple deux. En Python, on utilise une **f-chaîne** (en anglais *f-string*) : une chaîne précédée de la lettre `f`, dans laquelle une expression entre accolades est remplacée par sa valeur. Après la valeur, `:.2f` demande exactement deux chiffres après le point, avec un arrondi au plus proche.

```python
x = 13 / 3
print(f"{x:.2f}")
print(f"{2:.2f}")
print(f"Moyenne : {x:.1f}")
```

```cpp
#include <cstdio>
using namespace std;

int main() {
    double x = 13.0 / 3;
    printf("%.2f\n", x);
    printf("%.2f\n", 2.0);
    printf("Moyenne : %.1f\n", x);
    return 0;
}
```

Les deux programmes affichent `4.33`, `2.00` et `Moyenne : 4.3`. Le format complète avec des zéros si besoin : `2.00` a bien deux décimales. En C++, la fonction `printf` de `<cstdio>` utilise la même notation : `%.2f` est remplacé par le nombre qui suit, avec deux décimales. Il faut lui donner un `double` : `printf("%.2f", 2)` avec un entier affiche n'importe quoi. Une autre écriture, avec `cout`, est `cout << fixed << setprecision(2) << x`, en incluant `<iomanip>`.

Il ne faut pas confondre ce format avec `round(x, 2)`. `round(3.104, 2)` vaut le flottant `3.1`, et `print` l'affiche `3.1`, avec une seule décimale. Seul le format garantit le nombre de chiffres affichés.

## Les pièges de la précision

Un ordinateur range les flottants en base 2. Or beaucoup de nombres simples en base 10, comme 0,1, ont une écriture infinie en base 2, exactement comme 1/3 = 0,333… en base 10. L'ordinateur garde donc une valeur **approchée**, très proche mais pas égale.

```python
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
```

```cpp
#include <cstdio>
using namespace std;

int main() {
    printf("%.17f\n", 0.1 + 0.2);
    printf("%d\n", 0.1 + 0.2 == 0.3);
    return 0;
}
```

Python affiche `0.30000000000000004` puis `False`. Le C++ affiche `0.30000000000000004` puis `0` (faux). L'erreur est minuscule, mais le test d'égalité `==` échoue. Avec `cout`, limité à 6 chiffres, on verrait `0.3` : l'erreur serait cachée, mais bien là.

On en tire trois règles.

1. **Ne jamais tester l'égalité de deux flottants avec `==`.** Si on doit vraiment les comparer, on vérifie qu'ils sont très proches : `abs(a - b) < 1e-9`, où `1e-9` signifie 10⁻⁹. Cette valeur s'appelle une **tolérance**.
2. **Les moitiés exactes sont piégées.** Le nombre 2,675 est stocké comme 2,67499999…, donc `f"{2.675:.2f}"` donne `2.67`, et non `2.68`. Et 0,125, stocké exactement, donne `0.12` : une moitié exacte est arrondie vers le chiffre pair, comme avec `round`. Les énoncés sérieux évitent donc ces cas, ou imposent une règle d'arrondi qu'on programme avec des entiers.
3. **Travailler en entiers quand c'est possible.** Un prix de 19,99 € se range en centimes : 1 999. Les additions et les comparaisons sont alors exactes. On ne convertit en euros ou en heures qu'au moment d'afficher.

## Division et reste des nombres négatifs

Au niveau 1, on n'utilisait `//` et `%` qu'avec des nombres positifs. Avec des nombres négatifs, Python et C++ ne donnent pas le même résultat.

- En Python, `a // b` est l'**arrondi inférieur** de a/b : `-7 // 2` vaut `-4`, car −3,5 est arrondi vers le bas. Le reste `a % b` a alors le signe de `b` : `-7 % 2` vaut `1`. Pour `b > 0`, le reste est toujours entre 0 et b − 1.
- En C++, `a / b` **tronque** vers zéro : `-7 / 2` vaut `-3`. Le reste a le signe de `a` : `-7 % 2` vaut `-1`.

Dans les deux langages, la relation a = b × q + r reste vraie : −7 = 2 × (−4) + 1 en Python, et −7 = 2 × (−3) + (−1) en C++. Les deux langages coïncident quand `a` est positif ou quand la division tombe juste.

La version de Python est souvent plus pratique : une horloge qui indique 10 h et recule de 13 heures indique `(10 - 13) % 24`, soit 21 h en Python, mais −3 en C++. Pour obtenir en C++ un reste toujours compris entre 0 et b − 1 (avec `b > 0`), on écrit `((a % b) + b) % b` : le premier `%` donne un reste entre −(b − 1) et b − 1, l'ajout de `b` le rend positif ou nul, et le second `%` le ramène sous `b`.

```python
h = 10
d = -13
print((h + d) % 24)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int h = 10, d = -13;
    cout << ((h + d) % 24 + 24) % 24 << "\n";
    return 0;
}
```

Les deux programmes affichent `21`. De même, pour obtenir en C++ l'arrondi inférieur d'une division par `b > 0` quand `a` peut être négatif, on corrige le quotient : on calcule `q = a / b`, puis on enlève 1 à `q` si `a % b` est négatif.

Une conséquence piège les débutants en C++ : le test `x % 2 == 1` est faux pour un entier impair négatif, puisque `-7 % 2` vaut `-1`. Pour tester qu'un nombre est impair, on écrit `x % 2 != 0`, qui marche dans les deux langages.

## Erreurs fréquentes

**Diviser par zéro.** `print(5 / 0)` arrête Python avec `ZeroDivisionError: division by zero` ; `5 // 0` et `5 % 0` aussi. En C++, une division entière par zéro arrête brutalement le programme (souvent avec le message `Floating point exception`). Il faut s'assurer, avec un `if`, que le diviseur n'est pas nul.

**Oublier la conversion en C++.** Avec `int s = 41, n = 3;`, l'instruction `double m = s / n;` range `13` dans `m` : la division est entière, et la conversion en `double` arrive trop tard. On écrit `double m = (double) s / n;`, qui donne 13,666…

**Donner un flottant à `range`.** `range(n / 2)` provoque `TypeError: 'float' object cannot be interpreted as an integer`, car `n / 2` est un flottant même si `n` est pair. On écrit `range(n // 2)`.

**Lire un nombre à virgule avec `int`.** Si la ligne contient `3.5`, `int(input())` provoque `ValueError: invalid literal for int() with base 10: '3.5'`. On utilise `float(input())`.

## Un exemple complet

**Énoncé.** Un trajet mesure `D` mètres et se parcourt à `V` mètres par minute. Afficher sa durée en minutes, arrondie à la minute supérieure, puis cette même durée en heures et minutes, sur une deuxième ligne. On a 1 ≤ D ≤ 10¹⁸ et 1 ≤ V ≤ 10⁹.

**Idée.** La durée exacte est D/V minutes. On veut son arrondi supérieur, et les nombres sont trop grands pour un flottant : on utilise la formule entière `(D + V - 1) // V`. Ensuite, on découpe les minutes en heures et minutes avec `//` et `%`, comme au niveau 1. En C++, `D + V - 1` peut atteindre environ 10¹⁸, ce qui tient dans un `long long`.

**Programme.**

```python
d, v = map(int, input().split())
minutes = (d + v - 1) // v      # arrondi supérieur de d / v
print(minutes)
print(minutes // 60, minutes % 60)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    long long d, v;
    cin >> d >> v;
    long long minutes = (d + v - 1) / v;   // arrondi supérieur de d / v
    cout << minutes << "\n";
    cout << minutes / 60 << " " << minutes % 60 << "\n";
    return 0;
}
```

**Vérification à la main.** Avec `D = 7000` et `V = 75`, la durée exacte est 93,33… minutes, donc on attend 94. Le programme calcule 7 074 // 75. Comme 75 × 94 = 7 050 ≤ 7 074 < 7 125 = 75 × 95, le quotient vaut 94. Puis 94 // 60 = 1 et 94 % 60 = 34 : le programme affiche `94`, puis `1 34`. Avec `D = 7500`, la division tombe juste (100 minutes) : 7 574 // 75 = 100, car 75 × 101 = 7 575 dépasse 7 574. Le programme affiche `100`, puis `1 40`, sans arrondir à tort vers 101.

## À retenir

- `/` donne un flottant en Python ; en C++, `/` entre deux entiers est une division entière, et il faut écrire `(double) a / b` pour une division décimale.
- `int(x)` tronque vers zéro, `round(x)` arrondit au plus proche (les moitiés exactes diffèrent selon le langage), `floor` et `ceil` arrondissent vers le bas et vers le haut.
- Pour `a ≥ 0` et `b > 0` : arrondi supérieur `(a + b - 1) // b`, arrondi au plus proche `(2 * a + b) // (2 * b)`. Ces formules entières sont exactes, même pour de très grands nombres.
- Pour afficher exactement k décimales : `f"{x:.2f}"` en Python, `printf("%.2f\n", x)` en C++.
- Les flottants sont approchés, et donc aussi `pow` et `sqrt` : pas de `==` entre flottants, et on préfère compter en entiers (centimes, minutes), ou vérifier un résultat approché avec des entiers.
- Avec des négatifs, `//` et `%` de Python arrondissent vers le bas, `/` et `%` du C++ vers zéro ; en C++, `((a % b) + b) % b` donne un reste entre 0 et b − 1.
