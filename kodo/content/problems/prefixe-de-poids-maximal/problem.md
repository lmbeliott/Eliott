---
id: prefixe-de-poids-maximal
title: Préfixe de poids maximal
chapter: n4-chaines-avancees
order: 1
tags: [chaînes]
samples: 2
---

## Énoncé
On donne un mot `S` de longueur `N`. Pour chaque longueur `k` de `1` à `N`, on note `occ(k)` le nombre de positions de `S` où commence une occurrence du préfixe de longueur `k` de `S`. Les occurrences peuvent se chevaucher, et le préfixe lui-même compte.

Le **poids** du préfixe de longueur `k` est `k × occ(k)`.

Écris un programme qui trouve le préfixe de poids maximal. En cas d'égalité, choisis le plus court.

## Entrée
Une seule ligne contenant le mot `S`, formé de lettres minuscules.

## Sortie
Deux entiers séparés par une espace : la longueur `k` du préfixe choisi, puis son poids.

## Contraintes
- 1 ≤ N ≤ 100 000

## Indices
1. Le préfixe de longueur `k` commence à la position `i` exactement quand le plus long préfixe commun à `S` et au suffixe qui commence en `i` mesure au moins `k`.
2. La fonction Z donne, en O(N), cette longueur `z[i]` pour toutes les positions `i` à la fois.
3. `occ(k)` est le nombre de `z[i]` supérieurs ou égaux à `k`. Compte combien de fois chaque valeur apparaît dans `z`, puis fais des sommes en partant de `k = N`.

## Solution
Notons `z[i]` la longueur du plus long préfixe commun à `S` et au suffixe `S[i..]`, avec `z[0] = N`. Le préfixe de longueur `k` apparaît en position `i` si et seulement si `z[i] ≥ k`. Donc `occ(k)` est le nombre d'indices `i` tels que `z[i] ≥ k`.

La **fonction Z** calcule tous les `z[i]` en O(N). On garde la « boîte » `[g, d[` la plus à droite déjà trouvée, c'est-à-dire un morceau `S[g..d-1]` égal au début de `S`. Pour `i` dans la boîte, `S[i..d-1]` est une copie de `S[i-g..d-g-1]`, donc `z[i]` vaut au moins `min(d - i, z[i - g])`. On prolonge ensuite lettre par lettre. Chaque comparaison réussie fait avancer `d`, ce qui garantit le temps linéaire.

On compte ensuite `nb[v]`, le nombre d'indices où `z[i] = v`. En parcourant `k` de `N` à `1`, `occ(k) = occ(k + 1) + nb[k]`. On calcule chaque poids et on garde le maximum. On parcourt de `N` vers `1` et on remplace le meilleur en cas d'égalité (`≥`), ce qui garde le `k` le plus petit. Au total : **O(N)**.

Pourquoi les idées simples échouent : compter les occurrences de chaque préfixe séparément coûte O(N²) comparaisons, et bien plus sur un mot comme `aaaa…a`. Même l'idée plus fine qui garde la liste des occurrences du préfixe `k` pour en déduire celles du préfixe `k + 1` fait `z[0] + z[1] + … + z[N-1]` opérations, soit environ N²/2 = 5 × 10⁹ sur `aaaa…a`.

Pièges :
- Le poids peut dépasser 2³¹ (`50 000 × 50 001` pour `aaaa…a`) : en C++, utilise `long long`.
- N'oublie pas l'occurrence en position `0` (`z[0] = N`).
- En cas d'égalité de poids, c'est le préfixe **le plus court** qui gagne.

On peut aussi utiliser la fonction préfixe de KMP : chaque préfixe `S[0..i]` contient, comme bord, les préfixes de longueurs `π[i]`, `π[π[i] - 1]`, etc. Accumuler ces comptes des longueurs les plus grandes vers les plus petites donne les mêmes `occ(k)`, aussi en O(N).
