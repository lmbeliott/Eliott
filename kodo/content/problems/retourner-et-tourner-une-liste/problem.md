---
id: retourner-et-tourner-une-liste
title: Retourner et tourner une liste
chapter: p2-fonctions
order: 7
tags: [fonctions, listes, simulation]
samples: 2
---

## Énoncé
Une liste de `N` entiers subit `Q` opérations, de deux sortes :
- `R L D` : **retourner** la portion qui va de la position `L` à la position `D` (positions numérotées à partir de 1). Par exemple, `R 2 4` transforme `1 2 3 4 5` en `1 4 3 2 5`.
- `T K` : **tourner** la liste de `K` places vers la gauche : les `K` premiers éléments passent à la fin, dans le même ordre. Par exemple, `T 2` transforme `1 2 3 4 5` en `3 4 5 1 2`.

Afficher la liste après toutes les opérations.

## Entrée
- La première ligne contient deux entiers `N` et `Q`.
- La deuxième ligne contient les `N` entiers de la liste.
- Chacune des `Q` lignes suivantes contient une opération : la lettre `R` suivie de deux entiers `L` et `D`, ou la lettre `T` suivie d'un entier `K`.

## Sortie
Une seule ligne : les `N` entiers de la liste finale, séparés par des espaces.

## Contraintes
- 1 ≤ N ≤ 1 000
- 1 ≤ Q ≤ 300
- 1 ≤ L ≤ D ≤ N
- 0 ≤ K < N
- Les entiers de la liste sont compris entre 1 et 10⁹.

## Indices
1. Écrire une fonction `retourner(t, i, j)` qui renverse la portion de `t` entre les indices `i` et `j` (comptés à partir de 0) en échangeant les extrémités, sans rien renvoyer : elle modifie la liste reçue.
2. Tourner peut se faire avec trois retournements. Essayer sur `1 2 3 4 5` avec `K = 2` : retourner les 2 premiers, puis les 3 derniers, puis la liste entière.
3. Attention à une fonction qui écrirait `t = …` : affecter une nouvelle liste au paramètre ne change pas la liste de l'appelant.

## Solution
La fonction `retourner(t, i, j)` est celle du cours : tant que `i < j`, elle échange `t[i]` et `t[j]`, puis rapproche `i` et `j`. Elle modifie directement la liste passée en argument (en C++, le paramètre est un `vector<int> &`). Pour l'opération `R L D`, on l'appelle avec `L - 1` et `D - 1`, car les positions de l'énoncé commencent à 1.

Pour tourner de `K` places, on utilise une jolie astuce : on retourne les `K` premiers éléments, puis les `N - K` derniers, puis toute la liste. Sur `1 2 3 4 5` avec `K = 2` : `2 1 5 4 3`, puis `3 4 5 1 2`. En effet, retourner toute la liste met le bloc de fin au début, mais chaque bloc se retrouve à l'envers ; les deux premiers retournements les avaient mis à l'envers à l'avance, ce qui les remet dans le bon ordre. La fonction `tourner(t, k)` se contente donc d'appeler trois fois `retourner`. Si `K = 0`, rien ne change (la première portion est vide).

Chaque opération déplace au plus `N` éléments : au total, au plus 300 000 échanges.

Le piège : en Python, écrire `def tourner(t, k): t = t[k:] + t[:k]` ne fait rien d'utile. La fonction fabrique une nouvelle liste et la range dans son paramètre local `t`, mais la liste de l'appelant n'est pas modifiée. Il faut soit modifier la liste case par case, comme ici, soit renvoyer la nouvelle liste avec `return` et écrire `t = tourner(t, k)`. En C++, l'oubli du `&` dans `vector<int> &t` provoque le même genre d'erreur : la fonction travaille sur une copie.
