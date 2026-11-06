Avec une boucle, tu sais lire `N` nombres et en faire la somme. Mais à chaque tour, le nouveau nombre remplace l'ancien dans la variable : une fois la boucle finie, tu ne peux plus revenir en arrière. Pour garder **tous** les nombres en mémoire, il faut une **liste**. En C++, on dit un **vector**.

## Créer une liste

```python
valeurs = [12, 45, 30]
print(valeurs[0])
print(valeurs[2])
print(len(valeurs))
valeurs[1] = 50
```

```cpp
vector<int> valeurs = {12, 45, 30};
cout << valeurs[0] << "\n";
cout << valeurs[2] << "\n";
cout << valeurs.size() << "\n";
valeurs[1] = 50;
```

Une liste est une rangée de cases numérotées. Le numéro d'une case s'appelle sa **position** (ou son indice), et il commence à **0** : `valeurs[0]` vaut 12, `valeurs[2]` vaut 30. Le programme affiche donc `12`, `30`, puis `3`, le nombre d'éléments, donné par `len` en Python et `.size()` en C++. La dernière ligne change le contenu de la case 1.

Dans une liste de `N` éléments, les positions vont de `0` à `N - 1`. La case `N` n'existe pas : en Python, y accéder provoque une erreur ; en C++, le programme lit n'importe quoi ou plante.

En C++, ajoute `#include <vector>` en haut de ton programme, à côté de `#include <iostream>`.

## Lire une liste

Dans les problèmes, une liste est souvent donnée sur deux lignes : `N`, puis les `N` nombres sur une même ligne, séparés par des espaces.

```python
n = int(input())
notes = list(map(int, input().split()))
```

```cpp
int n;
cin >> n;
vector<int> notes(n);
for (int i = 0; i < n; i++) {
    cin >> notes[i];
}
```

En Python, `input().split()` découpe la ligne, `map(int, …)` convertit chaque morceau, et `list(…)` range le tout dans une liste. En C++, `vector<int> notes(n)` crée `n` cases, puis la boucle les remplit une par une.

On peut aussi partir d'une liste vide et ajouter des éléments à la fin :

```python
carres = []
for i in range(5):
    carres.append(i * i)
```

```cpp
vector<int> carres;
for (int i = 0; i < 5; i++) {
    carres.push_back(i * i);
}
```

À la fin, la liste contient 0, 1, 4, 9 et 16.

## Parcourir une liste

Il y a deux façons de parcourir une liste : par les **valeurs**, ou par les **positions**.

```python
for x in notes:
    print(x)
for i in range(n):
    print(i, notes[i])
```

```cpp
for (int x : notes) {
    cout << x << "\n";
}
for (int i = 0; i < n; i++) {
    cout << i << " " << notes[i] << "\n";
}
```

La première boucle donne directement chaque valeur. La seconde donne la position `i`, et `notes[i]` est la valeur rangée à cette position. Parcourir par les positions est utile quand on a besoin de la position elle-même, ou quand on veut comparer une case avec sa **voisine**. Par exemple, pour comparer chaque case avec la précédente, `notes[i - 1]`, on fait commencer `i` à 1, car la case 0 n'a pas de précédente.

Pour parcourir une liste à l'envers, il suffit de faire varier la position de `N - 1` jusqu'à `0`.

## Afficher une liste sur une ligne

```python
for x in notes:
    print(x, end=" ")
print()
```

```cpp
for (int x : notes) {
    cout << x << " ";
}
cout << "\n";
```

En Python, `end=" "` demande à `print` d'écrire une espace au lieu de passer à la ligne. Le `print()` final passe à la ligne une fois que tout est affiché.

## Trouver le maximum

Pour trouver la plus grande valeur, on la cherche comme on le ferait à la main : on retient la plus grande valeur vue jusqu'ici, et on la remplace dès qu'on trouve mieux.

```python
plus_grand = notes[0]
for x in notes:
    if x > plus_grand:
        plus_grand = x
print(plus_grand)
```

```cpp
int plusGrand = notes[0];
for (int x : notes) {
    if (x > plusGrand) {
        plusGrand = x;
    }
}
cout << plusGrand << "\n";
```

On commence avec le premier élément de la liste, et pas avec 0 : si toutes les valeurs étaient négatives, 0 serait une mauvaise réponse. Python propose aussi `max(notes)`, mais il faut savoir le faire soi-même, car on veut souvent plus que la valeur : sa position, par exemple.

## Plusieurs parcours

Une liste garde les valeurs : tu peux donc la parcourir une première fois pour calculer quelque chose (une somme, un maximum), puis une seconde fois pour utiliser ce résultat sur chaque élément. C'est impossible avec une simple boucle de lecture.

## À retenir

- Une liste (un `vector` en C++) garde plusieurs valeurs ; les positions vont de `0` à `N - 1`.
- Lire une liste : `list(map(int, input().split()))` en Python ; `vector<int> v(n)` et une boucle de `cin` en C++.
- On parcourt par les valeurs (`for x in liste`) ou par les positions (`for i in range(n)`) ; avec les voisins, fais attention aux bornes.
- Pour un maximum, pars du premier élément et compare-le à tous les autres.
- Une liste permet de parcourir les données plusieurs fois.
