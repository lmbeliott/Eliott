Dans le jeu du nombre mystère, quelqu'un choisit un nombre entre 1 et 1 000 et répond « plus grand » ou « plus petit » à chaque proposition. En proposant toujours le milieu des valeurs encore possibles, on élimine la moitié des candidats à chaque fois : 10 questions suffisent, car 2¹⁰ = 1 024. C'est la **dichotomie**. Avec N valeurs possibles, il faut environ log₂(N) étapes : 17 pour 100 000, 60 pour 10¹⁸.

## Chercher dans une liste triée

Dans une liste triée `t`, la condition `t[i] >= x` est fausse au début de la liste, puis vraie jusqu'à la fin. On cherche le **premier indice où elle devient vraie**. Cet indice est aussi le nombre de valeurs strictement inférieures à x.

On garde un intervalle `[gauche, droite)` qui contient la réponse. Au départ, `droite = len(t)` : la réponse vaut `len(t)` si toutes les valeurs sont plus petites que x.

```python
def premier_au_moins(t, x):
    # premier indice i tel que t[i] >= x (len(t) s'il n'y en a pas)
    gauche, droite = 0, len(t)
    while gauche < droite:
        milieu = (gauche + droite) // 2
        if t[milieu] < x:
            gauche = milieu + 1   # la réponse est après milieu
        else:
            droite = milieu       # milieu est peut-être la réponse
    return gauche

t = [3, 7, 7, 12, 20]
print(premier_au_moins(t, 7))     # 1 : une seule valeur < 7
print(premier_au_moins(t, 13))    # 4
```

```cpp
// premier indice i tel que t[i] >= x (t.size() s'il n'y en a pas)
int premier_au_moins(const vector<int>& t, int x) {
    int gauche = 0, droite = t.size();
    while (gauche < droite) {
        int milieu = (gauche + droite) / 2;
        if (t[milieu] < x) gauche = milieu + 1; // la réponse est après milieu
        else droite = milieu;                   // milieu est peut-être la réponse
    }
    return gauche;
}
// avec t = {3, 7, 7, 12, 20} : renvoie 1 pour x = 7, et 4 pour x = 13
```

L'intervalle rétrécit à chaque tour : la boucle s'arrête toujours. Pour compter les entiers **égaux** à x : `premier_au_moins(t, x + 1) − premier_au_moins(t, x)`.

Cette fonction existe déjà (`bisect_left` en Python, `lower_bound` en C++), mais il faut savoir l'écrire : la même boucle sert ailleurs. Et la liste doit être **triée** : on la trie d'abord, une fois, en O(N log N) ; chaque recherche coûte ensuite O(log N) au lieu de O(N).

## Chercher la réponse elle-même

Beaucoup de problèmes demandent « la plus petite valeur qui marche » : le plus petit temps, la plus petite capacité… Calculer la réponse directement est difficile, mais **vérifier** si une valeur v convient est facile. Et si v convient, v + 1 convient aussi : les réponses à « v convient-il ? » sont non, non, …, non, oui, oui, oui.

On cherche le premier « oui » par dichotomie, sans liste. On garde deux bornes : `trop_petit` ne convient pas, `suffisant` convient. On teste le milieu et on déplace la borne correspondante, jusqu'à ce qu'elles soient voisines.

Exemple : la plus petite longueur de côté v telle qu'un carré de côté v ait une aire d'au moins N.

```python
n = 1000
def convient(v):
    return v * v >= n

trop_petit = 0       # 0 * 0 < n : ne convient pas (n >= 1)
suffisant = n        # n * n >= n : convient
while suffisant - trop_petit > 1:
    milieu = (trop_petit + suffisant) // 2
    if convient(milieu):
        suffisant = milieu
    else:
        trop_petit = milieu
print(suffisant)     # 32, car 31 * 31 = 961 et 32 * 32 = 1024
```

```cpp
long long n = 1000;
auto convient = [&](long long v) { return v * v >= n; };

long long trop_petit = 0; // 0 * 0 < n : ne convient pas (n >= 1)
long long suffisant = n;  // n * n >= n : convient
while (suffisant - trop_petit > 1) {
    long long milieu = trop_petit + (suffisant - trop_petit) / 2;
    if (convient(milieu)) suffisant = milieu;
    else trop_petit = milieu;
}
cout << suffisant << "\n"; // 32, car 31 * 31 = 961 et 32 * 32 = 1024
```

Le coût total vaut (nombre de tours) × (coût d'une vérification) : pour une réponse jusqu'à 10¹⁸ et une vérification en O(N), environ 60 × N opérations. Souvent, la vérification est un petit glouton : « avec une limite v, combien de jours faut-il au minimum ? ».

## Les pièges classiques

- **Les bornes de départ.** Vérifier que `trop_petit` ne convient pas et que `suffisant` convient.
- **La boucle infinie.** Ne pas mélanger les deux modèles : `gauche = milieu + 1` / `droite = milieu` avec `while gauche < droite`, et `suffisant = milieu` / `trop_petit = milieu` avec `while suffisant - trop_petit > 1`.
- **Les dépassements en C++.** Les bornes peuvent dépasser 2³¹ : il faut des `long long`. Dans la vérification, une somme peut même dépasser 2⁶³ : on l'arrête dès que la réponse « oui » est certaine.

## À retenir

- La dichotomie divise l'intervalle de recherche par deux à chaque étape : O(log N) étapes.
- Dans une liste triée, on cherche le premier indice où une condition devient vraie, avec un intervalle `[gauche, droite)`.
- Quand la question « v convient-il ? » passe de non à oui une seule fois, on peut chercher la réponse par dichotomie, même sans liste.
- Des bornes sûres, un seul modèle de boucle, et des `long long` en C++.
