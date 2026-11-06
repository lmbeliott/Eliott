Classer des coureurs, compter les votes d'un concours, ranger des mots par familles : trier et compter sont deux gestes que l'on retrouve partout. Les deux langages font déjà le gros du travail pour toi, il suffit de savoir s'en servir.

## Trier une liste

En Python, `liste.sort()` trie la liste sur place, du plus petit au plus grand. En C++, on utilise `sort` sur un `vector`, en indiquant le début et la fin de ce qu'il faut trier.

```python
temps = [5412, 4987, 5120, 6003]
temps.sort()
print(temps)        # [4987, 5120, 5412, 6003]
temps.sort(reverse=True)
print(temps[0])     # 6003 : le plus grand
```

```cpp
vector<int> temps = {5412, 4987, 5120, 6003};
sort(temps.begin(), temps.end());              // 4987 5120 5412 6003
sort(temps.begin(), temps.end(), greater<int>());
cout << temps[0] << "\n";                      // 6003 : le plus grand
```

Les chaînes se trient dans l'ordre alphabétique. Attention donc aux nombres lus comme du texte : `"950"` passe **après** `"1000"`, car on compare d'abord `"9"` et `"1"`. Pense à convertir avec `int` avant de trier.

## Trier selon plusieurs critères

Souvent, on trie des éléments qui portent plusieurs informations, comme un prénom et un temps. On les range dans des **couples** : un tuple en Python, une `pair` en C++. Deux couples se comparent d'abord par leur premier élément, et seulement en cas d'égalité par le second. On place donc en premier ce qui doit décider du classement.

Pour trier par score **décroissant** puis par nom **croissant**, une astuce : on trie les couples `(-score, nom)` dans l'ordre croissant normal. Le plus grand score a le plus petit `-score`, et il passe devant.

```python
equipes = [("yeti", 7), ("aigle", 9), ("igloo", 7)]
classement = []
for nom, score in equipes:
    classement.append((-score, nom))
classement.sort()
for moins_score, nom in classement:
    print(nom, -moins_score)    # aigle 9, igloo 7, yeti 7
```

```cpp
vector<pair<string, int>> equipes = {{"yeti", 7}, {"aigle", 9}, {"igloo", 7}};
vector<pair<int, string>> classement;
for (auto& e : equipes) {
    classement.push_back({-e.second, e.first});
}
sort(classement.begin(), classement.end());
for (auto& c : classement) {
    cout << c.second << " " << -c.first << "\n";   // aigle 9, igloo 7, yeti 7
}
```

## Compter avec un tableau de compteurs

Quand les valeurs à compter sont des petits entiers ou des lettres, un tableau suffit : la case `k` compte combien de fois la valeur `k` apparaît. Pour les lettres, on utilise 26 cases, et la lettre `c` va dans la case `ord(c) - ord("a")` (en C++ : `c - 'a'`).

```python
compte = [0] * 26
for c in "marmotte":
    compte[ord(c) - ord("a")] += 1
print(compte[ord("m") - ord("a")])   # 2
```

```cpp
vector<int> compte(26, 0);
string mot = "marmotte";
for (char c : mot) {
    compte[c - 'a']++;
}
cout << compte['m' - 'a'] << "\n";   // 2
```

## Compter avec un dictionnaire

Quand les valeurs sont des mots, ou des nombres trop grands pour un tableau, on utilise un **dictionnaire** : il associe à chaque **clé** une **valeur**. En Python, il faut créer la clé avant de l'augmenter. En C++, une `map` crée automatiquement une clé absente avec la valeur `0`, et elle garde ses clés triées.

```python
votes = ["yeti", "aigle", "yeti", "igloo", "yeti"]
compte = {}
for v in votes:
    if v not in compte:
        compte[v] = 0
    compte[v] += 1
for nom in sorted(compte):
    print(nom, compte[nom])   # aigle 1, igloo 1, yeti 3
```

```cpp
vector<string> votes = {"yeti", "aigle", "yeti", "igloo", "yeti"};
map<string, int> compte;
for (string v : votes) {
    compte[v]++;
}
for (auto& p : compte) {
    cout << p.first << " " << p.second << "\n";   // aigle 1, igloo 1, yeti 3
}
```

En Python, un dictionnaire se parcourt dans l'ordre où les clés ont été ajoutées : `sorted(compte)` donne les clés dans l'ordre alphabétique. En C++, `unordered_map` s'utilise comme `map`, un peu plus rapidement, mais ses clés ne sont rangées dans aucun ordre particulier.

## Regrouper

Un dictionnaire peut aussi contenir des **listes** : on range ensemble les éléments qui partagent une même propriété, appelée la clé. Ici, on regroupe des mots selon leur longueur :

```python
groupes = {}
for mot in ["lac", "col", "piolet", "neige", "luge"]:
    cle = len(mot)
    if cle not in groupes:
        groupes[cle] = []
    groupes[cle].append(mot)
print(groupes[3])   # ['lac', 'col']
```

```cpp
map<int, vector<string>> groupes;
for (string mot : {"lac", "col", "piolet", "neige", "luge"}) {
    groupes[mot.size()].push_back(mot);
}
cout << groupes[3][0] << " " << groupes[3][1] << "\n";   // lac col
```

Tout l'art du regroupement est de bien choisir la clé : une valeur que l'on calcule pour chaque élément, et qui est la même pour deux éléments exactement quand ils doivent être dans le même groupe.

## À retenir

- `sort` range une liste dans l'ordre croissant ; les chaînes se comparent dans l'ordre alphabétique.
- Les couples se trient d'abord par leur premier élément : mets-y le critère principal, et `-score` pour un ordre décroissant.
- Pour compter des lettres ou des petits entiers, un tableau de compteurs suffit ; pour des mots, utilise un dictionnaire.
- Un dictionnaire de listes regroupe les éléments qui ont la même clé.
