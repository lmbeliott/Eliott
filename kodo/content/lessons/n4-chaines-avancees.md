Chercher un motif de longueur `M` dans un texte de longueur `N` en comparant lettre à lettre à chaque position coûte O(N × M). Sur un texte comme `aaaa…a`, c'est le pire cas. Ce chapitre présente trois outils qui évitent ces comparaisons répétées : la fonction Z, le hachage polynomial et l'algorithme de Manacher.

## La fonction Z

Pour un mot `s` de longueur `n`, `z[i]` est la longueur du plus long préfixe commun à `s` et à `s[i:]`. Par exemple, pour `aabaab`, `z = [6, 1, 0, 3, 1, 0]`.

L'astuce : on garde la **boîte** `[g, d[` la plus à droite déjà trouvée, un morceau égal au début du mot. Si `i` est dans la boîte, `s[i..d-1]` est une copie de `s[i-g..d-g-1]`, donc `z[i]` vaut au moins `min(d - i, z[i - g])`. On prolonge ensuite lettre par lettre. Chaque lettre comparée avec succès fait avancer `d`, qui ne recule jamais : le tout est en **O(n)**.

```python
def fonction_z(s):
    n = len(s)
    z = [0] * n
    z[0] = n
    g, d = 0, 0
    for i in range(1, n):
        if i < d:
            z[i] = min(d - i, z[i - g])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > d:
            g, d = i, i + z[i]
    return z
```

```cpp
vector<int> fonctionZ(const string& s) {
    int n = s.size();
    vector<int> z(n, 0);
    z[0] = n;
    for (int i = 1, g = 0, d = 0; i < n; i++) {
        if (i < d) z[i] = min(d - i, z[i - g]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] > d) { g = i; d = i + z[i]; }
    }
    return z;
}
```

Pour trouver un motif `P` dans un texte `T`, on calcule la fonction Z de `P + "#" + T` : `P` commence à la position `i` du texte quand la valeur correspondante vaut `|P|`. La **fonction préfixe** de KMP (`π[i]` = plus long bord de `s[0..i]`) rend les mêmes services : les deux sont interchangeables.

Un mot de longueur `n` a la **période** `p` (`s[i] = s[i + p]` partout) exactement quand `z[p] = n - p`. Il s'écrit `U U … U` avec `|U| = p` si en plus `p` divise `n`.

## Le hachage polynomial

On associe à un mot un nombre, son **hachage** : `h(s) = s[0]·B^(k-1) + s[1]·B^(k-2) + … + s[k-1]`, modulo un grand nombre premier `M`. Avec les hachages des préfixes, celui de n'importe quel morceau se calcule en O(1). On compare alors deux morceaux en comparant deux nombres.

```python
M = (1 << 61) - 1
B = 911382323
h = [0] * (n + 1)          # h[i] = hachage de s[:i]
pw = [1] * (n + 1)         # pw[i] = B^i
for i in range(n):
    h[i + 1] = (h[i] * B + ord(s[i])) % M
    pw[i + 1] = pw[i] * B % M

def hache(a, b):           # hachage de s[a:b]
    return (h[b] - h[a] * pw[b - a]) % M
```

```cpp
typedef unsigned long long ull;
const ull M = (1ULL << 61) - 1, B = 911382323;
ull mulmod(ull a, ull b) {
    unsigned __int128 p = (unsigned __int128)a * b;
    ull r = (ull)(p & M) + (ull)(p >> 61);
    return r >= M ? r - M : r;
}
// h[i + 1] = (mulmod(h[i], B) + s[i]) % M ;  pw[i + 1] = mulmod(pw[i], B)
ull hache(int a, int b) { return (h[b] + M - mulmod(h[a], pw[b - a])) % M; }
```

Deux morceaux égaux ont le même hachage. L'inverse est seulement *très probable* : deux mots différents peuvent entrer en **collision**. Avec `k` hachages et un module `M`, il y a environ `k² / (2M)` paires en collision. Pour 50 000 fenêtres et `M ≈ 10⁹`, une collision est presque sûre. On prend donc `M = 2⁶¹ - 1`, ou deux modules d'environ 10⁹ à la fois. Les calculs « modulo 2⁶⁴ » par simple débordement des entiers sont à proscrire : le mot de Thue-Morse (`a`, `ab`, `abba`, `abbabaab`…, chaque étape ajoute la copie avec `a` et `b` échangés) produit des collisions pour toutes les bases.

Le hachage se marie bien avec la **dichotomie** : pour trouver la plus grande longueur qui vérifie une propriété monotone, on teste chaque longueur en O(N) avec un dictionnaire de hachages.

## Les palindromes : l'algorithme de Manacher

Pour savoir quels morceaux sont des palindromes, on insère un séparateur entre les lettres (`#a#b#a#`). Ainsi, tous les palindromes ont une lettre centrale. `p[i]` est le rayon du plus long palindrome centré en `i`. Comme pour la fonction Z, on garde le palindrome `[c - p[c], d]` qui va le plus loin à droite, et le miroir `2c - i` donne une valeur de départ.

```python
t = "#" + "#".join(s) + "#"
p = [0] * len(t)
c, d = 0, 0
for i in range(len(t)):
    if i < d:
        p[i] = min(d - i, p[2 * c - i])
    while i - p[i] - 1 >= 0 and i + p[i] + 1 < len(t) and t[i - p[i] - 1] == t[i + p[i] + 1]:
        p[i] += 1
    if i + p[i] > d:
        c, d = i, i + p[i]
```

```cpp
string t = "#";
for (char ch : s) { t += ch; t += '#'; }
int m = t.size();
vector<int> p(m, 0);
for (int i = 0, c = 0, d = 0; i < m; i++) {
    if (i < d) p[i] = min(d - i, p[2 * c - i]);
    while (i - p[i] - 1 >= 0 && i + p[i] + 1 < m && t[i - p[i] - 1] == t[i + p[i] + 1]) p[i]++;
    if (i + p[i] > d) { c = i; d = i + p[i]; }
}
```

Le palindrome centré en `i` mesure `p[i]` lettres dans le mot de départ et commence à la position `(i - p[i]) / 2`. Retirer la première et la dernière lettre d'un palindrome donne encore un palindrome : cette remarque permet de passer des palindromes maximaux à tous les autres.

## À retenir

- Fonction Z et fonction préfixe : en O(N), le plus long préfixe commun en chaque position, les occurrences d'un motif, les périodes.
- Hachage polynomial : comparer deux morceaux en O(1). Grand module premier (`2⁶¹ - 1`) ou double module, jamais le débordement modulo 2⁶⁴.
- Hachage + dichotomie sur la longueur : la méthode type pour « la plus longue sous-chaîne qui… ».
- Manacher : tous les palindromes maximaux en O(N), grâce au même principe de boîte que la fonction Z.
