---
id: mot-obtenu-par-rotation
title: Mot obtenu par rotation
chapter: p2-chaines
order: 7
tags: [chaînes]
samples: 2
---

## Énoncé
Faire tourner un mot de `K` crans, c'est déplacer ses `K` premières lettres à la fin, dans le même ordre. Par exemple, `bonjour` tourné de 3 crans donne `jourbon`.

Deux mots `A` et `B` de même longueur sont donnés. Afficher le plus petit nombre de crans `K`, avec `0 ≤ K < longueur`, qui transforme `A` en `B`, ou `-1` si aucune rotation ne convient.

## Entrée
La première ligne contient le mot `A`, la deuxième le mot `B`. Les deux mots ont la même longueur et sont formés de lettres minuscules.

## Sortie
Un seul entier : le plus petit `K` qui convient, ou `-1`.

## Contraintes
- Les mots ont entre 1 et 2 000 lettres.

## Indices
1. Avec une longueur `L`, il n'y a que `L` rotations possibles : on peut toutes les essayer, de `K = 0` à `K = L − 1`, et s'arrêter à la première qui convient.
2. La rotation de `K` crans s'écrit avec deux tranches : `A[K:] + A[:K]` en Python, `A.substr(K) + A.substr(0, K)` en C++.
3. Un mot qui se répète, comme `abab`, revient à lui-même avant `L` crans. C'est pour cela qu'on demande le **plus petit** `K`.

## Solution
On essaie toutes les rotations dans l'ordre croissant de `K`. Pour chaque `K`, on construit le mot tourné : la fin du mot à partir de l'indice `K`, suivie de ses `K` premières lettres. On le compare à `B`. Dès qu'il y a égalité, on affiche `K` et on s'arrête ; si aucune rotation ne convient, on affiche `-1`.

Il y a au plus 2 000 rotations, chacune construite et comparée en 2 000 opérations environ : 4 millions d'opérations élémentaires, ce qui est rapide.

Remarque : `B` est une rotation de `A` exactement quand `B` apparaît dans le mot `A + A` (le mot `A` écrit deux fois de suite). Avec `A = bonjour`, `A + A = bonjourbonjour` contient `jourbon` à partir de l'indice 3 : c'est le nombre de crans. On retrouve d'ailleurs la même chose avec l'indice : la lettre d'indice `i` du mot tourné est `A[(K + i) % L]`.
