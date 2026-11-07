---
id: sommes-de-sous-arbres-avec-modifications
title: Sommes de sous-arbres avec modifications
chapter: n4-arbres
order: 5
tags: [graphes, parcours-en-profondeur, fenwick]
samples: 2
time_limit_ms: 500
---

## Énoncé
On donne un arbre de `N` sommets, numérotés de `1` à `N`, enraciné au sommet `1`. Chaque sommet `v` porte une valeur `P[v]`. Le **sous-arbre** de `v` est formé de `v` et de tous ses descendants.

Écris un programme qui traite, dans l'ordre, une suite de `Q` opérations de deux types :
- `1 V X` : la valeur du sommet `V` devient `X` ;
- `2 V` : affiche la somme des valeurs des sommets du sous-arbre de `V`.

## Entrée
- La première ligne contient deux entiers `N` et `Q`.
- La deuxième ligne contient `N` entiers `P[1] … P[N]`.
- La troisième ligne contient `N - 1` entiers : le parent de chacun des sommets `2, 3, …, N`, dans cet ordre. Elle est vide si `N = 1`.
- Chacune des `Q` lignes suivantes contient une opération : l'entier `1` suivi de `V` et `X`, ou l'entier `2` suivi de `V`.

Un sommet peut avoir un numéro plus petit que son parent.

## Sortie
Pour chaque opération de type `2`, dans l'ordre, une ligne avec la somme demandée.

## Contraintes
- 1 ≤ N ≤ 8 000
- 1 ≤ Q ≤ 8 000
- 0 ≤ P[v], X ≤ 1 000
- 1 ≤ V ≤ N

## Indices
1. Parcourir le sous-arbre à chaque question est trop lent sur un arbre profond. Garder la somme de chaque sous-arbre et mettre à jour tous les ancêtres à chaque modification l'est aussi.
2. Numérote les sommets dans l'ordre où un parcours en profondeur les visite pour la première fois. Que remarques-tu sur les numéros des sommets d'un même sous-arbre ?
3. Le sous-arbre de `v` occupe un intervalle de positions consécutives `[début[v], fin[v]]`. La question devient une somme sur un intervalle, et la modification un changement d'une seule case : c'est le travail d'un arbre de Fenwick.

## Solution
On fait un **parcours en profondeur** depuis la racine et on note `début[v]`, la position de `v` dans l'ordre de visite (de `1` à `N`). Un parcours en profondeur visite tout le sous-arbre de `v` juste après `v`, avant de passer à autre chose : les sommets du sous-arbre occupent donc exactement les positions `début[v], début[v] + 1, …, fin[v]`, où `fin[v]` est la dernière position attribuée pendant la visite du sous-arbre.

On range la valeur de chaque sommet `v` dans la case `début[v]` d'un **arbre de Fenwick** :
- `2 V` : la réponse est la somme des cases `début[V] … fin[V]`, c'est-à-dire `préfixe(fin[V]) - préfixe(début[V] - 1)` ;
- `1 V X` : on ajoute `X - P[V]` à la case `début[V]`, puis on retient que `P[V]` vaut `X`.

Le parcours se fait sans récursion, avec une pile : quand on retire un sommet, on lui attribue sa position, on empile un marqueur, puis ses enfants. Quand on retire le marqueur, tout son sous-arbre a été visité et on note `fin[v]`.

Complexité : **O(N + Q log N)**.

Pourquoi les méthodes naïves échouent, sur un arbre très profond (proche d'un chemin) :
- parcourir le sous-arbre à chaque question coûte jusqu'à `N` opérations par question ;
- garder la somme de chaque sous-arbre et la corriger chez tous les ancêtres à chaque modification coûte la profondeur, jusqu'à `N`.
Dans les deux cas, on atteint des dizaines de millions d'opérations.

Pièges :
- L'opération `1` **remplace** la valeur : il faut ajouter la différence avec l'ancienne valeur, et retenir la nouvelle.
- La récursion sur un arbre de profondeur 8 000 dépasse la limite par défaut de Python : utilise une pile.
- Un sommet peut avoir un numéro plus petit que son parent : construis d'abord les listes d'enfants.
