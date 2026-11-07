---
id: sommets-sur-un-plus-long-chemin
title: Sommets sur un plus long chemin
chapter: n4-arbres
order: 2
tags: [graphes, parcours-en-largeur]
samples: 2
---

## Énoncé
On donne un arbre de `N` sommets, numérotés de `1` à `N`. La **longueur** d'un chemin est son nombre d'arêtes ; le **diamètre** de l'arbre est la plus grande longueur d'un chemin entre deux sommets.

Écris un programme qui compte les sommets qui se trouvent sur au moins un chemin de longueur égale au diamètre (extrémités comprises).

## Entrée
- La première ligne contient un entier `N`.
- La deuxième ligne contient `N - 1` entiers : le parent de chacun des sommets `2, 3, …, N`, dans cet ordre, quand l'arbre est enraciné au sommet `1`. Elle est vide si `N = 1`.

## Sortie
Un seul entier : le nombre de sommets situés sur au moins un plus long chemin.

## Contraintes
- 1 ≤ N ≤ 20 000

## Indices
1. Le diamètre se trouve avec deux parcours en largeur : le sommet `a` le plus éloigné de n'importe quel sommet est le bout d'un plus long chemin, et le sommet `b` le plus éloigné de `a` est l'autre bout. Mais un sommet peut être sur un plus long chemin sans être sur celui qui va de `a` à `b` : dans le premier exemple, il y a trois bras de longueur `2`.
2. Tous les plus longs chemins passent par le **milieu** du chemin de `a` à `b` : un sommet si le diamètre `D` est pair, deux sommets voisins s'il est impair.
3. Fais un parcours en largeur depuis ce ou ces centres. Un sommet est sur un plus long chemin exactement quand son sous-arbre (vu depuis le centre) contient un sommet à distance `⌊D / 2⌋` du centre.

## Solution
**Le diamètre.** Un parcours en largeur depuis le sommet `1` donne le sommet `a` le plus éloigné ; c'est toujours une extrémité d'un plus long chemin. Un second parcours depuis `a` donne le sommet `b` le plus éloigné de `a` et le diamètre `D = dist(a, b)`. On retrouve le chemin de `b` à `a` en remontant les parents du parcours.

**Le centre.** Soit `h = ⌊D / 2⌋`. Si `D` est pair, le centre est le sommet du milieu du chemin, à distance `h` de chaque bout. Si `D` est impair, ce sont les deux sommets du milieu, voisins. Tout plus long chemin passe par le centre (par l'arête entre les deux centres si `D` est impair) : sinon, on pourrait le combiner avec une moitié du chemin de `a` à `b` pour obtenir un chemin plus long que `D`. Chacune de ses deux moitiés descend à distance exactement `h` du centre, dans deux branches différentes.

**Le comptage.** On fait un parcours en largeur depuis le ou les centres à la fois (les deux centres sont des sources de distance `0`, et l'arête qui les relie n'est jamais utilisée). Pour chaque sommet `v`, on calcule `plus_bas[v]`, la plus grande distance au centre dans le sous-arbre de `v`, en remontant l'ordre du parcours à l'envers. Alors `v` est sur un plus long chemin exactement quand `plus_bas[v] = h` :
- si c'est le cas, on descend de `v` jusqu'à un sommet à distance `h`, et on complète par une moitié de plus long chemin dans une **autre** branche (il y en a toujours une, puisqu'au moins deux branches atteignent `h`) ;
- sinon, aucun chemin passant par `v` ne peut avoir ses deux moitiés de longueur `h`.

Complexité : **O(N)**, trois parcours en largeur.

Pourquoi les autres idées échouent :
- Tester `dist(a, v) + dist(v, b) = D` ne trouve que les sommets du chemin de `a` à `b` et de ses « jumeaux ». Dans le premier exemple, cette méthode ne compte pas le troisième bras de longueur `2`.
- Calculer toutes les distances entre paires de sommets (un parcours depuis chaque sommet) coûte O(N²) : 4 × 10⁸ visites pour `N = 20 000`.

Pièges :
- Avec `N = 1`, le diamètre vaut `0` et l'unique sommet compte : la réponse est `1`.
- Quand `D` est impair, les deux centres comptent toujours, et `h = (D - 1) / 2`.
- Les numéros ne suivent pas la hiérarchie : un sommet peut avoir un numéro plus petit que son parent.
