---
id: occurrences-a-une-lettre-pres
title: Occurrences à une lettre près
chapter: n4-chaines-avancees
order: 5
tags: [chaînes]
samples: 2
---

## Énoncé
On donne un motif `P` de longueur `M` et un texte `T` de longueur `N`. Une position `i` de `T` (numérotée à partir de `1`, avec `i + M - 1 ≤ N`) est une **occurrence à une lettre près** de `P` si le morceau `T[i..i+M-1]` diffère de `P` en au plus une position.

Par exemple, avec `P = abca`, le morceau `abba` convient (une seule différence, en troisième position), mais pas `acba` (deux différences).

Écris un programme qui affiche toutes les occurrences à une lettre près de `P` dans `T`.

## Entrée
- La première ligne contient le motif `P`.
- La deuxième ligne contient le texte `T`.

Les deux mots sont formés de lettres minuscules.

## Sortie
- Sur la première ligne, le nombre `K` d'occurrences à une lettre près.
- Sur la deuxième ligne, leurs `K` positions dans l'ordre croissant, séparées par des espaces. Cette ligne est vide si `K = 0`.

## Contraintes
- 1 ≤ M ≤ N ≤ 100 000

## Indices
1. Si le morceau qui commence en `i` diffère de `P` en une seule position `j`, alors `T` et `P` coïncident avant `j`, et ils coïncident aussi après `j`. Mesure, pour chaque `i`, la longueur du plus long début commun avec `P`, et, pour chaque fin possible, celle de la plus longue fin commune avec `P`.
2. La fonction Z de `P#T` donne en O(N + M) le plus long début commun de `P` et de `T[i..]` pour tous les `i`. Pour les fins communes, applique la même idée aux mots retournés.
3. Avec `debut[i]` le plus long début commun en `i` et `fin[j]` la plus longue fin commune qui se termine en `j`, la position `i` convient si et seulement si `debut[i] + fin[i + M - 1] ≥ M - 1`.

## Solution
Pour chaque position `i` de `T` (comptée ici à partir de `0`), notons :
- `debut[i]` : la longueur du plus long préfixe commun à `P` et à `T[i..]` ;
- `fin[j]` : la longueur du plus long suffixe commun à `P` et à `T[..j]` (le morceau de `T` qui se termine en `j`).

**Le critère.** Si `debut[i] ≥ M`, le morceau est égal à `P`. Sinon, la première différence est en position `i + debut[i]`. Il y a au plus une différence si et seulement si tout ce qui suit cette lettre coïncide, c'est-à-dire si la fin commune du morceau avec `P` couvre les `M - 1 - debut[i]` dernières lettres. Dans les deux cas, la condition s'écrit `debut[i] + fin[i + M - 1] ≥ M - 1`.

**Calculer `debut` et `fin`.** On applique la fonction Z au mot `P#T`, où `#` est un caractère absent des deux mots. Pour une position de `T`, la valeur Z est exactement `debut[i]`, car le `#` arrête toute comparaison au-delà de `M`. Pour `fin`, on fait de même sur `P` retourné, `#`, puis `T` retourné : un suffixe commun devient un préfixe commun. On retourne ensuite le tableau obtenu.

Complexité : **O(N + M)** pour les deux fonctions Z, puis O(1) par position.

Pourquoi les idées simples échouent : comparer chaque fenêtre lettre à lettre en s'arrêtant à la deuxième différence semble rapide sur un texte aléatoire. Mais sur un texte presque fait de `a` et un motif `aaa…a`, chaque comparaison va presque jusqu'au bout : environ N × M / 2, soit plus de 10⁹ opérations. Un hachage avec dichotomie (chercher la première différence, puis comparer le reste) fonctionne aussi, en O(N log M), mais demande plus de soin.

Pièges :
- Le séparateur `#` est indispensable : sans lui, une valeur Z pourrait déborder de `P` dans `T`.
- Si `M = 1`, toutes les positions conviennent : la condition devient `debut[i] + fin[i] ≥ 0`.
- Quand `K = 0`, la deuxième ligne est vide, mais le `0` doit être affiché.
