---
id: pistes-ouvertes
title: Les pistes ouvertes
chapter: n4-structures
order: 3
tags: [bits, programmation-dynamique]
samples: 2
---

## Énoncé
Le domaine skiable de Valcorde compte 16 pistes, numérotées de `0` à `15`. Chacun des `N` abonnés de la station a ses pistes préférées, et il ne vient skier que si **toutes** ses pistes préférées sont ouvertes. Chaque soir, Awa, au bureau des pistes, annonce les pistes ouvertes du lendemain et veut prévoir combien d'abonnés viendront.

Un ensemble de pistes est codé par un entier entre `0` et `65 535` : la piste `p` fait partie de l'ensemble si le bit numéro `p` de l'entier vaut `1`. Par exemple, `13 = 1101` en binaire code les pistes `0`, `2` et `3`.

Écris un programme qui répond aux `Q` prévisions d'Awa : pour chaque ensemble de pistes ouvertes, le nombre d'abonnés dont toutes les pistes préférées sont ouvertes.

## Entrée
- La première ligne contient deux entiers `N` et `Q`.
- La deuxième ligne contient `N` entiers : l'ensemble des pistes préférées de chaque abonné.
- La troisième ligne contient `Q` entiers : pour chaque prévision, l'ensemble des pistes ouvertes.

## Sortie
`Q` lignes : pour chaque prévision, dans l'ordre, le nombre d'abonnés qui viendront skier.

## Contraintes
- 1 ≤ N ≤ 10 000
- 1 ≤ Q ≤ 10 000
- chaque ensemble est un entier entre `0` et `65 535`

## Indices
1. L'abonné de préférences `F` vient quand les pistes ouvertes sont `O` si `F` est un sous-ensemble de `O`, c'est-à-dire si `F & O == F`. Tester tous les abonnés pour chaque prévision fait 10⁸ tests : trop lent.
2. Il n'y a que 2¹⁶ = 65 536 ensembles possibles. Compte d'abord combien d'abonnés ont exactement chaque ensemble de préférences, puis précalcule la réponse pour **tous** les ensembles `O` : `réponse[O]` est la somme des comptes de tous les sous-ensembles de `O`.
3. Énumérer les sous-ensembles de chaque `O` coûte 3¹⁶ ≈ 4 × 10⁷ au total : encore trop en Python. Traite plutôt les bits un par un : pour chaque bit `b` et chaque `m` qui contient `b`, ajoute à `réponse[m]` la valeur de `réponse[m sans le bit b]`.

## Solution
Un abonné de préférences `F` vient si `F ⊆ O`, ce qui se teste par `F & O == F`. Tester tous les abonnés pour chaque prévision coûte O(N × Q) = 10⁸ : trop lent en Python.

On remarque qu'il n'y a que 2¹⁶ ensembles. On compte `c[F]`, le nombre d'abonnés de préférences exactement `F`. La réponse pour `O` est alors `S[O] = somme des c[F] pour F ⊆ O`. Si on précalcule `S` pour les 65 536 ensembles, chaque prévision se lit en O(1).

Calculer `S[O]` en énumérant les sous-ensembles de chaque `O` (avec l'astuce `F = (F - 1) & O`) coûte la somme des `2^(nombre de bits de O)`, c'est-à-dire 3¹⁶ ≈ 4,3 × 10⁷ opérations : correct en C++, trop lent en Python.

On utilise la **somme sur les sous-ensembles**, une programmation dynamique bit par bit. On part de `S = c`, puis pour chaque bit `b` de `0` à `15` :

> pour chaque `m` dont le bit `b` vaut `1` : `S[m] += S[m ^ (1 << b)]`.

Après le traitement des bits `0` à `b`, `S[m]` est la somme des `c[F]` pour les `F` qui sont des sous-ensembles de `m` **et ne diffèrent de `m` que sur les bits `0` à `b`**. En effet, pour un `m` dont le bit `b` vaut `1`, ces `F` se répartissent entre ceux qui ont le bit `b` (déjà comptés dans `S[m]`) et ceux qui ne l'ont pas (comptés dans `S[m ^ (1 << b)]`). Après les 16 bits, `S[m]` compte tous les sous-ensembles de `m`, chacun exactement une fois.

Complexité : **O(16 × 2¹⁶ + N + Q)**, environ un million d'opérations.

Pièges :
- `F = 0` (aucune piste préférée) est un sous-ensemble de tous les ensembles : cet abonné vient tous les jours, même si toutes les pistes sont fermées.
- Plusieurs abonnés peuvent avoir les mêmes préférences : il faut les **compter**, pas seulement les marquer.
- En Python, `~O` est un nombre négatif : pour tester l'inclusion, préfère `F & O == F` ou `F | O == O`.
