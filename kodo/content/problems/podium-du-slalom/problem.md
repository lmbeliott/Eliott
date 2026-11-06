---
id: podium-du-slalom
title: Le podium du slalom
chapter: n2-trier-compter
order: 1
tags: [tri, listes]
samples: 2
---

## Énoncé
C'est le jour de la grande course de slalom de l'école de ski de Valcorde ! Hugo, le moniteur, chronomètre la descente de chaque enfant, en centièmes de seconde : un temps de `5412` signifie 54 secondes et 12 centièmes. Le temps le plus court gagne.

Hugo doit maintenant appeler les trois enfants du podium. Écris un programme qui affiche leurs prénoms : d'abord la médaille d'or (le meilleur temps), puis l'argent, puis le bronze.

## Entrée
- La première ligne contient un entier `N` : le nombre d'enfants.
- Les `N` lignes suivantes contiennent chacune un prénom (sans accent ni espace) et un temps, séparés par une espace.

Tous les temps sont différents.

## Sortie
Trois lignes : les prénoms des enfants arrivés premier, deuxième et troisième.

## Contraintes
- 3 ≤ N ≤ 100
- 1 ≤ temps ≤ 100 000

## Indices
1. Si tu ranges les résultats du plus petit temps au plus grand, le podium, ce sont les trois premiers de la liste.
2. Il faut trier les **temps**, mais afficher les **prénoms**. Range chaque résultat sous la forme d'un couple `(temps, prénom)` : quand on trie des couples, on compare d'abord leur premier élément.
3. N'oublie pas de convertir le temps en nombre avec `int`. Sinon, les temps sont comparés comme des mots, lettre par lettre, et `"950"` passe après `"1000"`.

## Solution
On range les résultats dans une liste de couples `(temps, prénom)`, puis on la trie. Le tri de couples compare d'abord les premiers éléments, donc les temps : les enfants se retrouvent rangés du plus rapide au plus lent. Il suffit d'afficher le prénom des trois premiers couples.

En Python, on utilise des tuples et `resultats.sort()`. En C++, on utilise un `vector<pair<int, string>>` et `sort(resultats.begin(), resultats.end())` ; `resultats[i].second` est le prénom.

Les pièges :
- mettre le prénom en premier dans le couple : on trierait alors par ordre alphabétique !
- garder les temps sous forme de texte : les chaînes se comparent caractère par caractère, et `"950"` est « plus grand » que `"1000"` car `9 > 1`. Le deuxième exemple est là pour te le rappeler.
