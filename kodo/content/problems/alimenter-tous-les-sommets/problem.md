---
id: alimenter-tous-les-sommets
title: Alimenter tous les sommets
chapter: n4-chemins
order: 4
tags: [graphes, union-find, glouton, tri]
samples: 2
---

## Énoncé
On a `N` sommets, numérotés de `1` à `N`, à alimenter. On dispose de deux moyens, que l'on peut combiner :
- installer une **source** sur le sommet `i`, pour un coût `P[i]` ;
- construire une **liaison** parmi `M` liaisons possibles : la liaison `A B C` relie les sommets `A` et `B` pour un coût `C`.

Un sommet est **alimenté** s'il porte une source, ou s'il est relié par une suite de liaisons construites à un sommet qui porte une source. Écris un programme qui calcule le coût total minimal pour que tous les sommets soient alimentés.

## Entrée
- La première ligne contient deux entiers `N` et `M`.
- La deuxième ligne contient `N` entiers `P[1] … P[N]`.
- Chacune des `M` lignes suivantes contient trois entiers `A`, `B` et `C` : une liaison possible.

## Sortie
Un seul entier : le coût total minimal.

## Contraintes
- 1 ≤ N ≤ 3 000
- 0 ≤ M ≤ 4 500
- 1 ≤ A, B ≤ N et A ≠ B ; deux sommets peuvent avoir plusieurs liaisons possibles
- 1 ≤ P[i], C ≤ 10⁶

## Indices
1. Si une seule source était permise, déjà installée, il faudrait relier tous les sommets au moindre coût : c'est un **arbre couvrant de poids minimal**, que donne l'algorithme de Kruskal (trier les liaisons, prendre chacune si elle relie deux groupes différents de l'union-find).
2. Ajoute un sommet fictif `0`, « la centrale ». Installer une source sur `i` revient à construire une liaison `0 — i` de coût `P[i]`.
3. Avec ce sommet en plus, un choix est valable exactement quand les `N + 1` sommets sont reliés. La réponse est le poids d'un arbre couvrant minimal du graphe à `N + 1` sommets.

## Solution
On ajoute un **sommet fictif** `0`, et pour chaque sommet `i` une arête `0 — i` de coût `P[i]`. Un choix de sources et de liaisons alimente tout le monde exactement quand, dans ce nouveau graphe, chaque sommet est relié au sommet `0`, c'est-à-dire quand les `N + 1` sommets sont tous reliés entre eux. Le coût minimal est donc celui d'un **arbre couvrant de poids minimal** de ce graphe : une solution optimale ne contient jamais de cycle, puisqu'on pourrait retirer l'arête la plus chère du cycle.

On applique l'**algorithme de Kruskal** : on trie les `M + N` arêtes par coût croissant, puis on les parcourt en gardant les groupes de sommets déjà reliés dans un **union-find**. Une arête qui relie deux groupes différents est prise et les fusionne ; une arête interne à un groupe est ignorée. On s'arrête après `N` arêtes prises.

Pourquoi c'est juste : à chaque étape, l'arête la moins chère qui relie deux groupes différents peut toujours faire partie d'une solution optimale. Si une solution optimale ne la contient pas, l'ajouter crée un cycle qui contient une autre arête entre ces deux groupes, au moins aussi chère : on échange les deux.

Complexité : **O((N + M) log(N + M))**, dominée par le tri.

Pourquoi les autres idées échouent :
- Construire l'arbre couvrant minimal des liaisons, puis installer une source sur le sommet le moins cher de chaque groupe, est faux. Sur le premier exemple, cela coûte `2 + 4 + 7 + 3 = 16`, alors qu'il vaut mieux ne pas construire la liaison de coût `7` et installer une deuxième source de coût `5` : total `14`.
- Essayer tous les ensembles de sources possibles coûte 2ᴺ arbres couvrants.
- Kruskal sans union-find, en vérifiant par un parcours si deux sommets sont déjà reliés, coûte O(M × N) : trop lent en Python.

Pièges :
- Le graphe des liaisons peut ne pas être connexe : chaque partie a besoin d'au moins une source, ce que le sommet fictif garantit tout seul.
- Le coût total peut dépasser 2³¹ : utilise des `long long` en C++.
- Une liaison peut apparaître plusieurs fois avec des coûts différents : Kruskal garde naturellement la moins chère.
