---
id: reconstruire-un-arbre-a-partir-de-deux-parcours
title: Reconstruire un arbre à partir de deux parcours
chapter: p4-arbres-binaires
order: 5
tags: [récursivité, parcours-en-profondeur]
samples: 3
---

## Énoncé
Un arbre binaire a `N` nœuds, numérotés de `1` à `N`. On a perdu l'arbre, mais on a gardé la liste de ses nœuds dans l'ordre **préfixe** et dans l'ordre **infixe**.

Afficher la liste de ses nœuds dans l'ordre **suffixe**, ou `IMPOSSIBLE` si aucun arbre binaire n'a ces deux parcours.

## Entrée
- La première ligne contient `N`.
- La deuxième ligne contient les `N` nœuds dans l'ordre préfixe.
- La troisième ligne contient les `N` nœuds dans l'ordre infixe.

Chacune des deux lignes contient chaque entier de `1` à `N` exactement une fois.

## Sortie
Les `N` nœuds dans l'ordre suffixe, sur une ligne, ou `IMPOSSIBLE`.

## Contraintes
- 1 ≤ N ≤ 1 000

## Indices
1. Le premier nœud de l'ordre préfixe est la racine. Où se trouve-t-elle dans l'ordre infixe, et que trouve-t-on de part et d'autre ?
2. Si la racine est en position `k` dans la portion infixe, le sous-arbre gauche a `k` nœuds (relativement au début de la portion) : ce sont aussi les `k` nœuds qui suivent la racine dans l'ordre préfixe. On recommence sur chaque sous-arbre.
3. Ranger la position de chaque nœud dans l'ordre infixe dans un tableau évite de la chercher à chaque fois. Si la racine d'une portion n'est pas dans la portion infixe correspondante, les deux parcours sont incompatibles.

## Solution
Dans l'ordre préfixe, la racine vient en premier, puis tout le sous-arbre gauche, puis tout le sous-arbre droit. Dans l'ordre infixe, on trouve le sous-arbre gauche, puis la racine, puis le sous-arbre droit.

La fonction récursive `construire(p, i, taille)` traite un sous-arbre de `taille` nœuds, qui occupe les positions `p` à `p + taille − 1` de l'ordre préfixe et `i` à `i + taille − 1` de l'ordre infixe. Si `taille = 0`, il n'y a rien à faire. Sinon, sa racine est `r = prefixe[p]` ; soit `k` la position de `r` dans l'ordre infixe (lue dans un tableau précalculé). Si `k` n'est pas entre `i` et `i + taille − 1`, aucun arbre ne convient : on répond `IMPOSSIBLE`. Sinon, le sous-arbre gauche a `g = k − i` nœuds : on appelle `construire(p + 1, i, g)`, puis `construire(p + 1 + g, k + 1, taille − 1 − g)`, et l'on écrit `r` à la fin, ce qui produit directement l'ordre suffixe.

**Correction.** Si un arbre a ces deux parcours, la description ci-dessus est forcée à chaque étape : l'arbre est **unique**, et la fonction écrit son ordre suffixe. Réciproquement, si aucune vérification n'échoue, chaque portion préfixe et la portion infixe correspondante contiennent les mêmes nœuds (chaque nœud de la portion préfixe a été trouvé, comme racine, dans la portion infixe de même taille), et l'arbre construit a bien les deux parcours donnés.

**Complexité.** Chaque nœud est la racine d'un seul appel : O(N) grâce au tableau des positions. Chercher la racine dans la portion infixe par une boucle coûterait O(N²) au pire, ce qui reste acceptable ici. La profondeur de récursion atteint `N` pour un arbre en forme de chemin.

**Remarque.** L'ordre préfixe et l'ordre suffixe ne suffisent pas à retrouver l'arbre : un nœud qui n'a qu'un fils donne les mêmes parcours que ce fils soit à gauche ou à droite.
