---
id: chiffre-de-controle-d-un-code
title: Chiffre de contrôle d'un code
chapter: p1-lecture
order: 8
synthesis: true
tags: [entrées-sorties, boucles, arithmétique]
samples: 2
---

## Énoncé
Un code est formé de `N` chiffres `C₁, C₂, …, C_N`. Pour détecter les erreurs de saisie, on lui ajoute un chiffre de contrôle, calculé ainsi :
- on calcule la **somme pondérée** `S = 1 × C₁ + 2 × C₂ + … + N × C_N` : chaque chiffre est multiplié par sa position ;
- le chiffre de contrôle est le chiffre `K`, entre `0` et `9`, tel que `S + K` soit un multiple de 10.

Afficher `S`, puis `K`.

## Entrée
- La première ligne contient l'entier `N`.
- La deuxième ligne contient les `N` chiffres du code, séparés par des espaces.

## Sortie
Deux lignes : la somme pondérée `S`, puis le chiffre de contrôle `K`.

## Contraintes
- 1 ≤ N ≤ 1 000
- Chaque chiffre est un entier entre `0` et `9`.

## Indices
1. Pour multiplier chaque chiffre par sa position, il faut compter les chiffres au fur et à mesure qu'on les lit : une variable `position` qui augmente de 1 à chaque tour.
2. `S % 10` est le chiffre des unités de `S`. Que faut-il ajouter à `S` pour atteindre le multiple de 10 suivant ?
3. Si `S % 10` vaut `3`, il faut ajouter `7`. Si `S % 10` vaut `0`, il faut ajouter `0`, pas `10`.

## Solution
On lit les chiffres un par un en tenant à jour deux variables : `position`, qui vaut 1 pour le premier chiffre, 2 pour le deuxième, et ainsi de suite, et `S`, qui reçoit `position × chiffre` à chaque tour.

Pour le chiffre de contrôle, on regarde `r = S % 10`. Si `r` vaut 0, `S` est déjà un multiple de 10 et `K = 0`. Sinon, il manque `10 − r` pour atteindre le multiple de 10 suivant. Les deux cas se réunissent en une seule formule, sans condition : `K = (10 − r) % 10`. Quand `r = 0`, cela donne `10 % 10 = 0` ; quand `r` est entre 1 et 9, `10 − r` est déjà entre 1 et 9 et le `% 10` ne change rien.

Le piège est d'écrire `K = 10 − S % 10` : quand `S` est un multiple de 10, on obtient `10`, qui n'est pas un chiffre.
