Un algorithme **glouton** construit sa réponse pas à pas, en faisant à chaque étape le choix qui semble le meilleur, sans jamais revenir en arrière. C'est simple et rapide (souvent un tri, puis un parcours). Le danger : un bon choix sur le moment peut être mauvais pour la suite. Il faut donc savoir **justifier** le choix.

## Un glouton qui se trompe

On dispose de pièces de valeur 1, 3 et 4. Pour payer 6 avec le moins de pièces possible, le glouton prend toujours la plus grosse pièce qui rentre : 4, puis 1, puis 1, soit 3 pièces. Pourtant 3 + 3 n'en utilise que 2. Une idée gloutonne naturelle peut donc être fausse : il faut une preuve, ou au moins une vérification sérieuse.

## Rester devant : les arrêts sur une route

Une voiture suit une route bordée de stations-service, aux kilomètres `r[0] < r[1] < …`, et parcourt au plus D km avec un plein. Elle part de la première station, réservoir plein, et veut atteindre la dernière en s'arrêtant le moins de fois possible pour refaire le plein. Choix glouton : à chaque fois, aller jusqu'à la station **la plus loin** qu'elle peut atteindre.

Pourquoi est-ce optimal ? On compare avec n'importe quel autre plan. Après le premier trajet, le glouton est au moins aussi loin que l'autre plan, puisqu'il a pris la station la plus lointaine. Et s'il est au moins aussi loin après k arrêts, il l'est encore après k + 1 arrêts : toute station que l'autre plan atteint au trajet suivant est aussi à portée du glouton. Le glouton **reste devant** à chaque étape : il n'a donc jamais besoin de plus d'arrêts que n'importe quel autre plan.

```python
r = [0, 4, 9, 11, 17, 20, 26]
D = 10
arrets = 0
pos = 0                     # indice de la station où l'on se trouve
possible = True
while pos < len(r) - 1:
    suivant = pos
    while suivant + 1 < len(r) and r[suivant + 1] - r[pos] <= D:
        suivant += 1        # on avance tant que c'est à portée
    if suivant == pos:
        possible = False    # la station suivante est trop loin
        break
    pos = suivant
    if pos < len(r) - 1:
        arrets += 1         # on refait le plein à cette station
if possible:
    print(arrets)           # 2 : on s'arrête aux kilomètres 9 et 17
else:
    print("impossible")
```

```cpp
vector<int> r = {0, 4, 9, 11, 17, 20, 26};
int D = 10;
int arrets = 0, pos = 0;    // pos : indice de la station où l'on se trouve
bool possible = true;
while (pos < (int)r.size() - 1) {
    int suivant = pos;
    while (suivant + 1 < (int)r.size() && r[suivant + 1] - r[pos] <= D) {
        suivant++;          // on avance tant que c'est à portée
    }
    if (suivant == pos) { possible = false; break; }  // la station suivante est trop loin
    pos = suivant;
    if (pos < (int)r.size() - 1) arrets++;  // on refait le plein à cette station
}
if (possible) cout << arrets << "\n";      // 2 : on s'arrête aux kilomètres 9 et 17
else cout << "impossible\n";
```

## L'argument d'échange

Une autre façon de prouver un glouton : partir d'une solution optimale **quelconque** et la modifier petit à petit pour qu'elle ressemble à celle du glouton, sans jamais la rendre moins bonne.

Exemple : une imprimante doit imprimer N documents, l'un après l'autre. Le document i demande t_i minutes, et la personne qui l'a envoyé attend jusqu'à la fin de son impression. Pour minimiser la somme des attentes, le glouton imprime d'abord les documents **les plus courts**.

Preuve : soit un ordre où deux documents voisins a puis b vérifient t_a > t_b. Si on les échange, les attentes des autres documents ne changent pas. Avant l'échange, b attendait t_a minutes de plus à cause de a ; après, c'est a qui attend t_b minutes de plus à cause de b. Comme t_b < t_a, la somme diminue. Un ordre optimal n'a donc aucune paire de voisins mal rangés : il est trié.

