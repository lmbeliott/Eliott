---
id: trier-en-retournant-des-prefixes
title: Trier en retournant des préfixes
chapter: p4-graphes-implicites
order: 6
tags: [parcours-en-largeur, mathématiques, dictionnaires]
samples: 2
---

## Énoncé
Une pile de `N` crêpes de tailles toutes différentes est décrite de haut en bas par une permutation des entiers de `1` à `N`. La seule opération permise consiste à glisser une spatule sous les `k` crêpes du haut (avec `2 ≤ k ≤ N`) et à les retourner d'un bloc : les `k` premiers nombres de la liste passent dans l'ordre inverse. Par exemple, retourner les 3 premières crêpes de `3 1 2 4` donne `2 1 3 4`.

Pour chacune des `Q` piles données, calculer le nombre minimal de retournements pour obtenir `1 2 … N`, la plus petite crêpe en haut.

## Entrée
- La première ligne contient deux entiers `N` et `Q`.
- Chacune des `Q` lignes suivantes contient une permutation des entiers de `1` à `N`.

## Sortie
`Q` lignes : pour chaque pile, dans l'ordre, le nombre minimal de retournements.

## Contraintes
- 1 ≤ N ≤ 8
- 1 ≤ Q ≤ 1 000

## Indices
1. Un état est une permutation ; un retournement relie deux états. Il y a au plus 8! = 40 320 états, chacun avec `N − 1` voisins.
2. Faire un parcours en largeur pour chaque pile coûte `Q` fois le parcours de tout l'espace d'états. Peut-on n'en faire qu'un ?
3. Retourner deux fois les mêmes `k` crêpes ramène la pile de départ : la distance d'une pile `P` à la pile triée est aussi la distance de la pile triée à `P`.

## Solution
On voit les piles comme les sommets d'un graphe implicite : deux piles sont reliées si un retournement passe de l'une à l'autre. On code une pile par une chaîne de caractères (`"3124"`) ou un tuple, qui sert de clé dans un dictionnaire de distances.

Un retournement est sa propre opération inverse, donc le graphe est non orienté : le nombre minimal de retournements pour trier `P` est la distance entre `P` et la pile triée, dans un sens comme dans l'autre. Un **seul** parcours en largeur, lancé depuis la pile triée, calcule donc la réponse pour toutes les permutations à la fois ; chaque question se résout ensuite par une simple lecture dans le dictionnaire.

**Complexité.** Le parcours visite les `N!` états et produit `N − 1` voisins par état, chacun en O(N) : environ 40 320 × 7 × 8 opérations pour `N = 8`. Un parcours par question coûterait `Q` fois plus.

**Les nombres des crêpes.** Ramener la plus grande crêpe en haut puis la retourner jusqu'en bas la place définitivement en 2 retournements : on trie donc toujours en au plus `2N − 3` retournements. Le vrai maximum est plus petit ; pour `N = 8`, le parcours montre que c'est 9. Déterminer ce maximum pour tout `N` est un problème ouvert.
