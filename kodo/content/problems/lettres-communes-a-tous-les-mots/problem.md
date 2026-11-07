---
id: lettres-communes-a-tous-les-mots
title: Lettres communes à tous les mots
chapter: p2-dictionnaires
order: 5
tags: [dictionnaires, chaînes]
samples: 2
---

## Énoncé
Afficher, dans l'ordre alphabétique, les lettres qui apparaissent dans chacun des `N` mots donnés. Chaque lettre n'est affichée qu'une fois.

Par exemple, `tartine`, `patate` et `attention` contiennent tous les trois les lettres `a`, `e` et `t`.

## Entrée
La première ligne contient l'entier `N`. Les `N` lignes suivantes contiennent chacune un mot de lettres minuscules sans accent.

## Sortie
Les lettres communes collées les unes aux autres, dans l'ordre alphabétique, sur une seule ligne. S'il n'y en a aucune, afficher `AUCUNE`.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque mot a entre 1 et 100 lettres.

## Indices
1. `set(mot)` donne l'ensemble des lettres d'un mot, sans doublon.
2. L'intersection `a & b` de deux ensembles contient les éléments présents dans les deux. Partir des lettres du premier mot et faire l'intersection avec chacun des mots suivants.
3. Un ensemble n'a pas d'ordre : pour afficher dans l'ordre alphabétique, parcourir les lettres de `a` à `z` avec `ord` et `chr`, et garder celles qui sont dans l'ensemble.

## Solution
L'ensemble `communes` contient, à chaque étape, les lettres présentes dans tous les mots déjà lus. Au départ, ce sont les lettres du premier mot. Pour chaque mot suivant, on remplace `communes` par son **intersection** avec l'ensemble des lettres de ce mot : une lettre absente du mot disparaît, les autres restent. Après le dernier mot, `communes` contient exactement les lettres présentes partout.

Pour l'affichage, on ne parcourt pas l'ensemble lui-même, car l'ordre de ses éléments n'est pas garanti en Python. On parcourt les 26 lettres de `a` à `z` (codes `ord("a")` à `ord("z")`) et on garde celles qui sont dans `communes`.

En C++, il n'y a pas d'opérateur `&` pour les ensembles : on construit l'intersection à la main, en gardant les éléments de `communes` que l'on trouve aussi dans l'ensemble des lettres du mot. Penser au cas `N = 1` (toutes les lettres du mot) et au cas où l'intersection devient vide (`AUCUNE`).
