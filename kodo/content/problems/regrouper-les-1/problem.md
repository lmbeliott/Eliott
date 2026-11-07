---
id: regrouper-les-1
title: Regrouper les 1
chapter: n1-listes
order: 8
tags: [listes]
samples: 2
---

## Énoncé
On te donne une liste de `N` valeurs, chacune égale à `0` ou à `1`. Un **échange** consiste à intervertir deux valeurs voisines de la liste.

Écris un programme qui affiche le plus petit nombre d'échanges nécessaires pour que tous les `1` se retrouvent les uns à côté des autres, sans aucun `0` entre eux. Le groupe de `1` obtenu peut se trouver n'importe où dans la liste.

## Entrée
- La première ligne contient l'entier `N`.
- La deuxième ligne contient `N` valeurs séparées par des espaces, chacune égale à `0` ou à `1`.

## Sortie
Un seul entier : le plus petit nombre d'échanges.

## Contraintes
- 1 ≤ N ≤ 50 000
- La liste contient au moins un `1`.

## Indices
1. Échanger deux `1` voisins ou deux `0` voisins ne sert à rien. Un échange utile fait donc passer un `0` par-dessus un `1`. À la fin, chaque `0` se retrouve soit à gauche du groupe de `1`, soit à sa droite.
2. Si un `0` finit à gauche du groupe, il doit passer par-dessus tous les `1` qui sont avant lui dans la liste ; s'il finit à droite, par-dessus tous les `1` qui sont après lui. Chaque passage coûte un échange.
3. Chaque `0` choisit le côté le moins cher : le plus petit entre le nombre de `1` avant lui et le nombre de `1` après lui. Ces choix ne se contredisent jamais. Compte d'abord le nombre total de `1`, puis parcours la liste en comptant les `1` déjà vus.

## Solution
Regardons ce que devient chaque `0`. À la fin, il est soit à gauche du groupe de `1`, soit à sa droite.

- S'il finit **à gauche**, tous les `1` placés avant lui dans la liste doivent passer de l'autre côté : il faut au moins autant d'échanges qui font passer ce `0` par-dessus un `1` que de `1` avant lui.
- S'il finit **à droite**, il faut de même au moins autant d'échanges que de `1` après lui.

Un échange ne fait passer qu'un seul `0` par-dessus un seul `1`. Le nombre total d'échanges est donc au moins la somme, sur tous les `0`, du plus petit des deux nombres : `1` avant lui, ou `1` après lui.

Ce minimum est atteignable. Quand on avance dans la liste, le nombre de `1` avant un `0` augmente et le nombre de `1` après lui diminue : les `0` qui préfèrent la gauche sont donc tous avant ceux qui préfèrent la droite. Il suffit de pousser les premiers vers la gauche et les seconds vers la droite, sans jamais faire d'échange inutile.

Le programme compte d'abord le nombre total `U` de `1`. Puis il parcourt la liste en gardant `avant`, le nombre de `1` déjà vus. Pour chaque `0`, il ajoute à la réponse le plus petit entre `avant` et `U - avant`.

Exemple avec `1 0 1 0 0 1` : `U = 3`. Le premier `0` a un `1` avant lui et deux après : coût 1. Les deux autres ont deux `1` avant et un après : coût 1 chacun. La réponse est 3, par exemple pour obtenir `0 1 1 1 0 0`.

Les pièges :
- choisir le même côté pour tous les `0` (tout pousser à gauche ou tout à droite) : dans l'exemple, cela coûte 4 ou 5 échanges au lieu de 3 ;
- essayer toutes les positions possibles du groupe de `1` et calculer le coût de chacune : c'est juste, mais avec 50 000 valeurs, cela demande des centaines de millions d'opérations ;
- recompter les `1` avant et après chaque `0` avec une nouvelle boucle : c'est aussi beaucoup trop lent. Un seul parcours suffit, avec un compteur.
