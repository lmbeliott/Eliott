Avec `for i in range(N)`, on répète des instructions un nombre de fois connu à l'avance. Mais souvent, ce nombre est inconnu. Combien de fois faut-il diviser 1 000 par 2 pour arriver à 1 ? Combien de chiffres a le nombre 4 072 ? Combien de valeurs reste-t-il à lire, si l'entrée se termine par un `0` ? Dans ces situations, on ne sait pas combien de tours faire, mais on sait **quand s'arrêter**.

Ce chapitre présente la boucle `while`, qui répète des instructions **tant qu'une condition est vraie**. Avec elle, on peut lire des données jusqu'à une valeur de fin, découper un nombre en chiffres, ou simuler un phénomène jusqu'à ce qu'il atteigne un seuil.

## La boucle while

Une **boucle tant que** s'écrit avec le mot-clé `while`, suivi d'une condition. Les instructions décalées en dessous forment le **corps de la boucle**. Voici un premier exemple : on part de 1 et on double tant que le nombre est plus petit que 100.

```python
n = 1
while n < 100:
    n = n * 2
print(n)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 1;
    while (n < 100) {
        n = n * 2;
    }
    cout << n << "\n";
    return 0;
}
```

Ce programme affiche `128`. Pour comprendre pourquoi, il faut suivre précisément ce que fait la machine. Avant chaque tour, elle teste la condition `n < 100` :

- si la condition est vraie, elle exécute le corps de la boucle, puis revient tester la condition ;
- si la condition est fausse, elle saute le corps et passe à la suite du programme.

Un passage dans le corps de la boucle s'appelle un **tour** (ou une **itération**). On peut suivre les valeurs de `n` dans un tableau, ce qu'on appelle **dérouler** la boucle à la main :

| Test | `n` avant le test | `n < 100` ? | `n` après le tour |
| --- | --- | --- | --- |
| 1 | 1 | vrai | 2 |
| 2 | 2 | vrai | 4 |
| 3 | 4 | vrai | 8 |
| 4 | 8 | vrai | 16 |
| 5 | 16 | vrai | 32 |
| 6 | 32 | vrai | 64 |
| 7 | 64 | vrai | 128 |
| 8 | 128 | faux | — |

Au huitième test, `n` vaut 128 : la condition est fausse, la boucle s'arrête et le programme affiche 128. La valeur affichée est la première puissance de 2 qui n'est **pas** plus petite que 100. C'est un réflexe à prendre : à la sortie d'une boucle `while`, on sait que la condition est fausse.

Deux remarques importantes :

1. La condition est testée **avant** chaque tour, jamais au milieu. Si `n` dépassait 100 au milieu du corps, la boucle finirait quand même son tour.
2. Si la condition est fausse dès le départ, le corps n'est **jamais** exécuté. Avec `n = 500` au début, le programme ci-dessus affiche directement `500`.

## Compter les tours

Souvent, ce qui intéresse n'est pas la valeur finale, mais le **nombre de tours**. On ajoute alors un **compteur** : une variable qui vaut 0 avant la boucle et qui augmente de 1 à chaque tour. Par exemple, combien de fois peut-on diviser un nombre par 2 (division entière) avant d'arriver à 1 ?

```python
n = int(input())
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
    int n;
    cin >> n;
    int etapes = 0;
    while (n > 1) {
        n = n / 2;
        etapes = etapes + 1;
    }
    cout << etapes << "\n";
    return 0;
}
```

Avec l'entrée `1000`, `n` prend les valeurs 1000, 500, 250, 125, 62, 31, 15, 7, 3, 1 : il y a 9 divisions, et le programme affiche `9`. Avec l'entrée `1`, la condition `n > 1` est fausse tout de suite : aucun tour, le programme affiche `0`, ce qui est la bonne réponse.

Le compteur est mis à 0 **avant** la boucle, une seule fois. S'il était remis à 0 dans le corps de la boucle, il recommencerait à chaque tour et ne pourrait jamais dépasser 1.

## for ou while ?

Toute boucle `for` peut s'écrire avec `while`. Les deux programmes suivants affichent les nombres de 0 à 4 :

```python
for i in range(5):
    print(i)

i = 0
while i < 5:
    print(i)
    i = i + 1
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 5; i++) {
        cout << i << "\n";
    }

    int i = 0;
    while (i < 5) {
        cout << i << "\n";
        i = i + 1;
    }
    return 0;
}
```

