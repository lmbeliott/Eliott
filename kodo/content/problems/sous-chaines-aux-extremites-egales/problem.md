---
id: sous-chaines-aux-extremites-egales
title: Sous-chaînes aux extrémités égales
chapter: p3-chaines-avancees
order: 3
tags: [chaînes, mathématiques]
samples: 2
---

## Énoncé
Un mot de `N` lettres minuscules est donné. Compter ses sous-chaînes d'au moins deux lettres qui commencent et finissent par la même lettre. Deux sous-chaînes situées à des positions différentes sont comptées séparément, même si elles sont égales.

Par exemple, `abca` en a une seule (`abca`), et `aaa` en a trois (`aa` deux fois, et `aaa`).

## Entrée
- La première ligne contient l'entier `N`.
- La deuxième ligne contient le mot.

## Sortie
Le nombre de sous-chaînes.

## Contraintes
- 1 ≤ N ≤ 100 000

## Indices
1. Une sous-chaîne est déterminée par sa première et sa dernière position. Essayer tous les couples demanderait environ 5 × 10⁹ comparaisons pour `N = 100 000`.
2. Une sous-chaîne qui convient correspond à un couple de positions `i < j` portant la même lettre. Combien y a-t-il de tels couples pour une lettre qui apparaît `c` fois ?
3. Avec `c` apparitions, on choisit deux positions parmi `c` : il y a `c × (c − 1) / 2` façons.

## Solution
Une sous-chaîne d'au moins deux lettres est déterminée par le couple `(i, j)` de ses positions de début et de fin, avec `i < j`. Elle convient exactement quand le mot porte la même lettre aux positions `i` et `j`. Il suffit donc de compter les couples de positions `i < j` qui portent la même lettre.

On peut le faire en un seul passage : en arrivant à la position `j`, la lettre `x` qui s'y trouve forme un couple avec chacune des apparitions de `x` déjà rencontrées. On tient un tableau de comptage de 26 cases, `vus[r]` étant le nombre d'apparitions de la lettre de rang `r` avant la position courante. Pour chaque lettre, on ajoute `vus[r]` au total, **puis** on augmente `vus[r]` de 1. Chaque couple `(i, j)` est compté une fois et une seule, au moment où l'on atteint `j`.

On obtient aussi une formule : une lettre qui apparaît `c` fois donne `0 + 1 + … + (c − 1) = c × (c − 1) / 2` couples. La réponse est la somme de ces nombres sur les 26 lettres.

Le programme fait un nombre constant d'opérations par lettre : un travail proportionnel à `N`, contre environ `N² / 2` pour l'essai de tous les couples. La réponse peut atteindre 5 × 10⁹ (mot formé d'une seule lettre répétée) : en C++, il faut un `long long`.
