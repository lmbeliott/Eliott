---
id: persistance-multiplicative
title: Persistance multiplicative
chapter: p3-recursivite
order: 1
tags: [récursivité, mathématiques]
samples: 2
---

## Énoncé
On part d'un entier positif ou nul. Tant qu'il a au moins deux chiffres, on le remplace par le produit de ses chiffres. Par exemple : 39 → 27 → 14 → 4. La **persistance** du nombre de départ est le nombre de remplacements effectués : 3 pour 39, 0 pour 4.

Calculer la persistance de chacun des Q nombres donnés.

## Entrée
La première ligne contient Q. Chacune des Q lignes suivantes contient un entier N.

## Sortie
Q lignes : la persistance de chaque nombre, dans l'ordre de l'entrée.

## Contraintes
- 1 ≤ Q ≤ 1 000
- 0 ≤ N ≤ 10¹⁸

## Indices
1. Écrire d'abord une fonction récursive `produit(n)` : le produit des chiffres de `n` est le dernier chiffre multiplié par le produit des chiffres de `n // 10`. Quel est le cas de base ?
2. La persistance aussi se définit récursivement : 0 si `n < 10`, sinon 1 de plus que la persistance de `produit(n)`.

## Solution
Deux fonctions récursives suffisent.

- `produit(n)` : si `n < 10`, le nombre n'a qu'un chiffre, et le produit vaut `n`. Sinon, il vaut `(n % 10) × produit(n // 10)`.
- `persistance(n)` : si `n < 10`, aucun remplacement n'est nécessaire, elle vaut 0. Sinon, on fait un remplacement, puis il reste à calculer la persistance de `produit(n)` : elle vaut `1 + persistance(produit(n))`.

**Correction.** Pour `produit`, par récurrence sur le nombre de chiffres : vrai pour un chiffre (cas de base) ; si c'est vrai pour `n // 10`, qui a un chiffre de moins, multiplier par le dernier chiffre donne bien le produit de tous les chiffres. Pour `persistance`, la définition récursive recopie exactement la règle de l'énoncé.

**Terminaison.** Pour `n ≥ 10`, le produit des chiffres est strictement plus petit que `n` : si `n` a `k` chiffres et commence par le chiffre `a`, le produit vaut au plus `a × 9^(k−1)`, alors que `n ≥ a × 10^(k−1)`. La suite des valeurs décroît strictement, donc les appels s'arrêtent.

**Coût.** `produit` fait un appel par chiffre, soit au plus 19. La persistance reste très petite : aucun nombre jusqu'à 10¹⁸ ne dépasse 11 (le plus petit nombre de persistance 11 est 277 777 788 888 899). En C++, `n` doit être un `long long`, et le produit aussi : 9¹⁸ dépasse 2³¹.
