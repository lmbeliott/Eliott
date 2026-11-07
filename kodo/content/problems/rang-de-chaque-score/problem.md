---
id: rang-de-chaque-score
title: Rang de chaque score
chapter: n2-trier-compter
order: 7
tags: [tri, dictionnaires]
samples: 2
---

## Énoncé
`N` participants ont obtenu chacun un score. Plus le score est grand, meilleur est le classement. Le **rang** d'un participant vaut 1 plus le nombre de participants qui ont un score **strictement** plus grand que le sien. Des participants qui ont le même score ont donc le même rang : avec les scores `90`, `80`, `80` et `50`, les rangs sont 1, 2, 2 et 4 (personne n'est troisième).

Écris un programme qui affiche le rang de chaque participant, dans l'ordre où les scores sont donnés.

## Entrée
- La première ligne contient l'entier `N`, le nombre de participants.
- La deuxième ligne contient `N` entiers séparés par des espaces : les scores des participants.

## Sortie
Une seule ligne avec `N` entiers séparés par des espaces : le rang de chaque participant, dans l'ordre de l'entrée.

## Contraintes
- 1 ≤ N ≤ 10 000
- Chaque score est compris entre 0 et 1 000 000.

## Indices
1. Pour chaque participant, compter un par un les scores plus grands que le sien est trop lent quand `N` vaut 10 000 : cela fait 100 millions de comparaisons. Trie plutôt une **copie** des scores, du plus grand au plus petit, sans toucher à la liste de départ.
2. Dans la liste triée, la première apparition d'un score `s`, à la position `i` (en comptant à partir de 1), a exactement `i - 1` scores strictement plus grands devant elle : le rang de `s` est donc `i`.
3. Range ces rangs dans un dictionnaire, en ne gardant que la **première** apparition de chaque score. Il ne reste qu'à parcourir la liste de départ et à afficher le rang de chaque score.

## Solution
On ne peut pas trier directement la liste des scores : il faut afficher les rangs dans l'ordre de l'entrée. On trie donc une copie, du plus grand score au plus petit.

Dans cette copie triée, les scores égaux sont côte à côte, et tous les scores strictement plus grands que `s` sont devant le premier `s`. Si ce premier `s` est à la position `i` (en comptant à partir de 1), il y a `i - 1` scores plus grands, et le rang de `s` vaut `i`. On parcourt la copie triée et on note, dans un dictionnaire, le rang de chaque score la première fois qu'on le rencontre. Ensuite, on parcourt la liste de départ et on affiche `rang[s]` pour chaque score.

Sur le premier exemple, la copie triée est `90 80 50 50` : `90` apparaît d'abord en position 1, `80` en position 2 et `50` en position 3. Les rangs, dans l'ordre de l'entrée `50 80 50 90`, sont `3 2 3 1`.

Les pièges :
- écraser le rang à chaque apparition d'un score : le dernier `50` est en position 4, mais le rang de `50` est 3 ;
- donner des rangs qui se suivent sans trou (1, 2, 2, 3) : après deux participants deuxièmes, le suivant est quatrième ;
- trier la liste de départ elle-même : on perd alors l'ordre dans lequel il faut afficher les rangs.

Le tri fait l'essentiel du travail : quelques centaines de milliers d'opérations pour `N = 10 000`, contre 100 millions de comparaisons pour la méthode qui compte, pour chaque participant, les scores meilleurs que le sien.