```python
t = [7, 2, 5]
t.sort()               # les plus courts d'abord
fin = 0
total = 0
for duree in t:
    fin += duree       # ce document est prêt à la minute fin
    total += fin
print(total)           # 2 + 7 + 14 = 23
```

```cpp
vector<int> t = {7, 2, 5};
sort(t.begin(), t.end());   // les plus courts d'abord
long long fin = 0, total = 0;
for (int duree : t) {
    fin += duree;           // ce document est prêt à la minute fin
    total += fin;
}
cout << total << "\n";      // 2 + 7 + 14 = 23
```

Les mêmes idées servent à choisir des créneaux ou à former des paires : on montre qu'une solution optimale peut toujours commencer par le choix du glouton.

## Une pile pour corriger ses choix

Certains gloutons lisent les éléments un par un et gardent ceux qui les intéressent dans une **pile** : une liste où l'on n'ajoute et ne retire qu'à la fin, le **sommet**. En Python, c'est une liste avec `append`, `pop()` et `pile[-1]` ; en C++, un `vector` avec `push_back`, `pop_back` et `back()`.

Le schéma classique : avant d'empiler un nouvel élément, on retire du sommet tous ceux qui sont **moins bons** que lui. Exemple : des immeubles alignés, de hauteurs données de gauche à droite. Depuis la droite, on ne voit un immeuble que s'il est strictement plus haut que tous ceux qui sont à sa droite. Quand un nouvel immeuble arrive, ceux de la pile qui ne sont pas plus hauts que lui sont cachés pour toujours : on les dépile.

```python
h = [5, 3, 8, 2, 4, 1]
pile = []
for x in h:
    while pile and pile[-1] <= x:
        pile.pop()          # caché par x : il ne servira plus
    pile.append(x)
print(pile)                 # [8, 4, 1] : les immeubles visibles
```

```cpp
vector<int> h = {5, 3, 8, 2, 4, 1};
vector<int> pile;
for (int x : h) {
    while (!pile.empty() && pile.back() <= x) {
        pile.pop_back();    // caché par x : il ne servira plus
    }
    pile.push_back(x);
}
for (int x : pile) cout << x << " ";   // 8 4 1 : les immeubles visibles
cout << "\n";
```

Il y a encore une boucle `while` dans une boucle `for`, mais c'est O(N) : chaque élément est empilé une fois et dépilé au plus une fois.

Ce schéma sert souvent pour fabriquer le plus petit (ou le plus grand) nombre possible. Rappel utile : deux nombres qui ont le même nombre de chiffres se comparent chiffre par chiffre depuis la gauche, et le premier chiffre qui diffère décide. `31999` est plus petit que `32000` : il faut donc d'abord rendre le premier chiffre aussi petit que possible, puis le deuxième, et ainsi de suite.

## Vérifier son glouton

Avant de faire confiance à un glouton, on écrit aussi une solution **force brute** qui essaie toutes les possibilités (lente, mais sûre), et on compare les deux sur des centaines de petits tests aléatoires. Un seul désaccord prouve que le glouton est faux, et le petit test fautif aide à comprendre pourquoi.

## À retenir

- Un glouton fait à chaque étape le meilleur choix local, sans revenir en arrière : il est rapide, souvent O(N log N) à cause du tri.
- Une idée gloutonne naturelle peut être fausse : chercher un contre-exemple avant d'y croire.
- Pour prouver un glouton : montrer qu'il « reste devant » toute autre solution, ou qu'on peut échanger des éléments d'une solution optimale pour retrouver le choix du glouton sans perdre.
- Une pile permet de revenir sur les derniers choix : on dépile ce qui est moins bon que le nouvel élément, en O(N) au total.
- Toujours comparer le glouton à une force brute sur de petits tests aléatoires.
