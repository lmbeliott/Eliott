---
id: plus-courte-periode-d-un-mot
title: Plus courte période d'un mot
chapter: n2-chaines
order: 7
tags: [chaînes, boucles]
samples: 2
---

## Énoncé
Soit un mot de `N` lettres. Un entier `p` compris entre 1 et `N` est une **période** du mot si chaque lettre est égale à la lettre située `p` positions plus loin, quand celle-ci existe. Autrement dit, le mot s'obtient en écrivant ses `p` premières lettres, le **motif**, plusieurs fois à la suite, la dernière fois pouvant être coupée.

Par exemple, `abcabcab` a pour période 3 : c'est le motif `abc` répété, avec une dernière répétition coupée après `ab`. Il a aussi pour période 6, et `N` est toujours une période.

Écris un programme qui affiche, pour chaque mot, sa plus courte période et le motif correspondant.

## Entrée
- La première ligne contient l'entier `Q`, le nombre de mots.
- Les `Q` lignes suivantes contiennent chacune un mot, en lettres minuscules sans accents.

## Sortie
`Q` lignes : pour chaque mot, dans l'ordre de l'entrée, sa plus courte période `p`, une espace, puis le motif formé de ses `p` premières lettres.

## Contraintes
- 1 ≤ Q ≤ 10
- Chaque mot contient entre 1 et 1 000 lettres.

## Indices
1. Écris d'abord une boucle qui teste si un entier `p` donné est une période : compare chaque lettre `mot[i]` avec `mot[i + p]`, tant que `i + p` reste dans le mot.
2. Essaie ensuite `p = 1`, puis `p = 2`, puis `p = 3`… La première valeur qui marche est la plus courte période. Tu es sûr de t'arrêter, car `p = N` marche toujours.
3. La période ne divise pas forcément la longueur du mot : `abaab` a pour période 3, avec le motif `aba`. Ne teste pas seulement les diviseurs de `N`.

## Solution
On essaie les valeurs de `p` dans l'ordre : 1, 2, 3… Pour chacune, on vérifie que `mot[i]` est égal à `mot[i + p]` pour tous les `i` de 0 à `N - p - 1`, en s'arrêtant dès qu'on trouve deux lettres différentes. La première valeur de `p` qui passe ce test est la plus courte période. Quand `p = N`, il n'y a aucune lettre à comparer : le test réussit toujours, donc la boucle s'arrête au plus tard là.

On affiche ensuite `p` et le motif, c'est-à-dire les `p` premières lettres du mot (`mot[:p]` en Python, `mot.substr(0, p)` en C++).

Pourquoi suffit-il de comparer chaque lettre à celle qui est `p` positions plus loin ? Si c'est vrai partout, alors la lettre à la position `i` est égale à celle de la position `i - p`, qui est égale à celle de la position `i - 2p`, et ainsi de suite jusqu'à arriver dans les `p` premières lettres : chaque lettre du mot est bien une copie d'une lettre du motif, au bon endroit.

Exemple avec `abaab` : `p = 1` échoue (`a` puis `b`), `p = 2` échoue (`b` en position 1 et `a` en position 3), `p = 3` réussit (`a` = `a` et `b` = `b`). La réponse est `3 aba`.

Les pièges :
- ne tester que les périodes qui divisent `N` : on trouverait 5 pour `abaab` au lieu de 3 ;
- vérifier seulement la première répétition du motif au lieu de tout le mot : `abcabd` n'a pas la période 3 ;
- oublier le cas où aucune période plus courte que `N` ne marche : le motif est alors le mot entier.

Chaque test de période fait au plus `N` comparaisons, et on essaie au plus `N` valeurs de `p` : au plus un million de comparaisons par mot, ce qui reste rapide.
