---
id: arbres-binaires-de-hauteur-donnee
title: Arbres binaires de hauteur donnée
chapter: p4-arbres-binaires
order: 6
tags: [récursivité, mathématiques]
samples: 3
---

## Énoncé
La **hauteur** d'un arbre binaire est le plus grand nombre d'arêtes d'un chemin qui descend de la racine à un nœud : un arbre réduit à un nœud a pour hauteur 0. On ne s'intéresse qu'à la **forme** des arbres : deux arbres sont différents si l'un a un fils gauche ou droit à un endroit où l'autre n'en a pas. Par exemple, il y a 5 formes d'arbres à 3 nœuds : 4 chemins de hauteur 2 et un arbre de hauteur 1 (une racine et ses deux fils).

Compter les formes d'arbres binaires à `N` nœuds dont la hauteur vaut exactement `H`. Afficher ce nombre modulo 1 000 000 007.

## Entrée
Une seule ligne contenant deux entiers `N` et `H`.

## Sortie
Un seul entier : le nombre de formes, modulo 1 000 000 007.

## Contraintes
- 1 ≤ N ≤ 150
- 0 ≤ H ≤ N − 1

## Indices
1. Il est plus simple de compter les arbres de hauteur **au plus** `h` : ceux de hauteur exactement `H` sont ceux de hauteur au plus `H` qui ne sont pas de hauteur au plus `H − 1`.
2. Un arbre non vide de hauteur au plus `h` est une racine, un sous-arbre gauche de `g` nœuds et un sous-arbre droit de `N − 1 − g` nœuds, tous deux de hauteur au plus `h − 1`. L'arbre vide a pour hauteur −1.
3. La fonction récursive qui en découle recalcule sans cesse les mêmes valeurs : il faut la mémoïser.

## Solution
Notons `A(n, h)` le nombre de formes à `n` nœuds de hauteur au plus `h`. L'arbre vide compte pour une forme, de hauteur −1 : `A(0, h) = 1` pour tout `h ≥ −1`, et `A(n, −1) = 0` si `n ≥ 1`. Un arbre non vide est formé d'une racine, d'un sous-arbre gauche à `g` nœuds et d'un sous-arbre droit à `n − 1 − g` nœuds ; sa hauteur est au plus `h` si et seulement si ses deux sous-arbres ont une hauteur au plus `h − 1`. Les choix à gauche et à droite sont indépendants, donc

`A(n, h) = Σ A(g, h − 1) × A(n − 1 − g, h − 1)`, pour `g` de 0 à `n − 1`.

La réponse est `A(N, H) − A(N, H − 1)` (modulo 1 000 000 007, en remettant le résultat entre 0 et 1 000 000 006).

**Mémoïsation.** Sans précaution, la récursion recalcule les mêmes `A(n, h)` un nombre exponentiel de fois. On range chaque valeur calculée dans un dictionnaire (ou un tableau), comme au chapitre « Récursivité ». Il y a au plus `N × N` valeurs, chacune calculée en O(N) : O(N³), soit environ 3 millions d'opérations pour `N = 150`, souvent bien moins car seules les valeurs utiles sont calculées.

**Pour vérifier.** La somme des réponses pour `H` de 0 à `N − 1` est le **nombre de Catalan** `C(2N, N) / (N + 1)` : 1, 2, 5, 14, 42… Les arbres de hauteur `N − 1` sont des chemins, où chaque nœud choisit gauche ou droite pour son fils : il y en a `2^(N−1)`. Un arbre de hauteur `h` a au plus `2^(h+1) − 1` nœuds, et en a exactement autant pour une seule forme, l'arbre parfait : la réponse pour `N = 7`, `H = 2` vaut 1.
