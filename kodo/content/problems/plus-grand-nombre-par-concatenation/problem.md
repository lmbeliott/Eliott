---
id: plus-grand-nombre-par-concatenation
title: Plus grand nombre par concaténation
chapter: p4-gloutons
order: 5
tags: [glouton, tri, chaînes, mathématiques]
samples: 2
---

## Énoncé
On dispose de N entiers positifs ou nuls. On les écrit tous en base 10, les uns à la suite des autres, dans l'ordre de son choix, pour former un seul grand nombre. Par exemple, avec 3, 30 et 34, on peut former 33034, 34330, 30343…

Afficher le plus grand nombre que l'on peut former, sans zéros inutiles en tête : s'il ne vaut que des zéros, afficher `0`.

## Entrée
La première ligne contient N. La deuxième ligne contient les N entiers.

## Sortie
Le plus grand nombre que l'on peut former.

## Contraintes
- 1 ≤ N ≤ 10 000
- 0 ≤ chaque entier ≤ 10⁹

## Indices
1. Trier par ordre décroissant de valeur ne marche pas (9 doit passer avant 34), ni par ordre alphabétique décroissant : avec 3 et 30, le mot `30` est plus grand que `3`, mais 330 > 303.
2. Pour deux nombres écrits a et b, la bonne question est : `a` puis `b`, ou `b` puis `a` ? On place a avant b si le mot a + b est plus grand que b + a. C'est une règle de comparaison, à donner au tri.
3. Pour que ce tri ait un sens, la règle doit être transitive. Écrire a + b > b + a comme une inégalité sur les nombres : a × 10^|b| + b > b × 10^|a| + a, où |a| est le nombre de chiffres de a.

## Solution
**La règle d'échange.** Dans un ordre optimal, deux nombres voisins a puis b vérifient a + b ≥ b + a (en comparant les mots, qui ont la même longueur) : sinon, les échanger agrandirait le nombre, puisque le début et la fin ne changent pas. On trie donc avec la règle « a passe avant b si a + b > b + a » : en Python avec `functools.cmp_to_key`, en C++ avec une fonction de comparaison.

**Pourquoi la règle est un vrai ordre.** Notons |a| le nombre de chiffres de a. Le mot a + b représente le nombre a × 10^|b| + b, donc a + b > b + a s'écrit a × (10^|b| − 1) > b × (10^|a| − 1), c'est-à-dire r(a) > r(b) avec r(a) = a / (10^|a| − 1). La règle revient donc à trier par valeur décroissante de r : c'est transitif, et le tri est bien défini. (r(a) est le nombre 0,aaaa… : par exemple r(34) = 34/99 = 0,343434…)

**Optimalité.** Soit un ordre optimal quelconque. S'il contient deux voisins a puis b avec r(a) < r(b), les échanger donne un nombre strictement plus grand : impossible. Les voisins vérifient donc r décroissant, et l'ordre optimal est un ordre trié par r. Deux nombres de même r donnent a + b = b + a, et leur ordre n'a aucune importance : tous les ordres triés donnent le même nombre, qui est donc le maximum.

**Le piège du zéro.** Avec les nombres 0 et 0, on forme `00`, qui s'écrit `0`. Après le tri, si le premier caractère est `0`, tous les nombres sont nuls et on affiche `0`. **Coût** : O(N log N) comparaisons de mots d'au plus 20 caractères.
