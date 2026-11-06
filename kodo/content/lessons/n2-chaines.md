Une **chaîne de caractères** (en anglais *string*), c'est du texte : un mot, une phrase, un code secret. Dans ce chapitre, tu vas apprendre à lire un texte lettre par lettre, à tester ses lettres et à fabriquer de nouveaux mots.

## Une chaîne, c'est une liste de lettres

Une chaîne se manipule presque comme une liste. Chaque caractère a un **indice**, qui commence à `0`. La longueur s'obtient avec `len(mot)` en Python et `mot.size()` en C++.

```python
mot = "bonjour"
print(len(mot))            # 7
print(mot[0])              # b : le premier caractère
print(mot[len(mot) - 1])   # r : le dernier caractère
```

```cpp
string mot = "bonjour";
cout << mot.size() << "\n";            // 7
cout << mot[0] << "\n";                // b : le premier caractère
cout << mot[mot.size() - 1] << "\n";   // r : le dernier caractère
```

Le dernier indice est `len(mot) - 1`, pas `len(mot)` : lire `mot[len(mot)]` est une erreur classique.

## Parcourir une chaîne

Pour examiner chaque lettre, on utilise une boucle, exactement comme pour une liste. Ici, on compte les `e` d'un mot :

```python
mot = input()
nb = 0
for c in mot:
    if c == "e":
        nb += 1
print(nb)
```

```cpp
string mot;
cin >> mot;
int nb = 0;
for (char c : mot) {
    if (c == 'e') {
        nb++;
    }
}
cout << nb << "\n";
```

En C++, un caractère seul s'écrit entre apostrophes (`'e'`, de type `char`) et une chaîne entre guillemets (`"bonjour"`, de type `string`). En Python, les deux s'écrivent indifféremment avec `"` ou `'`.

Quand tu as besoin de la position de la lettre (pour regarder sa voisine, ou pour parcourir le mot à l'envers), boucle plutôt sur les indices : `for i in range(len(mot))` en Python, `for (int i = 0; i < (int)mot.size(); i++)` en C++.

## Tester une lettre

On compare des caractères avec `==` et `!=`. Pour savoir si une lettre fait partie d'un groupe, Python offre un raccourci : `c in "aeiouy"` est vrai si `c` est l'une de ces lettres. En C++, on enchaîne les tests avec `||` (« ou ») : `c == 'a' || c == 'e' || …`.

Les caractères se comparent aussi avec `<` et `>` : l'ordre est celui de l'alphabet, donc `'a' <= c && c <= 'z'` (en Python : `"a" <= c <= "z"`) teste si `c` est une lettre minuscule.

## Construire une nouvelle chaîne

En Python, on ne peut pas modifier une lettre d'une chaîne (`mot[0] = "x"` provoque une erreur). On fabrique plutôt une nouvelle chaîne, en partant de `""` et en ajoutant les caractères un par un avec `+`. Voici un mot écrit à l'envers :

```python
mot = "crayon"
envers = ""
for i in range(len(mot) - 1, -1, -1):
    envers = envers + mot[i]
print(envers)   # noyarc
```

```cpp
string mot = "crayon";
string envers = "";
for (int i = (int)mot.size() - 1; i >= 0; i--) {
    envers += mot[i];
}
cout << envers << "\n";   // noyarc
```

Deux chaînes se comparent directement avec `==` : `envers == mot` est vrai si les deux mots sont identiques.

## Les lettres sont des nombres

L'ordinateur range chaque caractère sous la forme d'un nombre, son **code**. Les lettres de `a` à `z` ont des codes qui se suivent. On peut donc calculer le numéro d'une lettre dans l'alphabet (`0` pour `a`, `25` pour `z`), faire un calcul dessus, puis revenir à une lettre. Voici comment remplacer une lettre par la suivante, `z` redevenant `a` grâce au modulo :

```python
c = "z"
numero = ord(c) - ord("a")         # 25
numero = (numero + 1) % 26         # 0
print(chr(ord("a") + numero))      # a
```

```cpp
char c = 'z';
int numero = c - 'a';              // 25
numero = (numero + 1) % 26;        // 0
cout << (char)('a' + numero) << "\n";   // a
```

En Python, `ord` donne le code d'un caractère et `chr` fait l'inverse. En C++, un `char` est déjà un petit nombre : on peut directement faire `c - 'a'`.

## Lire du texte

`input()` en Python lit **toute une ligne**, espaces compris. En C++, `cin >> mot` lit un seul mot (il s'arrête au premier espace) ; pour une ligne entière, on utilise `getline(cin, ligne)`. Attention : après un `cin >> n`, le retour à la ligne n'a pas encore été lu. Ajoute `cin.ignore();` avant le `getline`, sinon tu obtiens une ligne vide.

```python
n = int(input())
phrase = input()          # toute la ligne
mots = phrase.split()     # découpée en liste de mots
```

```cpp
int n;
cin >> n;
cin.ignore();             // saute le retour à la ligne après n
string phrase;
getline(cin, phrase);     // toute la ligne
```

## À retenir

- Les caractères d'une chaîne sont numérotés à partir de `0` ; le dernier est à l'indice `len(mot) - 1`.
- On parcourt une chaîne avec une boucle, comme une liste, et on compare les caractères avec `==`, `<`, `>`.
- Pour fabriquer un mot, on part de `""` et on ajoute les caractères un par un.
- `ord(c) - ord("a")` (Python) ou `c - 'a'` (C++) donne le numéro d'une lettre ; le modulo `% 26` permet de faire le tour de l'alphabet.
- En C++, `cin >> mot` lit un mot, `getline` lit une ligne entière.
