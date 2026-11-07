---
id: mot-le-plus-frequent
title: Mot le plus fréquent
chapter: p2-dictionnaires
order: 3
tags: [dictionnaires, chaînes]
samples: 2
---

## Énoncé
Un texte de `N` mots est donné. Afficher le mot qui apparaît le plus souvent et son nombre d'apparitions. En cas d'égalité, choisir celui dont la première apparition dans le texte vient le plus tôt.

## Entrée
La première ligne contient l'entier `N`. La deuxième ligne contient les `N` mots, séparés par des espaces. Chaque mot est formé de lettres minuscules sans accent.

## Sortie
Le mot le plus fréquent, puis son nombre d'apparitions, séparés par une espace.

## Contraintes
- 1 ≤ N ≤ 20 000
- Chaque mot a entre 1 et 10 lettres.

## Indices
1. Un dictionnaire dont les clés sont les mots et les valeurs leurs nombres d'apparitions se remplit en un seul passage, avec `compte.get(m, 0) + 1`.
2. Pour respecter la règle d'égalité, ne pas parcourir le dictionnaire : parcourir à nouveau la liste des mots, dans l'ordre du texte.
3. Ne changer de meilleur mot que si le nouveau compte est **strictement** plus grand.

## Solution
Premier passage : on compte. Pour chaque mot `m`, on fait `compte[m] = compte.get(m, 0) + 1`. La méthode `get` renvoie 0 pour un mot pas encore vu, ce qui évite l'erreur `KeyError`. En C++, `compte[m]++` suffit : un `map` crée la clé avec la valeur 0 lors du premier accès.

Second passage : on cherche le maximum, en parcourant les mots **dans l'ordre du texte** et en ne remplaçant le meilleur que si son compte est strictement dépassé. Le premier mot qui atteint le compte maximal est ainsi celui dont la première apparition vient le plus tôt, et aucun mot à égalité ne le remplace ensuite.

Parcourir le dictionnaire lui-même serait risqué : en C++, un `map` donne les clés dans l'ordre alphabétique et un `unordered_map` dans un ordre quelconque, ce qui ne respecte pas la règle d'égalité.
