Afficher les nombres de 1 à 5 se fait en cinq instructions. Afficher les nombres de 1 à 1 000 de la même façon demanderait mille instructions presque identiques : c'est long, et la moindre faute de frappe passe inaperçue. Les ordinateurs sont justement faits pour répéter un travail sans se lasser ni se tromper. Ce chapitre présente la **boucle `for`**, qui répète une ou plusieurs instructions un nombre de fois fixé à l'avance.

Avec une boucle, ce programme de deux lignes affiche les 1 000 premiers entiers :

```python
for i in range(1, 1001):
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 1000; i++) {
        cout << i << "\n";
    }
    return 0;
}
```

## Répéter une instruction

La forme la plus simple répète un bloc d'instructions un nombre donné de fois :

```python
for i in range(3):
    print("Bonjour")
print("Fin")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 3; i++) {
        cout << "Bonjour" << "\n";
    }
    cout << "Fin" << "\n";
    return 0;
}
```

Ce programme affiche :

```
Bonjour
Bonjour
Bonjour
Fin
```

Une **boucle** est une instruction qui fait exécuter plusieurs fois un groupe d'instructions, appelé le **corps de la boucle**. Chaque exécution du corps s'appelle un **tour de boucle** (on dit aussi une **itération**). Ici, le corps contient une seule instruction, `print("Bonjour")`, et il est exécuté 3 fois. Quand les 3 tours sont terminés, le programme continue avec l'instruction qui suit la boucle, et affiche `Fin` une seule fois.

En Python, la ligne `for i in range(3):` se termine par deux-points `:`. Le corps de la boucle est formé des lignes qui suivent et qui sont **indentées**, c'est-à-dire décalées vers la droite. On utilise 4 espaces (la touche Tab de l'éditeur les insère). C'est l'indentation, et rien d'autre, qui indique à Python où le corps commence et où il s'arrête : la ligne `print("Fin")`, revenue tout à gauche, ne fait plus partie de la boucle.

En C++, le corps de la boucle est écrit entre accolades `{` et `}`. L'indentation n'y est pas obligatoire, mais on la respecte toujours pour que le programme reste lisible. La ligne `for (int i = 0; i < 3; i++)` contient trois parties séparées par des points-virgules, qui seront détaillées plus bas.

## La variable de boucle

Le `i` qui apparaît dans `for i in range(3)` s'appelle la **variable de boucle**. Elle prend une nouvelle valeur à chaque tour, et on peut l'utiliser dans le corps de la boucle :

```python
for i in range(5):
    print("Tour", i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 5; i++) {
        cout << "Tour" << " " << i << "\n";
    }
    return 0;
}
```

Ce programme affiche :

```
Tour 0
Tour 1
Tour 2
Tour 3
Tour 4
```

Au premier tour, `i` vaut 0 ; au deuxième, 1 ; et ainsi de suite. `range(5)` produit les entiers 0, 1, 2, 3 et 4 : il y en a bien 5, mais la liste **commence à 0** et **s'arrête avant 5**. Cette convention surprend au début, mais elle est commune à presque tous les langages de programmation : `range(n)` fait exactement n tours, numérotés de 0 à n − 1.

Le nom `i` est une habitude, pas une obligation. On peut écrire `for k in range(5)` ou `for numero in range(5)`, à condition d'utiliser ensuite le même nom dans le corps.

## Choisir le début : range(a, b)

Avec deux nombres, `range(a, b)` produit les entiers de `a` à `b − 1` : il commence à `a` et s'arrête juste **avant** `b`.

```python
for i in range(1, 6):
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i < 6; i++) {
        cout << i << "\n";
    }
    return 0;
}
```

Ce programme affiche 1, 2, 3, 4 et 5, un par ligne. Le nombre de tours est b − a, ici 6 − 1 = 5. Pour afficher les entiers de 1 à n inclus, on écrit donc `range(1, n + 1)` : on donne directement la valeur `1001` dans l'exemple d'introduction pour aller jusqu'à 1 000.

En C++, la boucle `for (int i = 1; i < 6; i++)` se lit en trois parties :

- `int i = 1` : avant le premier tour, on crée la variable de boucle et on lui donne la valeur 1 ;
- `i < 6` : avant chaque tour, on vérifie que `i` est strictement inférieur à 6 ; dès que ce n'est plus vrai, la boucle s'arrête ;
- `i++` : après chaque tour, on augmente `i` de 1.

On peut aussi écrire `i <= 5`, qui signifie « inférieur ou égal à 5 » : les deux versions font exactement les mêmes tours. Il est souvent plus clair d'écrire la dernière valeur avec `<=`, comme dans l'exemple d'introduction.

