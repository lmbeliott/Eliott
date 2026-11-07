Un programme est une liste d'ordres donnés à l'ordinateur. L'ordre le plus simple, et le premier à connaître, consiste à **afficher** quelque chose à l'écran : un mot, une phrase, un nombre. C'est aussi par l'affichage qu'un programme communique son résultat : sur Kodo, le correcteur lit ce que le programme affiche et le compare à la réponse attendue.

Ce chapitre montre comment afficher du texte et des nombres, comment enchaîner plusieurs instructions, comment mettre plusieurs valeurs sur une même ligne et comment dessiner de petites figures avec des caractères. À la fin, on saura par exemple écrire un programme qui affiche ce cadre suivi de sa largeur :

```python
print("+-----+")
print("|.....|")
print("+-----+")
print("Largeur :", 7)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "+-----+" << "\n";
    cout << "|.....|" << "\n";
    cout << "+-----+" << "\n";
    cout << "Largeur :" << " " << 7 << "\n";
    return 0;
}
```

Tout le cours est écrit dans les deux langages proposés par le site, Python et C++. Il suffit de lire celui qu'on a choisi.

## Afficher du texte

En Python, on affiche un texte avec `print`, suivi de parenthèses qui contiennent le texte entre guillemets :

```python
print("Bonjour")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Bonjour" << "\n";
    return 0;
}
```

Ce programme affiche :

```
Bonjour
```

Une ligne de programme comme `print("Bonjour")` s'appelle une **instruction** : c'est un ordre que l'ordinateur exécute. Le texte placé entre guillemets s'appelle une **chaîne de caractères**. Les guillemets ne sont pas affichés : ils servent seulement à indiquer où le texte commence et où il se termine. Tout ce qui se trouve entre eux est recopié tel quel, espaces et signes de ponctuation compris.

En C++, un programme a toujours la même forme générale, qu'il faut écrire à chaque fois :

- `#include <iostream>` demande d'utiliser la partie de C++ qui gère l'affichage et la lecture ;
- `using namespace std;` permet d'écrire `cout` au lieu de `std::cout` ;
- `int main() { … }` est la partie principale du programme : les instructions s'écrivent entre les accolades ;
- `return 0;` termine le programme en signalant que tout s'est bien passé.

L'affichage lui-même se fait avec `cout` (pour *console output*), suivi de `<<` puis de ce qu'on veut afficher. On peut enchaîner plusieurs `<<` à la suite. Le texte `"\n"` est un caractère spécial, le **retour à la ligne** : il fait passer à la ligne suivante. En Python, `print` va à la ligne tout seul à la fin ; en C++, il faut le demander. Enfin, chaque instruction C++ se termine par un point-virgule `;`. C'est lui, et non le passage à la ligne, qui marque la fin de l'instruction : une instruction trop longue peut donc s'écrire sur plusieurs lignes.

## Une suite d'instructions

Un programme contient en général plusieurs instructions, écrites les unes sous les autres. L'ordinateur les exécute **dans l'ordre**, de haut en bas, une seule fois chacune. Une telle suite d'instructions s'appelle une **séquence**.

```python
print("un")
print("deux")
print("trois")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "un" << "\n";
    cout << "deux" << "\n";
    cout << "trois" << "\n";
    return 0;
}
```

Ce programme affiche :

```
un
deux
trois
```

Chaque `print` produit une nouvelle ligne, car Python passe à la ligne après chaque affichage. En C++, c'est le `"\n"` placé à la fin de chaque instruction qui crée les trois lignes. Si on échange deux instructions, on échange les deux lignes affichées : l'ordre des instructions est exactement l'ordre de l'affichage.

En C++, comme les retours à la ligne ne sont pas automatiques, on peut aussi construire une seule ligne en plusieurs instructions : `cout << "ab";` puis `cout << "cd" << "\n";` affichent `abcd` sur une seule ligne.

## Afficher des nombres

Pour afficher un nombre entier, on l'écrit **sans guillemets** :

```python
print(2026)
print(-15)
print(1000000)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << 2026 << "\n";
    cout << -15 << "\n";
    cout << 1000000 << "\n";
    return 0;
}
```

Ce programme affiche :

```
2026
-15
1000000
```

Un nombre écrit sans guillemets est une valeur numérique : l'ordinateur sait que c'est un nombre et pourra plus tard calculer avec. À l'écran, `print(2026)` et `print("2026")` donnent la même chose, mais ce sont deux valeurs de nature différente : la première est un **entier**, la seconde est une chaîne de quatre caractères. La différence deviendra importante au chapitre sur les calculs.

