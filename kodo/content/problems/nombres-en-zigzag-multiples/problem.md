---
id: nombres-en-zigzag-multiples
title: Nombres en zigzag multiples
chapter: n4-dynamique-avancee
order: 4
tags: [programmation-dynamique, mathématiques]
samples: 2
---

## Énoncé
Un entier positif est **en zigzag** si, en lisant ses chiffres de gauche à droite, deux chiffres voisins sont toujours différents et les variations alternent : une montée est suivie d'une descente, une descente d'une montée. Par exemple, `7`, `31`, `152`, `9091` et `27583` sont en zigzag, mais `122`, `123` et `1342` ne le sont pas.

On donne un entier `M` et `T` intervalles `[A, B]`. Écris un programme qui compte, pour chaque intervalle, les entiers en zigzag de `[A, B]` qui sont multiples de `M`.

## Entrée
- La première ligne contient deux entiers `M` et `T`.
- Les `T` lignes suivantes contiennent chacune deux entiers `A` et `B`.

## Sortie
`T` lignes : pour chaque intervalle, dans l'ordre, le nombre d'entiers en zigzag multiples de `M` entre `A` et `B` inclus.

## Contraintes
- 1 ≤ M ≤ 500
- 1 ≤ T ≤ 2 000
- 1 ≤ A ≤ B ≤ 10¹⁸

## Indices
1. Compte les bons nombres de `[1, X]` avec une fonction `compte(X)`. La réponse pour `[A, B]` est `compte(B) - compte(A - 1)`.
2. Programmation dynamique sur les chiffres : on choisit les chiffres de gauche à droite. Pour la suite, il suffit de connaître le dernier chiffre, le sens imposé au prochain pas (monter ou descendre), le reste modulo `M` et le nombre de chiffres restants.
3. Refaire la programmation dynamique pour chaque borne coûte environ 2 × 10⁶ opérations, et il y a 4 000 bornes : trop lent. Le nombre de façons de compléter **librement** `L` chiffres ne dépend pas de la borne. Calcule-le une seule fois, puis réponds à chaque borne en ne parcourant que ses chiffres.

## Solution
**Les suffixes libres.** Notons `g[L][d][s][r]` le nombre de suites de `L` chiffres qui peuvent venir après le chiffre `d` sans casser le zigzag, quand le premier pas doit aller dans le sens `s` (monter ou descendre), et dont la valeur (avec ses zéros de tête) vaut `r` modulo `M`. Si la suite commence par `e`, la suite d'après doit repartir dans l'autre sens. Sa valeur est `e × 10^(L-1)` plus celle de la suite restante :

`g[L][d][monter][r] = somme sur e > d de g[L-1][e][descendre][r - e × 10^(L-1)]`, et de même pour descendre avec `e < d`. On part de `g[0][d][s][0] = 1`.

Ce tableau a `19 × 10 × 2 × M` cases et se calcule une seule fois, en O(19 × 10 × 10 × M).

**Compter jusqu'à X.** Soit `k` le nombre de chiffres de `X`.
- Nombres de longueur `ℓ < k` : pour chaque premier chiffre `f` (de 1 à 9), le reste est une suite libre de `ℓ - 1` chiffres, dans les deux sens possibles, de valeur `≡ -f × 10^(ℓ-1)` modulo `M`.
- Nombres de `k` chiffres : on suit les chiffres de `X`. À la position `i`, on essaie chaque chiffre `c` plus petit que celui de `X` (sauf `0` en tête) qui prolonge le zigzag du préfixe. Le nombre est alors déjà plus petit que `X`, et les `k - 1 - i` chiffres restants sont libres. On lit leur nombre dans `g`, avec le sens imposé par les deux derniers chiffres et le reste voulu. On s'arrête dès que le préfixe de `X` lui-même n'est plus en zigzag. Sinon, on teste `X` à la fin.

Chaque borne coûte O(19 × 10) lectures du tableau : le total est **O(190 × M × 10 + T × 190 × 10)**.

Pourquoi les idées simples échouent : parcourir `[A, B]` est impossible (jusqu'à 10¹⁸ nombres). La programmation dynamique sur les chiffres classique, refaite pour chaque borne avec un tableau de mémoïsation remis à zéro, coûte environ `19 × 10 × 2 × M × 10 ≈ 2 × 10⁶` opérations par borne. Avec 4 000 bornes, cela fait 8 × 10⁹ : beaucoup trop. La clé est que la partie « libre » ne dépend pas de la borne.

Pièges :
- `10¹⁸` a 19 chiffres.
- Les nombres plus courts que `X` ne commencent pas par `0` : traite-les à part, et ne compte pas les zéros de tête comme des chiffres du zigzag.
- Avec `M = 1`, les réponses dépassent 2³¹ : en C++, utilise `long long`.
- Un multiple de 100 n'est jamais en zigzag (il finit par `00`) : pour `M = 500`, toutes les réponses valent `0`.
