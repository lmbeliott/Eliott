Pour afficher 100 nombres, tu ne vas pas écrire 100 fois `print` ! Une **boucle** répète un bloc d'instructions autant de fois qu'il le faut. C'est grâce aux boucles qu'un programme de quelques lignes peut traiter des milliers de données.

## Répéter N fois : la boucle for

```python
for i in range(5):
    print("Bonjour")
```

```cpp
for (int i = 0; i < 5; i++) {
    cout << "Bonjour\n";
}
```

Ce programme affiche `Bonjour` cinq fois. Le bloc répété est, comme pour `if`, le bloc indenté en Python, ou entre accolades en C++. Chaque passage dans le bloc s'appelle un **tour** de boucle.

La variable `i` est le **compteur** de la boucle : elle vaut `0` au premier tour, `1` au deuxième, et ainsi de suite jusqu'à `4`. En Python, `range(5)` donne les nombres de 0 à 4 : il commence à 0 et s'arrête **avant** 5. En C++, la ligne `for` dit tout : on part de `i = 0`, on continue tant que `i < 5`, et `i++` ajoute 1 à `i` après chaque tour.

## Choisir les valeurs du compteur

On peut choisir où le compteur commence, où il s'arrête, et de combien il avance :

```python
for i in range(1, 6):
    print(i)
for i in range(10, 0, -2):
    print(i)
```

```cpp
for (int i = 1; i <= 5; i++) {
    cout << i << "\n";
}
for (int i = 10; i > 0; i -= 2) {
    cout << i << "\n";
}
```

La première boucle affiche 1, 2, 3, 4, 5. La seconde affiche 10, 8, 6, 4, 2 : elle part de 10 et recule de 2 à chaque tour. En Python, `range(début, fin, pas)` s'arrête toujours **juste avant** `fin`, même quand on recule.

## Lire N nombres

Souvent, l'entrée commence par un nombre `N`, suivi de `N` lignes contenant chacune un nombre. On lit `N`, puis on lit une ligne à chaque tour de boucle :

```python
n = int(input())
for i in range(n):
    x = int(input())
    print(x * 2)
```

```cpp
int n;
cin >> n;
for (int i = 0; i < n; i++) {
    int x;
    cin >> x;
    cout << x * 2 << "\n";
}
```

Ce programme affiche le double de chacun des `N` nombres. À chaque tour, `x` reçoit un nouveau nombre et oublie l'ancien.

## Accumuler un total

Pour faire une somme, on utilise un **accumulateur** : une variable qui commence à 0 **avant** la boucle, et à laquelle on ajoute quelque chose à chaque tour.

```python
total = 0
for jour in range(1, 8):
    total = total + jour
print(total)
```

```cpp
int total = 0;
for (int jour = 1; jour <= 7; jour++) {
    total = total + jour;
}
cout << total << "\n";
```

Ce programme calcule 1 + 2 + 3 + 4 + 5 + 6 + 7 et affiche `28`. Le résultat est affiché **après** la boucle, une seule fois. On peut écrire plus court `total += jour`, dans les deux langages.

## Compter

Un **compteur** fonctionne de la même façon, mais on ajoute 1 seulement quand une condition est vraie. Combien de multiples de 7 entre 1 et 100 ?

```python
compteur = 0
for i in range(1, 101):
    if i % 7 == 0:
        compteur = compteur + 1
print(compteur)
```

```cpp
int compteur = 0;
for (int i = 1; i <= 100; i++) {
    if (i % 7 == 0) {
        compteur = compteur + 1;
    }
}
cout << compteur << "\n";
```

Le programme affiche `14`. Regarde bien les décalages : le `if` est dans la boucle, et l'ajout de 1 est dans le `if`.

## Répéter tant que : la boucle while

Parfois, on ne sait pas à l'avance combien de tours il faudra. Yanis met 15 euros de côté chaque semaine pour s'offrir un forfait de ski à 200 euros. Combien de semaines doit-il attendre ?

```python
economies = 0
semaines = 0
while economies < 200:
    economies = economies + 15
    semaines = semaines + 1
print(semaines)
```

```cpp
int economies = 0;
int semaines = 0;
while (economies < 200) {
    economies = economies + 15;
    semaines = semaines + 1;
}
cout << semaines << "\n";
```

La boucle `while` vérifie la condition **avant** chaque tour. Tant qu'elle est vraie, le bloc est répété ; dès qu'elle devient fausse, la boucle s'arrête et le programme continue après. Ici, il affiche `14` : après 13 semaines, Yanis n'a que 195 euros.

Attention : si la condition ne devient jamais fausse, la boucle tourne sans fin et ton programme ne s'arrête pas. Vérifie que chaque tour rapproche de la sortie.

## À retenir

- `for i in range(n)` en Python, `for (int i = 0; i < n; i++)` en C++ : le bloc est répété `n` fois, avec `i` qui va de 0 à `n - 1`.
- `range(début, fin, pas)` s'arrête juste avant `fin`.
- Accumulateur et compteur : on les met à 0 **avant** la boucle, on les modifie **dans** la boucle, on les affiche **après**.
- `while condition` répète tant que la condition est vraie : assure-toi qu'elle finira par devenir fausse.