On n'écrit jamais d'espace à l'intérieur d'un nombre : `1 000 000` n'est pas un nombre valide en Python ni en C++. On écrit `1000000`.

## Plusieurs valeurs sur une même ligne

En Python, on peut donner plusieurs valeurs à `print`, séparées par des virgules. Elles sont affichées sur la même ligne, séparées par une espace :

```python
print("Il reste", 3, "places")
print(1, 2, 4, 8)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Il reste" << " " << 3 << " " << "places" << "\n";
    cout << 1 << " " << 2 << " " << 4 << " " << 8 << "\n";
    return 0;
}
```

Ce programme affiche :

```
Il reste 3 places
1 2 4 8
```

En Python, l'espace entre deux valeurs est ajoutée automatiquement : il ne faut donc pas en mettre dans les guillemets, sinon on en obtient deux. En C++, rien n'est ajouté automatiquement : `cout << 1 << 2` affiche `12`, collés. Il faut écrire l'espace soi-même, avec `" "`. On peut aussi l'inclure dans un texte : `cout << "Il reste " << 3 << " places\n";` affiche la même ligne : le retour à la ligne `\n` peut, lui aussi, s'écrire à l'intérieur d'un texte.

C'est la façon habituelle d'afficher une liste de nombres sur une ligne, par exemple les premiers termes d'une suite.

## Lignes vides

Pour sauter une ligne, on affiche une ligne qui ne contient rien. En Python, c'est `print()` avec des parenthèses vides ; en C++, c'est un simple retour à la ligne :

```python
print("haut")
print()
print("bas")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "haut" << "\n";
    cout << "\n";
    cout << "bas" << "\n";
    return 0;
}
```

Ce programme affiche trois lignes : `haut`, une ligne vide, puis `bas`.

Sur Kodo, le correcteur compare la sortie **mot à mot** : les espaces et les lignes vides en trop sont ignorés. Une ligne vide sert donc à rendre un affichage plus lisible pour un humain, mais ne change pas le verdict. En revanche, les mots et les nombres doivent être exactement ceux demandés, dans le bon ordre, avec les majuscules et minuscules demandées.

## Les commentaires

Un **commentaire** est un texte écrit dans le programme pour le lecteur humain, que l'ordinateur ignore. En Python, il commence par `#` et va jusqu'à la fin de la ligne. En C++, il commence par `//`.

```python
# Première ligne de la figure
print("*")
print("**")  # deuxième ligne
```

```cpp
#include <iostream>
using namespace std;

int main() {
    // Première ligne de la figure
    cout << "*" << "\n";
    cout << "**" << "\n";  // deuxième ligne
    return 0;
}
```

Ce programme affiche seulement `*` puis `**`. Les commentaires servent à expliquer une idée ou à découper un programme en parties. On en trouvera dans toutes les solutions de référence.

## Dessiner avec des caractères

Avec uniquement des instructions d'affichage, on peut déjà construire des figures : chaque instruction dessine une ligne, et la figure complète est la suite de ces lignes. Le vrai travail n'est pas d'écrire les `print`, c'est de **trouver le motif** : combien de lignes, et ce que contient chacune.

La bonne méthode consiste à dessiner la figure sur papier, à numéroter les lignes, puis à décrire chaque ligne par une règle. Par exemple, pour un triangle de hauteur 4 dont la ligne numéro k contient k étoiles, on obtient les lignes `*`, `**`, `***` et `****`. On vérifie le nombre de lignes et le nombre de caractères de chacune avant d'écrire le programme.

Comme le correcteur ignore les espaces, une figure qui doit être décalée vers la droite utilise un caractère visible pour remplir, en général le point `.` : la ligne `..*..` a bien cinq caractères, et le décalage fait partie de la réponse.

## Erreurs fréquentes

Quand un programme contient une erreur, l'ordinateur refuse de l'exécuter, ou s'arrête, et affiche un **message d'erreur**. Il faut toujours le lire : il indique la ligne et la nature du problème.

**Oublier les guillemets.** On écrit `print(Bonjour)` au lieu de `print("Bonjour")`. Sans guillemets, Python croit que `Bonjour` est un nom qu'il devrait connaître :

```
NameError: name 'Bonjour' is not defined
```

La correction consiste à remettre les guillemets autour du texte. En C++, l'erreur correspondante est `error: 'Bonjour' was not declared in this scope`.

**Oublier un guillemet ou une parenthèse.** Avec `print("Bonjour)`, le texte ne se termine jamais :