Avec `while`, c'est au programmeur d'écrire les trois éléments que `for` gère tout seul : la valeur de départ (`i = 0`), la condition (`i < 5`) et la mise à jour (`i = i + 1`). Oublier la mise à jour est une erreur classique, décrite plus bas.

La règle est simple : quand on connaît le nombre de tours avant de commencer la boucle, on utilise `for`, plus court et plus sûr. Quand on ne le connaît pas, et qu'on sait seulement quand s'arrêter, on utilise `while`.

## Lire jusqu'à une valeur sentinelle

Dans certains problèmes, l'entrée ne commence pas par le nombre de valeurs. À la place, une valeur spéciale marque la fin : on l'appelle une **valeur sentinelle**. Par exemple, l'entrée contient des entiers, un par ligne, et le dernier vaut `0`. Ce `0` n'est pas une donnée : il dit seulement « c'est fini ».

On écrit alors la boucle selon un schéma très précis :

1. on lit une première valeur **avant** la boucle ;
2. la condition vérifie que la valeur lue n'est pas la sentinelle ;
3. dans le corps, on traite la valeur, puis on lit la suivante **à la fin** du corps.

```python
total = 0
x = int(input())
while x != 0:
    total = total + x
    x = int(input())
print(total)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int total = 0;
    int x;
    cin >> x;
    while (x != 0) {
        total = total + x;
        cin >> x;
    }
    cout << total << "\n";
    return 0;
}
```

Avec l'entrée `5`, `-2`, `8`, `0` (un nombre par ligne), le programme lit 5 et l'ajoute, lit -2 et l'ajoute, lit 8 et l'ajoute, puis lit 0 : la condition devient fausse et la boucle s'arrête. Il affiche `11`. Le 0 n'est jamais ajouté, car la condition est testée juste après chaque lecture. Si l'entrée ne contient que `0`, la boucle ne fait aucun tour et le programme affiche `0`.

Ce schéma garantit que chaque valeur est testée **avant** d'être traitée. C'est pour cela que la lecture est placée à la fin du corps et non au début.

## Les chiffres d'un nombre

Pour un entier positif `n`, deux opérations découpent son écriture décimale :

- `n % 10` est le **dernier chiffre** de `n` (le reste de la division par 10) ;
- `n // 10` est `n` **privé de son dernier chiffre** (en C++, `n / 10` entre deux entiers).

Par exemple, `4072 % 10` vaut 2 et `4072 // 10` vaut 407. En répétant, on parcourt tous les chiffres, de droite à gauche. On ne sait pas combien de chiffres a `n`, mais on sait quand s'arrêter : quand il ne reste plus rien, c'est-à-dire quand `n` vaut 0. Voici la somme des chiffres :

```python
n = int(input())
somme = 0
while n > 0:
    somme = somme + n % 10
    n = n // 10
print(somme)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int somme = 0;
    while (n > 0) {
        somme = somme + n % 10;
        n = n / 10;
    }
    cout << somme << "\n";
    return 0;
}
```

Avec `4072`, les tours ajoutent 2, puis 7, puis 0, puis 4, et `n` passe par 407, 40, 4 et 0. Le programme affiche `13`.

L'opération inverse est aussi utile : `r * 10 + c` ajoute le chiffre `c` **à droite** du nombre `r`. Par exemple, `407 * 10 + 2` vaut 4072. En partant de `r = 0` et en ajoutant des chiffres un par un, on construit un nombre chiffre par chiffre, sans jamais manipuler de texte.

Deux détails comptent. D'abord, la boucle **détruit** `n` : à la fin, `n` vaut 0. Si on a encore besoin du nombre de départ, on le recopie dans une autre variable avant la boucle. Ensuite, le nombre `0` est un cas particulier : la boucle ne fait aucun tour. Pour la somme des chiffres, ce n'est pas grave (la somme vaut bien 0), mais pour compter les chiffres, il faut répondre 1 et non 0. On traite alors ce cas avec un `if` avant la boucle.

## Simuler jusqu'à une condition

Une boucle `while` permet aussi de **simuler** un phénomène étape par étape, jusqu'à ce qu'une condition soit remplie. Exemple : une somme de 1 000 est placée à 7 % par an ; chaque année, on lui ajoute 7 % de sa valeur, arrondis à l'entier inférieur. Au bout de combien d'années dépasse-t-elle 2 000 ?

