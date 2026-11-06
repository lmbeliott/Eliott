---
id: trois-meilleurs-temps
title: Trois meilleurs temps
chapter: n2-trier-compter
order: 1
tags: [tri, listes]
samples: 2
---

## Énoncé
Lors d'une course, chaque participant porte un numéro de dossard, et son temps est mesuré en centièmes de seconde : un temps de `5412` signifie 54 secondes et 12 centièmes. Le temps le plus court gagne.

Écris un programme qui affiche les numéros de dossard des trois premiers : d'abord celui du meilleur temps, puis celui du deuxième, puis celui du troisième.

## Entrée
- La première ligne contient un entier `N` : le nombre de participants.
- Les `N` lignes suivantes contiennent chacune un numéro de dossard et un temps, séparés par une espace.

Tous les dossards sont différents, et tous les temps sont différents.

## Sortie
Trois lignes : les numéros de dossard des participants arrivés premier, deuxième et troisième.

## Contraintes
- 3 ≤ N ≤ 100
- 1 ≤ dossard ≤ 999
- 1 ≤ temps ≤ 100 000

## Indices
1. Si tu ranges les résultats du plus petit temps au plus grand, les trois premiers de la liste sont les trois gagnants.
2. Il faut trier les **temps**, mais afficher les **dossards**. Range chaque résultat sous la forme d'un couple `(temps, dossard)` : quand on trie des couples, on compare d'abord leur premier élément.
3. N'oublie pas de convertir le temps en nombre avec `int`. Sinon, les temps sont comparés comme des mots, caractère par caractère, et `"950"` passe après `"1000"`.

## Solution
On range les résultats dans une liste de couples `(temps, dossard)`, puis on la trie. Le tri de couples compare d'abord les premiers éléments, donc les temps : les participants se retrouvent rangés du plus rapide au plus lent. Il suffit d'afficher le dossard des trois premiers couples.

En Python, on utilise des tuples et `resultats.sort()`. En C++, on utilise un `vector<pair<int, int>>` et `sort(resultats.begin(), resultats.end())` ; `resultats[i].second` est le dossard.

Les pièges :
- mettre le dossard en premier dans le couple : on trierait alors par numéro de dossard !
- garder les temps sous forme de texte : les chaînes se comparent caractère par caractère, et `"950"` est « plus grand » que `"1000"` car `9 > 1`. Le deuxième exemple est là pour te le rappeler.
