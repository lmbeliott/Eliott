---
id: sommets-eloignes-dans-un-arbre
title: Sommets éloignés dans un arbre
chapter: n4-dynamique-avancee
order: 3
tags: [programmation-dynamique, graphes]
samples: 2
---

## Énoncé
On donne un arbre de `N` sommets numérotés de `1` à `N`. Le sommet `i` a un poids `W[i]`. La **distance** entre deux sommets est le nombre d'arêtes du chemin qui les relie.

Écris un programme qui choisit des sommets deux à deux à distance **au moins 3**, de façon à maximiser la somme de leurs poids, et qui affiche cette somme.

## Entrée
- La première ligne contient l'entier `N`.
- La deuxième ligne contient les `N` entiers `W[1]`, …, `W[N]`.
- La troisième ligne contient `N - 1` entiers `P[2]`, …, `P[N]` : pour chaque sommet `i ≥ 2`, une arête relie `i` à `P[i]`, avec `P[i] < i`. Cette ligne est vide si `N = 1`.

## Sortie
Un seul entier : la plus grande somme possible.

## Contraintes
- 1 ≤ N ≤ 15 000
- 1 ≤ W[i] ≤ 1 000
- 1 ≤ P[i] < i

## Indices
1. Enracine l'arbre en `1`. Pour décider ce qu'on fait d'un sommet, il faut savoir à quelle distance se trouve le sommet choisi le plus proche dans son sous-arbre : `0` (le sommet lui-même), `1` (un de ses enfants) ou au moins `2`.
2. Calcule trois valeurs par sommet `v` : `pris[v]` (v est choisi), `enfant[v]` (v ne l'est pas, mais un de ses enfants l'est) et `libre[v]` (ni v ni ses enfants ne le sont). Deux enfants de `v` sont à distance 2 : un seul au plus peut être choisi.
3. Comme `P[i] < i`, parcourir les sommets de `N` à `1` traite chaque enfant avant son parent. Pas besoin de récursion.

## Solution
**Les états.** Enracinons l'arbre en `1`. Les contraintes entre le sous-arbre d'un sommet `v` et le reste de l'arbre passent par `v`. Il suffit de savoir si `v` est choisi, ou sinon si un de ses enfants l'est. On définit, pour le sous-arbre de `v` :
- `pris[v]` : meilleure somme avec `v` choisi ;
- `enfant[v]` : `v` non choisi, un enfant de `v` choisi ;
- `libre[v]` : ni `v` ni ses enfants choisis.

**Les transitions**, en notant `m(c) = max(enfant[c], libre[c])` pour un enfant `c` :
- `pris[v] = W[v] + somme des libre[c]` : les enfants (distance 1) et les petits-enfants (distance 2) sont interdits.
- `libre[v] = somme des m(c)` : deux sommets choisis dans des sous-arbres d'enfants différents sont à distance au moins `2 + 1 + 1 = 4`.
- `enfant[v] = somme des m(c) + max sur c de (pris[c] - m(c))` : un seul enfant `c` est choisi, car deux enfants sont à distance 2. Les autres enfants `c'` ne doivent pas être choisis. Leurs propres enfants sont alors à distance 3 de `c`, ce qui est permis.

La réponse est `max(pris[1], enfant[1], libre[1])`. Comme `P[i] < i`, on parcourt `i` de `N` à `1` en ajoutant la contribution de `i` à son parent. Chaque sommet est traité une fois : **O(N)**.

Pourquoi les idées simples échouent : essayer tous les ensembles de sommets coûte 2ᴺ. Le glouton « prendre le sommet le plus lourd encore permis » se trompe, et les tests contiennent des cas où il échoue. Le problème ressemble à celui de l'ensemble indépendant (distance au moins 2), mais la distance 3 oblige à suivre aussi les enfants : deux états ne suffisent pas.

Pièges :
- Une feuille n'a pas d'enfant : `enfant[feuille]` est impossible. Donne-lui une valeur très négative (et non `0`).
- Une récursion sur un arbre en forme de chemin dépasse la limite de récursion de Python. Le parcours de `N` à `1` l'évite.
