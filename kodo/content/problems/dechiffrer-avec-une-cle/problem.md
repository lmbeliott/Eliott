---
id: dechiffrer-avec-une-cle
title: Déchiffrer avec une clé
chapter: p2-synthese
order: 2
tags: [chaînes, fonctions]
samples: 2
---

## Énoncé
Un message a été chiffré avec une clé, un mot de lettres minuscules. Les lettres de la clé sont utilisées l'une après l'autre, en recommençant au début de la clé quand elle est épuisée. Chaque lettre du message a été **avancée** dans l'alphabet d'autant de rangs que le rang de la lettre de clé correspondante : `a` avance de 0, `b` de 1, …, `z` de 25. Après `z`, on repart à `a`.

Les espaces sont recopiés tels quels et n'utilisent pas de lettre de la clé.

Par exemple, avec la clé `bac`, le message `un message secret` devient `vn ofsubgg teesev` : `u` avance de 1 (`b`), `n` de 0 (`a`), `m` de 2 (`c`), `e` de 1 (`b`), et ainsi de suite.

Retrouver le message d'origine à partir de la clé et du message chiffré.

## Entrée
La première ligne contient la clé. La deuxième ligne contient le message chiffré : des lettres minuscules et des espaces, sans espace au début ni à la fin, et jamais deux espaces de suite.

## Sortie
Le message d'origine, sur une ligne.

## Contraintes
- La clé a entre 1 et 100 lettres.
- Le message chiffré a entre 1 et 1 000 caractères.

## Indices
1. Pour déchiffrer, il faut **reculer** chaque lettre du rang de la lettre de clé. Le rang d'une lettre `c` est `ord(c) - ord("a")`.
2. Pour reculer en revenant à `z` après `a`, calculer le nouveau rang modulo 26 : en Python, `(-1) % 26` vaut `25`. En C++, le reste d'un nombre négatif est négatif : ajouter 26 avant de reprendre le reste.
3. Garder un compteur `k` de lettres déjà déchiffrées : la lettre de clé à utiliser est `cle[k % len(cle)]`. Ne pas augmenter `k` sur un espace.

## Solution
On parcourt le message caractère par caractère, en construisant le résultat dans une chaîne. Un compteur `k` indique combien de lettres ont déjà été traitées ; la lettre de clé à utiliser est `cle[k % len(cle)]`, ce qui fait reboucler la clé automatiquement.

- Pour un espace, on le recopie, et `k` ne change pas.
- Pour une lettre, le décalage est `ord(lettre de clé) - ord("a")`. On recule la lettre de ce décalage, puis on augmente `k` de 1.

Le recul est isolé dans une fonction `decaler(lettre, decalage)` : on passe au rang (de 0 à 25), on soustrait, on prend le reste modulo 26 pour revenir dans l'alphabet, puis on revient à une lettre avec `chr`. En Python, `%` donne toujours un résultat entre 0 et 25, même pour un nombre négatif. En C++, `(-3) % 26` vaut `-3` : on écrit `((x % 26) + 26) % 26`.

L'erreur classique est de faire avancer la position dans la clé avec l'indice du caractère dans le message : les espaces décalent alors toute la suite.
