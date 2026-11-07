---
id: morceau-le-plus-frequent
title: Morceau le plus fréquent
chapter: p3-chaines-avancees
order: 5
tags: [chaînes, dictionnaires]
samples: 2
---

## Énoncé
Un mot `S` de `N` lettres minuscules et un entier `K` sont donnés. Parmi toutes les sous-chaînes de `S` de longueur exactement `K`, trouver celle qui apparaît le plus souvent, les apparitions pouvant se chevaucher. En cas d'égalité, choisir la plus petite dans l'ordre alphabétique.

Par exemple, dans `abababa` avec `K = 3`, `aba` apparaît 3 fois et `bab` 2 fois.

## Entrée
- La première ligne contient `N` et `K`.
- La deuxième ligne contient le mot `S`.

## Sortie
La sous-chaîne choisie et son nombre d'apparitions, séparés par une espace.

## Contraintes
- 1 ≤ K ≤ N ≤ 100 000
- K ≤ 10

## Indices
1. Il y a exactement `N − K + 1` sous-chaînes de longueur `K`, une par position de départ.
2. Compter les apparitions de chacune en parcourant tout le mot ferait environ `N²` comparaisons : trop lent.
3. Un dictionnaire qui associe à chaque sous-chaîne son nombre d'apparitions se remplit en un seul passage.

## Solution
Les sous-chaînes de longueur `K` sont les tranches `S[i:i + K]` pour `i` de 0 à `N − K` (en C++, `S.substr(i, K)`). On les parcourt une fois, et un dictionnaire compte combien de fois chacune apparaît. Chaque apparition est comptée exactement une fois, au moment où l'on passe à sa position de départ : le dictionnaire contient donc, à la fin, le nombre exact d'apparitions de chaque sous-chaîne, chevauchements compris.

Il reste à parcourir le dictionnaire pour trouver le plus grand compteur. On remplace le meilleur provisoire quand le compteur est plus grand, ou quand il est égal et que la sous-chaîne est plus petite dans l'ordre alphabétique (les chaînes se comparent avec `<`). En C++, une `map<string, int>` parcourt ses clés dans l'ordre croissant : il suffit alors d'un `>` strict.

Coût : `N − K + 1` tranches de `K ≤ 10` lettres, plus une opération de dictionnaire pour chacune, soit au plus environ un million d'opérations élémentaires. L'approche naïve, qui recompte chaque sous-chaîne en parcourant tout le mot, demande de l'ordre de `N² × K` comparaisons dans le pire cas, beaucoup trop pour `N = 100 000`. Le piège : `S.count(morceau)` ne compte pas les apparitions qui se chevauchent (`"aaaa".count("aa")` vaut 2 et non 3).
