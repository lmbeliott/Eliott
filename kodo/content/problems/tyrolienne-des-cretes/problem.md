---
id: tyrolienne-des-cretes
title: La tyrolienne des crêtes
chapter: n3-complexite
order: 3
tags: [sommes-préfixes, dictionnaires]
samples: 2
---

## Énoncé
Le sentier des crêtes est décrit pas à pas par une suite de N lettres : `M` quand le sentier monte d'un mètre, `D` quand il descend d'un mètre, `P` quand il reste plat. Des bornes sont plantées tout le long : la borne 0 au départ, puis la borne i juste après le i-ème pas. Il y a donc N + 1 bornes, numérotées de 0 à N.

Sofia, la guide, veut installer une tyrolienne : un câble qui part d'une borne i et arrive à une borne j plus loin sur le sentier (i < j), en descendant d'exactement K mètres. Autrement dit, l'altitude de la borne i doit dépasser de K mètres celle de la borne j.

Écris un programme qui compte le nombre de paires de bornes (i, j) possibles.

## Entrée
- La première ligne contient deux entiers N et K.
- La deuxième ligne contient N lettres collées, chacune `M`, `D` ou `P`.

## Sortie
Un seul entier : le nombre de paires (i, j) avec 0 ≤ i < j ≤ N telles que l'altitude de la borne i moins l'altitude de la borne j vaut exactement K.

## Contraintes
- 1 ≤ N ≤ 100 000
- 1 ≤ K ≤ N

## Indices
1. Calcule d'abord l'altitude de chaque borne, en partant de `0` pour la borne 0. Tester toutes les paires de bornes demanderait environ 5 milliards de comparaisons : il faut mieux.
2. Parcours les bornes dans l'ordre. Pour une borne j d'altitude h, les départs possibles sont les bornes déjà vues d'altitude h + K. Il suffit donc de savoir combien de bornes déjà vues ont chaque altitude.
3. Garde un dictionnaire `vues` : `vues[h]` = nombre de bornes déjà rencontrées à l'altitude h. Pour chaque borne j, ajoute `vues[h + K]` au total, puis augmente `vues[h]` de 1. Attention, la réponse peut être très grande.

## Solution
**L'idée : altitudes cumulées et comptage.** L'altitude de la borne i est une somme préfixe : le nombre de `M` moins le nombre de `D` parmi les i premiers pas. On veut compter les paires i < j avec `altitude[i] = altitude[j] + K`.

On parcourt les bornes de 0 à N en tenant à jour un dictionnaire `vues`, où `vues[h]` est le nombre de bornes déjà parcourues qui sont à l'altitude h. Arrivé à la borne j, d'altitude h, les bornes de départ possibles sont exactement les bornes précédentes d'altitude h + K : on ajoute `vues[h + K]` à la réponse. Ensuite seulement, on ajoute la borne j au dictionnaire. Cet ordre garantit qu'on ne compte que des paires avec i < j, et chacune une seule fois.

Sur l'exemple `MDDPMD` avec K = 1, les altitudes des bornes 0 à 6 sont `0 1 0 -1 -1 0 -1`. La borne 6 (altitude −1) peut recevoir un câble depuis les bornes 0, 2 et 5 (altitude 0), ce qui fait 3 paires ; au total on en trouve 9.

**Complexité.** Une seule boucle de N + 1 tours, avec des opérations en temps constant sur le dictionnaire : O(N).

**Pourquoi la solution naïve est trop lente.** Tester toutes les paires de bornes fait environ N²/2 = 5 × 10⁹ comparaisons pour N = 100 000 : des heures en Python, plusieurs secondes même en C++.

**Pièges.**
- La réponse peut dépasser 2³¹ (par exemple 45 000 bornes à l'altitude 0 suivies de 55 000 bornes à l'altitude −K donnent près de 2,5 milliards de paires) : utilise un `long long` en C++.
- Les altitudes peuvent être négatives. Un dictionnaire n'a pas de problème avec ça ; en C++, on peut aussi utiliser un tableau de taille 2N + 1 en décalant les indices de N.
- La borne 0 compte aussi : n'oublie pas de l'ajouter au dictionnaire avant le premier pas.