```
SyntaxError: unterminated string literal (detected at line 1)
```

Avec `print("Bonjour"`, c'est la parenthèse qui n'est pas fermée : `SyntaxError: '(' was never closed`. Chaque guillemet ouvrant a un guillemet fermant, chaque parenthèse ouvrante a une parenthèse fermante.

**Écrire une majuscule.** `Print("Bonjour")` ne fonctionne pas : Python distingue les majuscules des minuscules, et `Print` n'existe pas.

```
NameError: name 'Print' is not defined. Did you mean: 'print'?
```

**Mettre une espace en début de ligne en Python.** Une instruction qui commence par une ou plusieurs espaces provoque :

```
IndentationError: unexpected indent
```

En Python, le décalage en début de ligne a un sens précis, qu'on verra au chapitre suivant. Pour l'instant, toutes les instructions commencent tout à gauche.

**Oublier le point-virgule en C++.** Si on écrit `cout << "un" << "\n"` sans `;`, le compilateur ne voit pas où l'instruction se termine. Il s'en aperçoit en rencontrant le `cout` de la ligne suivante :

```
error: expected ';' before 'cout'
```

Il suffit d'ajouter le point-virgule à la fin de l'instruction qui précède ce `cout`.

**Utiliser des guillemets typographiques.** Les guillemets français `« »` ou les guillemets penchés `“ ”`, qu'un traitement de texte insère automatiquement, ne sont pas reconnus. Il faut les guillemets droits `"` du clavier.

**Se tromper dans le texte affiché.** Le programme fonctionne, mais le correcteur refuse la réponse. Il faut alors comparer la sortie du programme à l'exemple de l'énoncé, mot par mot : une majuscule en trop, une faute de frappe ou une ligne oubliée suffisent pour obtenir une réponse fausse.

## Un exemple complet

**Énoncé.** Afficher un carré creux de côté 5 : le bord est dessiné avec `#` et l'intérieur est rempli avec `.`. Afficher ensuite, sur une dernière ligne, le nombre de `#` utilisés.

**Idée.** On dessine d'abord le carré sur papier. Il a 5 lignes de 5 caractères. La première et la dernière ligne font partie du bord : elles ne contiennent que des `#`, soit `#####`. Les trois lignes du milieu ont un `#` à chaque extrémité et trois points entre les deux : `#...#`. On compte ensuite les `#` : 5 sur la première ligne, 5 sur la dernière, et 2 sur chacune des 3 lignes du milieu, soit 5 + 5 + 6 = 16. Le programme n'a plus qu'à afficher ces six lignes, dans l'ordre.

**Programme.**

```python
# Bord du haut
print("#####")
# Les trois lignes du milieu
print("#...#")
print("#...#")
print("#...#")
# Bord du bas
print("#####")
# Nombre de dièses : 5 + 5 + 3 × 2
print(16)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    // Bord du haut
    cout << "#####" << "\n";
    // Les trois lignes du milieu
    cout << "#...#" << "\n";
    cout << "#...#" << "\n";
    cout << "#...#" << "\n";
    // Bord du bas
    cout << "#####" << "\n";
    // Nombre de dièses : 5 + 5 + 3 × 2
    cout << 16 << "\n";
    return 0;
}
```

**Vérification à la main.** On relit le programme en suivant l'ordre des instructions et on écrit sur papier ce qu'il affiche :

```
#####
#...#
#...#
#...#
#####
16
```

Il y a bien 5 lignes de 5 caractères, le bord est complet, l'intérieur contient 3 × 3 = 9 points, et 25 − 9 = 16 confirme le nombre de dièses. On peut alors soumettre le programme.

## À retenir

- Un programme est une **séquence** d'instructions, exécutées une fois chacune, de haut en bas : l'ordre des instructions est l'ordre de l'affichage.
- On affiche avec `print(…)` en Python et `cout << … << "\n";` en C++. Un texte s'écrit entre guillemets droits, un nombre sans guillemets.
- `print(a, b, c)` affiche plusieurs valeurs sur une ligne, séparées par une espace ; en C++, l'espace s'écrit soi-même avec `" "`.
- `print()` ou `cout << "\n";` affiche une ligne vide. Le correcteur compare mot à mot et ignore les espaces en trop.
- Pour une figure, on cherche d'abord le motif sur papier (nombre de lignes, contenu de chaque ligne), puis on écrit le programme.
- Un message d'erreur indique la ligne et la nature du problème : il faut toujours le lire.