```python
somme = 1000
annees = 0
while somme <= 2000:
    somme = somme + somme * 7 // 100
    annees = annees + 1
print(annees, somme)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int somme = 1000;
    int annees = 0;
    while (somme <= 2000) {
        somme = somme + somme * 7 / 100;
        annees = annees + 1;
    }
    cout << annees << " " << somme << "\n";
    return 0;
}
```

Le programme affiche `11 2098` : la somme vaut 1 070, puis 1 144, puis 1 224, et ainsi de suite jusqu'à 2 098 la onzième année. La condition de la boucle est le **contraire** de la condition d'arrêt : on veut s'arrêter quand la somme dépasse 2 000, donc on continue tant qu'elle est inférieure ou égale à 2 000.

Pour écrire une simulation, on se pose trois questions : quelles variables décrivent l'état à un instant donné (ici, la somme et le nombre d'années) ? Comment passer d'une étape à la suivante ? Quand s'arrêter ?

## Chercher la première valeur qui convient

Une boucle `while` sert aussi à **chercher** : on essaie les valeurs dans l'ordre, et on s'arrête à la première qui convient. Voici le plus petit diviseur d'un entier `n ≥ 2`, en dehors de 1 :

```python
n = int(input())
d = 2
while n % d != 0:
    d = d + 1
print(d)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int d = 2;
    while (n % d != 0) {
        d = d + 1;
    }
    cout << d << "\n";
    return 0;
}
```

Avec `91`, `d` essaie 2, 3, 4, 5, 6, puis 7 divise 91 : le programme affiche `7`. Avec `13`, aucun nombre de 2 à 12 ne divise 13, et la boucle s'arrête à `d = 13` : le plus petit diviseur d'un nombre premier est le nombre lui-même. Cette boucle s'arrête toujours, car `n` se divise lui-même : `d` ne peut pas dépasser `n`. Avant d'écrire une recherche, on vérifie ainsi qu'une valeur qui convient existe forcément.

Quand on n'en est pas sûr, on limite la recherche avec `and`. La condition d'un `while` est une condition comme les autres : elle peut combiner `and`, `or` et `not`. Pour chercher seulement les diviseurs de 2 à 100 :

```python
n = int(input())
d = 2
while d <= 100 and n % d != 0:
    d = d + 1
if d <= 100:
    print(d)
else:
    print("AUCUN")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int d = 2;
    while (d <= 100 && n % d != 0) {
        d = d + 1;
    }
    if (d <= 100) {
        cout << d << "\n";
    } else {
        cout << "AUCUN" << "\n";
    }
    return 0;
}
```

La boucle continue tant que les **deux** conditions sont vraies : elle s'arrête dès que l'une des deux devient fausse. À la sortie, il faut donc savoir **laquelle**. Si `d <= 100`, c'est que `n % d` vaut 0 : un diviseur a été trouvé. Sinon, on a essayé toutes les valeurs de 2 à 100 sans succès. Avec `1001`, le programme affiche `7` ; avec `10007`, qui est premier, il affiche `AUCUN`.

## Les erreurs fréquentes

### La boucle infinie

Si rien ne change dans le corps de la boucle, la condition reste vraie pour toujours : c'est une **boucle infinie**. Le programme ne s'arrête jamais, et le juge finit par le couper avec le verdict « temps dépassé ».

```python
i = 0
while i < 5:
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int i = 0;
    while (i < 5) {
        cout << i << "\n";
    }
    return 0;
}
```

Ce programme affiche `0` sans fin : `i` n'est jamais modifié. Il manque `i = i + 1` dans le corps. Avant d'écrire une boucle `while`, on vérifie toujours qu'**au moins une variable de la condition change à chaque tour**, et qu'elle change dans le bon sens.

Le même piège existe avec une sentinelle : si on oublie la lecture `x = int(input())` à la fin du corps, `x` garde la même valeur et la boucle ne s'arrête plus. En Python, on obtient parfois une autre erreur : si la lecture est faite trop de fois, le programme tente de lire après la fin de l'entrée et s'arrête avec `EOFError: EOF when reading a line`.

### La condition qui saute la valeur d'arrêt

```python
n = 10
while n != 0:
    n = n - 3
```

```cpp
int n = 10;
while (n != 0) {
    n = n - 3;
}
```

Ici `n` vaut 10, 7, 4, 1, puis -2, -5… Il ne vaut jamais exactement 0, donc la boucle est infinie. On corrige avec une comparaison large : `while n > 0`. En règle générale, une condition avec `<`, `>`, `<=` ou `>=` est plus sûre qu'une condition avec `!=` quand une variable avance par sauts.

