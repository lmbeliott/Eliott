---
id: decaler-lettres-et-chiffres
title: Décaler lettres et chiffres
chapter: p3-chaines-avancees
order: 1
tags: [chaînes, mathématiques]
samples: 2
---

## Énoncé
Un texte est chiffré en décalant chacun de ses caractères de `K` crans :
- une lettre minuscule est remplacée par la lettre minuscule située `K` places plus loin dans l'alphabet, en revenant à `a` après `z` ;
- une lettre majuscule, de même, reste majuscule ;
- un chiffre est remplacé par le chiffre situé `K` places plus loin, en revenant à `0` après `9` ;
- les autres caractères (espaces, ponctuation) ne changent pas.

Si `K` est négatif, on recule de `−K` places : avec `K = −1`, `a` devient `z` et `0` devient `9`. Afficher le texte chiffré.

## Entrée
- La première ligne contient l'entier `K`.
- La deuxième ligne contient le texte.

## Sortie
Le texte chiffré, sur une ligne.

## Contraintes
- −10⁹ ≤ K ≤ 10⁹
- Le texte contient entre 1 et 100 000 caractères : lettres, chiffres, espaces et signes `.,;:!?'()-`. Il ne commence ni ne finit par une espace et ne contient jamais deux espaces de suite.

## Indices
1. Décaler de 26 crans ne change aucune lettre, et décaler de 10 crans ne change aucun chiffre. Répéter `K` fois un décalage d'un cran serait beaucoup trop long pour `K = 10⁹`.
2. Pour une minuscule `c`, on calcule son rang `r = ord(c) − ord("a")`, puis le nouveau rang `(r + K) mod 26`, puis la lettre de ce rang.
3. En C++, `%` peut donner un résultat négatif quand `K < 0` : on se ramène d'abord à un décalage entre 0 et 25 avec `((K % 26) + 26) % 26`.

## Solution
Le décalage d'une lettre ne dépend que du reste de `K` modulo 26 : 26 crans font exactement un tour d'alphabet. On calcule donc une fois pour toutes `k26 = K mod 26` et `k10 = K mod 10`, deux décalages positifs, puis on traite chaque caractère :
- une minuscule de rang `r` (avec `r = ord(c) − ord("a")`) devient `chr(ord("a") + (r + k26) % 26)` ;
- une majuscule, de même avec `"A"` ;
- un chiffre, de même avec `"0"`, `k10` et 10 ;
- tout autre caractère est recopié.

En Python, `K % 26` est toujours compris entre 0 et 25, même si `K` est négatif. En C++, `-3 % 26` vaut `-3` : il faut écrire `((K % 26) + 26) % 26`. C'est le piège principal de l'exercice.

Le programme fait un nombre constant d'opérations par caractère, donc un travail proportionnel à la longueur du texte. Répéter `|K|` fois un décalage d'un cran demanderait jusqu'à 10⁹ × 100 000 opérations. On construit le résultat dans une liste de caractères qu'on recolle avec `join` à la fin (en C++, on modifie directement la `string`). Enfin, le texte contient des espaces : on le lit avec `input()` en entier, et en C++ avec `getline`, après avoir consommé la fin de la première ligne.
