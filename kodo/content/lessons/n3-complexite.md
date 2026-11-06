Désormais, un programme juste ne suffit plus : il doit aussi être **rapide**, sinon il échoue sur les grands tests. Heureusement, on peut prévoir sa vitesse avant de l'écrire, en comptant ses opérations.

## Estimer le nombre d'opérations

Retiens ces ordres de grandeur : en une seconde, un programme C++ fait environ 10⁸ opérations simples, et un programme Python environ 10⁷ (et encore moins dans le navigateur).

On décrit la vitesse d'un algorithme par sa **complexité**, notée O(…) : on compte les opérations en fonction de la taille N de l'entrée, en ne gardant que le terme le plus gros. Une boucle sur N éléments est en O(N). Deux boucles imbriquées sur N éléments font N × N tours : O(N²).

Avant de coder, remplace N par sa valeur maximale :

| N maximal | complexité qui passe |
| --- | --- |
| 10 | O(N!), on peut tout essayer |
| 20 | O(2ᴺ) |
| 500 | O(N³) |
| 5 000 | O(N²) |
| 100 000 et plus | O(N log N) ou O(N) |

Avec N = 50 000, une double boucle fait 2,5 × 10⁹ tours : plusieurs minutes en Python. De grandes contraintes sont un message : il faut une idée plus maligne.

## Les sommes préfixes

On a N nombres et beaucoup de questions « quelle est la somme des cases de A à B ? ». Refaire l'addition coûte jusqu'à N opérations par question.

L'astuce : calculer une fois pour toutes `pref[i]`, la somme des i premiers nombres, avec `pref[0] = 0`. Alors la somme des cases A à B (numérotées à partir de 1) vaut `pref[B] − pref[A − 1]` : une seule soustraction.

```python
t = [4, 1, 3, 0, 5]
n = len(t)
pref = [0] * (n + 1)
for i in range(n):
    pref[i + 1] = pref[i] + t[i]
# pref vaut [0, 4, 5, 8, 8, 13]
a, b = 2, 4
print(pref[b] - pref[a - 1])     # 1 + 3 + 0 = 4
```

```cpp
vector<int> t = {4, 1, 3, 0, 5};
int n = t.size();
vector<long long> pref(n + 1, 0);
for (int i = 0; i < n; i++) {
    pref[i + 1] = pref[i] + t[i];
}
// pref vaut 0 4 5 8 8 13
int a = 2, b = 4;
cout << pref[b] - pref[a - 1] << "\n";   // 1 + 3 + 0 = 4
```

Construire `pref` coûte O(N), puis chaque question coûte O(1). Avec Q questions : O(N + Q) au lieu de O(N × Q).

Les sommes préfixes servent aussi à **compter**. Une portion de A à B a une somme nulle exactement quand `pref[B] = pref[A − 1]`. Pour compter ces portions, on parcourt les `pref` dans l'ordre en notant dans un dictionnaire combien de fois chaque valeur est déjà apparue : chaque nouvelle valeur forme une paire avec toutes ses apparitions précédentes.

## Deux pointeurs et fenêtre glissante

Cherchons la plus longue suite de cases consécutives dont la somme ne dépasse pas une limite, avec des nombres **positifs**. Essayer chaque début et chaque fin, c'est O(N²).

On garde plutôt une **fenêtre** de `debut` à `fin` et sa somme. On avance `fin` d'une case à la fois. Si la fenêtre devient trop lourde, on avance `debut` jusqu'à ce qu'elle redevienne correcte. Comme les nombres sont positifs, allonger une fenêtre trop lourde ne la rend jamais correcte : `debut` n'a jamais besoin de reculer.

```python
t = [2, 5, 1, 1, 3, 6, 1]
limite = 10
debut = 0
somme = 0
meilleur = 0
for fin in range(len(t)):
    somme += t[fin]
    while somme > limite:
        somme -= t[debut]
        debut += 1
    meilleur = max(meilleur, fin - debut + 1)
print(meilleur)    # 4, par exemple 5 + 1 + 1 + 3 = 10
```

```cpp
vector<int> t = {2, 5, 1, 1, 3, 6, 1};
int limite = 10;
int debut = 0, somme = 0, meilleur = 0;
for (int fin = 0; fin < (int)t.size(); fin++) {
    somme += t[fin];
    while (somme > limite) {
        somme -= t[debut];
        debut++;
    }
    meilleur = max(meilleur, fin - debut + 1);
}
cout << meilleur << "\n";   // 4, par exemple 5 + 1 + 1 + 3 = 10
```

Il y a une boucle `while` dans une boucle `for`, et pourtant c'est O(N) : `fin` avance N fois, et `debut` avance au plus N fois **en tout**. Pour compter les opérations, on regarde combien de fois chaque pointeur bouge, pas la forme des boucles.

La même idée marche avec d'autres conditions, par exemple « la fenêtre contient toutes les lettres ». Il suffit de tenir à jour, à chaque pas, ce qu'on sait de la fenêtre (une somme, des compteurs…) au lieu de le recalculer.

## À retenir

- Avant de coder, remplace N par son maximum dans la complexité : en Python, vise au plus quelques millions d'opérations.
- Les sommes préfixes donnent la somme de n'importe quelle portion en O(1), après un calcul en O(N).
- Une somme de portion se ramène à une différence de deux `pref` : avec un dictionnaire, on compte les portions qui ont une somme donnée.
- Deux pointeurs qui n'avancent que vers la droite coûtent O(N) en tout, même avec une boucle dans une boucle.
- Pense aux dépassements : avec de grandes sommes, utilise des `long long` en C++.
