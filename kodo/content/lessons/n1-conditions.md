Jusqu'ici, les programmes faisaient toujours la même chose, quelles que soient les données. Avec une **condition**, un programme peut faire des choix : afficher un message ou un autre, selon les nombres qu'il a lus.

## Si… sinon

Un test est réussi quand on obtient au moins 30 points :

```python
points = int(input())
if points >= 30:
    print("Test réussi")
else:
    print("Test raté")
```

```cpp
int points;
cin >> points;
if (points >= 30) {
    cout << "Test réussi\n";
} else {
    cout << "Test raté\n";
}
```

Si la condition `points >= 30` est vraie, le programme exécute le premier bloc ; sinon, il exécute le bloc du `else`. Jamais les deux.

En Python, les lignes du `if` et du `else` se terminent par deux-points `:`, et chaque bloc est **décalé vers la droite** (on dit « indenté ») de 4 espaces. C'est ce décalage qui indique quelles lignes font partie du bloc. En C++, la condition s'écrit entre parenthèses et le bloc entre accolades `{ }`.

Le `else` est facultatif : un `if` seul exécute son bloc quand la condition est vraie, et ne fait rien sinon.

## Les comparaisons

Une condition compare souvent deux valeurs. Les opérateurs sont les mêmes en Python et en C++ :

- `==` : égal à ;
- `!=` : différent de ;
- `<` et `>` : strictement plus petit, strictement plus grand ;
- `<=` et `>=` : plus petit ou égal, plus grand ou égal.

Attention au double égal : `x = 5` range 5 dans `x`, alors que `x == 5` **demande** si `x` vaut 5.

Les énoncés sont à lire avec soin : « au moins 8 » s'écrit `>= 8`, « plus de 8 » ou « strictement supérieur à 8 » s'écrit `> 8`, « au plus 8 » s'écrit `<= 8`.

Le reste de la division, `%`, est très utile dans les conditions. Par exemple, un nombre est pair quand le reste de sa division par 2 vaut 0 :

```python
n = int(input())
if n % 2 == 0:
    print("pair")
else:
    print("impair")
```

```cpp
int n;
cin >> n;
if (n % 2 == 0) {
    cout << "pair\n";
} else {
    cout << "impair\n";
}
```

## Plusieurs cas : elif

Quand il y a plus de deux cas, on enchaîne les tests avec `elif` en Python (contraction de « else if »), et `else if` en C++ :

```python
points = int(input())
if points < 30:
    print("Test raté")
elif points < 80:
    print("Test réussi")
else:
    print("Excellent")
```

```cpp
int points;
cin >> points;
if (points < 30) {
    cout << "Test raté\n";
} else if (points < 80) {
    cout << "Test réussi\n";
} else {
    cout << "Excellent\n";
}
```

Les tests sont faits **dans l'ordre**, et seul le premier test vrai est exécuté : les suivants sont sautés. Quand le programme arrive à `points < 80`, il sait donc déjà que `points` vaut au moins 30. Le `else` final attrape tous les cas qui restent.

L'ordre des tests compte : si on testait `points < 80` en premier, un test ne serait jamais annoncé comme raté.

En Python, la ligne du `elif` se termine aussi par deux-points `:`, et son bloc est indenté.

## Combiner des conditions

On peut assembler plusieurs conditions :

- `and` en Python, `&&` en C++ : vrai si les deux conditions sont vraies ;
- `or` en Python, `||` en C++ : vrai si au moins une des deux est vraie ;
- `not` en Python, `!` en C++ : inverse une condition.

Un parc ferme si le vent dépasse 60 km/h ou s'il fait moins de −20 degrés :

```python
vent, temperature = map(int, input().split())
if vent > 60 or temperature < -20:
    print("FERME")
else:
    print("OUVERT")
```

```cpp
int vent, temperature;
cin >> vent >> temperature;
if (vent > 60 || temperature < -20) {
    cout << "FERME\n";
} else {
    cout << "OUVERT\n";
}
```

Pour vérifier qu'un nombre est entre deux valeurs, Python accepte l'écriture des mathématiques : `12 <= age <= 17`. En C++, il faut écrire `12 <= age && age <= 17`. Attention : `12 <= age <= 17` est accepté par le compilateur C++, mais il ne fait pas du tout ce qu'on croit.

## Tester les cas limites

Une fois le programme écrit, on l'essaie avec les valeurs « frontières » : si la règle dit « au moins 30 », on teste 29, 30 et 31. C'est là que se cachent la plupart des erreurs.

## À retenir

- `if` / `else` permettent de choisir. En Python : deux-points et indentation ; en C++ : parenthèses et accolades.
- `==` compare, `=` range une valeur.
- Avec `elif` (`else if`), seul le premier test vrai est exécuté : l'ordre des tests compte.
- `and`, `or`, `not` en Python s'écrivent `&&`, `||`, `!` en C++. En C++, pas de `a <= x <= b` : on écrit `a <= x && x <= b`.
- Toujours tester les valeurs aux frontières.
