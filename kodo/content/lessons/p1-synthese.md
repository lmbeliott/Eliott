Le niveau 1 est terminé : on sait afficher, calculer, lire l'entrée, décider avec des conditions et répéter avec `for` et `while`, y compris avec des boucles imbriquées. Ces quelques outils suffisent déjà à résoudre de vrais problèmes d'algorithmique. La difficulté n'est plus d'écrire une instruction, mais de **choisir** les bonnes et de les assembler. Ce chapitre propose une méthode pour aborder un problème, rappelle les schémas qui reviennent sans cesse, et montre comment tester et corriger un programme.

## Une méthode pour lire un problème

Avant d'écrire la moindre ligne, on suit quatre étapes.

1. **Comprendre l'entrée et la sortie.** Que contient chaque ligne de l'entrée ? Que faut-il afficher, exactement, et dans quel format ? On relit les contraintes : elles disent quelles valeurs sont possibles (zéro ? négatives ? très grandes ?).
2. **Résoudre l'exemple à la main.** On refait le calcul de l'exemple sur papier, sans ordinateur. Si on n'y arrive pas, l'énoncé n'est pas encore compris, et coder ne servira à rien.
3. **Trouver ce qu'il faut retenir.** En lisant les données une par une, de quoi a-t-on besoin à chaque instant ? Une somme, un compteur, le meilleur résultat vu jusqu'ici, la valeur précédente ? Chacune de ces informations devient une variable. On les appelle les **variables d'état** du programme.
4. **Choisir les boucles.** Si le nombre de répétitions est connu (on lit `N`, puis `N` valeurs), on prend `for`. Si on sait seulement quand s'arrêter (une sentinelle, un nombre qui doit atteindre une valeur), on prend `while`. Si on doit essayer toutes les paires, toutes les cases d'une grille ou tous les nombres d'un intervalle avec un calcul pour chacun, on imbrique deux boucles.

Une dernière vérification avant de coder : on estime le **nombre total de tours** à partir des contraintes. Jusqu'à quelques millions, tout va bien ; au-delà de cent millions, il faut une meilleure idée, souvent un calcul qui remplace une boucle.

## Les schémas qui reviennent

La plupart des programmes du niveau 1 combinent un petit nombre de schémas. Il faut les reconnaître immédiatement.

- **Le compteur** : une variable à 0, augmentée de 1 quand une condition est vraie.
- **L'accumulateur** : une variable à 0, à laquelle on ajoute chaque valeur.
- **Le meilleur jusqu'ici** : une variable qui garde le maximum (ou le minimum) des valeurs vues. On l'initialise avec la **première valeur**, pas avec 0, sinon tout échoue quand les valeurs sont négatives.
- **La valeur précédente** : une variable qui garde la dernière valeur lue, pour la comparer à la suivante (montée, plateau, changement).
- **Le drapeau** : un booléen qui vaut `True` au départ et passe à `False` dès qu'un contre-exemple est trouvé (« tous les nombres sont-ils pairs ? », « ce nombre est-il premier ? »).
- **Les chiffres** : `n % 10` et `n // 10` dans une boucle `while n > 0`.

Voici le schéma du meilleur jusqu'ici, avec la position du maximum parmi `N` valeurs lues une par ligne :

```python
n = int(input())
meilleur = int(input())
position = 1
for i in range(2, n + 1):
    x = int(input())
    if x > meilleur:
        meilleur = x
        position = i
print(meilleur, position)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int meilleur;
    cin >> meilleur;
    int position = 1;
    for (int i = 2; i <= n; i++) {
        int x;
        cin >> x;
        if (x > meilleur) {
            meilleur = x;
            position = i;
        }
    }
    cout << meilleur << " " << position << "\n";
    return 0;
}
```

Avec les valeurs `-5`, `-2`, `-9`, `-2`, le programme affiche `-2 2`. La première valeur est lue avant la boucle et sert de point de départ ; la boucle commence donc à la deuxième. Le test `>` (et non `>=`) garde la **première** position en cas d'égalité.

## Tester sur les cas limites

Un programme qui marche sur l'exemple n'est pas forcément juste. Les tests du juge contiennent presque toujours des **cas limites** : les situations extrêmes autorisées par les contraintes. Avant de soumettre, on se pose systématiquement ces questions :

- Que se passe-t-il avec la plus petite entrée possible : `N = 1`, une seule valeur, le nombre `0`, aucune valeur avant la sentinelle ?
- Et avec la plus grande ? Les nombres tiennent-ils dans un `int` en C++, ou faut-il un `long long` ?
- Que se passe-t-il quand toutes les valeurs sont égales ? Quand la réponse est atteinte tout de suite, ou tout à la fin ?
- Les égalités sont-elles bien traitées : `<` ou `<=`, premier ou dernier en cas d'égalité ?
- Les valeurs négatives, si elles sont permises, cassent-elles une initialisation à 0 ?

