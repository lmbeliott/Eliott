---
id: compter-les-sous-ensembles
title: Compter les sous-ensembles
chapter: n4-structures
order: 3
tags: [bits, programmation-dynamique]
samples: 2
---

## Énoncé
Un sous-ensemble de `{0, 1, …, 15}` est codé par un entier entre `0` et `65 535` : l'élément `p` fait partie de l'ensemble si le bit numéro `p` de l'entier vaut `1`. Par exemple, `13 = 1101` en binaire code l'ensemble `{0, 2, 3}`.

On donne une liste de `N` ensembles. Écris un programme qui répond à `Q` requêtes : pour chaque ensemble `B` donné, le nombre d'ensembles de la liste qui sont **inclus** dans `B`.

## Entrée
- La première ligne contient deux entiers `N` et `Q`.
- La deuxième ligne contient `N` entiers : les ensembles de la liste.
- La troisième ligne contient `Q` entiers : les ensembles des requêtes.

## Sortie
`Q` lignes : pour chaque requête, dans l'ordre, le nombre d'ensembles de la liste inclus dans l'ensemble donné.

## Contraintes
- 1 ≤ N ≤ 10 000
- 1 ≤ Q ≤ 10 000
- chaque ensemble est un entier entre `0` et `65 535`

## Indices
1. L'ensemble `A` est inclus dans `B` si `(A & B) == A`. Tester tous les ensembles de la liste pour chaque requête fait 10⁸ tests : trop lent en Python.
2. Il n'y a que 2¹⁶ = 65 536 ensembles possibles. Compte d'abord combien de fois chaque ensemble apparaît dans la liste, puis précalcule la réponse pour **tous** les ensembles `B` : `réponse[B]` est la somme des comptes de tous les sous-ensembles de `B`.
3. Énumérer les sous-ensembles de chaque `B` coûte 3¹⁶ ≈ 4 × 10⁷ au total : encore trop en Python. Traite plutôt les bits un par un : pour chaque bit `b` et chaque `m` qui contient `b`, ajoute à `réponse[m]` la valeur de `réponse[m sans le bit b]`.

## Solution
Un ensemble `A` est inclus dans `B` si `A ⊆ B`, ce qui se teste par `(A & B) == A`. Tester tous les ensembles de la liste pour chaque requête coûte O(N × Q) = 10⁸ : trop lent en Python.

On remarque qu'il n'y a que 2¹⁶ ensembles. On compte `c[A]`, le nombre de fois où l'ensemble `A` apparaît dans la liste. La réponse pour `B` est alors `S[B] = somme des c[A] pour A ⊆ B`. Si on précalcule `S` pour les 65 536 ensembles, chaque requête se lit en O(1).

Calculer `S[B]` en énumérant les sous-ensembles de chaque `B` (avec l'astuce `A = (A - 1) & B`) coûte la somme des `2^(nombre de bits de B)`, c'est-à-dire 3¹⁶ ≈ 4,3 × 10⁷ opérations : correct en C++, trop lent en Python.

On utilise la **somme sur les sous-ensembles**, une programmation dynamique bit par bit. On part de `S = c`, puis pour chaque bit `b` de `0` à `15` :

> pour chaque `m` dont le bit `b` vaut `1` : `S[m] += S[m ^ (1 << b)]`.

Après le traitement des bits `0` à `b`, `S[m]` est la somme des `c[A]` pour les `A` qui sont des sous-ensembles de `m` **et ne diffèrent de `m` que sur les bits `0` à `b`**. En effet, pour un `m` dont le bit `b` vaut `1`, ces `A` se répartissent entre ceux qui ont le bit `b` (déjà comptés dans `S[m]`) et ceux qui ne l'ont pas (comptés dans `S[m ^ (1 << b)]`). Après les 16 bits, `S[m]` compte tous les sous-ensembles de `m`, chacun exactement une fois.

Complexité : **O(16 × 2¹⁶ + N + Q)**, environ un million d'opérations.

Pièges :
- `A = 0` (l'ensemble vide) est inclus dans tous les ensembles : il compte pour toutes les requêtes, même `B = 0`.
- Plusieurs ensembles de la liste peuvent être égaux : il faut les **compter**, pas seulement les marquer.
- En C++, `==` est prioritaire sur `&` : écris `(A & B) == A`. Sans parenthèses, `A & B == A` signifie `A & (B == A)`.
