---
id: mots-ranges-par-longueur
title: Mots rangés par longueur
chapter: p3-tris-simples
order: 2
tags: [tri, chaînes]
samples: 2
---

## Énoncé
Ranger `N` mots du plus court au plus long. Les mots de même longueur restent dans l'ordre où ils sont donnés : c'est un tri **stable** selon la longueur.

Par exemple, `pomme kiwi fraise noix` devient `kiwi noix pomme fraise` : `kiwi` et `noix` ont 4 lettres, et `kiwi` était avant `noix`.

## Entrée
La première ligne contient `N`. La deuxième ligne contient les `N` mots, séparés par des espaces. Chaque mot est formé de 1 à 12 lettres minuscules.

## Sortie
Une seule ligne : les `N` mots rangés, séparés par des espaces.

## Contraintes
- 1 ≤ N ≤ 20 000
- 1 ≤ longueur de chaque mot ≤ 12

## Indices
1. Un tri par sélection qui échange des mots n'est pas stable : un échange peut faire passer un mot devant un autre mot de même longueur.
2. Les longueurs ne prennent que 12 valeurs. Préparer 12 listes, une par longueur, et y ranger les mots dans l'ordre de lecture.
3. En Python, `sorted(mots, key=len)` est aussi une solution, car le tri de Python est stable. En C++, `stable_sort` l'est, `sort` ne l'est pas.

## Solution
On prépare une liste vide pour chaque longueur de 1 à 12. On lit les mots dans l'ordre et on ajoute chacun à la fin de la liste de sa longueur. Enfin, on affiche les listes l'une après l'autre, de la longueur 1 à la longueur 12.

Les mots sortent par longueur croissante, puisque les listes sont affichées dans cet ordre. Et deux mots de même longueur sont dans la même liste, où ils ont été ajoutés dans l'ordre de lecture : l'ordre d'origine est conservé. C'est un tri par comptage stable, où l'on range les éléments eux-mêmes au lieu de seulement les compter.

Le programme fait un passage sur les mots puis un passage sur les listes : environ 2N opérations, contre N² / 2 = 200 millions de comparaisons pour un tri par insertion sur 20 000 mots. Le piège est d'utiliser un tri qui n'est pas stable, comme `sort` en C++ ou un tri par sélection écrit à la main.