Pour chacune de ces questions, on construit une petite entrée, on calcule la réponse attendue à la main, et on vérifie que le programme la donne.

## Déboguer un programme faux

Quand un programme donne une mauvaise réponse, on ne modifie pas le code au hasard. On cherche **où** il se trompe.

**Lire le message d'erreur.** Une erreur d'exécution indique la ligne et la cause. Par exemple, `ValueError: invalid literal for int() with base 10: '3 4'` signifie qu'on a lu une ligne contenant deux nombres avec `int(input())` : il fallait `split()`. `IndentationError` signale un décalage incorrect, et `NameError` une variable utilisée avant d'avoir reçu une valeur, souvent à cause d'une faute de frappe.

**Reconnaître le verdict.** « Temps limite dépassé » vient presque toujours d'une boucle infinie (une variable de la condition qui ne change pas) ou de boucles imbriquées qui font beaucoup trop de tours. Une « mauvaise réponse » vient le plus souvent d'une initialisation mal placée, d'une comparaison stricte au lieu de large, ou d'un cas limite oublié.

**Afficher l'état.** On ajoute temporairement un affichage dans la boucle pour voir les variables d'état à chaque tour :

```python
somme = 0
for i in range(1, 4):
    somme = somme + i * i
    print("tour", i, "somme", somme)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int somme = 0;
    for (int i = 1; i <= 3; i++) {
        somme = somme + i * i;
        cout << "tour " << i << " somme " << somme << "\n";
    }
    return 0;
}
```

Ce programme affiche `tour 1 somme 1`, `tour 2 somme 5`, `tour 3 somme 14`. On compare ces valeurs avec celles calculées à la main : le premier tour où elles diffèrent montre l'endroit de l'erreur. Il ne faut pas oublier d'enlever ces affichages avant de soumettre, car le juge les compterait comme une partie de la réponse.

## Exemple complet : compter les vagues de chaleur

**Énoncé.** On lit `N` températures journalières (une par ligne). Une **vague de chaleur** est une suite d'au moins 3 jours consécutifs à 30 degrés ou plus. Afficher le nombre de vagues de chaleur.

**Méthode.** Étape 2, à la main : avec `31 32 33 20 30 30 35 36 29`, il y a deux vagues (jours 1 à 3, puis jours 5 à 8). Étape 3 : on doit retenir la longueur de la série en cours de jours chauds, et le nombre de vagues. Étape 4 : on connaît `N`, donc une boucle `for`. L'idée clé : une vague est comptée **au moment où sa série atteint exactement 3 jours**. Ainsi, une longue vague n'est comptée qu'une fois, et on n'a pas besoin de détecter sa fin.

```python
n = int(input())
serie = 0
vagues = 0
for i in range(n):
    t = int(input())
    if t >= 30:
        serie = serie + 1
        if serie == 3:
            vagues = vagues + 1
    else:
        serie = 0
print(vagues)
```

```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int serie = 0;
    int vagues = 0;
    for (int i = 0; i < n; i++) {
        int t;
        cin >> t;
        if (t >= 30) {
            serie = serie + 1;
            if (serie == 3) {
                vagues = vagues + 1;
            }
        } else {
            serie = 0;
        }
    }
    cout << vagues << "\n";
    return 0;
}
```

**Vérification.** Sur l'exemple, `serie` vaut 1, 2, 3 (première vague comptée), puis 0 au jour 4, puis 1, 2, 3 (deuxième vague comptée), 4, puis 0. Le programme affiche `2`. Cas limites : `N = 1` donne 0 ; trois jours à exactement 30 donnent 1 (d'où `>=`) ; dix jours chauds de suite donnent 1, car `serie == 3` n'est vrai qu'une fois.

## À retenir

- Avant de coder : comprendre l'entrée et la sortie, résoudre l'exemple à la main, identifier les variables d'état, choisir les boucles.
- `for` quand le nombre de tours est connu, `while` quand on sait seulement quand s'arrêter, deux boucles imbriquées pour les paires et les grilles.
- Reconnaître les schémas : compteur, accumulateur, meilleur jusqu'ici (initialisé avec la première valeur), valeur précédente, drapeau, chiffres.
- Estimer le nombre de tours avec les contraintes, et penser au `long long` en C++.
- Tester les cas limites, puis déboguer en affichant l'état à chaque tour et en le comparant au calcul fait à la main.
