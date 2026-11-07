---
id: produits-de-facteurs-distincts
title: Produits de facteurs distincts
chapter: p4-exploration
order: 3
tags: [backtracking, mathématiques, arithmétique]
samples: 2
---

## Énoncé
Compter les façons d'écrire un entier `N` comme un produit d'entiers **distincts**, tous supérieurs ou égaux à 2. L'ordre des facteurs ne compte pas, et `N` lui-même (un seul facteur) est une écriture.

Par exemple, 24 s'écrit de 5 façons : 24, 2 × 12, 3 × 8, 4 × 6 et 2 × 3 × 4. L'écriture 2 × 2 × 6 ne compte pas, car le facteur 2 y apparaît deux fois.

## Entrée
Une seule ligne contenant `N`.

## Sortie
Un seul entier : le nombre d'écritures.

## Contraintes
- 2 ≤ N ≤ 100 000 000

## Indices
1. Pour ne pas compter plusieurs fois le même produit dans des ordres différents, on impose des facteurs **strictement croissants**.
2. Une fonction récursive `compter(reste, d)` compte les écritures de `reste` avec des facteurs croissants supérieurs ou égaux à `d`. Les facteurs possibles sont des diviseurs de `N` : on les calcule une fois pour toutes.
3. Si `f` est le prochain facteur et que d'autres facteurs suivent, ils sont plus grands que `f`, donc `reste ≥ f × (f + 1)` : on peut arrêter la boucle dès que `f × f ≥ reste`.

## Solution
**Briser la symétrie.** Un produit de facteurs distincts s'écrit d'une seule façon avec des facteurs strictement croissants : on n'énumère que ces écritures-là.

On calcule d'abord la liste triée `div` des diviseurs de `N` supérieurs ou égaux à 2, en essayant les entiers jusqu'à √N. La fonction `compter(reste, i)` compte les écritures de `reste` comme produit croissant de facteurs pris parmi `div[i], div[i + 1], …` :
- `reste` lui-même peut être le dernier facteur : cela compte pour 1 (il est au moins égal à `div[i]`, car il est plus grand que le facteur précédent) ;
- sinon, on choisit le plus petit facteur `f = div[j]`, avec `j ≥ i`, qui divise `reste`, et l'on compte les écritures de `reste / f` avec des facteurs pris à partir de `div[j + 1]`.

**Élagage.** Après `f`, il reste au moins un facteur, plus grand que `f` : `reste / f > f`, donc `f × f < reste`. La boucle sur `j` s'arrête dès que `div[j]² ≥ reste`. Une écriture a au plus 10 facteurs, car des facteurs distincts valent au moins 2, 3, 4…, et 2 × 3 × … × 12 = 479 001 600 dépasse 10⁸ : la profondeur de récursion ne dépasse pas 10.

**Taille de l'arbre.** Chaque appel compte au moins l'écriture « `reste` seul » : le nombre d'appels est exactement la réponse. Le pire cas pour `N ≤ 10⁸` est `N = 86 486 400`, avec 327 873 écritures. Une énumération de tous les produits ordonnés, ou de tous les ensembles de diviseurs (`N` peut en avoir 768), serait sans espoir.

**Pour vérifier.** Pour un nombre premier, la réponse est 1. Pour `N = 2^k`, les facteurs sont des puissances de 2 distinctes, et la réponse est le nombre de façons d'écrire `k` comme somme d'entiers distincts.
