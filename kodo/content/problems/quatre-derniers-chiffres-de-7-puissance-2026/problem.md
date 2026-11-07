---
id: quatre-derniers-chiffres-de-7-puissance-2026
title: Quatre derniers chiffres de 7 puissance 2026
chapter: p1-variables
order: 7
tags: [boucles, arithmétique, mathématiques]
samples: 1
no_input: true
---

## Énoncé
Le nombre 7²⁰²⁶, produit de 2026 facteurs égaux à 7, s'écrit avec plus de 1 700 chiffres. Afficher le nombre formé par ses quatre derniers chiffres.

## Entrée
Aucune : le programme ne lit rien.

## Sortie
Un seul entier : le nombre formé par les quatre derniers chiffres de 7²⁰²⁶ (il ne commence pas par 0).

## Indices
1. Les quatre derniers chiffres d'un nombre `n` s'obtiennent avec `n % 10000`.
2. Les quatre derniers chiffres d'un produit ne dépendent que des quatre derniers chiffres des facteurs. Par exemple, les quatre derniers chiffres de 123456 × 7 sont ceux de 3456 × 7.
3. On peut donc multiplier par 7 à chaque tour, et ne garder que les quatre derniers chiffres du résultat avant le tour suivant.

## Solution
On calcule la puissance de proche en proche, comme pour les puissances de 3 : une variable `p` vaut 1, et chacun des 2026 tours de boucle la multiplie par 7. Mais au lieu de garder le nombre entier, on ne garde que ses quatre derniers chiffres : `p = p * 7 % 10000`.

C'est correct car les chiffres d'un produit qui sont au-delà des quatre derniers n'ont aucune influence sur les quatre derniers chiffres du produit suivant : si p = 10000 × q + r, alors p × 7 = 10000 × (7q) + 7r, et 7r a donc les mêmes quatre derniers chiffres que p × 7. Après 2026 tours, `p` contient les quatre derniers chiffres de 7²⁰²⁶ : 5649.

En C++, c'est indispensable : 7²⁰²⁶ est beaucoup trop grand même pour un `long long`, alors que `p` reste ici inférieur à 10 000 et `p * 7` inférieur à 70 000. En Python, on pourrait calculer le nombre en entier, mais c'est inutilement lent pour de très grands exposants : la réduction à chaque étape garde des nombres petits. Cette technique, le **calcul modulo**, est omniprésente en algorithmique, dès qu'un énoncé demande un résultat « modulo » un nombre.
