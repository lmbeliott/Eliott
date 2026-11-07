---
id: egaliser-des-piles
title: Égaliser des piles
chapter: n1-listes
order: 6
tags: [listes]
samples: 2
---

## Énoncé
`N` piles de pièces sont alignées les unes à côté des autres. Un **déplacement** consiste à prendre une seule pièce sur une pile et à la poser sur une pile **voisine**, juste à sa gauche ou juste à sa droite.

Le nombre total de pièces est un multiple de `N`. Écris un programme qui affiche le plus petit nombre de déplacements nécessaires pour que toutes les piles contiennent le même nombre de pièces.

## Entrée
- La première ligne contient l'entier `N`, le nombre de piles.
- La deuxième ligne contient `N` entiers séparés par des espaces : le nombre de pièces de chaque pile, de gauche à droite.

## Sortie
Un seul entier : le plus petit nombre de déplacements.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque pile contient entre 0 et 1 000 pièces.
- Le nombre total de pièces est un multiple de `N`.

## Indices
1. À la fin, chaque pile contient `M` pièces, où `M` est le total divisé par `N`. Plutôt que de suivre les pièces une par une, regarde une **frontière** : l'espace entre deux piles voisines. Combien de pièces doivent la traverser ?
2. Prends la frontière juste après les `i` premières piles. À la fin, ces `i` piles doivent contenir `i × M` pièces en tout. Si elles en contiennent davantage au départ, le surplus doit traverser la frontière vers la droite ; s'il leur en manque, des pièces doivent la traverser vers la gauche. Chaque pièce qui traverse coûte un déplacement.
3. La réponse est la somme, sur toutes les frontières, de l'écart entre le nombre de pièces des `i` premières piles et `i × M` (en valeur positive). Calcule le nombre de pièces des `i` premières piles au fur et à mesure, en ajoutant une pile à chaque tour de boucle.

## Solution
Notons `M` le nombre de pièces par pile à la fin : le total divisé par `N`.

Regardons la frontière entre la pile `i` et la pile `i + 1`. À gauche de cette frontière, il y a `i` piles, qui contiennent ensemble `S` pièces au départ, et qui doivent en contenir `i × M` à la fin. Un déplacement ne fait traverser cette frontière qu'à une seule pièce à la fois. Il faut donc au moins `|S - i × M|` déplacements qui traversent cette frontière (la barre `| |` veut dire « en valeur positive »). Chaque déplacement traverse exactement une frontière, donc le total des déplacements est au moins la somme de ces nombres sur les `N - 1` frontières.

On peut toujours atteindre ce nombre : il suffit de ne jamais faire passer de pièces dans les deux sens à travers une même frontière, ce qui ne servirait à rien. La réponse est donc exactement cette somme.

Exemple : les piles `0 8 0 4`, avec `M = 3`.
- Après la pile 1 : 0 pièce au lieu de 3, il en manque 3, qui doivent venir de la droite.
- Après la pile 2 : 8 pièces au lieu de 6, il y en a 2 de trop, qui doivent partir à droite.
- Après la pile 3 : 8 pièces au lieu de 9, il en manque 1.

La réponse est 3 + 2 + 1 = 6.

Pour calculer `S` à chaque frontière, on garde une variable qui contient le nombre de pièces des piles déjà vues, et on lui ajoute la pile suivante à chaque tour : un seul parcours de la liste suffit.

Le piège est de chercher à simuler les déplacements un par un : c'est long et compliqué, et il est facile de faire un choix qui n'est pas le meilleur. Raisonner sur les frontières donne directement la réponse.