### Un tour de trop ou de moins

Entre « dépasser » et « atteindre », il y a souvent un tour d'écart. Avec `while somme <= 2000`, la boucle continue quand la somme vaut exactement 2 000 ; avec `while somme < 2000`, elle s'arrête. Les deux sont justes, mais pour des questions différentes. Pour choisir, on teste à la main le cas où la valeur tombe pile sur la limite.

### Le compteur remis à zéro au mauvais endroit

```python
etapes = 0
while n > 1:
    etapes = 0
    n = n // 2
    etapes = etapes + 1
```

```cpp
int etapes = 0;
while (n > 1) {
    etapes = 0;
    n = n / 2;
    etapes = etapes + 1;
}
```

Ce programme affiche toujours 1 (ou 0 si `n` vaut 1 au départ), car le compteur est remis à 0 à chaque tour. L'initialisation se place **avant** la boucle.

### Le dépassement en C++

Un `int` du C++ ne dépasse pas environ 2 × 10⁹. Quand une boucle double un nombre ou fait grandir une valeur, le résultat peut sortir de cette limite et devenir faux sans aucun message d'erreur. On utilise alors le type `long long`, qui va jusqu'à environ 9 × 10¹⁸. En Python, les entiers n'ont pas de limite.

## Exemple complet : le plus grand chiffre

**Énoncé.** Le programme lit un entier `N` (0 ≤ N ≤ 10⁹) et affiche le plus grand chiffre de son écriture décimale.

**Idée.** On ne connaît pas le nombre de chiffres : on les parcourt avec une boucle `while`, de droite à gauche, avec `% 10` et `// 10`. On garde dans une variable `meilleur` le plus grand chiffre vu jusqu'ici. À chaque tour, si le chiffre courant est plus grand que `meilleur`, on met `meilleur` à jour. Au départ, `meilleur` vaut 0 : c'est une bonne valeur initiale, car tous les chiffres sont au moins égaux à 0. Elle règle aussi le cas `N = 0` : la boucle ne fait aucun tour, et la réponse 0 est juste.

**Programme.**

```python
n = int(input())
meilleur = 0
while n > 0:
    chiffre = n % 10
    if chiffre > meilleur:
        meilleur = chiffre
    n = n // 10
print(meilleur)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int meilleur = 0;
    while (n > 0) {
        int chiffre = n % 10;
        if (chiffre > meilleur) {
            meilleur = chiffre;
        }
        n = n / 10;
    }
    cout << meilleur << "\n";
    return 0;
}
```

**Vérification à la main** avec `N = 3916` :

| Tour | `n` au début | `chiffre` | `meilleur` après | `n` à la fin |
| --- | --- | --- | --- | --- |
| 1 | 3916 | 6 | 6 | 391 |
| 2 | 391 | 1 | 6 | 39 |
| 3 | 39 | 9 | 9 | 3 |
| 4 | 3 | 3 | 9 | 0 |

Après le quatrième tour, `n` vaut 0 : la condition `n > 0` est fausse, et le programme affiche `9`. On vérifie aussi les cas limites : avec `N = 7`, un seul tour, réponse 7 ; avec `N = 0`, aucun tour, réponse 0 ; avec `N = 1000000000`, dix tours, réponse 1.

## À retenir

- `while condition:` répète le corps tant que la condition est vraie. Elle est testée avant chaque tour ; si elle est fausse dès le départ, le corps n'est jamais exécuté. À la sortie, la condition est fausse : avec un `and`, on teste laquelle des deux parties a arrêté la boucle.
- On choisit `for` quand le nombre de tours est connu à l'avance, `while` quand on sait seulement quand s'arrêter.
- Pour lire jusqu'à une sentinelle : une lecture avant la boucle, une lecture à la fin du corps, et la condition compare la valeur lue à la sentinelle.
- `n % 10` donne le dernier chiffre, `n // 10` l'enlève ; on répète tant que `n > 0`, sans oublier le cas `n = 0`. `r * 10 + c` ajoute un chiffre à droite.
- Chaque tour doit rapprocher la boucle de sa fin : sinon, c'est une boucle infinie. Les compteurs s'initialisent avant la boucle.
- On vérifie toujours une boucle en la déroulant à la main sur un petit exemple et sur les cas limites.
