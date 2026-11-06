---
id: code-des-guides
title: Le code des guides
chapter: n2-chaines
order: 3
tags: [chaînes, arithmétique]
samples: 2
---

## Énoncé
Les guides de Valcorde se parlent par radio, mais ils ne veulent pas que tout le monde comprenne leurs messages. Ils utilisent donc un code : chaque lettre est remplacée par la lettre qui se trouve `K` places plus loin dans l'alphabet. Après `z`, on recommence à `a`. Par exemple, avec `K = 3`, `a` devient `d`, `x` devient `a` et `col` devient `fro`. Les espaces entre les mots ne sont pas codés.

Awa vient de recevoir un message codé, et elle connaît `K`. Écris un programme qui retrouve le message d'origine.

## Entrée
- La première ligne contient l'entier `K`.
- La deuxième ligne contient le message codé : des mots en lettres minuscules sans accents, séparés par une seule espace.

## Sortie
Une seule ligne : le message décodé, avec les espaces aux mêmes places.

## Contraintes
- 0 ≤ K ≤ 25
- Le message contient entre 1 et 200 caractères.

## Indices
1. Pour décoder, il faut faire le chemin inverse : chaque lettre recule de `K` places dans l'alphabet. Attention à ce qui se passe avant `a` : en reculant de 3 places depuis `b`, on arrive à `y`.
2. Transforme chaque lettre en un numéro de 0 (`a`) à 25 (`z`). En Python : `ord(c) - ord("a")` ; en C++ : `c - 'a'`. Il est bien plus facile de calculer sur des numéros que sur des lettres.
3. Le reste de la division par 26 (`% 26`) permet de « faire le tour » de l'alphabet. Recule de `K`, prends le reste modulo 26, puis retransforme le numéro en lettre avec `chr(ord("a") + numero)` en Python ou `(char)('a' + numero)` en C++. En C++, ajoute 26 avant le `%` pour ne pas obtenir un nombre négatif.

## Solution
On parcourt le message caractère par caractère et on construit le message décodé :
- une espace est recopiée telle quelle ;
- une lettre est transformée en son numéro dans l'alphabet (de 0 à 25), on lui retire `K`, on prend le reste modulo 26 pour revenir entre 0 et 25, puis on retransforme ce numéro en lettre.

Le modulo est ce qui fait « boucler » l'alphabet : avec `K = 3`, la lettre `b` (numéro 1) donne 1 − 3 = −2, et −2 modulo 26 vaut 24, c'est-à-dire `y`.

Les pièges :
- en C++ (et dans beaucoup d'autres langages), `-2 % 26` vaut `-2` et non `24`. On écrit donc `(numero - K + 26) % 26` : comme `K ≤ 25`, le nombre reste positif. En Python, `%` donne toujours un résultat positif quand on divise par un nombre positif ;
- il faut **reculer** de `K` places, pas avancer : c'est le message *codé* que l'on reçoit ;
- en C++, après `cin >> k`, il reste un retour à la ligne à lire avant d'utiliser `getline` pour le message. Sinon, `getline` renvoie une ligne vide.
