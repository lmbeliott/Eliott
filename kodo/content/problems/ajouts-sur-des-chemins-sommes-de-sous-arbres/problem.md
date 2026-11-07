---
id: ajouts-sur-des-chemins-sommes-de-sous-arbres
title: Ajouts sur des chemins, sommes de sous-arbres
chapter: n4-arbres
order: 6
tags: [graphes, parcours-en-profondeur, fenwick, bits]
samples: 2
time_limit_ms: 500
---

## Énoncé
On donne un arbre de `N` sommets, numérotés de `1` à `N`, enraciné au sommet `1`. Chaque sommet porte une valeur, qui vaut `0` au départ. Le **sous-arbre** de `v` est formé de `v` et de tous ses descendants.

Écris un programme qui traite, dans l'ordre, une suite de `Q` opérations de deux types :
- `1 U V X` : ajoute `X` à la valeur de chacun des sommets du chemin entre `U` et `V`, `U` et `V` compris ;
- `2 V` : affiche la somme des valeurs des sommets du sous-arbre de `V`.

## Entrée
- La première ligne contient deux entiers `N` et `Q`.
- La deuxième ligne contient `N - 1` entiers : le parent de chacun des sommets `2, 3, …, N`, dans cet ordre. Elle est vide si `N = 1`.
- Chacune des `Q` lignes suivantes contient une opération : l'entier `1` suivi de `U`, `V` et `X`, ou l'entier `2` suivi de `V`.

Un sommet peut avoir un numéro plus petit que son parent.

## Sortie
Pour chaque opération de type `2`, dans l'ordre, une ligne avec la somme demandée.

## Contraintes
- 1 ≤ N ≤ 10 000
- 1 ≤ Q ≤ 8 000
- 1 ≤ U, V ≤ N (`U` et `V` peuvent être égaux)
- 1 ≤ X ≤ 1 000

## Indices
1. Commence par un cas plus simple : si l'on pose une « marque » `c[z]` sur certains sommets, et que la valeur d'un sommet `y` est la somme des marques de son sous-arbre, comment ajouter `X` à tout le chemin de `U` à `V` en ne changeant que quatre marques ? Pense à l'ancêtre commun `W` de `U` et `V`.
2. Pose `+X` en `U`, `+X` en `V`, `-X` en `W` et `-X` au parent de `W`. Il reste à calculer la somme des valeurs d'un sous-arbre à partir des marques : une marque `c[z]` placée dans le sous-arbre de `v` compte pour chaque sommet du chemin de `v` à `z`, soit `profondeur[z] - profondeur[v] + 1` fois.
3. La réponse est donc `Σ c[z] × profondeur[z] - (profondeur[v] - 1) × Σ c[z]`, les sommes portant sur le sous-arbre de `v`. Avec un parcours en profondeur, un sous-arbre devient un intervalle de positions : deux arbres de Fenwick suffisent.

## Solution
**Des marques au lieu des valeurs.** On garde un tableau de marques `c`, de sorte que la valeur d'un sommet `y` soit la somme des marques de son sous-arbre. Pour ajouter `X` au chemin `U – V`, on calcule l'ancêtre commun `W` par **remontée binaire**, puis on fait `c[U] += X`, `c[V] += X`, `c[W] -= X` et, si `W` n'est pas la racine, `c[parent(W)] -= X`. Vérifions : un sommet strictement entre `U` et `W` voit seulement la marque de `U` ; `W` voit `+X + X - X` ; un ancêtre strict de `W` voit `+X + X - X - X = 0` ; les autres sommets ne voient rien. Si `U = W`, la marque de `U` et celle de `W` se compensent et `W` reçoit bien `X` une seule fois.

**Somme d'un sous-arbre.** La somme des valeurs du sous-arbre de `v` vaut
`Σ_{y dans le sous-arbre de v} Σ_{z dans le sous-arbre de y} c[z]`.
Une marque `c[z]` y est comptée une fois pour chaque sommet `y` du chemin de `v` à `z`, soit `profondeur[z] - profondeur[v] + 1` fois. La somme vaut donc
`S₂ - (profondeur[v] - 1) × S₁`, avec `S₁ = Σ c[z]` et `S₂ = Σ c[z] × profondeur[z]` sur le sous-arbre de `v`.

**Les structures.** Un **parcours en profondeur** (sans récursion) numérote les sommets : le sous-arbre de `v` occupe les positions `début[v] … fin[v]`. Deux **arbres de Fenwick** sur ces positions contiennent `c[z]` et `c[z] × profondeur[z]` à la position `début[z]`. Un ajout modifie quatre cases dans chacun ; une question lit deux sommes d'intervalle dans chacun.

Complexité : **O(N log N)** pour la préparation, puis **O(log N)** par opération.

Pourquoi la méthode naïve échoue : sur un arbre profond, un chemin peut compter des milliers de sommets, et un sous-arbre aussi. Parcourir le chemin à chaque ajout et le sous-arbre à chaque question fait des dizaines de millions d'opérations. Un seul arbre de Fenwick sur les marques donnerait la **valeur** d'un sommet, pas la somme de tout un sous-arbre : c'est le deuxième, pondéré par la profondeur, qui fait la différence.

Pièges :
- Quand `W` est la racine, il n'y a pas de parent où poser `-X`.
- Les sommes dépassent 2³¹ : utilise des `long long` en C++.
- La récursion sur un arbre de profondeur 10 000 dépasse la limite par défaut de Python : utilise une pile.
