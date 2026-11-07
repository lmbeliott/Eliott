---
id: compression-par-dictionnaire
title: Compression par dictionnaire
chapter: p2-synthese
order: 9
tags: [dictionnaires, chaînes, simulation]
samples: 3
---

## Énoncé
Une méthode de compression remplace un texte par une liste de codes, en construisant au fur et à mesure un dictionnaire de morceaux de texte.

Au départ, le dictionnaire contient les 26 lettres : `a` a le code 0, `b` le code 1, …, `z` le code 25. Le prochain code libre est 26. On lit le texte de gauche à droite en gardant un **morceau courant**, qui vaut d'abord la première lettre. Pour chaque lettre suivante `c` :
- si le morceau courant suivi de `c` est dans le dictionnaire, il devient le nouveau morceau courant ;
- sinon, on écrit le code du morceau courant, on ajoute au dictionnaire le morceau courant suivi de `c` avec le prochain code libre, et le morceau courant devient `c` seul.

À la fin du texte, on écrit le code du morceau courant.

Par exemple, `abababa` donne les codes `0 1 26 28` : on écrit `a` (0) et on ajoute `ab` (26), on écrit `b` (1) et on ajoute `ba` (27), on écrit `ab` (26) et on ajoute `aba` (28), et on termine en écrivant `aba` (28).

Afficher la liste des codes produits pour un texte donné.

## Entrée
Une seule ligne contenant le texte, formé de lettres minuscules.

## Sortie
Sur la première ligne, le nombre de codes. Sur la deuxième ligne, les codes dans l'ordre, séparés par des espaces.

## Contraintes
- Le texte a entre 1 et 50 000 lettres.

## Indices
1. Le dictionnaire de la méthode est exactement un dictionnaire Python : les clés sont des chaînes, les valeurs des entiers.
2. Remplir d'abord les 26 lettres avec une boucle et `chr(ord("a") + i)`. Garder dans une variable le prochain code libre.
3. Dérouler l'exemple `abababa` à la main et vérifier les valeurs du morceau courant après chaque lettre. Ne pas oublier le dernier code, écrit après la boucle.

## Solution
Il s'agit de **simuler** la méthode avec exactement les bonnes structures. Le dictionnaire `code` associe chaque morceau de texte connu à son code ; il est d'abord rempli avec les 26 lettres. La variable `suivant` vaut 26, et le morceau courant `mot` vaut la première lettre du texte.

Pour chaque lettre suivante `c`, on teste si `mot + c` est une clé du dictionnaire :
- si oui, `mot` devient `mot + c` : on essaie de prolonger le morceau le plus loin possible ;
- sinon, on ajoute `code[mot]` à la liste des codes, on enregistre `code[mot + c] = suivant`, on augmente `suivant`, et `mot` devient `c`.

Après la boucle, il reste un morceau courant non écrit : on ajoute son code. Il est toujours dans le dictionnaire, car il a été prolongé uniquement vers des morceaux connus.

Chaque test `mot + c in code` se fait sans parcourir le dictionnaire. Avec une liste de morceaux à la place, chaque test parcourrait des milliers de morceaux, et le programme ferait des centaines de millions de comparaisons sur un texte de 50 000 lettres.

Les pièges : oublier le dernier code ; repartir d'un morceau vide au lieu de la lettre `c` ; écrire le code de `mot + c` au lieu de celui de `mot`. Le plus sûr est de vérifier son programme sur `abababa` et sur `aaaaaaaaaa`, qui donne `0 26 27 28` (les morceaux `a`, `aa`, `aaa`, `aaaa`).
