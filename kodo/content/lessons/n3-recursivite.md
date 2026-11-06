Une fonction **récursive** est une fonction qui s'appelle elle-même. C'est l'outil idéal pour explorer toutes les possibilités d'un problème : choisir un premier élément, puis laisser la fonction s'occuper du reste.

## Une fonction qui s'appelle elle-même

Le nombre de façons de ranger N skis différents sur un râtelier vaut N! = N × (N − 1) × … × 1. On peut le définir à partir d'un problème plus petit : N! = N × (N − 1)!, et 0! = 1.

```python
def factorielle(n):
    if n == 0:
        return 1                       # cas de base : on s'arrête
    return n * factorielle(n - 1)      # appel sur un problème plus petit

print(factorielle(5))   # 120
```

```cpp
long long factorielle(int n) {
    if (n == 0) return 1;              // cas de base : on s'arrête
    return n * factorielle(n - 1);     // appel sur un problème plus petit
}
// factorielle(5) vaut 120
```

Deux règles à respecter : il faut un **cas de base** qui ne s'appelle pas, et chaque appel doit se rapprocher de ce cas. Sinon, la fonction s'appelle sans fin et le programme plante. En Python, la profondeur est limitée à environ 1 000 appels imbriqués : pour aller plus loin, il faut `sys.setrecursionlimit`, ou une boucle.

## Énumérer toutes les possibilités

Pour afficher tous les ordres possibles de N randonneurs (les **permutations**), on remplit les places une par une. La fonction `explorer` choisit qui occupe la place suivante parmi ceux qui ne sont pas encore placés, appelle `explorer` pour la suite, puis **annule** son choix pour essayer le suivant.

```python
n = 3
ordre = []
place = [False] * (n + 1)

def explorer():
    if len(ordre) == n:
        print(*ordre)                 # une permutation complète
        return
    for r in range(1, n + 1):
        if not place[r]:
            place[r] = True           # choisir
            ordre.append(r)
            explorer()                # explorer la suite
            ordre.pop()               # annuler le choix
            place[r] = False

explorer()   # 1 2 3, 1 3 2, 2 1 3, 2 3 1, 3 1 2, 3 2 1
```

```cpp
int n = 3;
vector<int> ordre;
vector<bool> place(n + 1, false);

void explorer() {
    if ((int)ordre.size() == n) {     // une permutation complète
        for (int r : ordre) cout << r << " ";
        cout << "\n";
        return;
    }
    for (int r = 1; r <= n; r++) {
        if (!place[r]) {
            place[r] = true;          // choisir
            ordre.push_back(r);
            explorer();               // explorer la suite
            ordre.pop_back();         // annuler le choix
            place[r] = false;
        }
    }
}
```

Les choix sont essayés du plus petit au plus grand à chaque place, donc les permutations sortent dans l'**ordre lexicographique** (l'ordre du dictionnaire), sans tri. C'est souvent l'ordre demandé dans les énoncés.

On peut se représenter tous ces appels comme un **arbre** : la racine est la liste vide, chaque appel est un nœud, et chaque choix est une branche. Il y a N! feuilles : 3 628 800 pour N = 10. L'énumération complète n'est donc possible que pour de petites valeurs de N.

## Revenir en arrière et élaguer

Le **retour sur trace** (backtracking) consiste à abandonner une branche dès qu'on sait qu'elle ne mènera à aucune solution. Cela s'appelle **élaguer** : on coupe une branche entière de l'arbre, avec tous ses descendants.

Par exemple, pour trouver les sacs dont le poids total vaut exactement S, on décide pour chaque sac « je le prends » ou « je le laisse ». Si le poids dépasse déjà S, inutile de continuer : les poids sont positifs, il ne fera qu'augmenter.

```python
poids = [5, 3, 4, 2]
S = 7
choisis = []

def chercher(i, total):
    if total > S:
        return                        # élagage : trop lourd, on abandonne
    if i == len(poids):
        if total == S:
            print(choisis)
        return
    choisis.append(poids[i])          # prendre le sac i
    chercher(i + 1, total + poids[i])
    choisis.pop()
    chercher(i + 1, total)            # laisser le sac i

chercher(0, 0)   # [5, 2] puis [3, 4]
```

```cpp
vector<int> poids = {5, 3, 4, 2};
int S = 7;
vector<int> choisis;

void chercher(int i, int total) {
    if (total > S) return;            // élagage : trop lourd, on abandonne
    if (i == (int)poids.size()) {
        if (total == S) {
            for (int p : choisis) cout << p << " ";
            cout << "\n";
        }
        return;
    }
    choisis.push_back(poids[i]);      // prendre le sac i
    chercher(i + 1, total + poids[i]);
    choisis.pop_back();
    chercher(i + 1, total);           // laisser le sac i
}
```

Un bon élagage change tout : sur certains problèmes, il réduit des milliards de cas à quelques milliers. Pour bien élaguer, demande-toi : « avec ce début, est-il encore possible de trouver une solution, ou une solution meilleure que la meilleure déjà trouvée ? » Si la réponse est non, on remonte. Deux astuces aident souvent : traiter d'abord les éléments les plus contraignants (les plus gros, les plus rares), et ne pas essayer deux choix identiques qui mèneraient aux mêmes solutions.

## À retenir

- Une fonction récursive a toujours un cas de base, et chaque appel se rapproche de ce cas.
- Pour énumérer : choisir, explorer la suite, annuler le choix. Essayer les choix dans l'ordre croissant donne l'ordre lexicographique.
- Le nombre de possibilités explose vite (N!, 2ᴺ) : la recherche complète ne marche que pour N petit.
- Élaguer, c'est abandonner une branche dès qu'elle ne peut plus rien donner : c'est ce qui rend le retour sur trace rapide.
