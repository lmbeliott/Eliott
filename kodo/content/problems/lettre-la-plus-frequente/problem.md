---
id: lettre-la-plus-frequente
title: Lettre la plus fréquente
chapter: p2-chaines
order: 3
tags: [chaînes, listes]
samples: 2
---

## Énoncé
Dans une ligne de texte, trouver la lettre qui apparaît le plus souvent, en confondant majuscules et minuscules. Les espaces et les signes de ponctuation ne comptent pas. En cas d'égalité, choisir la lettre qui vient en premier dans l'alphabet.

## Entrée
Une seule ligne de texte, formée de lettres sans accents, d'espaces et de signes de ponctuation. Elle contient au moins une lettre.

## Sortie
Une seule ligne avec la lettre la plus fréquente, écrite en minuscule, une espace, puis son nombre d'apparitions.

## Contraintes
- La ligne contient entre 1 et 10 000 caractères.

## Indices
1. Un tableau de comptage de 26 cases suffit : la case 0 pour `a`, la case 1 pour `b`, …, la case 25 pour `z`.
2. Pour un caractère `c`, on le passe d'abord en minuscule, on vérifie que c'est une lettre, puis `ord(c) - ord("a")` donne l'indice de sa case.
3. Pour retrouver la lettre à partir de l'indice `k` du maximum : `chr(ord("a") + k)`. Parcourir les indices de 0 à 25 avec `>` strict donne la première lettre de l'alphabet en cas d'égalité.

## Solution
On compte les lettres dans un tableau `cpt` de 26 cases. Pour chaque caractère de la ligne, on le met en minuscule (`c.lower()`, ou `tolower(c)` en C++). Si c'est une lettre, c'est-à-dire si `"a" <= c <= "z"`, on augmente `cpt[ord(c) - ord("a")]`. Les autres caractères sont ignorés.

On cherche ensuite l'indice `k` de la plus grande case, en parcourant les indices de 0 à 25 et en ne remplaçant le meilleur que si une case est strictement plus grande : en cas d'égalité, on garde ainsi la lettre la plus proche du début de l'alphabet. La lettre est `chr(ord("a") + k)`.

En C++, la ligne contient des espaces : il faut la lire avec `getline(cin, s)`, car `cin >> s` s'arrêterait au premier espace. Le calcul `c - 'a'` donne directement l'indice, et `(char) ('a' + k)` la lettre.
