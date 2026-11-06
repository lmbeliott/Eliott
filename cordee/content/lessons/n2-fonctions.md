Quand un programme grandit, il devient vite difficile à lire : des dizaines de lignes, des boucles dans des boucles, le même calcul recopié à trois endroits. Les **fonctions** permettent de donner un nom à un morceau de calcul, puis de le réutiliser autant de fois qu'on veut.

## Définir et appeler une fonction

Une fonction reçoit des valeurs, les **paramètres**, et **renvoie** un résultat avec `return`. Voici une fonction qui transforme un horaire en minutes depuis minuit :

```python
def en_minutes(heures, minutes):
    return heures * 60 + minutes

debut = en_minutes(8, 15)    # 495
fin = en_minutes(12, 40)     # 760
print(fin - debut)           # 265
```

```cpp
int en_minutes(int heures, int minutes) {
    return heures * 60 + minutes;
}

int main() {
    int debut = en_minutes(8, 15);   // 495
    int fin = en_minutes(12, 40);    // 760
    cout << fin - debut << "\n";     // 265
    return 0;
}
```

La fonction est écrite une seule fois et utilisée deux fois. Si elle contient une erreur, on la corrige à un seul endroit.

En C++, il faut indiquer le **type** de ce que renvoie la fonction (`int`, `bool`, `string`…) et le type de chaque paramètre. La fonction doit être écrite **avant** `main`, sinon le compilateur ne la connaît pas encore. Une fonction qui ne renvoie rien a le type `void`.

## Renvoyer, ce n'est pas afficher

`return` donne le résultat au programme qui a appelé la fonction : il peut le ranger dans une variable, le comparer, le passer à une autre fonction. `print` (ou `cout`) l'écrit à l'écran, et le programme ne peut plus rien en faire. Dans la très grande majorité des cas, une fonction doit **renvoyer** son résultat, et c'est le programme principal qui affiche.

Dès que `return` est exécuté, la fonction s'arrête. On s'en sert souvent dans les fonctions qui répondent par vrai ou faux :

```python
def est_voyelle(c):
    if c in "aeiouy":
        return True
    return False

print(est_voyelle("e"))   # True
```

```cpp
bool est_voyelle(char c) {
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' || c == 'y') {
        return true;
    }
    return false;
}

int main() {
    cout << est_voyelle('e') << "\n";   // 1 (vrai)
    return 0;
}
```

## Des variables bien rangées

Les variables créées dans une fonction, et ses paramètres, sont **locales** : elles n'existent que pendant l'appel. Deux fonctions peuvent donc avoir chacune une variable `total` sans qu'elles se mélangent. Pour faire sortir une valeur d'une fonction, on la renvoie avec `return`.

En C++, les paramètres sont des **copies** : si la fonction modifie son paramètre `n`, la variable passée par le programme principal ne change pas. En Python, c'est pareil pour les nombres et les chaînes (attention, une liste modifiée dans une fonction est, elle, modifiée pour tout le monde).

## Découper un problème

La vraie force des fonctions, c'est de couper un gros problème en petits morceaux simples. Par exemple, pour compter les nombres de 1 à 1 000 dont la somme des chiffres vaut 10, on écrit d'abord une fonction pour la somme des chiffres, puis on l'utilise dans la boucle principale :

```python
def somme_chiffres(n):
    total = 0
    while n > 0:
        total += n % 10    # le dernier chiffre
        n = n // 10        # on l'enlève
    return total

compte = 0
for n in range(1, 1001):
    if somme_chiffres(n) == 10:
        compte += 1
print(compte)
```

```cpp
int somme_chiffres(int n) {
    int total = 0;
    while (n > 0) {
        total += n % 10;   // le dernier chiffre
        n = n / 10;        // on l'enlève
    }
    return total;
}

int main() {
    int compte = 0;
    for (int n = 1; n <= 1000; n++) {
        if (somme_chiffres(n) == 10) {
            compte++;
        }
    }
    cout << compte << "\n";
    return 0;
}
```

Remarque que `somme_chiffres` modifie `n`, mais seulement sa copie locale : la variable `n` de la boucle n'est pas touchée.

Une bonne méthode : avant d'écrire le programme, demande-toi « de quelles petites questions ai-je besoin ? ». Chaque question devient une fonction, avec un nom qui dit ce qu'elle fait (`est_bissextile`, `en_minutes`, `chiffres`…). Une fonction peut appeler une autre fonction : écris d'abord les plus simples, vérifie-les sur un ou deux exemples à la main, puis construis les suivantes par-dessus.

## À retenir

- Une fonction donne un nom à un calcul : on l'écrit une fois, on l'appelle autant qu'on veut.
- `return` renvoie le résultat et arrête la fonction ; c'est le programme principal qui affiche.
- Les variables d'une fonction sont locales, et ses paramètres sont des copies.
- En C++, on précise le type renvoyé et le type des paramètres, et on écrit la fonction avant `main`.
- Pour un problème compliqué, découpe-le en petites fonctions, écris et vérifie d'abord les plus simples.
