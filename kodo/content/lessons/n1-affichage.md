Un programme est une suite d'instructions que l'ordinateur exécute dans l'ordre, de haut en bas. Dans ce chapitre, tu vas apprendre les trois gestes de base de tout programme : **afficher**, **calculer** et **lire** des nombres.

## Afficher un message

```python
print("Bonjour !")
print(2026)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Bonjour !" << "\n";
    cout << 2026 << "\n";
    return 0;
}
```

En Python, `print` affiche ce qu'on lui donne, puis passe à la ligne. Le texte s'écrit entre guillemets ; les nombres, sans guillemets.

En C++, un programme a toujours cette forme : les deux premières lignes préparent l'affichage et la lecture, et tes instructions se placent entre les accolades de `int main()`. `cout << …` affiche, et `"\n"` passe à la ligne. Chaque instruction se termine par un point-virgule. Dans la suite, on ne montrera que l'intérieur de `main`.

## Les variables

Une **variable** est une boîte qui porte un nom et dans laquelle on range une valeur.

```python
pages = 40
lues = 27
restantes = pages - lues
print(restantes)
```

```cpp
int pages = 40;
int lues = 27;
int restantes = pages - lues;
cout << restantes << "\n";
```

Ce programme affiche `13`. En C++, la première fois qu'on utilise une boîte, on annonce ce qu'elle contient : `int` veut dire « nombre entier ». En Python, ce n'est pas nécessaire.

Le contenu d'une boîte peut changer : `lues = lues + 3` calcule d'abord `lues + 3`, puis range le résultat dans `lues`. Le signe `=` ne veut donc pas dire « est égal à », mais « prend la valeur ».

## Calculer

Voici les opérations sur les nombres entiers :

- `+`, `-` et `*` : l'addition, la soustraction et la multiplication (`*` est le signe « fois ») ;
- `//` en Python, `/` en C++ : le quotient de la division entière, par exemple 17 divisé par 5 donne `3` ;
- `%` dans les deux langages : le reste de cette division, par exemple 17 % 5 donne `2`, car 17 = 3 × 5 + 2.

Comme en mathématiques, les multiplications et les divisions passent avant les additions et les soustractions : `2 + 3 * 4` vaut `14`. Utilise des parenthèses pour changer l'ordre : `(2 + 3) * 4` vaut `20`.

Attention : en Python, `/` donne un nombre à virgule (`17 / 5` vaut `3.4`). Pour compter des objets entiers, utilise `//`.

Le quotient et le reste servent souvent à faire des conversions. Par exemple, combien d'heures et de minutes dans 135 minutes ?

```python
duree = 135
heures = duree // 60
minutes = duree % 60
print(heures, minutes)
```

```cpp
int duree = 135;
int heures = duree / 60;
int minutes = duree % 60;
cout << heures << " " << minutes << "\n";
```

Le programme affiche `2 15` : 135 minutes, c'est 2 heures et 15 minutes.

## Lire les données

Dans chaque problème, ton programme reçoit des données : c'est l'**entrée**. Pour lire un nombre seul sur sa ligne :

```python
n = int(input())
```

```cpp
int n;
cin >> n;
```

En Python, `input()` lit une ligne entière, sous forme de **texte**. `int(…)` transforme ce texte en nombre entier. Sans cette conversion, `"3" + "4"` donnerait le texte `"34"`, et non le nombre `7` !

Pour lire plusieurs nombres écrits sur une même ligne, séparés par des espaces :

```python
a, b = map(int, input().split())
```

```cpp
int a, b;
cin >> a >> b;
```

`input().split()` découpe la ligne aux espaces, et `map(int, …)` convertit chaque morceau en entier. En C++, `cin >>` lit le nombre suivant, qu'il soit sur la même ligne ou sur la ligne d'après : `cin` ne s'occupe pas des lignes.

## Afficher plusieurs choses

```python
total = 12
print("Total :", total)
print(3, 4)
```

```cpp
int total = 12;
cout << "Total : " << total << "\n";
cout << 3 << " " << 4 << "\n";
```

Les deux programmes affichent `Total : 12`, puis `3 4` sur la ligne suivante. En Python, `print` met une espace entre les éléments séparés par des virgules. En C++, `cout` n'ajoute rien : c'est à toi d'écrire les espaces.

Ta réponse est comparée mot à mot avec la réponse attendue. Les majuscules et la ponctuation comptent, et rien d'autre ne doit être affiché. N'écris donc pas `input("Donne un nombre : ")` : ce message s'afficherait et ta réponse serait refusée.

## À retenir

- `print(…)` en Python, `cout << …` en C++ pour afficher ; en C++, les espaces et les `"\n"` sont à écrire toi-même.
- Une variable range une valeur : `x = x + 1` calcule `x + 1`, puis range le résultat dans `x`.
- `input()` lit du texte : convertis-le avec `int(…)`. Plusieurs nombres sur une ligne : `map(int, input().split())` en Python, `cin >> a >> b;` en C++.
- Division entière : `//` en Python, `/` entre deux `int` en C++. Reste : `%`.
- Affiche exactement ce qui est demandé, rien de plus.