## Choisir le pas : range(a, b, p)

Un troisième nombre fixe le **pas**, c'est-à-dire l'écart entre deux valeurs successives de la variable de boucle. `range(a, b, p)` produit a, puis a + p, puis a + 2p, et ainsi de suite, tant que la valeur reste strictement inférieure à `b`.

```python
for i in range(0, 50, 10):
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 50; i += 10) {
        cout << i << "\n";
    }
    return 0;
}
```

Ce programme affiche 0, 10, 20, 30 et 40. La valeur suivante serait 50, qui n'est pas strictement inférieure à 50 : la boucle s'arrête. En C++, `i += 10` signifie « augmenter `i` de 10 » ; c'est la troisième partie du `for` qui fixe le pas.

Le pas permet d'obtenir directement de nombreuses suites : les nombres pairs (`range(0, 101, 2)`), les nombres impairs (`range(1, 100, 2)`), les multiples de 7 (`range(7, 100, 7)`)… Pour trouver les bons paramètres, on se pose trois questions : quelle est la première valeur ? quel est l'écart entre deux valeurs ? quelle est la dernière valeur, et quel nombre faut-il donner pour qu'elle soit incluse ? Pour s'arrêter après une dernière valeur `d`, il suffit de donner une borne un peu plus grande que `d`, par exemple `d + 1`.

## Compter à rebours

Le pas peut être négatif. La boucle compte alors à l'envers, et s'arrête juste **avant** d'atteindre `b`, qui est cette fois plus petit que `a` :

```python
for i in range(10, 0, -2):
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 10; i > 0; i -= 2) {
        cout << i << "\n";
    }
    return 0;
}
```

Ce programme affiche 10, 8, 6, 4 et 2. La valeur suivante serait 0, qui n'est pas strictement supérieure à 0. En C++, le test devient `i > 0` (« tant que `i` est strictement supérieur à 0 ») et la mise à jour `i -= 2` (« diminuer `i` de 2 »). Pour compter de 10 jusqu'à 0 inclus, il faut écrire `range(10, -1, -2)` en Python, ou `i >= 0` en C++.

## Plusieurs instructions dans le corps

Le corps d'une boucle peut contenir autant d'instructions qu'on le souhaite. À chaque tour, elles sont toutes exécutées, dans l'ordre :

```python
for i in range(1, 4):
    print("Etape", i)
    print("---")
print("Termine")
```

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i < 4; i++) {
        cout << "Etape" << " " << i << "\n";
        cout << "---" << "\n";
    }
    cout << "Termine" << "\n";
    return 0;
}
```

Ce programme affiche :

```
Etape 1
---
Etape 2
---
Etape 3
---
Termine
```

Les deux instructions indentées sont répétées ensemble, trois fois. L'instruction non indentée vient après la boucle : elle n'est exécutée qu'une fois, à la fin. Le décalage d'une seule ligne suffit donc à changer complètement ce que fait le programme.

## Des boucles à la suite

Une boucle est une instruction comme une autre : on peut en écrire plusieurs à la suite, ou mélanger boucles et affichages simples. La deuxième boucle commence quand la première est entièrement terminée.

```python
print("Montee")
for i in range(1, 4):
    print(i)
