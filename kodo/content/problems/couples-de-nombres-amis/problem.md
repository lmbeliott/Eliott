---
id: couples-de-nombres-amis
title: Couples de nombres amis
chapter: p2-synthese
order: 3
tags: [mathématiques, listes, boucles]
samples: 2
---

## Énoncé
Pour un entier `m ≥ 2`, on note `s(m)` la somme de ses diviseurs strictement plus petits que lui. Deux entiers différents `a` et `b` sont **amis** si `s(a) = b` et `s(b) = a`.

Par exemple, `s(220) = 1 + 2 + 4 + 5 + 10 + 11 + 20 + 22 + 44 + 55 + 110 = 284` et `s(284) = 1 + 2 + 4 + 71 + 142 = 220` : 220 et 284 sont amis.

Trouver tous les couples d'amis `a < b` avec `b ≤ N`.

## Entrée
Une seule ligne contenant l'entier `N`.

## Sortie
Sur la première ligne, le nombre de couples. Puis une ligne par couple, avec `a` et `b` séparés par une espace, dans l'ordre croissant de `a`.

## Contraintes
- 1 ≤ N ≤ 100 000

## Indices
1. Calculer `s(m)` pour chaque `m` en essayant tous les diviseurs jusqu'à `√m` demande environ 20 millions d'opérations : plus d'une seconde en Python. On peut faire bien moins en calculant tous les `s(m)` d'un coup, dans une liste.
2. Retourner la question : au lieu de chercher les diviseurs de chaque `m`, partir de chaque diviseur `d` et l'ajouter à tous ses multiples `2d, 3d, 4d…` jusqu'à `N`.
3. Ensuite, pour chaque `a`, poser `b = s[a]` et vérifier `a < b ≤ N` et `s[b] == a`. La condition `b ≤ N` doit être testée avant de lire `s[b]`.

## Solution
On remplit une liste `s` de taille `N + 1`, à 0 au départ. Pour chaque `d` de 1 à `N // 2`, on ajoute `d` à `s[2d]`, `s[3d]`, `s[4d]`… : ce sont exactement les nombres dont `d` est un diviseur strictement plus petit qu'eux. À la fin, `s[m]` est la somme des diviseurs propres de `m`.

Combien d'opérations ? Pour `d` fixé, il y a environ `N / d` multiples. Le total vaut `N/1 + N/2 + N/3 + … + N/(N/2)`, c'est-à-dire `N` fois la somme des inverses, qui grandit très lentement (comme le logarithme) : environ 1,1 million d'additions pour `N = 100 000`. La méthode directe, qui teste tous les diviseurs jusqu'à `√m` pour chaque `m`, en ferait plus de 20 millions.

On parcourt ensuite `a` de 2 à `N`. On pose `b = s[a]` ; le couple convient si `a < b`, si `b ≤ N` et si `s[b] = a`. La condition `a < b` compte chaque couple une seule fois, par son plus petit élément, et écarte les **nombres parfaits** comme 6 ou 28, pour lesquels `s(a) = a`. La condition `b ≤ N` évite de sortir de la liste : `s(a)` peut dépasser `N`, par exemple `s(63 020) = 76 084`.

Comme `a` croît, les couples sont trouvés dans l'ordre demandé. On les range dans une liste pour pouvoir afficher leur nombre en premier.
