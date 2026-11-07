---
id: une-majuscule-a-chaque-mot
title: Une majuscule à chaque mot
chapter: p2-chaines
order: 2
tags: [chaînes]
samples: 2
---

## Énoncé
Réécrire `N` mots de sorte que chacun commence par une majuscule et que toutes ses autres lettres soient en minuscules.

Par exemple, `bONjour LE monde` devient `Bonjour Le Monde`.

## Entrée
La première ligne contient l'entier `N`. La deuxième ligne contient les `N` mots, séparés par des espaces. Chaque mot est formé de lettres, majuscules ou minuscules.

## Sortie
Une seule ligne avec les `N` mots réécrits, dans le même ordre, séparés par une espace.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque mot contient entre 1 et 50 lettres.

## Indices
1. Traiter chaque mot à part : sa première lettre `m[0]` d'un côté, le reste du mot de l'autre.
2. En Python, `m[0].upper() + m[1:].lower()` construit le mot voulu. `m[1:]` est la tranche qui va de l'indice 1 jusqu'à la fin.
3. En C++, parcourir le mot par indice : `toupper` pour l'indice 0, `tolower` pour les autres.

## Solution
Pour chaque mot `m`, on construit un nouveau mot : la première lettre passée en majuscule, suivie du reste du mot passé en minuscules. En Python, `m[0].upper() + m[1:].lower()` ; on range les mots obtenus dans une liste, qu'on recolle avec `" ".join`. En C++, une `string` se modifie : on remplace `m[0]` par `toupper(m[0])`, puis chaque `m[i]` (pour `i ≥ 1`) par `tolower(m[i])`.

Les pièges : oublier de mettre le reste du mot en minuscules (`bONjour` deviendrait `BONjour`), et, en Python, essayer d'écrire `m[0] = m[0].upper()`, qui provoque une `TypeError` car une chaîne ne se modifie pas. Un mot d'une seule lettre fonctionne aussi : `m[1:]` est alors la chaîne vide.