print("Descente")
for i in range(2, 0, -1):
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Montee" << "\n";
    for (int i = 1; i <= 3; i++) {
        cout << i << "\n";
    }
    cout << "Descente" << "\n";
    for (int i = 2; i >= 1; i--) {
        cout << i << "\n";
    }
    return 0;
}
```

Ce programme affiche `Montee`, puis 1, 2, 3, puis `Descente`, puis 2 et 1. La seconde boucle part de 2 et non de 3, pour ne pas afficher le sommet deux fois. En C++, `i--` diminue `i` de 1 ; on peut réutiliser le nom `i` dans la seconde boucle, car chaque `int i` crée une nouvelle variable qui n'existe que dans sa boucle.

## Une boucle qui ne fait aucun tour

Si la première valeur dépasse déjà la borne, la boucle ne fait aucun tour, sans aucun message d'erreur. Par exemple, `range(5, 5)` et `range(10, 1)` sont vides : le pas vaut 1, et 10 n'est pas inférieur à 1. De même, `range(1, 10, -1)` est vide. Le corps n'est alors jamais exécuté, et le programme passe directement à la suite.

## Erreurs fréquentes

**Se tromper d'une unité sur la borne.** On veut les nombres de 1 à 10 et on écrit `range(1, 10)` : le programme affiche seulement 1 à 9, car la borne est exclue. C'est l'erreur la plus fréquente avec les boucles ; elle porte le nom d'**erreur de décalage d'un**. Pour l'éviter, on vérifie toujours la première et la dernière valeur produites. La correction est `range(1, 11)`.

**Oublier les deux-points.** `for i in range(3)` sans `:` provoque :

```
SyntaxError: expected ':'
```

**Oublier l'indentation.** Si la ligne qui suit le `for` n'est pas décalée, Python ne trouve pas de corps :

```
IndentationError: expected an indented block after 'for' statement on line 1
```

Il faut décaler de 4 espaces les instructions à répéter.

**Indenter une ligne de trop, ou pas assez.** Si `print("Termine")` est indenté, il fait partie du corps et s'affiche à chaque tour. Si une instruction qui devait être répétée n'est pas indentée, elle ne s'exécute qu'une fois, après la boucle. Python ne signale rien : le programme est valide, mais il ne fait pas ce qu'on veut. Il faut relire l'indentation ligne par ligne.

**Se tromper de sens.** `range(10, 0)` ne compte pas à rebours : sans pas négatif, il ne produit rien, et le programme n'affiche rien. Pour compter à l'envers, le pas doit être négatif : `range(10, 0, -1)`.

**En C++, une condition qui reste toujours vraie.** Dans `for (int i = 10; i >= 1; i++)`, `i` augmente au lieu de diminuer : la condition `i >= 1` reste vraie et la boucle ne s'arrête pas (le site finit par l'interrompre, avec un dépassement du temps limite). Il faut que la mise à jour rapproche `i` de la sortie : ici `i--`.

**En C++, un point-virgule après le `for`.** Avec `for (int i = 0; i < 3; i++);`, le point-virgule forme à lui seul un corps vide, répété 3 fois ; le bloc entre accolades qui suit n'est alors plus dans la boucle. Il ne faut jamais mettre de `;` juste après la parenthèse fermante d'un `for`.

## Un exemple complet

**Énoncé.** Afficher, dans l'ordre croissant et un par ligne, tous les entiers de 1 à 100 dont le dernier chiffre est 3 ou 8.

**Idée.** On écrit les premiers nombres qui conviennent : 3, 8, 13, 18, 23, 28… On remarque que l'écart entre deux nombres consécutifs est toujours 5 : de 3 on passe à 8, de 8 à 13, et ainsi de suite. C'est normal : ajouter 5 à un nombre qui se termine par 3 donne un nombre qui se termine par 8, et ajouter 5 à un nombre qui se termine par 8 donne un nombre qui se termine par 3. La suite cherchée est donc celle d'une boucle de pas 5, qui commence à 3. Le dernier nombre inférieur ou égal à 100 qui se termine par 3 ou 8 est 98 ; il suffit d'une borne comprise entre 99 et 103 pour qu'il soit inclus et que le suivant, 103, ne le soit pas. On choisit 101, qui se lit « jusqu'à 100 inclus ».

**Programme.**

```python
# Les nombres qui finissent par 3 ou 8 sont espacés de 5.
for i in range(3, 101, 5):
    print(i)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    // Les nombres qui finissent par 3 ou 8 sont espacés de 5.
    for (int i = 3; i <= 100; i += 5) {
        cout << i << "\n";
    }
    return 0;
}
```

**Vérification à la main.** On suit les premiers tours : `i` vaut 3, puis 8, puis 13, puis 18 ; ce sont bien les premiers nombres attendus, sans oubli. Pour la fin, on regarde les derniers tours : 88, 93, 98 ; la valeur suivante serait 103, qui dépasse 100, donc la boucle s'arrête après avoir affiché 98. On peut enfin compter les tours : il y a deux nombres qui conviennent par dizaine, et 10 dizaines entre 1 et 100, soit 20 nombres. La boucle va de 3 à 98 par pas de 5, ce qui fait bien (98 − 3) / 5 + 1 = 20 tours.

## À retenir

- `for i in range(n):` répète le corps n fois, avec `i` qui vaut 0, 1, …, n − 1. Le corps est formé des lignes indentées (Python) ou placées entre accolades (C++).
- `range(a, b)` va de `a` à `b − 1` : la borne `b` est toujours **exclue**. Pour aller jusqu'à `n` inclus, on écrit `range(1, n + 1)` ou `i <= n` en C++.
- `range(a, b, p)` avance de `p` à chaque tour ; un pas négatif compte à rebours et s'arrête juste avant `b`.
- Seules les instructions du corps sont répétées ; ce qui est écrit après la boucle n'est exécuté qu'une fois.
- Pour écrire une boucle, on détermine la première valeur, le pas et la dernière valeur, puis on vérifie à la main les premiers et les derniers tours.
