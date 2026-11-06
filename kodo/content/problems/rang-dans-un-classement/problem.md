---
id: rang-dans-un-classement
title: Rang dans un classement
chapter: n3-dichotomie
order: 1
tags: [dichotomie, tri]
samples: 2
---

## Énoncé
Les N participants d'une course ont chacun un temps, en secondes. Pour un temps t, la **place** vaut 1 plus le nombre de participants strictement plus rapides (dont le temps est strictement inférieur à t). Les **ex æquo** sont les participants dont le temps vaut exactement t.

Écris un programme qui donne, pour chacun des Q temps demandés, sa place et son nombre d'ex æquo. Les temps demandés ne s'ajoutent pas au classement : chacun est comparé seulement aux N participants.

## Entrée
- La première ligne contient deux entiers N et Q.
- La deuxième ligne contient N entiers : les temps des participants, dans le désordre.
- La troisième ligne contient Q entiers : les temps demandés.

## Sortie
Q lignes, une par temps demandé dans l'ordre de l'entrée : deux entiers séparés par une espace, la place puis le nombre d'ex æquo.

## Contraintes
- 1 ≤ N ≤ 12 000
- 1 ≤ Q ≤ 12 000
- Tous les temps sont des entiers entre 1 et 50 000.

## Indices
1. Comparer chaque temps demandé à tous les participants fait N × Q = 144 millions de comparaisons : trop lent. Trie d'abord les temps des participants.
2. Dans la liste triée, les participants strictement plus rapides que t forment un bloc au début de la liste. Leur nombre est le premier indice i tel que `temps[i] >= t` : trouve-le par dichotomie.
3. Le nombre de temps égaux à t, c'est (nombre de temps `< t + 1`) − (nombre de temps `< t`), car les temps sont entiers. Une seule fonction de recherche suffit donc, appelée deux fois.

## Solution
**L'idée : trier, puis chercher par dichotomie.** On trie une fois les N temps des participants. Dans la liste triée, la condition `temps[i] >= t` est fausse au début puis vraie jusqu'à la fin. Le premier indice où elle devient vraie est exactement le nombre de participants strictement plus rapides que t. On le trouve par dichotomie en gardant un intervalle `[gauche, droite)` qui contient la réponse :
- si `temps[milieu] < t`, la réponse est après `milieu` : `gauche = milieu + 1` ;
- sinon, `milieu` est peut-être la réponse : `droite = milieu`.

La place vaut ce nombre plus 1. Comme les temps sont entiers, « temps ≤ t » équivaut à « temps < t + 1 » : le nombre d'ex æquo vaut `nb_plus_rapides(t + 1) − nb_plus_rapides(t)`.

Sur le premier exemple, la liste triée est `6540 6540 7100 7300 8100 9020`. Pour t = 7300, trois participants sont strictement plus rapides (6540, 6540 et 7100) : la place est 4, avec un ex æquo.

**Complexité.** Le tri coûte O(N log N), puis chaque temps demandé coûte deux recherches en O(log N) : O((N + Q) log N) en tout, soit quelques centaines de milliers d'opérations.

**Pourquoi la solution naïve est trop lente.** Parcourir les N temps pour chaque temps demandé fait N × Q = 1,44 × 10⁸ comparaisons, soit une dizaine de secondes en Python.

**Pièges.**
- La boucle `while gauche < droite` avec `droite = milieu` (et non `milieu − 1`) ne saute jamais la réponse et s'arrête toujours : l'intervalle rétrécit à chaque tour.
- Un temps plus rapide que tous les participants a la place 1 ; un temps plus lent que tous a la place N + 1. La recherche doit donc pouvoir renvoyer 0 et N : d'où `droite = len(temps)` au départ, et pas `len(temps) − 1`.
- En Python, le module `bisect` fait la même chose : `bisect_left(temps, t)` compte les temps `< t` et `bisect_right(temps, t)` compte les temps `≤ t`.
