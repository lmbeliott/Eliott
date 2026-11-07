---
id: deux-palindromes-disjoints
title: Deux palindromes disjoints
chapter: n4-chaines-avancees
order: 3
tags: [chaînes, programmation-dynamique]
samples: 2
---

## Énoncé
Un **palindrome** est un mot qui se lit de la même façon dans les deux sens, comme `kayak` ou `abba`. Une seule lettre est un palindrome.

On donne un mot `S` de longueur `N`. Tu dois choisir deux morceaux de `S` (des suites de lettres consécutives) qui sont des palindromes et qui ne se chevauchent pas : le premier doit se terminer strictement avant le début du second.

Écris un programme qui calcule le plus grand produit possible des longueurs des deux palindromes choisis.

## Entrée
Une seule ligne contenant le mot `S`, formé de lettres minuscules.

## Sortie
Un seul entier : le plus grand produit des deux longueurs.

## Contraintes
- 2 ≤ N ≤ 100 000

## Indices
1. Coupe le mot entre les positions `i` et `i + 1` : il te faut le plus long palindrome entièrement à gauche de la coupure et le plus long entièrement à droite. Tout se ramène à connaître, pour chaque position, le plus long palindrome qui **finit** là (et celui qui **commence** là).
2. L'algorithme de Manacher donne en O(N), pour chaque centre, le rayon du plus long palindrome centré là. Le palindrome maximal d'un centre donne une fin et un début.
3. Un palindrome qui finit en `e + 1`, privé de sa première et de sa dernière lettre, est un palindrome qui finit en `e`. Donc `fin[e] ≥ fin[e + 1] - 2`, et cette règle, avec les palindromes maximaux, suffit à trouver tous les `fin[e]`.

## Solution
**Réduction.** Deux palindromes disjoints sont séparés par au moins une coupure, entre `i` et `i + 1`. Pour une coupure fixée, on prend le plus long palindrome de `S[0..i]` et le plus long de `S[i+1..N-1]`, car les deux longueurs sont positives. La réponse est le maximum, sur toutes les coupures, de `gauche[i] × droite[i + 1]`. Il suffit donc de connaître `fin[e]`, la longueur du plus long palindrome qui finit en `e`, et `debut[x]`, celle du plus long qui commence en `x`. On en déduit `gauche` et `droite` par des maximums cumulés.

**Manacher.** On insère un séparateur entre les lettres (`#a#b#a#`) pour traiter de la même façon les palindromes de longueur paire et impaire. Le tableau `p[i]` donne le rayon du plus long palindrome centré en `i`. On garde le palindrome `[c - p[c], c + p[c]]` qui va le plus loin à droite. Pour `i` à l'intérieur, le miroir `2c - i` donne déjà `p[i] ≥ min(d - i, p[2c - i])`, puis on prolonge. Chaque extension réussie fait avancer `d` : le tout est en **O(N)**. Le palindrome maximal de centre `i` a pour longueur `p[i]` dans le mot de départ, et il commence en `(i - p[i]) / 2`.

**Les fins.** Le plus long palindrome qui finit en `e` a un centre `c`. Soit le palindrome maximal de centre `c` finit exactement en `e`, et on l'a noté. Soit il va plus loin : il contient alors un palindrome qui finit en `e + 1` et qui fait 2 lettres de plus. En parcourant `e` de droite à gauche avec `fin[e] = max(fin[e], fin[e + 1] - 2)`, on obtient donc tous les `fin[e]`. Même chose pour les débuts, de gauche à droite. Total : **O(N)**.

Pourquoi les idées simples échouent : agrandir un palindrome autour de chacun des 2N - 1 centres coûte O(N²) sur `aaaa…a` ou `abab…ab`, soit des milliards de comparaisons pour N = 100 000.

Pièges :
- Le produit atteint `50 000 × 50 000 = 2,5 × 10⁹` : en C++, utilise `long long`.
- Il ne suffit pas de noter les palindromes maximaux : dans `abcba`, le plus long palindrome qui finit en position 3 est `bcb`, mais le palindrome maximal de même centre est `abcba`, qui va plus loin. La propagation `fin[e + 1] - 2` règle ce cas.
- Les palindromes de longueur paire comptent aussi.
