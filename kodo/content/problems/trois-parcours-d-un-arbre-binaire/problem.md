---
id: trois-parcours-d-un-arbre-binaire
title: Trois parcours d'un arbre binaire
chapter: p4-arbres-binaires
order: 1
tags: [récursivité, parcours-en-profondeur]
samples: 2
---

## Énoncé
Un arbre binaire a `N` nœuds, numérotés de `1` à `N`. Pour chaque nœud, on donne le numéro de son fils gauche et celui de son fils droit (`0` s'il n'en a pas). La racine n'est pas donnée : c'est le seul nœud qui n'est le fils d'aucun autre.

Afficher les numéros des nœuds dans l'ordre **préfixe**, puis dans l'ordre **infixe**, puis dans l'ordre **suffixe**.

## Entrée
- La première ligne contient `N`.
- La ligne `i + 1` (pour `i` de 1 à `N`) contient deux entiers `G` et `D` : les fils gauche et droit du nœud `i`.

Les données décrivent toujours un arbre binaire.

## Sortie
Trois lignes de `N` entiers séparés par des espaces : l'ordre préfixe, l'ordre infixe, puis l'ordre suffixe.

## Contraintes
- 1 ≤ N ≤ 1 000

## Indices
1. Pour trouver la racine, marquer tous les nœuds qui apparaissent comme fils : la racine est le seul nœud non marqué.
2. Les trois parcours s'écrivent avec la même fonction récursive : seul change le moment où l'on écrit le nœud (avant, entre ou après les appels sur ses deux fils).
3. L'arbre peut être un long chemin de 1 000 nœuds : relever la limite de récursion en Python.

## Solution
On lit les tableaux `gauche` et `droite`, et l'on marque chaque nœud qui apparaît comme fils. La racine est l'unique nœud non marqué : tout nœud sauf la racine a exactement un père.

La fonction `parcourir(v)` ne fait rien si `v = 0` ; sinon, elle écrit `v` dans la liste préfixe, s'appelle sur `gauche[v]`, écrit `v` dans la liste infixe, s'appelle sur `droite[v]`, et écrit `v` dans la liste suffixe. Un seul appel sur la racine remplit les trois listes.

**Correction.** Par récurrence sur la taille du sous-arbre : l'appel sur `v` écrit dans chaque liste exactement les nœuds du sous-arbre de `v`, dans l'ordre demandé, car l'ordre préfixe d'un arbre est la racine suivie de l'ordre préfixe du sous-arbre gauche puis de celui du sous-arbre droit, et de même pour les deux autres.

**Complexité.** Un appel par nœud et un par fils absent : O(N). La profondeur de la récursion est la hauteur de l'arbre, au plus `N = 1 000` : en Python, on relève la limite avec `sys.setrecursionlimit`.
