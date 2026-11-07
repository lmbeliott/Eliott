---
id: somme-des-nombres-d-un-texte
title: Somme des nombres d'un texte
chapter: p2-chaines
order: 4
tags: [chaînes, arithmétique]
samples: 2
---

## Énoncé
Un mot mélange des lettres minuscules et des chiffres. Chaque groupe de chiffres consécutifs forme un nombre. Afficher la somme de ces nombres.

Par exemple, dans `ab12c3d045`, les nombres sont 12, 3 et 45 (le `0` de tête ne change pas la valeur) : la somme vaut 60.

## Entrée
Une seule ligne contenant le mot, sans espace.

## Sortie
Un seul entier : la somme des nombres du mot, ou `0` s'il ne contient aucun chiffre.

## Contraintes
- Le mot contient entre 1 et 100 000 caractères.
- Chaque groupe de chiffres contient au plus 9 chiffres.

## Indices
1. On parcourt le mot caractère par caractère en construisant le nombre en cours. Comment la valeur de `12` devient-elle celle de `123` quand on lit le chiffre `3` ?
2. Ajouter un chiffre `d` à droite d'un nombre `x` donne `10 × x + d`. La valeur du chiffre est `ord(c) - ord("0")` (ou `c - '0'` en C++).
3. Quand on rencontre une lettre, le nombre en cours est terminé : on l'ajoute au total et on repart de 0. Ne pas oublier le nombre qui termine éventuellement le mot.

## Solution
On garde deux variables : `total`, la somme des nombres terminés, et `courant`, la valeur du nombre en cours de lecture. Pour chaque caractère `c` :
- si `c` est un chiffre, il s'ajoute à droite du nombre en cours : `courant = 10 × courant + (valeur de c)` ;
- sinon, le nombre en cours (s'il y en a un) est terminé : `total = total + courant`, puis `courant = 0`. Ajouter 0 quand il n'y avait pas de nombre ne change rien.

Après la boucle, il faut encore ajouter `courant` au total : si le mot se termine par des chiffres, aucune lettre n'est venue clore ce dernier nombre. C'est le piège principal.

On construit la valeur avec `10 × courant + d`, comme on lit un nombre de gauche à droite : 0, puis 1, puis 12, puis 123. Le total peut dépasser 2³¹ : en C++, il faut un `long long`.
